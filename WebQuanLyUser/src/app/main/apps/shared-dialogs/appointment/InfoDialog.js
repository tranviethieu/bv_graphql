import React, { } from 'react';
import { Button, Card, CardContent, CardHeader, DialogContentText, CardActions, IconButton, Typography, Grid, Icon} from '@material-ui/core';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import * as StringUtils from "../../utils/StringUtils";
import { hideAppointmentDialog } from '../actions';

function InfoDialog({ data,onSuccess, options }) {
  const dispatch = useDispatch();
  function handleClose() {
    onSuccess && onSuccess();
    dispatch(hideAppointmentDialog());

  }
  return (
    <Card>
      <CardHeader className="el-CardHeader-FU"
        action={
          <IconButton aria-label="settings" onClick={handleClose}>
            <Icon>close</Icon>
          </IconButton>
        }
        title="CHI TIẾT"
        subheader=""
      />
      <CardContent className="m-12">
        <DialogContentText>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              Mã phiếu khám:
            </Grid>
            <Grid item xs={6}>
              <div className="font-bold el-GridWordWrap">
                {data.code || data.sessionCode}
              </div>
            </Grid>
            <Grid item xs={6}>
              Mã bệnh nhân:
            </Grid>
            <Grid item xs={6}>
              <div className="font-bold el-GridWordWrap">
                {data.patientCode}
              </div>
            </Grid>
            <Grid item xs={6}>
              Tên bệnh nhân/khách hàng:
            </Grid>
            <Grid item xs={6}>
              <div className="font-bold el-GridWordWrap">
                {(data.patient && data.patient.fullName) || (data.inputPatient && data.inputPatient.fullName)}
              </div>
            </Grid>
            <Grid item xs={6}>
              Nghề nghiệp:
            </Grid>
            <Grid item xs={6}>
              <div className="font-bold el-GridWordWrap">
                {(data.patient && data.patient.work && data.patient.work.name)}
              </div>
            </Grid>
            <Grid item xs={6}>
              Số điện thoại:
            </Grid>
            <Grid item xs={6}>
              <div className="font-bold el-GridWordWrap">
                {(data.patient && data.patient.phoneNumber) || (data.inputPatient && data.inputPatient.phoneNumber)}
              </div>
            </Grid>
            <Grid item xs={6}>
              Ngày sinh:
            </Grid>
            <Grid item xs={6}>
              <div className="font-bold el-GridWordWrap">
                {moment(data.patient && data.patient.birthDay).format("DD/MM/YYYY")}
              </div>
            </Grid>
            <Grid item xs={6}>
              Giới tính:
            </Grid>
            <Grid item xs={6}>
              <div className="font-bold el-GridWordWrap">
                {
                  data.patient && (data.patient.gender === "1" ? "Nam" : data.patient.gender === "2" ? "Nữ" : "Chưa xác định")
                }
              </div>
            </Grid>
            <Grid item xs={6}>
              Địa chỉ:
            </Grid>
            <Grid item xs={6}>
              <div className="font-bold el-GridWordWrap">
                {
                  (data.patient && `${data.patient.street} - ${data.patient.ward && data.patient.ward.name} - ${data.patient.district &&data.patient.district.name} - ${data.patient.province &&data.patient.province.name} - ${data.patient.nationality &&data.patient.nationality.name}`)
                }
              </div>
            </Grid>
            <Grid item xs={6}>
              Số CMND/Thẻ căn cước:
            </Grid>
            <Grid item xs={6}>
              <div className="font-bold el-GridWordWrap">
                {(data.patient && data.patient.nationIdentification) || (data.inputPatient && data.inputPatient.nationIdentification)}
              </div>
            </Grid>
            <Grid item xs={6}>
              Bảo hiểm Y tế:
            </Grid>
            <Grid item xs={6}>
              <div className="font-bold el-GridWordWrap">
                {data.insuranceCode || (data.patient && data.patient.insuranceCode)}
              </div>
            </Grid>
            <Grid item xs={6}>
              Thời gian đặt:
            </Grid>
            <Grid item xs={6}>
              <div className="font-bold el-GridWordWrap">
                {(data.appointment && moment(data.appointment.createdTime).format("HH:mm DD/MM/YYYY")) || (moment(data.createdTime).format("HH:mm DD/MM/YYYY"))}
              </div>
            </Grid>

            <Grid item xs={6}>
              Thời gian khám:
            </Grid>
            <Grid item xs={6}>
              <div className="font-bold el-GridWordWrap">
                {
                  (data.appointment && <div>
                    {data.appointment.appointmentTime + ". Ngày: " + moment(data.appointment.appointmentDate).format("DD/MM/YYYY")}
                  </div>)
                  || (<div>
                    {data.appointmentTime + ". Ngày: " + moment(data.appointmentDate).format("DD/MM/YYYY")}
                  </div>)
                }
              </div>
            </Grid>
            <Grid item xs={6}>
              Khoa khám:
            </Grid>
            <Grid item xs={6}>
              <div className="font-bold el-GridWordWrap">
                {
                  (data.appointment && <div>
                    {data.appointment.department && data.appointment.department.name}
                  </div>)
                  || (<div>
                    {data.department && data.department.name}
                  </div>)
                }
              </div>
            </Grid>
            {
              options === "indication" &&
              <Grid item xs={6}>
                Phòng khám:
              </Grid>
            }
            {
              options === "indication" &&
              <Grid item xs={6}>
                <div className="font-bold el-GridWordWrap">
                  {
                    data.clinic? data.clinic.name : ""
                  }
                </div>
              </Grid>
            }
            <Grid item xs={6}>
              {options === "indication" ? "Dịch vụ khám" : "Nội dung khám"}
            </Grid>
            <Grid item xs={6}>
              {
                options === "indication" ?
                  <div className="font-bold el-GridWordWrap">
                    {data.service ? data.service.name : ""}
                  </div>
                : <div className="font-bold el-GridWordWrap">
                  {data.reason || data.note}
                </div>
              }
            </Grid>
            {
              options !== "indication" &&
              <Grid item xs={6}>
                Kênh đăng ký:
              </Grid>
            }
            {
              options !== "indication" &&
              <Grid item xs={6}>
                <div className="font-bold el-GridWordWrap">
                  {(data.appointment && StringUtils.parseChannel(data.appointment.channel)) || data.channel}
                </div>
              </Grid>
            }
            <Grid item xs={6}>
              Trạng thái:
            </Grid>
            <Grid item xs={6}>
              {
                options === "appointments" ?
                  <div className="font-bold el-GridWordWrap">
                    {data.state === "CANCEL" ? "Đã hủy" : data.state === "SERVED" ? "Đã phục vụ" : data.state === "APPROVE" ? 'Chưa tới khám' : "Chưa xác nhận"}
                  </div>
                : options === "indication" ?
                  <div className="font-bold el-GridWordWrap">
                    {data.state === "PENDING" ? "Chờ khám" : data.state === "CONFIRM" ? "Đang khám" : data.state === "RESOLVE" ? 'Đã khám' : ""}
                  </div>
                : <div className="font-bold el-GridWordWrap">
                  {data.process === "IN_QUEUE" ? "Chờ khám" : data.process === "WATING_CONCLUSION" ? "Chờ kết luận khám" : data.process === "CONCLUSION" ? 'Đã có kết luận khám' : "Hủy khám"}
                </div>
              }
            </Grid>
            <Grid item xs={6}>
              {
                options === "appointments" ?
                  <div>
                    {
                      data.state === "CANCEL" && "Lý do hủy đặt khám:"
                    }
                  </div>
                : <div>
                  {
                    data.terminated === true ? "Lý do hủy phiên khám:"
                    : data.terminated === false && data.process === "CANCEL" ?"Kết luận bác sỹ:":""
                  }
                </div>
              }
            </Grid>
            <Grid item xs={6}>
              {
                options === "appointments" ?
                  <div className="font-bold el-GridWordWrap">
                    {
                      data.state === "CANCEL" && `Hủy lúc: ${moment(data.terminatedTime).format("DD/MM/YYYY")}. ${data.terminateReason}`
                    }
                  </div>
                : <div className="font-bold el-GridWordWrap">
                  {
                    data.terminated === true ? data.terminateReason
                    : data.terminated === false && data.process === "CANCEL" ? `Kết luận khám lúc: ${moment(data.conclusionTime).format("DD/MM/YYYY")}. ${data.conclusion}`: ""
                      }
                </div>
              }
            </Grid>
          </Grid>
        </DialogContentText>
      </CardContent>
          <CardActions>
            <Button onClick={handleClose} color="primary">
              Đóng
              </Button>
          </CardActions>
    </Card>
  );
}
export default InfoDialog;
