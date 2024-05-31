import React, { useState, useEffect } from 'react';
import { FusePageCarded } from '@fuse';
import { useDispatch } from 'react-redux';
import { Icon, Typography, IconButton, Menu, MenuItem, Button } from '@material-ui/core';
import { showMessage } from 'app/store/actions';
import { FuseAnimate } from '@fuse';
import * as Actions from './actions';
import ReactTable from 'react-table';
import history from '@history';
import _ from 'lodash';
import { MoreVert } from '@material-ui/icons';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import { showQuickEditDialog, showQuickTableDialog, showConfirmDialog, showImportExcelDialog } from '../../shared-dialogs/actions';
import { accountAttributes } from './components/AccountAttributes';
import { importAccountColumns, exportAccountColumns } from './components/ImportAccountColumns';
import DemoFilter from '../../DemoFilter/TableFilter';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { DownloadExcelMultiSheet } from '../../shared-components/DownloadExcel';
import moment from 'moment';

const showEditDialog = (data, submit, attributes) => {
    return (dispatch) => dispatch(showQuickEditDialog(
        {
            rootClass: "sm:w-full md:w-2/3",
            className: 'pb-36',
            title: data ? "Cập nhật" : "Thêm mới",
            subtitle: "Tài khoản",
            attributes: attributes || accountAttributes,
            data: data,
            submit: submit

        }));
}
function convertDataToForm(data) {
    const { departmentId, userName, fullName, code, work,birthday } = data.base;
    var form = { ...data, departmentId, userName, fullName, code, work,birthday, organizationIds: data.organizations && data.organizations.map(o => o._id) };
    console.log("edit form=", form);
    return form;
}

