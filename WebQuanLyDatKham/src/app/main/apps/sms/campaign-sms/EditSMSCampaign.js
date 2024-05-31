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
import { QUERY_SMSCAMPAIGN, MUTATION_SAVE_SMSCAMPAIGN, MUTATION_REMOVE_SMSCAMPAIGN } from "../query";
import ConfirmDialog from '@fuse/components/Confirm/ConfirmDialog';

// import DaySetting from './components/DaySetting';

export const GET_SMSCAMPAIGNS = '[SURVEY APP] GET SMSCAMPAIGNS';
export const GET_SMSCAMPAIGN = '[SURVEY APP] GET SMSCAMPAIGN';
export const SAVE_SMSCAMPAIGN = '[SURVEY APP] SAVE SMSCAMPAIGN';
export const REMOVE_SMSCAMPAIGN = '[SURVEY APP] REMOVE SMSCAMPAIGN';

const initialState = {
    _id: '',
    name: '',
    description: '',
    content: '',
    priority: 0,
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

function getSMSCampaign(_id, dispatch) {
    return graphqlService.query(QUERY_SMSCAMPAIGN, { _id }, dispatch);
}
function saveSMSCampaign(data, dispatch) {
  return graphqlService.mutate(MUTATION_SAVE_SMSCAMPAIGN, { data }, dispatch);
}



export default function EditSMSCampaign(props) {
    const { form, handleChange, setForm } = useForm(initialState);
    const dispatch = useDispatch();
    const classes = useStyles(props);
    const [tabValue, setTabValue] = useState(0);
    const [confirm, setConfirm] = useState(false);

    function handleChangeTab(tabValue) {
        setTabValue(tabValue);
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
                getSMSCampaign(_id, dispatch).then(response => {
                    setForm(response.data);
                });
            }
        }
        // fetchDataQuestions();
        // dispatch(getProviders());
    }, [dispatch, props.match.params, setForm]);

    function handleSubmit() {
      saveSMSCampaign(form).then(response => {
        if (response.code === 0) {
          dispatch(showMessage({ message: "Lưu chiến dịch SMS thành công" }))
          history.push("/apps/sms/campaign-sms")
        }
      })
    }
    function removeSMSCampaign(_id) {
        graphqlService.mutate(MUTATION_REMOVE_SMSCAMPAIGN, { _id } , dispatch).then(response => {
            dispatch(showMessage({ message: "Xóa thành công" }));
            history.push("/apps/sms/campaign-sms")
        });
        setConfirm(false);
    }
    function canBeDeleted() {
        return form._id && form._id.length > 0;
    }
    function canBeSubmitted() {
        return form.name.length > 0;
    }

    return (
        <FusePageCarded
          id = "el-EditSMSCampaign"
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
                    <Typography className="normal-case flex items-center sm:mb-12 el-TitleIcon" component={Link} role="button" to="/apps/sms/campaign-sms" color="inherit">
                      <Icon className="mr-4 text-20 el-TitleIcon">arrow_back</Icon>
                      Quản lý Chiến dịch SMS
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
                          {form.title ? form.title : 'Tạo chiến dịch SMS mới'}
                        </Typography>
                      </FuseAnimate>
                      <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                        <Typography variant="caption">{form.name ? form.name : 'Tạo chiến dịch SMS'}</Typography>
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
                      Lưu chiến dịch
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
              {/* <Tab className="h-64 normal-case" label="Thêm" /> */}
            </Tabs>
          }
          content={
            <div className="p-24 bg-white" id = "el-EditSMSCampaign-Cover">
              <ConfirmDialog
                title="Xóa chiến dịch SMS?"
                open={confirm}
                onClose={() => setConfirm(false)}
                onSubmit={()=>removeSMSCampaign(form._id)}
                message="Bạn có chắc chắn muốn xóa chiến dịch SMS hiện tại"
                count={5}
              />
              {form && tabValue === 0 &&
                <div>
                  <TextField
                    className="mt-8 mb-16"
                    error={form.name === ''}
                    required
                    label="Tên chiến dịch SMS"
                    autoFocus
                    id="name"
                    name="name"
                    value={form.name}
                    onInput = {(e) =>{
                      e.target.value = e.target.value.replace(/[^0-9a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồố&!ộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ,-/.\s]/gi, '')
                    }}
                    onChange={handleChange}
                    variant="outlined"
                    fullWidth
                  />
                  <TextField
                    className="mt-8 mb-16"
                    label="Nội dung"
                    name="content"
                    value={form.content}
                    onChange={handleChange}
                    variant="outlined"
                    fullWidth
                  />
                  <TextField
                    className="mt-8 mb-16"
                    label="Mô tả"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    variant="outlined"
                    fullWidth
                  />
                  <TextField
                    className="mt-8 mb-16"
                    label="Thứ tự hiển thị"
                    onInput = {(e) =>{
                      e.target.value = e.target.value.replace(/[^0-9\s]/gi, '')
                    }}
                    id="priority"
                    name="priority"
                    value={form.priority}
                    onChange={handleChange}
                    variant="outlined"
                    fullWidth
                  />
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
