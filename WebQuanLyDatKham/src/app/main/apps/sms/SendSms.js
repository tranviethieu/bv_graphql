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
// import { uploadFile } from 'app/store/actions';
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
    phone_numbers: '',
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
    const [stringPhoneFromExcel, setStringPhoneFromExcel] = useState('');
    const classes = useStyles(props);

    useEffect(()=>{
      setForm(initialState)
    }, [])
    function handleChipInputType(value, name) {
        if (value.value === 0) {
            setIsInputFromExcel(false)
        } else {
            setIsInputFromExcel(true)
        }
    }
    function handleChipChangeSMSCampaign(value, name) {
        setForm(_.set({ ...form }, name, value));
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
            var tmpStringPhones = '';
            for(var i=0;i<answer_array.length;i++){
                var tmpItem = answer_array[i];

                if(validatePhoneNumber(tmpItem)){
                    tmpStringPhones +=  tmpItem.trim() + ','
                }else{
                    console.log(" ==> INValid phone number");
                }

            }
            tmpStringPhones = tmpStringPhones.replace(/,\s*$/, "");
            form.phone_numbers = tmpStringPhones;
            setStringPhoneFromExcel(tmpStringPhones);

        };
        reader.readAsBinaryString(file);

    }

    function getAllSMSCampaigns() {
        return graphqlService.query(QUERY_SMSCAMPAIGNS, {}, dispatch);
    }

    function handleSubmit() {
        console.log("### handleSubmit")
        // if(isInputFromExcel === true && stringPhoneFromExcel && stringPhoneFromExcel.length > 0){
        //     const phone_array = stringPhoneFromExcel.split(',');
        //     console.log("phone excel", phone_array);
        //     console.log(form.phone_number);
        //     // sendSMS({phone_number: form.phone_number, message: form.message, campaign_id: form.campaign_id.value});
        //     // graphqlService.mutate(MUTATION_SEND_SMSMULTI, { phone_numbers: phone_array, message: form.message, campaign_id: form.campaign_id.value }, dispatch).then(response =>
        //     //     Promise.all([
        //     //         dispatch(showMessage({ message: "Gửi tin nhắn thành công" }))
        //     //     ]));
        // }else{
          const phone_array2 = form.phone_numbers.split(',');
            graphqlService.mutate(MUTATION_SEND_SMSMULTI, { phone_numbers: phone_array2, message: form.message, campaign_id: form.campaign_id.value }, dispatch).then(response =>
                Promise.all([
                    dispatch(showMessage({ message: "Gửi tin nhắn thành công" }))
                ]));
        // }
    }

    return (
        <FusePageSimple
          classes={{
            header: "min-h-144 h-144 sm:h-136 sm:min-h-136",
            toolbar: "p-0"
          }}
          header={
            form && (
              <div className="flex flex-1 w-full items-center justify-between p-24 el-HeaderPage">
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

                  value = { isInputFromExcel === true ? { value: 1, label: "Nhập số điện thoại từ file excel" } : { value: 0, label: "Nhập số điện thoại người nhận" }}
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
                  </div>
                : <div></div>
                }
                <TextField
                  className="mt-8 mb-16"
                  required
                  error={form.phone_numbers === ''}
                  // required
                  label="Nhập SĐT người nhận (cách nhau bởi dấu phẩy)"
                  autoFocus
                  id="phone_numbers"
                  name="phone_numbers"
                  value={form.phone_numbers}
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
