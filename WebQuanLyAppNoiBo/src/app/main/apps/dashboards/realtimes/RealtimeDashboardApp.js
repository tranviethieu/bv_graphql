import React, { useEffect, useState, useMemo } from 'react';
import { Icon, IconButton, Paper, Input, Tab, Tabs, Typography, Button, Tooltip, FormControlLabel, Radio, RadioGroup } from '@material-ui/core';
import { FuseAnimateGroup, FusePageSimple, FuseAnimate } from '@fuse';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles, withStyles } from '@material-ui/styles';
import Widget1 from './widgets/Widget1';
import Widget2 from './widgets/Widget2';
import ReactTable from 'react-table';
import { showUserDialog, showUserActionDialog, showAppointmentDialog } from '../../shared-dialogs/actions'
import * as APIRequest from "./GraphQLHelper";
import * as StringUtils from "../../utils/StringUtils";
import moment from 'moment';
import { useForm } from '@fuse/hooks';
import { showAppointmentStateDialog } from '../../shared-dialogs/actions/AppointmentDialog.action'
import { toggleCallPanel } from 'app/fuse-layouts/shared-components/CallOutPanel/store/actions'
// import * as APIRequest from "../../reports/GraphQLHelper";
import CheckCircle from '@material-ui/icons/CheckCircle'
import { green } from '@material-ui/core/colors';
import { PDFRealtimeDashboard } from '../../PDFReport/PDFRealtimeDashboard'
import { PDFExport } from '@progress/kendo-react-pdf';

const GreenRadio = withStyles({
  root: {
    color: green[400],
    '&$checked': {
      color: green[600],
    },
  },
  checked: {},
})(props => <Radio color="default" {...props} />);

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
  begin: moment(),
  end: moment().add(1, 'days'),
  // timeFrame: '',
}

