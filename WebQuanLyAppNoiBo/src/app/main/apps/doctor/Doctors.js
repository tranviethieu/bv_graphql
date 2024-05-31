import React, { useState } from 'react';
import { FusePageCarded } from '@fuse';
import { Icon, Typography, IconButton, Tooltip } from '@material-ui/core';
import { FuseAnimate } from '@fuse';
import { useDispatch } from 'react-redux';
import * as Actions from './actions';
import ReactTable from 'react-table';
import StarRatings from 'react-star-ratings';
import moment from 'moment';
import { showUserDialog, showQuickTableFetchDataDialog } from '../shared-dialogs/actions'


function getRattingColums() {
    return [
        {
            Header: "Số điện thoại",
            accessor: "phoneNumber",
            filterable: false,
            Cell: row => <div>
                <span style={{ marginLeft: "5px", marginRight: "5px" }}
                >
                    {row.value}
                </span>
            </div>
        },
        {
            Header: "Số điểm đánh giá",
            filterable: false,
            accessor: "score",
            style: { justifyContent: "left", textAlign: "left", whiteSpace: "unset", wordBreak: "nomal" },
            Cell: row =>
                <Tooltip title={`${row.value} điểm`} placement="left">
                    <div style={{ marginLeft: "5px", marginRight: "5px", pointerEvents: "none" }}>
                        <StarRatings
                            rating={row.value}
                            starRatedColor="#faa60b"
                            numberOfStars={5}
                            starDimension="15px"
                            starSpacing='2px'
                            name='rating'
                        />
                    </div>
                </Tooltip>

        },
        {
            Header: "Nhận xét",
            accessor: "comment",
            filterable: false,
            className: "wordwrap",
            style: { justifyContent: "left", textAlign: "left", whiteSpace: "unset", wordBreak: "nomal" },
            Cell: row => <div>
                <span style={{ marginLeft: "5px", marginRight: "5px" }}
                >
                    {row.value}
                </span>
            </div>
        },

    ]
}

