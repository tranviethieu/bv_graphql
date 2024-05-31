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
import { medicalServicesAttributes } from './components/MedicalServicesAttributes';
import {importAccountColumns} from './components/ImportAccountColumns';
import DemoFilter from '../../DemoFilter/TableFilter';

const showEditDialog = (data, submit, attributes) => {
    return (dispatch) => dispatch(showQuickEditDialog(
        {
            rootClass: "sm:w-full md:w-2/3",
            className: 'pb-36',
            title: data ? "Cập nhật" : "Thêm mới",
            subtitle: "Dịch vụ",
            attributes: attributes || medicalServicesAttributes,
            data: data,
            submit: submit

        }));
}
function convertDataToForm(data) {
    return { ...data };
}


function MedicalServices(props) {
    const dispatch = useDispatch();
    const [data, setData] = useState({});
    const [attributes, setAttributes] = useState(medicalServicesAttributes);
    const [page, setPage] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const [formFiltered, setFormFiltereds] = useState([]);
    const [categories, setCategories] = useState([])
    const [textFilter, setTextFilter] = useState({ id: 'code, name', value: '' });
    const [tableFiltered, setTableFiltered] = useState({ page: 0, pageSize: 10, sorted: [{ id: 'createdTime', desc: true }] })


    function onTextSearch(text) {
        setTextFilter({ id: 'code,name', value: text });
    }

    function refetchData() {
        const merged = { ...tableFiltered, filtered: [...formFiltered, textFilter] }
        Actions.get_medical_services(merged, dispatch).then(response => {
            setData(response);
        })
    }
    useEffect(() => {
        Actions.get_categories(dispatch).then(response => {
            setCategories(response.data.map(g => ({
                value: g.code, label: g.name
            })))
        })
    }, []);
    useEffect(() => {
        refetchData();
    }, [formFiltered, textFilter, tableFiltered]);

    const onChangeTable = (state) => {
      let { page, pageSize, filtered } = state;
      setPageSize(pageSize)
      setTableFiltered({ ...tableFiltered, page, pageSize, filtered });
    }

    function handleSave(form) {
        Actions.save_medical_service(form, dispatch).then(response => {
            if (response.code === 0) {
                dispatch(showMessage({ message: "Cập nhật thành công" }));
                refetchData();
            } else {
                dispatch(showMessage({ message: response.message }))
            }
        })
    }
    useEffect(() => {
        const groupAtt = medicalServicesAttributes.find(a => a.name === "categoryCode");
        groupAtt.options = categories;
        setAttributes(medicalServicesAttributes);
    }, [categories]);
    function handleDelete(data) {
        dispatch(showConfirmDialog({
            title: "Xóa Dịch vụ", message: `Bạn có chắc muốn xóa Dịch vụ ${data.name}?`, onSubmit: () => {
                Actions.remove_medical_service(data._id, dispatch).then(response => {
                    if (response.code === 0) {
                        dispatch(showMessage({ message: "Xóa Dịch vụ thành công" }));
                        refetchData();
                    } else {
                        dispatch(showMessage({ message: response.message}));
                    }
                })
            }
        }))
    }
    function onSubmitFilter(filtered) {

        const keys = Object.keys(filtered);
        //convert object to array here
        setFormFiltereds(keys.map(id => ({
            id,
            value: filtered[id].toString(),
            // operation: "in"
        })))

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
        console.log("submitdata:", submitData);
        Actions.import_accounts(submitData, dispatch).then(response => {
            if (response.code === 0) {
                dispatch(showConfirmDialog({ title: "Import tài khoản", message: "Cập nhật danh sách tài khoản thành công" }));
                refetchData();
            }
        })
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
                    <Typography color="textSecondary">Dịch vụ</Typography>
                  </div>
                  <FuseAnimate>
                    <Typography variant="h6">{data.records} Dịch vụ</Typography>
                  </FuseAnimate>
                </div>
                <DemoFilter
                  searchOption={{ onTextSearch, hideButton: true }}
                  filterOption={{
                    attributes: attributes.filter(item => item.name === "categoryCode").map(item => ({
                      ...item, name: item.queryName ? item.queryName : item.name
                    })),
                    onSubmitFilter
                  }}
                  createOption={{ onClick: () => dispatch(showEditDialog(null, handleSave, attributes)) }}
                  customElements={[
                    // <Button startIcon={<Icon>import_export</Icon>} onClick={() => {
                    //   dispatch(showImportExcelDialog({ rootClass: 'w-full', columns: importAccountColumns, title: "Import tài khoản", subtitle: <a color="link" href="/import_accounts.xlsx">Tải file mẫu</a>, submit: handleImportAccount }))
                    // }}>Import</Button>,
                    // <Button startIcon={<Icon>assignment</Icon>} variant="contained">Export</Button>
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
                noDataText= "Không có dữ liệu nào"
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
                            </Menu>
                          </React.Fragment>
                        )}
                      </PopupState>

                    </div>
                  },
                  {
                    Header: 'Mã Dịch vụ',
                    accessor: 'code',
                    className: "wordwrap",
                    width: 120,
                  },
                  {
                    Header: 'Tên Dịch vụ',
                    accessor: 'name',
                    className: "wordwrap",
                    maxWidth: 200
                  },
                  {
                    Header: 'Loại Dịch vụ',
                    accessor: 'category.name',
                    className: "wordwrap",
                    maxWidth: 200
                  },
                  {
                    Header: 'Mã BV',
                    accessor: 'viewCode',
                    className: "wordwrap",
                    maxWidth: 200
                  },
                  {
                    Header: 'Thông tin',
                    accessor: 'info',
                    className: "wordwrap",
                    maxWidth: 200
                  },
                  {
                    Header: 'ĐVT',
                    accessor: 'unit',
                    className: "wordwrap",
                    maxWidth: 200
                  },
                  {
                    Header: 'Giá BHYT',
                    accessor: 'priceOfInsurance',
                    className: "wordwrap",
                    maxWidth: 200,
                    Cell: row => <div>{(Math.round(row.value * 100) / 100).toFixed(2)}</div>
                  },
                  {
                    Header: 'Giá VP',
                    accessor: 'price',
                    className: "wordwrap",
                    maxWidth: 200,
                    Cell: row => <div>{(Math.round(row.value * 100) / 100).toFixed(2)}</div>
                  },
                  {
                    Header: 'Giá DV',
                    accessor: 'priceOfSelfService',
                    className: "wordwrap",
                    maxWidth: 200,
                    Cell: row => <div>{(Math.round(row.value * 100) / 100).toFixed(2)}</div>
                  },
                ]}
              />
            }
          />
        </div>
    );
}

export default MedicalServices;