function RealtimeDashboardApp(props) {
  const dispatch = useDispatch();
  const classes = useStyles(props);
  const [searchText, setSearchText] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [pdfExportComponent, setPdfExportComponent] = useState(null);
  const { form, setInForm } = useForm(initForm);
  const [realtimeData, setRealtimeData] = useState([]);
  const [appointmentTodays, setAppointmentTodays] = useState([]);

  const [userActionsWebData, setUserActionsWebData] = useState([]);
  const [userActionsCRMData, setUserActionsCRMData] = useState([]);
  const [userActionsAppData, setUserActionsAppData] = useState([]);
  const [userActionsFacebookData, setUserActionsFacebookData] = useState([]);
  const [userActionsZaloData, setUserActionsZaloData] = useState([]);
  const [appointmentWaitingData, setAppointmentWaitingData] = useState([]);
  const [appointmentHospitalData, setAppointmentHospitalData] = useState([]);

  const [userActionsTotalCount, setUserActionsTotalCount] = useState(0);
  const [userActionsCRMCount, setUserActionsCRMCount] = useState(0);
  const [userActionsWebCount, setUserActionsWebCount] = useState(0);
  const [userActionsAppCount, setUserActionsAppCount] = useState(0);
  const [userActionsFacebookCount, setUserActionsFacebookCount] = useState(0);
  const [userActionsZaloCount, setUserActionsZaloCount] = useState(0);
  const [appointmentWaitingCount, setAppointmentWaitingCount] = useState(0);
  const [appointmentHospitalCount, setAppointmentHospitalCount] = useState(0);

  const [stateFilter, setStateFilter] = useState("");
  const [displayData, setDisplayData] = useState([])

  function handleChangeTab(event, tabValue) {
    setTabValue(tabValue);
    if (tabValue === 0) {
      setDisplayData(appointmentTodays.data);
      setStateFilter("WAITING");
    }
    else if (tabValue === 1) {
      setDisplayData(appointmentWaitingData)
    }
    else if (tabValue === 2) {
      setDisplayData(userActionsCRMData)
    }
    else if (tabValue === 3) {
      setDisplayData(userActionsWebData)
    }
    else if (tabValue === 4) {
      setDisplayData(userActionsAppData)
    }
    else if (tabValue === 5) {
      setDisplayData(userActionsFacebookData)
    }
    else if (tabValue === 6) {
      setDisplayData(userActionsZaloData)
    }
    else if (tabValue === 7) {
      setDisplayData(appointmentHospitalData)
    }
  }
  function dataFilterByState() {
    return displayData.filter(d => d.state.indexOf(stateFilter) >= 0);
  }

  const handleClickOpen = (type) => {
    // dispatch(showUserActionDialog({rootClass: classes.root,  phoneNumber: "", type: type, className: "el-coverUAD" }))
    dispatch(showAppointmentDialog({ onSuccess: fetchData }));
  };
  function fetchData() {
    // var {filtered } = state;
    // setPageSize(pageSize)
    // if (filtered) {
    //   filtered = filtered.filter((item) => {
    //     return item.id !== "action" && item.id !== "createdTime";
    //   })
    // } else {
    //   filtered = []
    // }
    //lẽ ra list này phải lọc cả ngày trước đó nếu như chưa được xử lý
    // filtered.push({
    //   id: 'createdTime', value: `${moment().format("DD/MM/YYYY")}`, operation: ">="
    // });
    var filtered = [
      {
        value: `CreatedTime:{$gte:ISODate('${moment().format("YYYY-MM-DD")}')}`, operation: "custom"
      },
      { id: "inputPatient.FullName,inputPatient.PhoneNumber", value: searchText }
    ];

    // filtered.push({
    //   value: `CreatedTime:{$gte:ISODate('${moment().format("YYYY-MM-DD")}')}`, operation: "custom"
    // })

    const sorted = [{ id: "createdTime", desc: true }]
    APIRequest.get_appointments({ sorted, filtered }, dispatch).then(
      response => {
        setAppointmentTodays(response);
        setDisplayData(response.data)
        if (response != null && response.data != null) {
          response.data ? setUserActionsTotalCount(response.data.length)
            : setUserActionsTotalCount(0)

          var tmpArray = response.data.filter(t => t.channel === 'CRM');
          tmpArray ? setUserActionsCRMCount(tmpArray.length)
            : setUserActionsCRMCount(0)
          setUserActionsCRMData(tmpArray);

          var tmpArray1 = response.data.filter(t => t.channel === 'APP');
          tmpArray1 ? setUserActionsAppCount(tmpArray1.length)
            : setUserActionsAppCount(0)
          setUserActionsAppData(tmpArray1);

          var tmpArray2 = response.data.filter(t => t.channel === 'FBMESSENGER');
          tmpArray2 ? setUserActionsFacebookCount(tmpArray2.length) : setUserActionsFacebookCount(0)
          setUserActionsFacebookData(tmpArray2);

          var tmpArray3 = response.data.filter(t => t.channel === 'WEB');
          tmpArray3 ? setUserActionsWebCount(tmpArray3.length)
            : setUserActionsWebCount(0)
          setUserActionsWebData(tmpArray3);

          var tmpArray4 = response.data.filter(t => t.channel === 'ZALOMESSENGER');
          tmpArray4 ? setUserActionsZaloCount(tmpArray4.length) : setUserActionsZaloCount(0)
          setUserActionsZaloData(tmpArray4);

          var tmpArray5 = response.data.filter(t => t.channel === 'HOSPITAL');
          tmpArray5 ? setAppointmentHospitalCount(tmpArray5.length) : setAppointmentHospitalCount(0)
          setAppointmentHospitalData(tmpArray5);

          var tmpArray6 = response.data.filter(t => t.state === 'WAITING');
          tmpArray6 ? setAppointmentWaitingCount(tmpArray6.length) : setAppointmentWaitingCount(0)
          setAppointmentWaitingData(tmpArray6);
        }
      }
    )
  }

  function reportAppointmentByIndex() {
    APIRequest.getReportAppointmentIndex({ begin: moment(form.begin).format("YYYY-MM-DD"), end: moment(form.end).format("YYYY-MM-DD") }, dispatch).then(
      response => {
        setRealtimeData(response.data);
      }
    )
  }

  function fetchAll() {
    fetchData();
    reportAppointmentByIndex();
  }

  useEffect(() => {
    fetchAll();
  }, [dispatch]);
  ///search text
  useEffect(() => {
    fetchData();
  }, [searchText]);

  return (
    <div>
      <FusePageSimple
        classes={{
          toolbar: "min-h-48 h-48",
          rightSidebar: "w-288",
          content: classes.content,
        }}
        contentToolbar={
          <Tabs
            value={tabValue}
            onChange={handleChangeTab}
            indicatorColor="secondary"
            textColor="secondary"
            variant="scrollable"
            scrollButtons="off"
            className="w-full border-b-1 px-24 el-Tabs"
          >
            <Tab className="text-14 font-600 normal-case" label={`Đặt trong ngày (${userActionsTotalCount})`} />
            <Tab className="text-14 font-600 normal-case" label={`Đặt khám chờ duyệt (${appointmentWaitingCount})`} />
            <Tab className="text-14 font-600 normal-case" label={`Đặt từ CRM (${userActionsCRMCount})`} />
            <Tab className="text-14 font-600 normal-case" label={`Đặt từ Website (${userActionsWebCount})`} />
            <Tab className="text-14 font-600 normal-case" label={`Đặt từ Ứng dụng (${userActionsAppCount})`} />
            <Tab className="text-14 font-600 normal-case" label={`Đặt từ Facebook (${userActionsFacebookCount})`} />
            <Tab className="text-14 font-600 normal-case" label={`Đặt từ Zalo (${userActionsZaloCount})`} />
            <Tab className="text-14 font-600 normal-case" label={`Đặt khám tại viện (${appointmentHospitalCount})`} />
          </Tabs>
        }
        header={
          <div className="flex flex-1 items-center justify-between p-24 el-HeaderPage">
            <div className="flex flex-col">
              <Typography variant="h6">Yêu cầu mới đặt</Typography>
            </div>
            <div>
              <IconButton onClick={fetchAll}>
                <Icon>
                  refresh
                </Icon>
              </IconButton>
              <Button
                className="whitespace-no-wrap el-ButtonHeader btn-blue"
                variant="contained"
                onClick={() => handleClickOpen("APPOINTMENT")}
              >
                <span className="hidden sm:flex">Tạo lịch khám</span>
              </Button>
              <Button variant="contained" className="mx-20" color="secondary" onClick={() => { pdfExportComponent.save(); }}>
                <Icon>assignment</Icon> In báo cáo
              </Button>
              <div style={{ position: "absolute", left: "-1000px", top: 0 }}>
                <PDFExport
                  paperSize="A4"
                  margin="0.7cm"
                  landscape = "true"
                  fileName = {`Báo cáo đặt khám online từ ${moment(form.begin).format("DD/MM/YYYY")} - ${moment(form.end).format("DD/MM/YYYY")}.pdf`}
                  ref={(component) => setPdfExportComponent(component)}
                >
                  <PDFRealtimeDashboard data = {dataFilterByState()} begin = {form.begin} end = {form.end} tabValue = {tabValue} stateFilter = {stateFilter}/>
                </PDFExport>
              </div>
            </div>
          </div>
        }
        content={
          <div className="p-12 el-coverContent" id="el-RealtimeDashboardApp-Cover">
            {tabValue === 0 && form && (
              <div className="el-RealTime-Cover">
                <FuseAnimateGroup
                  className="flex flex-wrap"
                  enter={{
                    animation: "transition.slideUpBigIn"
                  }}
                >
                  {realtimeData ?
                    <div className="el-block-report">
                      <Typography className="pl-12 text-15 font-bold mb-10 block-tittle">Báo cáo tổng quát:</Typography>
                      <FuseAnimateGroup
                        className="el-flex-row"
                        enter={{
                          animation: "transition.slideUpBigIn"
                        }}
                      >

                        <div className="el-card-white">
                          <Widget1 widget={{ value: realtimeData.total, title: "Tổng đặt khám trong ngày" }} color="text-blue" />
                        </div>
                        <div className="el-card-white">
                          <Widget2 widget={{ value: realtimeData.crms, title: "Đặt khám qua CRM" }} color="text-orange" />
                          <Widget2 widget={{ value: realtimeData.fbchats, title: "Đặt khám qua Facebook" }} color="text-orange" />
                        </div>
                        <div className="el-card-white">
                          <Widget2 widget={{ value: realtimeData.webs, title: "Đặt khám qua Website" }} color="text-orange" />
                          <Widget2 widget={{ value: realtimeData.zalochats, title: "Đặt khám qua Zalo" }} color="text-orange" />
                        </div>
                        <div className="el-card-white">
                          <Widget2 widget={{ value: realtimeData.apps, title: "Đặt khám qua Ứng dụng" }} color="text-orange" />
                          <Widget2 widget={{ value: realtimeData.hospitals, title: "Đặt khám tại Bệnh viện" }} color="text-orange" />
                        </div>
                        <div className="el-card-white">
                          <Widget2 widget={{ value: realtimeData.serves, title: "Đã đến khám" }} color="text-orange" />
                        </div>
                        <div className="el-card-white">
                          <Widget2 widget={{ value: realtimeData.cancels, title: "Không đến khám" }} color="text-orange" />
                        </div>
                        <div className="el-card-white">
                          <Widget2 widget={{ value: realtimeData.approves, title: "Đã duyệt" }} color="text-orange" />
                        </div>
                        <div className="el-card-white">
                          <Widget2 widget={{ value: realtimeData.waitings, title: "Chưa xác nhận" }} color="text-orange" />
                        </div>
                      </FuseAnimateGroup>
                    </div>
                    : null}

                </FuseAnimateGroup>
              </div>

            )}

            <div className="w-full p-12 el-cover-table1">
              <div className="w-full p-12 el-TitleHeader-Table flex flex-row">
                <h3 className="text-white" style={{ width: 300 }}>Danh sách đặt khám</h3>
                <div className="flex w-full text-white" style={{ justifyContent: "flex-end" }}>
                  <RadioGroup
                    aria-label="Status"
                    name="status"
                    className=""
                    row
                    value={stateFilter}
                    onChange={e => setStateFilter(e.target.value)}
                  >
                    <FormControlLabel value="WAITING" control={<GreenRadio />} label="Chờ duyệt" />
                    <FormControlLabel value="APPROVE" control={<GreenRadio />} label="Đã duyệt" />
                    <FormControlLabel value="" control={<GreenRadio />} label="Tất cả" />
                  </RadioGroup>
                  <FuseAnimate animation="transition.slideLeftIn" delay={100}>
                    <Paper className="flex p-4 items-center w-1/2 px-8 py-4" elevation={1}>

                      <Icon className="mr-8" color="action">search</Icon>

                      <Input
                        placeholder="Tên/số điện thoại khách hàng"
                        className="w-full el-search-report"
                        disableUnderline
                        fullWidth
                        value={searchText}
                        inputProps={{
                          'aria-label': 'Search'
                        }}
                        onChange={ev =>
                          setSearchText(ev.target.value.replace(/[^0-9a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s]/gi, ''))
                        }
                      />
                    </Paper>
                  </FuseAnimate>

                </div>

              </div>
              {
                useMemo(() => <ReactTable
                  className="-striped -highlight h-full w-full sm:rounded-8 overflow-hidden el-TableUserActionReport"
                  data={dataFilterByState()}
                  showPagination={false}
                  pageSize={dataFilterByState().length || 3}
                  noDataText="Không có dữ liệu nào"
                  sortable={false}
                  columns={[
                    {
                      Header: "#",
                      width: 50,
                      Cell: row => <div>{row.index + 1}</div>
                    },
                    {
                      Header: "Khách hàng",
                      accessor: "inputPatient.fullName",
                      Cell: row => <div>
                        <Button color="secondary" onClick={e => dispatch(showAppointmentDialog({ _id: row.original._id, onSuccess: fetchData }))}>{row.value}</Button>
                      </div>,
                    },
                    {
                      Header: "Số ĐT",
                      accessor: "inputPatient.phoneNumber",
                    },
                    {
                      Header: "Ngày sinh",
                      width: 65,
                      accessor: "inputPatient.birthDay",
                      Cell: row => <div>{moment(row.value).format("DD")} </div>
                    },
                    {
                      Header: "Tháng sinh",
                      width: 85,
                      accessor: "inputPatient.birthDay",
                      Cell: row => <div>{moment(row.value).format("MM")} </div>
                    },
                    {
                      Header: "Năm sinh",
                      width: 50,
                      accessor: "inputPatient.birthDay",
                      Cell: row => <div>{moment(row.value).format("YYYY")} </div>
                    },
                    {
                      Header: 'Giới tính',
                      accessor: 'inputPatient.gender',
                      width: 80,
                      Cell: row => <Typography>
                        {row.value === "1" ? "Nam" : "Nữ"}
                      </Typography>
                    },
                    {
                      Header: "Thời gian khám",
                      accessor: "appointmentDate",
                      Cell: row => <div>{moment(row.value).format("DD/MM")} {row.original.appointmentTime} </div>
                    },
                    {
                      Header: "Thời gian đặt",
                      accessor: "createdTime",
                      Cell: row => <div>{moment(row.value).format("DD/MM HH:mm")}</div>
                    },
                    {
                      Header: "Kênh",
                      accessor: "channel",
                      Cell: row => <div>
                        {StringUtils.parseChannel(row.value)}
                      </div>
                    },
                    {
                      Header: "Khoa/Phòng ban",
                      accessor: "department.name",
                      Cell: row => <div>
                        {
                          row.value ? row.value : "Khoa phòng ban đã bị xóa/không tồn tại"
                        }
                      </div>
                    },
                    {
                      Header: "Nội dung khám",
                      accessor: "note",

                    },
                    {
                      Header: "Trạng thái",
                      width: 80,
                      accessor: "state",
                      Cell: row => <div>
                        <Tooltip title={row.value === "WAITING" ? "Chờ duyệt" : row.value === "CANCEL" ? "Đã hủy" : row.value === "SERVED" ? "Đã phục vụ" : "Đã duyệt"} placement="bottom">
                          <IconButton onClick={(e) => {
                            dispatch(showAppointmentStateDialog({ data: row.original ,onSuccess:fetchData}))
                          }}>
                            {
                              row.value === "WAITING" ? <Icon className="text-orange">radio_button_unchecked</Icon>
                              : row.value === "CANCEL" ? <Icon className="text-red">remove_circle</Icon>
                              : row.value === "SERVED" ? <CheckCircle style={{ color: "royalblue" }} />
                              : <Icon className="text-green">check_circle</Icon>
                            }
                          </IconButton>
                        </Tooltip>
                      </div>
                    },
                    {
                      Header: "Tác vụ",
                      width: 70,
                      accessor: "id",
                      Cell: row => <div className="el-RealTimeIconButton">
                        <IconButton onClick={e => dispatch(toggleCallPanel(row.original.inputPatient.phoneNumber))}><Icon className="text-green">call</Icon></IconButton>
                      </div>
                    }
                  ]}
                />, [displayData, stateFilter])
              }

            </div>
          </div>

        }
      />

    </div>

  )
}

export default RealtimeDashboardApp;