export default function Doctors(props) {
    const dispatch = useDispatch();
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(0)
    const [pageSize, setPageSize] = useState(20)

    function fetchData(state) {
        const { page, pageSize, filtered, sorted } = state;
        let defaultFiltered = [
            { id: "base.userName", value: '' },
            { id: "base.fullName", value: '' },
            { id: "base.email", value: '' },
            { id: "base.phoneNumber", value: '' },
            { id: "base.code", value: '' }]
        var tempFilter = []
        defaultFiltered.map(item => {
            var fil = filtered.find(el => el.id === item.id)
            if (fil) {
                tempFilter.push(fil)
            } else {
                tempFilter.push(item)
            }
        })
        setPageSize(pageSize)
        // console.log("===> state: ", state)
        Actions.getAccounts({ page, pageSize, filtered: tempFilter, sorted }, dispatch).then(response => {
            setUsers(response);
        })
    }
    function handleShowRattingDialog(doctor) {
        if (doctor) {
            let code = doctor.base && doctor.base.code ? doctor.base.code : ''
            let name = doctor.base && doctor.base.fullName ? doctor.base.fullName : ''
            //title, subtitle, columns, data, submit, defaultPageSize = 10, pages = 0, fetchData = () => { }, ...props }
            dispatch(showQuickTableFetchDataDialog({
                rootClass: "md:w-2/3",
                columns: getRattingColums(),
                title: "Đánh giá",
                subtitle: `Danh sách đánh giá của khách hàng cho bác sỹ ${name}`,
                fetchData: (state) => {
                    const { page, pageSize, sorted, filtered } = state
                    return Actions.getRattings({ page, pageSize, sorted, filtered: [...filtered, { id: "doctor.code", value: code }] }, dispatch)
                },
            }))
        }
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

                        <div className="flex items-center">
                            <FuseAnimate animation="transition.expandIn" delay={300}>
                                <Icon className="text-32 mr-0 sm:mr-12">supervised_user_circle</Icon>
                            </FuseAnimate>
                            <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                                <Typography className="hidden sm:flex" variant="h6">Danh sách bác sỹ ({users.records ? users.records : 0})</Typography>
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
                        defaultPageSize={20}
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
                                accessor: 'base.fullName',
                                className: "wordwrap",
                                style: { justifyContent: "left", textAlign: "left", whiteSpace: "unset", wordBreak: "nomal" },
                                Cell: row =>
                                    <span style={{ marginLeft: "5px", marginRight: "5px", textDecoration: "underline", textDecorationColor: "#C6C6C6", cursor: "pointer", }}
                                        onClick={e => handleShowRattingDialog(row.original)}
                                    >
                                        {row.value}
                                    </span>
                            },
                            {
                                Header: 'Số điện thoại',
                                accessor: 'base.phoneNumber',
                                width: 140,
                                style: { justifyContent: "left", textAlign: "left", whiteSpace: "unset", wordBreak: "nomal" },
                                Cell: row =>
                                    <span style={{ marginLeft: "5px", marginRight: "5px", textDecoration: "underline", textDecorationColor: "#C6C6C6", cursor: "pointer", }}
                                        onClick={e => handleShowRattingDialog(row.original)}
                                    >
                                        {row.value}
                                    </span>
                            },
                            {
                                Header: 'Email',
                                accessor: 'base.email',
                                style: { justifyContent: "left", textAlign: "left", whiteSpace: "unset", wordBreak: "nomal" },
                                Cell: row =>
                                    <span style={{ marginLeft: "5px", marginRight: "5px", textDecoration: "underline", textDecorationColor: "#C6C6C6", cursor: "pointer", }}
                                        onClick={e => handleShowRattingDialog(row.original)}
                                    >
                                        {row.value}
                                    </span>
                            },
                            {
                                Header: 'Ngày sinh',
                                accessor: 'base.birthday',
                                width: 120,
                                filterable: false,
                                Cell: row => <div>{moment(row.value).format("DD/MM/YYYY")}</div>
                            },
                            {
                                Header: 'Giới tính',
                                accessor: 'base.gender',
                                filterable: false,
                                width: 120,
                                Cell: row =>
                                    <span style={{ marginLeft: "5px", marginRight: "5px", cursor: "pointer", }}
                                        onClick={e => handleShowRattingDialog(row.original)}
                                    >
                                        {row.value ? row.value === "1" ? "Nam" : "Nữ" : "Chưa xác định"}
                                    </span>
                            },
                            {
                                Header: "Địa chỉ",
                                filterable: false,
                                accessor: "base.address",
                                style: { justifyContent: "left", textAlign: "left", whiteSpace: "unset", wordBreak: "nomal" },
                                Cell: row =>
                                    <span style={{ marginLeft: "5px", marginRight: "5px", textDecoration: "underline", textDecorationColor: "#C6C6C6", cursor: "pointer", }}
                                        onClick={e => handleShowRattingDialog(row.original)}
                                    >
                                        {row.value}
                                    </span>
                            },
                            {
                                Header: "Số điểm đánh giá",
                                filterable: false,
                                accessor: "score",
                                width: 160,
                                style: { justifyContent: "left", textAlign: "left", whiteSpace: "unset", wordBreak: "nomal" },
                                Cell: row =>
                                    <Tooltip title={`${row.value} điểm`} placement="left">
                                        <div style={{ marginLeft: "5px", marginRight: "5px", pointerEvents: "none" }}>
                                            <StarRatings
                                                rating={row.value}
                                                starRatedColor="#faa60b"
                                                numberOfStars={5}
                                                starDimension="15px"
                                                starSpacing='2px'
                                                name='rating'
                                            />
                                        </div>
                                    </Tooltip>

                            },
                            {
                                Header: "Tác vụ",
                                accessor: "_id",
                                filterable: false,
                                width: 120,
                                Cell: row => <div>
                                    <Tooltip title="Xem chi tiết đánh giá" placement="left">
                                        <IconButton title="Xem chi tiết đánh giá"
                                            onClick={e => handleShowRattingDialog(row.original)}
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

