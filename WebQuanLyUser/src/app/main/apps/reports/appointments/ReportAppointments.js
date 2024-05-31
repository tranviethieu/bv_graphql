import React, { useEffect, useState, useMemo } from 'react';
import { Icon, IconButton, Typography, Button, Tooltip } from '@material-ui/core';
import { FuseAnimateGroup, FusePageSimple, FuseChipSelect, FuseAnimate } from '@fuse';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import Widget1 from '../widgets/Widget1';
import Widget2 from '../widgets/Widget2';
// import ReactTable from 'react-table';
import _ from 'lodash';
import moment from 'moment';
import { useForm } from '@fuse/hooks';
import DemoFilter from '../../DemoFilter/TableFilter';
import { ReportAppointmentPDF } from '../../PDFReport/ReportAppointmentPDF'
import { PDFExport } from '@progress/kendo-react-pdf';
import { Line, Pie } from 'react-chartjs-2';
import * as Actions from './actions';
const useStyles = makeStyles(theme => ({
  content: {
    '& canvas': {
      maxHeight: '100%'
    }
  },

}));
const initialFilterAttributes = [
  {
    name: 'begin',
    label: 'Từ ngày',
    type: 'date',
    defaultValue: moment().add('days', -7).format("YYYY-MM-DD")
  },
  {
    name: "end",
    label: "Đến ngày",
    type: 'date',
    defaultValue: moment().format("YYYY-MM-DD")
  },
  {
    name: "departmentId",
    label: "Khoa khám",
    type: 'select'
  }
]

const createLineChartFromData = (chartData) => {
  // console.log("createChartData:",valueData,listDate);
  if (chartData) {
    return (
      {
        labels: chartData.map(c => c.date),
        datasets: [
          {
            fill: false,
            borderColor: "#808080",
            label: "Tổng số đặt khám",
            borderWidth: 1,
            data: chartData.map(c => c.total),
            backgroundColor: "#808080"
          },
          {
            fill: false,
            borderColor: '#F6993F',
            label: "Chưa xác nhận",
            data: chartData.map(d => d.waitings),
            borderWidth: 1,
            backgroundColor: '#F6993F'
          },
          {
            fill: false,
            borderColor: 'royalblue',
            label: "Đã đến khám",
            data: chartData.map(d => d.serves),
            borderWidth: 1,
            backgroundColor: 'royalblue'
          },
          {
            fill: false,
            borderColor: '#38C172',
            label: "Đã duyệt",
            data: chartData.map(d => d.approves),
            borderWidth: 1,
            backgroundColor: '#38C172'
          },
          {
            fill: false,
            borderColor: '#E3342F',
            label: "Không đến khám",
            data: chartData.map(d => d.cancels),
            borderWidth: 1,
            backgroundColor: '#E3342F'
          },
        ]
      }
    )
  }
}

const createPieChartFromData = (data, type) => {
  var channelData = data?[data.crms, data.webs, data.apps, data.fbchats, data.zalochats]:[0,0,0,0]
  var stateData = data?[data.cancels, data.approves, data.waitings, data.serves]:[0,0,0,0]
  var labelState = ["Không đến khám", "Đã duyệt", "Chưa xác nhận", "Đã đến khám"]
  var labelChannel = ['CRM', "Website", "Ứng dụng", "FacebookChat", "ZaloChat"]
  var stateColor = ['royalblue', '#38C172', '#F6993F', '#E3342F']
  var channelColor = ["#63FF84", "#6384FF", '#38C172', '#F6993F', '#E3342F']
  return {
    labels: type === "state" ? labelState : labelChannel,
    datasets: [
      {
        label: 'Biểu đồ thống kê',
        fill: true,
        backgroundColor: type === "state" ? stateColor : channelColor,
        hoverBackgroundColor: type === "state" ? stateColor : channelColor,
        borderColor: "white",
        borderWidth: 2,
        data: type === "state" ? stateData : channelData,
      },
    ],
  };
}

function exportReportToExcel(formFiltered) {
  const fromDate = formFiltered["begin"];
  const endDate = formFiltered["end"];
  const ACCESS_TOKEN = "access_token";
  var access_token = localStorage.getItem(ACCESS_TOKEN);
  var urlToOpen = `${process.env.REACT_APP_API_HOST}/export/appointment?range=${fromDate}-${endDate}&access_token=${access_token}`;
  var win = window.open(urlToOpen, '_blank', 'toolbar=0,location=0,menubar=0');
  win.focus();
}

