import React, {  useState } from 'react';
import { Icon, Typography, Button, TextField } from '@material-ui/core';
import { FuseAnimateGroup, FusePageSimple} from '@fuse';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import ReactTable from 'react-table';
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import viLocale from "date-fns/locale/vi";
// import * as APIRequest from "./GraphQLHelper";
import moment from 'moment';
import { useForm } from '@fuse/hooks';
import graphqlService from "app/services/graphqlService";
import { QUERY_SMS_REPORT_BYPHONE} from "./query";
import { PDFReportSMSByPhone } from '../PDFReport/PDFReportSMSByPhone'
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
    key: ''
}

function RealtimeDashboardApp(props) {
    const dispatch = useDispatch();
    const classes = useStyles(props);
    // const pageLayout = useRef(null);
    // const [searchText, setSearchText] = useState('');
    // const [tabValue, setTabValue] = useState(0);
    const [pageSizeCustom, setPageSize] = useState(10);
    const { form, handleChange, setInForm } = useForm(initForm);
    const [page, setPage] = useState(0);
    // const [realtimeData, setRealtimeData] = useState([]);
    const [userActionsData, setUserActionsData] = useState([])
    const [pdfExportComponent, setPdfExportComponent] = useState(null);
    const [reportData, setReportData] = useState([])
    function handleDateBeginChange(e){
        setInForm('begin', e)
    }
    function handleDateEndChange(e){
        setInForm('end', e)
    }
    function searchReportSMSByPhone(state) {
        const { page, pageSize } = state;
        if (pageSize){
          setPageSize(pageSize)
        }
        else{
          setPageSize(pageSizeCustom)
        }
        fetchReportData()
        graphqlService.query(QUERY_SMS_REPORT_BYPHONE, {begin:moment(form.begin).format("YYYY-MM-DD"),end:moment(form.end).format("YYYY-MM-DD"), key:form.key, page,  pageSize: pageSize ? pageSize : pageSizeCustom}, dispatch).then(
            response => {
                console.log("searchReportSMSByPhone response: ", response);
                setUserActionsData(response);
            }
        );
    }
    function fetchReportData() {
        graphqlService.query(QUERY_SMS_REPORT_BYPHONE, {begin:moment(form.begin).format("YYYY-MM-DD"),end:moment(form.end).format("YYYY-MM-DD"), key:form.key}, dispatch).then(
            response => {
                setReportData(response.data);
            }
        );
    }
    function exportReportToExcel(){
        const ACCESS_TOKEN = "access_token";
        var access_token = localStorage.getItem(ACCESS_TOKEN);

        var fromDate = moment(form.begin).format("DD-MM-YYYY")
        var endDate = moment(form.end).format("DD-MM-YYYY")
        var urlToOpen = process.env.REACT_APP_API_HOST + '/export/smsbyphone?range='+fromDate+'-'+endDate+ '&key='+form.key+'&access_token='+ access_token;
        // window.open(urlToOpen, '_blank', 'toolbar=0,location=0,menubar=0');
        var win =  window.open(urlToOpen, '_blank', 'toolbar=0,location=0,menubar=0');
        win.focus();
    }


    return (
        <div>
          <FusePageSimple
            classes={{
              toolbar: "min-h-80",
              rightSidebar: "w-288",
              content: classes.content,
            }}

            header={
              <div className="flex flex-1 items-center justify-between p-24 el-HeaderPage">
                <div className="flex flex-col">
                  <Typography variant="h6">Báo cáo SMS theo số điện thoại</Typography>
                </div>
                <FuseAnimateGroup
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
                      fileName = {`Báo cáo SMS theo số điện thoại từ ${moment(form.begin).format("DD/MM/YYYY")} - ${moment(form.end).format("DD/MM/YYYY")}.pdf`}
                      ref={(component) => setPdfExportComponent(component)}
                    >
                      <PDFReportSMSByPhone data = {reportData} begin = {form.begin} end = {form.end} phone = {form.key}/>
                    </PDFExport>
                  </div>
                </FuseAnimateGroup>
              </div>
            }
            content={
              <div className="p-12 el-coverContent" id = "el-ReportSMSByPhone-content">
                <div className="el-block-report">
                  <Typography className="pl-12 text-15 font-bold mb-10 block-tittle">Lọc dữ liệu:</Typography>
                  <div className="el-fillter-report-action">
                    <div className="el-flex-item flex-item-flex1">
                      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={viLocale}>
                        <DatePicker
                          disableToolbar
                          variant="inline"
                          fullWidth
                          margin = "dense"
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
                          margin = "dense"
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
                    <div className="el-flex-item flex-item-flex1">
                      <TextField
                        name="key"
                        label="Nhập số điện thoại tìm kiếm"
                        type="phone"
                        margin = "dense"
                        onChange={handleChange}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        variant="outlined"
                        fullWidth
                      />
                    </div>
                    <FuseAnimateGroup
                      className="flex flex-wrap justify-center"
                      enter={{
                        animation: "transition.slideUpBigIn"
                      }}
                    >
                      <Button variant="contained" className="my-8 pb-8" color="secondary" onClick={searchReportSMSByPhone}>
                        <Icon>search</Icon> Tìm kiếm
                      </Button>
                    </FuseAnimateGroup>
                  </div>
                </div>

                {/* <div className="w-full bg-green pt-8 p-2 mx-16 mt-24">
                  <h3 className="text-white">Có {realtimeData && realtimeData.total ? realtimeData.total : 0} kết quả trong báo cáo từ ngày 22/11/2019 đến ngày 22/11/2019 . </h3>
                </div> */}

                <div className="el-block-report flex">

                  <ReactTable
                    className="-striped -highlight h-full overflow-hidden w-full el-TableSMSReportPhone"
                    data={userActionsData.data}
                    onFetchData={searchReportSMSByPhone}
                    manual
                    defaultPageSize = {10}
                    onPageChange = {setPage}
                    sortable={false}
                    noDataText = "Không có dữ liệu nào"
                    pages = {userActionsData.pages}
                    columns={[
                      {
                        Header: "#",
                        width: 70,

                        Cell: row => <div>{row.index + 1 + (page * pageSizeCustom)}</div>
                      },
                      {
                        Header: "Tên khách hàng",
                        accessor: "FullName",

                      },
                      {
                        Header: "Số ĐT",
                        accessor: "phone_number",

                      },
                      {
                        Header: "Giới tính",
                        accessor: "Gender",

                        Cell: row => <div>{row.value === '1' ? <div>Nam</div> : row.value === "2" ? <div>Nữ</div> : "Không xác định"}</div>
                      },
                      {
                        Header: "Ngày sinh",
                        accessor: "BirthDay",

                        Cell: row => <div>{moment(row.value).format("DD/MM/YYYY")}</div>
                      },
                      {
                        Header: "Số tin đã gửi",
                        accessor: "total",

                      },
                    ]}
                  />
                </div>


              </div>

            }
          />
        </div>

    )
}

export default RealtimeDashboardApp;
