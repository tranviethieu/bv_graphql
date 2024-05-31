import React, { useEffect, useState } from 'react';
import { Icon, IconButton, Typography, Button } from '@material-ui/core';
import { FuseAnimateGroup, FusePageSimple } from '@fuse';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import Widget1 from '../widgets/Widget1';
import ReactTable from 'react-table';
// import _ from 'lodash';

import history from '@history';
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import viLocale from "date-fns/locale/vi";
import graphqlService from "app/services/graphqlService";
import { QUERY_SURVEY_GENERALREPORT} from "./actions/query";
import moment from 'moment';
import { useForm } from '@fuse/hooks';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

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

function ReportSurveys(props) {
    const dispatch = useDispatch();
    const classes = useStyles(props);
    // const pageLayout = useRef(null);
    const [realtimeData, setRealtimeData] = useState([]);
    // const [reportData, setReportData] = useState([]);
    const { form, setInForm } = useForm(initForm);

    useEffect(() => {
        // getDepartments();
        requestReportSurveyGeneral();
        // getReportUserActions();
    }, [dispatch]);
    function handleDateBeginChange(e){
        setInForm('begin', e)
    }
    function handleDateEndChange(e){
        setInForm('end', e)
    }
    function requestReportSurveyGeneral(state) {
        graphqlService.query(QUERY_SURVEY_GENERALREPORT, {begin:moment(form.begin).format("YYYY-MM-DD"),end:moment(form.end).format("YYYY-MM-DD")}, dispatch).then(
            response => {
                console.log("requestReportSurveyGeneral response: ", response);

                setRealtimeData(response.data);
            }
        );
    }

    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const exportToCSV = () => {
        var timeBegin = moment(form.begin).format("YYYY-MM-DD");
        var timeEnd = moment(form.end).format("YYYY-MM-DD");
        var fileName = 'Report_survey_' + timeBegin + "_" + timeEnd;
        var csvData;

            graphqlService.query(QUERY_SURVEY_GENERALREPORT, {begin:timeBegin,end:timeEnd}, dispatch).then(
            response => {
                // console.log("exportToCSV response: ", response);
                if(response === null || response.data === null || response.data.length === 0  || response.data.data === null){
                    return;
                }
                csvData = response.data.data;
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
                <Typography variant="h6">Báo cáo khảo sát khách hàng</Typography>
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
                    <Button variant="contained" className="mx-20" color="secondary"   onClick={requestReportSurveyGeneral}>
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
                    <Widget1 widget={{ value: realtimeData.survey_num, title: "Tổng số khảo sát" }} color="text-blue" />
                  </div>
                  <div  className="el-flex-item flex-item-flex1">
                    <Widget1 widget={{ value: realtimeData.result_num, title: "Tổng số kết quả" }} color="text-blue" />
                  </div>
                </FuseAnimateGroup>
              : null}

              <div className="el-block-report flex">

                <ReactTable
                  className="-striped -highlight h-full w-full sm:rounded-8 overflow-hidden el-TableSurveys-Report"
                  data={realtimeData.data}
                  defaultPageSize={10}
                  sortable={false}
                  noDataText= "Không có dữ liệu nào"
                  columns={[
                    {
                      Header: "#",
                      width: 50,
                      filterable: false,
                      Cell : row =><div>
                        {row.index + 1}
                      </div>
                    },
                    {
                      Header: "Tên khảo sát",
                      accessor: "Name",

                    },
                    {
                      Header: "Số kết quả",
                      accessor: "total",

                    },
                    {
                      Header: "Ngày tạo",
                      accessor: "CreatedTime",

                      Cell: row => <div>{moment(row.value).format("DD/MM/YYYY")}</div>
                    },
                    {
                      Header: "Chi tiết",
                      accessor: "results",
                      width:80,

                      Cell: row => <IconButton onClick={e=> history.push(`/apps/reports/surveys/${row.original._id}`)}>
                        <Icon>bar_chart</Icon>
                      </IconButton>
                    },
                  ]}
                />
              </div>

            </div>

            }
        />

    )
}

export default ReportSurveys;
