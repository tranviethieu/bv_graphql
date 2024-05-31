import React, { useEffect, useState, useMemo } from 'react';
import { Icon, IconButton, Paper, Input, Tab, Tabs, Typography, Button, Fab, TextField, Toolbar } from '@material-ui/core';
import { FuseAnimateGroup, FusePageSimple, FuseAnimate } from '@fuse';
import ReactTable from 'react-table';
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import viLocale from "date-fns/locale/vi";
import moment from 'moment';
import { useForm } from '@fuse/hooks';
import Tooltip from '@material-ui/core/Tooltip';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import { Link } from 'react-router-dom';
import * as Actions from './store/actions/survey.action';

import DashboardItem from 'app/main/apps/NewSurveys/surveys/components/DashboardItem'
import history from '@history';
import AnswerPreview from './Dialog/AnswerPreview'

import SurveyChart from './charts/SurveyChart'
import AppBar from '@material-ui/core/AppBar';

import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import QuestionChart from './charts/QuestionChart';


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
}
function Question(props) {
    const dispatch = useDispatch();
    const classes = useStyles(props);
    const { form, handleChange, setForm, setInForm } = useForm(initForm);
    const [open, setOpen] = useState(false);

    const [data, setData] = useState(null)
    const [survey, setSurvey] = useState(null)
    const [surveyChartData, setSurveyChartData] = useState(null)

    const [page, setPage] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const [users, setUsers] = useState([])
    const [lastAction, setLastAction] = useState(null)
    const [questionCharts, setQuestionCharts] = useState([])


    function handleDateBeginChange(e) {
        setInForm('begin', e)
    }
    function handleDateEndChange(e) {
        setInForm('end', e)
    }
    function handleCloseDialog() {
        setOpen(false)
    }

    useEffect(() => {
        const _id = props.match.params._id;
        if (_id) {
            Actions.getSurvey(_id, dispatch)
                .then(response => {
                    console.log("survey: ", response)
                    setSurvey(response.data)
                })
        }
    }, [props.match.params._id])

    useEffect(() => {
        const _id = props.match.params._id;
        if (_id) {
            let mbegin = moment(form.begin).format("YYYY-MM-DD")
            let mend = moment(form.end).format("YYYY-MM-DD")

            console.log("begin: ", mbegin, " end: ", mend)
            Actions.getSurveysGeneralReport(mbegin, mend, [_id])
                .then(response => {
                    console.log("===> report respones: ", response)
                    setData(response.data)
                })
            Actions.getSurveyFrequenceData(mbegin, mend, [_id], 10, dispatch)
                .then(response => {
                    console.log("==> biểu đồ survey: ", response)
                    setSurveyChartData(response.data)
                })
        }
    }, [form.begin, form.end])

    function fetchUsersData(state) {
        const _id = props.match.params._id;
        if (_id) {
            console.log("==> fetch users ")
            console.log("===> survey id: ", _id)
            let surveyIds = [_id]
            const { page, pageSize, filtered, sorted } = state;
            setPageSize(pageSize)
            let mbegin = moment(form.begin).format("YYYY-MM-DD")
            let mend = moment(form.end).format("YYYY-MM-DD")
            let actionNumFilterd = [{ id: "Data.SurveyId", value: `'${_id}'` }]
            Actions.getUsersBySurvey(mbegin, mend, page, pageSize, filtered, sorted, surveyIds, actionNumFilterd, dispatch).then(response => {
                console.log("===> user: ", response)
                setUsers(response);
            })
        }
    }

    //khi survey thay đổi thì load data để hiển thị dữ liệu biểu đồ câu hỏi
    useEffect(() => {
        processSurveyQuestionData(survey)
    }, [survey])

    function processSurveyQuestionData(mSurvey) {
        if (mSurvey) {
            let questions = mSurvey.questions
            if (questions) {
                console.log("==> question: ", questions)
                const inputQues = []
                questions.map(question => {
                    if (question.type === "SINGLECHOICE" || question.type === "SMILEY" || question.type === "RATING_STAR" || question.type === "MULTIPLECHOICE" || question.type === "DROPDOWN") {
                        inputQues.push(question)
                    }
                })
                getQuestionData(inputQues)
            }
        }
    }

    async function getQuestionData(questions) {
        var ids = []
        questions.map(ques => {
            ids.push(ques._id)
        })
        if (ids) {
            let mbegin = moment(form.begin).format("YYYY-MM-DD")
            let mend = moment(form.end).format("YYYY-MM-DD")
            await Actions.getQuestionsAnalysticData(ids, mbegin, mend)
                .then(response => {
                    console.log("==> ques data: ", response)
                    if (response && response.data.length === questions.length) {
                        var values = []
                        for (let i in questions) {
                            values.push({ question: questions[i], chartData: response.data[i] })
                        }
                        setQuestionCharts(values)
                    }
                })
        }
    }

    return (
        <div>
            <AnswerPreview open={open} onCloseDialog={handleCloseDialog} user={lastAction && lastAction.user} result={lastAction && lastAction.survey_result && lastAction.survey_result.data} title={lastAction && lastAction.survey_result && lastAction.survey_result.survey.title} />
            <FusePageSimple
                classes={{
                    toolbar: "min-h-48 h-48",
                    rightSidebar: "w-288",
                    content: classes.content,
                }}
                header={
                    <div className="flex flex-1 items-center justify-between p-24 ">
                        <div className="flex flex-col items-start sm:w-1/2 md:w-1/2 l:w-1/2">
                            <div className="flex items-center max-w-full">
                                <FuseAnimate animation="transition.slideRightIn" delay={300}>
                                    <Typography className="normal-case flex items-center sm:mb-12" role="button" color="inherit" onClick={e => history.goBack()}>
                                        <Icon className="mr-4 text-20">arrow_back</Icon>
                                    </Typography>
                                </FuseAnimate>
                                <div className="flex flex-col ml-20" style={{ maxWidth: "100%", paddingRight: "20px" }}>
                                    <Typography className="text-38 sm:text-20 truncate" style={{ whiteSpace: "unset", wordBreak: "nomal" }}>
                                        {survey && survey.name ? `${survey.name}` : ''}
                                    </Typography>
                                </div>
                            </div>
                        </div>

                        <Toolbar className="header-toolbar sm:w-1/2 md:w-1/2 l:w-1/2" style={{ padding: "auto" }}>
                            <div className="p-12 flex flex-wrap">
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
                    <div>
                        {
                            useMemo(() => {
                                return (
                                    <div className="p-12">
                                        <div className="p-12 flex flex-wrap">
                                            <div className="widget sm:w-1/3 md:w-1/3 l:w-1/3 p-12" style={{ display: "flex", justifyContent: "center", margin: "auto" }}>
                                                <DashboardItem title="Tổng số câu hỏi" value={data && data.data && data.data[0] && data.data[0].Questions ? data.data[0].Questions : "0"} />
                                            </div>
                                            <div className="widget sm:w-1/3 md:w-1/3 l:w-1/3 p-12" style={{ display: "flex", justifyContent: "center", margin: "auto" }}>
                                                <DashboardItem title="Tổng số lượt khảo sát" value={data && data.data && data.data[0] && data.data[0].total ? data.data[0].total : "0"} />
                                            </div>
                                            <div className="widget sm:w-1/3 md:w-1/3 l:w-1/3 p-12" style={{ display: "flex", justifyContent: "center", margin: "auto" }}>
                                                <DashboardItem title="Tổng số khách khảo sát" value={data && data.data && data.data[0] && data.data[0].users ? data.data[0].users : "0"} />
                                            </div>
                                        </div>
                                    </div>
                                )
                            }, [data])
                        }
                        {
                            useMemo(() => {
                                console.log("==> survey chatr data: ", surveyChartData)
                                return (
                                    <div style={{ marginTop: "15px", marginBottom: "15px" }}>
                                        <SurveyChart chartData={surveyChartData}></SurveyChart>
                                    </div>
                                )
                            }, [surveyChartData])
                        }
                        {
                            //question chart
                            useMemo(() => {
                                return (
                                    <div className="p-12">
                                        <div className="p-12 flex flex-wrap">
                                            {
                                                questionCharts && questionCharts.map(item => {
                                                    // console.log("===>  chart: ", item)
                                                    return (
                                                        item.chartData && item.chartData.length > 0 &&
                                                        <div className="widget sm:w-1/3 md:w-1/3 l:w-1/3 p-12">
                                                            <QuestionChart data={item} />
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                )
                            }, [questionCharts])
                        }
                        {/* <div className='p-20'> */}
                        <Card style={{ display: "block", margin: "20px", marginTop: "40px" }}>
                            <div style={{ height: "60px", width: "100%", backgroundColor: "#192D3E" }}>
                                <div style={{ paddingTop: "18px" }}><span style={{ marginLeft: "20px", color: "white", fontSize: "20px", fontWeight: "bold" }}>KHÁCH HÀNG TRẢ LỜI KHẢO SÁT</span></div>
                            </div>
                            <CardContent>
                                {/* <Container> */}
                                <ReactTable
                                    manual
                                    className="-striped -highlight h-full w-full sm:rounded-8"
                                    data={users.data}
                                    pages={users.pages}
                                    defaultPageSize={10}
                                    filterable={true}
                                    sortable={false}
                                    onPageChange={setPage}
                                    noDataText="Không có nguời dùng nào"
                                    onFetchData={fetchUsersData}
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
                                            Header: 'Tên khách hàng',
                                            accessor: 'fullName',
                                            className: "wordwrap",
                                            style: { justifyContent: "left", textAlign: "left", whiteSpace: "unset", wordBreak: "nomal" },
                                            Cell: row =>
                                                <span style={{ marginLeft: "10px", marginRight: "10px", textDecoration: "underline", textDecorationColor: "#C6C6C6", cursor: "pointer", }}
                                                    onClick={_ => {
                                                        if (row.original && row.original.phoneNumber) {
                                                            history.push(`/apps/user/history/${row.original.phoneNumber}`)
                                                        }
                                                    }}
                                                >
                                                    {row.value}
                                                </span>
                                        },
                                        {
                                            Header: 'Email',
                                            accessor: 'email',
                                            className: "wordwrap",
                                            style: { justifyContent: "left", textAlign: "left", whiteSpace: "unset", wordBreak: "break-all" },
                                            Cell: row =>
                                                <span style={{ marginLeft: "10px", marginRight: "10px", textDecoration: "underline", textDecorationColor: "#C6C6C6", cursor: "pointer", }}
                                                    onClick={_ => {
                                                        if (row.original && row.original.phoneNumber) {
                                                            history.push(`/apps/user/history/${row.original.phoneNumber}`)
                                                        }
                                                    }}
                                                >
                                                    {row.value}
                                                </span>
                                        },
                                        {
                                            Header: 'Số điện thoại',
                                            accessor: 'phoneNumber',
                                            width: 120,
                                            style: { justifyContent: "left", textAlign: "left", whiteSpace: "unset", wordBreak: "nomal" },
                                            Cell: row =>
                                                <span style={{ marginLeft: "10px", marginRight: "10px", textDecoration: "underline", textDecorationColor: "#C6C6C6", cursor: "pointer", }}
                                                    onClick={_ => {
                                                        if (row.original && row.original.phoneNumber) {
                                                            history.push(`/apps/user/history/${row.original.phoneNumber}`)
                                                        }
                                                    }}
                                                >
                                                    {row.value}
                                                </span>
                                        },
                                        {
                                            Header: () => <div style={{ textAlign: "center", whiteSpace: "unset", wordBreak: "nomal", display: "grid" }}>
                                                <span>Số lần</span>
                                                <span>trả lời</span>
                                            </div>,
                                            accessor: 'action_num',
                                            filterable: false,
                                            className: "justify-center",
                                            width: 120,
                                        },
                                        {
                                            Header: () => <div style={{ textAlign: "center", whiteSpace: "unset", wordBreak: "nomal", display: "grid" }}>
                                                <span>Lần trả lời</span>
                                                <span>cuối lúc</span>
                                            </div>,
                                            accessor: 'last_action.createdTime',
                                            filterable: false,
                                            className: "justify-center",
                                            width: 120,
                                            Cell: row => <div style={{ display: "grid" }}>
                                                <span>{moment(row.value).format("HH:MM")}</span>
                                                <span>{moment(row.value).format("DD/MM/YYYY")}</span>
                                            </div>
                                        },
                                        {
                                            Header: "Tác vụ",
                                            accessor: "_id",
                                            filterable: false,
                                            width: 120,
                                            Cell: row => <div>
                                                <Tooltip title="Kết quả trả lời khảo sát lần cuối" placement="left">
                                                    <IconButton title="Thực hiện khảo sát"
                                                        onClick={(e) => {
                                                            console.log("===> data: ", row.original.last_action)
                                                            if (row.original.last_action) {
                                                                setLastAction(row.original.last_action)
                                                                setOpen(true)
                                                            }
                                                        }}
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
                                {/* </div> */}

                                {/* </Container> */}
                            </CardContent>
                        </Card>
                    </div>
                }
            />
        </div>
    )

}
export default Question;