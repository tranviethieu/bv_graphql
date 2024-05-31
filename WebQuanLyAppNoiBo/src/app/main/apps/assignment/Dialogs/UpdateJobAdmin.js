import React, {useState} from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, Grid, Step, StepButton, Stepper, Icon, AppBar, Typography, FormControlLabel, Checkbox, CircularProgress } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { FuseAnimate } from '@fuse';
import { showMessage } from 'app/store/actions'
import * as Actions from '../store/actions';
import { makeStyles } from '@material-ui/core/styles';
import 'rc-progress/assets/index.css';
import { Line } from 'rc-progress';
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
function getSteps (){
  return ['Chưa tiếp nhận', 'Đang thực hiện', 'Đã hoàn thành']
}
function UpdateJobAdmin(props) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { open, onCloseDialog, data, onSubmitState } = props
    const [owner, setOwner] = useState({})
    const [displayPhones, setDisplayPhones] = useState("")
    const [jobDetail, setJobDetail] = useState({})
    const [reOpen, setReOpen] = useState(false)
    const [percent, setPercent] = useState(0);
    const [callCampaign, setCallCampaign] = useState({})
    const [selectedValue, setSelectedValue] = useState("");
    const [activeStep, setActiveStep] = useState(0);
    const [steps, setSteps] = useState([])
    const [loading, setLoading] = useState(false)

    const handleStep = step => () => {
      setActiveStep(step);
        if(step === 0){
          setSelectedValue("ASSIGN");
          setPercent(0)
        }
        else if (step === 1){
          setSelectedValue("PROCESSING");
        }
        else{
          setSelectedValue("COMPLETE");
        }
    };
    function validatePhoneNumber(phone) {
        const regex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
        return regex.test(phone)
    }
    function fetchData(){
      setReOpen(false)
      setLoading(false)
      Actions.getJobDetail(data._id,dispatch).then(response =>{
        setJobDetail(response.data)
        if(response.data.owner)
          setOwner(response.data.owner.base)
        setPercent(response.data.process)
        if (response.data.linkedCampaign.type === 'customercampaign'){
          setCallCampaign(response.data.customerCampaign)
          var tmpStringPhones = '';
          if(response.data.customerCampaign){
            for(var i=0;i<response.data.customerCampaign.phoneNumbers.length;i++){
                var tmpItem = response.data.customerCampaign.phoneNumbers[i];
                if(validatePhoneNumber(tmpItem)){
                    tmpStringPhones +=  tmpItem.trim() + ','
                }else{  }
            }
          }
          tmpStringPhones = tmpStringPhones.replace(/,\s*$/, "");
          setDisplayPhones(tmpStringPhones);
        }
        //phần set step để thực hiện thay đổi state
          setActiveStep(response.data.state === "ASSIGN" ? 0 : response.data.state === "PROCESSING" ? 1 : response.data.state === 'COMPLETE' ? 2 : '');
          setSelectedValue(response.data.state);
          setSteps(getSteps())
      })
    }
    function handleSubmit(){
      if(selectedValue!== jobDetail.state || percent!== jobDetail.process || reOpen ===  true){
        setLoading(true)
        if(selectedValue!== jobDetail.state){
          Actions.updataStateJob(data._id, selectedValue).then(response => {
            if(response.code === 0){
              dispatch(showMessage({ message: "Thay đổi trạng thái thành công" }))
            }
            else {
              dispatch(showMessage({ message: response.message }))
            }
            onSubmitState()
          })
        }
        if(percent!== jobDetail.process){
          Actions.updataProcessJob(data._id, percent).then(response => {
            if(response.code === 0){
              dispatch(showMessage({ message: "Thay đổi tiến trình thành công" }))
            }
            else{
              dispatch(showMessage({ message: response.message }))
            }
            onSubmitState()
          })
        }
        if (reOpen ===  true){
          Actions.updataStateJob(data._id, 'ASSIGN').then(response => {
            if(response.code === 0){
              dispatch(showMessage({ message: "Mở lại công việc thành công" }))
            }
            else{
              dispatch(showMessage({ message: response.message }))
            }
            onSubmitState()
          })
        }
      }
      else{
        onCloseDialog()
      }
    }
  return (
      <Dialog open={open} onEnter={fetchData} onClose={onCloseDialog} aria-labelledby="form-dialog-title" classes={{paper: "w-full m-24 rounded-8"}}>
        <AppBar position="static" elevation={1}>
          <div className="m-8">
            <div className="flex flex-1 w-full items-center justify-between">

              <div className="flex flex-col items-start max-w-full">
                <div className="flex items-center max-w-full">
                  <div className="flex flex-col min-w-0">
                    <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                      <Typography className="text-16 sm:text-20 truncate">
                        Công việc được giao
                      </Typography>
                    </FuseAnimate>
                    <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                      <Typography variant="caption">{data.showType === 'info' ? "Thông tin chi tiết" : "Cập nhật công việc"}</Typography>
                    </FuseAnimate>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AppBar>
        <DialogContent>
          <DialogContentText>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                Tên công việc:
              </Grid>
              <Grid item xs={6}>
                <div className = "font-bold el-GridWordWrap">
                  {jobDetail? jobDetail.name : ''}
                </div>
              </Grid>
              <Grid item xs={6}>
                Mô tả:
              </Grid>
              <Grid item xs={6}>
                <div className = "font-bold el-GridWordWrap">
                  {
                    jobDetail? jobDetail.description: ''
                  }
                </div>
              </Grid>
              <Grid item xs={6}>
                Người giao việc:
              </Grid>
              <Grid item xs={6}>
                <div className = "font-bold el-GridWordWrap">
                  {owner.fullName}
                </div>
              </Grid>
              <Grid item xs={6}>
                Đối tượng giao việc:
              </Grid>
              <Grid item xs={6}>
                <div className = "font-bold el-GridWordWrap">
                  {
                    jobDetail.members && jobDetail.members.length > 0 && jobDetail.members.map((item, index) => <span>
                      {
                        index === (jobDetail.members.length - 1) ?
                          item.name
                        : item.name + ", "
                      }
                    </span>
                    )
                  }
                </div>
              </Grid>
              <Grid item xs={6}>
                Ngày bắt đầu:
              </Grid>
              <Grid item xs={6}>
                <div className = "font-bold el-GridWordWrap">
                  {moment(jobDetail.startTime).format("DD/MM/YYYY")}
                </div>
              </Grid>
              <Grid item xs={6}>
                Ngày hết hạn:
              </Grid>
              <Grid item xs={6}>
                <div className = "font-bold el-GridWordWrap">
                  {moment(jobDetail.deathline).format("DD/MM/YYYY")}
                </div>
              </Grid>
              {
                data.state === 'COMPLETE' &&
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    Ngày hoàn thành:
                  </Grid>
                  <Grid item xs={6}>
                    <div className = "font-bold el-GridWordWrap">
                      {moment(jobDetail.completeTime).format("DD/MM/YYYY")}
                    </div>
                  </Grid>
                </Grid>
              }
              <Grid item xs={6}>
                Chiến dịch liên quan:
              </Grid>
              <Grid item xs={6}>
                <div className = "font-bold el-GridWordWrap">
                  {callCampaign ? callCampaign.name : ""}
                </div>
              </Grid>
              <Grid item xs={6}>
                Số điện thoại trong chiến dịch
              </Grid>
              <Grid item xs={6}>
                <div className = "font-bold el-GridWordWrap">
                  {displayPhones}
                </div>
              </Grid>
              {
                data.showType === 'info' ?
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      Tiến trình:
                    </Grid>
                    <Grid item xs={6}>
                      <div className = "font-bold el-GridWordWrap">
                        {jobDetail.process + "%"}
                      </div>
                    </Grid>
                    <Grid item xs={6}>
                      Trạng thái:
                    </Grid>
                    <Grid item xs={6}>
                      <div className = "font-bold el-GridWordWrap">
                        {jobDetail.state === "CANCEL" ? "Đã hủy" : jobDetail.state === "ASSIGN" ? "Chưa tiếp nhận" : jobDetail.state === "COMPLETE" ? "Đã hoàn thành" : "Đang thực hiện"}
                      </div>
                    </Grid>
                  </Grid>
                : <Grid container spacing={1} className = 'p-4'>
                  <Grid item xs={6}>
                    Tiến trình:
                  </Grid>
                  <Grid item xs={6}>
                    <div className = "font-bold el-GridWordWrap"><div>
                      <div>
                        {percent + "%"}
                      </div>
                      <Line percent={percent} strokeWidth="4" strokeColor={percent<=20 ? '#FE8C6A' : percent > 20 && percent<= 80 ?'#3FC7FA' :'#85D262'} />
                      <div className = "flex">
                        <Button variant="contained" size="small" color="primary" className = "el-minWith-Button" onClick = {()=>setPercent(0)}>
                          0%
                        </Button>
                        <Button variant="outlined" size="small" color="primary" className = "el-minWith-Button" onClick = {()=>setPercent(percent-1)} disabled = {percent === 0 ? true : false}>
                          -1
                        </Button>
                        <Button variant="outlined" size="small" color="primary" className = "el-minWith-Button" onClick = {()=>setPercent(percent-10)} disabled = {percent < 10 ? true : false}>
                          -10
                        </Button>
                        <Button variant="outlined" size="small" color="primary" className = "el-minWith-Button" onClick = {()=>setPercent(percent+10)} disabled = {percent > 90 ? true : false}>
                          +10
                        </Button>
                        <Button variant="outlined" size="small" color="primary" className = "el-minWith-Button" onClick = {()=>setPercent(percent+1)} disabled = {percent === 100 ? true : false}>
                          +1
                        </Button>
                        <Button variant="contained" size="small" color="primary" className = "el-minWith-Button" onClick = {()=>setPercent(100)}>
                          100%
                        </Button>
                      </div>
                    </div>
                    </div>
                  </Grid>
                  <div className = 'w-full p-4'>
                    {
                      jobDetail.state === "CANCEL" ?
                        <Grid container spacing={1} className = 'p-4'>
                          <Grid item xs={6}>
                            Trạng thái:
                          </Grid>
                          <Grid item xs={6}>
                            <div className = "font-bold el-GridWordWrap">
                              Đã hủy
                            </div>
                          </Grid>
                          <Grid item xs={6}>
                            Mở lại:
                          </Grid>
                          <Grid item xs={6}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={reOpen === true}
                                  onChange={e => setReOpen(!reOpen)}
                                  value="checkedB"
                                  color="primary"
                                />
                              }
                            />
                          </Grid>
                        </Grid>
                      :<div>
                        <div>Trạng thái đặt khám: </div>
                        <div className={classes.root}>
                          <Stepper nonLinear activeStep={activeStep}>
                            {steps.map((label, index) => (
                              <Step key={label}>
                                <StepButton
                                  onClick={handleStep(index)}
                                  icon={label === "Chưa tiếp nhận"?
                                    <Icon className={activeStep === index?"text-orange": "text-grey"}>radio_button_unchecked</Icon>
                                  : label === "Đang thực hiện"? <Icon className={activeStep === index?"text-blue": "text-grey"}>access_time</Icon>
                                  : <Icon className={activeStep === index?"text-green": "text-grey"}>check_circle</Icon>
                                  }
                                >
                                  {label}
                                </StepButton>
                              </Step>
                            ))}
                          </Stepper>
                        </div>
                      </div>
                    }
                  </div>
                </Grid>
              }
            </Grid>
          </DialogContentText>
        </DialogContent>
        {
          data.showType === 'info' ?
            <DialogActions>
              <Button onClick={onCloseDialog} color="primary">
                Đóng
              </Button>
            </DialogActions>
          :
          <DialogActions>
            <Button onClick={onCloseDialog} color="primary">
              Hủy
            </Button>
            <Button
              className="whitespace-no-wrap"
              variant="contained"
              color="secondary"
              onClick={()=>{handleSubmit()}}
            >
              Lưu thay đổi
            </Button>
            {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
          </DialogActions>
        }
      </Dialog>
  );
}
export default UpdateJobAdmin;
