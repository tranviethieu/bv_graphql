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
import { articleAttributes } from './components/ArticlesAttributes';
import { importAccountColumns } from './components/ImportAccountColumns';
import DemoFilter from '../../DemoFilter/TableFilter';
import moment from 'moment'

const showEditDialog = (data, submit, attributes) => {
  return (dispatch) => dispatch(showQuickEditDialog(
    {
      rootClass: "sm:w-full md:w-2/3",
      className: 'pb-36',
      title: data ? "Cập nhật" : "Thêm mới",
      subtitle: "Tin tức",
      attributes: attributes || articleAttributes,
      data: data,
      submit: submit

    }));
}
function convertDataToForm(data) {
  return { ...data };
}


function Articles(props) {
  const dispatch = useDispatch();
  const [data, setData] = useState({});
  const [attributes, setAttributes] = useState(articleAttributes);
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [formFiltered, setFormFiltereds] = useState([]);
  const [textFilter, setTextFilter] = useState({ id: 'title,name', value: '' });
  const [tableFiltered, setTableFiltered] = useState({ page: 0, pageSize: 10, sorted: [{ id: 'createdTime', desc: true }], filtered: [] })


  function onTextSearch(text) {
    setTextFilter({ id: 'name,title', value: text });
  }

  function refetchData() {

    console.log("==> table filtere: ", tableFiltered)
    const { page, pageSize, sorted, filtered } = tableFiltered
    let filter = [...filtered, { id: "type", value: "USER_TUTORIAL,USER_NEWS,USER_PROMOTION", operation: "in" }]
    Actions.get_articles({ page, pageSize, filtered: filter, sorted }, dispatch).then(response => {
      setData(response);
    })
  }
  useEffect(() => {
    refetchData();
  }, [formFiltered, textFilter, tableFiltered]);

  const onChangeTable = (state) => {
    let { page, pageSize, filtered } = state;
    setPageSize(pageSize)
    setTableFiltered({ ...tableFiltered, page, pageSize, filtered });
  }

  function handleSave(form) {
    let data = _.omit(form, ['createdTime', 'creator'])
    Actions.save_article(data, dispatch).then(response => {
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
      title: "Xóa Tin tức", message: `Bạn có chắc muốn xóa Tin tức ${data.title}?`, onSubmit: () => {
        Actions.remove_article(data._id, dispatch).then(response => {
          if (response.code === 0) {
            dispatch(showMessage({ message: "Xóa Tin tức thành công" }));
            refetchData();
          } else {
            dispatch(showMessage({ message: response.message }));
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
                <Typography color="textSecondary">Tin tức</Typography>
              </div>
              <FuseAnimate>
                <Typography variant="h6">{data ? data.records : 0} Tin tức</Typography>
              </FuseAnimate>
            </div>
            <DemoFilter
              // searchOption={{ onTextSearch, hideButton: true }}
              createOption={{ onClick: () => dispatch(showEditDialog(null, handleSave, attributes)) }}
            // filterOption={{
            //   attributes: attributes.filter(item => item.name === "type").map(item => ({
            //     ...item, name: item.queryName ? item.queryName : item.name
            //   })),
            //   onSubmitFilter
            // }}
            // customElements={[
            //   // <Button startIcon={<Icon>import_export</Icon>} onClick={() => {
            //   //   dispatch(showImportExcelDialog({ rootClass: 'w-full', columns: importAccountColumns, title: "Import tài khoản", subtitle: <a color="link" href="/import_accounts.xlsx">Tải file mẫu</a>, submit: handleImportAccount }))
            //   // }}>Import</Button>,
            // ]}
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
                        </Menu>
                      </React.Fragment>
                    )}
                  </PopupState>

                </div>
              },
              {
                Header: 'Tiêu đề',
                accessor: 'title',
                filterable: true,
                style: { justifyContent: "left", textAlign: "left", whiteSpace: "unset", wordBreak: "nomal", marginTop: '5px' },
              },
              {
                Header: 'Loại tin tức',
                accessor: 'type',
                style: { justifyContent: "left", textAlign: "left", whiteSpace: "unset", wordBreak: "nomal", marginTop: '5px' },
                maxWidth: 120,
                Cell: row => <div>
                  {
                    row.value === "ADMIN_TUTORIAL" ? "HDSD Admin"
                      : row.value === "USER_TUTORIAL" ? "HDSD Người dùng"
                        : row.value === "USER_NEWS" ? "Tin tức người dùng"
                          : row.value === "INTERNAL_NEWS" ? "Tin tức nội bộ"
                            : row.value === "USER_PROMOTION" ? "Quảng cáo người dùng"
                              : "Khác"
                  }
                </div>,
              },
              {
                Header: 'Ngày tạo',
                accessor: 'createdTime',
                Cell: row => <div>
                  {moment(row.value).format("DD/MM/YYYY")}
                </div>,
                maxWidth: 120
              },
              {
                Header: 'Người tạo',
                accessor: 'creator.fullName',
                Cell: row => <div>
                  {row.value}
                </div>,
                maxWidth: 120
              },
              {
                Header: 'Trạng thái',
                accessor: 'active',
                Cell: row => <div>
                  {row.value === true ? "Hoạt động" : "Không hoạt động"}
                </div>,
                maxWidth: 120
              },
            ]}
          />
        }
      />
    </div>
  );
}

export default Articles;
