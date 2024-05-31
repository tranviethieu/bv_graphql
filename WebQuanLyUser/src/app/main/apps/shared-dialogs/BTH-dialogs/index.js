import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from '@fuse/hooks';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import { showMessage } from 'app/store/actions'
import { useDispatch } from 'react-redux';
import _ from 'lodash';
import * as Actions from '../actions';
import { Icon, Button, ButtonGroup, Tabs, Tab, TextField, Checkbox, List, Paper, Divider, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, CardActions, CardContent, Card, CardHeader, MobileStepper, FormControl } from '@material-ui/core';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import moment from 'moment';
import { FuseChipSelect } from '@fuse';
import ActionListItem from '../FloatUserDialog/ActionListItem';
import viLocale from "date-fns/locale/vi";
import UserMore from "./components/UserMore"
import AppointmentForm from './components/AppointmentForm'
import ExaminationForm from './components/ExaminationForm'
import TestResultForm from './components/TestResultForm'
import PrescriptionForm from './components/PrescriptionForm'
import ScanResultForm from './components/ScanResultForm'
import TicketForm from './components/TicketForm'
import history from '@history';

const today = new Date();
const tomorrow = moment(today).add(1, 'days').format('YYYY-MM-DD')
const initUser = {
    birthDay: new Date(),
    phoneNumber: ""
}
const initForm = {
    appointmentDate: tomorrow,
    departmentId:null,
    appointmentTime:null,
    channel: "CRM",
    note: ""
}
const initDepartment = {
    label: "",
    value: null,
    timeFrame: []
}
function UserActionDialog(props) {
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false)
    const [tabValue, setTabValue] = useState(0);
    //set số trang cho action list item
    const [activeStep, setActiveStep] = useState(0);
    const [maxSteps, setMaxsteps] = useState(0);
    const [page, setPage] = useState(0);
    //Chọn khoa phòng ban cho đặt khám
    const {form: department, setInForm: setDepartment} = useForm(initDepartment)
    //đối tượng dùng cho các thông tin người dùng
    const { form: user, setForm: setUser, handleChange: handleUserChange, setInForm: setInUser } = useForm(initUser);
    const [userMore, setUserMore] = useState(false);
    //các dối tượng phục vụ cho form đặt khắm
    const { form, setInForm } = useForm(initForm);
    //lịch sử các action theo form thông tin hiện đang nhập
    const [actions, setActions] = useState([]);
    //đối tượng cho form nhập ticket
    const { form: ticket, setInForm: setInTicket} = useForm({ type: "ADVISORY"});
    //đối tượng cho form nhập đơn thuốc
    const { form: prescription, setInForm: setInPrescription } = useForm({images: []})
    //đối tượng cho kết quả chụp chiếu
    const { form: scan, setInForm: setInScan } = useForm({images: []})
    //đối tượng kết quả xét nghiệm
    const { form: test, setInForm: setInTest} = useForm({images: []})
    //đối tượng kết quả khám
    const { form: examination, setInForm: setInExamination} = useForm({images: [], reExamination: false, reExaminiationDate: tomorrow, reExaminationTime: "00:00"})
    //các list thông tin để chọn
    const [provinces, setProvinces] = useState([])
    const [wards, setWards] = useState([])
    const [districts, setDistricts] = useState([])
    const [nations, setNations] = useState([])
    const [nationalitys, setNationalitys] = useState([])
    useEffect(() => {
        if (props._id) {
            Actions.getUserById(props._id, dispatch).then(response => {
                if (response.data)
                    setUser(response.data);
            })
        } else if (props.phoneNumber) {
            Actions.getUserByPhone(props.phoneNumber, dispatch).then(response => {
                if (response.data)
                    setUser(response.data);
            })
        }
    }, [dispatch, props, setUser])
    useEffect(() => {
        if (user._id) {
            if (props.type === "APPOINTMENT")
                Actions.getActions({ sorted: [{ id: 'updatedTime', desc: true }], filtered: [{ id: 'userId', value: user._id }, { id: "action", value: "APPOINTMENT" }, {id: "state", value: "ACTIVE"}], page: page, pageSize: 10 }, dispatch).then(response => {
                if (response.data)
                    setActions(response.data);
                    setMaxsteps(response.pages)
            })
            else if (props.type === "TICKET")
                Actions.getActions({ sorted: [{ id: 'updatedTime', desc: true }], filtered: [{ id: 'userId', value: user._id }, { id: "action", value: "TICKET" }, {id: "state", value: "ACTIVE"}], page: page, pageSize: 10 }, dispatch).then(response => {
                if (response.data)
                    setActions(response.data);
                    setMaxsteps(response.pages)
            })
            else if (props.type === "PRESCRIPTION")
                Actions.getActions({ sorted: [{ id: 'updatedTime', desc: true }], filtered: [{ id: 'userId', value: user._id }, { id: "action", value: "PRESCRIPTION" }, {id: "state", value: "ACTIVE"}], page: page, pageSize: 10 }, dispatch).then(response => {
                if (response.data)
                    setActions(response.data);
                    setMaxsteps(response.pages)
            })
            else if (props.type === "SCANRESULT")
                Actions.getActions({ sorted: [{ id: 'updatedTime', desc: true }], filtered: [{ id: 'userId', value: user._id }, { id: "action", value: "SCANRESULT" }, {id: "state", value: "ACTIVE"}], page: page, pageSize: 10 }, dispatch).then(response => {
                if (response.data)
                    setActions(response.data);
                    setMaxsteps(response.pages)
            })
            else if (props.type === "TESTRESULT")
                Actions.getActions({ sorted: [{ id: 'updatedTime', desc: true }], filtered: [{ id: 'userId', value: user._id }, { id: "action", value: "TESTRESULT" }, {id: "state", value: "ACTIVE"}], page: page, pageSize: 10 }, dispatch).then(response => {
                if (response.data)
                    setActions(response.data);
                    setMaxsteps(response.pages)
            })
            else if (props.type === "EXAMINATION")
                Actions.getActions({ sorted: [{ id: 'updatedTime', desc: true }], filtered: [{ id: 'userId', value: user._id }, { id: "action", value: "EXAMINATION" }, {id: "state", value: "ACTIVE"}], page: page, pageSize: 10 }, dispatch).then(response => {
                if (response.data)
                    setActions(response.data);
                    setMaxsteps(response.pages)
            })
        }
    }, [dispatch, page, props.type, user]);
    useEffect(()=>{
      setInUser('district', null)
      setInUser('ward', null)
      if(user.province){
        Actions.get_districts({filtered: [{id: "provinceCode", value: user.province.code}]},dispatch).then(response => {
            setDistricts(response.data.map(g => ({
                value: g.code, label: `${g.name}`
            })))
        })
      }
    }, [user.province])
    useEffect(()=>{
      setInUser('ward', null)
      if(user.district){
        Actions.get_wards({filtered: [{id: "districtCode", value: user.district.code}]},dispatch).then(response => {
            setWards(response.data.map(g => ({
                value: g.code, label: `${g.name}`
            })))
        })
      }
    }, [user.district])
    useEffect(()=>{
      Actions.get_provinces(dispatch).then(response => {
          setProvinces(response.data.map(g => ({
              value: g.code, label: `${g.name}`
          })))
      })
      Actions.get_nations(dispatch).then(response => {
          setNations(response.data.map(g => ({
              value: g.code, label: `${g.name}`
          })))
      })
      Actions.get_nationalitys(dispatch).then(response => {
          setNationalitys(response.data.map(g => ({
              value: g.code, label: `${g.name}`
          })))
      })
    },[])
    function handleUserDateChange(e){
        setInUser('birthDay', e);
    }
    // const handleUserMoreChange = useCallback((userMore) =>{
    //     setInUser('gender', userMore.gender)
    //     setInUser('mariage', userMore.mariage)
    // }, [setInUser])
    const handleChangeAppointmentForm = useCallback((appointment) => {
        setInForm('channel', props.channelType)
        setInForm('appointmentDate', appointment.appointmentDate)
        setInForm('appointmentTime', appointment.appointmentTime)
        setInForm('departmentId', appointment.departmentId)
        setInForm('note', appointment.note)
    }, [props.channelType, setInForm])
    const handleTestFormChange = useCallback((test)=>{
        setInTest('unitResults', test.unitResults)
        setInTest('title', test.title)
        setInTest('testId', test.testId)
        setInTest('images', test.images)
    }, [setInTest])
    const handleChangeExamForm = useCallback((examination) => {
        setInExamination('images', examination.images)
        setInExamination('conclusion', examination.conclusion)
        setInExamination('note', examination.note)
        setInExamination('reExamination', examination.reExamination)
        setInExamination('reExaminiationDate', examination.reExaminiationDate)
        setInExamination('reExaminationTime', examination.reExaminationTime)
    }, [setInExamination])
    const handlePresChange = useCallback((pres) =>{
        setInPrescription('drugs', pres.drugs)
        setInPrescription('images', pres.images)
        setInPrescription('note', pres.note)
    }, [setInPrescription])
    const handleChangeScan = useCallback((scan) =>{
        setInScan('note', scan.note)
        setInScan('conclusion', scan.conclusion)
        setInScan('images', scan.images)
    }, [setInScan])
    const handleChangeTicket = useCallback((ticket) => {
        setInTicket('type', ticket.type);
        setInTicket('title', ticket.title);
        setInTicket('note', ticket.note);
    }, [setInTicket])
    function handleChangeTab(e, tabValue) {
        setTabValue(tabValue);
    }
    function onFetchUser() {
        if (user.phoneNumber && user.phoneNumber.length > 0) {
            Actions.getUserByPhone(user.phoneNumber, dispatch).then(response => {
                if (response.data)
                    setUser(response.data);
            })
        }
    }
    function handleConfirm(){
        setOpen(false)
        dispatch(Actions.hideDialog(props.type));
    }
    function handleCancel(){
        setOpen(false)
    }
    const handleNext = () => {
      setActiveStep(prevActiveStep => prevActiveStep + 1);
      setPage(nowPage => nowPage + 1);
    };
    function handleUserChipChange(value, name) {
        setInUser(name, value.value)
    }
    function handleUserCodeBaseChange(value, name) {
      setInUser(name, {code: value.value, name: value.label})
    }
    const handleBack = () => {
      setActiveStep(prevActiveStep => prevActiveStep - 1);
      setPage(nowPage => nowPage - 1);
    };
    function handleSave() {
        if (props.type === "APPOINTMENT") {

            if (user._id) {
                Actions.saveUserAction(form, user._id, dispatch).then(response => {
                    console.log("response:", response);
                    if(response.code === 0){
                        dispatch(showMessage({ message: `Tạo lịch khám thành công khách hàng ${user.fullName}` }));
                        dispatch(Actions.hideDialog(props.type));
                        history.push("/apps/user-actions/appointments")
                    }
                    else {
                        dispatch(showMessage({ message: response.message }));
                    }
                })
            } else {
                Actions.saveUser(user, dispatch).then(response => {
                    if (response.data._id) {
                        //lưu thông tin người dùng thành công sẽ lưu tiếp thông tin đặt khám
                        Actions.saveUserAction(form ,  response.data._id).then(response => {
                            if(response.code === 0){
                                dispatch(showMessage({ message: `Tạo lịch khám thành công khách hàng ${user.fullName}` }));
                                dispatch(Actions.hideDialog(props.type));
                                history.push("/apps/user-actions/appointments")
                            }
                            else {
                                dispatch(showMessage({ message: response.message }));
                            }
                        })
                    }
                })
            }
        }
        else if(props.type === "TICKET"){
            if (user._id) {
                Actions.createTicket( user._id, ticket).then(response => {
                    if(response.code === 0){
                        dispatch(showMessage({ message: `Tạo yêu cầu thành công khách hàng ${user.fullName}` }));
                        dispatch(Actions.hideDialog(props.type));
                        history.push("/apps/user-actions/tickets")
                    }
                    else {
                        dispatch(showMessage({ message: `Tạo yêu cầu không thành công` }));
                    }
                })
            } else {
                Actions.saveUser(user, dispatch).then(response => {
                    if (response.data._id) {
                        //lưu thông tin người dùng thành công sẽ lưu tiếp thông tin
                        Actions.createTicket(response.data._id, ticket).then(response => {
                            if(response.code === 0){
                                dispatch(showMessage({ message: `Tạo yêu cầu thành công khách hàng ${user.fullName}` }));
                                dispatch(Actions.hideDialog(props.type));
                                history.push("/apps/user-actions/tickets")
                            }
                            else {
                                dispatch(showMessage({ message: `Tạo yêu cầu không thành công` }));
                            }
                        })
                    }
                })
            }
        }
        else if(props.type === "PRESCRIPTION"){
            if (user._id) {
                Actions.createPrescription( user._id, prescription).then(response => {
                    if(response.code === 0){
                        dispatch(showMessage({ message: `Tạo đơn thuốc thành công khách hàng ${user.fullName}` }));
                        dispatch(Actions.hideDialog(props.type));
                        history.push("/apps/user-actions/prescriptions")
                    }
                    else {
                        dispatch(showMessage({ message: `Tạo đơn thuốc không thành công` }));
                    }
                })
            } else {
                Actions.saveUser(user, dispatch).then(response => {
                    if (response.data._id) {
                        //lưu thông tin người dùng thành công sẽ lưu tiếp thông tin
                        Actions.createPrescription(response.data._id, prescription).then(response => {
                            if(response.code === 0){
                                dispatch(showMessage({ message: `Tạo đơn thuốc thành công khách hàng ${user.fullName}` }));
                                dispatch(Actions.hideDialog(props.type));
                                history.push("/apps/user-actions/prescriptions")
                            }
                            else {
                                dispatch(showMessage({ message: `Tạo đơn thuốc không thành công` }));
                            }
                        })
                    }
                })
            }
        }
        else if(props.type === "SCANRESULT"){
            if (user._id) {
                Actions.createScanResult( user._id, scan).then(response => {
                    if(response.code === 0){
                        dispatch(showMessage({ message: `Tạo kết quả chụp chiếu thành công khách hàng ${user.fullName}` }));
                        dispatch(Actions.hideDialog(props.type));
                        history.push("/apps/user-actions/scan-results")
                    }
                    else {
                        dispatch(showMessage({ message: `Tạo kết quả chụp chiếu không thành công` }));
                    }
                })
            } else {
                Actions.saveUser(user, dispatch).then(response => {
                    if (response.data._id) {
                        //lưu thông tin người dùng thành công sẽ lưu tiếp thông tin
                        Actions.createScanResult(response.data._id, scan).then(response => {
                            if(response.code === 0){
                                dispatch(showMessage({ message: `Tạo kết quả chụp chiếu thành công khách hàng ${user.fullName}` }));
                                dispatch(Actions.hideDialog(props.type));
                                history.push("/apps/user-actions/scan-results")
                            }
                            else {
                                dispatch(showMessage({ message: `Tạo kết quả chụp chiếu không thành công` }));
                            }
                        })
                    }
                })
            }
        }
        else if(props.type === "TESTRESULT"){
            if (user._id) {
                Actions.createTestResult( user._id, test).then(response => {
                    if(response.code === 0){
                        dispatch(showMessage({ message: `Tạo kết quả xét nghiệm thành công khách hàng ${user.fullName}` }));
                        dispatch(Actions.hideDialog(props.type));
                        history.push("/apps/user-actions/test-results")
                    }
                    else {
                        dispatch(showMessage({ message: `Tạo kết quả xét nghiệm không thành công` }));
                    }
                })
            } else {
                Actions.saveUser(user, dispatch).then(response => {
                    if (response.data._id) {
                        //lưu thông tin người dùng thành công sẽ lưu tiếp thông tin
                        Actions.createTestResult(response.data._id, test).then(response => {
                            if(response.code === 0){
                                dispatch(showMessage({ message: `Tạo kết quả xét nghiệm thành công khách hàng ${user.fullName}` }));
                                dispatch(Actions.hideDialog(props.type));
                                history.push("/apps/user-actions/test-results")
                            }
                            else {
                                dispatch(showMessage({ message: `Tạo kết quả xét nghiệm không thành công` }));
                            }
                        })
                    }
                })
            }
        }
        else if(props.type === "EXAMINATION"){
            if (user._id) {
                Actions.createExaminationResult( user._id, examination).then(response => {
                    if(response.code === 0){
                        dispatch(showMessage({ message: `Tạo kết quả khám thành công khách hàng ${user.fullName}` }));
                        dispatch(Actions.hideDialog(props.type));
                        history.push("/apps/user-actions/examinations")
                    }
                    else {
                        dispatch(showMessage({ message: `Tạo kết quả khám không thành công` }));
                    }
                })
            } else {
                Actions.saveUser(user, dispatch).then(response => {
                    if (response.data._id) {
                        //lưu thông tin người dùng thành công sẽ lưu tiếp thông tin
                        Actions.createExaminationResult(response.data._id, examination).then(response => {
                            if(response.code === 0){
                                dispatch(showMessage({ message: `Tạo kết quả khám thành công khách hàng ${user.fullName}` }));
                                dispatch(Actions.hideDialog(props.type));
                                history.push("/apps/user-actions/examinations")
                            }
                            else {
                                dispatch(showMessage({ message: `Tạo kết quả khám không thành công` }));
                            }
                        })
                    }
                })
            }
        }
    }
    function canBeSaveAppointment() {
        return (
            form && user && user.fullName && user.fullName.length>0 && user.phoneNumber && moment(user.birthDay).isValid() && user.phoneNumber.length>0 && form.departmentId && form.departmentId.length > 0 && form.appointmentTime && moment(form.appointmentDate).isValid() && moment(form.appointmentDate).isAfter(moment(today))
        )
    }
    function canBeSaveTicket() {
        return (
            form && user && user.fullName && user.fullName.length>0 && user.phoneNumber && moment(user.birthDay).isValid() && user.phoneNumber.length>0 && ticket.title && ticket.title.length > 0
        )
    }
    function canBeSavePrescription() {
        return (
            form && user && prescription && user.fullName && user.fullName.length>0 && user.phoneNumber && user.phoneNumber.length>0 && moment(user.birthDay).isValid() && ((prescription.images && prescription.images.length > 0)|| (prescription.drugs && prescription.drugs.length > 0))
        )
    }
    function canBeSaveTest() {
        return (
            form && user && test && user.fullName && user.fullName.length>0 && user.phoneNumber && user.phoneNumber.length>0 && moment(user.birthDay).isValid() && test.title && test.title.length > 0 && test.testId && test.testId.length > 0 && test.unitResults && test.unitResults.length > 0
        )
    }
    function canBeSaveScan() {
        return (
            form && user && scan && user.fullName && user.fullName.length>0 && user.phoneNumber && user.phoneNumber.length>0 && moment(user.birthDay).isValid() && scan.conclusion && scan.conclusion.length > 0 && scan.images && scan.images.length > 0
        )
    }
    function canBeSaveExam() {
        return (
            form && user && scan && user.fullName && user.fullName.length>0 && user.phoneNumber && user.phoneNumber.length>0 && moment(user.birthDay).isValid() && examination.conclusion && examination.conclusion.length > 0 && moment(examination.reExaminiationDate).isValid() && moment(examination.reExaminiationDate).isAfter(moment(today))
        )
    }
    return (
        <Card className = {props.className}>
          <CardHeader
            className = "el-CardHeader-UA"
            action={
              <IconButton aria-label="settings" onClick={()=> setOpen(true)}>
                <Icon>close</Icon>
              </IconButton>
            }
            title={props.type === "APPOINTMENT" ? "Tạo lịch khám"
            : props.type === "TICKET" ? "Tạo yêu cầu khách hàng"
            : props.type === "PRESCRIPTION"? "Tạo đơn thuốc"
            : props.type === "SCANRESULT" ? "Tạo kết quả chụp chiếu"
            : props.type ==="TESTRESULT" ? "Tạo kết quả xét nghiệm"
            : props.type === "BOOKING" ? "Đặt khám"
            : "Tạo kết quả khám"
            }
          />
          {
            props.type !== "BOOKING" &&
            <Tabs
              className = "el-Tabs-Draggable"
              value={tabValue}
              onChange={handleChangeTab}
              indicatorColor="secondary"
              textColor="secondary"
              variant="scrollable"
              scrollButtons="auto"
              classes={{ root: "w-full h-64" }}
            >
              <Tab className="h-64 normal-case" label="Thông tin" />
              <Tab className="h-64 normal-case" label="Lịch sử" />
            </Tabs>
          }
          <CardContent className = "el-CardContent-UA">
            {
              tabValue === 0 &&
              <form style={{ maxHeight: "55vh", overflow: 'auto', paddingRight: "10px" }}>
                <div className="flex flex-wrap">
                  <div className="md:w-1/2 sm:w-1/2 p-4">
                    <TextField
                      className="mt-8 mb-16"
                      error={user.phoneNumber === '' || !user.phoneNumber}
                      required
                      autoFocus
                      label="Số điện thoại"
                      id="phoneNumber"
                      name="phoneNumber"
                      margin = "dense"
                      value={user.phoneNumber || ''}
                      onInput = {(e) =>{
                        e.target.value = e.target.value.replace(/[^0-9\s]/gi, '')
                      }}
                      onChange={handleUserChange}
                      variant="outlined"
                      fullWidth
                      onKeyPress={e => {
                        if (e.charCode === 13) onFetchUser();
                      }}
                    />
                  </div>
                  <div className="md:w-1/2 sm:w-1/2 p-4">
                    <TextField
                      className="mt-8 mb-16"
                      error={user.fullName === ''|| !user.fullName}
                      required
                      label="Tên khách hàng"
                      id="fullName"
                      name="fullName"
                      onInput = {(e) =>{
                        e.target.value = e.target.value.replace(/[^a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s]/gi, '')
                      }}
                      value={user.fullName || ''}
                      onChange={handleUserChange}
                      variant="outlined"
                      fullWidth
                      margin="dense"
                    />
                  </div>
                  <div className="md:w-1/2 sm:w-1/2 p-4">
                    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={viLocale}>
                      <KeyboardDatePicker
                        disableToolbar
                        fullWidth
                        className="mt-8 mb-16"
                        autoOk
                        label = "Ngày sinh"
                        variant="inline"
                        id="birthDay"
                        name="birthDay"
                        inputVariant="outlined"
                        value={moment(user.birthDay).format("YYYY-MM-DD")}
                        onChange={e => handleUserDateChange(e) }
                        format="dd/MM/yyyy"
                        invalidDateMessage="Ngày không hợp lệ"
                        margin="dense"
                        minDateMessage = "Năm sinh không thể nhỏ hơn năm 1900"
                      />
                    </MuiPickersUtilsProvider>
                  </div>
                  <div className="md:w-1/2 sm:w-1/2 p-4 select-up">
                    <FuseChipSelect
                      margin='dense'
                      className="mt-8 mb-24"
                      value={
                        { value: user.gender, label: user.gender === "1"? "Nam giới" : user.gender === "2" ? "Nữ giới" : "Chưa xác định" }
                      }
                      style = {{ height: 20 }}
                      onChange={(value) => handleUserChipChange(value, 'gender')}
                      textFieldProps={{
                          label: 'Giới tính',
                        InputLabelProps: {
                            shrink: true
                        },
                          variant: 'outlined'
                      }}
                      options={[{ value: "2", label: "Nữ giới" }, { value: "1", label: "Nam giới" }, { value: "", label: "Chưa xác định" }]}
                    />
                  </div>
                  <div className="md:w-1/2 sm:w-1/2 p-4 select-up">
                    <FuseChipSelect
                      margin='dense'
                      className="mt-8 mb-24"
                      value={
                        user.nationality ? { value: user.nationality.code, label: user.nationality.name } : null
                      }
                      style = {{ height: 20 }}
                      onChange={(value) => handleUserCodeBaseChange(value, 'nationality')}
                      textFieldProps={{
                          label: 'Quốc tịch',
                        InputLabelProps: {
                            shrink: true
                        },
                          variant: 'outlined'
                      }}
                      options= {nationalitys}
                    />
                  </div>
                  <div className="md:w-1/2 sm:w-1/2 p-4 select-up">
                    <FuseChipSelect
                      margin='dense'
                      className="mt-8 mb-24"
                      value={
                        user.nation ? { value: user.nation.code, label: user.nation.name } : null
                      }
                      style = {{ height: 20 }}
                      onChange={(value) => handleUserCodeBaseChange(value, 'nation')}
                      textFieldProps={{
                          label: 'Dân tộc',
                        InputLabelProps: {
                            shrink: true
                        },
                          variant: 'outlined'
                      }}
                      options={nations}
                    />
                  </div>
                  <div className="md:w-1/2 sm:w-1/2 p-4 select-up">
                    <FuseChipSelect
                      margin='dense'
                      className="mt-8 mb-24"
                      value={
                        user.province ?  { value: user.province.code, label: user.province.name } : null
                      }
                      style = {{ height: 20 }}
                      onChange={(value) => handleUserCodeBaseChange(value, 'province')}
                      textFieldProps={{
                          label: 'Tỉnh/Thành phố',
                        InputLabelProps: {
                            shrink: true
                        },
                          variant: 'outlined'
                      }}
                      options= {provinces}
                    />
                  </div>
                  <div className="md:w-1/2 sm:w-1/2 p-4 select-up">
                    <FuseChipSelect
                      margin='dense'
                      className="mt-8 mb-24"
                      value={
                        user.district ? { value: user.district.code, label: user.district.name } : null
                      }
                      style = {{ height: 20 }}
                      onChange={(value) => handleUserCodeBaseChange(value, 'district')}
                      textFieldProps={{
                          label: 'Quận/Huyện',
                        InputLabelProps: {
                            shrink: true
                        },
                          variant: 'outlined'
                      }}
                      options={districts}
                    />
                  </div>
                  <div className="md:w-1/2 sm:w-1/2 p-4 select-up">
                    <FuseChipSelect
                      margin='dense'
                      className="mt-8 mb-24"
                      value={
                        user.ward ? { value: user.ward.code, label: user.ward.name } : null
                      }
                      style = {{ height: 20 }}
                      onChange={(value) => handleUserCodeBaseChange(value, 'ward')}
                      textFieldProps={{
                          label: 'Phường/Xã',
                        InputLabelProps: {
                            shrink: true
                        },
                          variant: 'outlined'
                      }}
                      options={wards}
                    />
                  </div>
                  <div className="md:w-1/2 sm:w-1/2 p-4">
                    <TextField
                      className="mt-8 mb-16"
                      label="Số nhà/Tên đường/Khu"
                      id="street"
                      name="street"
                      value={user.street || ''}
                      onChange={handleUserChange}
                      variant="outlined"
                      fullWidth
                      margin="dense"
                    />
                  </div>
                  <div className="md:w-1/2 sm:w-1/2 p-4">
                    <TextField
                      className="mt-8 mb-16"
                      label="Số CMND/Thẻ căn cước"
                      id="nationIdentification"
                      name="nationIdentification"
                      value={user.nationIdentification || ''}
                      onChange={handleUserChange}
                      variant="outlined"
                      fullWidth
                      margin="dense"
                    />
                  </div>
                  <div className="md:w-1/2 sm:w-1/2 p-4">
                    <TextField
                      className="mt-8 mb-16"
                      label="Bảo hiểm Y tế"
                      id="insuranceCode"
                      name="insuranceCode"
                      value={user.insuranceCode || ''}
                      onChange={handleUserChange}
                      variant="outlined"
                      fullWidth
                      margin="dense"
                    />
                  </div>
                </div>
                <Divider/>
                {
                  props.type === "APPOINTMENT" ?
                    <AppointmentForm onAppointmentChange = {handleChangeAppointmentForm} appointment = {form} department = {department} setDepartment = {setDepartment}/>
                  : props.type === "TICKET" ?
                    <TicketForm onTicketChange = {handleChangeTicket} ticket = {ticket}/>
                  : props.type === "PRESCRIPTION" ?
                    <PrescriptionForm onPresChange={handlePresChange} pres = {prescription}/>
                  : props.type === "SCANRESULT" ?
                    <ScanResultForm onScanChange = {handleChangeScan} scan = {scan}/>
                  : props.type === "TESTRESULT" ?
                    <TestResultForm onTestChange = {handleTestFormChange} test = {test}/>
                  : props.type === "EXAMINATION"?
                    <ExaminationForm onExaminationChange = {handleChangeExamForm} examination = {examination}/>
                  :<div></div>
                }
              </form>
            }
            {
              tabValue === 1 &&
              <Paper className = "el-History">
                <List>
                  {
                    actions.map((action, index) => <ActionListItem key={index} todo={action} type={props.type} userName = {user.fullName}/>)
                  }
                </List>
              </Paper>
            }
          </CardContent>
          {tabValue === 0 ?
            <CardActions disableSpacing className = "el-CardActions-UA">
              <ButtonGroup>
                <Button color="primary" disabled={props.type === "APPOINTMENT" ? !canBeSaveAppointment(): props.type === "TICKET" ? !canBeSaveTicket() : props.type === "PRESCRIPTION" ? !canBeSavePrescription() : props.type === "TESTRESULT" ? !canBeSaveTest() : props.type === "SCANRESULT" ? !canBeSaveScan() : !canBeSaveExam()} onClick={handleSave} variant="contained">
                  Lưu thông tin
                </Button>
                </ButtonGroup>
                  </CardActions>
                :
                <div>
                  {
                    actions.length > 0 &&
                    <CardActions disableSpacing className = "el-CardActionHistory">
                      <MobileStepper
                        steps={maxSteps}
                        position="static"
                        variant="text"
                        activeStep={activeStep}
                        nextButton={
                          <Button className = "el-ButtonLowerCase" size="small" onClick={handleNext} disabled={activeStep === maxSteps - 1}>
                            Trang tiếp
                            <KeyboardArrowRight />
                          </Button>
                        }
                        backButton={
                          <Button className = "el-ButtonLowerCase" size="small" onClick={handleBack} disabled={activeStep === 0}>
                            <KeyboardArrowLeft />
                            Trang trước
                          </Button>
                        }
                      />
                    </CardActions>
                  }
                </div>
                }
          <Dialog onClose = {handleCancel} open = {open}>
            <DialogTitle>Thông báo</DialogTitle>
            <DialogContent>
              Chưa hoàn thành tạo mới, bạn có chắc chắn muốn dừng việc tạo mới không?
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCancel} color = "primary">
                Không
              </Button>
              <Button color="primary" onClick={handleConfirm} variant="contained">
                Có
              </Button>
            </DialogActions>
          </Dialog>
        </Card>
    )
}

export default UserActionDialog;
