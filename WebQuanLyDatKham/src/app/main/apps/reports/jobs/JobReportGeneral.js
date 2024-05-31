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
  // const pageLayout = useRef(null);
  // const [searchText, setSearchText] = useState('');
  // const [tabValue, setTabValue] = useState(0);
  const { form, setInForm } = useForm(initForm);
  const [chartData, setChartData] = useState([]);
  const [cardData, setCardData] = useState(null)
  const [reportData, setReportData] = useState([])
  const [pdfExportComponent, setPdfExportComponent] = useState(null);

  function handleDateBeginChange(e) {
    setInForm("begin",  moment(e).format("YYYY-MM-DD"))
  }
  function handleDateEndChange(e) {
    setInForm("end",  moment(e).format("YYYY-MM-DD"))
  }
  const createLineChartFromData = (chartData) => {
    if (chartData) {
      console.log(chartData);
      return (
        {
          labels: chartData.map(c => c.date),
          datasets: [
            {
              fill: false,
              borderColor: "#808080",
              label: "Tổng số công việc",
              borderWidth: 1,
              data: chartData.map(c => c.total),
              backgroundColor: "#808080"
            },
            {
              fill: false,
              borderColor: '#F6993F',
              label: "Chưa tiếp nhận",
              data: chartData.map(d => d.assign),
              borderWidth: 1,
              backgroundColor: '#F6993F'
            },
            {
              fill: false,
              borderColor: '#3490DC',
              label: "Đang thực hiện",
              data: chartData.map(d => d.processing),
              borderWidth: 1,
              backgroundColor: '#3490DC'
            },
            {
              fill: false,
              borderColor: '#E3342F',
              label: "Đã hủy",
              data: chartData.map(d => d.cancel),
              borderWidth: 1,
              backgroundColor: '#E3342F'
            },
          ]
        }
      )
    }
  }
  function reportJobGeneral() {
    APIRequest.getJobGeneralReport(form, dispatch).then(
      response => {
        if (response.code === 0 && response.data){
          setCardData(response.data);
        }
      }
    )
    APIRequest.getJobGeneralReportDetail(form, dispatch).then(
      response => {
        if (response.code === 0 && response.data){
          setChartData(response.data);
        }
      }
    )
  }

  useEffect(() => {
    reportJobGeneral();
  }, [form])

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
                      margin = "dense"
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
                      margin = "dense"
                      label="Ngày kết thúc"
                      inputVariant="outlined"
                      value={form.end ? moment(form.end).format("YYYY-MM-DD") : new Date()}
                      onChange={handleDateEndChange}
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
                  {/* <Button variant="contained" className="mx-20" color="secondary" onClick={rư}>
                    <Icon>search</Icon> Lọc
                  </Button> */}
                </FuseAnimateGroup>

              </div>
            </div>
            <div className='el-block-report w-full p-12'>
              <Typography className="pl-12 text-15 font-bold mb-10 block-tittle">Thống kê công việc: </Typography>
              <div>
                {/* {
                  useMemo(() => {
                    return (
                  <Line data={createLineChartFromData(chartData)} />
                    )
                  }, [chartData])
                } */}
              </div>
            </div>
            {cardData ?
              <div className='el-block-report'>
                <Typography className="pl-12 text-15 font-bold mb-10 block-tittle">Báo cáo tổng quát:</Typography>
                <FuseAnimateGroup
                  className="el-flex-row"
                  enter={{
                      animation: "transition.slideUpBigIn"
                  }}
                >
                  <div className="el-card-white">
                    <Widget1 widget={{ value: cardData.total, title: "Tổng số công việc" }} color="text-blue" />
                  </div>
                  <div className="el-card-white">
                    <Widget1 widget={{ value: cardData.total_member, title: "Tổng số người thực hiện" }} color="text-blue" />
                  </div>
                  <div className="el-card-white">
                    <Widget1 widget={{ value: cardData.avg_process, title: "Tiến trình trung bình" }} color="text-blue" />
                  </div>
                </FuseAnimateGroup>
                <FuseAnimateGroup
                  className="el-flex-row"
                  enter={{
                      animation: "transition.slideUpBigIn"
                  }}
                >
                  <div className="el-card-white">
                    <Widget2 widget={{ value: cardData.complete, title: "Đã hoàn thành" }} color="text-orange" />
                  </div>
                </FuseAnimateGroup>
                <FuseAnimateGroup
                  className="el-flex-row"
                  enter={{
                      animation: "transition.slideUpBigIn"
                  }}
                >
                  <div className="el-card-white">
                    <Widget2 widget={{ value: cardData.processing, title: "Đang thực hiện" }} color="text-orange" />
                  </div>
                  <div className="el-card-white">
                    <Widget2 widget={{ value: cardData.assign, title: "Chưa tiếp nhận" }} color="text-orange" />
                  </div>
                  <div className="el-card-white">
                    <Widget2 widget={{ value: cardData.cancel, title: "Đã hủy" }} color="text-orange" />
                  </div>
                  <div className="el-card-white">
                    <Widget2 widget={{ value: cardData.expired, title: "Quá hạn" }} color="text-orange" />
                  </div>
                </FuseAnimateGroup>
              </div>
            : null}

          </div>
        }
      />
    </div>

  )
}

export default JobReportGeneral;
