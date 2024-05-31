import React, { useState, useEffect } from 'react';
import clsx from 'clsx'
import { useForm } from '@fuse/hooks';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import { red } from '@material-ui/core/colors';
import { showMessage } from 'app/store/actions'
import { useDispatch } from 'react-redux';
import { FuseChipSelect } from '@fuse';
import * as Actions from '../actions';
import { toggleCallPanel } from 'app/fuse-layouts/shared-components/CallOutPanel/store/actions'
import { Icon, Tabs, Tab, TextField, Checkbox, List, Paper, Tooltip, Button, MobileStepper } from '@material-ui/core';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import moment from 'moment';
import _ from '@lodash';
import ActionListItem from './ActionListItem';
import history from '@history';
import {showAppointmentDialog} from '../actions'
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import viLocale from "date-fns/locale/vi";
const useStyles = makeStyles(theme => ({
    root: {
        width: 550,
        position: "absolute",
        right:550
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    avatar: {
        backgroundColor: red[500],
    },
}));


function FloatUserDialog(props) {
    const classes = useStyles(props);
    const dispatch = useDispatch();
    //set số trang cho action list item
    const [activeStep, setActiveStep] = useState(0);
    const [maxSteps, setMaxsteps] = useState(0);
    const [page, setPage] = useState(0);
    const [tabValue, setTabValue] = React.useState(0);
    const { form: user, setForm: setUser, handleChange, setInForm: setInUser } = useForm({
      nationality : {
        code : "1",
        name : "Việt Nam"
    },
    nation : {
        code : "25",
        name : "Kinh"
    },
  });
    const [actions, setActions] = useState([]);
    const [channelType, setChannelType] = useState("CRM");
    const [works, setWorks] = useState([])
    const [nations, setNations] = useState([])
    const [nationalitys, setNationalitys] = useState([])

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
    }
    function handleUserCodeBaseChange(value, name) {
        setInUser(name, { code: value.value, name: value.label })
    }
    useEffect(() =>{
      if(props.id||props.phoneNumber){
        if(props.channelType){
          setChannelType(props.channelType)
        }
        else{
          setChannelType("CRM")
        }
      }
      else{
        setChannelType("CRM")
      }
    }, [props.channelType, props.id, props.phoneNumber])
    useEffect(()=>{
      loadDefaultData();
    },[])
    useEffect(() => {
      setPage(0)
        if (props._id) {
            Actions.getUserById(props._id).then(response => {
                if (response.data)
                    setUser(response.data);
            })
        } else if (props.phoneNumber) {
            Actions.getUserByPhone(props.phoneNumber).then(response => {
                if (response.data)
                    setUser(response.data);
                else
                    setUser({phoneNumber:props.phoneNumber})
            })
        }
    }, [props, setUser])
    useEffect(() => {
        if (user._id) {
            Actions.getActions({ filtered: [{ id: 'userId', value: user._id }, {id: 'state', value: 'ACTIVE'}], page: page, pageSize: 10 }).then(response => {
                if (response.data)
                    setActions(response.data);
                    setMaxsteps(response.pages)
            })
        }
    }, [page]);
    function handleUserDateChange(e){
        setInUser('birthDay', moment(e).format("YYYY-MM-DD"));
    }
    function handleChangeTab(e, tabValue) {
        setTabValue(tabValue);
    }
    function onFetchUser() {
        if (user.phoneNumber && user.phoneNumber.length > 0) {
            Actions.getUserByPhone(user.phoneNumber, dispatch).then(response => {
                if (response.data)
                    setUser(response.data);
            })
        }
    }
    function saveUser() {
        Actions.saveUser(user, dispatch).then(response => {
            if (response.data) {
                setUser(response.data);
                dispatch(showMessage({ message: "Lưu thông tin người dùng thành công" }))
            }
        })
    }
    const handleClose = () => {

        dispatch(Actions.hideDialog('user-detail'));
    };
    function handleUserChipChange(value, name) {
        setUser(_.set({ ...user }, name, value.value));
    }
    const handleNext = () => {
      setActiveStep(prevActiveStep => prevActiveStep + 1);
      setPage(nowPage => nowPage + 1);
    };

    const handleBack = () => {
      setActiveStep(prevActiveStep => prevActiveStep - 1);
      setPage(nowPage => nowPage - 1);
    };
    return (
        <Card className={props.className}>
          <CardHeader
            className = "el-CardHeader-FU"
            avatar={
              <Avatar aria-label="recipe" className={classes.avatar} src={user.avatar}>
                {user.fullName && user.fullName.substring(0, 1)}
              </Avatar>
            }
            action={
              <IconButton aria-label="settings" onClick={handleClose}>
                <Icon>close</Icon>
              </IconButton>
            }
            title={user.fullName}
            subheader={moment(user.birthDay).format("DD/MM/YYYY")}
          />

          <Tabs
            className = "el-Tabs-Draggable"
            value={tabValue}
            onChange={handleChangeTab}
            indicatorColor="secondary"
            textColor="secondary"
            variant="scrollable"
            scrollButtons="auto"
            classes={{ root: "w-full h-64" }}
          >
            <Tab className="h-64 normal-case" label="Thông tin khách hàng" />
            <Tab className="h-64 normal-case" label="Lịch sử" />
          </Tabs>
          <CardContent>
            {
              tabValue === 0 && <div className = "el-CardContent-FU pr-10">
                <TextField
                  className="mt-8 mb-16"
                  error={user.phoneNumber === ''}
                  required
                  label="Số điện thoại"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={user.phoneNumber || ""}
                  margin="dense"
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  onKeyPress={e => {
                    if (e.charCode === 13) onFetchUser();
                  }}
                />
                <TextField
                  className="mt-8 mb-16"
                  error={user.fullName === ''}
                  required
                  label="Tên khách hàng"
                  id="fullName"
                  name="fullName"
                  value={user.fullName || ''}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  margin="dense"
                />
                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={viLocale}>
                  <KeyboardDatePicker
                    disableToolbar
                    fullWidth
                    className="mt-8 mb-16"
                    autoOk
                    label = "Ngày sinh"
                    variant="inline"
                    id="birthDay"
                    name="birthDay"
                    inputVariant="outlined"
                    value={moment(user.birthDay).format("YYYY-MM-DD")}
                    onChange={e => handleUserDateChange(e) }
                    format="dd/MM/yyyy"
                    invalidDateMessage="Ngày không hợp lệ"
                    minDateMessage = "Năm sinh không thể nhỏ hơn năm 1900"
                    margin="dense"
                  />
                </MuiPickersUtilsProvider>
                <FuseChipSelect
                  className="mt-8 mb-16"
                  value={
                    { value: user.gender, label: user.gender === "1" ? "Nam giới" : user.gender === "2" ? "Nữ giới" : user.gender === "" ? "Giới tính khác": "Chưa chọn" }
                  }
                  onChange={(value) => handleUserChipChange(value, 'gender')}
                  textFieldProps={{
                    label: 'Giới tính',
                    InputLabelProps: {
                      shrink: true
                    },
                    variant: 'outlined'
                  }}
                  options={[{ value: "2", label: "Nữ giới" }, { value: "1", label: "Nam giới" }, { value: "3", label: "Giới tính khác" }]}
                  margin="dense"
                />
                <TextField
                  className="mt-8 mb-16"
                  label="Thư điện tử"
                  id="email"
                  name="email"
                  value={user.email || ""}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  margin="dense"
                />
                <FuseChipSelect
                  fullWidth
                  margin='dense'
                  className="mt-8 mb-16"
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
                <div>
                  <Checkbox
                    checked={user.mariage}
                    id="mariage"
                    name="mariage"
                    onChange={handleChange}
                  />
                  <label>Đã lập gia đình</label>
                </div>
                <FuseChipSelect
                  margin='dense'
                  className="mt-8 mb-16"
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
                <FuseChipSelect
                  margin='dense'
                  className="mt-8 mb-16"
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
                <TextField
                  className="mt-8 mb-16"
                  label="Địa chỉ"
                  id="street"
                  name="street"
                  value={user.street || ''}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  margin="dense"
                />
                <TextField
                  className="mt-8 mb-16"
                  label="Số CMND/Thẻ căn cước"
                  id="nationIdentification"
                  name="nationIdentification"
                  value={user.nationIdentification || ''}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  margin="dense"
                />
                <TextField
                  className="mt-8 mb-16"
                  label="Bảo hiểm Y tế"
                  id="insuranceCode"
                  name="insuranceCode"
                  value={user.insuranceCode || ''}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  margin="dense"
                />
              </div>
            }
            {
              tabValue === 1 && <Paper className = "el-History">
                <List>
                  {
                    actions.map((action, index) => <ActionListItem key={index} todo={action} type={props.type} userName = {user.fullName}/>)
                  }
                </List>
              </Paper>
            }
            {
              tabValue === 0 &&
              <div id = "el-ButtonGroupFloatUA">
                <Button color="primary" onClick={saveUser} variant="contained" id = "el-ButtonSaveCustomer" className="md:w-1/2 sm:w-1/2 p-4 m-4">
                  Lưu khách hàng
                </Button>
                <Button className='btn-blue md:w-1/2 sm:w-1/2 p-4 m-4' onClick={e => dispatch(showAppointmentDialog({data: _.omit(user,["_id","address", "avatar, createdTime"])}))} variant="contained" id = "el-ButtonCreateAppointment">
                  Tạo lịch khám
                </Button>
              </div>
            }
            {
              tabValue === 1 && actions.length > 0 &&
              <MobileStepper
                steps={maxSteps}
                position="static"
                variant="text"
                activeStep={activeStep}
                nextButton={
                  <Button className = "el-ButtonLowerCase" size="small" onClick={handleNext} disabled={activeStep === maxSteps - 1}>
                    Trang tiếp
                    <KeyboardArrowRight />
                  </Button>
                }
                backButton={
                  <Button className = "el-ButtonLowerCase" size="small" onClick={handleBack} disabled={activeStep === 0}>
                    <KeyboardArrowLeft />
                    Trang trước
                  </Button>
                }
              />
            }
          </CardContent>
          <CardActions disableSpacing className = 'justify-center'>
            {/* <IconButton color="secondary" onClick={e => dispatch(showUserActionDialog({ phoneNumber: user.phoneNumber, type: 'EXAMINATION', className: "el-coverUAD" }))}>
              <Tooltip title={"Tạo kết quả khám"} placement="top">
                <Icon>bubble_chart</Icon>
              </Tooltip>
              </IconButton>
              <IconButton color="secondary" onClick={e => dispatch(showUserActionDialog({ phoneNumber: user.phoneNumber, type: 'TESTRESULT', className: "el-coverUAD-TestResult" }))}>
              <Tooltip title={"Tạo kết quả xét nghiệm"} placement="top">
                <Icon>blur_circular</Icon>
              </Tooltip>
              </IconButton>
              <IconButton color="secondary" onClick={e => dispatch(showUserActionDialog({ phoneNumber: user.phoneNumber, type: 'SCANRESULT', className: "el-coverUAD" }))}>
              <Tooltip title={"Tạo kết quả chụp chiếu"} placement="top">
                <Icon>center_focus_strong</Icon>
              </Tooltip>
              </IconButton>
              <IconButton color="secondary"onClick={e => dispatch(showUserActionDialog({ phoneNumber: user.phoneNumber, type: 'PRESCRIPTION', className: "el-coverUAD-Prescription" }))}>
              <Tooltip title={"Tạo đơn thuốc"} placement="top">
                <Icon>assignment</Icon>
              </Tooltip>
              </IconButton>
              <IconButton color="secondary" onClick={e => dispatch(showUserActionDialog({ phoneNumber: user.phoneNumber, type: 'TICKET', className: "el-coverUAD" }))}>
              <Tooltip title={"Yêu cầu từ khách hàng"} placement="top">
                <Icon>class</Icon>
              </Tooltip>
            </IconButton> */}
            <IconButton onClick={e => {
              dispatch(toggleCallPanel(user.phoneNumber))
            }}>
              <Tooltip title={"Gọi tư vấn trực tiếp"} placement="top" >
                <Icon className="text-green">call</Icon>
              </Tooltip>
            </IconButton>
            {/* <IconButton onClick={e => {
              history.push("/apps/sms/sendsms");
              }}>
              <Tooltip title={"Gửi sms"} placement="top" >
                <Icon className="text-yellow">textsms</Icon>
              </Tooltip>
              </IconButton>
              <IconButton onClick={e => history.push("/apps/chat")}>
              <Tooltip title={"Mở hộp thoại"} placement="top">
                <Icon className="text-red">chat_bubble_outline</Icon>
              </Tooltip>
            </IconButton> */}
          </CardActions>
        </Card>
    )
}

export default FloatUserDialog;
