import React, { useEffect, useState, useMemo } from 'react';
import { Icon, IconButton, Typography, Button, Tooltip, Tab, Tabs } from '@material-ui/core';
import { FuseAnimateGroup, FusePageSimple, FuseChipSelect } from '@fuse';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import Widget1 from '../widgets/Widget1';
import Widget2 from '../widgets/Widget2';
// import _ from 'lodash';
import { Line } from 'react-chartjs-2';
// import history from '@history';
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import viLocale from "date-fns/locale/vi";
import * as APIRequest from "../GraphQLHelper";
import moment from 'moment';
import { useForm } from '@fuse/hooks';
// import { ReportAppointmentPDF } from '../PDFReport/ReportAppointmentPDF'
import { PDFExport } from '@progress/kendo-react-pdf';

const useStyles = makeStyles(theme => ({
  content: {
    '& canvas': {
      maxHeight: '100%'
    }
  },

}));

const initForm = {
  begin: moment().subtract(30, 'd'),
  end: new Date(),
  // timeFrame: '',

}
const initChartData = {
   total: [],
   cancel: [],
   complete: [],
   assign: [],
   processing: [],
   expired: [],
}
function JobReportGeneral(props) {
  const dispatch = useDispatch();
  const classes = useStyles(props);
  const {form: chartData, setForm: setChartData} = useForm(initChartData)
  // const pageLayout = useRef(null);
  // const [searchText, setSearchText] = useState('');
  // const [tabValue, setTabValue] = useState(0);
  const { form, setInForm } = useForm(initForm);
  const [realtimeData, setRealtimeData] = useState([]);
  const [reportData, setReportData] = useState([])
  const [pdfExportComponent, setPdfExportComponent] = useState(null);
  const [displayChart, setDisplayChart] = useState(null)

  function handleDateBeginChange(e) {
    setInForm('begin', e)
  }
  function handleDateEndChange(e) {
    setInForm('end', e)
  }

  const workingTimes = [];
  workingTimes.push({
    label: "Chọn khung giờ",
    value: ""
  });
  for (var i = 0; i < 24; i++) {
    var label = i < 10 ? `0${i}:00` : `${i}:00`
    workingTimes.push({
      label: label,
      value: label
    });
  }
  function getListDatesFromRange(startTime, endTime){
    var start = startTime,
        end = endTime,
        currentDate = new Date(start),
        between = []
    ;

    while (currentDate < end) {
        between.push(moment(new Date(currentDate)).format("YYYY-MM-DD"));
        currentDate.setDate(currentDate.getDate() + 1);
    }
    between.push(moment(new Date(endTime)).format("YYYY-MM-DD"));
    return between;
  }
  function getDataForChart(){
    var listDate = getListDatesFromRange(form.begin, form.end)
    var total = []
    var cancel = []
    var complete = []
    var assign = []
    var processing = []
    var expired = []
    var count = 0;
    listDate.forEach((item, i) => {
      count ++;
      APIRequest.getJobGeneralReportDetail({time: item, campaignIds: null}, dispatch).then(
        result =>{
          if(result.code === 0){
            //Set chart cho công việc đã giao
              if (result.data){
                total.push(result.data.total)
                cancel.push(result.data.cancel)
                complete.push(result.data.complete)
                assign.push(result.data.assign)
                processing.push(result.data.processing)
                expired.push(result.data.expired)
              }
              else{
                total.push(0)
                cancel.push(0)
                complete.push(0)
                assign.push(0)
                processing.push(0)
                expired.push(0)
              }
          }
        }
      )
    });
    if(count === listDate.length){
      setChartData({total: total, cancel: cancel, complete: complete, assign: assign, processing: processing, expired: expired})
    }
  }
  const createChartFromData = (valueData)=>{
    var listDate = getListDatesFromRange(form.begin, form.end)
    if(valueData){
      return {
        labels: listDate,
        datasets: [
          {
            fill: false,
            borderColor: "#808080",
            label: "Tổng số công việc",
            borderWidth: 1,
            data: valueData.total,
            backgroundColor: "#808080"
          },
          // {
          //   fill: false,
          //   borderColor: '#F6993F',
          //   label: "Chưa tiếp nhận",
          //   data: assign,
          //   backgroundColor: '#F6993F'
          // },
          // {
          //   fill: false,
          //   borderColor: '#3490DC',
          //   label: "Đang thực hiện",
          //   data: processing,
          //   backgroundColor: '#3490DC'
          // },
          // {
          //   fill: false,
          //   borderColor: '#38C172',
          //   label: "Đã hoàn thành",
          //   data: complete,
          //   backgroundColor: '#38C172'
          // },
          // {
          //   fill: false,
          //   borderColor: '#E3342F',
          //   label: "Đã hủy",
          //   data: cancel,
          //   backgroundColor: '#E3342F'
          // },
        ]
      }
    }
  }
  function reportJobGeneral() {
    APIRequest.getJobGeneralReport(form, dispatch).then(
      response => {
        if (response.code === 0){
          setRealtimeData(response.data);
        }
      }
    )
  }

  function searchReportJob(state) {

    APIRequest.getJobGeneralReport({ begin: moment(form.begin).format("YYYY-MM-DD"), end: moment(form.end).format("YYYY-MM-DD") }, dispatch).then(
      response => {
        setRealtimeData(response.data);
      }
    )
  }
  // useEffect(() =>{
  //   getDataForChart()
  // }, [realtimeData])
  useEffect(() => {
    reportJobGeneral();
  }, []);
  // function handleChipChange(value, name) {
  //   console.log("handeChipChange:", value);
  //   setForm(_.set({ ...form }, name, value));
  // }


  // function exportReportToExcel() {
  //   const ACCESS_TOKEN = "access_token";
  //   var access_token = localStorage.getItem(ACCESS_TOKEN);
  //   var fromDate = moment(form.begin).format("DD-MM-YYYY")
  //   var endDate = moment(form.end).format("DD-MM-YYYY")
  //   //https://api.telehub.elsaga.net/export/appointment?range=<range>&access_token=<access_token>
  //   var urlToOpen = 'https://api.telehub.elsaga.net/export/appointment?range=' + fromDate + '-' + endDate + '&access_token=' + access_token;
  //   // var urlToOpen = 'https://api.telehub.elsaga.net/export/smsbyphone?range='+fromDate+'-'+endDate+ '&key='+form.key+'&access_token='+ access_token;
  //   var win = window.open(urlToOpen, '_blank', 'toolbar=0,location=0,menubar=0');
  //   win.focus();
  // }

  return (
    <div>
      <FusePageSimple
        id="el-ReportAppointmentCover"
        classes={{
          toolbar: "min-h-80",
          rightSidebar: "w-288",
          content: classes.content,
        }}
        header={
          <div className="flex flex-1 items-center justify-between p-24 el-HeaderPage">
            <div className="flex report-action-header">
              <Typography variant="h6">Báo cáo công việc tổng quát</Typography>
              {/* <FuseAnimateGroup
                className="flex flex-wrap justify-center"
                enter={{
                  animation: "transition.slideUpBigIn"
                }}
                >
                <Button variant="contained" className="mx-20" color="secondary" onClick={exportReportToExcel}>
                  <Icon>import_export</Icon> Xuất excel
                </Button>
                <Button variant="contained" className="mx-20" color="secondary" onClick={() => { pdfExportComponent.save(); }}>
                  <Icon>assignment</Icon> In báo cáo
                </Button>
                <div style={{ position: "absolute", left: "-1000px", top: 0 }}>
                  <PDFExport
                paperSize="A4"
                margin="0.7cm"
                fileName = {`Báo cáo đặt lịch khám từ ${moment(form.begin).format("DD/MM/YYYY")} - ${moment(form.end).format("DD/MM/YYYY")}.pdf`}
                ref={(component) => setPdfExportComponent(component)}
                  >
                <ReportAppointmentPDF data = {reportData} begin = {form.begin} end = {form.end}/>
                  </PDFExport>
                </div>
              </FuseAnimateGroup> */}
            </div>
          </div>
        }
        content={
          <div className="p-12 el-coverContent">
            <div className="el-block-report">
              <Typography className="pl-12 text-15 font-bold mb-10 block-tittle">Lọc dữ liệu:</Typography>
              <div className='el-fillter-report-action'>
                <div className="el-flex-item flex-item-flex1">
                  <MuiPickersUtilsProvider utils={DateFnsUtils} locale={viLocale} >
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
                {/* <div className="el-flex-item flex-item-flex1">
                    <FuseChipSelect
                    margin='dense' size='small'
                    options={
                    workingTimes
                    }
                    // value={props.timeFrame && props.timeFrame.map((item)=>({label:item, value:item}))}
                    onChange={(value) => handleChipChange(value, 'timeFrame')}
                    placeholder="Chọn giờ làm việc"
                    textFieldProps={{
                    label: 'Chọn giờ làm việc',
                    InputLabelProps: {
                    shrink: true
                    },
                    variant: 'outlined'
                    }}
                    fullWidth
                    />
                </div> */}
                <FuseAnimateGroup
                  className="flex flex-wrap justify-center"
                  enter={{
                      animation: "transition.slideUpBigIn"
                  }}
                >
                  <Button variant="contained" className="mx-20" color="secondary" onClick={searchReportJob}>
                    <Icon>search</Icon> Lọc
                  </Button>
                </FuseAnimateGroup>

              </div>
            </div>
            <div className='el-block-report w-full p-12'>
              <Typography className="pl-12 text-15 font-bold mb-10 block-tittle">Thống kê công việc: </Typography>
              {
                useMemo(() => {
                  return (
                    <Line data={createChartFromData(chartData)} />
                  )
                }, [chartData])
              }
            </div>
            {realtimeData ?
              <div className='el-block-report'>
                <Typography className="pl-12 text-15 font-bold mb-10 block-tittle">Báo cáo tổng quát:</Typography>
                <FuseAnimateGroup
                  className="el-flex-row"
                  enter={{
                      animation: "transition.slideUpBigIn"
                  }}
                >
                  <div className="el-card-white">
                    <Widget1 widget={{ value: realtimeData.total, title: "Tổng số công việc" }} color="text-blue" />
                  </div>
                  <div className="el-card-white">
                    <Widget1 widget={{ value: realtimeData.total_member, title: "Tổng số người thực hiện" }} color="text-blue" />
                  </div>
                  <div className="el-card-white">
                    <Widget1 widget={{ value: realtimeData.avg_process, title: "Tiến trình trung bình" }} color="text-blue" />
                  </div>
                </FuseAnimateGroup>
                <FuseAnimateGroup
                  className="el-flex-row"
                  enter={{
                      animation: "transition.slideUpBigIn"
                  }}
                >
                  <div className="el-card-white">
                    <Widget2 widget={{ value: realtimeData.complete, title: "Đã hoàn thành" }} color="text-orange" />
                  </div>
                </FuseAnimateGroup>
                <FuseAnimateGroup
                  className="el-flex-row"
                  enter={{
                      animation: "transition.slideUpBigIn"
                  }}
                >
                  <div className="el-card-white">
                    <Widget2 widget={{ value: realtimeData.processing, title: "Đang thực hiện" }} color="text-orange" />
                  </div>
                  <div className="el-card-white">
                    <Widget2 widget={{ value: realtimeData.assign, title: "Chưa tiếp nhận" }} color="text-orange" />
                  </div>
                  <div className="el-card-white">
                    <Widget2 widget={{ value: realtimeData.cancel, title: "Đã hủy" }} color="text-orange" />
                  </div>
                  <div className="el-card-white">
                    <Widget2 widget={{ value: realtimeData.expired, title: "Quá hạn" }} color="text-orange" />
                  </div>
                </FuseAnimateGroup>
              </div>
            : null}


            {/* {realtimeData && realtimeData.departments ?
                <div  className='el-block-report'>
                <Typography className="pl-12 text-15 font-bold mb-10 block-tittle">Số lượt đặt khám theo Khoa/Phòng ban:</Typography>
                <div className="w-full flex flex-wrap">
                {
                realtimeData.departments && realtimeData.departments.map((item, index) =>
                <div key={index} className="w-full sm:w-1/2 md:w-1/4 px-12 el-card-white">
                <Widget2 widget={{ value: item.total, title: item.name ? item.name : "Khoa phòng ban đã bị xóa/không tồn tại" }} color="text-blue" />
                </div>)
                // realtimeData.map((item, index) =>
                //     <div key={index} className="w-full sm:w-1/2 md:w-1/4 px-12">
                //         <Widget2 widget={item} color="text-blue" />
                //     </div>)
                }
                </div>
                </div> : null
            } */}


          </div>
        }
      />
    </div>

  )
}

export default JobReportGeneral;
