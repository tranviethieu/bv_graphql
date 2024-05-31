import React, { useState, useEffect, Fragment } from 'react';
import { FusePageSimple, FuseChipSelect } from '@fuse';
import { useForm } from '@fuse/hooks'
import { useDispatch } from 'react-redux';
// import { Link } from 'react-router-dom';
import { showMessage } from "app/store/actions/fuse";
import _ from 'lodash';
import graphqlService from "app/services/graphqlService";
import { Button,TextField, Icon, Typography} from '@material-ui/core';

import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
// import { uploadAvatar } from 'app/store/actions';
import XLSX from 'xlsx';

import { MUTATION_SEND_SMS, QUERY_SMSCAMPAIGNS, MUTATION_SEND_SMSMULTI } from "./query";

const useStyles = makeStyles(theme => ({
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
        }
    }
}));

const initRingGroupsData = [{ value: 0, label: "Nhập số điện thoại người nhận" }, { value: 1, label: "Nhập số điện thoại từ file excel" }]

const initialState = {
    phone_number: '',
    message: '',
    campaign_id: '',
    image: null
}

function SmsSend(props) {
    const { form, handleChange, setForm, setInForm } = useForm(initialState);
    const dispatch = useDispatch();
    const [SMSCampaignsData, setSMSCampaignData] = useState([]);
    const [isInputFromExcel, setIsInputFromExcel] = useState(false);
    const [ringGroupsData, setRingGroupsData] = useState(initRingGroupsData);
    // const [arrPhoneFromExcel, setArrPhoneFromExcel] = useState([]);
    const [stringPhoneFromExcel, setStringPhoneFromExcel] = useState('');
    const classes = useStyles(props);

    // function handleChipChange(value, name) {
    //     setForm(_.set({ ...form }, name, value));
    // }
    function handleChipInputType(value, name) {
        // setForm(_.set({...form}, name, value));
        console.log("handleChipInputType value: ", value)
        if (value.value === 0) {
            setIsInputFromExcel(false)
        } else {
            setIsInputFromExcel(true)
        }
    }
    function handleChipChangeSMSCampaign(value, name) {
        setForm(_.set({ ...form }, name, value));
        // setForm(_.set({ ...form }, name, value.map(item => item.value)));
        // setForm(_.set({...form}, name, value.map(item => item.value)));
    }

    useEffect(() => {
        getAllSMSCampaigns(dispatch).then(response => {
            setSMSCampaignData(response.data);
        });
    }, [dispatch]);

    function canBeSave() {
        return (
            form && form.campaign_id && form.message
        )
    }

    function removePollImage() {
        setInForm('image', null);
    }
    function validatePhoneNumber(phone) {
        const regex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
        return regex.test(phone)
    }

    function handleUploadPollImage(e) {
        setStringPhoneFromExcel('');

        const file = e.target.files[0];
        console.log("File uploaded: ", e.target.files)
        if (!file) {
            return;
        }

        // var name = file.name;
        const reader = new FileReader();
        reader.onload = (evt) => { // evt = on_file_select event
            /* Parse data */
            const bstr = evt.target.result;
            const wb = XLSX.read(bstr, {type:'binary'});
            /* Get first worksheet */
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            /* Convert array of arrays */
            const data = XLSX.utils.sheet_to_csv(ws, {header:1});
            /* Update state */
            const answer_array = data.split('\n');
            // console.log("Data>>>"+data);
            var tmpStringPhones = '';
            for(var i=0;i<answer_array.length;i++){
                var tmpItem = answer_array[i];

                if(validatePhoneNumber(tmpItem)){
                    console.log(tmpItem, " ==> Valid phone number");
                    // arrPhoneFromExcel.push(tmpItem);
                    // setArrPhoneFromExcel([...arrPhoneFromExcel, tmpItem]);
                    tmpStringPhones +=  tmpItem.trim() + ','
                }else{
                    console.log(" ==> INValid phone number");
                }

            }
            tmpStringPhones = tmpStringPhones.replace(/,\s*$/, "");
            form.phone_number = tmpStringPhones;
            setStringPhoneFromExcel(tmpStringPhones);
            console.log(" arrStringPhoneFromExcel length: ", stringPhoneFromExcel);
            // for(var i=0;i<arrPhoneFromExcel.length;i++){
                console.log(stringPhoneFromExcel, " 1111 ==> Valid phone number");
            // }

        };
        reader.readAsBinaryString(file);

    }

    function getAllSMSCampaigns() {
        return graphqlService.query(QUERY_SMSCAMPAIGNS, {}, dispatch);
    }
    // function sendSMS(data) {
    //     //  (dispatch) =>
    //     graphqlService.mutate(MUTATION_SEND_SMS, { data }, dispatch).then(response =>
    //         Promise.all([
    //             dispatch(showMessage({ message: "Gửi tin nhắn thành công" }))
    //         ]).then(() => dispatch({
    //             // type: SAVE_SMSCAMPAIGN,
    //             // payload: response.data
    //         })));
    // }

    function handleSubmit() {
        console.log("### handleSubmit")
        if(isInputFromExcel === true && stringPhoneFromExcel && stringPhoneFromExcel.length > 0){
            console.log("### handleSubmit stringPhoneFromExcel ",stringPhoneFromExcel)
            const phone_array = stringPhoneFromExcel.split(',');
            for(var i=0;i<phone_array.length;i++){
                console.log("PHone number: ", i, ": ", phone_array[i]);
            }
            // sendSMS({phone_number: form.phone_number, message: form.message, campaign_id: form.campaign_id.value});
            graphqlService.mutate(MUTATION_SEND_SMSMULTI, { phone_numbers: phone_array, message: form.message, campaign_id: form.campaign_id.value }, dispatch).then(response =>
                Promise.all([
                    dispatch(showMessage({ message: "Gửi tin nhắn thành công" }))
                ]));
        }else{
            // sendSMS({phone_number: form.phone_number, message: form.message, campaign_id: form.campaign_id.value});
            graphqlService.mutate(MUTATION_SEND_SMS, { phone_number: form.phone_number, message: form.message, campaign_id: form.campaign_id.value }, dispatch).then(response =>
                Promise.all([
                    dispatch(showMessage({ message: "Gửi tin nhắn thành công" }))
                ]));
        }
    }

    return (
        <FusePageSimple
          classes={{
            header: "min-h-144 h-144 sm:h-136 sm:min-h-136",
            toolbar: "p-0"
          }}
          header={
            form && (
              <div className="flex flex-1 w-full items-center justify-between p-24 el-HeaderPageSendSMS">
                <div className="flex flex-col">
                  <Typography variant="h6">Gửi tin nhắn SMS</Typography>
                </div>
              </div>
            )
          }
          content={
            <div className="p-24 bg-white" id = "el-sendSMS-content">
              <div>

                <FuseChipSelect
                  className="mt-8 mb-16"
                  required
                  options={
                    SMSCampaignsData && SMSCampaignsData.map(item => ({
                      value: item._id,
                      label: item.name
                    }))
                  }
                  onChange={(value) => handleChipChangeSMSCampaign(value, 'campaign_id')}
                  placeholder="Chọn chiến dịch SMS"
                  textFieldProps={{
                    label: "Chọn chiến dịch SMS",
                    InputLabelProps: {
                      shrink: true
                    },
                    variant: 'outlined'
                  }}

                />
                <FuseChipSelect
                  className="mt-8 mb-16"
                  options={
                    ringGroupsData && ringGroupsData.map(item => ({
                      value: item.value,
                      label: item.label
                    }))
                  }
                  value={
                    ringGroupsData
                  }
                  onChange={(value) => handleChipInputType(value, 'ringGroups')}
                  placeholder="Chọn hình thức nhập số điện thoại"
                  textFieldProps={{
                    label: 'Chọn hình thức nhập số điện thoại',
                    InputLabelProps: {
                      shrink: true
                    },
                    variant: 'outlined'
                  }}

                />
                {isInputFromExcel ?
                  <div>
                    Chọn file excel chứa danh sách số điện thoại
                    <Fragment>
                      <input
                        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        className="hidden"
                        id="button-file"
                        type="file"
                        onChange={handleUploadPollImage}
                      />
                      {
                        form.image === null ? <label
                          htmlFor="button-file"
                          className={
                            clsx(
                              classes.productImageUpload,
                              "flex items-center justify-center relative w-48 h-48 rounded-4 mr-16 overflow-hidden cursor-pointer shadow-1 hover:shadow-5"
                            )}
                                              >

                          <Icon fontSize="large" color="action">cloud_upload</Icon>
                        </label> : <img onClick={removePollImage} className="max-w-none w-auto w-48 h-48" src={process.env.REACT_APP_FILE_PREVIEW_URL + form.image} alt="product" />
                      }

                    </Fragment>
                    {/* <input
                      accept="image/*"
                      className="hidden"
                      id={form.value}
                      type="file"
                      onChange={handleUploadPollImage}
                      />
                      {
                      form.image == null ? <label
                      htmlFor={form.value}
                      className={
                      clsx(
                      classes.productImageUpload,
                      "flex items-center justify-center relative w-48 h-48 rounded-4 mr-16 overflow-hidden cursor-pointer shadow-1 hover:shadow-5"
                      )}
                      >

                      <Icon fontSize="large" color="action">cloud_upload</Icon>
                      </label> : <img onClick={removePollImage} className="max-w-none w-auto w-48 h-48" src={process.env.REACT_APP_FILE_PREVIEW_URL + form.image} alt="product" />
                    } */}
                  </div>
                : <div></div>
                }
                <TextField
                  className="mt-8 mb-16"
                  required
                  error={form.phone_number === ''}
                  // required
                  label="Nhập SĐT người nhận (cách nhau bởi dấu phẩy)"
                  autoFocus
                  id="phone_number"
                  name="phone_number"
                  value={form.phone_number}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                />
                <TextField
                  className="mt-8 mb-16"
                  error={form.message === ''}
                  required
                  label="Nhập nội dung tin nhắn"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  variant="outlined"
                  multiline
                  rows="4"
                  fullWidth
                />
                <Button variant="contained" color="primary" onClick={handleSubmit} disabled={!canBeSave()}>
                  Gửi tin nhắn
                </Button>
              </div>
            </div>
          }
        />
    )
}
export default SmsSend;
