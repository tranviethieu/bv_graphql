import React, { useState } from 'react';
import { FusePageCarded } from '@fuse';
import { Icon, Typography, IconButton, Tooltip } from '@material-ui/core';
import { FuseAnimate } from '@fuse';
import { useDispatch } from 'react-redux';
import * as Actions from './store/action';
import ReactTable from 'react-table';
import moment from 'moment'; import { showUserDialog } from '../shared-dialogs/actions'
import history from '@history';

function CustomerApp(props) {
    const dispatch = useDispatch();
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(0)
    const [pageSize, setPageSize] = useState(10)

    function fetchData(state) {
        const { page, pageSize, filtered, sorted } = state;
        setPageSize(pageSize)
        const convertFiltered = filtered.map(f => ({ id: f.id, value: f.value.value, operation: f.value.operation}))
        Actions.getUsers({ page, pageSize, filtered: convertFiltered, sorted }, dispatch).then(response => {
            setUsers(response);
        })
    }
    function handleShowUserDialog(phoneNumber) {
        dispatch(showUserDialog({ rootClass: "el-coverFUD", phoneNumber: phoneNumber }))
    }

    return (
        <div>
          <FusePageCarded
            classes={{
              content: "flex",
              header: "min-h-72 h-72 sm:h-136 sm:min-h-136"
            }}
            header={
              <div className="flex flex-1 w-full items-center justify-between el-HeaderPage">

                <div className="flex items-center">
                  <FuseAnimate animation="transition.expandIn" delay={300}>
                    <Icon className="text-32 mr-0 sm:mr-12">supervised_user_circle</Icon>
                  </FuseAnimate>
                  <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                    <Typography className="hidden sm:flex" variant="h6">Danh sách khách hàng ({users.records? users.records : 0})</Typography>
                  </FuseAnimate>
                </div>
              </div>
            }
            content={
              <ReactTable
                manual
                className="-striped -highlight h-full w-full sm:rounded-8 el-CustomerAppTable"
                data={users.data}
                pages={users.pages}
                defaultPageSize={10}
                filterable={true}
                sortable={false}
                onPageChange={setPage}
                noDataText="Không có dữ liệu nào"
                onFetchData={fetchData}
                style={{ fontSize: "15px", }}
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
                    Header: 'Họ tên',
                    accessor: 'fullName',
                    className: "wordwrap",
                    style: { justifyContent: "left", textAlign: "left", whiteSpace: "unset", wordBreak: "nomal" },
                    Cell: row =>
                    <span style={{ marginLeft: "10px", marginRight: "10px", textDecoration: "underline", textDecorationColor: "#C6C6C6", cursor: "pointer", }}
                      onClick={e => handleShowUserDialog(row.original.phoneNumber)}
                    >
                      {row.value}
                    </span>
                  },
                  {
                    Header: 'Số điện thoại',
                    accessor: 'phoneNumber',
                    width: 140,
                    style: { justifyContent: "left", textAlign: "left", whiteSpace: "unset", wordBreak: "nomal" },
                    Cell: row =>
                    <span style={{ marginLeft: "10px", marginRight: "10px", textDecoration: "underline", textDecorationColor: "#C6C6C6", cursor: "pointer", }}
                      onClick={e => handleShowUserDialog(row.original.phoneNumber)}
                    >
                      {row.value}
                    </span>
                  },
                  {
                    Header: 'Email',
                    accessor: 'email',
                    width: 260,
                    style: { justifyContent: "left", textAlign: "left", whiteSpace: "unset", wordBreak: "nomal" },
                    Cell: row =>
                    <span style={{ marginLeft: "10px", marginRight: "10px", textDecoration: "underline", textDecorationColor: "#C6C6C6", cursor: "pointer", }}
                      onClick={e => handleShowUserDialog(row.original.phoneNumber)}
                    >
                      {row.value}
                    </span>
                  },
                  {
                    Header: 'Ngày sinh',
                    accessor: 'birthDay',
                    width: 120,
                    filterable: false,
                    Cell: row => <div>{moment(row.value).format("DD/MM/YYYY")}</div>
                  },
                  {
                    Header: 'Giới tính',
                    accessor: 'gender',
                    filterable: false,
                    width: 120,
                    Cell: row =>
                    <span style={{ marginLeft: "10px", marginRight: "10px", cursor: "pointer", }}
                      onClick={e => handleShowUserDialog(row.original.phoneNumber)}
                    >
                      {row.value ? row.value === "1" ? "Nam" : "Nữ" : "Chưa xác định"}
                    </span>
                  },
                  {
                    Header: "Địa chỉ",
                    filterable: false,
                    accessor: "address",
                    style: { justifyContent: "left", textAlign: "left", whiteSpace: "unset", wordBreak: "nomal" },
                    Cell: row =>
                    <span style={{ marginLeft: "10px", marginRight: "10px", textDecoration: "underline", textDecorationColor: "#C6C6C6", cursor: "pointer", }}
                      onClick={e => handleShowUserDialog(row.original.phoneNumber)}
                    >
                      {row.value}
                    </span>
                  },
                  {
                    Header: "Tác vụ",
                    accessor: "_id",
                    filterable: false,
                    width: 120,
                    Cell: row => <div>
                      <Tooltip title="Xem thông tin khách hàng" placement="left">
                        <IconButton title="Xem thông tin khách hàng"
                          onClick={e => handleShowUserDialog(row.original.phoneNumber)}
                          // onClick={e => history.push(`/apps/users/${row.value}`)}
                        >
                          <Icon>
                            pageview
                          </Icon>
                        </IconButton>
                      </Tooltip>
                    </div>
                  }
                ]}
              />
            }
          />
        </div>
    );
}

export default CustomerApp;
