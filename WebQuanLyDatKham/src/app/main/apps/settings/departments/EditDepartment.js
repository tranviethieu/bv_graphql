import React, { useState, useEffect } from 'react';
import { Button, TextField, Icon, Tabs, Tab, Typography, FormControlLabel, Switch, FormControl, InputLabel, NativeSelect } from '@material-ui/core';
import { FusePageCarded, FuseAnimate } from '@fuse';
import { useForm } from '@fuse/hooks'
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import { Link } from 'react-router-dom';
import graphqlService from "app/services/graphqlService";
import history from '@history';
import { showMessage } from "app/store/actions/fuse";
import ConfirmDialog from '@fuse/components/Confirm/ConfirmDialog';
import { QUERY_DEPARTMENT, MUTATION_SAVE_DEPARTMENT, MUTATION_REMOVE_DEPARTMENT, QUERY_ROOT_DEPARTMENTS } from "./query";
import { FuseChipSelect } from "@fuse";
// import withReducer from 'app/store/withReducer';
// import { log } from 'util';

import DaySetting from './components/DaySetting';
export const SAVE_DEPARTMENT = '[DEPARTMENT APP] SAVE SURVEY';
const defaultTimeFrame = process.env.REACT_APP_DEFAULT_TIME_FRAME.split(',');

const initialState = {
  name: '',
  description: '',
  code:'',
  status: false,
  servingTimes: [
    { dayOfWeek: "MONDAY", maxProcess: 4, timeFrame: defaultTimeFrame },
    { dayOfWeek: "TUESDAY", maxProcess: 4, timeFrame: defaultTimeFrame },
    { dayOfWeek: "WEDNESDAY", maxProcess: 4, timeFrame: defaultTimeFrame },
    { dayOfWeek: "THURSDAY", maxProcess: 4, timeFrame: defaultTimeFrame},
    { dayOfWeek: "FRIDAY", maxProcess: 4, timeFrame: defaultTimeFrame },
    { dayOfWeek: "SATURDAY", maxProcess: 4 },
    { dayOfWeek: "SUNDAY", maxProcess: 4 }],
}


const useStyles = makeStyles(theme => ({
  content: {
    '& canvas': {
      maxHeight: '100%'
    }
  },
  productImageUpload: {
    transitionProperty: 'box-shadow',
    transitionDuration: theme.transitions.duration.short,
    transitionTimingFunction: theme.transitions.easing.easeInOut,
  },
  productImageItem: {
    transitionProperty: 'box-shadow',
    transitionDuration: theme.transitions.duration.short,
    transitionTimingFunction: theme.transitions.easing.easeInOut,
    '&:hover': {
      '& $productImageFeaturedStar': {
        opacity: .8
      }
    },
    '&.featured': {
      pointerEvents: 'none',
      boxShadow: theme.shadows[3],
      '& $productImageFeaturedStar': {
        opacity: 1
      },
      '&:hover $productImageFeaturedStar': {
        opacity: 1
      }
    }
  }
}));


function getDepartment(_id, dispatch) {
  return graphqlService.query(QUERY_DEPARTMENT, { _id }, dispatch);
}
function saveDepartment(data, dispatch) {
  return graphqlService.mutate(MUTATION_SAVE_DEPARTMENT, { data }, dispatch);

}
function getRootDepartment(dispatch) {
  return graphqlService.query(QUERY_ROOT_DEPARTMENTS, {}, dispatch);
}
function removeDepartment(_id, dispatch) {
  return graphqlService.mutate(MUTATION_REMOVE_DEPARTMENT, { _id }, dispatch);
}