function RealtimeDashboardApp(props) {
  const dispatch = useDispatch();
  const classes = useStyles(props);
  const [pdfExportComponent, setPdfExportComponent] = useState(null);
  const [reportData, setReportData] = useState([])
  const user = useSelector(({ auth }) => auth.user.data);
  const [pieData, setPieData] = useState([]);
  const [formFiltered, setFormFiltereds] = useState({ begin: moment().add('days', -7).format("YYYY-MM-DD"), end: moment().format("YYYY-MM-DD") });
  const [filterAttributes, setFilterAttributes] = useState(initialFilterAttributes)
  const [departments, setDepartments] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [ appointmentManager, setAppointmentManager] = useState(false)

  useEffect(()=>{
    if(user.defaultGroup && user.defaultGroup.permissions){
      const isManager = user.defaultGroup.permissions.includes("is_appointment_management")
      setAppointmentManager(isManager)
    }
  },[user])
  function refetchData() {
    // console.log("Bộ lọc", formFiltered);
    Actions.getReportAppointmentByDay(formFiltered, dispatch).then(response => {
      setChartData(response.data);
    })
    Actions.getReportAppointmentIndex(formFiltered, dispatch).then(response => {
      setPieData(response.data);
    });
    getReportUserActions();
  };
  function fetchReportData(filter_option, sort_option){
    Actions.getUserActions({sorted: sort_option, filtered: filter_option }, dispatch).then(
      response => {
        // console.log("report data:", response.data);
        setReportData(response.data);
      }
    )
  }
  function getReportUserActions() {
    const filtered = [{ id: 'action', value: 'APPOINTMENT' }, { id: 'createdTime', value: `${moment(formFiltered.begin).format("DD/MM/YYYY")},${moment(formFiltered.end).add(1, 'days').format("DD/MM/YYYY")}`, operation: "between" }];
    const sorted = [{ id: "createdTime", desc: true }]
    fetchReportData(filtered, sorted);
  }
  useEffect(() => {
    if(appointmentManager){
      Actions.getDepartments(dispatch).then(response => {
        setDepartments([
          ...response.data.map(d => ({
            value: d._id, label: d.name
          }))]);
      })
    }
    else{
      if(user.department){
        setDepartments([{value: user.department._id, label: user.department.name}])
      }
    }
  }, [appointmentManager]);
  useEffect(() => {
    refetchData();
  }, [formFiltered])

  useEffect(() => {
    const departmentIdAtt = initialFilterAttributes.find(a => a.name === 'departmentId');
    departmentIdAtt.options = departments;
    setFilterAttributes([...initialFilterAttributes]);
  }, [departments]);

  function onSubmitFilter(filtered) {
    setFormFiltereds({ ...filtered });
  }

  return (
    <FusePageSimple
      id="el-ReportAppointmentCover"
      classes={{
        toolbar: "min-h-80",
        rightSidebar: "w-288",
        content: classes.content,
      }}

      header={
        <div className="flex flex-1 items-center justify-between p-24 el-HeaderPage">
          <div className="flex flex-col">
            <div className="flex items-center mb-4">
              <Icon className="text-18" color="action">home</Icon>
              <Icon className="text-16" color="action">chevron_right</Icon>
              <Typography color="textSecondary">Báo cáo</Typography>

            </div>
            <FuseAnimate>
              <Typography variant="h6">Báo cáo tổng hợp</Typography>
            </FuseAnimate>
          </div>
          <DemoFilter
            filterOption={{ attributes: filterAttributes, onSubmitFilter }}
            customElements={[
              <Button startIcon={<Icon>import_export</Icon>} variant="contained" onClick={e => { exportReportToExcel(formFiltered) }}>Xuất Excel</Button>,
              <Button startIcon={<Icon>assignment</Icon>} variant="contained" onClick={() => { pdfExportComponent.save(); }}>In báo cáo</Button>]}
          />
          <div style={{ position: "absolute", left: "-1000px", top: 0 }}>
            <PDFExport
              paperSize="A4"
              margin="0.7cm"
              fileName={`Báo cáo tổng hợp đặt khám từ ${moment(formFiltered.begin).format("DD/MM/YYYY")} - ${moment(formFiltered.end).format("DD/MM/YYYY")}.pdf`}
              ref={(component) => setPdfExportComponent(component)}
            >
              <ReportAppointmentPDF data={reportData} begin={formFiltered.begin} end={formFiltered.end} />
            </PDFExport>
          </div>
        </div>
      }
      content={
        <div className="flex flex-wrap p-12 el-coverContent">
          {pieData ?
            <div className='el-block-report w-full mx-8'>
              <Typography className="pl-12 text-15 font-bold mb-10 block-tittle">Báo cáo tổng quát:</Typography>
              <FuseAnimateGroup
                className="el-flex-row"
                enter={{
                  animation: "transition.slideUpBigIn"
                }}
              >
                <div className="el-card-white">
                  <Widget1 widget={{ value: pieData.total, title: "Tổng đặt khám" }} color="text-blue" />
                </div>
                <div className="el-card-white">
                  <Widget2 widget={{ value: pieData.crms, title: "Đặt khám qua CRM" }} color="text-orange" />
                  <Widget2 widget={{ value: pieData.fbchats, title: "Đặt khám qua Facebook" }} color="text-orange" />
                </div>
                <div className="el-card-white">
                  <Widget2 widget={{ value: pieData.webs, title: "Đặt khám qua Website" }} color="text-orange" />
                  <Widget2 widget={{ value: pieData.zalochats, title: "Đặt khám qua Zalo" }} color="text-orange" />
                </div>
                <div className="el-card-white">
                  <Widget2 widget={{ value: pieData.apps, title: "Đặt khám qua Ứng dụng" }} color="text-orange" />
                  <Widget2 widget={{ value: pieData.hospitals, title: "Đặt khám tại Bệnh viện" }} color="text-orange" />
                </div>
                <div className="el-card-white">
                  <Widget2 widget={{ value: pieData.serves, title: "Đã đến khám" }} color="text-orange" />
                </div>
                <div className="el-card-white">
                  <Widget2 widget={{ value: pieData.cancels, title: "Không đến khám" }} color="text-orange" />
                </div>
                <div className="el-card-white">
                  <Widget2 widget={{ value: pieData.approves, title: "Đã duyệt" }} color="text-orange" />
                </div>
                <div className="el-card-white">
                  <Widget2 widget={{ value: pieData.waitings, title: "Chưa xác nhận" }} color="text-orange"/>
                </div>
              </FuseAnimateGroup>
            </div>
          : null}



          <div className="lg:w-1/2 sm:w-full px-8">
            <div className='el-block-report'>
              <Typography className="pl-12 text-15 font-bold mb-10 block-tittle">Thống kê đặt khám theo thời gian:</Typography>
              <div>
                {
                  useMemo(() => {
                    return (
                      <Line data={createLineChartFromData(chartData)} />
                    )
                  }, [chartData])
                }
              </div>
            </div>
          </div>
          {pieData && pieData.departments ?
            <div className="lg:w-1/2 sm:w-full px-8">
              <div className='el-block-report'>
                <Typography className="pl-12 text-15 font-bold mb-10 block-tittle">Số lượt đặt khám theo Khoa/Phòng ban:</Typography>
                <div className="w-full flex flex-wrap">
                  {
                    pieData.departments && pieData.departments.map((item, index) =>
                      <div key={index} className="w-full sm:w-1/2 md:w-1/4 px-12 el-card-white">
                        <Widget2 widget={{ value: item.total, title: item.name ? item.name : "Khoa phòng ban đã bị xóa/không tồn tại" }} color="text-blue" />
                      </div>)
                  }
                </div>
              </div>
            </div> : null
          }
          <div className="flex flex-wrap w-full">
            <div className='el-card-white'>
              <Typography className="pl-12 text-15 font-bold mb-10 block-tittle">Thống kê đặt khám theo trạng thái:</Typography>
              <div>
                {
                  useMemo(() => {
                    return (
                      <Pie data={createPieChartFromData(pieData, 'state')} />
                    )
                  }, [pieData])
                }
              </div>
            </div>
            <div className='el-card-white'>
              <Typography className="pl-12 text-15 font-bold mb-10 block-tittle">Thống kê đặt khám theo kênh:</Typography>
              <div>
                {
                  useMemo(() => {
                    return (
                      <Pie data={createPieChartFromData(pieData, 'channel')} />
                    )
                  }, [pieData])
                }
              </div>
            </div>
          </div>
        </div>

      }
    />

  )
}

export default RealtimeDashboardApp;
