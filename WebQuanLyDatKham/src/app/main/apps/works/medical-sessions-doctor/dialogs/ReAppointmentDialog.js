import React, { useState, useEffect } from 'react';
import { useForm } from '@fuse/hooks';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import viLocale from "date-fns/locale/vi";
import { showMessage } from 'app/store/actions'
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx'
import _ from 'lodash';
import * as Actions from '../actions';
import { hideReExaminationDialog } from '../actions';
import { Icon, Button, ButtonGroup, Typography, IconButton, CardActions, CardContent, Card, CardHeader, Grid } from '@material-ui/core';
import moment from 'moment';
import { FuseChipSelect } from '@fuse';

const defaultAppointment = {
    appointmentDate: new Date(),
    note: "",
    patientCode:'',
    departmentId: null
}
///có 2 tình huống xảy ra là truyền _id vào hoặc phoneNumber vào, khi đó sẽ ưu tiên load theo _id trước
export default function ReAppointmentDialog({ patientCode, data, onSuccess, ...props }) {
    const dispatch = useDispatch();
    const handleClose = () => {
        dispatch(hideReExaminationDialog());
    };
    const { form, setForm, setInForm, handleChange } = useForm(defaultAppointment);
    const [timeFrame, setTimeFrame] = useState([]);
    const userData = useSelector(({auth}) => auth.user.data);
    //load toan bo du lieu lien quan den user
    useEffect(() => {
        if (userData && userData.department && userData.department._id &&form.appointmentDate) {
            Actions.get_timeframe(userData.department._id, form.appointmentDate, dispatch).then(response => {
                if (response.code === 0) {
                    setTimeFrame(response.data.timeFrame);
                } else {
                    setTimeFrame([]);
                }
            })
        }
    },[userData,form.appointmentDate]);
    function saveAppointment() {
        Actions.create_reappointment(patientCode, form.appointmentDate, form.appointmentTime, dispatch).then(response => {
            if (response.code === 0) {
                dispatch(showMessage({ message: "Hẹn tái khám thành công" }));
                dispatch(hideReExaminationDialog());
                if (onSuccess) {
                    onSuccess();
                }
            } else {
                dispatch(showMessage({ message: response.message }));
            }
        })
    }
    function canBeSave() {
      return(form.appointmentTime)
    }
    return (
        <Card>
          <CardHeader className="el-CardHeader-FU"
            action={
              <IconButton aria-label="settings" onClick={handleClose}>
                <Icon>close</Icon>
              </IconButton>
            }
            title="Hẹn tái khám"
            subheader=""
          />
          <CardContent className={clsx("el-CardContent-FULL")}>
            <div className="flex flex-wrap">
              <div className="el-block-report md:w-1/2 sm:w-1/2">
                <Typography className="pl-12 text-15 font-bold mb-10 block-tittle">Thông tin bệnh nhân tái khám</Typography>
                <div className="flex flex-wrap">
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      Mã bệnh nhân:
                    </Grid>
                    <Grid item xs={6}>
                      <div className="font-bold el-GridWordWrap">
                        {patientCode}
                      </div>
                    </Grid>
                    <Grid item xs={6}>
                      Tên bệnh nhân/khách hàng:
                    </Grid>
                    <Grid item xs={6}>
                      <div className="font-bold el-GridWordWrap">
                        {data.fullName}
                      </div>
                    </Grid>
                    <Grid item xs={6}>
                      Nghề nghiệp:
                    </Grid>
                    <Grid item xs={6}>
                      <div className="font-bold el-GridWordWrap">
                        {data.work && data.work.name}
                      </div>
                    </Grid>
                    <Grid item xs={6}>
                      Số điện thoại:
                    </Grid>
                    <Grid item xs={6}>
                      <div className="font-bold el-GridWordWrap">
                        {data.phoneNumber}
                      </div>
                    </Grid>
                    <Grid item xs={6}>
                      Ngày sinh:
                    </Grid>
                    <Grid item xs={6}>
                      <div className="font-bold el-GridWordWrap">
                        {moment(data.birthDay).format("DD/MM/YYYY")}
                      </div>
                    </Grid>
                    <Grid item xs={6}>
                      Giới tính:
                    </Grid>
                    <Grid item xs={6}>
                      <div className="font-bold el-GridWordWrap">
                        {data.gender === "1" ? "Nam" : data.gender === "2" ? "Nữ" : "Chưa xác định"}
                      </div>
                    </Grid>
                    <Grid item xs={6}>
                      Địa chỉ:
                    </Grid>
                    <Grid item xs={6}>
                      <div className="font-bold el-GridWordWrap">
                        {
                          (`${data.street} - ${data.ward && data.ward.name} - ${data.district && data.district.name} - ${data.province && data.province.name} - ${data.nationality && data.nationality.name}`)
                        }
                      </div>
                    </Grid>
                    <Grid item xs={6}>
                      Số CMND/Thẻ căn cước:
                    </Grid>
                    <Grid item xs={6}>
                      <div className="font-bold el-GridWordWrap">
                        {data.nationIdentification}
                      </div>
                    </Grid>
                    <Grid item xs={6}>
                      Bảo hiểm Y tế:
                    </Grid>
                    <Grid item xs={6}>
                      <div className="font-bold el-GridWordWrap">
                        {data.insuranceCode}
                      </div>
                    </Grid>
                  </Grid>
                </div>
              </div>
              <div className="el-block-report md:w-1/2 sm:w-1/2">
                <Typography className="pl-12 text-15 font-bold mb-10 block-tittle">Thời gian tái khám</Typography>
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
                      onChange={e => setInForm("appointmentDate", moment(e).format("YYYY-MM-DD"))}
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
                    options={
                      timeFrame.map((item) => ({
                      value: item.time, label: `${item.time} (${item.remain} lượt trống)`
                      })
                      )
                    }
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardActions disableSpacing className = "ml-8 justify-end">
            <div>
              <ButtonGroup>
                <Button disabled={!canBeSave()} color="primary" onClick={saveAppointment} variant="contained">
                  Đặt tái khám
                </Button>
              </ButtonGroup>
            </div>
          </CardActions>
          </Card >
    )
}
