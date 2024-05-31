import React, { useEffect, useState } from 'react';
import { Icon, Typography, Button, FormControl, Tooltip} from '@material-ui/core';
import { FuseAnimateGroup, FusePageSimple, FuseChipSelect } from '@fuse';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import ReactTable from 'react-table';
import _ from 'lodash';
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import viLocale from "date-fns/locale/vi";
import * as APIRequest from "./GraphQLHelper";
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
    sipPhones:[]
}

function ReportCallOut(props) {
    const dispatch = useDispatch();
    const classes = useStyles(props);
    // const pageLayout = useRef(null);
    // const [searchText, setSearchText] = useState('');
    // const [tabValue, setTabValue] = useState(0);
    const [callOutData, setCallOutData] = useState([]);
    const [accountsData, setAccountsData] = useState([]);
    const { form, setForm, setInForm } = useForm(initForm);

    // function handleChangeTab(event, tabValue) {
    //     setTabValue(tabValue);
    // }
    function handleDateBeginChange(e){
        setInForm('begin', e)
    }
    function handleDateEndChange(e){
        setInForm('end', e)
    }
    function getCallOutReportByAgent(state) {
        // const { page, pageSize, sorted } = state;
        // const filtered = [{ id: 'action', value: 'APPOINTMENT' }];
        // var begin = form.begin;
        // var end = form.end
         APIRequest.getCallOutReportByAgent(form, dispatch).then(
            response => {
                console.log("getCallOutReportByAgent response: ", response);

                setCallOutData(response.data);
                // setPages(response.page);
                // setRecords(response.records);
            }
        )
    }

    function searchCallOutReportByAgent(state) {
        // const { page, pageSize, sorted } = state;
        // const filtered = [{ id: 'action', value: 'APPOINTMENT' }];

         APIRequest.getCallOutReportByAgent({begin:moment(form.begin).format("YYYY-MM-DD"),end:moment(form.end).format("YYYY-MM-DD"),sipPhones:form.sipPhones.map(item=>item.value)}, dispatch).then(
            response => {
                console.log("getCallOutReportByAgent response: ", response);

                setCallOutData(response.data);
                // setPages(response.page);
                // setRecords(response.records);
            }
        )
    }

    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const exportToCSV = () => {
        var timeBegin = moment(form.begin).format("YYYY-MM-DD");
        var timeEnd = moment(form.end).format("YYYY-MM-DD");
        var fileName = 'Report_callout_' + timeBegin + "_" + timeEnd;
        var csvData;

        // APIRequest.getReportAppointmentByDay({begin:timeBegin,end: timeEnd,departmentId:form.departmentId.value}, dispatch).then(
            APIRequest.getCallOutReportByAgent({begin:timeBegin,end:timeEnd,sipPhones:form.sipPhones.map(item=>item.value)}, dispatch).then(
            response => {
                // console.log("exportToCSV response: ", response);
                csvData = response.data;
                if(csvData === null || csvData.length === 0){
                    return;
                }
                // let finalHeaders = ['colA', 'colB', 'colC'];
                const ws = XLSX.utils.json_to_sheet(csvData);
                const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
                const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
                const data = new Blob([excelBuffer], {type: fileType});
                FileSaver.saveAs(data, fileName + fileExtension);
            }
        )
    }

    useEffect(() => {
        getAccounts();
    }, [dispatch]);
    // useEffect(() => {
    //     // getAccounts();
    // })

    function getAccounts(state) {
        // const { page, pageSize, sorted } = state;
        const filtered = [{ id: 'sipPhone', value: '', operation: '!=' }];
        APIRequest.getAccounts({ filtered}, dispatch).then(
            response => {
                console.log("getAccounts response: ", response);

                setAccountsData(response.data);
                // setPages(response.page);
                // setRecords(response.records);
            }
        )
    }

    function handleChipChange(value, name) {
        console.log("handeChipChange:",value);
        setForm(_.set({ ...form }, name, value));
    }

    return (
        <FusePageSimple
          classes={{
            toolbar: "min-h-80",
            rightSidebar: "w-288",
            content: classes.content,
          }}

          header={
            <div className="flex flex-1 items-center justify-between p-24 el-ReportHeader">
              <div className="flex flex-col">
                <Typography variant="h6">Báo cáo cuộc gọi ra</Typography>
              </div>
              <div className = "el-ReportCallOutButton">
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
                  <FormControl className="el-flex-item flex-item-flex1">
                    {/* <InputLabel>Chọn điện thoại viên</InputLabel> */}
                    <FuseChipSelect
                      // className="mt-8 mb-16"
                      options={
                        accountsData && accountsData.map(item => ({
                          value: item.sipPhone,
                          label: item.base ? item.base.fullName : "Không xác định"
                        }))
                      }
                      value={
                        form.sipPhones
                      }
                      onChange={(value) => handleChipChange(value, 'sipPhones')}
                      placeholder="Chọn điện thoại viên"
                      textFieldProps={{
                        label: 'Chọn điện thoại viên',
                        InputLabelProps: {
                          shrink: true
                        },
                        variant: 'outlined'
                      }}
                      isMulti
                    />
                  </FormControl>

                  <FuseAnimateGroup
                    className="flex flex-wrap justify-center"
                    enter={{
                      animation: "transition.slideUpBigIn"
                    }}
                  >
                    <Button variant="contained" className="mx-20" color="secondary"  onClick={searchCallOutReportByAgent}>
                      <Icon>search</Icon> Tìm kiếm
                    </Button>
                  </FuseAnimateGroup>

                </div>
              </div>

              <div className="el-block-report">
                <ReactTable
                  className="-striped -highlight h-full w-full el-TableReport"
                  data={callOutData}
                  onFetchData={getCallOutReportByAgent}
                  noDataText = "Không có dữ liệu nào"
                  sortable={false}
                  getTdProps={() => ({
                    style: { border: `none` },
                  })}
                  columns={[
                    {
                      Header: "#",
                      width: 60,
                      Cell: row => <div>{(row.index + 1)}</div>
                    },
                    {
                      Header: <div className="text-left">
                        <Typography className="text-12 font-bold">Số máy nhánh</Typography>
                        <Typography className="text-12 font-bold">Điện thoại viên</Typography>
                      </div>,
                      accessor: "fullname",
                      Cell: row => <div>
                        <Typography className="font-bold">{row.original.sipphone}</Typography>
                        <Typography className="text-12"> {row.value} </Typography>
                      </div>,
                      className: "wordwrap",
                      style: { justifyContent: "left", textAlign: "left", whiteSpace: "unset", wordBreak: "nomal" },
                    },
                    {
                      Header: <div className="text-left">
                        <Typography className="text-12 font-bold">Số cuộc được phục vụ</Typography>
                        <Typography className="text-12 font-bold">Tổng cuộc gọi</Typography></div>,
                      Cell: row => <div className="flex">
                        <Typography className="text-blue">{row.original.served}</Typography>
                        <Typography className="px-4"> / </Typography>
                        <Typography>{row.original.total}</Typography>
                      </div>
                    },
                    {
                      Header: <div className="text-left">
                        <Typography className="text-12 font-bold">Cuộc gọi ngắn nhất</Typography>
                        <Typography className="text-12 font-bold">Cuộc gọi dài nhất</Typography>                    
                      </div>,
                      accessor: "max_duration",
                      Cell: row => <div className="flex">
                        <Typography>{moment.utc(row.original.min_duration * 1000).format('HH:mm:ss')}</Typography>
                        <Typography className="px-4">/</Typography>
                        <Typography>{moment.utc(row.value * 1000).format('HH:mm:ss')}</Typography>                    
                      </div>
                    },                
                    {
                      Header: "Số gọi nhỡ",
                      accessor: "misses",
                      Cell: row => <Typography className="text-red">{row.value}</Typography>
                    },
                    {
                      Header: "Năng suất gọi",
                      accessor: "call_productivity",
                      Cell: row => <div>{row.value.toFixed(2)} %</div>
                    },
                    {
                      Header: "Năng suất thời gian",
                      accessor: "time_productivity",
                      style: { 'whiteSpace': 'unset' },
                      Cell: row => <div>{row.value.toFixed(2)}  %</div>
                    },
                    {
                      Header: <div className="text-left">
                        <Typography className="text-12 font-bold">Thời lượng đàm thoại trung bình</Typography>
                        <Typography className="text-12 font-bold">Tổng thời lượng đàm thoại</Typography>
                      </div>,
                      accessor: "total_duration",
                      Cell: row => <div className="flex">
                        <Typography>{moment.utc(row.original.avg_duration * 1000).format('HH:mm:ss')}</Typography>
                        <Typography className="px-4">/</Typography>
                        <Typography>{moment.utc(row.value * 1000).format('HH:mm:ss')}</Typography>
                      </div>
                    }
                  
                  ]}
                />
              </div>


            </div>

            }
        />

    )
}

export default ReportCallOut;
