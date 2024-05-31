import React, {useState} from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, Grid, Step, StepButton, Stepper, Icon, AppBar, Typography, FormControlLabel, Checkbox, CircularProgress} from '@material-ui/core';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { FuseAnimate } from '@fuse';
import { showMessage } from 'app/store/actions'
import * as Actions from '../store/actions';
import { makeStyles } from '@material-ui/core/styles';

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
  return ['Đang hoạt động', 'Đã kết thúc']
}
function ChangeStateCallCampaignDialog(props) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { open, onCloseDialog, data, onSubmitState } = props
    const [owner, setOwner] = useState({})
    const [reOpen, setReOpen] = useState(false)
    const [callCampaign, setCallCampaign] = useState({})
    const [selectedValue, setSelectedValue] = useState("");
    const [activeStep, setActiveStep] = useState(0);
    const [steps, setSteps] = useState([])
    const [loading, setLoading] = useState(false)

    const handleStep = step => () => {
      setActiveStep(step);
        if(step === 0){
          setSelectedValue(false);
        }
        else{
          setSelectedValue(true);
        }
    };
    function fetchData(){
      setReOpen(false)
      setLoading(false)
      Actions.getCallCampaign(data._id,dispatch).then(response =>{
        setCallCampaign(response.data)
        // setForm(response.data)
        setOwner(response.data.owner.base)
        // setTicket(response.data.data)
      })
      if(data.finished === false){
        setActiveStep(0);
        setSelectedValue(false);
        setSteps(getSteps())
      }
      else{
        setSelectedValue(true)
      }
    }
    function handleSubmit(){
      if(selectedValue!== data.finished || (data.finished === true && reOpen === true)){
        setLoading(true)
        if(selectedValue!== data.finished){
          Actions.updateStateCampaign(data._id, selectedValue).then(response => {
            dispatch(showMessage({ message: "Thay đổi trạng thái thành công" }))
            onSubmitState()
          })
        }
        if(data.finished === true && reOpen === true){
          Actions.updateStateCampaign(data._id, false).then(response => {
            dispatch(showMessage({ message: "Mở lại chiến dịch thành công" }))
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
                        Chiến dịch
                      </Typography>
                    </FuseAnimate>
                    <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                      <Typography variant="caption">Thay đổi trạng thái</Typography>
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
                Tên chiến dịch:
              </Grid>
              <Grid item xs={6}>
                <div className = "font-bold el-GridWordWrap">
                  {callCampaign.name}
                </div>
              </Grid>
              <Grid item xs={6}>
                Mô tả:
              </Grid>
              <Grid item xs={6}>
                <div className = "font-bold el-GridWordWrap">
                  {
                    callCampaign.description
                  }
                </div>
              </Grid>
              <Grid item xs={6}>
                Loại cuộc gọi:
              </Grid>
              <Grid item xs={6}>
                <div className = "font-bold el-GridWordWrap">
                  {
                    callCampaign.direction === "IN" ? 'Gọi vào' : callCampaign.direction === "OUT" ? "Gọi ra" : "Không xác định"
                  }
                </div>
              </Grid>
              <Grid item xs={6}>
                Ngày bắt đầu:
              </Grid>
              <Grid item xs={6}>
                <div className = "font-bold el-GridWordWrap">
                  {moment(callCampaign.startTime).format("DD/MM/YYYY")}
                </div>
              </Grid>
              <Grid item xs={6}>
                Ngày kết thúc:
              </Grid>
              <Grid item xs={6}>
                <div className = "font-bold el-GridWordWrap">
                  {moment(callCampaign.endTime).format("DD/MM/YYYY")}
                </div>
              </Grid>
              <Grid item xs={6}>
                Người tạo:
              </Grid>
              <Grid item xs={6}>
                <div className = "font-bold el-GridWordWrap">
                  {owner.fullName}
                </div>
              </Grid>
            </Grid>
          </DialogContentText>
          {
            data.finished === true ?
              <DialogContentText>
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    Trạng thái chiến dịch:
                  </Grid>
                  <Grid item xs={6}>
                    <div className = "flex">
                      <Icon className="text-red">highlight_off</Icon>
                      <div className = "mt-1 ml-1 font-bold">Đã kết thúc</div>
                    </div>
                  </Grid>
                </Grid>
              </DialogContentText>
            :
            <div>
              <div>Trạng thái chiến dịch: </div>
              <div className={classes.root}>
                <Stepper nonLinear activeStep={activeStep}>
                  {steps.map((label, index) => (
                    <Step key={label}>
                      <StepButton onClick={handleStep(index)} icon={label === "Đang hoạt động"?<Icon className={activeStep === index?"text-green": "text-grey"}>check_circle</Icon>:<Icon className={activeStep === index?"text-red": "text-grey"}>highlight_off</Icon>}>
                        {label}
                      </StepButton>
                    </Step>
                  ))}
                </Stepper>
              </div>
            </div>
          }
          {
            data.finished === true ?
              <DialogContentText>
                <Grid container spacing={1}>
                  <Grid item xs={6} className = "el-reOpen">
                    Mở lại chiến dịch:
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
              </DialogContentText>
            :
            <div>
            </div>
          }
        </DialogContent>
        {
          data.finished === true && data.root === false?
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
export default ChangeStateCallCampaignDialog;
