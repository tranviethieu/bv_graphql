import React, { useState, useEffect, useForm } from 'react';
import { FusePageCarded } from '@fuse';
import { Paper, Button, Input, Icon, Typography, IconButton, Tooltip, FormControlLabel, TextField } from '@material-ui/core';
import { FuseAnimate, FuseChipSelect, FusePageSimple, AdvanceEditor } from '@fuse';
import { FuseAnimateGroup, } from '@fuse';
import { ThemeProvider } from '@material-ui/styles';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ReactTable from 'react-table';
import * as Actions from '../store/actions';
import moment from 'moment';
import history from '@history';
import TableCircularLoading from 'app/fuse-layouts/shared-components/loading/TableCircularLoading';
import IOSSwitch from 'app/fuse-layouts/shared-components/components/IOSSwitch'
import { showMessage } from 'app/store/actions'
import * as BaseControl from 'app/main/utils/VTBaseControl'

import { makeStyles } from '@material-ui/styles';
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import viLocale from "date-fns/locale/vi";

const useStyles = makeStyles(theme => ({
    content: {
        '& canvas': {
            maxHeight: '100%'
        }
    },

}));

function NotifyQueue(props) {
    const dispatch = useDispatch();
    const classes = useStyles(props);
    const [page, setPage] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const [loading, setLoading] = useState(false)
    const [tableState, setTableState] = useState(null)
    const [notifies, setNotifies] = useState([])

    const [begin, setBegin] = useState(moment().subtract(30, 'd'))
    const [end, setEnd] = useState(new Date())

    function fetchData(state) {
        if (state) {
            const { page, pageSize, filtered, sorted } = state;
            var tempSort = [...sorted, { id: "createdTime", desc: true }]
            setPageSize(pageSize)
            setLoading(true)
            setTableState(state)
            console.log("==> table filter: ", filtered)
            let filter = [...filtered, { id: "appId", value: `${process.env.REACT_APP_NOTIFY_APP_ID}` },
            { id: 'createdTime', value: `${moment(begin).format("DD/MM/YYYY")},${moment(end).add(1, 'days').format("DD/MM/YYYY")}`, operation: "between" }
            ];
            Actions.getNotificationQueues({ page, pageSize, filtered: filter, sorted: tempSort }, dispatch).then(response => {
                console.log("===> notifi queues: ", response)
                setNotifies(response);
                setLoading(false)
            })
        } else {
            setLoading(true)
            let sorted = [{ id: "createdTime", desc: true }]
            let filter = [{ id: "appId", value: `${process.env.REACT_APP_NOTIFY_APP_ID}` }, { id: 'createdTime', value: `${moment(begin).format("DD/MM/YYYY")},${moment(end).add(1, 'days').format("DD/MM/YYYY")}`, operation: "between" }];
            Actions.getNotificationQueues({ page, pageSize, filtered: filter, sorted: tempSort }, dispatch).then(response => {
                console.log("===> notifi queues: ", response)
                setNotifies(response);
                setLoading(false)
            })
        }
    }
    return (

        <div>
            <FusePageSimple
                classes={{
                    toolbar: "min-h-80",
                    rightSidebar: "w-288",
                    content: classes.content,
                }}

                header={
                    <div className="flex flex-1 items-center justify-between p-24 el-HeaderPage">
                        <div className="flex flex-col">
                            <Typography variant="h6">Báo cáo thông báo chờ gửi</Typography>
                        </div>
                    </div>
                }
                content={
                    <div className="p-12 el-coverContent" id="el-ReportSMSQueue-content">
                        <div className="el-block-report">
                            <Typography className="pl-12 text-15 font-bold mb-10 block-tittle">Lọc dữ liệu:</Typography>
                            <div className="el-fillter-report-action">
                                <div className="el-flex-item flex-item-flex1">
                                    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={viLocale}>
                                        <DatePicker
                                            disableToolbar
                                            variant="inline"
                                            fullWidth
                                            autoOk
                                            required
                                            id="begin"
                                            name="begin"
                                            label="Ngày bắt đầu"
                                            inputVariant="outlined"
                                            value={begin ? moment(begin).format("YYYY-MM-DD") : new Date()}
                                            onChange={e => setBegin(e)}
                                            format="dd/MM/yyyy"
                                        />
                                    </MuiPickersUtilsProvider>
                                </div>
                                <div className="el-flex-item flex-item-flex1">
                                    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={viLocale}>
                                        <DatePicker
                                            disableToolbar
                                            variant="inline"
                                            fullWidth
                                            autoOk
                                            required
                                            id="end"
                                            name="end"
                                            label="Ngày kết thúc"
                                            inputVariant="outlined"
                                            value={end ? moment(end).format("YYYY-MM-DD") : new Date()}
                                            onChange={e => setEnd(e)}
                                            format="dd/MM/yyyy"
                                        />
                                    </MuiPickersUtilsProvider>
                                </div>
                                <FuseAnimateGroup
                                    className="flex flex-wrap justify-center"
                                    enter={{
                                        animation: "transition.slideUpBigIn"
                                    }}
                                >
                                    <Button variant="contained" className="mx-20" color="secondary" onClick={e => fetchData(null)}>
                                        <Icon>search</Icon> Tìm kiếm
                                    </Button>
                                </FuseAnimateGroup>
                            </div>
                        </div>
                        <div className="el-block-report flex">

                            <ReactTable
                                manual
                                className="-striped -highlight h-full w-full sm:rounded-8"
                                data={notifies.data}
                                pages={notifies.pages}
                                defaultPageSize={10}
                                filterable={true}
                                sortable={false}
                                onPageChange={setPage}
                                noDataText="Không có thông báo nào"
                                onFetchData={fetchData}
                                style={{ fontSize: "15px", }}
                                loading={loading}
                                LoadingComponent={TableCircularLoading}
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
                                        Header: 'Tiêu đề',
                                        accessor: 'title',
                                        className: "wordwrap",
                                        style: { justifyContent: "left", textAlign: "left", whiteSpace: "unset", wordBreak: "nomal" },
                                        Cell: row =>
                                            <span
                                                style={{
                                                    marginLeft: "10px", marginRight: "10px",
                                                    // textDecoration: "underline", textDecorationColor: "#C6C6C6", cursor: "pointer", 
                                                }}
                                            >
                                                {row.value}
                                            </span>
                                    },
                                    {
                                        Header: 'Nội dung ngắn',
                                        accessor: 'subtitle',
                                        style: { justifyContent: "left", textAlign: "left", whiteSpace: "unset", wordBreak: "nomal" },
                                        Cell: row =>
                                            <span style={{
                                                marginLeft: "10px", marginRight: "10px",
                                                // textDecoration: "underline", textDecorationColor: "#C6C6C6", cursor: "pointer", 
                                            }}
                                            >
                                                {row.value}
                                            </span>
                                    },
                                    {
                                        Header: 'Ngày tạo',
                                        accessor: 'createdTime',
                                        className: "justify-center",
                                        filterable: false,
                                        width: 120,
                                        Cell: row => <div>{moment(row.value).format("HH:mm DD/MM/YYYY")}</div>
                                    },
                                    {
                                        Header: "Số lần gửi lại",
                                        filterable: false,
                                        accessor: "retry",
                                        width: 120,
                                        className: "justify-center",
                                    },

                                ]}
                            />
                        </div>


                    </div>

                }
            />
        </div>
    )

}
export default NotifyQueue;