import React, { useEffect, useState } from 'react';
import { Icon, Typography, Button, FormControl } from '@material-ui/core';
import { FuseAnimateGroup, FusePageSimple, FuseChipSelect } from '@fuse';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import ReactTable from 'react-table';
import _ from 'lodash';
// import history from '@history';
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import viLocale from "date-fns/locale/vi";
import * as APIRequest from "../GraphQLHelper";
import moment from 'moment';
import { useForm } from '@fuse/hooks';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { PDFAppointmentGeneral } from '../../PDFReport/PDFAppointmentGeneral'
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
    departmentId:'',
}

function ReportGeneralAppointment(props) {
    const dispatch = useDispatch();
    const classes = useStyles(props);
    // const pageLayout = useRef(null);
    // const [searchText, setSearchText] = useState('');
    // const [tabValue, setTabValue] = useState(0);
    const user = useSelector(({ auth }) => auth.user.data);
    const [ appointmentManager, setAppointmentManager] = useState(false)
    const { form, setForm, setInForm } = useForm(initForm);
    const [callInData, setCallInData] = useState([]);
    const [departmentsData, setDepartmentsData] = useState([]);
    const [pdfExportComponent, setPdfExportComponent] = useState(null);
    const [reportData, setReportData] = useState([])
  const [departmentName, setDepartmentName] = useState("")
  useEffect(()=>{
    if(user.defaultGroup && user.defaultGroup.permissions){
      const isManager = user.defaultGroup.permissions.includes("is_appointment_management")
      setAppointmentManager(isManager)
    }
  },[user])
    function handleDateBeginChange(e){
        setInForm('begin', e)
    }
    function handleDateEndChange(e){
        setInForm('end', e)
    }
    function reportAppointmentByDay(state) {
         APIRequest.getReportAppointmentByDay({begin:moment(form.begin).format("YYYY-MM-DD"),end:moment(form.end).format("YYYY-MM-DD"),departmentId:form.departmentId}, dispatch).then(
            response => {
                console.log("getCallInReportByAgent response: ", response);
                setReportData(response.data)
                setCallInData(response.data);
            }
        )
    }

    function searchReportAppointmentByDay(state) {
        // const { page, pageSize, sorted } = state;
        // const filtered = [{ id: 'action', value: 'APPOINTMENT' }];

         APIRequest.getReportAppointmentByDay({begin:moment(form.begin).format("YYYY-MM-DD"),end:moment(form.end).format("YYYY-MM-DD"),departmentId:form.departmentId}, dispatch).then(
            response => {
                console.log("searchReportAppointmentByDay response: ", response);
                setReportData(response.data)
                setCallInData(response.data);
            }
        )
    }

    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const exportToCSV = () => {
        var timeBegin = moment(form.begin).format("YYYY-MM-DD");
        var timeEnd = moment(form.end).format("YYYY-MM-DD");
        var fileName = 'Report_appointment_' + timeBegin + "_" + timeEnd;
        var csvData;

        APIRequest.getReportAppointmentByDay({begin:timeBegin,end: timeEnd,departmentId:form.departmentId}, dispatch).then(
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
      if(appointmentManager){
        getDepartments();
      }
      else{
        if(user.department){
          setDepartmentsData([user.department])
        }
      }
    }, [appointmentManager]);
    // useEffect(() => {
    //     // getAccounts();
    // })

    function getDepartments(state) {
        // const { page, pageSize, sorted } = state;
        const filtered = [{ id: 'sipPhone', value: '', operation: '!=' }];
        APIRequest.getDepartments({ filtered}, dispatch).then(
            response => {
                console.log("getDepartments response: ", response);

                setDepartmentsData(response.data);
                // setPages(response.page);
                // setRecords(response.records);
            }
        )
    }

    function handleChipChange(value, name) {
      if (value) {
        setDepartmentName(value.label)
        setForm(_.set({ ...form }, name, value.value));
      } else {
        setDepartmentName("");
        setInForm(name, null);
      }
    }

    return (
        <FusePageSimple
          id = "el-ReportGeneralSMSs-Cover"
          classes={{
            toolbar: "min-h-80",
            rightSidebar: "w-288",
            content: classes.content,
          }}

          header={
            <div className="flex flex-1 items-center justify-between p-24 el-HeaderPage">
              <div className="flex flex-col">
                <Typography variant="h6">Báo cáo đặt khám theo ngày</Typography>
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
                <Button variant="contained" className="mx-20" color="secondary" onClick={() => { pdfExportComponent.save(); }}>
                  <Icon>assignment</Icon> In báo cáo
                </Button>
                <div style={{ position: "absolute", left: "-1000px", top: 0 }}>
                  <PDFExport
                    paperSize="A4"
                    margin="0.7cm"
                    fileName = {`Báo cáo đặt khám theo ngày từ ${moment(form.begin).format("DD/MM/YYYY")} - ${moment(form.end).format("DD/MM/YYYY")}.pdf`}
                    ref={(component) => setPdfExportComponent(component)}
                  >
                    <PDFAppointmentGeneral data = {reportData} begin = {form.begin} end = {form.end} department = {departmentName}/>
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
                  <FormControl className="el-flex-item flex-item-flex1">
                    <FuseChipSelect
                      options={
                        departmentsData && departmentsData.map(item => ({
                          value: item._id,
                          label: item.name
                        }))
                      }
                      onChange={(value) => handleChipChange(value, 'departmentId')}
                      placeholder="Chọn khoa/phòng"
                      isClearable={true}
                      textFieldProps={{
                        label: 'Chọn khoa/phòng',
                        InputLabelProps: {
                          shrink: true
                        },
                        variant: 'outlined'
                      }}
                    />
                  </FormControl>
                  <FuseAnimateGroup
                    className="flex flex-wrap justify-center"
                    enter={{
                      animation: "transition.slideUpBigIn"
                    }}
                  >
                    <Button variant="contained" className="mx-20" color="secondary"  onClick={searchReportAppointmentByDay}>
                      <Icon>search</Icon> Tìm kiếm
                    </Button>
                  </FuseAnimateGroup>
                </div>
              </div>
              <div className='el-block-report'>
                <ReactTable
                  className="-striped -highlight h-full overflow-hidden w-full el-TableUserActionReport"
                  data={callInData}
                  noDataText="Không có dữ liệu nào"
                  pageSize={(callInData&&callInData.length)||5}
                  showPagination={false}
                  sortable={false}
                  onFetchData={reportAppointmentByDay}
                  columns={[
                    {
                      Header: "#",
                      width: 70,

                      Cell: row => <div>{(row.index+1)}</div>
                    },
                    {
                      Header: "Ngày",
                      accessor: "date",

                      Cell: row => <div>{moment(row.value).format("DD/MM/YYYY")}</div>
                    },
                    {
                      Header: "Tổng đặt khám",
                      accessor: "total",

                    },
                    {
                      Header: "Đã phục vụ",
                      accessor: "serves",

                    },
                    {
                      Header: "Đã hủy",
                      accessor: "cancels",

                    },
                    {
                      Header: "Chờ duyệt",
                      accessor: "waitings",

                    }  ,
                    {
                      Header: "Đã duyệt",
                      accessor: "approves",

                    }
                  ]}
                />
              </div>


            </div>

          }
        />

    )
}

export default ReportGeneralAppointment;
