import React, { useEffect, useState } from 'react';
import { Icon, IconButton, Typography, Button, Tooltip, Tab, Tabs } from '@material-ui/core';
import { FuseAnimateGroup, FusePageSimple, FuseChipSelect } from '@fuse';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import Widget1 from '../widgets/Widget1';
import Widget2 from '../widgets/Widget2';
import { Line } from 'react-chartjs-2';
// import _ from 'lodash';
// import history from '@history';
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import viLocale from "date-fns/locale/vi";
import * as APIRequest from "../GraphQLHelper";
import moment from 'moment';
import { useForm } from '@fuse/hooks';
// import { ReportAppointmentPDF } from '../PDFReport/ReportAppointmentPDF'
// import { PDFExport } from '@progress/kendo-react-pdf';
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
function JobReportSelf(props) {
  const dispatch = useDispatch();
  const classes = useStyles(props);
  // const pageLayout = useRef(null);
  const {form: chartData, setForm: setChartData} = useForm(initChartData)
  // const [searchText, setSearchText] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const { form, setInForm } = useForm(initForm);
  //Dữ liệu member
  const [realtimeData, setRealtimeData] = useState([]);
  //Dữ liệu owner
  const [ownerData, setOwnerData] = useState([]);
  // const [reportData, setReportData] = useState([])
  // const [pdfExportComponent, setPdfExportComponent] = useState(null);
  function handleDateBeginChange(e) {
    setInForm('begin', e)
  }
  function handleDateEndChange(e) {
    setInForm('end', e)
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
  useEffect(() => {
    reportJobGeneral();
  }, []);
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
      APIRequest.getJobSelfReportDetail({time: item, campaignIds: null}, dispatch).then(
        result =>{
          if(result.code === 0){
            //Set chart cho công việc đã giao
            if (tabValue === 0){
              if (result.data.owner){
                total.push(result.data.owner.total)
                cancel.push(result.data.owner.cancel)
                complete.push(result.data.owner.complete)
                assign.push(result.data.owner.assign)
                processing.push(result.data.owner.processing)
                expired.push(result.data.owner.expired)
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
            else {
              //set Chart cho công việc được giao
              if (result.data.member){
                total.push(result.data.member.total)
                cancel.push(result.data.member.cancel)
                complete.push(result.data.member.complete)
                assign.push(result.data.member.assign)
                processing.push(result.data.member.processing)
                expired.push(result.data.member.expired)
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
        }
      )
    });
    if(count === listDate.length){
      setChartData({total: total, cancel: cancel, complete: complete, assign: assign, processing: processing, expired: expired})
    }
  }
  useEffect(()=> {
    console.log("Dữ liệu set: ", chartData);
    createChartFromData()
  }, [chartData])
  function createChartFromData(){
    var listDate = getListDatesFromRange(form.begin, form.end)
      return {
        labels: listDate,
        datasets: [
          {
            fill: false,
            borderColor: "#808080",
            label: "Tổng số công việc",
            borderWidth: 1,
            data: chartData.total,
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
  function reportJobGeneral() {
    APIRequest.getJobSelfReport(form, dispatch).then(
      response => {
        if (response.code === 0){
          setRealtimeData(response.data.member);
          setOwnerData(response.data.owner)
          getDataForChart()
          console.log('Dữ liệu biểu đồ: ',createChartFromData());
        }
      }
    )
  }

  function searchReportJob(state) {
    APIRequest.getJobSelfReport({ begin: moment(form.begin).format("YYYY-MM-DD"), end: moment(form.end).format("YYYY-MM-DD") }, dispatch).then(
      response => {
        setRealtimeData(response.data.member);
        setOwnerData(response.data.owner)
        getDataForChart()
        console.log('Dữ liệu biểu đồ: ',createChartFromData());
      }
    )
  }
  function handleChangeTab(event, tabValue) {
    setTabValue(tabValue);
    getDataForChart()
  }
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
            <Tab className="text-14 font-600 normal-case" label= {`Báo cáo công việc đã giao`} />
            <Tab className="text-14 font-600 normal-case" label={`Báo cáo công việc được giao`} />
          </Tabs>
        }
        header={
          <div className="flex flex-1 items-center justify-between p-24 el-HeaderPage">
            <div className="flex report-action-header">
              <Typography variant="h6">Báo cáo công việc cá nhân</Typography>
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
              <Typography className="pl-12 text-15 font-bold mb-10 block-tittle">{tabValue === 0 ?  "Thống kê công việc đã giao:" : "Thống kê công việc được giao:"}</Typography>
              {
                chartData &&
                <Line data={createChartFromData()} />
              }
            </div>
            {
              tabValue === 0 && ownerData &&
              <div>
                <div className='el-block-report'>
                  <Typography className="pl-12 text-15 font-bold mb-10 block-tittle">Báo cáo công việc đã giao:</Typography>
                  <FuseAnimateGroup
                    className="el-flex-row"
                    enter={{
                        animation: "transition.slideUpBigIn"
                    }}
                  >
                    <div className="el-card-white">
                      <Widget1 widget={{ value: ownerData.total, title: "Tổng số công việc" }} color="text-blue" />
                    </div>
                    <div className="el-card-white">
                      <Widget1 widget={{ value: ownerData.total_member, title: "Tổng số người thực hiện" }} color="text-blue" />
                    </div>
                    <div className="el-card-white">
                      <Widget1 widget={{ value: ownerData.avg_process ? (Math.round(ownerData.avg_process * 100) / 100).toFixed(2) + "%": "", title: "Tiến trình trung bình" }} color="text-blue" />
                    </div>
                  </FuseAnimateGroup>
                  <FuseAnimateGroup
                    className="el-flex-row"
                    enter={{
                        animation: "transition.slideUpBigIn"
                    }}
                  >
                    <div className="el-card-white">
                      <Widget2 widget={{ value: ownerData.complete, title: "Đã hoàn thành" }} color="text-orange" />
                    </div>
                  </FuseAnimateGroup>
                  <FuseAnimateGroup
                    className="el-flex-row"
                    enter={{
                        animation: "transition.slideUpBigIn"
                    }}
                  >
                    <div className="el-card-white">
                      <Widget2 widget={{ value: ownerData.processing, title: "Đang thực hiện" }} color="text-orange" />
                    </div>
                    <div className="el-card-white">
                      <Widget2 widget={{ value: ownerData.assign, title: "Chưa tiếp nhận" }} color="text-orange" />
                    </div>
                    <div className="el-card-white">
                      <Widget2 widget={{ value: ownerData.cancel, title: "Đã hủy" }} color="text-orange" />
                    </div>
                    <div className="el-card-white">
                      <Widget2 widget={{ value: ownerData.expired, title: "Quá hạn" }} color="text-orange" />
                    </div>
                  </FuseAnimateGroup>
                </div>
              </div>
            }
            {
              tabValue === 1 && realtimeData &&
              <div className='el-block-report'>
                <Typography className="pl-12 text-15 font-bold mb-10 block-tittle">Báo cáo công việc được giao:</Typography>
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
                    <Widget1 widget={{ value: realtimeData.avg_process ? (Math.round(realtimeData.avg_process * 100) / 100).toFixed(2) + "%": "", title: "Tiến trình trung bình" }} color="text-blue" />
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
            }
        </div>
        }
      />
    </div>

  )
}

export default JobReportSelf;
