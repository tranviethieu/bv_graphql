import React, { useState, useEffect } from 'react';
import { Button, TextField, Icon, Tabs, Tab, Typography} from '@material-ui/core';
import { FusePageCarded, FuseAnimate } from '@fuse';
import { useForm } from '@fuse/hooks'
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import { Link } from 'react-router-dom';
import graphqlService from "app/services/graphqlService";
import { showMessage } from "app/store/actions/fuse";
import history from '@history';
import {QUERY_RINGGROUP, MUTATION_SAVE_RINGGROUP, MUTATION_REMOVE_RINGGROUP } from "./query";
import ConfirmDialog from '@fuse/components/Confirm/ConfirmDialog';
export const GET_RINGGROUPS = '[SURVEY APP] GET RINGGROUPS';
export const GET_RINGGROUP = '[SURVEY APP] GET RINGGROUP';
export const SAVE_RINGGROUP = '[SURVEY APP] SAVE RINGGROUP';
export const REMOVE_RINGGROUP = '[SURVEY APP] REMOVE RINGGROUP';

const initialState = {
    name:'',
    phoneCode: '',
    // createdTime: ''
}

const workingTimes = [
]

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

function getRingGroup(_id, dispatch) {
    return graphqlService.query(QUERY_RINGGROUP, { _id }, dispatch);
}
function saveRingGroup(data, dispatch) {
    return graphqlService.mutate(MUTATION_SAVE_RINGGROUP, { data }, dispatch)
        // .then(response =>
        //     Promise.all([
        //         dispatch(showMessage({ message: "Lưu thông tin thành công" }))
        //     ]).then(() => dispatch({
        //         type: SAVE_RINGGROUP,
        //         payload: response.data
        //     })));
}

function removeRingGroup(_id, dispatch) {
  return graphqlService.mutate(MUTATION_REMOVE_RINGGROUP, { _id }, dispatch);
}

export default function EditRingGroup(props) {
    const [confirm, setConfirm] = useState(false);
    const { form, handleChange, setForm } = useForm(initialState);
    const dispatch = useDispatch();
    const classes = useStyles(props);
    const [tabValue, setTabValue] = useState(0);
    function handleChangeTab(tabValue) {
        setTabValue(tabValue);
    }

    workingTimes.push({
        label: "Chọn khung giờ",
        value: ""
    });
    for (var i = 0; i < 24; i++) {
        var label = i < 10 ? `0${i}:00` : `${i}:00`
        workingTimes.push({
            label: label,
            value: label
        });
    }
    useEffect(() => {
        const { _id } = props.match.params;
        switch (_id) {
            case "new":
                break;
            default: {
                //Load data here
                // dispatch(getDepartment(_id, dispatch)).then(response => {
                //     setForm(response.data);
                // });
                getRingGroup(_id).then(response => {
                    setForm(response.data);
                });
            }
        }
    }, [props.match.params, setForm]);

    function handleSubmit() {
        const { name, phoneCode,_id } = form;
        saveRingGroup({ name, phoneCode,_id }).then(response => {
          if (response.code === 0) {
              dispatch(showMessage({ message: "Lưu nhánh tổng đài viên thành công" }))
              history.push("/apps/ring-groups");
          }
        })
      }
    function canBeDeleted() {
        return form._id && form._id.length > 0;
    }
    function canBeSubmitted() {
        return form.name.length > 0 && form.phoneCode.length>0;
    }
    function onDelete() {
      removeRingGroup(form._id).then(response => {
        dispatch(showMessage({ message: "Xóa nhánh tổng đài viên thành công" }))
        history.push("/apps/ring-groups");
      })
      setConfirm(false);
    }

    return (
        <FusePageCarded
          classes={{
            header: "min-h-144 h-144 sm:h-136 sm:min-h-136",
            toolbar: "p-0",
            content: classes.content,
          }}
          header={
            form && (
              <div className="flex flex-1 w-full items-center justify-between el-HeaderPageEdit">
                <div className="flex flex-col items-start max-w-full el-HeaderLeft">
                  <FuseAnimate animation="transition.slideRightIn" delay={300}>
                    <Typography className="normal-case flex items-center sm:mb-12 text-white" component={Link} role="button" to="/apps/ring-groups" color="inherit">
                      <Icon className="mr-4 text-20">arrow_back</Icon>
                      Quản lý nhánh tổng đài viên
                    </Typography>
                  </FuseAnimate>
                  {/* <input
                    accept="image/*"
                    className="hidden"
                    id="button-file"
                    type="file"
                    onChange={handleUploadChange}
                  /> */}

                  <div className="flex items-center max-w-full">
                    {/* <FuseAnimate animation="transition.expandIn" delay={300}>

                      <label
                        htmlFor="button-file"
                      >
                        {form.photoId ? (
                      <img className="w-32 sm:w-48 mr-8 sm:mr-16 rounded" src={process.env.REACT_APP_FILE_PREVIEW_URL + form.photoId} alt={form.name} />
                        ) : (
                      <img className="w-32 sm:w-48 mr-8 sm:mr-16 rounded" src="assets/images/ecommerce/product-image-placeholder.png" alt={form.name} />
                        )}
                      </label>

                    </FuseAnimate> */}
                    <div className="flex flex-col min-w-0">
                      <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                        <Typography className="text-16 sm:text-20 truncate">
                          {form.title ? form.title : 'Tạo nhánh tổng đài mới'}
                        </Typography>
                      </FuseAnimate>
                      <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                        <Typography variant="caption">Thông tin nhánh tổng đài</Typography>
                      </FuseAnimate>
                    </div>
                  </div>
                </div>
                <div className = "el-HeaderRight">
                  <FuseAnimate animation="transition.slideRightIn" delay={300}>
                    <Button
                      className="whitespace-no-wrap"
                      variant="contained"
                      color="default"
                      disabled={!canBeDeleted()}
                      onClick={() => setConfirm(true)}
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
                      Lưu thông tin
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
                title="Xóa nhánh tổng đài viên?"
                open={confirm}
                onClose={() => setConfirm(false)}
                onSubmit={onDelete}
                message="Bạn có chắc chắn muốn xóa nhánh tổng đài viên hiện tại"
                count={5}
              />
              {form && tabValue === 0 &&
                <div>
                  <TextField
                    className="mt-8 mb-16"
                    error={form.name === ''}
                    required
                    label="Tên nhánh tổng đài viên"
                    autoFocus
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    variant="outlined"
                    fullWidth
                  />
                  <TextField
                    className="mt-8 mb-16"
                    error={form.phoneCode === ''}
                    required
                    label="Đầu số (phải giống đầu số cấu hình trong PBX)"
                    id="phoneCode"
                    name="phoneCode"
                    onInput = {(e) =>{
                      e.target.value = e.target.value.replace(/[^0-9\s]/gi, '')
                    }}
                    value={form.phoneCode}
                    onChange={handleChange}
                    variant="outlined"
                    fullWidth
                  />
                  {/* <TextField
                    className="mt-8 mb-16"
                    label="Ngày tạo"

                    id="createdTime"
                    name="createdTime"
                    value={form.createdTime}
                    onChange={handleChange}
                    variant="outlined"
                    fullWidth
                  /> */}
                </div>
              }
              {
                form && tabValue === 1 &&
                <div>

                </div>
              }
            </div>
          }

        />
    )
}


// export default withReducer("surveysApp", reducer)(EditSite);
