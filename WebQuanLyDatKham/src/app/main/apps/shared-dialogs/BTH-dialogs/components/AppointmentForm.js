import React, {useEffect, useState} from 'react';
import { TextField, Typography } from '@material-ui/core';
import {useForm, useUpdateEffect} from '@fuse/hooks';
import { FuseChipSelect } from '@fuse';
import { useDispatch } from 'react-redux';
import * as Actions from '../../actions'
import viLocale from "date-fns/locale/vi";
import moment from 'moment';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';

const today = new Date();
const tomorrow = moment(today).add(1, 'days').format('YYYY-MM-DD')
function AppointmentForm(props) {
    const dispatch = useDispatch()
    const { onAppointmentChange, appointment, department, setDepartment } = props;
    const { form, handleChange, setInForm} = useForm(appointment);
    const [departments, setDepartments] = useState([]);
    // const {form: department, setInForm: setDepartment} = useForm(initDepartment)
    useEffect(() =>{
        Actions.getDepartments({},dispatch).then(response =>{
            setDepartments(response.data)
        })
    }, [dispatch, setDepartments])

    useUpdateEffect(() => {
        onAppointmentChange(form);
    }, [form, onAppointmentChange]);
    function handleTimeChange(value){
        setInForm('appointmentTime', value.value)
    }
    function setTimeFrameByDay(dow, departId){
        Actions.getDepartment(departId, dispatch).then(response=>{
            if(response.data.servingTimes && response.data.servingTimes.length>0){
                response.data.servingTimes.forEach(function(item, index){
                    if(dow === 0 && item.dayOfWeek === "SUNDAY"){
                        if(item.timeFrame){
                            setDepartment(`timeFrame`, item.timeFrame)
                        }
                    }
                    else if(dow === 1 && item.dayOfWeek === "MONDAY"){
                        if(item.timeFrame){
                            setDepartment(`timeFrame`, item.timeFrame)
                        }
                    }
                    else if(dow === 2 && item.dayOfWeek === "TUESDAY"){
                        if(item.timeFrame){
                            setDepartment(`timeFrame`, item.timeFrame)
                        }
                    }
                    else if(dow === 3 && item.dayOfWeek === "WEDNESDAY"){
                        if(item.timeFrame){
                            setDepartment(`timeFrame`, item.timeFrame)
                        }
                    }
                    else if(dow === 4 && item.dayOfWeek === "THURSDAY"){
                        if(item.timeFrame){
                            setDepartment(`timeFrame`, item.timeFrame)
                        }
                    }
                    else if(dow === 5 && item.dayOfWeek === "FRIDAY"){
                        if(item.timeFrame){
                            setDepartment(`timeFrame`, item.timeFrame)
                        }
                    }
                    else if(dow === 6 && item.dayOfWeek === "SATURDAY"){
                        if(item.timeFrame){
                            setDepartment(`timeFrame`, item.timeFrame)
                        }
                    }
                })
            }
        })
    }
    function handleDateChange(date){
        setInForm('appointmentDate', date);
        let day = moment(date);
        let dow = day.day();
        setInForm('appointmentTime', null);
        setTimeFrameByDay(dow, form.departmentId)
    }
    function handleChipChange(value) {
        setInForm('departmentId', value.value)
        setDepartment('label', value.label)
        setInForm('appointmentTime', null);
        let date = moment(form.appointmentDate);
        let dow = date.day();
        setTimeFrameByDay(dow, value.value)
    }
    return (
        <div className = "el-coverAppointmentForm">
          <Typography className="text-17">Thông tin đặt khám</Typography>
          <div className="p-4">
            <FuseChipSelect
              className="mt-8 mb-24"
              required
              value={
                form.departmentId ? { value: form.departmentId, label: department.label } : null
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
          <div className="flex flex-wrap">
            {
              form.departmentId &&
              <div className="md:w-1/2 sm:w-1/2 p-4">
                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={viLocale}>
                  <KeyboardDatePicker
                    disableToolbar
                    fullWidth
                    className="mt-8 mb-16"
                    autoOk
                    label = "Chọn ngày khám"
                    variant="inline"
                    inputVariant="outlined"
                    value={moment(form.appointmentDate).format("YYYY-MM-DD")}
                    onChange={e => handleDateChange(e) }
                    minDate={tomorrow}
                    format="dd/MM/yyyy"
                    invalidDateMessage="Ngày không hợp lệ"
                    minDateMessage = "Ngày khám phải lớn hơn ngày hôm nay"
                  />
                </MuiPickersUtilsProvider>
              </div>
            }
            {
              (department.timeFrame.length>0 && department.timeFrame) ?
                <div className="md:w-1/2 sm:w-1/2 p-4">
                  <FuseChipSelect
                    className="mt-8 mb-24"
                    required
                    value={
                      form.appointmentTime? { value: form.appointmentTime, label: form.appointmentTime} : null
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
                </div>:
                <div className="md:w-1/2 sm:w-1/2 p-4">
                  {
                    form.departmentId &&
                    <div style = {{ color: "red", paddingTop: "20px" }}>
                      Không có giờ khám, vui lòng chọn ngày khám khác!
                    </div>
                  }
                </div>
            }
          </div>
          <TextField
            className="mt-8 mb-16"
            id="note"
            name="note"
            onChange={handleChange}
            label="Ghi chú nội dung khám"
            type="text"
            value={form.note}
            multiline
            rows={2}
            variant="outlined"
            fullWidth
          />
        </div>
    )
}
export default AppointmentForm;
