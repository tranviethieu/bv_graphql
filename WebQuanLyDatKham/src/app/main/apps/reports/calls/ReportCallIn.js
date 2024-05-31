import React, { useEffect, useState } from 'react';
import { Icon, Typography, Button, FormControl, Tooltip, IconButton } from '@material-ui/core';
import { FuseAnimateGroup, FusePageSimple, FuseChipSelect } from '@fuse';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import ReactTable from 'react-table';
import _ from 'lodash';
import * as APIRequest from "./GraphQLHelper";
import moment from 'moment';
import { useForm } from '@fuse/hooks';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import viLocale from "date-fns/locale/vi";

const useStyles = makeStyles(theme => ({
  content: {
    '& canvas': {
      maxHeight: '100%'
    }
  },

}));
const allColumns = [
  {
    display: true,
    Header: "#",
    width: 70,
    Cell: row => <div>{(row.index + 1)}</div>
  },
  {
    display: true,
    Header: "Điện thoại viên/SipPhone",
    accessor: "fullname",
    Cell: row => <div>{row.value} / {row.original.sipphone}</div>
  },
  {
    display: true,
    Header: "Tổng cuộc gọi",
    accessor: "total",
  },
  {
    // Header: () =>   <Tooltip title={"Số cuộc được phục vụ"} >
    //   <div>Số cuộc được phục vụ</div>
    // </Tooltip>,
    display: true,
    Header: "Số cuộc được phục vụ",
    accessor: "served",
    style: { 'whiteSpace': 'unset' }
  },
  {
    display: true,
    Header: "Cuộc dài nhất",
    accessor: "max_duration",
    Cell: row => <div>{moment.utc(row.value * 1000).format('HH:mm:ss')}</div>
  },
  {
    display: true,
    Header: "Cuộc ngắn nhất",
    accessor: "min_duration",
    Cell: row => <div>{moment.utc(row.value * 1000).format('HH:mm:ss')}</div>
  },
  {
    display: true,
    Header: "Số gọi nhỡ",
    accessor: "misses",
  },
  {
    display: true,
    Header: "Năng suất gọi",
    accessor: "call_productivity",
    Cell: row => <div>{row.value.toFixed(2)} %</div>
  },
  {
    display: true,
    Header: "Năng suất thời gian",
    accessor: "time_productivity",
    style: { 'whiteSpace': 'unset' },
    Cell: row => <div>{row.value.toFixed(2)}  %</div>
  },
  {
    display: true,
    Header: "Thời lượng đàm thoại",
    accessor: "total_duration",
    Cell: row => <div>{moment.utc(row.value * 1000).format('HH:mm:ss')}</div>
  },
  {
    display: true,
    Header: "Thời lượng đàm thoại trung bình",
    // Header: () => <Tooltip title="Thời lượng đàm thoại trung bình">Thời lượng đàm thoại trung bình</Tooltip> ,
    accessor: "avg_duration",
    Cell: row => <div>{moment.utc(row.value * 1000).format('HH:mm:ss')}</div>
  },
]

const initForm = {
  begin: moment().subtract(30, 'd'),
  end: new Date(),
  sipPhones: []
}

