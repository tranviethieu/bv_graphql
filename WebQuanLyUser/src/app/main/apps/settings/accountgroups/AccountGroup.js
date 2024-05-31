import React, { useState, useEffect } from 'react';
import { FusePageCarded } from '@fuse';
import { useDispatch } from 'react-redux';
import { Icon, Typography, IconButton, Menu,MenuItem,Button } from '@material-ui/core';
import { FuseAnimate } from '@fuse';
import * as Actions from './actions';
import ReactTable from 'react-table';
import history from '@history';
import { MoreVert } from '@material-ui/icons';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
function AccountGroup(props) {
    const dispatch = useDispatch();
    const [data, setData] = useState({});
    useEffect(() => {
        Actions.allGroup(dispatch).then(response => {
            setData(response);
        })
    }, []);
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
                    <Typography color="textSecondary">Nhóm tài khoản</Typography>
                  </div>
                  <FuseAnimate>
                    <Typography variant="h6">{data && data.data ? data.data.length : 0} nhóm tài khoản</Typography>
                            </FuseAnimate>
                        </div>
                        <FuseAnimate animation="transition.slideRightIn" delay={300}>
                            <Button onClick={() => history.push("/apps/account-group/edit")} className="whitespace-no-wrap btn-blue" variant="contained">
                                <span className="hidden sm:flex">Tạo nhóm tài khoản</span>
                            </Button>
                        </FuseAnimate>
                    </div>
                }
                content={
                    <ReactTable
                        className="-striped -highlight h-full w-full sm:rounded-8 el-AccountGroupTable"
                        data={data.data}
                        showPagination={false}
                        noDataText="Chưa có dữ liệu"
                        pageSize={(data.data && data.data.length) || 5}
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
                                    {row.index + 1}
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
                                                    <MenuItem onClick={() => { popupState.close(); history.push(`/apps/account-group/edit/${row.value}`)}}>Sửa</MenuItem>
                                                </Menu>
                                            </React.Fragment>
                                        )}
                                    </PopupState>

                                </div>
                            },
                            {
                                Header: 'Tên nhóm',
                                accessor: 'name',
                                className: "wordwrap",
                            },
                            {
                                Header: 'Mô tả',
                                accessor: 'description',
                                className: "wordwrap",
                            },
                            {
                                Header: "Apis",
                                filterable: false,
                                accessor: "permissions",
                                style: { justifyContent: "left", textAlign: "left", whiteSpace: "unset", wordBreak: "nomal" },
                                Cell: row => <div>{row.value.length}</div>
                            }
                        ]}
                    />
                }
            />
        </div>
    );
}

export default AccountGroup;
