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
      <CardContent className="m-12" style = {{ height: "70vh", overflow: "auto"}}>
        <DialogContentText>
          <Grid container spacing={1}>
            {
              (options === "medical_session") &&
              <Grid item xs={6} className = "el-Border-CardContent">
                Mã KCB:
              </Grid>
            }
            {
              (options === "medical_session") &&
              <Grid item xs={6} className = "el-Border-CardContent">
                <Grid item xs={6}>
                  <div className="font-bold el-GridWordWrap">
                    {data.appointment && data.appointment.code}
                  </div>
                </Grid>
              </Grid>
            }
            {
              (data.code || data.sessionCode) &&
              <Grid item xs={6} className = "el-Border-CardContent">
                Mã phiếu khám:
              </Grid>
            }
            {
              (data.code || data.sessionCode) &&
              <Grid item xs={6} className = "el-Border-CardContent">
                <Grid item xs={6}>
                  <div className="font-bold el-GridWordWrap">
                    {options !== "indication" ? (data.code) : data.sessionCode}
                  </div>
                </Grid>
              </Grid>
            }
            {
              options === "indication" &&
              <Grid item xs={6} className = "el-Border-CardContent">
                Mã chỉ định:
              </Grid>
            }
            {
              options === "indication" &&
              <Grid item xs={6} className = "el-Border-CardContent">
                <div className="font-bold el-GridWordWrap">
                  {
                    data.code
                  }
                </div>
              </Grid>
            }
            <Grid item xs={6} className = "el-Border-CardContent">
              Mã bệnh nhân:
            </Grid>
            <Grid item xs={6} className = "el-Border-CardContent">
              <div className="font-bold el-GridWordWrap">
                {data.patientInfo && data.patientInfo.patientCode ? data.patientInfo.patientCode : "Chưa có mã bệnh nhân"}
              </div>
            </Grid>
            <Grid item xs={6} className = "el-Border-CardContent">
              Tên bệnh nhân/khách hàng:
            </Grid>
            <Grid item xs={6} className = "el-Border-CardContent">
              <div className="font-bold el-GridWordWrap">
                {(data.patientInfo && data.patientInfo.fullName) || (data.inputPatient && data.inputPatient.fullName)}
              </div>
            </Grid>
            <Grid item xs={6} className = "el-Border-CardContent">
              Nghề nghiệp:
            </Grid>
            <Grid item xs={6} className = "el-Border-CardContent">
              <div className="font-bold el-GridWordWrap">
                {(data.patientInfo && data.patientInfo.work && data.patientInfo.work.name) || (data.inputPatient && data.inputPatient.work && data.inputPatient.work.name)}
              </div>
            </Grid>
            <Grid item xs={6} className = "el-Border-CardContent">
              Số điện thoại:
            </Grid>
            <Grid item xs={6} className = "el-Border-CardContent">
              <div className="font-bold el-GridWordWrap">
                {(data.patientInfo && data.patientInfo.phoneNumber) || (data.inputPatient && data.inputPatient.phoneNumber)}
              </div>
            </Grid>
            <Grid item xs={6} className = "el-Border-CardContent">
              Ngày sinh:
            </Grid>
            <Grid item xs={6} className = "el-Border-CardContent">
              <div className="font-bold el-GridWordWrap">
                {moment((data.patientInfo && data.patientInfo.birthDay) || (data.inputPatient && data.inputPatient.birthDay)).format("DD/MM/YYYY")}
              </div>
            </Grid>
            <Grid item xs={6} className = "el-Border-CardContent">
              Giới tính:
            </Grid>
            <Grid item xs={6} className = "el-Border-CardContent">
              <div className="font-bold el-GridWordWrap">
                {
                  (data.patientInfo && data.patientInfo.gender) ? ["Chưa xác định", "Nam", "Nữ"][data.patientInfo.gender] : "Chưa xác định"
                  // data.patientInfo ? (data.patientInfo.gender === "1" ? "Nam" : data.patientInfo.gender === "2" ? "Nữ" : "Chưa xác định") : (data.inputPatient.gender === "1" ? "Nam" : data.inputPatient.gender === "2" ? "Nữ" : "Chưa xác định")
                  }
                </div>
              </Grid>
              <Grid item xs={6} className = "el-Border-CardContent">
                Địa chỉ:
              </Grid>
              <Grid item xs={6} className = "el-Border-CardContent">
                <div className="font-bold el-GridWordWrap">
                  {
                    (data.patientInfo ? (`${data.patientInfo.street} - ${data.patientInfo.ward && data.patientInfo.ward.name} - ${data.patientInfo.district &&data.patientInfo.district.name} - ${data.patientInfo.province &&data.patientInfo.province.name} - ${data.patientInfo.nationality &&data.patientInfo.nationality.name}`)
                    : data.inputPatient ? (`${data.inputPatient.street} - ${data.inputPatient.ward && data.inputPatient.ward.name} - ${data.inputPatient.district &&data.inputPatient.district.name} - ${data.inputPatient.province &&data.inputPatient.province.name} - ${data.inputPatient.nationality &&data.inputPatient.nationality.name}`) : ''
                    )
                  }
                </div>
              </Grid>
              <Grid item xs={6} className = "el-Border-CardContent">
                Số CMND/Thẻ căn cước:
              </Grid>
              <Grid item xs={6} className = "el-Border-CardContent">
                <div className="font-bold el-GridWordWrap">
                  {(data.patientInfo && data.patientInfo.nationIdentification) || (data.inputPatient && data.inputPatient.nationIdentification)}
                </div>
              </Grid>
              <Grid item xs={6} className = "el-Border-CardContent">
                Bảo hiểm Y tế:
              </Grid>
              <Grid item xs={6} className = "el-Border-CardContent">
                <div className="font-bold el-GridWordWrap">
                  {(data.inputPatient && data.inputPatient.insuranceCode) || (data.patientInfo && data.patientInfo.insuranceCode)}
                </div>
              </Grid>
              {
                options === "transaction" &&
                <Grid container spacing={1} className = "p-4">
                  <Grid item xs={6} className = "el-Border-CardContent">
                    Thời gian tạo:
                  </Grid>
                  <Grid item xs={6}  className = "el-Border-CardContent">
                    <div className="font-bold el-GridWordWrap">
                      {(moment(data.createdTime).format("HH:mm DD/MM/YYYY"))}
                    </div>
                  </Grid>
                </Grid>
              }
              {
                (options === "medical_session" || options === "indication" || options === "transaction") ?
                  null
                : <Grid container spacing={1} className = "p-4">
                  <Grid item xs={6} className = "el-Border-CardContent">
                    Thời gian đặt:
                  </Grid>
                  <Grid item xs={6} className = "el-Border-CardContent">
                    <div className="font-bold el-GridWordWrap">
                      {(data.appointment && moment(data.appointment.createdTime).format("HH:mm DD/MM/YYYY")) || (moment(data.createdTime).format("HH:mm DD/MM/YYYY"))}
                    </div>
                  </Grid>

                  <Grid item xs={6} className = "el-Border-CardContent">
                    Thời gian khám:
                  </Grid>
                  <Grid item xs={6} className = "el-Border-CardContent">
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
                </Grid>
              }
              {
                options !== "transaction" &&
                <Grid container spacing={1} className = "p-4">
                  <Grid item xs={6} className = "el-Border-CardContent">
                    Khoa khám:
                  </Grid>
                  <Grid item xs={6} className = "el-Border-CardContent">
                    {
                      options === "medical_session" ?
                        <div className="font-bold el-GridWordWrap">
                          {data.department && data.department.name}
                        </div>
                      : <div className="font-bold el-GridWordWrap">
                        {
                          (data.appointment && <div>
                            {data.appointment.department && data.appointment.department.name}
                          </div>)
                          || (<div>
                            {data.department && data.department.name}
                          </div>)
                        }
                      </div>
                    }
                  </Grid>
                </Grid>
              }
              {
                (options === "indication" || options === "medical_session") &&
                <Grid item xs={6} className = "el-Border-CardContent">
                  Phòng khám:
                </Grid>
              }
              {
                (options === "indication" || options === "medical_session") &&
                <Grid item xs={6} className = "el-Border-CardContent">
                  <div className="font-bold el-GridWordWrap">
                    {
                      data.clinic? data.clinic.name : ""
                    }
                  </div>
                </Grid>
              }
              {
                (options === "medical_session" || options === "indication") && <Grid container spacing={1} className = "p-4">
                  <Grid item xs={6} className = "el-Border-CardContent">
                    Bác sỹ khám:
                  </Grid>
                  <Grid item xs={6} className = "el-Border-CardContent">
                    <div className="font-bold el-GridWordWrap">
                      {data.doctor && (data.doctor.name || data.doctor.fullName)}
                    </div>
                  </Grid>
                </Grid>
              }
              <Grid item xs={6} className = "el-Border-CardContent">
                {options === "indication" || options === "transaction" ? "Dịch vụ khám" : "Nội dung khám"}
              </Grid>
              <Grid item xs={6} className = "el-Border-CardContent">
                {
                  options === "indication" ?
                    <div className="font-bold el-GridWordWrap">
                      {data.service ? data.service.name : ""}
                    </div>
                  : options === "transaction" ?
                    <div className="font-bold el-GridWordWrap">
                      {data.indication && data.indication.service ? data.indication.service.name : ""}
                    </div>
                  : <div className="font-bold el-GridWordWrap">
                    {data.reason || data.note}
                  </div>
                }
              </Grid>
              {
                (options === "indication" || options === "medical_session" || options === "transaction") ?
                  null
                : <Grid item xs={6} className = "el-Border-CardContent">
                  Kênh đăng ký:
                </Grid>
              }
              {
                (options === "indication" || options === "medical_session" || options === "transaction") ?
                  null
                :<Grid item xs={6} className = "el-Border-CardContent">
                  <div className="font-bold el-GridWordWrap">
                    {(data.appointment && StringUtils.parseChannel(data.appointment.channel)) || data.channel}
                  </div>
                </Grid>
              }
              {
                options === "transaction" &&
                <Grid container spacing={1} className = "p-4">
                  <Grid item xs={6} className = "el-Border-CardContent">
                    Loại thanh toán:
                  </Grid>
                  <Grid item xs={6} className = "el-Border-CardContent">
                    <div className="font-bold el-GridWordWrap">
                      {data.patientType === "BHYT" ? "Có bảo hiểm" : data.patientType === "VP" ? "Viện phí" : data.patientType === "KSK" ? "Khám sức khỏe" : data.patientType === "DV" ? "Khám dịch vụ" : 'Khác'}
                    </div>
                  </Grid>
                  <Grid item xs={6} className = "el-Border-CardContent">
                    Số tiền thanh toán:
                  </Grid>
                  <Grid item xs={6} className = "el-Border-CardContent">
                    <div className="font-bold el-GridWordWrap">
                      {data.payAmount}
                    </div>
                  </Grid>
                </Grid>
              }
              {
                options !== "transaction" &&
                <Grid item xs={6} className = "el-Border-CardContent">
                  Trạng thái:
                </Grid>
              }
              <Grid item xs={6} className = "el-Border-CardContent">
                {
                  options === "appointments" ?
                    <div className="font-bold el-GridWordWrap">
                      {data.state === "CANCEL" ? "Đã hủy" : data.state === "SERVED" ? "Đã đến khám" : data.state === "APPROVE" ? 'Đã duyệt' : "Chưa xác nhận"}
                    </div>
                  : options === "indication" ?
                    <div className="font-bold el-GridWordWrap">
                      {data.state === "PENDING" ? "Chờ xử lý" : data.state === "CONFIRM" ? "Đang thực hiện" : data.state === "RESOLVE" ? 'Đã hoàn thành' : ""}
                    </div>
                  : options === "medical_session" ? <div className="font-bold el-GridWordWrap">
                    {data.process === "IN_QUEUE" ? "Tới khám" : data.process === "WATING_CONCLUSION" ? "Đang khám" : data.process === "CONCLUSION" ? 'Đã khám' : "Hủy khám"}
                  </div>
                  : null
                }
              </Grid>
              <Grid item xs={6} className = {data.state === "CANCEL" || data.terminated === true ? "el-Border-CardContent" :""}>
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
              <Grid item xs={6} className = {data.state === "CANCEL" || data.terminated === true ? "el-Border-CardContent" :""}>
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
                      : data.terminated === false ? "": ""
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
