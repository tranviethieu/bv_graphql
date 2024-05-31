import React, { useState, useEffect, useMemo } from 'react';
import { FusePageCarded } from '@fuse';
import { makeStyles } from '@material-ui/styles';
import { Paper, Button, Input, Icon, Typography, IconButton, Tooltip, Toolbar, TextField } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import viLocale from "date-fns/locale/vi";
import moment from 'moment';
import { FuseAnimate } from '@fuse';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ReactTable from 'react-table';
import * as Actions from './store/actions';
import history from '@history';
import AnswerPreview from './Dialog/AnswerPreview'
import { useForm } from '@fuse/hooks';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        alignItems: 'center',
        height: 21,
        borderRadius: 2,
        padding: '0 6px',
        fontSize: 11,
        backgroundColor: 'rgba(0,0,0,.08);'
    },
    color: {
        width: 8,
        height: 8,
        marginRight: 4,
        borderRadius: '50%'
    }
}));
const initForm = {
    begin: moment().day(-7).format("YYYY-MM-DD"),
    end: moment().format("YYYY-MM-DD"),
    timeFrame: '',
}

function UserSurveyHistory(props) {

    const dispatch = useDispatch();
    const { form, handleChange, setForm, setInForm } = useForm(initForm);
    const [open, setOpen] = useState(false);
    const [data, setData] = useState(null);
    const [surveys, setSurveys] = useState([]);
    const [user, setUser] = useState(null)
    const [surveyId, setId] = useState(null);
    const [page, setPage] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const [phone, setPhone] = useState("")

    function fetchData(state) {
        const phoneNumber = props.match.params.phoneNumber;
        if (phoneNumber) {
            // Actions.get
            const { page, pageSize, filtered, sorted, } = state
            var tempSort = [...sorted, { id: "createdTime", desc: true }]
            // var tempFiltered = [...filtered, { id: "action", value: "SURVEY" }, { id: "creator._id", value: _id }]
            var mFiltered = [...filtered, { id: "phoneNumber", value: phoneNumber }]
            setPageSize(pageSize)
            Actions.getSurveyResults({ page, pageSize, filtered: mFiltered, tempSort }, dispatch)
                .then(response => {
                    console.log("===> survey history: ", response)
                    setSurveys(response);
                })
        }
    }
    function fetchUserData() {
        const phoneNumber = props.match.params.phoneNumber;
        console.log("==> phone number: ", phoneNumber)
        if (phoneNumber) {
            Actions.getUserInfo(phoneNumber, dispatch)
                .then(response => {
                    console.log("==> user: ", response)
                    if (response.data && response.data.length > 0) {
                        let base = response.data[0]
                        if (base) {
                            setUser(base)
                        }
                    }
                })
        }
    }
    useEffect(() => {
        fetchUserData()
    }, [props])

    function handleCloseDialog() {
        setOpen(false)
    }
    function handleSubmitResult() {
        setOpen(false)
    }
    function handleDateBeginChange(e) {
        setInForm('begin', e)
    }
    function handleDateEndChange(e) {
        setInForm('end', e)
    }

    return (
        <div>
            {/* <AnswerPreview open={open} 
            onCloseDialog={handleCloseDialog} 
            user={data && data.user} 
            result={data && data.survey_result && data.survey_result.data} 
            title={data && data.survey_result && data.survey_result.survey.title} /> */}
            <AnswerPreview open={open}
                onCloseDialog={handleCloseDialog}
                user={data && { phoneNumber: data.user ? data.user.phoneNumber : '', fullName: data.user ? data.user.fullName : '' }}
                result={data && data.data && data.data}
                title={data && data.survey.title && data.survey.title} />
            <FusePageCarded
                classes={{
                    content: "flex",
                    header: "min-h-72 h-72 sm:h-136 sm:min-h-136"
                }}
                header={
                    <div className="flex flex-1 w-full items-center justify-between">
                        <div className="flex flex-col items-start sm:w-1/2 md:w-1/2 l:w-1/2 pt-20">
                            <div className="flex items-center max-w-full">
                                {/* <FuseAnimate animation="transition.expandIn" delay={300}>
                                    <Icon className="text-32 mr-0 sm:mr-12"><img src={"assets/icons/survey/icon_survey.png"} alt="icon" style={{ maxWidth: "32px", maxHeight: "32px" }} /></Icon>
                                </FuseAnimate> */}
                                <FuseAnimate animation="transition.slideRightIn" delay={300}>
                                    <Typography className="normal-case flex items-center sm:mb-12 mt-5" role="button" color="inherit" onClick={e => history.goBack()}>
                                        <Icon className="mr-4 text-20">arrow_back</Icon>
                                    </Typography>
                                </FuseAnimate>
                                <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                                    <Typography className="hidden sm:flex" variant="h6">Lịch sử khảo sát của khách hàng</Typography>
                                </FuseAnimate>
                            </div>
                            <Toolbar className="header-toolbar sm:w-full md:w-full l:w-full" style={{ padding: "auto" }}>
                                <div className="p-12 flex flex-wrap">
                                    {
                                        useMemo(() => {
                                            return (
                                                <div className="widget sm:w-1/2 md:w-1/2 l:w-1/2 p-12">
                                                    <TextField
                                                        name="key"
                                                        label="Họ tên"
                                                        type="text"
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        variant="outlined"
                                                        margin="nomal"
                                                        fullWidth
                                                        value={user && user.fullName}
                                                        disable={true}
                                                    />
                                                </div>
                                            )
                                        }, [user])
                                    }
                                    {
                                        useMemo(() => {
                                            return (
                                                <div className="widget sm:w-1/2 md:w-1/2 l:w-1/2 p-12">
                                                    <TextField
                                                        name="key"
                                                        label="Số điện thoại"
                                                        type="text"
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        variant="outlined"
                                                        margin="nomal"
                                                        fullWidth
                                                        value={user && user.phoneNumber}
                                                        disable={true}
                                                    />
                                                </div>
                                            )
                                        }, [user])
                                    }
                                </div>
                            </Toolbar>
                        </div>
                        <Toolbar className="header-toolbar sm:w-1/2 md:w-1/2 l:w-1/2" style={{ padding: "auto" }}>
                            <div className="p-12 flex flex-wrap" style={{ marginTop: "60px" }}>
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
                    </div>
                }
                content={
                    <ReactTable
                        manual
                        className="-striped -highlight h-full w-full sm:rounded-8"
                        data={surveys.data}
                        pages={surveys.pages}
                        defaultPageSize={10}
                        filterable={false}
                        sortable={false}
                        onPageChange={setPage}
                        noDataText="Không có khảo sát nào"
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
                                Header: 'Tên khảo sát',
                                accessor: 'survey.name',
                                className: "wordwrap",
                                filterable: false,
                                style: { justifyContent: "left", textAlign: "left", whiteSpace: "unset", wordBreak: "nomal" },
                                Cell: row =>
                                    <Tooltip title="Xem chi tiết kết quả">
                                        <span style={{ marginLeft: "10px", marginRight: "10px", textDecoration: "underline", textDecorationColor: "#C6C6C6", cursor: "pointer", }}
                                            // onClick={_ => history.push(`/apps/survey/${row.original.survey_result.surveyId}`)}
                                            onClick={(e) => { setData(row.original); setOpen(true); }}
                                        >
                                            {row.value && row.value}
                                        </span>
                                    </Tooltip>
                            },
                            {
                                Header: 'Tiêu đề',
                                accessor: 'survey.title',
                                filterable: false,
                                style: { justifyContent: "left", textAlign: "left", whiteSpace: "unset", wordBreak: "nomal" },
                                Cell: row =>
                                    <Tooltip title="Xem chi tiết kết quả">
                                        <span style={{ marginLeft: "10px", marginRight: "10px", textDecoration: "underline", textDecorationColor: "#C6C6C6", cursor: "pointer", }}
                                            // onClick={_ => history.push(`/apps/survey/${row.original.survey_result.surveyId}`)}
                                            onClick={(e) => { setData(row.original); setOpen(true); }}
                                        >
                                            {row.value && row.value}
                                        </span>
                                    </Tooltip>
                            },
                            {
                                Header: 'Ngày tạo',
                                accessor: 'survey.createdTime',
                                className: "justify-center",
                                filterable: false,
                                width: 120,
                                Cell: row => <div>{row.value && moment(row.value).format("DD/MM/YYYY")}</div>
                            },
                            {
                                Header: "Số câu hỏi",
                                filterable: false,
                                accessor: "survey.questionIds",
                                width: 120,
                                className: "justify-center",
                                Cell: row =>
                                    <span style={{ marginLeft: "10px", marginRight: "10px", }}
                                    >
                                        {row.value && row.value.length}
                                    </span>
                            },
                            {
                                Header: () => <div style={{ textAlign: "center", whiteSpace: "unset", wordBreak: "nomal", display: "grid" }}>
                                    <span>Gửi trả lời</span>
                                    <span>lúc</span>
                                </div>,
                                accessor: 'createdTime',
                                filterable: false,
                                className: "justify-center",
                                width: 120,
                                Cell: row => <div style={{ display: "grid" }}>
                                    <span>{row.value && moment(row.value).format("HH:MM")}</span>
                                    <span>{row.value && moment(row.value).format("DD/MM/YYYY")}</span>
                                </div>
                            },
                            {
                                Header: "Tác vụ",
                                accessor: "survey_result.surveyId",
                                filterable: false,
                                width: 120,
                                Cell: row => <div>
                                    {/* <IconButton title="Chỉnh sửa khảo sát"
                                        onClick={_ => history.push(`/apps/surveys/edit/${row.value}`)}
                                    >
                                        <Icon>
                                            edit
                                    </Icon>
                                    </IconButton> */}
                                    <IconButton title="Xem chi tiết kết quả"
                                        onClick={(e) => { setData(row.original); setOpen(true); }}
                                    >
                                        <Icon>
                                            pageview
                                    </Icon>
                                    </IconButton>
                                </div>
                            }
                        ]}
                    />
                }
            />
        </div>
    )
}
export default UserSurveyHistory;