import React, { useEffect, useState } from 'react';
import { Icon, Typography, Button, FormControl, Tooltip } from '@material-ui/core';
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


const initForm = {
    begin: moment().subtract(30, 'd'),
    end: new Date(),
    ringGroups:[]
}

function ReportCallRingGroup(props) {
    const dispatch = useDispatch();
    const classes = useStyles(props);
    const { form, setForm, setInForm } = useForm(initForm);
    const [callInData, setCallInData] = useState([]);
    const [ringGroupsData, setRingGroupsData] = useState([]);

    function handleDateBeginChange(e){
        setInForm('begin', e)
    }
    function handleDateEndChange(e){
        setInForm('end', e)
    }
    function getCallInReportByRingGroup(state) {

         APIRequest.getCallInReportByRingGroup(form, dispatch).then(
            response => {
                setCallInData(response.data);
            }
        )
    }

    function searchCallInReportByRingGroup(state) {
         APIRequest.getCallInReportByRingGroup({begin:moment(form.begin).format("YYYY-MM-DD"),end:moment(form.end).format("YYYY-MM-DD"),ringGroups:form.ringGroups.map(item=>item.value)}, dispatch).then(
            response => {
                setCallInData(response.data);
            }
        )
    }

    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const exportToCSV = () => {
        var timeBegin = moment(form.begin).format("YYYY-MM-DD");
        var timeEnd = moment(form.end).format("YYYY-MM-DD");
        var fileName = 'Report_callringgroup_' + timeBegin + "_" + timeEnd;
        var csvData;

        // APIRequest.getReportAppointmentByDay({begin:timeBegin,end: timeEnd,departmentId:form.departmentId.value}, dispatch).then(
            APIRequest.getCallInReportByRingGroup({begin:timeBegin,end:timeEnd,ringGroups:form.ringGroups.map(item=>item.value)}, dispatch).then(
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
        getRingGroups();
    }, [dispatch]);
    // useEffect(() => {
    //     // getAccounts();
    // })

    function getRingGroups(state) {
        // const { page, pageSize, sorted } = state;
        // const filtered = [{ id: 'sipPhone', value: '', operation: '!=' }];
        APIRequest.getRingGroups({ }, dispatch).then(
            response => {
                console.log("getRingGroups response: ", response);

                setRingGroupsData(response.data);
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
            <div className="flex flex-1 items-center justify-between p-24 el-HeaderPage">
              <div className="flex flex-col">
                <Typography variant="h6">Báo cáo theo nhánh tổng đài viên</Typography>
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
                        margin = "dense"
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
                        margin = "dense"
                        name="end"
                        label="Ngày kết thúc"
                        inputVariant="outlined"
                        value={form.end? moment(form.end).format("YYYY-MM-DD"): new Date()}
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
                        ringGroupsData && ringGroupsData.map(item => ({
                          value: item.phoneCode,
                          label: item.name
                        }))
                      }
                      value={
                        form.ringGroups
                      }
                      margin = "dense"
                      onChange={(value) => handleChipChange(value, 'ringGroups')}
                      placeholder="Chọn nhánh tổng đài viên"
                      textFieldProps={{
                        label: 'Chọn nhánh tổng đài viên',
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
                    <Button variant="contained" className="my-8 pb-8" color="secondary" onClick={searchCallInReportByRingGroup}>
                      <Icon>search</Icon> Tìm kiếm
                    </Button>
                  </FuseAnimateGroup>
                </div>
              </div>
              <div className='el-block-report'>

                <ReactTable
                  className="-striped -highlight h-full w-full el-TableReport"
                  data={callInData}
                  noDataText = "Không có dữ liệu nào"
                  defaultPageSize = {10}
                  onFetchData={getCallInReportByRingGroup}
                  sortable={false}
                  columns={[
                    {
                      Header: "#",
                      width: 70,
                      Cell: row => <div>{(row.index+1)}</div>
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
                      Cell: row => <div>{row.value.toFixed(2)} %</div>
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

export default ReportCallRingGroup;
