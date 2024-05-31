import React, { useEffect, useState, useMemo } from 'react';
import { Icon, IconButton, Paper, Input, Tab, Tabs, Typography, Button, Fab, TextField, Toolbar } from '@material-ui/core';
import { FuseAnimateGroup, FusePageSimple, FuseAnimate } from '@fuse';
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import viLocale from "date-fns/locale/vi";
import moment from 'moment';
import { useForm } from '@fuse/hooks';
import Tooltip from '@material-ui/core/Tooltip';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import Widget1 from './widgets/Widget1';
import Widget2 from './widgets/Widget2';
import ReactTable from 'react-table';
import * as APIRequest from "./GraphQLHelper";
import * as StringUtils from "../../utils/StringUtils";
import { callout } from 'app/store/actions';
import CheckCircle from '@material-ui/icons/CheckCircle'
import DashboardItem from 'app/main/apps/NewSurveys/surveys/components/DashboardItem'
import * as Actions from './GraphQLHelper'
import history from '@history';


const useStyles = makeStyles(theme => ({
    content: {
        '& canvas': {
            maxHeight: '100%'
        }
    },
    selectedProject: {
        background: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        borderRadius: '8px 0 0 0'
    },
    projectMenuButton: {
        background: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        borderRadius: '0 8px 0 0',
        marginLeft: 1
    },
}));
const initForm = {
    begin: moment().day(-7).format("YYYY-MM-DD"),
    end: moment().format("YYYY-MM-DD"),
    timeFrame: '',
}

