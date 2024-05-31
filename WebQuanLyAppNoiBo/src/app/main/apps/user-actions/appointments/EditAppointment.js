import React, { useEffect, useState } from 'react';
import { Button, Tab, Tabs, TextField, Checkbox, InputAdornment, IconButton, Icon, Typography, Divider } from '@material-ui/core';
import { FuseAnimate, FusePageCarded, FuseChipSelect, FuseUtils } from '@fuse';
import * as Actions from './store/actions';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from '@fuse/hooks';
import { Link } from 'react-router-dom';
import _ from '@lodash';
import ReactTable from 'react-table';
import moment from 'moment';
import { showMessage } from 'app/store/actions';

const initUser = {
    birthDay: new Date()
}
const initForm = {
    appointmentDate: new Date(),
    departmentId:null,
    appointmentTime:""
}
const initDepartment = {
    label: "",
    value: "",
    datetime:[],
    dayOfWeek: {
        label: "",
        value: ""
    },
    timeFrame: []
}
function EditAppointment(props) {
    const dispatch = useDispatch();
    const [tabValue, setTabValue] = useState(0);
    const { form, handleChange, setForm, setInForm } = useForm(initForm);
    const { form: user, handleChange: handleUserChange, setForm: setUser } = useForm(initUser);
    const [departments, setDepartments] = useState([]);
    const {selectedDepartment, setSelectedDepartment} = useState({});
    const {form: department, handleChange: handleDepartmentChange, setInForm: setDepartment} = useForm(initDepartment)
    const [historyAppointments, setHistoryAppointments] = useState([]);
    const [userMore, setUserMore] = useState(false);
    useEffect(() =>{
        Actions.getDepartments({},dispatch).then(response =>{
            setDepartments(response.data)
        })
    }, [setDepartments])
    const fetchData = (state) => {
        const { page, pageSize, sorted, filtered } = state;
        if(user._id){
            filtered.push({id: "action", value: "APPOINTMENT"});
            filtered.push({id: "userId", value: user._id})
            Actions.getAppointments({ page:0, pageSize:10, sorted, filtered }, dispatch)
                .then(response => {
                    setHistoryAppointments(response.data)
                })
        }
    }
    useEffect(() => {
        const { _id, phoneNumber } = props.match.params;
        if (_id == "new") {
            //khong co chuyen gi xay ra
            setForm({ ...form, channel: "CRM" });
        } else if (_id == "call") {
            //su dung toi phoneNumber
            setForm({ ...form, channel: "CRM" });
            if (phoneNumber) {
                setUser({ ...user, phoneNumber });
                Actions.getUserByPhone(phoneNumber).then(response => {
                    if (response.data && response.data.length > 0)
                        setUser(response.data[0]);
                })
            }
        }
    }, [props.match.params]);
    function handleTimeChange(value){
        setInForm('appointmentTime', value.value)
    }
    function handleChangeTab(event, tabValue) {
        setTabValue(tabValue);
    }
    function handleDOWChange(value) {
        setDepartment('dayOfWeek', {label: value.label, value: value.value})
        if(value.timeFrame){
            setDepartment('timeFrame', value.timeFrame)
        }
    }
    function handleChipChange(value, name) {
        setInForm('departmentId', value.value)
        setDepartment('label', value.label)

        var departId = value.value
        Actions.getDepartment(departId, dispatch).then(response=>{
            // setDepartment('datetime', response.data.servingTimes)
            if(response.data.servingTimes && response.data.servingTimes.length>0){
                response.data.servingTimes.forEach(function(item, index){
                    if(item.dayOfWeek == "MONDAY"){
                        let object = {
                            dayOfWeek: item.dayOfWeek,
                            value: item.dayOfWeek,
                            label: "Thứ hai",
                            maxProcess: item.maxProcess,
                            timeFrame: item.timeFrame
                        }
                        setDepartment(`datetime[${index}]`, object)
                    }
                    else if(item.dayOfWeek == "TUESDAY"){
                        let object = {
                            dayOfWeek: item.dayOfWeek,
                            value: item.dayOfWeek,
                            label: "Thứ ba",
                            maxProcess: item.maxProcess,
                            timeFrame: item.timeFrame
                        }
                        setDepartment(`datetime[${index}]`, object)
                    }
                    else if(item.dayOfWeek == "WEDNESDAY"){
                        let object = {
                            dayOfWeek: item.dayOfWeek,
                            value: item.dayOfWeek,
                            label: "Thứ tư",
                            maxProcess: item.maxProcess,
                            timeFrame: item.timeFrame
                        }
                        setDepartment(`datetime[${index}]`, object)
                    }
                    else if(item.dayOfWeek == "THURSDAY"){
                        let object = {
                            dayOfWeek: item.dayOfWeek,
                            value: item.dayOfWeek,
                            label: "Thứ năm",
                            maxProcess: item.maxProcess,
                            timeFrame: item.timeFrame
                        }
                        setDepartment(`datetime[${index}]`, object)
                    }
                    else if(item.dayOfWeek == "FRIDAY"){
                        let object = {
                            dayOfWeek: item.dayOfWeek,
                            value: item.dayOfWeek,
                            label: "Thứ sáu",
                            maxProcess: item.maxProcess,
                            timeFrame: item.timeFrame
                        }
                        setDepartment(`datetime[${index}]`, object)
                    }
                    else if(item.dayOfWeek == "SATURDAY"){
                        let object = {
                            dayOfWeek: item.dayOfWeek,
                            value: item.dayOfWeek,
                            label: "Thứ bảy",
                            maxProcess: item.maxProcess,
                            timeFrame: item.timeFrame
                        }
                        setDepartment(`datetime[${index}]`, object)
                    }
                    else if(item.dayOfWeek == "SUNDAY"){
                        let object = {
                            dayOfWeek: item.dayOfWeek,
                            value: item.dayOfWeek,
                            label: "Chủ nhật",
                            maxProcess: item.maxProcess,
                            timeFrame: item.timeFrame
                        }
                        setDepartment(`datetime[${index}]`, object)
                    }

                })
            }
        })

    }
    function handleUserChipChange(value, name) {
        setUser(_.set({ ...user }, name, value.value));
    }
    function onFetchUser() {
        if (user.phoneNumber && user.phoneNumber.length > 0) {
            Actions.getUserByPhone(user.phoneNumber).then(response => {
                if (response.data && response.data.length > 0)
                    setUser(response.data[0]);
            })
        }
    }
    // function
    function handleSave() {
        // console.log("asdsd: ", JSON.stringify(form))
        if (user._id) {
            Actions.saveUserAction(form , user._id).then(response => {
                dispatch(showMessage({ message: `Tạo lịch khám thành công khách hàng ${user.fullName}` }));
                setUser(initUser);
                setForm(initForm);
            })
        } else {
            Actions.saveUser(user, dispatch).then(response => {
                if (response.data._id) {
                    //lưu thông tin người dùng thành công sẽ lưu tiếp thông tin đặt khám
                    Actions.saveUserAction(form ,  response.data._id).then(response => {
                        dispatch(showMessage({ message: `Tạo lịch khám thành công khách hàng ${user.fullName}` }));
                    })
                }
            })
        }
    }
    return (
        <FusePageCarded
          classes={{
            toolbar: "p-0",
            header: "min-h-72 h-72 sm:h-136 sm:min-h-136"
          }}
          header={
            form && (
              <div className="flex flex-1 w-full items-center justify-between">

                <div className="flex flex-col items-start max-w-full">

                  <FuseAnimate animation="transition.slideRightIn" delay={300}>
                    <Typography className="normal-case flex items-center sm:mb-12" component={Link} role="button" to="/apps/appointments" color="inherit">
                      <Icon className="mr-4 text-20">arrow_back</Icon>
                      Lịch khám
                    </Typography>
                  </FuseAnimate>
                  <div className="flex items-center max-w-full">

                    <div className="flex flex-col min-w-0">
                      <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                        <Typography className="text-16 sm:text-20 truncate">
                          {user.name ? user.name : 'Tạo lịch khám'}
                        </Typography>
                      </FuseAnimate>
                      <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                        <Typography variant="caption">Chi tiết đặt khám</Typography>
                      </FuseAnimate>
                    </div>
                  </div>
                </div>
                <FuseAnimate animation="transition.slideRightIn" delay={300}>
                  <Button
                    className="whitespace-no-wrap"
                    variant="contained"
                    onClick={handleSave}
                  >
                    Lưu thông tin
                  </Button>
                </FuseAnimate>
              </div>
            )
          }
          contentToolbar={
            <Tabs
              value={tabValue}
              onChange={handleChangeTab}
              indicatorColor="secondary"
              textColor="secondary"
              variant="scrollable"
              scrollButtons="auto"
              classes={{ root: "w-full h-64" }}
            >
              <Tab className="h-64 normal-case" label="Thông tin đặt khám" />
              <Tab className="h-64 normal-case" label="Lịch sử đặt khám" />
              {/* <Tab className="h-64 normal-case" label="Lịch sử khám" />
              <Tab className="h-64 normal-case" label="Yêu cầu" /> */}
            </Tabs>
          }
          content={
            form && (

              <div className="p-16 sm:p-24">
                {tabValue === 0 &&
                  (
                    <form noValidate onSubmit={handleSave} className="flex flex-col overflow-hidden">
                      <div className="flex flex-wrap">
                        <div className="md:w-1/4 sm:w-1/2 p-4">
                          <TextField
                            className="mt-8 mb-16"
                            error={user.phoneNumber === ''}
                            required
                            label="Số điện thoại"
                            id="phoneNumber"
                            name="phoneNumber"
                            value={user.phoneNumber}
                            onChange={handleUserChange}
                            variant="outlined"
                            fullWidth
                            onKeyPress={e => {
                              if (e.charCode === 13) onFetchUser();
                            }}
                          />
                        </div>
                        <div className="md:w-1/4 sm:w-1/2 p-4">
                          <TextField
                            className="mt-8 mb-16"
                            error={user.fullName === ''}
                            required
                            label="Tên bệnh nhân"
                            id="fullName"
                            name="fullName"
                            value={user.fullName|| ''}
                            onChange={handleUserChange}
                            variant="outlined"
                            fullWidth
                          />
                        </div>
                        <div className="md:w-1/4 sm:w-1/2 p-4">
                          <TextField
                            className="mt-8 mb-16"
                            label="Ngày sinh"
                            id="birthDay"
                            name="birthDay"
                            type="date"
                            value={moment(user.birthDay).format("YYYY-MM-DD")}
                            onChange={handleUserChange}
                            variant="outlined"
                            fullWidth
                          />
                        </div>
                        <div className="md:w-1/4 sm:w-1/2 p-4">
                          <TextField
                            className="mt-8 mb-16"
                            label="Địa chỉ"
                            id="address"
                            name="address"
                            value={user.address|| ''}
                            onChange={handleUserChange}
                            variant="outlined"
                            fullWidth
                          />
                        </div>
                      </div>
                      <div>
                        <Checkbox
                          checked={userMore}
                          onChange={e => { setUserMore(e.target.checked) }}
                        />
                        <label>Bổ sung thông tin</label>
                      </div>
                      {userMore && <div className="flex flex-wrap w-full">
                        <div className="md:w-1/4 sm:w-1/2 p-4">
                          <FuseChipSelect
                            className="mt-8 mb-24"
                            value={
                              { value: user.gender, label: user.gender }
                            }
                            onChange={(value) => handleUserChipChange(value, 'gender')}
                            textFieldProps={{
                              label: 'Giới tính',
                              InputLabelProps: {
                                shrink: true
                              },
                              variant: 'outlined'
                            }}
                            options={[{ value: "female", label: "Nữ giới" }, { value: "male", label: "Nam giới" }, { value: "", label: "Chưa xác định" }]}

                          />
                        </div>
                        <div className="md:w-1/4 sm:w-1/2 p-4">
                          <TextField
                            className="mt-8 mb-16"
                            label="Thư điện tử"
                            id="email"
                            name="email"
                            value={user.email}
                            onChange={handleUserChange}
                            variant="outlined"
                            fullWidth
                          />
                        </div>
                        <div className="md:w-1/4 sm:w-1/2 p-4">
                          <TextField
                            className="mt-8 mb-16"
                            label="Công việc"
                            id="work"
                            name="work"
                            value={user.work}
                            onChange={handleUserChange}
                            variant="outlined"
                            fullWidth
                          />
                        </div>
                        <div className="md:w-1/4 sm:w-1/2 p-4">
                          <Checkbox
                            checked={user.mariage}
                            id="mariage"
                            name="mariage"
                            onChange={handleUserChange}
                          />
                          <label>Đã lập gia đình</label>
                        </div>
                      </div>
                      }
                      <Divider />
                      <Typography className="text-17 p-5">Thông tin đặt khám</Typography>
                      <div className="flex flex-wrap">
                        <div className="md:w-1/4 sm:w-1/2 p-4">
                          <FuseChipSelect
                            className="mt-8 mb-24"
                            value={
                              { value: form.departmentId, label: department.label }
                            }
                            onChange={(value) => handleChipChange(value, 'department')}
                            placeholder="Chọn khoa khám"
                            textFieldProps={{
                              label: 'Khoa khám',
                              InputLabelProps: {
                                shrink: true
                              },
                              variant: 'outlined'
                            }}
                            options={departments.map((item) => ({
                              value: item.value, label: item.label
                            }))}
                          />
                        </div>
                        {
                          department.datetime.length>0 &&
                          <div className="md:w-1/4 sm:w-1/2 p-4">
                            <FuseChipSelect
                              className="mt-8 mb-24"
                              value={
                                { value: department.dayOfWeek.value, label: department.dayOfWeek.label, timeFrame: department.timeFrame }
                              }
                              onChange={(value) => handleDOWChange(value, 'dayOfWeek')}
                              placeholder="Chọn buổi khám"
                              textFieldProps={{
                                label: 'Buổi khám',
                                InputLabelProps: {
                                  shrink: true
                                },
                                variant: 'outlined'
                              }}
                              options={department.datetime.map((item) => ({
                                value: item.value, label: item.label, timeFrame: item.timeFrame
                              }))}
                            />
                          </div>
                        }
                        {
                          (department.timeFrame.length>0 && department.timeFrame) &&
                          <div className="md:w-1/4 sm:w-1/2 p-4">
                            <FuseChipSelect
                              className="mt-8 mb-24"
                              value={
                                { value: form.appointmentTime, label: form.appointmentTime}
                              }
                              onChange={(value) => handleTimeChange(value, 'timeFrame')}
                              placeholder="Chọn thời gian"
                              textFieldProps={{
                                label: 'Thời gian khám',
                                InputLabelProps: {
                                  shrink: true
                                },
                                variant: 'outlined'
                              }}
                              options={department.timeFrame.map((item) => ({
                                value: item, label: item
                              }))}
                            />
                          </div>
                        }
                        <div className="md:w-1/4 sm:w-1/2 p-4">
                          <TextField
                            className="mt-8 mb-16"
                            error={form.appointmentDate === ''}
                            required
                            label="Chọn ngày khám"
                            id="appointmentDate"
                            name="appointmentDate"
                            value={moment(form.appointmentDate).format("YYYY-MM-DD")}
                            onChange={handleChange}
                            type='date'
                            variant="outlined"
                            fullWidth
                          />
                        </div>
                        {/* <KeyboardDatePicker
                          autoOk
                          variant="inline"
                          inputVariant="outlined"
                          label="With keyboard"
                          format="dd/MM/yyyy"
                          value={form.appointmentDate}
                          // InputAdornmentProps={{ position: "start" }}
                          // onChange={date => handleDateChange(date)}
                        /> */}
                      </div>
                      <TextField
                        className="mt-8 mb-16"
                        id="note"
                        name="note"
                        onChange={handleChange}
                        label="Ghi chú Nội dung khám"
                        type="text"
                        value={form.description}
                        multiline
                        rows={5}
                        variant="outlined"
                        fullWidth
                      />

                    </form>

                  )}
                {
                  (tabValue == 1 || tabValue == 2) && <ReactTable
                    className="-striped -highlight h-full w-full sm:rounded-8 overflow-hidden"
                    data={historyAppointments}
                    defaultPageSize={10}
                    filterable={true}
                    sortable={true}
                    onFetchData={fetchData}
                    columns={[
                      {
                        Header: 'Ngày khám',
                        accessor: 'appointment.appointmentDate',

                        Cell: row => <div>{moment(row.value).format("DD/MM/YYYY")}</div>
                      },
                      {
                        Header: 'Giờ khám',
                        accessor: 'appointment.appointmentTime',

                      },
                      {
                        Header: 'Khoa khám',
                        accessor: 'appointment.department.name',

                      },
                      {
                        Header: 'Kênh',
                        accessor: 'appointment.channel',

                      },
                      {
                        Header: 'Thời gian đặt',
                        accessor: 'createdTime',

                        Cell: row => <div>{moment(row.value).format("HH:mm DD/MM/YYYY")}</div>
                      },
                      {
                        Header: "Tình trạng",
                        accessor: 'appointment.state',

                        Cell: row => <div>
                          <IconButton>
                            {row.value == "WAITING" ? <Icon className="text-orange">radio_button_unchecked</Icon> : row.value == "CANCEL" ? <Icon className="text-red">remove_circle</Icon> : row.value=="SERVED"?<Icon className="text-blue">check_circle</Icon>:<Icon className="text-green">check_circle</Icon>}
                          </IconButton>
                        </div>
                      }
                    ]}
                                                      />
                }
              </div>
                )
            }
        />
    )
}

export default EditAppointment;
