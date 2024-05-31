import React, { useEffect, useState } from 'react';
import { Button, Icon, Typography, Grid, TextField, List, ListItem, ListItemText, ListItemIcon, Checkbox, Card, CardHeader, Divider } from '@material-ui/core';
import { FuseAnimate, FuseChipSelect, FusePageSimple } from '@fuse';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import moment from 'moment'
import { useForm } from '@fuse/hooks';
import * as Actions from './store/actions';
import { showMessage } from 'app/store/actions'
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import viLocale from "date-fns/locale/vi";
import history from '@history';
const today = new Date()
const tomorrow = new Date(today)
tomorrow.setDate(tomorrow.getDate() + 1)
const useStyles = makeStyles(theme => ({
  root: {
    margin: 'auto',
  },
  cardHeader: {
    padding: theme.spacing(1, 2),
  },
  list: {
    width: 350,
    height: 230,
    backgroundColor: theme.palette.background.paper,
    overflow: 'auto',
  },
  button: {
    margin: theme.spacing(0.5, 0),
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}));

const initMember = {
  // _id: null,
  name: '',
  description: '',
  startTime: new Date(),
  deathline: tomorrow,
}

function AssignmentEdit(props) {
    const dispatch = useDispatch();
    const classes = useStyles();
    const { form, handleChange, setInForm } = useForm(initMember)
    const [listMember, setListMember] = useState([])
    const [listMemberFilter, setListMemberFilter] = useState([])
    const [callCampaign, setCallCampaign] = useState(null)
    const [displayPhones, setDisplayPhones] = useState("")
    const [callCampaigns, setCallCampaigns] = useState([])
    const [assignedMembers, setAssignedMembers] = useState ([])
    const [checked, setChecked] = React.useState([]);

    const leftChecked = intersection(checked, listMemberFilter);
    const rightChecked = intersection(checked, assignedMembers);

    useEffect(()=>{
      Actions.getMyStaff().then(response => {
        if(response.code === 0){
          setListMember(response.data)
        }
      })
      Actions.getCallCampaigns({filtered:[{id: "finished", value: "false"}]}).then(response =>{
        if(response.code === 0){
          setCallCampaigns(response.data)
        }
      })
    }, [])
    useEffect(()=>{
      fetchData()
    }, [dispatch, props.match.params])
    function fetchData(){
      const _id = props.match.params._id;
        if(_id){
          Actions.getJobDetail(_id, dispatch).then(response =>{
            if(response.code === 0){
              Actions.getMyStaff().then(staff => {
                if(staff.code === 0){
                  var tmpList = staff.data;
                  response.data.members.forEach((i)=>{
                    tmpList = tmpList.filter((item)=>{
                        return item._id!==i._id;
                    })
                  })
                  setListMemberFilter(tmpList)
                }
              })
              setInForm('_id', response.data._id)
              setInForm('linkedCampaign', response.data.linkedCampaign)
              setInForm('name', response.data.name)
              setInForm('description', response.data.description)
              setInForm('startTime', response.data.startTime)
              setInForm('deathline', response.data.deathline)
              setInForm('members', response.data.members)
              setAssignedMembers(response.data.members)
              if(response.data.customerCampaign){
                Actions.getCallCampaign(response.data.customerCampaign._id).then(response => {
                  if(response.code === 0){
                    setCallCampaign(response.data)
                    var tmpStringPhones = '';
                    for(var i=0;i<response.data.phoneNumbers.length;i++){
                        var tmpItem = response.data.phoneNumbers[i];
                        if(validatePhoneNumber(tmpItem)){
                            tmpStringPhones +=  tmpItem.trim() + ','
                        }else{  }
                    }
                    tmpStringPhones = tmpStringPhones.replace(/,\s*$/, "");
                    setDisplayPhones(tmpStringPhones);
                  }
                })
              }
            }
          });
        }
    }
    function validatePhoneNumber(phone) {
        const regex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
        return regex.test(phone)
    }
    function not(a, b) {
      return a.filter(value => b.indexOf(value) === -1);
    }

    function intersection(a, b) {
      return a.filter(value => b.indexOf(value) !== -1);
    }

    // function union(a, b) {
    //   return [...a, ...not(b, a)];
    // }
    function handleSubmit() {
        Actions.saveJobAssiment(form).then(response => {
          if(response.code === 0){
            dispatch(showMessage({ message: "Giao việc thành công" }))
            history.push('/apps/assignment/workby');
          }
        })
    }
    function handleToggle(value, type){
      const currentIndex = checked.indexOf(value);
      const newChecked = [...checked];

      if (currentIndex === -1) {
        newChecked.push(value);
      } else {
        newChecked.splice(currentIndex, 1);
      }

      setChecked(newChecked);
    }
    function customList (items, type){
      return(
        <Card>
          <CardHeader
            id = "el-customCardHeader"
            className={classes.cardHeader}
            title={type === 'liststaff' ? "Đối tượng chưa giao việc" : "Đối tượng đã giao việc"}
            ></CardHeader>
          <Divider />
          <List className={classes.list} dense component="div" role="list">
            {items && items.map(value => {
              const labelId = `transfer-list-item-${value._id}-label`;

              return (
                <ListItem key={value._id} role="listitem" button onClick={()=>handleToggle(value, type)}>
                  <ListItemIcon>
                    <Checkbox
                      checked={checked.indexOf(value) !== -1}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ 'aria-labelledby': labelId }}
                    />
                  </ListItemIcon>
                  <ListItemText id={labelId} primary={type === 'liststaff' ? value.base.fullName : value.name} />
                </ListItem>
              );
            })}
            <ListItem />
          </List>
        </Card>
      )
    }
    function formatMember(member){
      var data = member.map((item) => {
        return {
          _id: item.value,
          type: "PERSON",
          name: item.label,
        };
      })
      return data;
    }
    function formatMemberCheckedLeft(member){
      var data = member.map((item) => {
        return {
          _id: item._id,
          type: "PERSON",
          name: item.base.fullName,
        };
      })
      return data;
    }
    function formatMemberCheckedRight(member){
      var data = member.map((item) => {
        return {
          _id: item._id,
          base: {
            fullName: item.name
          }
        };
      })
      return data;
    }
    function formatDeleteData(member){
      var data = member.map((item) => {
        return item._id
      })
      return data;
    }
    function handleChangeMember(e){
      let newList = formatMember(e)
      setInForm('members', newList)
    }
    function handleChangeCampaign(e){
      setInForm('linkedCampaign', {_id: e.value, type: 'customercampaign'})
      Actions.getCallCampaign(e.value).then(response => {
        if(response.code === 0){
          setCallCampaign(response.data)
          var tmpStringPhones = '';
          for(var i=0;i<response.data.phoneNumbers.length;i++){
              var tmpItem = response.data.phoneNumbers[i];
              if(validatePhoneNumber(tmpItem)){
                  tmpStringPhones +=  tmpItem.trim() + ','
              }else{  }
          }
          tmpStringPhones = tmpStringPhones.replace(/,\s*$/, "");
          setDisplayPhones(tmpStringPhones);
        }
      })
    }
    function canBeSave() {
        return (
            form && form.name && form.name.length > 0 && form.linkedCampaign && form.members && form.members.length > 0
        )
    }
    // add member cho công việc
    const handleCheckedRight = () => {
      let newList = formatMemberCheckedLeft(leftChecked)
      Actions.addMember(form._id, newList, dispatch).then(response => {
        if(response.code === 0){
              dispatch(showMessage({ message: "Thêm đối tượng giao việc thành công" }))
              fetchData()
            }
        })
       setAssignedMembers(assignedMembers.concat(newList));
       setListMemberFilter(not(listMemberFilter, leftChecked));
       setChecked(not(checked, leftChecked));
     };
     // remove Member công việc
     const handleCheckedLeft = () => {
       let newList = formatMemberCheckedRight(rightChecked)
       let listDelete = formatDeleteData(rightChecked)
       Actions.removeMember(form._id, listDelete, dispatch).then(response => {
       if(response.code === 0){
             dispatch(showMessage({ message: "Xóa đối tượng giao việc thành công" }))
             fetchData()
           }
       })
       setListMemberFilter(listMemberFilter.concat(newList));
       setAssignedMembers(not(assignedMembers, rightChecked));
       setChecked(not(checked, rightChecked));
     };
    return (
        <FusePageSimple
          id="el-ReportAppointmentCover"
          classes={{
            toolbar: "p-0",
            header: "min-h-72 h-72 sm:h-136 sm:min-h-136 p-24"
          }}
          header={
            <div className="flex flex-1 w-full items-center justify-between el-HeaderPage">
              <div className="flex flex-col items-start max-w-full">
                <FuseAnimate animation="transition.slideRightIn" delay={300}>
                  <Typography className="normal-case flex items-center sm:mb-12" component={Link} role="button" to="/apps/assignment/workby" color="inherit">
                    <Icon className="mr-4 text-20">arrow_back</Icon>
                    Giao việc
                  </Typography>
                </FuseAnimate>
                <div className="flex items-center max-w-full">

                  <div className="flex flex-col min-w-0">
                    <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                      <Typography className="text-16 sm:text-20 truncate">
                        {form && form.name && form.name!== '' ? form.name : "Giao việc" }
                      </Typography>
                    </FuseAnimate>
                    <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                      <Typography variant="caption">Chi tiết giao việc</Typography>
                    </FuseAnimate>
                  </div>
                </div>
              </div>
              <div className = "el-SurveyEdit-Button">
                <FuseAnimate animation="transition.slideRightIn" delay={300}>
                  <Button
                    // component={Link} to="/apps/calls/campaigns"
                    className="whitespace-no-wrap"
                    color="secondary"
                    variant="contained"
                    disabled={!canBeSave()}
                    onClick={handleSubmit}
                  >
                    Lưu thông tin
                  </Button>
                </FuseAnimate>
              </div>
            </div>
          }
          content={
            <div className = "p-24" id = "el-CreateAssignmentFromCampaign-Content">
              <div className="el-block-report">
                <Typography className="pl-12 text-15 font-bold mb-10 block-tittle">THÔNG TIN CHIẾN DỊCH:</Typography>
                <FuseChipSelect
                  onChange={(e) => handleChangeCampaign(e)}
                  placeholder="Chọn chiến dịch"
                  value = {callCampaign? {value: callCampaign._id , label: callCampaign.name} : null}
                  textFieldProps={{
                    label: 'Chiến dịch (Bắt buộc)',
                    InputLabelProps: {
                      shrink: true
                    },
                    variant: 'outlined'
                  }}
                  options={callCampaigns && callCampaigns.map((item) => ({
                    value: item._id, label: item.name
                  }))}
                />
                <div className='el-fillter-report-action mt-24'>
                  {
                    callCampaign &&
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        Thời gian bắt đầu - kết thúc:
                      </Grid>
                      <Grid item xs={6}>
                        <div className = "font-bold el-GridWordWrap">
                          {moment(callCampaign.startTime).format("DD/MM/YYYY") + " - " + moment(callCampaign.endTime).format("DD/MM/YYYY")}
                        </div>
                      </Grid>
                      <Grid item xs={6}>
                        Số điện thoại trong chiến dịch:
                      </Grid>
                      <Grid item xs={6}>
                        <div className = "font-bold el-GridWordWrap">
                          {displayPhones}
                        </div>
                      </Grid>
                    </Grid>
                  }
                </div>

              </div>
              <div className="w-full p-12 el-block-Call el-block-report">
                <Typography className="pl-12 text-15 font-bold mb-10 block-title">THÔNG TIN CÔNG VIỆC:</Typography>
                <TextField
                  className="mt-8 mb-16"
                  error={form.name === '' || form.name === null}
                  required
                  label="Tên công việc"
                  autoFocus
                  id="name"
                  name="name"
                  value={form.name? form.name : ''}
                  onChange={handleChange}
                  onInput = {(e) =>{
                    e.target.value = e.target.value.replace(/[^0-9a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồố&!ộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ,-/.\s]/gi, '')
                  }}
                  variant="outlined"
                  fullWidth
                />
                <TextField
                  className="mt-8 mb-16"
                  label="Mô tả công việc"
                  id="description"
                  name="description"
                  value={form.description? form.description : ''}
                  onChange={handleChange}
                  onInput = {(e) =>{
                    e.target.value = e.target.value.replace(/[^0-9a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồố&!ộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ,-/.\s]/gi, '')
                  }}
                  variant="outlined"
                  fullWidth
                />
                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={viLocale}>
                  <DatePicker
                    disableToolbar
                    className="mt-8 mb-16"
                    variant="inline"
                    label="Ngày bắt đầu"
                    helperText={null}
                    fullWidth
                    autoOk
                    inputVariant="outlined"
                    value={form.startTime ? moment(form.startTime).format("YYYY-MM-DD") : new Date()}
                    onChange={
                      date => {
                        setInForm('startTime', date);
                        (form.deathline === "" || moment(form.deathline).isBefore(date)) ? setInForm('deathline',moment(date).add(1, "days")) : setInForm('deathline', form.deathline)
                      }
                    }
                    format="dd/MM/yyyy"
                  />
                </MuiPickersUtilsProvider>
                <MuiPickersUtilsProvider  utils={DateFnsUtils} locale={viLocale}>
                  <DatePicker
                    disableToolbar
                    className="mt-8 mb-16"
                    variant="inline"
                    helperText={null}
                    fullWidth
                    autoOk
                    label="Ngày hết hạn"
                    inputVariant="outlined"
                    value={form.deathline ? moment(form.deathline).format("YYYY-MM-DD") : new Date()}
                    onChange={
                      date => {
                        setInForm('deathline', date);
                      }
                    }
                    format="dd/MM/yyyy"
                    minDate={moment(form.startTime).add(1, "days")}
                  />
                </MuiPickersUtilsProvider>
                {
                  props.match.params._id ?
                    <div className = 'p-4'>
                      <Typography className="mb-10 block-title">Đối tượng giao việc:</Typography>
                      <Grid container spacing={2} justify="center" alignItems="center" className={classes.root}>
                        <Grid item>{customList(listMemberFilter, 'liststaff')}</Grid>
                        <Grid item>
                          <Grid container direction="column" alignItems="center">
                            <Button
                              variant="outlined"
                              size="small"
                              className={classes.button}
                              onClick={handleCheckedRight}
                              disabled={leftChecked.length === 0}
                              aria-label="move selected right"
                            >
                              Thêm đối tượng giao việc &gt;
                            </Button>
                            <Button
                              variant="outlined"
                              size="small"
                              className={classes.button}
                              onClick={handleCheckedLeft}
                              disabled={rightChecked.length === 0}
                              aria-label="move selected left"
                            >
                              &lt; Xóa đối tượng giao việc
                            </Button>
                          </Grid>
                        </Grid>
                        <Grid item>{customList(assignedMembers, 'members')}</Grid>
                      </Grid>
                    </div>
                  : <div>
                    <FuseChipSelect
                      onChange={(e) => handleChangeMember(e)}
                      placeholder="Chọn đối tượng giao việc"
                      isMulti
                      textFieldProps={{
                          label: 'Đối tượng giao việc (Bắt buộc)',
                        InputLabelProps: {
                            shrink: true
                        },
                          variant: 'outlined'
                      }}
                      options={listMember && listMember.map((item) => ({
                          value: item._id, label: item.base.fullName
                      }))}
                    />
                  </div>
                }
              </div>
            </div>
          }
        />
    )
}
export default AssignmentEdit;