function RealtimeDashboardApp(props) {
    const dispatch = useDispatch();
    const classes = useStyles(props);
    const { form, handleChange, setForm, setInForm } = useForm(initForm);

    const [data, setData] = useState(null)

    function handleDateBeginChange(e) {
        setInForm('begin', e)
    }
    function handleDateEndChange(e) {
        setInForm('end', e)
    }

    useEffect(() => {
        let mbegin = moment(form.begin).format("YYYY-MM-DD")
        let mend = moment(form.end).format("YYYY-MM-DD")
        let type = "USER"
        Actions.getSurveysGeneralReport(mbegin, mend, [], type)
            .then(response => {
                console.log("===> report respones: ", response)
                setData(response.data)
            })

    }, [form.begin, form.end])

    return (
        <div>
            <FusePageSimple
                classes={{
                    toolbar: "min-h-48 h-48",
                    rightSidebar: "w-288",
                    content: classes.content,
                }}
                header={
                    <div className="flex flex-1 items-center justify-between p-24">
                        <div className="flex flex-col p-24">
                            <div className="flex items-center mb-16">
                                <Icon className="text-18" color="action">home</Icon>
                                {/* <Icon className="text-16" color="action">chevron_right</Icon> */}
                                <Typography color="textSecondary" style={{ fontSize: "28px", marginLeft: "10px" }}>Trang chủ</Typography>
                            </div>
                        </div>
                        <Toolbar className="header-toolbar">
                            <div className="p-12 flex flex-wrap">
                                {/* <div className="widget sm:w-1/3 md:w-1/3 l:w-1/3 p-12">
                                    <TextField
                                        name="key"
                                        label="Nội dung tìm kiếm"
                                        type="text"
                                        onChange={handleChange}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        variant="outlined"
                                        margin="nomal"
                                        fullWidth
                                    />
                                </div> */}
                                {
                                    useMemo(() => {
                                        return (
                                            <div className="widget sm:w-1/2 md:w-1/2 l:w-1/2 p-12">
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
                                                        value={form.begin ? moment(form.begin).format("YYYY-MM-DD") : new Date()}
                                                        onChange={handleDateBeginChange}
                                                        format="dd/MM/yyyy"
                                                    />
                                                </MuiPickersUtilsProvider>
                                            </div>
                                        )
                                    }, [form.begin])
                                }
                                {
                                    useMemo(() => {
                                        return (
                                            <div className="widget sm:w-1/2 md:w-1/2 l:w-1/2 p-12">
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
                                                        value={form.end ? moment(form.end).format("YYYY-MM-DD") : new Date()}
                                                        onChange={handleDateEndChange}
                                                        format="dd/MM/yyyy"
                                                    />
                                                </MuiPickersUtilsProvider>
                                            </div>
                                        )
                                    }, [form.end])
                                }
                            </div>
                        </Toolbar>
                        <Tooltip title={"Thêm khảo sát mới"} placement="left">
                            <Fab color="primary" aria-label="add" className={classes.fab} >
                                <Button onClick={e => {
                                    // handle add 
                                    props.history.push("/apps/surveys/edit/new")
                                }}>
                                    <img src={"assets/icons/survey/btn-add.png"} alt={"add"} style={{ objectFit: "contain" }} />
                                </Button>
                            </Fab>
                        </Tooltip>
                    </div>
                }
                content={
                    <div>
                        {
                            useMemo(() => {
                                return (
                                    <div className="p-12">
                                        <div className="p-12 flex flex-wrap">
                                            <div className="widget sm:w-1/3 md:w-1/3 l:w-1/3 p-12" style={{ display: "flex", justifyContent: "center", margin: "auto" }}>
                                                <DashboardItem title="Tổng số chiến dịch" value={data && data.survey_num ? data.survey_num : "0"} />
                                            </div>
                                            <div className="widget sm:w-1/3 md:w-1/3 l:w-1/3 p-12" style={{ display: "flex", justifyContent: "center", margin: "auto" }}>
                                                <DashboardItem title="Tổng số lượt khảo sát" value={data && data.result_num ? data.result_num : "0"} />
                                            </div>
                                            <div className="widget sm:w-1/3 md:w-1/3 l:w-1/3 p-12" style={{ display: "flex", justifyContent: "center", margin: "auto" }}>
                                                <DashboardItem title="Tổng số khách khảo sát" value={data && data.user_num ? data.user_num : "0"} />
                                            </div>
                                        </div>
                                    </div>
                                )
                            }, [data])
                        }
                        {
                            useMemo(() => {
                                return (
                                    data && data.data &&
                                    <div className="m-12">
                                        <ReactTable
                                            manual
                                            className="-striped -highlight h-full w-full sm:rounded-8"
                                            data={data.data}
                                            // pages={surveys.pages}
                                            defaultPageSize={5}
                                            filterable={false}
                                            sortable={false}
                                            showPagination={false}
                                            // onPageChange={setPage}
                                            noDataText="Không có dữ liệu"
                                            // onFetchData={fetchData}
                                            style={{ fontSize: "15px", }}
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
                                                    Header: 'Tên khảo sát',
                                                    accessor: 'Name',
                                                    className: "wordwrap",
                                                    style: { justifyContent: "left", textAlign: "left", whiteSpace: "unset", wordBreak: "nomal" },
                                                    Cell: row =>
                                                        <span style={{ marginLeft: "10px", marginRight: "10px", textDecoration: "underline", textDecorationColor: "#C6C6C6", cursor: "pointer", }}
                                                            onClick={_ => history.push(`/apps/survey/${row.original._id}`)}
                                                        >
                                                            {row.value}
                                                        </span>
                                                },
                                                {
                                                    Header: 'Tiêu đề',
                                                    accessor: 'Title',
                                                    style: { justifyContent: "left", textAlign: "left", whiteSpace: "unset", wordBreak: "nomal" },
                                                    Cell: row =>
                                                        <span style={{ marginLeft: "10px", marginRight: "10px", textDecoration: "underline", textDecorationColor: "#C6C6C6", cursor: "pointer", }}
                                                            onClick={_ => history.push(`/apps/survey/${row.original._id}`)}
                                                        >
                                                            {row.value}
                                                        </span>
                                                },
                                                {
                                                    Header: 'Ngày tạo',
                                                    accessor: 'CreatedTime',
                                                    className: "justify-center",
                                                    width: 100,
                                                    Cell: row => <div>{moment(row.value).format("DD/MM/YYYY")}</div>
                                                },
                                                {
                                                    Header: "Số câu hỏi",
                                                    filterable: false,
                                                    accessor: "Questions",
                                                    width: 100,
                                                    className: "justify-center",
                                                },
                                                {
                                                    // Header: "Tổng lượt trả lời",
                                                    Header: () => (
                                                        <div style={{ justifyContent: "center", whiteSpace: "normal", wordBreak: "nomal" }}>
                                                            Tổng lượt trả lời
                                                        </div>
                                                    ),
                                                    filterable: false,
                                                    accessor: "total",
                                                    width: 100,
                                                    className: "justify-center",
                                                },
                                                {
                                                    Header: () => (
                                                        <span style={{ whiteSpace: "normal", wordBreak: "nomal" }}>
                                                            Tổng khách trả lời
                                                        </span>
                                                    ),
                                                    filterable: false,
                                                    accessor: "users",
                                                    width: 100,
                                                    className: "justify-center",
                                                },
                                                {
                                                    Header: "Tác vụ",
                                                    accessor: "_id",
                                                    filterable: false,
                                                    width: 120,
                                                    Cell: row => <div>
                                                        <Tooltip title="Chỉnh sửa khảo sát">
                                                            <IconButton title="Chỉnh sửa khảo sát"
                                                                onClick={_ => history.push(`/apps/surveys/edit/${row.value}`)}
                                                            >
                                                                <Icon>
                                                                    edit
                                                        </Icon>
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Chi tiết khảo sát">
                                                            <IconButton title="Chi tiết khảo sát"
                                                                onClick={_ => history.push(`/apps/survey/${row.value}`)}
                                                            >
                                                                <Icon>
                                                                    remove_red_eye
                                                        </Icon>
                                                            </IconButton>
                                                        </Tooltip>
                                                    </div>
                                                }
                                            ]}
                                        />
                                    </div>
                                )
                            }, [data])
                        }
                    </div>
                }
            />
        </div>
    )
}

export default RealtimeDashboardApp;