export default function EditDepartment(props) {
  const { form, handleChange, setForm, setInForm } = useForm(initialState);
  const dispatch = useDispatch();
  const classes = useStyles(props);
  const [confirm, setConfirm] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  // const [workingTimes, setWorkingTimes] = useState([]);
  //khoa phòng gốc từ hệ thống tổng
  const [departments, setDepartments] = useState([]);
  function handleChangeTab(tabValue) {
    setTabValue(tabValue);
  }
  function onDelete() {
    removeDepartment(form._id).then(response => {
      dispatch(showMessage({ message: "Xóa Khoa khám thành công" }))
      history.push("/apps/departments");
    })
    setConfirm(false);
  }
  useEffect(() => {
    getRootDepartment(dispatch).then(result => {
      setDepartments(result.data);
    })
  }, []);
  useEffect(() => {

    if (form._id) {

      getDepartment(form._id, dispatch).then(response => {
        if (response.data.servingTimes)
          response.data.servingTimes = initialState.servingTimes.map(item => {
            const check = response.data.servingTimes.find(d => d.dayOfWeek === item.dayOfWeek);
            return check || item;
          })
        else
          response.data.servingTimes = initialState.servingTimes;
        // console.log("data=", response.data);
        setForm(response.data);
        setInForm('description', '')
      });
    }
  }, [form._id]);

  useEffect(() => {
    const { _id } = props.match.params;
    switch (_id) {
      case "new":
        break;
      default: {
        setForm({...form, _id });
      }
    }
  }, [dispatch, props.match.params, setForm]);

  function handleSubmit() {
    saveDepartment(form).then(response => {
      if (response.code === 0) {
        dispatch(showMessage({ message: "Lưu Khoa khám thành công" }))
        history.push("/apps/departments");
      }
    })
  }

  function canBeDeleted() {
    return form._id && form._id.length > 0;
  }
  function canBeSubmitted() {
    //form._id&&
    return form.name&&form.name.length > 0;
  }

  function handleServingTimeChange(value, index) {
    setInForm(`servingTimes[${index}]`, value);
  }

  const divStyle = {
    padding: '15px',
    border: '1px solid #ededed',
    background: '#ededed',
  };

  return (
    <FusePageCarded
      classes={{
        header: "min-h-144 h-144 sm:h-136 sm:min-h-136",
        toolbar: "p-0",
        content: classes.content,
      }}
      header={
        form && (
          <div className="flex flex-1 w-full items-center justify-between el-HeaderPage">
            <div className="flex flex-col items-start max-w-full el-HeaderLeft">
              <FuseAnimate animation="transition.slideRightIn" delay={300}>
                <Typography className="normal-case flex items-center sm:mb-12 el-TitleIcon" component={Link} role="button" to="/apps/departments" color="inherit">
                  <Icon className="mr-4 text-20 el-TitleIcon">arrow_back</Icon>
                  Quản lý khoa khám
                </Typography>
              </FuseAnimate>

              <div className="flex items-center max-w-full">

                <div className="flex flex-col min-w-0">
                  <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                    <Typography className="text-16 sm:text-20 truncate">
                      {form.title ? form.title : 'Tạo khoa khám mới'}
                    </Typography>
                  </FuseAnimate>
                  <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                    <Typography variant="caption">Thông tin khoa khám</Typography>
                  </FuseAnimate>
                </div>
              </div>
            </div>
            <div className="el-HeaderRight">
              <FuseAnimate animation="transition.slideRightIn" delay={300}>
                <Button
                  className="whitespace-no-wrap btn-red"
                  variant="contained"
                  disabled={!canBeDeleted()}
                  onClick={e => setConfirm(true)}
                >
                  <Icon className="mr-4 text-20">delete</Icon> Xóa
                </Button>
              </FuseAnimate>
              {" "}
              <FuseAnimate animation="transition.slideRightIn" delay={300}>
                <Button
                  className="whitespace-no-wrap"
                  variant="contained"
                  color="secondary"
                  disabled={!canBeSubmitted()}
                  onClick={() => handleSubmit()}
                >
                  Lưu khoa khám
                </Button>
              </FuseAnimate>
            </div>
          </div>
        )
      }
      contentToolbar={
        <Tabs
          value={tabValue}
          onChange={(e, tabValue) => handleChangeTab(tabValue)}
          indicatorColor="secondary"
          textColor="secondary"
          variant="scrollable"
          scrollButtons="auto"
          classes={{ root: "w-full h-64" }}
          className="el-toolBar"
        >
          <Tab className="h-64 normal-case" label="Thông tin cơ bản" />
        </Tabs>
      }
      content={
        <div className="p-24 bg-white el-CoverForm">
          <ConfirmDialog
            title="Xóa khoa khám?"
            open={confirm}
            onClose={() => setConfirm(false)}
            onSubmit={onDelete}
            message="Bạn có chắc chắn muốn xóa khoa khám hiện tại"
            count={5}
          />
          {
            form &&
            <div>
              <FuseChipSelect
                margin="dense"
                className="mt-8 mb-24"
                name="_id"
                value={departments.map((n) => ({
                  value: n._id,
                  label: n.name,
                })).find(
                  (d) => d.value === form._id
                )}
                style={{ height: 20 }}
                onChange={val=>setInForm('_id',val.value)}
                textFieldProps={{
                  label: "Chọn phòng ban từ hệ thống",
                  InputLabelProps: {
                    shrink: true,
                  },
                  variant: "outlined",
                }}
                options={departments.map((n) => ({
                  value: n._id,
                  label: n.name,
                }))}
              />
              {/* <FormControl variant="containted" className="w-full">
                <InputLabel>Chọn phòng ban từ hệ thống</InputLabel>
                <NativeSelect
                  className="mt-8 mb-16"
                  label="Phòng/khoa khám"
                  margin="dense"
                  name="_id"
                  value={form._id}
                  onChange={handleChange}
                  fullWidth
                  defaultValue="url"
                >
                  <option value="DEFAULT">Cơ bản</option>
                  {
                    departments.map((item, index) => <option key={index} value={item._id}>
                      {item.name}
                    </option>)
                  }
                </NativeSelect>

              </FormControl> */}
              <TextField
                className="mt-8 mb-16"
                error={form.name === ''}
                required
                label="Tên khoa khám"
                autoFocus
                id="name"
                name="name"
                value={form.name||''}
                onChange={handleChange}
                variant="outlined"
                fullWidth
              />
              <TextField
                className="mt-8 mb-16"
                error={form.name === ''}
                required
                label="Mã khoa khám"
                autoFocus
                disabled
                id="code"
                name="code"
                value={form.code||''}
                onChange={handleChange}
                variant="outlined"
                fullWidth
              />
              <TextField
                className="mt-8 mb-16"
                label="Mô tả"

                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                variant="outlined"
                fullWidth
              />
              <FormControlLabel
                value="form.status"
                label="Trạng thái"
                control={
                  <Switch
                    checked={form.status}
                    onChange={e=>setInForm('status',e.target.checked)}
                    color="primary"
                  />
                }
                labelPlacement="start"
              />


              <Typography className="mt-24 mb-5" variant="h5">Chọn thời gian phục vụ</Typography >

                <div style={divStyle}>
                  {
                    form.servingTimes && form.servingTimes.map((item, index) => <DaySetting key={index}
                    {...item}
                    onListItemChange={(value, index) => handleServingTimeChange(value, index)}
                    index={index}
                  />)
                }

              </div>

            </div>
          }
        </div>
      }

    />
  )
}


// export default withReducer("surveysApp", reducer)(EditSite);
