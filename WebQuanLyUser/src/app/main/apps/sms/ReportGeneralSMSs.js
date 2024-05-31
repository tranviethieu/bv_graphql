import React, { useEffect, useState } from 'react';
import { Icon, IconButton, Typography, Button } from '@material-ui/core';
import { FuseAnimateGroup, FusePageSimple } from '@fuse';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import Widget1 from '../reports/widgets/Widget1';
import ReactTable from 'react-table';
import history from '@history';
import graphqlService from "app/services/graphqlService";
import { QUERY_SMS_REPORTBYINDEX} from "./query";
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import viLocale from "date-fns/locale/vi";
import moment from 'moment';
import { useForm } from '@fuse/hooks';
import { PDFReportSMSGeneral } from '../PDFReport/PDFReportSMSGeneral'
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
}

function ReportGeneralSMSs(props) {
    const dispatch = useDispatch();
    const classes = useStyles(props);
    // const pageLayout = useRef(null);
    // const [searchText, setSearchText] = useState('');
    // const [tabValue, setTabValue] = useState(0);

    const { form, setInForm } = useForm(initForm);
    // const [callInData, setCallInData] = useState([]);
    const [realtimeData, setRealtimeData] = useState([]);
    const [pdfExportComponent, setPdfExportComponent] = useState(null);
    const [reportData, setReportData] = useState([])
    function handleDateBeginChange(e){
        setInForm('begin', e)
    }
    function handleDateEndChange(e){
        setInForm('end', e)
    }
    useEffect(() => {
        // getDepartments();
        requestReportSMSByIndex();
        // getReportUserActions();
    }, [dispatch]);

    function requestReportSMSByIndex(state) {
        graphqlService.query(QUERY_SMS_REPORTBYINDEX, {begin:moment(form.begin).format("YYYY-MM-DD"),end:moment(form.end).format("YYYY-MM-DD")}, dispatch).then(
            response => {
                console.log("requestReportSMSByIndex response: ", response);
                setReportData(response.data)
                setRealtimeData(response.data);
            }
        );
    }

    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const exportToCSV = () => {
        var timeBegin = moment(form.begin).format("YYYY-MM-DD");
        var timeEnd = moment(form.end).format("YYYY-MM-DD");
        var fileName = 'Report_sms_' + timeBegin + "_" + timeEnd;
        var csvData;

        // APIRequest.getReportAppointmentByDay({begin:timeBegin,end: timeEnd,departmentId:form.departmentId.value}, dispatch).then(
            graphqlService.query(QUERY_SMS_REPORTBYINDEX, {begin:timeBegin,end:timeEnd}, dispatch).then(
            response => {
                console.log("exportToCSV QUERY_SMS_REPORTBYINDEX response: ", response);
                if(response.data === null || response.data.length === 0 || response.data.campaigns === null ||  response.data.campaigns.length === 0){
                    return;
                }
                console.log("exportToCSV QUERY_SMS_REPORTBYINDEX NOT NULL ==> EXPORT EXCEL", response.data.campaigns);
                csvData = response.data.campaigns;
                // let finalHeaders = ['colA', 'colB', 'colC'];
                const ws = XLSX.utils.json_to_sheet(csvData);
                const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
                const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
                const data = new Blob([excelBuffer], {type: fileType});
                FileSaver.saveAs(data, fileName + fileExtension);
            }
        )
    }

    return (
        <FusePageSimple
          classes={{
            toolbar: "min-h-80",
            rightSidebar: "w-288",
            content: classes.content,
          }}

          header={
            <div className="flex flex-1 items-center justify-between p-24 el-HeaderPage">
              <div className="flex flex-col">
                <Typography variant="h6">Báo cáo tổng quát SMS</Typography>
              </div>

              <FuseAnimateGroup
                className="flex flex-wrap justify-center"
                enter={{
                  animation: "transition.slideUpBigIn"
                }}
              >
                <Button variant="contained" className="mx-20" color="secondary"  onClick={exportToCSV}>
                  <Icon>import_export</Icon> Xuất excel
                </Button>
                <Button variant="contained" className="mx-20" color="secondary" onClick={() => { pdfExportComponent.save(); }}>
                  <Icon>assignment</Icon> In báo cáo
                </Button>
                <div style={{ position: "absolute", left: "-1000px", top: 0 }}>
                  <PDFExport
                    paperSize="A4"
                    margin="0.7cm"
                    fileName = {`Báo cáo tổng quát SMS từ ${moment(form.begin).format("DD/MM/YYYY")} - ${moment(form.end).format("DD/MM/YYYY")}.pdf`}
                    ref={(component) => setPdfExportComponent(component)}
                  >
                    <PDFReportSMSGeneral data = {reportData} begin = {form.begin} end = {form.end}/>
                  </PDFExport>
                </div>
              </FuseAnimateGroup>
            </div>
          }
          content={
            <div className="p-12 el-coverContent">
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
                        value={form.begin? moment(form.begin).format("YYYY-MM-DD"): new Date()}
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
                        value={form.end? moment(form.end).format("YYYY-MM-DD"): new Date()}
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
                    <Button variant="contained" className="mx-20" color="secondary"  onClick={requestReportSMSByIndex}>
                      <Icon>search</Icon> Tìm kiếm
                    </Button>
                  </FuseAnimateGroup>
                </div>
              </div>



              {realtimeData ?
                <FuseAnimateGroup
                  className="el-block-report flex"
                  enter={{
                    animation: "transition.slideUpBigIn"
                  }}
                >
                  <div  className="el-flex-item flex-item-flex1">
                    <Widget1 widget={{ value: realtimeData.total, title: "Tổng" }} color="text-blue" />
                  </div>
                  <div  className="el-flex-item flex-item-flex1">
                    <Widget1 widget={{ value: realtimeData.success, title: "Thành công" }} color="text-blue" />
                  </div>
                  <div  className="el-flex-item flex-item-flex1">
                    <Widget1 widget={{ value: realtimeData.failure, title: "Thất bại" }} color="text-blue" />
                  </div>
                </FuseAnimateGroup>
              : null}

              <div className="el-block-report flex">

                <ReactTable
                  className="-striped -highlight h-full overflow-hidden w-full el-TableSMSReport"
                  data={realtimeData? realtimeData.campaigns: []}
                  noDataText = "Không có dữ liệu nào"
                  defaultPageSize = {10}
                  sortable={false}
                  columns={[
                    {
                      Header: "#",
                      width: 70,

                      Cell: row => <div>{(row.index+1)}</div>
                    },
                    // {
                    //     Header: "Mã chiến dịch",
                    //     accessor: "campaign_id",
                    //
                    // },
                    {
                      Header: "Tên chiến dịch",
                      accessor: "campaign_name",

                    },
                    {
                      Header: "Số lượng",
                      accessor: "total",

                    }   ,
                    {
                      Header: "Chi tiết",
                      accessor: "results",
                      width:80,

                      Cell: row => <IconButton onClick={e=> history.push(`/apps/reports/sms/historybycampaign/${row.original.campaign_id}`)}>
                        <Icon>bar_chart</Icon>
                      </IconButton>
                    }
                  ]}
                />
              </div>


            </div>

            }
        />

    )
}

export default ReportGeneralSMSs;
