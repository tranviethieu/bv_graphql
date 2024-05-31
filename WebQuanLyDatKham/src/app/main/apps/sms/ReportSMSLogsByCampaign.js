import React, { useEffect, useState } from 'react';
import { Icon, Typography, Button } from '@material-ui/core';
import { FuseAnimateGroup, FusePageSimple, FuseAnimate } from '@fuse';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import ReactTable from 'react-table';
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import viLocale from "date-fns/locale/vi";
import moment from 'moment';
import { useForm } from '@fuse/hooks';
import history from '@history';
import graphqlService from "app/services/graphqlService";
import { QUERY_SMS_HISTORY} from "./query";

const useStyles = makeStyles(theme => ({
    content: {
        '& canvas': {
            maxHeight: '100%'
        }
    },

}));

const initForm = {
    begin: moment().subtract(30, 'd'),
    end: new Date()
}

function ReportSMSLogsByCampaign(props) {
    const dispatch = useDispatch();
    const classes = useStyles(props);
    // const pageLayout = useRef(null);
    const [pageSizeCustom, setPageSize] = useState(10);
    const [searchText, setSearchText] = useState('');
    // const [tabValue, setTabValue] = useState(0);

    const { form, setInForm } = useForm(initForm);
    // const [realtimeData, setRealtimeData] = useState([]);
    const [userActionsData, setUserActionsData] = useState([])
    function handleDateBeginChange(e){
        setInForm('begin', e)
    }
    function handleDateEndChange(e){
        setInForm('end', e)
    }
    function searchReportSMSLogsOnFirst(_id) {
        if(_id === null || _id === ""){
            return;
        }
        console.log("searchReportSMSLogsOnFirst campaignID: ", _id);
        // const { page : 0, pageSize , sorted } ;
        const sorted = [{ id: "createdTime", desc: true }]
        const filtered = [{ id: 'campaign_id', value: _id }, {id: "createdTime", value: `${moment(form.begin).format("YYYY-MM-DD")},${moment(form.end).format("YYYY-MM-DD")}`, operation: "between"}];
        graphqlService.query(QUERY_SMS_HISTORY, { page : 0, pageSize : 10, sorted  , filtered }, dispatch).then(
            response => {
                // console.log("searchReportSMSLogs response: ", response);

                setUserActionsData(response);
            }
        );
    }
    function searchReportSMSLogs(state) {
        if(searchText === null || searchText === ""){
            return;
        }
        console.log("searchReportSMSLogs campaignID: ", searchText);
        const { page, pageSize } = state;
        if (pageSize){
          setPageSize(pageSize)
        }
        else{
          setPageSize(pageSizeCustom)
        }
        const sorted = [{ id: "createdTime", desc: true }]
        const filtered = [{ id: 'campaign_id', value: searchText }];
        graphqlService.query(QUERY_SMS_HISTORY, { page, pageSize: pageSize ? pageSize : pageSizeCustom, sorted, filtered }, dispatch).then(
            response => {
                console.log("searchReportSMSLogs response: ", response);

                setUserActionsData(response);
            }
        );
    }

    // const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    // const fileExtension = '.xlsx';
    // const exportToCSV = () => {
    //     var timeBegin = moment(form.begin).format("YYYY-MM-DD");
    //     var timeEnd = moment(form.end).format("YYYY-MM-DD");
    //     var fileName = 'Report_SMSByCampaign_' + timeBegin + "_" + timeEnd;
    //     var csvData;

    //     // APIRequest.getReportAppointmentByDay({begin:timeBegin,end: timeEnd,departmentId:form.departmentId.value}, dispatch).then(
    //         APIRequest.getCallInReportByAgent({begin:timeBegin,end:timeEnd,sipPhones:form.sipPhones.map(item=>item.value)}, dispatch).then(
    //         response => {
    //             // console.log("exportToCSV response: ", response);
    //             csvData = response.data;
    //             if(csvData == null || csvData.length == 0){
    //                 return;
    //             }
    //             // let finalHeaders = ['colA', 'colB', 'colC'];
    //             const ws = XLSX.utils.json_to_sheet(csvData);
    //             const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    //             const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    //             const data = new Blob([excelBuffer], {type: fileType});
    //             FileSaver.saveAs(data, fileName + fileExtension);
    //         }
    //     )
    // }

    // console.log("useEffect BEFORE useEffect props.match.params: ", props.match.params);
    useEffect(() => {
        const { _id } = props.match.params;
        switch (_id) {
            case "new":
                break;
            default: {
                console.log("useEffect BEFORE setSearchText campaignID: ", searchText);
                setSearchText(_id);
                console.log("useEffect AFTER setSearchText campaignID: ", searchText);
                searchReportSMSLogsOnFirst(_id);
            }
        }
        // fetchDataQuestions();
        // dispatch(getProviders());
    }, [props.match.params]);

    return (
        <div>
          <FusePageSimple
            classes={{
              toolbar: "min-h-80",
              rightSidebar: "w-288",
              content: classes.content,
              header: "min-h-72 h-72 sm:h-136 sm:min-h-136"
            }}

            header={
              <div className="flex flex-1 items-center justify-between p-24 el-HeaderPage">
                <div className="flex flex-col items-start max-w-full">
                  <Typography className="normal-case flex items-center sm:mb-12" role = "button" onClick = {()=> history.push("/apps/reports/sms/general")}>
                    <Icon className="mr-4 text-20">arrow_back</Icon>
                    Báo cáo tổng quát SMS
                  </Typography>
                  <div className="flex items-center max-w-full">
                    <div className="flex flex-col min-w-0">
                      <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                        <Typography className="text-16 sm:text-20 truncate">
                          Báo cáo lịch sử SMS theo chiến dịch
                        </Typography>
                      </FuseAnimate>
                    </div>
                  </div>
                </div>
              </div>
            }
            content={
              <div className="p-12" id = "el-ReportSMSLogsByCampaign-content">
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
                          margin = "dense"
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
                          margin = "dense"
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
                      <Button variant="contained" className="my-8 pb-8" color="secondary" onClick={searchReportSMSLogs}>
                        <Icon>search</Icon> Tìm kiếm
                      </Button>
                    </FuseAnimateGroup>
                  </div>
                </div>

                <div className="el-block-report flex">

                  <ReactTable
                    className="-striped -highlight h-full overflow-hidden w-full el-TableSMSLogByCampain"
                    data={userActionsData.data}
                    onFetchData={searchReportSMSLogs}
                    noDataText = "Không có dữ liệu nào"
                    defaultPageSize = {10}
                    sortable={false}
                    manual
                    pages = {userActionsData.pages}
                    columns={[
                      {
                        Header: "#",
                        width: 70,

                        Cell: row => <div>{row.index + 1 + (userActionsData.page * pageSizeCustom)}</div>
                      },
                      {
                        Header: "Số ĐT",
                        accessor: "phone_number",

                      },
                      {
                        Header: "Nội dung",
                        accessor: "message",

                      },
                      {
                        Header: "Trạng thái",
                        accessor: "state",

                        Cell: row => <div>{row.value === true ? <div>Thành công</div> : <div>Không thành công</div>}</div>
                      },
                      {
                        Header: "Số lần gửi",
                        accessor: "retry_num",

                      },
                      {
                        Header: "Thời gian gửi",
                        accessor: "createdTime",

                        Cell: row => <div>{moment(row.value).format("DD/MM/YYYY hh:MM:ss")}</div>
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

export default ReportSMSLogsByCampaign;
