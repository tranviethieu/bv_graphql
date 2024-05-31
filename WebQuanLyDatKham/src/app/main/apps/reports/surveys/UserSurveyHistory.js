import React, { useState, useEffect, useMemo } from 'react';
import { FusePageSimple } from '@fuse';
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
import * as Actions from './actions';
import history from '@history';
import AnswerPreview from './Dialog/AnswerPreview'
import { useForm } from '@fuse/hooks';


const useStyles = makeStyles(theme => ({
  content: {
      '& canvas': {
          maxHeight: '100%'
      }
  },
}));
const initForm = {
    begin: moment().day(-7).format("YYYY-MM-DD"),
    end: moment().format("YYYY-MM-DD"),
    timeFrame: '',
}

function UserSurveyHistory(props) {
    const classes = useStyles();
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
        const phone = props.match.params.phone;
        if (phone) {
            // Actions.get
            const { page, pageSize, filtered, sorted, } = state
            var tempSort = [...sorted, { id: "createdTime", desc: true }]
            var tempFiltered = [...filtered, { id: "action", value: "SURVEY" }]
            setPageSize(pageSize)
            Actions.getUserActions(page, pageSize, tempFiltered, tempSort, phone, dispatch)
                .then(response => {
                    console.log("===> survey history: ", response)
                    setSurveys(response);
                })
        }
    }
    function fetchUserData() {
        const phone = props.match.params.phone;
        if (phone) {
            Actions.getUserByPhone({ phone }, dispatch)
                .then(response => {
                    console.log("==> user: ", response)
                    setUser(response.data)
                })
        }
    }
    useEffect(() => {
        fetchUserData()
    }, [])

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
          <AnswerPreview open={open} onCloseDialog={handleCloseDialog} user={data && data.user} result={data && data.survey_result && data.survey_result.data} title={data && data.survey_result && data.survey_result.survey.title} />
          <FusePageSimple
            classes={{
              toolbar: "min-h-48 h-48",
              rightSidebar: "w-288",
              content: classes.content
            }}
            header={
              <div className="flex flex-1 w-full items-center justify-between p-24 el-HeaderPage">
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
                </div>
              </div>
            }
            content={
              <div className="p-12 el-coverContent">
                <div className="el-block-report">
                  <Typography className="pl-12 text-15 font-bold mb-10 block-tittle">Lọc dữ liệu:</Typography>
                  <div className="el-fillter-report-action">
                    {
                      useMemo(() => {
                        return (
                          <div className="el-flex-item flex-item-flex1">
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
                              disabled
                            />
                          </div>
                        )
                      }, [user])
                    }
                    {
                      useMemo(() => {
                        return (
                          <div className="el-flex-item flex-item-flex1">
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
                              disabled
                            />
                          </div>
                        )
                      }, [user])
                    }
                    {
                      useMemo(() => {
                        return (
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
                </div>
                <div className="el-block-report">
                  <Typography className="pl-12 text-15 font-bold mb-10 block-tittle">Lịch sử khảo sát của khách hàng:</Typography>
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
                        accessor: 'survey_result.survey.name',
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
                        accessor: 'survey_result.survey.title',
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
                        accessor: 'survey_result.survey.createdTime',
                        className: "justify-center",
                        filterable: false,
                        width: 120,
                        Cell: row => <div>{row.value && moment(row.value).format("DD/MM/YYYY")}</div>
                      },
                      {
                        Header: "Số câu hỏi",
                        filterable: false,
                        accessor: "survey_result.survey.questionIds",
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
                </div>
              </div>
            }
          />
        </div>
    )
}
export default UserSurveyHistory;
