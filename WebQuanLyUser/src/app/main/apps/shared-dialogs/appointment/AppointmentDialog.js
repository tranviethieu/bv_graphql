import React, { useState, useEffect, useMemo } from 'react';
import { useForm } from '@fuse/hooks';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import viLocale from "date-fns/locale/vi";
import { showMessage } from 'app/store/actions'
import { useDispatch } from 'react-redux';
import clsx from 'clsx'
import _ from 'lodash';
import * as Actions from './actions';
import { hideAppointmentDialog } from '../actions';
import { Icon, Button, ButtonGroup, TextField, Checkbox, Divider, Typography, IconButton, List, ListItem, Avatar, ListItemText, ListItemAvatar, ListItemSecondaryAction, CardActions, CardContent, Card, CardHeader, TextareaAutosize, FormControl } from '@material-ui/core';
import moment from 'moment';
import { FuseChipSelect } from '@fuse';
import { makeStyles } from '@material-ui/core/styles';
import { showConfirmDialog } from '../../shared-dialogs/actions';

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

const defaultUser = {
  birthDay: new Date(),
  phoneNumber: "",
  nation: {
    code: "25",
    name: "Kinh"
  },
  nationality: {
    code: "1",
    name: "Việt Nam"
  }
}
const defaultAppointment = {
  appointmentDate: new Date(),
  note: "",
  appointmentTime: "07:30",
  patientCode: '',
  departmentId: null
}
///có 2 tình huống xảy ra là truyền _id vào hoặc phoneNumber vào, khi đó sẽ ưu tiên load theo _id trước
export default function AppointmentDialog({ patientCode, phoneNumber, _id, onSuccess, ...props }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const handleClose = () => {
    dispatch(hideAppointmentDialog());
  };
  const [departments, setDepartments] = useState([]);
  const [provinces, setProvinces] = useState([])
  const [wards, setWards] = useState([])
  const [districts, setDistricts] = useState([])
  const [works, setWorks] = useState([])
  const [nations, setNations] = useState([])
  const [nationalitys, setNationalitys] = useState([])
  const { form: user, setForm: setUser, handleChange: handleUserChange, setInForm: setInUser } = useForm(defaultUser);
  const { form, setForm, setInForm, handleChange } = useForm(defaultAppointment);
  const [matchPatient, setMatchPatient] = useState({ data: [], records: 0, page: 0, pageSize: 10, pages: 1 });
  const [timeFrame, setTimeFrame] = useState([]);
  const [doctors, setDoctors] = useState([])


  //load toan bo du lieu lien quan den user
  function loadDefaultData() {
    Actions.get_works(dispatch).then(response => {
      setWorks(response.data);
    });
    Actions.get_nations(dispatch).then(response => {
      setNations(response.data);
    });
    Actions.get_nationalitys(dispatch).then(response => {
      setNationalitys(response.data);
    });
    Actions.get_departments(dispatch).then(response => {
      setDepartments(response.data);
    })
  }
  useEffect(() => {
    loadDefaultData();
    if (_id) {
      Actions.get_appointment(_id, dispatch).then(response => {
        setForm(response.data);
        if (response.data.inputPatient) {
          setUser(response.data.inputPatient);
        }
        else setUser({ ...defaultUser })
      })
    }
    else if (phoneNumber) {
      Actions.getUserByPhone(phoneNumber, dispatch).then(response => {
        if (response.data)
          setUser(response.data);
        else setUser({ ...defaultUser, phoneNumber })
      })
    }
  }, [phoneNumber, _id]);
  useEffect(() => {
    if (user.nationality && user.nationality.code === "1") {
      Actions.get_provinces(dispatch).then(response => {
        setProvinces(response.data);
      })
    }
    else {
      setProvinces([])
      setInUser('province', null)
      setInUser('district', null)
      setInUser('ward', null)
    }
  }, [user.nationality]);
  useEffect(() => {
    if (user.province) {
      Actions.get_districts({ filtered: [{ id: "provinceCode", value: user.province.code, operation: "==" }] }, dispatch).then(response => {
        setDistricts(response.data);
      })
      setInUser('district', null)
      setInUser('ward', null)
    }
  }, [user.province]);
  useEffect(() => {
    if (user.district) {
      Actions.get_wards({ filtered: [{ id: "districtCode", value: user.district.code, operation: "==" }] }, dispatch).then(response => {
        setWards(response.data);
      })
      setInUser('ward', null)
    }
  }, [user.district]);
  function searchPatient() {
    const data = _.omit(user, ['department']);
    Actions.search_patient(data, dispatch).then(response => {
      setMatchPatient(response);
    })
  }
  useEffect(() => {
    searchPatient();
  }, [user.ward, user.birthDay, user.gender, user.nation, user.nationality, user.district, user.province]);

  useEffect(() => {
    if (form.departmentId && form.appointmentDate) {
      Actions.get_timeframe(form.departmentId, form.appointmentDate, dispatch).then(response => {
        if (response.code === 0) {
          setTimeFrame(response.data.timeFrame);
        } else {
          setTimeFrame([]);
        }
      })

      getShiftDoctors(form.departmentId, form.appointmentDate)
    }
  }, [form.departmentId, form.appointmentDate]);

  function getShiftDoctors(departmentId, date) {
    setDoctors([])
    setInForm("shiftDoctorId", null);
    Actions.getShiftDoctors(departmentId, date).then(response => {
      if (response.data) {
        if (response.data) {
          setDoctors(response.data)
        }
      }
    })
  }

  function handleUserChipChange(value, name) {
    setInUser(name, value.value)
  }
  function handleUserCodeBaseChange(value, name) {
    setInUser(name, { code: value.value, name: value.label })
  }
  function fetchPatientByCode() {
    if (user.patientCode) {
      Actions.get_patient(user.patientCode, dispatch).then(response => {
        setUser(response.data || {});
      })
    }
  }

  function fetchUserByPhone() {
    if (user.phoneNumber) {
      Actions.getUserByPhone(user.phoneNumber, dispatch).then(response => {
        setUser(response.data || { phoneNumber: user.phoneNumber });
      })
    }
  }
  function saveUser() {
    Actions.update_patient(user, dispatch).then(response => {
      if (response.code === 0) {
        setUser({ ...user, patientCode: response.data.patientCode });
        setForm({ ...form, patientCode: response.data.patientCode, patient: response.data });
        dispatch(showMessage({ message: "Cập nhật thông tin bệnh nhân" }))
      } else {
        dispatch(showMessage({ message: response.message }));
      }
    })
  }
  function saveAppointment() {
    const submitForm = _.omit(form, ["patient", "department", "inputPatient", "user", "followByDoctor"]);
    Actions.create_appointment(submitForm, dispatch).then(response => {
      if (response.code === 0) {
        dispatch(showMessage({ message: "Gửi yêu cầu thành công" }));
        dispatch(hideAppointmentDialog());
        if (onSuccess) {
          onSuccess();
        }
      } else {
        dispatch(showMessage({ message: response.message }));
      }
    })
  }
  function onHisPatientSelect(patient) {
    if (!patient.phoneNumber || patient.phoneNumber.length === 0) {
      patient.phoneNumber = user.phoneNumber;
    }
    //update patient now vì đây là dữ liệu lấy từ his, có thể nó chưa tồn tại trong db của mình nên vẫn cần phải update để sinh ra _id
    Actions.update_patient(patient, dispatch).then(response => {
      if (response.code === 0) {
        setUser(patient);
        setForm({ ...form, patientCode: patient.patientCode, patient });
        dispatch(showMessage({ message: "Đã cập nhật thông tin bệnh nhân" }))
      } else {
        dispatch(showMessage({ message: response.message }));
      }
    })
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
        <div className="flex flex-wrap">
          <div className="el-block-report md:w-1/2 sm:w-1/2">
            <Typography className="pl-12 text-15 font-bold mb-10 block-tittle">Thông tin bệnh nhân đăng ký</Typography>
            <div className="flex flex-wrap">

              <div className="md:w-1/2 sm:w-1/2 px-4">
                <TextField
                  className="mt-8 mb-16"
                  // error={user.phoneNumber === '' || !user.phoneNumber}
                  required
                  autoFocus
                  label="Số điện thoại"
                  id="phoneNumber"
                  name="phoneNumber"
                  margin="dense"
                  value={user.phoneNumber || ''}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9\s]/gi, '')
                  }}
                  onChange={handleUserChange}
                  variant="outlined"
                  fullWidth
                  onKeyPress={e => {
                    if (e.charCode === 13) fetchUserByPhone();
                  }}
                />
              </div>
              <div className="md:w-1/2 sm:w-1/2 px-4">
                <TextField
                  className="mt-8 mb-16"
                  label="Mã bệnh nhân"
                  id="patientCode"
                  name="patientCode"
                  margin="dense"
                  value={user.patientCode || form.patientCode}
                  onChange={handleUserChange}
                  variant="outlined"
                  fullWidth
                  onKeyPress={e => {
                    if (e.charCode === 13) fetchPatientByCode();
                  }}
                />
              </div>
              <div className="md:w-1/3 sm:w-1/3 px-4">
                <TextField
                  className="mt-8 mb-16"
                  // error={user.fullName === ''|| !user.fullName}
                  required
                  label="Họ"
                  id="lastName"
                  name="lastName"
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s]/gi, '')
                  }}
                  value={user.lastName || ''}
                  onChange={handleUserChange}
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  onKeyPress={e => {
                    if (e.charCode === 13) searchPatient();
                  }}
                />
              </div>
              <div className="md:w-1/3 sm:w-1/3 px-4">
                <TextField
                  className="mt-8 mb-16"
                  // error={user.fullName === ''|| !user.fullName}
                  required
                  label="Tên đệm"
                  id="middleName"
                  name="middleName"
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s]/gi, '')
                  }}
                  value={user.middleName || ''}
                  onChange={handleUserChange}
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  onKeyPress={e => {
                    if (e.charCode === 13) searchPatient();
                  }}
                />
              </div>
              <div className="md:w-1/3 sm:w-1/3 px-4">
                <TextField
                  className="mt-8 mb-16"
                  // error={user.fullName === ''|| !user.fullName}
                  required
                  label="Tên"
                  id="firstName"
                  name="firstName"
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s]/gi, '')
                  }}
                  value={user.firstName || ''}
                  onChange={handleUserChange}
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  onKeyPress={e => {
                    if (e.charCode === 13) searchPatient();
                  }}
                />
              </div>
              <div className="md:w-full sm:w-full px-4 select-up">
                <FuseChipSelect
                  fullWidth
                  margin='dense'
                  className="mt-8 mb-24"
                  value={
                    user.work ? { value: user.work.code, label: user.work.name } : null
                  }
                  style={{ height: 20 }}
                  onChange={(value) => handleUserCodeBaseChange(value, 'work')}
                  textFieldProps={{
                    label: 'Nghề nghiệp',
                    InputLabelProps: {
                      shrink: true
                    },
                    variant: 'outlined'
                  }}
                  options={works.map(n => ({ value: n.code, label: n.name }))}
                />
              </div>
              <div className="md:w-1/2 sm:w-1/2 px-4">
                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={viLocale}>
                  <KeyboardDatePicker
                    disableToolbar
                    fullWidth
                    className="mt-8 mb-16"
                    autoOk
                    label="Ngày sinh"
                    variant="inline"
                    id="birthDay"
                    name="birthDay"
                    inputVariant="outlined"
                    value={moment(user.birthDay).format("YYYY-MM-DD")}
                    onChange={e => setInUser("birthDay", e)}
                    format="dd/MM/yyyy"
                    invalidDateMessage="Ngày không hợp lệ"
                    margin="dense"
                    minDateMessage="Năm sinh không thể nhỏ hơn năm 1900"
                  />
                </MuiPickersUtilsProvider>
              </div>

              <div className="md:w-1/2 sm:w-1/2 px-4 select-up">
                <FuseChipSelect
                  margin='dense'
                  className="mt-8 mb-24"
                  value={
                    user.gender &&
                    { value: user.gender, label: user.gender === "1" ? "Nam giới" : user.gender === "2" ? "Nữ giới" : "Chưa chọn" }
                  }
                  style={{ height: 20 }}
                  onChange={(value) => handleUserChipChange(value, 'gender')}
                  textFieldProps={{
                    label: 'Giới tính',
                    InputLabelProps: {
                      shrink: true
                    },
                    variant: 'outlined'
                  }}
                  options={[{ value: "2", label: "Nữ giới" }, { value: "1", label: "Nam giới" }]}
                />
              </div>
              <div className="md:w-1/2 sm:w-1/2 px-4 select-up">
                <FuseChipSelect
                  margin='dense'
                  className="mt-8 mb-24"
                  value={
                    user.nationality ? { value: user.nationality.code, label: user.nationality.name } : null
                  }
                  style={{ height: 20 }}
                  onChange={(value) => handleUserCodeBaseChange(value, 'nationality')}
                  textFieldProps={{
                    label: 'Quốc tịch',
                    InputLabelProps: {
                      shrink: true
                    },
                    variant: 'outlined'
                  }}
                  options={nationalitys.map(n => ({ value: n.code, label: n.name }))}
                />
              </div>
              {useMemo(() => <div className="md:w-1/2 sm:w-1/2 px-4 select-up">
                <FuseChipSelect
                  margin='dense'
                  className="mt-8 mb-24"
                  value={
                    user.nation ? { value: user.nation.code, label: user.nation.name } : null
                  }
                  style={{ height: 20 }}
                  onChange={(value) => handleUserCodeBaseChange(value, 'nation')}
                  textFieldProps={{
                    label: 'Dân tộc',
                    InputLabelProps: {
                      shrink: true
                    },
                    variant: 'outlined'
                  }}
                  options={nations.map(n => ({ value: n.code, label: n.name }))}
                />
              </div>, [nations, user.nation])}
              {useMemo(() => <div className="md:w-1/2 sm:w-1/2 px-4 select-up">
                <FuseChipSelect
                  margin='dense'
                  className="mt-8 mb-24"
                  value={
                    user.province ? { value: user.province.code, label: user.province.name } : null
                  }
                  style={{ height: 20 }}
                  onChange={(value) => handleUserCodeBaseChange(value, 'province')}
                  textFieldProps={{
                    label: 'Tỉnh/Thành phố',
                    InputLabelProps: {
                      shrink: true
                    },
                    variant: 'outlined'
                  }}
                  options={provinces.map(n => ({ value: n.code, label: n.name }))}
                />
              </div>, [provinces, user.province])}
              {
                useMemo(() => <div className="md:w-1/2 sm:w-1/2 px-4 select-up">
                  <FuseChipSelect
                    margin='dense'
                    className="mt-8 mb-24"
                    value={
                      user.district ? { value: user.district.code, label: user.district.name } : null
                    }
                    style={{ height: 20 }}
                    onChange={(value) => handleUserCodeBaseChange(value, 'district')}
                    textFieldProps={{
                      label: 'Quận/Huyện',
                      InputLabelProps: {
                        shrink: true
                      },
                      variant: 'outlined'
                    }}
                    options={districts.map(n => ({ value: n.code, label: n.name }))}
                  />
                </div>, [districts, user.district])
              }
              {
                useMemo(() => <div className="md:w-1/2 sm:w-1/2 px-4 select-up">
                  <FuseChipSelect
                    margin='dense'
                    className="mt-8 mb-24"
                    value={
                      user.ward ? { value: user.ward.code, label: user.ward.name } : null
                    }
                    style={{ height: 20 }}
                    onChange={(value) => handleUserCodeBaseChange(value, 'ward')}
                    textFieldProps={{
                      label: 'Phường/Xã',
                      InputLabelProps: {
                        shrink: true
                      },
                      variant: 'outlined'
                    }}
                    options={wards.map(n => ({ value: n.code, label: n.name }))}
                  />
                </div>, [wards, user.ward])
              }

              <div className="md:w-1/2 sm:w-1/2 px-4">
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
                  onKeyPress={e => {
                    if (e.charCode === 13) searchPatient();
                  }}
                />
              </div>
              <div className="md:w-1/2 sm:w-1/2 px-4">
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
              <div className="md:w-1/2 sm:w-1/2 px-4">
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
            <Divider />
            <div className="mt-8">

              <ButtonGroup>
                <Button color="secondary" onClick={saveUser} variant="contained">
                  Cập nhật hồ sơ BN
                    </Button>
                <Button disabled={!form.patient} color="primary" onClick={saveAppointment} variant="contained">
                  Xác nhận đặt khám
                    </Button>
              </ButtonGroup>

            </div>
          </div>
          <div className="el-block-report md:w-1/4 sm:w-1/2">
            <Typography className="pl-12 text-15 font-bold mb-10 block-tittle">Thông tin yêu cầu</Typography>
            {
              useMemo(() => <div className="w-full px-4 select-up">
                <FuseChipSelect
                  margin='dense'
                  className="mt-8 mb-24"
                  style={{ height: 20 }}
                  value={
                    departments.map(d => ({
                      value: d._id, label: d.name
                    })).find(d => d.value === form.departmentId)
                  }
                  onChange={(e) => setInForm('departmentId', e ? e.value : null)}
                  textFieldProps={{
                    label: 'Khoa khám',
                    InputLabelProps: {
                      shrink: true
                    },
                    variant: 'outlined'
                  }}
                  isClearable={true}
                  options={departments.map(d => ({
                    value: d._id, label: d.name
                  }))}
                />
              </div>, [departments, form.departmentId])
            }
            <div className="w-full px-4">
              <MuiPickersUtilsProvider utils={DateFnsUtils} locale={viLocale}>
                <KeyboardDatePicker
                  disableToolbar
                  fullWidth
                  className="mt-8 mb-16"
                  autoOk
                  label="Ngày đặt"
                  variant="inline"
                  name="appointmentDate"
                  inputVariant="outlined"
                  value={moment(form.appointmentDate).format("YYYY-MM-DD")}
                  onChange={e => setInForm("appointmentDate", e)}
                  format="dd/MM/yyyy"
                  invalidDateMessage="Ngày không hợp lệ"
                  margin="dense"
                  minDateMessage="Ngày đặt không thể nhỏ hơn ngày hiện tại"
                  minDate={new Date()}
                />
              </MuiPickersUtilsProvider>
            </div>
            <div className="w-full px-4">
              <FuseChipSelect
                margin='dense'
                className="mt-8 mb-24"
                style={{ height: 20 }}
                value={
                  timeFrame.map((item) => ({
                    value: item.time, label: `${item.time} - ${item.remain}`
                  })).find(d => d.value === form.appointmentTime)
                }
                onChange={(e) => setInForm('appointmentTime', e ? e.value : null)}
                textFieldProps={{
                  label: 'Thời gian đặt',
                  InputLabelProps: {
                    shrink: true
                  },
                  variant: 'outlined'
                }}
                isClearable={true}
                options={timeFrame.map((item) => ({
                  value: item.time, label: `${item.time} (${item.remain} lượt trống)`
                }))}
              />
            </div>
            <div className="w-full px-4">
              <FuseChipSelect
                margin='dense'
                className="mt-8 mb-24"
                style={{ height: 20 }}
                value={
                  doctors.map((item) => ({
                    value: item._id, label: `${item && item.base && item.base.fullName}`
                  })).find(d => d.value === form.shiftDoctorId)
                }
                onChange={(e) => {
                  console.log("===> shift doctor id: ", e)
                  setInForm('shiftDoctorId', e ? e.value : null)
                }}
                textFieldProps={{
                  label: 'Chọn bác sĩ',
                  InputLabelProps: {
                    shrink: true
                  },
                  variant: 'outlined'
                }}
                isClearable={true}
                options={doctors.map((item) => ({
                  value: item._id, label: `${item && item.base && item.base.fullName}`
                }))}
              />
            </div>

            <div className="w-full px-4">
              <TextField
                className="mt-8 mb-16"
                required
                label="Nội dung khám *"
                name="note"
                margin="dense"
                value={form.note || ''}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                rows={3}
                multiline
              />
            </div>


          </div>
          <div className="el-block-report md:w-1/4 sm:w-1/2">
            <Typography className="pl-12 text-15 font-bold block-tittle">Tìm thấy {matchPatient.records} thông tin BN phù hợp</Typography>
            <List dense component="div" role="list" >
              {
                matchPatient.data && matchPatient.data.map((item, index) =>
                  <React.Fragment key={index}>
                    <ListItem alignItems="flex-start" onClick={e => onHisPatientSelect(item)}>
                      <ListItemAvatar>
                        <Avatar alt={item.fullName && item.fullName.substring(0, 1)} />
                      </ListItemAvatar>
                      <ListItemText primary={
                        <div className="flex flex-wrap">
                          <Typography className="text-14 font-bold pr-8">({item.patientCode})</Typography>
                          <Typography>{item.fullName}</Typography>
                          <Typography>{item.phoneNumber}</Typography>
                        </div>
                      }
                        secondary={
                          <React.Fragment>
                            <Typography
                              component="span"
                              variant="body2"
                              className={classes.inline}
                              color="textPrimary"
                            >
                              {moment(item.birthDay).format("DD/MM/YYYY")} - {item.gender === "1" ? "Nam giới" : "Nữ giới"} - {item.nation && `dân tộc ${item.nation.name}`}
                            </Typography>
                                - Địa chỉ: {item.street} {item.ward && ` - ${item.ward.name}`} {item.district && ` - ${item.district.name}`}{item.province && ` - ${item.province.name}`} {item.nationality && ` - ${item.nationality.name}`}
                          </React.Fragment>
                        } />

                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                )
              }

            </List>
          </div>
        </div>
      </CardContent>
    </Card >
  )
}
