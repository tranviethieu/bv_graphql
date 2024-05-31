import React, { useState, useEffect, useMemo } from 'react';
import { useForm } from '@fuse/hooks';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import viLocale from "date-fns/locale/vi";
import { showMessage } from 'app/store/actions'
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx'
import _ from 'lodash';
import * as Actions from '../actions';
import { hideSessionDialog } from './SessionDialog.action';
import { Icon, Button, ButtonGroup, TextField, Divider, Typography, IconButton, List, Grid, Avatar, CardActions, CardContent, Card, CardHeader, TextareaAutosize, FormControl } from '@material-ui/core';
import moment from 'moment';
import { FuseChipSelect } from '@fuse';
import { makeStyles } from '@material-ui/core/styles';
import ReactTable from 'react-table';
import {showIndicationDialog } from './IndicationDialog.action';
import { showConfirmDialog } from '../../../shared-dialogs/actions';
import { callout } from 'app/store/actions';
import withReducer from 'app/store/withReducer';
import reducer from '../reducers';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: '36ch',
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: 'inline',
  },
}));


///có 2 tình huống xảy ra là truyền _id vào hoặc phoneNumber vào, khi đó sẽ ưu tiên load theo _id trước
function SessionDialog({ patientCode, _id, appointmentId, onSuccess, ...props }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const handleClose = () => {
    onSuccess && onSuccess();
    dispatch(hideSessionDialog());
    dispatch(Actions.reset_store())
  };
  const [departments, setDepartments] = useState([]);
  const [appointment, setAppointment] = useState({});
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [doctors, setDoctors] = useState([]);//danh sach nay tam thoi truy xuat theo khoa
  const { form, setInForm, setForm, handleChange } = useForm({});
  const [clinics, setClinics] = useState([]);
  const indications = useSelector(({indication}) => indication.data)
  //load toan bo du lieu lien quan den user
  function loadDefaultData() {

    Actions.get_departments(dispatch).then(response => {
      setDepartments(response.data);
    });
  }
useEffect(()=>{
  if(form.department){
    var department = departments.find(department => department.code === form.department.code)
    if(department){
      setClinics(department.clinics)
    }
    Actions.get_account_by_department(form.department.code).then(response => {
        setDoctors(response.data.map(d => ({
            code: d.base && d.base.code,
            name:d.base&&d.base.fullName
        })));
    })
  }
}, [departments, form.department])
  useEffect(() => {
      if (selectedDepartment) {
          Actions.get_account_by_department(selectedDepartment.code).then(response => {
              setDoctors(response.data.map(d => ({
                  code: d.base && d.base.code,
                  name:d.base&&d.base.fullName
              })));
          })
          setInForm("clinic", null);//reset lai thong tin phong kham
          setInForm("doctor", null)
      }
  },[selectedDepartment]);
  useEffect(() => {
    loadDefaultData();
    if (appointmentId) {
      Actions.get_appointment(appointmentId, dispatch).then(response => {
        setAppointment(response.data);
        const form = {
          department: {code: response.data.department.code, name: response.data.department.name},
          doctor: response.data.doctor,
          clinic: response.data.clinic,
          patientCode: response.data.patientCode,
          reason: response.data.note,
          appointmentId,
          code: response.data.last_session && response.data.last_session.code,
          _id: response.data.last_session&&response.data.last_session._id
        }
        setForm(form);
      })
    }
    else if (_id) {
      Actions.get_medical_session_detail(_id, dispatch).then(response => {
        if (response.code === 0) {
          setForm(_.omit(response.data,["indications","appointment", "process"]));
          dispatch(Actions.set_indication_in_store(response.data.indications))
          setAppointment(response.data.appointment);
        } else {
          dispatch(showMessage({message:response.message}))
        }
      })
    }

  }, [patientCode, _id, appointmentId]);

  function onSaveSession() {
    const data = convertFormToData(form);
    var merged = { ...data}
    if(data.code || data._id){
      Actions.save_medical_session(merged, dispatch).then(response => {
        if (response.code === 0) {
          dispatch(showMessage({message: "Cập nhật phiếu khám thành công"}))
          handleClose()
        } else {
          dispatch(showMessage({message:response.message}))
        }
      })
    }
    else{
      Actions.save_medical_session(merged, dispatch).then(response => {
        if (response.code === 0) {
          dispatch(showMessage({message: "Tạo phiếu khám thành công"}))
          handleClose()
        } else {
          dispatch(showMessage({message:response.message}))
        }
      })
    }
  }
  function convertFormToData(form) {
    const data = _.omit(form, ['last_session']);
    return data;
  }
  return (
    <Card>
      <CardHeader className="el-CardHeader-FU"
        action={
          <IconButton aria-label="settings" onClick={handleClose}>
            <Icon>close</Icon>
          </IconButton>
        }
        title="Thông tin đăng ký khám"
        subheader=""
      />
      <CardContent className={clsx("el-CardContent-FULL")}>
        <Grid container spacing={4}>
          <Grid item md={8}>
            <Typography className="pl-12 text-15 font-bold block-tittle">Phiếu khám {form.code&&form.code.toUpperCase()}</Typography>
            <Grid container spacing={1}>
              <Grid item md={6}>
                <TextField
                  className="mt-8 mb-8"
                  fullWidth
                  label="Mã khám chữa bệnh"
                  variant="outlined"
                  margin="dense"
                  placeholder="Mã khám chữa bệnh"
                  name="code"
                  value={form.code||''}
                  disabled
                  onChange={handleChange}
                />
              </Grid>
              <Grid item md={6}>
                <TextField
                  className="mt-8 mb-8"
                  fullWidth
                  label="Mã bệnh nhân"
                  variant="outlined"
                  margin="dense"
                  placeholder="Mã bệnh nhân"
                  name="patientCode"
                  value={form.patientCode||''}
                  onChange={handleChange}
                  disabled
                />
              </Grid>
              {
                useMemo(() => <Grid item md={12}>
                  <FuseChipSelect
                    margin='dense'
                    className="mt-8 mb-8"
                    style={{ height: 20 }}
                    value={
                      selectedDepartment || (form.department && {
                        value: form.department.code, label: form.department.name
                      })
                    }
                    onChange={(e) => {setSelectedDepartment(e); setInForm('department', e && { code: e.value, name: e.label })}}
                    textFieldProps={{
                      label: 'Khoa khám',
                      InputLabelProps: {
                        shrink: true
                      },
                      variant: 'outlined'
                    }}
                    isClearable={true}
                    options={departments.map(d => ({
                      value: d.code, label: d.name, ...d
                    }))}
                  />
                </Grid>, [departments, selectedDepartment])
              }
              {
                useMemo(() => <Grid item md={12}>
                  {
                    (selectedDepartment || form.department) && <FuseChipSelect
                      margin='dense'
                      className="mt-8 mb-8"
                      style={{ height: 20 }}
                      value={
                        form.clinic && {
                          value: form.clinic.code, label: form.clinic.name
                        }
                      }
                      onChange={(e) => setInForm('clinic', e && { code: e.value, name: e.label })}
                      textFieldProps={{
                        label: 'Phòng khám',
                        InputLabelProps: {
                          shrink: true
                        },
                        variant: 'outlined'
                      }}
                      isClearable={true}
                      options={clinics.map(d => ({
                        value: d.code, label: d.name, ...d
                      }))}
                                                               />
                  }
                </Grid>, [form.clinic, selectedDepartment, form.department, clinics])
              }
              {
                useMemo(() => <Grid item md={12}>
                  {
                    doctors && <FuseChipSelect
                      margin='dense'
                      className="mt-8 mb-16"
                      style={{ height: 20 }}
                      value={
                        form.doctor && {
                          value: form.doctor._id, label: form.doctor.name
                        }
                      }
                      onChange={(e) => setInForm('doctor', e ? _.omit(e,["value","label"]) : null)}
                      textFieldProps={{
                        label: 'Bác sỹ',
                        InputLabelProps: {
                          shrink: true
                        },
                        variant: 'outlined'
                      }}
                      isClearable={true}
                      options={doctors.map(d => ({
                        value: d._id, label: d.name, ...d
                      }))}
                               />
                  }
                </Grid>, [doctors,form.doctor])
              }
              <Grid item md={12}>
                <TextField
                  className="mt-8 mb-16"
                  fullWidth
                  label="Nội dung khám"
                  variant="outlined"
                  margin="dense"
                  placeholder="Lý do đặt khám"
                  name="reason"
                  onChange={handleChange}
                  rows={3}
                  value={form.reason||''}
                  multiline
                />
              </Grid>
            </Grid>
            {
              form.code &&
              <div>
                <Typography className="pl-12 text-15 font-bold block-tittle">Dịch vụ đã chỉ định</Typography>
                <ReactTable
                  data={indications}
                  showPagination={false}
                  pageSize={indications.length||1}
                  noDataText="Phiếu trống"
                  sortable={false}
                  columns={[
                    {
                      Header: "Thời gian tạo",
                      accessor:"createdTime",
                      Cell: row =>
                      <div>
                        {moment(row.value).format("DD/MM/YYYY HH:mm")}
                      </div>
                    },
                    {
                      Header: "Dịch vụ",
                      accessor:"service.name"
                    },
                    {
                      Header: "Khoa",
                      accessor:"department.name"
                    },
                    {
                      Header: "Phòng",
                      accessor:"clinic.name"
                    },
                    {
                      Header: "Bác sĩ",
                      accessor:"doctor.fullName"
                    },
                    {
                      Header: "Người tạo",
                      accessor:"creator.fullName"
                    },
                    // {
                    //   Header: "Tình trạng",
                    //   accessor: "paid",
                    //   Cell: row => <Typography>{row.value?"Đã thanh toán":"Chưa thanh toán"}</Typography>
                    // }
                  ]}
                />
              </div>
            }
            <Divider />
          </Grid>
          <Grid item md={4}>
            <Typography className="pl-12 text-15 font-bold mb-10 block-tittle">Thông tin đặt khám</Typography>
            {
              appointment && appointment.patient &&
              <div className="flex flex-wrap">
                <Grid container className="text-15 font-bold">
                  {appointment.patientCode}
                </Grid>
                <Grid container spacing={1}>
                  <Grid item md={6}>
                    {appointment.patient.fullName}
                  </Grid>
                  <Grid item md={6}>
                    {moment(appointment.patient.birthDay).format("DD/MM/YYYY")}
                  </Grid>
                </Grid>
                <Grid container spacing={1}>
                  <Grid item md={6}>
                    Giới tính:{appointment.patient.gender === "1" ? "Nam" : "Nữ"}
                  </Grid>
                  <Grid item md={6}>
                    Dân tộc: {appointment.patient.nation ?appointment.patient.nation.name : ""}
                  </Grid>
                </Grid>
                <Grid container >
                  Địa chỉ: {appointment.patient? appointment.patient.street : ""} - {appointment.patient && appointment.patient.ward ? appointment.patient.ward.name : ''} - {appointment.patient && appointment.patient.district ? appointment.patient.district.name : ""} - {appointment.patient && appointment.patient.nationality ? appointment.patient.nationality.name : ""}
                  </Grid>
                    <Grid container >
                      Số điện thoại: {appointment.patient.phoneNumber}
                    </Grid>
                    <Divider />
                    <Grid container className="pt-8">
                      Giờ khám: {appointment.appointmentTime}
                    </Grid>
                    <Grid container >
                      {appointment.department && appointment.department.name}
                    </Grid>
                    <Grid container >
                      {appointment.note}
                    </Grid>
                  </div>
                }
              </Grid>
            </Grid>
          </CardContent>
          <CardActions disableSpacing className = "ml-8">
            <div>
              <ButtonGroup>
                <Button color="secondary" onClick={onSaveSession} variant="contained">
                  Lưu phiếu khám
                </Button>
                {
                  form.code &&
                  <Button color="primary" onClick={() => dispatch(showIndicationDialog({code:form.code}))} variant="contained">
                    Thêm chỉ định
                  </Button>
                }
          </ButtonGroup>

        </div>
      </CardActions>
    </Card >
  )
}
export default withReducer('indication', reducer)(SessionDialog);
