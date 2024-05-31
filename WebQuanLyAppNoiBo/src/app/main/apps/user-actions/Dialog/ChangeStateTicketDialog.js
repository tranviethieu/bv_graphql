import React, {useState} from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, Grid, Step, StepButton, Stepper, Icon, AppBar, Typography, FormControlLabel, Checkbox} from '@material-ui/core';
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
  button: {
    marginRight: theme.spacing(1),
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  completed: {
    display: 'inline-block',
    color: "royalblue"
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));
function getSteps (){
  return ['Chưa xử lý', 'Đã xử lý']
}
function ChangeStateTicketDialog(props) {
  const classes = useStyles();
    const dispatch = useDispatch();
    const { open, onCloseDialog, data, onSubmitState } = props
    const [form, setForm] = useState({})
    const [user, setUser] = useState({})
    const [ticket, setTicket] = useState({})
    const [selectedValue, setSelectedValue] = useState("");
    const [activeStep, setActiveStep] = useState(0);
    const [steps, setSteps] = useState([])
    const [reOpen, setReOpen] = useState(false)
    const handleStep = step => () => {
      setActiveStep(step);
        if(step === 0){
          setSelectedValue("WAITING");
        }
        else{
          setSelectedValue("COMPLETE");
        }
    };
    function fetchData(){
      setReOpen(false)
        Actions.getUserAction(data.actionId,dispatch).then(response =>{
        setForm(response.data)
        setUser(response.data.user)
        setTicket(response.data.data)
      })
      if(data.state === 0){
        setActiveStep(0);
        setSelectedValue("WAITING");
        setSteps(getSteps())
      }
      else{
        setSelectedValue("COMPLETE")
      }
    }
    function handleSubmit(){
      if (activeStep!== data.state || (data.state === 1 && reOpen === true)){
        if(activeStep!== data.state){
            Actions.changeStateTicket(data.actionId, selectedValue).then(response => {
              dispatch(showMessage({ message: "Thay đổi trạng thái thành công" }))
            })
          }
        if(data.state === 1 && reOpen === true){
          Actions.changeStateTicket(data.actionId, 'WAITING').then(response => {
            dispatch(showMessage({ message: "Mở lại yêu cầu thành công" }))
          })
        }
        onSubmitState();
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
                        Yêu cầu khách hàng
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
                Tên khách hàng:
              </Grid>
              <Grid item xs={6}>
                <div className = "font-bold el-GridWordWrap">
                  {user.fullName}
                </div>
              </Grid>
              <Grid item xs={6}>
                Số điện thoại:
              </Grid>
              <Grid item xs={6}>
                <div className = "font-bold el-GridWordWrap">
                  {user.phoneNumber}
                </div>
              </Grid>
              <Grid item xs={6}>
                Ngày sinh:
              </Grid>
              <Grid item xs={6}>
                <div className = "font-bold el-GridWordWrap">
                  {moment(user.birthDay).format("DD/MM/YYYY")}
                </div>
              </Grid>
              <Grid item xs={6}>
                Địa chỉ:
              </Grid>
              <Grid item xs={6}>
                <div className = "font-bold el-GridWordWrap">
                  {user.address}
                </div>
              </Grid>
              <Grid item xs={6}>
                Thời gian tạo:
              </Grid>
              <Grid item xs={6}>
                <div className = "font-bold el-GridWordWrap">
                  {moment(form.createdTime).format("HH:mm DD/MM/YYYY")}
                </div>
              </Grid>
              <Grid item xs={6}>
                Loại yêu cầu:
              </Grid>
              <Grid item xs={6}>
                <div className = "font-bold el-GridWordWrap" style = {{ color: ticket.Type === 0? "green":"brown"}}>
                  {ticket.Type === 0 ? "Tư vấn" : "Khiếu nại"}
                </div>
              </Grid>
              <Grid item xs={6}>
                Tiêu đề:
              </Grid>
              <Grid item xs={6}>
                <div className = "font-bold el-GridWordWrap">
                  {ticket.Title}
                </div>
              </Grid>
              <Grid item xs={6}>
                Nội dung:
              </Grid>
              <Grid item xs={6}>
                <div className = "font-bold el-GridWordWrap">
                  {ticket.Note}
                </div>
              </Grid>
            </Grid>
          </DialogContentText>
          {
            data.state === 1 ?
              <DialogContentText>
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    Trạng thái yêu cầu:
                  </Grid>
                  <Grid item xs={6}>
                    <div className = "flex">
                      <Icon className="text-blue">check_circle</Icon>
                      <div className = "mt-1 ml-1 font-bold">Đã xử lý</div>
                    </div>
                  </Grid>
                  {
                    data.root === true &&
                    <Grid container spacing={1}>
                      <Grid item xs={6} className = "el-reOpen">
                        Mở lại yêu cầu:
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
                  }
                </Grid>
              </DialogContentText>
            :
            <div>
              <div>Trạng thái yêu cầu: </div>
              <div className={classes.root}>
                <Stepper nonLinear activeStep={activeStep}>
                  {steps.map((label, index) => (
                    <Step key={label}>
                      <StepButton onClick={handleStep(index)} icon={label === "Chưa xử lý"?<Icon className={activeStep === index?"text-orange": "text-grey"}>access_time</Icon>:<Icon className={activeStep === index?"text-blue": "text-grey"}>check_circle</Icon>}>
                        {label}
                      </StepButton>
                    </Step>
                  ))}
                </Stepper>
              </div>
            </div>
          }
        </DialogContent>
        {
          data.state === 1 && data.root === false?
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
          </DialogActions>
        }
      </Dialog>
  );
}
export default ChangeStateTicketDialog;
