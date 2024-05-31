import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, CardHeader, DialogContentText, CardActions, IconButton, Typography, Grid, Step, StepButton, Stepper, Icon, CircularProgress, TextField } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { showMessage } from 'app/store/actions'
import * as Actions from './actions';
import { makeStyles } from '@material-ui/core/styles';
import CheckCircle from '@material-ui/icons/CheckCircle'
import * as StringUtils from "../../utils/StringUtils";
import { hideAppointmentDialog, showAppointmentDialog } from '../actions';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}));

function ChangeStateAppointmentDialog({ data,onSuccess }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [state, setState] = useState("WAITING");
  const [oriStep, setOriStep] = useState(0);//trạng thái của form truyền vào
  const [activeStep, setActiveStep] = useState(0);
  const [steps, setSteps] = useState([])
  const [loading, setLoading] = useState(false);
  const [terminateReason, setTerminateReason] = useState("");

  useEffect(()=>{
    if(data){
      setTerminateReason(data.terminateReason)
    }
  }, [data])
  const handleStep = step => () => {
    //step ko được phép back về trạng thái trước
    if (step < oriStep ){
      setState(data.state)
    }
    else{
      setActiveStep(step);
      switch (step) {
        case 0:
          setState("WAITING");
          break;
        case 1:
          if (!data.patient)
            dispatch(showAppointmentDialog({ _id: data._id,onSuccess }));
          else
            setState("APPROVE");
          break;
        case 2:
          setState("SERVED");
          break;
        default:
          setState("CANCEL");
          break;
      }
    }
  };
  function initStep() {
    setSteps(['Chờ xác nhận', 'Duyệt', 'Đến khám', "Hủy"]);
    if (data.state === "WAITING") {
      setActiveStep(0);
      setOriStep(0);
    }
    else if (data.state === "APPROVE") {
      setActiveStep(1);
      setOriStep(1);
    }
    else if (data.state === "SERVED") {
      setActiveStep(2);
      setOriStep(2);
    }
    else {
      setActiveStep(3);
      setOriStep(3);
    }
  }
  useEffect(() => {
    initStep();
  }, [data]);

  function handleClose() {
    onSuccess && onSuccess();
    dispatch(hideAppointmentDialog());

  }

  function handleSubmit() {
    if (state !== data.state) {

      if (state === "APPROVE" && !data.patient) {
        dispatch(showAppointmentDialog({ _id: data._id }));
        return;
      } else {
        setLoading(true)
        Actions.update_appointment_state(data._id, state, terminateReason, dispatch).then(response => {
          if (response.code === 0) {
            dispatch(showMessage({ message: "Thay đổi trạng thái thành công" }))
            setLoading(false);
            handleClose();
          } else {
            dispatch(showMessage({ message: response.message }))
            setLoading(false);
          }
        })
      }
    }
    else {
        handleClose()
    }
  }
  return (
    <Card>
      <CardHeader className="el-CardHeader-FU"
        action={
          <IconButton aria-label="settings" onClick={handleClose}>
            <Icon>close</Icon>
          </IconButton>
        }
        title="THÔNG TIN ĐẶT KHÁM"
        subheader=""
      />
      <CardContent className="" style = {{height: "70vh", padding: 0}}>
        <div className="el-block-report lex flex-wrap h-full w-full overflow-y-auto flex-grow">
        <DialogContentText>
          <Grid container spacing={1}>
            <Grid item xs={6} className = "el-Border-CardContent">
              Tên khách hàng:
            </Grid>
            <Grid item xs={6} className = "el-Border-CardContent">
              <div className="font-bold el-GridWordWrap">
                {data.inputPatient && data.inputPatient.fullName}
              </div>
            </Grid>
            <Grid item xs={6} className = "el-Border-CardContent">
              Mã bệnh nhân:
            </Grid>
            <Grid item xs={6} className = "el-Border-CardContent">
              <div className="font-bold el-GridWordWrap">
                {data.patientCode}
              </div>
              {
                !data.patient && <Typography className="text-12 font-italic text-red">Chưa có mã bệnh nhân này trên HIS</Typography>
              }
            </Grid>
            <Grid item xs={6} className = "el-Border-CardContent">
              Số điện thoại:
            </Grid>
            <Grid item xs={6} className = "el-Border-CardContent">
              <div className="font-bold el-GridWordWrap">
                {data.inputPatient && data.inputPatient.phoneNumber}
              </div>
            </Grid>
            <Grid item xs={6} className = "el-Border-CardContent">
              Ngày sinh:
            </Grid>
            <Grid item xs={6} className = "el-Border-CardContent">
              <div className="font-bold el-GridWordWrap">
                {moment(data.inputPatient && data.inputPatient.birthDay).format("DD/MM/YYYY")}
              </div>
            </Grid>
            <Grid item xs={6} className = "el-Border-CardContent">
              Địa chỉ:
            </Grid>
            <Grid item xs={6} className = "el-Border-CardContent">
              <div className="font-bold el-GridWordWrap">
                {data.inputPatient &&
                  <div>
                    {data.inputPatient.street} {data.inputPatient.ward && ` - ${data.inputPatient.ward.name}`} {data.inputPatient.district && ` - ${data.inputPatient.district.name}`}{data.inputPatient.province && ` - ${data.inputPatient.province.name}`} {data.inputPatient.nationality && ` - ${data.inputPatient.nationality.name}`}
                  </div>
                }
              </div>
            </Grid>
            <Grid item xs={6} className = "el-Border-CardContent">
              Số CMND/Thẻ căn cước:
            </Grid>
            <Grid item xs={6} className = "el-Border-CardContent">
              <div className="font-bold el-GridWordWrap">
                {data.inputPatient && data.inputPatient.nationIdentification}
              </div>
            </Grid>
            <Grid item xs={6} className = "el-Border-CardContent">
              Bảo hiểm Y tế:
            </Grid>
            <Grid item xs={6} className = "el-Border-CardContent">
              <div className="font-bold el-GridWordWrap">
                {data.inputPatient && data.inputPatient.insuranceCode}
              </div>
            </Grid>
            <Grid item xs={6} className = "el-Border-CardContent">
              Thời gian đặt:
            </Grid>
            <Grid item xs={6} className = "el-Border-CardContent">
              <div className="font-bold el-GridWordWrap">
                {moment(data.createdTime).format("HH:mm DD/MM/YYYY")}
              </div>
            </Grid>

            <Grid item xs={6} className = "el-Border-CardContent">
              Thời gian khám:
            </Grid>
            <Grid item xs={6} className = "el-Border-CardContent">
              <div className="font-bold el-GridWordWrap">
                {data.appointmentTime + ". Ngày: " + moment(data.appointmentDate).format("DD/MM/YYYY")}
              </div>
            </Grid>
            <Grid item xs={6} className = "el-Border-CardContent">
              Khoa khám:
            </Grid>
            <Grid item xs={6} className = "el-Border-CardContent">
              <div className="font-bold el-GridWordWrap">
                {data.department && data.department.name}
              </div>
            </Grid>
            <Grid item xs={6} className = "el-Border-CardContent">
              Nội dung khám:
            </Grid>
            <Grid item xs={6} className = "el-Border-CardContent">
              <div className="font-bold el-GridWordWrap">
                {data.reason || data.note}
              </div>
            </Grid>
            <Grid item xs={6} className = "el-Border-CardContent">
              Kênh đăng ký:
            </Grid>
            <Grid item xs={6} className = "el-Border-CardContent">
              <div className="font-bold el-GridWordWrap">
                {StringUtils.parseChannel(data.channel)}
              </div>
            </Grid>
          </Grid>
        </DialogContentText>

        <div className="flex flex-wrap flex-grow">
          <div>Trạng thái đặt khám: </div>
          <div className={classes.root}>
            <Stepper nonLinear activeStep={activeStep}>
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepButton
                    // disabled = {index === 2 ? true : false}
                    onClick={handleStep(index)}
                    icon={index === 0 ?
                      <Icon className={activeStep === index ? "text-orange" : "text-grey"}>radio_button_unchecked</Icon>
                    : index === 1 ? <Icon className={activeStep === index ? "text-green" : "text-grey"}>check_circle</Icon>
                    : index === 2 ? <CheckCircle style={{ color: activeStep === index ? "royalblue" : "#B8C2CC" }} />
                    : <CheckCircle style={{ color: activeStep === index ? "red" : "#B8C2CC" }} />
                    }
                  >
                    {label}
                  </StepButton>
                </Step>
              ))}
            </Stepper>
          </div>
          {
            activeStep === 3 && <div>
              <TextField
                className="mt-8 mb-16 min-w-sm"
                label="Vui lòng nhập lý do hủy đặt khám"
                margin="dense"
                value={terminateReason}
                onChange={e => setTerminateReason(e.target.value)}
                variant="outlined"
                fullWidth
              />
            </div>
          }
        </div>
        </div>
      </CardContent>
      {
        (data.state === "CANCEL" || data.state === "SERVED") && data.root === false ?
          <CardActions>
            <Button onClick={handleClose} color="primary">
              Đóng
              </Button>
          </CardActions>
          :
          <CardActions>
            <Button onClick={handleClose} color="primary">
              Hủy
            </Button>
            <Button
              className="whitespace-no-wrap"
              variant="contained"
              color="secondary"
              onClick={() => { handleSubmit() }}
            >
              Lưu thay đổi
            </Button>
            {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
          </CardActions>
      }
    </Card>
  );
}
export default ChangeStateAppointmentDialog;