function ReportCallIn(props) {
  const dispatch = useDispatch();
  const classes = useStyles(props);
  const [displayColumns, setDisplayColumns] = useState([])
  const { form, setForm, setInForm } = useForm(initForm);
  const [callInData, setCallInData] = useState([]);
  const [accountsData, setAccountsData] = useState([]);

  function handleDateBeginChange(e) {
    setInForm('begin', e)
  }
  function handleDateEndChange(e) {
    setInForm('end', e)
  }
  useEffect(() => {
    var localStorageColumns = localStorage.getItem('columnsReportCallIn');
    if (localStorageColumns) {
      setDisplayColumns(localStorageColumns)
    }
    else {
      setDisplayColumns(allColumns)
    }
  }, [])
  function handleShowSettingColumns() {
    // console.log(displayColumns);
  }

  function getCallInReportByAgent(state) {

    APIRequest.getCallInReportByAgent(form, dispatch).then(
      response => {
        // console.log("getCallInReportByAgent response: ", response);
        setCallInData(response.data);
      }
    )
  }

  function searchCallInReportByAgent(state) {
    // const { page, pageSize, sorted } = state;
    // const filtered = [{ id: 'action', value: 'APPOINTMENT' }];

    APIRequest.getCallInReportByAgent({ begin: moment(form.begin).format("YYYY-MM-DD"), end: moment(form.end).format("YYYY-MM-DD"), sipPhones: form.sipPhones.map(item => item.value) }, dispatch).then(
      response => {
        // console.log("getCallInReportByAgent response: ", response);
        setCallInData(response.data);
        // setPages(response.page);
        // setRecords(response.records);
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
    APIRequest.getAccounts({ filtered }, dispatch).then(
      response => {
        // console.log("getAccounts response: ", response);
        setAccountsData(response.data);
        // setPages(response.page);
        // setRecords(response.records);
      }
    )
  }

  function handleChipChange(value, name) {
    // console.log("handeChipChange:",value);
    setForm(_.set({ ...form }, name, value));
  }

  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = '.xlsx';
  const exportToCSV = () => {
    var timeBegin = moment(form.begin).format("YYYY-MM-DD");
    var timeEnd = moment(form.end).format("YYYY-MM-DD");
    var fileName = 'Report_callin_' + timeBegin + "_" + timeEnd;
    var csvData;

    APIRequest.getCallInReportByAgent({ begin: timeBegin, end: timeEnd, sipPhones: form.sipPhones.map(item => item.value) }, dispatch).then(
      response => {
        // console.log("exportToCSV response: ", response);
        csvData = response.data;
        if (csvData === null || csvData.length === 0) {
          return;
        }
        // let finalHeaders = ['colA', 'colB', 'colC'];
        const ws = XLSX.utils.json_to_sheet(csvData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });
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
            <Typography variant="h6">Báo cáo cuộc gọi vào</Typography>
          </div>
          <FuseAnimateGroup
            className="flex flex-wrap justify-center"
            enter={{
              animation: "transition.slideUpBigIn"
            }}
          >
            <Button variant="contained" className="mx-20" color="secondary" onClick={exportToCSV}>
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
                    margin="dense"
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
                    margin="dense"
                    label="Ngày kết thúc"
                    inputVariant="outlined"
                    value={form.end ? moment(form.end).format("YYYY-MM-DD") : new Date()}
                    onChange={handleDateEndChange}
                    format="dd/MM/yyyy"
                  />
                </MuiPickersUtilsProvider>
              </div>
              <FormControl className="el-flex-item flex-item-flex1 mt-8">
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
                  margin="dense"
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
              <div className="flex flex-wrap justify-center">
                <FuseAnimateGroup
                  className="flex flex-wrap justify-center"
                  enter={{
                    animation: "transition.slideUpBigIn"
                  }}
                >
                  <Button variant="contained" className="my-8 pb-8" color="secondary" onClick={searchCallInReportByAgent}>
                    <Icon>search</Icon> Tìm kiếm
                  </Button>
                </FuseAnimateGroup>
              </div>
            </div>
          </div>

          <div className="el-block-report">
            {/* <Tooltip title = "Thiết lập hiển thị" placement = "bottom">
                  <IconButton onClick = {() => handleShowSettingColumns()}>
                    <Icon>
                  settings
                    </Icon>
                  </IconButton>
                </Tooltip> */}
            <ReactTable
              className="-striped -highlight h-full w-full el-TableReport"
              data={callInData}
              onFetchData={getCallInReportByAgent}
              sortable={false}
              noDataText="Không có dữ liệu nào"
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
                    <Typography>{row.original.total ? row.original.total.toLocaleString('vi-VN') : 0}</Typography>
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
                  Cell: row => <Typography className="text-red">{row.value ? row.value.toLocaleString('vi-VN') : 0}</Typography>
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

export default ReportCallIn;