function Accounts(props) {
    const dispatch = useDispatch();
    const [data, setData] = useState({});
    const [attributes, setAttributes] = useState(accountAttributes);
    const [bases, setBases] = useState([]);
    const [page, setPage] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const [organizations, setOrganizations] = useState([]);
    const [groups, setGroups] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [formFiltered, setFormFiltereds] = useState([]);
    const [textFilter, setTextFilter] = useState({ id: 'base.userName,base.fullName,base.email,base.phoneNumber,base.code', value: '' });
    const [tableFiltered, setTableFiltered] = useState({ page: 0, pageSize: 10, sorted: [{ id: 'createdTime', desc: true }] })
    const [ringGroups, setRingGroups] = useState([]);

    function onTextSearch(text) {
        setTextFilter({ id: 'base.userName,base.fullName,base.email,base.phoneNumber,base.code', value: text });
    }
    function convertFormToData(form) {
        if (form.organizationIds && form.organizationIds.length > 0) {
            form.organizations = organizations.filter(o => form.organizationIds.includes(o._id));
        }
        const { departmentId, userName, fullName, code, work ,birthday} = form;
        form.base = { ...form.base, departmentId, userName, fullName, code, work,birthday:moment(birthday).format("YYYY-MM-DD") };
        return _.omit(form, ['groupPermissions', 'department', 'organizationIds', 'departmentId', 'userName', 'fullName', 'code', 'work','birthday']);
    }

    function onSubmitFilter(filtered) {
        const keys = Object.keys(filtered);
        //convert object to array here
        setFormFiltereds(keys.map(id => ({
            id,
            value: filtered[id].toString(),
            operation: "in"
        })))
    }

    function refetchData() {
        const merged = { ...tableFiltered, filtered: [...formFiltered, textFilter] }
        Actions.get_accounts(merged, dispatch).then(response => {
            setData(response);
        })
    }
    useEffect(() => {
        refetchData();
    }, [formFiltered, textFilter, tableFiltered]);

    useEffect(() => {
        Actions.get_organizations(dispatch).then(response => {
            setOrganizations(response.data)
        });
        Actions.get_root_department(dispatch).then(response => {
            setDepartments(response.data);
        })
        Actions.get_groups(dispatch).then(response => {
            setGroups(response.data.map(g => ({
                value: g._id, label: g.name
            })))
        })
        Actions.get_root_accounts(dispatch).then(response => {
            setBases(response.data.map(b => ({
                value: b._id, label: `${b.code ? b.code + " - " : ""}${b.title ? b.title + " - " : ""}${b.fullName} / ${b.userName}`,...b
            })))
        })
        Actions.get_ring_groups(dispatch).then(response => {
            setRingGroups(response.data);
        })
    }, []);

    const onChangeTable = (state) => {
        let { page, pageSize, filtered } = state;
        setPageSize(pageSize)
        setTableFiltered({ ...tableFiltered, page, pageSize, filtered });
    }
    useEffect(() => {
        const orgnizationAtt = accountAttributes.find(a => a.name == "organizationIds");
        orgnizationAtt.options = organizations.map(o => ({ value: o._id, label: o.name }));
        const baseAtt = accountAttributes.find(a => a.name == "_id");
        baseAtt.options = bases;
        const groupAtt = accountAttributes.find(a => a.name == "accountGroupIds");
        groupAtt.options = groups;
        setAttributes(accountAttributes);
        const departmentAtt = accountAttributes.find(a => a.name == "departmentId");
        departmentAtt.options = departments.map(d => ({
            value: d._id, label: `${d.name} - ${d.code}`
        }))
        const sipPhonesAtt = accountAttributes.find(a => a.name == "sipPhones");
        sipPhonesAtt.options = ringGroups.map(r => ({
            value: r.phoneCode, label: r.name
        }))
    }, [groups, bases, organizations, departments, ringGroups]);

    function handleSave(form) {
        const submitData = convertFormToData(form);
        Actions.save_account(submitData, dispatch).then(response => {
            if (response.code === 0) {
                dispatch(showMessage({ message: "Cập nhật thành công" }));
                refetchData();
            } else {
                dispatch(showMessage({ message: response.message }))
            }
        })
    }
    function handleDelete(data) {
        dispatch(showConfirmDialog({
            title: "Xóa tài khoản", message: `Bạn có chắc muốn xóa quyền truy cập của tài khoản ${data.base.userName}?`, onSubmit: () => {
                Actions.remove_account(data._id, dispatch).then(response => {
                    if (response.code == 0) {
                        dispatch(showMessage({ message: "Xóa tài khoản thành công" }));
                        refetchData();
                    } else {
                        dispatch(showMessage({ message: response.message }));
                    }
                })
            }
        }))
    }

    function handleImportAccount(data) {
        const submitData = [];
        data.forEach(function (item) {
            if (item["userName"]) {
                const base = _.omit(item, 'sipPhone', 'sipPhones', 'sipPassword');
                const { sipPhone, sipPhones, sipPassword } = item;
                const submitItem = { sipPhone, sipPhones, sipPassword, base };
                submitData.push(submitItem);
            }
        });
        // console.log("submitdata:", submitData);
        Actions.import_accounts(submitData, dispatch).then(response => {
            if (response.code === 0) {
                dispatch(showConfirmDialog({ title: "Import tài khoản", message: "Cập nhật danh sách tài khoản thành công" }));
                refetchData();
            }
        })
    }


    function AccountDataSheet() {
        const exportData = data.data && data.data.map(item => ({
            ...item, ...item.base
        }));
        const dataSheets = [
            {
                xSteps: 1,
                columns: [{ title: "Danh sách tài khoản MECARE" }]
            },
            {
                ySteps: 1,
                data: exportData,
                columns: exportAccountColumns
            },
        ];
        return dataSheets;
    }

    return (
        <div>
          <FusePageCarded
            classes={{
              content: "flex",
              header: "min-h-72 h-72 sm:h-136 sm:min-h-136"
            }}
            header={
              <div className="flex flex-1 w-full items-center justify-between el-HeaderPageCustom">
                <div className="flex flex-col">
                  <div className="flex items-center mb-4">
                    <Icon className="text-18" color="action">home</Icon>
                    <Icon className="text-16" color="action">chevron_right</Icon>
                    <Typography color="textSecondary">Thiết lập</Typography>
                    <Icon className="text-16" color="action">chevron_right</Icon>
                    <Typography color="textSecondary">Tài khoản</Typography>
                  </div>
                  <FuseAnimate>
                    <Typography variant="h6">{data.records} Tài khoản</Typography>
                  </FuseAnimate>
                </div>
                <DemoFilter
                  searchOption={{ onTextSearch, hideButton: true }}
                  filterOption={{
                    attributes: attributes.filter(item => item.name === "organizationIds" || item.name === "accountGroupIds").map(item => ({
                      ...item, name: item.queryName ? item.queryName : item.name
                    })),
                    onSubmitFilter
                  }}
                  createOption={{ onClick: () => dispatch(showEditDialog(null, handleSave, attributes)) }}
                  customElements={[
                    <Button startIcon={<Icon>import_export</Icon>} onClick={() => {
                      dispatch(showImportExcelDialog({ rootClass: 'w-full', columns: importAccountColumns, title: "Import tài khoản", subtitle: <a color="link" href="/import_accounts.xlsx">Tải file mẫu</a>, submit: handleImportAccount }))
                    }}>Import</Button>,
                    // <Button onClick={exportToCSV} startIcon={<Icon>assignment</Icon>} variant="contained">Export</Button>
                    <DownloadExcelMultiSheet
                      name="Export Account"
                      dataSheets={AccountDataSheet()}
                      element={<Button variant="contained">Export</Button>}
                    />
                  ]}
                />
                    </div>
                }
                content={
                    <ReactTable
                        manual
                        className="-striped -highlight h-full w-full sm:rounded-8 el-AccountsTable"
                        data={data.data}
                        pages={data.pages}
                        defaultPageSize={10}
                        noDataText="Không có dữ liệu nào"
                        onFetchData={onChangeTable}
                        onPageChange={setPage}
                        style={{ fontSize: "12px", }}
                        getTdProps={() => ({
                            style: { border: `none` },
                        })}
                        columns={[
                            {
                                Header: "#",
                                width: 50,
                                filterable: false,
                                Cell: row => <div>
                                    {row.index + 1 + (page * pageSize)}
                                </div>
                            },
                            {
                                width: 30,
                                accessor: '_id',
                                Cell: row => <div>

                                    <PopupState variant="popover" popupId="demo-popup-menu">
                                        {(popupState) => (
                                            <React.Fragment>
                                                <MoreVert {...bindTrigger(popupState)} />
                                                <Menu {...bindMenu(popupState)}>
                                                    <MenuItem onClick={() => { popupState.close(); dispatch(showEditDialog(convertDataToForm(row.original), handleSave, attributes)) }}>Sửa</MenuItem>
                                                    <MenuItem onClick={() => { popupState.close(); handleDelete(row.original); }}>Xóa</MenuItem>
                                                    <MenuItem onClick={() => { popupState.close(); }}>Xem sơ đồ cây chức năng</MenuItem>
                                                </Menu>
                                            </React.Fragment>
                                        )}
                                    </PopupState>

                                </div>
                            },
                            {
                                Header: 'Mã NV',
                                accessor: 'base.code',
                                className: "wordwrap",
                                width: 90
                            },
                            {
                                Header: 'Tên đăng nhập',
                                accessor: 'base.userName',
                                className: "wordwrap",
                                width: 120,
                            },
                            {
                                Header: 'Họ và Tên',
                                accessor: 'base.fullName',
                                className: "wordwrap",
                                maxWidth: 200
                            },
                            {
                                Header: 'Chức danh CV',
                                accessor: 'base.work',
                                className: "wordwrap",
                            },
                            {
                                Header: 'Số điện thoại',
                                accessor: 'base.phoneNumber',
                                className: "wordwrap",
                                width: 120
                            },

                            {
                                Header: 'Phòng ban/đơn vị',
                                accessor: 'base.departmentName',
                                className: "wordwrap",
                                style: { justifyContent: "left", textAlign: "left", whiteSpace: "unset", wordBreak: "nomal" },
                            },
                            {
                                Header: 'Tham gia tổ chức',
                                accessor: 'organizations',
                                className: "wordwrap",
                                style: { justifyContent: "left", textAlign: "left", whiteSpace: "unset", wordBreak: "nomal" },
                                Cell: row => <div className="flex pr-8">
                                    {row.value && row.value.map((item, index) => <Typography className="text-12" key={index}>{item.name}</Typography>)}
                                </div>
                            },
                            {
                                Header: 'Nhóm tài khoản',
                                accessor: 'groupPermissions',
                                className: "wordwrap",
                                Cell: row => <div className="py-4">
                                    {
                                        row.value.map(g => <PopupState variant="popover" popupId="demo-popup-menu">
                                            {(popupState) => (
                                                <React.Fragment>
                                                    <Button {...bindTrigger(popupState)} >{g.name}</Button>
                                                    <Menu {...bindMenu(popupState)}>
                                                        <MenuItem onClick={() => { popupState.close(); history.push(`/apps/account-group/edit/${g._id}`) }}>Xem chi tiết</MenuItem>
                                                        <MenuItem onClick={() => { popupState.close(); history.push(`/apps/menu/group-graph/${g._id}`) }}>Xem sơ đồ cây chức năng</MenuItem>
                                                    </Menu>
                                                </React.Fragment>
                                            )}
                                        </PopupState>)
                                    }
                                </div>
                            },
                            {
                                Header: 'Số máy nhánh',
                                accessor: 'sipPhone',
                                className: "wordwrap",
                                width: 100
                            },
                        ]}
                    />
                }
            />
        </div>
    );
}

export default Accounts;
