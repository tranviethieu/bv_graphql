import Page from 'components/Page';
import React, { useEffect, useState, useRef } from 'react';
import { Card, Input, Label, CardHeader, CardBody } from 'reactstrap';
import { withApollo, Mutation } from 'react-apollo'
import { Button, Menu, MenuItem, ButtonGroup, Icon, IconButton, Checkbox } from '@material-ui/core';
import { ArrowDropDown, ArrowDropUp } from '@material-ui/icons';
import { MdEdit, MdAddCircle, MdDelete, MdFileDownload, MdFileUpload } from 'react-icons/lib/md';
import authCheck from 'utils/authCheck';
import ReactTable from "react-table";
import Moment from 'moment'
import confirm from 'components/Confirmation';
import showExport from './ExportModal';
import showImport from './ImportModal';
import { QUERY_ACCOUNTS, QUERY_DEPARTMENTS } from './query';
import Avatar from 'react-avatar';


function AccountPage(props) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [departments, setDepartments] = useState([]);
    const [data, setData] = useState({ data: [], records: 0, pages: 1 });
    const [filterState, setFilterState] = useState({ filtered: [], page: 0, pageSize: 20 });
    const [loading, setLoading] = useState(false);

    function fetchDepartment() {
        props.client.query({
            query: QUERY_DEPARTMENTS
        }).then(result => {
            if (authCheck(result.data.response)) {
                setDepartments(result.data.response.data.map((item) => {
                    return {
                        value: item._id,
                        label: item.name
                    }
                })
                )
            }
        })
    }

    function fetchData() {

        setLoading(true);
        console.log("filterState:", filterState);
        props.client.query({
            query: QUERY_ACCOUNTS,
            variables: filterState,
        }).then(result => {
            if (authCheck(result)) {
                setData(result.data.response);
            }
        })

        setLoading(false);
    }
    useEffect(() => {
        fetchDepartment();
    }, []);
    useEffect(() => {
        fetchData();
    }, [filterState, props]);

    const onDelete = (row, mutation) => {
        confirm(`Bạn có chắc chắn muốn xóa tài khoản '${row.userName}'?`, { title: "Xóa bản ghi" }).then(
            (result) => {
                mutation();
            },
            (result) => {
                // `cancel` callback

            }
        )
    }

    const onChangeTable = (state) => {
        let { page, pageSize, filtered } = state;
        filtered = filtered.map(f => ({
            id: f.id, value: f.value
        }))
        setFilterState({ ...filterState, page, pageSize, filtered });
    }
    const toggleDownloadAction = event => {
        setAnchorEl(event.currentTarget);
    };
    function handleCloseDownloadAction() {
        setAnchorEl(null);
    }

    return (
        <Page title="Quản lý tài khoản"
            breadcrumbs={[{ name: 'Quản lý tài khoản', active: true }]}
            className="CustomerPage">

            <ButtonGroup className='btn-fixed-right-bottom'>
                <Button variant='contained' className="btn-green" onClick={e => { props.history.push("/account-edit") }}><MdAddCircle /> THÊM TÀI KHOẢN</Button>{" "}
                <Button style={{ fontSize: 24 }} variant='contained' color="primary" onClick={toggleDownloadAction}><MdFileDownload /></Button>{" "}
                <Button style={{ fontSize: 24 }} variant='contained' color="secondary" onClick={showImport}><MdFileUpload /></Button>{" "}
                <Menu
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleCloseDownloadAction}
                >
                    <MenuItem onClick={e => { handleCloseDownloadAction(); showExport() }}>Tài khoản</MenuItem>
                    <MenuItem onClick={e => { handleCloseDownloadAction(); window.location.href = `${process.env.REACT_APP_EXPORT_URL}/account-by-role` }}>Tài khoản đã phân quyền</MenuItem>
                </Menu>
            </ButtonGroup>

            <div className='block-table-content'>
                <Card>
                    <CardHeader>
                        <p className='card-tittle'>DANH SÁCH TÀI KHOẢN</p>
                    </CardHeader>
                    <CardBody>
                        <ReactTable
                            noDataText="Không có dữ liệu"
                            manual // Forces table not to paginate or sort automatically, so we can handle it server-side
                            data={data.data}
                            pages={data.pages} // Display the total number of pages
                            loading={loading} // Display the loading overlay when we need it
                            onFetchData={onChangeTable} // Request new data when things change
                            filterable
                            defaultPageSize={20}
                            className="-striped -highlight"
                            columns={[
                                {
                                    width: 70,
                                    accessor: "info.image",
                                    filterable: false,
                                    Cell: row => <Avatar src={row.value} size={50} round={true} name={row.original.fullName} />
                                },

                                {
                                    Header: "Họ và Tên",
                                    accessor: "fullName",
                                    Cell: row => <div>
                                        {row.original.title} {row.value}
                                    </div>
                                },
                                {
                                    Header: "Mã tk",
                                    width: 70,
                                    accessor: "code"
                                },
                                {
                                    Header: "Tên đăng nhập",
                                    accessor: "userName"
                                },
                                {
                                    Header: "Số điện thoại",
                                    accessor: "phoneNumber"
                                },
                                {
                                    Header: "Phòng/ban",
                                    accessor: "departmentId",
                                    Cell: row => <div>{row.original.department && row.original.department.name}</div>,
                                    type: "select",
                                    options: departments

                                },
                                {
                                    Header: "Chức vụ",
                                    accessor: "work"
                                },
                                {
                                    Header: "Email",
                                    accessor: "email"
                                },
                                {
                                    Header: "Ngày tạo",
                                    width: 120,
                                    accessor: "createdTime",
                                    type: 'date',
                                    Cell: row => (<Label>{Moment(row.value).format('DD/MM/YYYY')}</Label>)
                                },
                                {
                                    Header: "Quyền",
                                    width: 70,
                                    filterable: false,
                                    accessor: "roles",
                                    Cell: row => <b>
                                        {row.value.length}
                                    </b>
                                },
                                {
                                    Header: "Dự án",
                                    width: 70,
                                    filterable: false,
                                    accessor: "roles",
                                    Cell: row => <b>
                                        {row.value.reduce((rv, x) => {
                                            if (!rv.includes(x.projectId)) {
                                                rv.push(x.projectId)
                                            }
                                            return rv;
                                        }, []).length}
                                    </b>
                                },
                                {
                                    Header: "Trạng thái",
                                    accessor: "isActive",
                                    filterable: false,
                                    width: 60,
                                    Cell: row => <div>
                                        <Checkbox checked={row.value} disabled={true} />
                                    </div>
                                },
                                {
                                    Header: "Tác vụ",
                                    maxWidth: 60,
                                    filterable: false,
                                    sortable: false,
                                    Cell: row => (
                                        <div>
                                            <IconButton onClick={() => props.history.push("/account-edit/" + row.original._id)}>
                                                <Icon>edit</Icon>
                                            </IconButton>

                                        </div>

                                    )
                                }
                            ]}

                        >

                        </ReactTable>
                    </CardBody>
                </Card>
            </div>

        </Page>
    )

}

export default withApollo(AccountPage);
