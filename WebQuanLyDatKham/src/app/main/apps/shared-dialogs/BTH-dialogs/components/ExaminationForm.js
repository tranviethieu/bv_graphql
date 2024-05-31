import React, { useState} from 'react';
import { TextField, Typography, FormLabel, Box, Icon, Checkbox } from '@material-ui/core';
import {useForm, useUpdateEffect } from '@fuse/hooks';
import clsx from 'clsx';
import { FuseChipSelect } from '@fuse';
import { makeStyles } from '@material-ui/core/styles';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import viLocale from "date-fns/locale/vi";
import moment from 'moment';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import { uploadFile } from 'app/store/actions';
import IconClose from '@material-ui/icons/Close'

const useStyles = makeStyles(theme => ({
    imageTypeRootStyle: {
        backgroundColor:"transparent",
        width:"auto",
        border:"none",
        '& img': {
            border: 'none',
        },
    }
}));
const today = new Date();
const tomorrow = moment(today).add(1, 'days').format('YYYY-MM-DD')
const reExamTimes=[];
for (var i = 0; i < 24; i++) {
    var label = i < 10 ? `0${i}:00` : `${i}:00`
    reExamTimes.push({
        label: label,
        value: label
    });
}

function ExaminationForm(props) {
    const classes = useStyles(props);
    const { onExaminationChange, examination } = props;
    const { form, handleChange, setInForm } = useForm(examination);
    const [openLightBox, setOpenLightBox] = useState(false)
    const [currentImage, setCurrentImage] = useState("");
    function handleUploadImage(e) {
        const file = e.target.files[0];
        if (!file) {
            return;
        }
        uploadFile(file).then(response => {
            if (response.data) {
                setInForm(`images`, [...form.images, response.data])
            }
        });
    }
    function removeImage(index) {
        form.images.splice(index, 1);
        setInForm(`images`, form.images);
    }
    useUpdateEffect(() => {
        onExaminationChange(form);
    }, [form, onExaminationChange]);

    return (
        <div className = "el-coverExamninationForm">
          <Typography className="text-17 p-4">Kết quả khám</Typography>
          <div>
            <div className="md:w-full sm:w-full p-4">
              <TextField
                className="mt-8 mb-16"
                error={form.conclusion === ''|| !form.conclusion}
                required
                margin = "dense"
                label="Kết luận của bác sỹ"
                id="conclusion"
                name="conclusion"
                value={form.conclusion || ''}
                onChange={handleChange}
                variant="outlined"
                fullWidth
              />
            </div>
            <div className="md:w-full sm:w-full p-4">
              <TextField
                className="mt-8 mb-16"
                margin = "dense"
                label="Ghi chú của bác sĩ"
                id="note"
                name="note"
                value={form.note || ''}
                onChange={handleChange}
                variant="outlined"
                fullWidth
              />
            </div>
            <div className="pt-4 pb-4 pl-4">
              <FormLabel className="pb-2">Hình ảnh kết quả khám</FormLabel>
              <div className = "flex flex-wrap">
                <React.Fragment>
                  <input
                    accept="image/*"
                    className="hidden"
                    id="examination"
                    type="file"
                    onChange={e =>handleUploadImage(e)}
                  />
                  <label
                    htmlFor="examination"
                    className={
                      clsx(
                        classes.productImageUpload,
                        "flex items-center justify-center relative w-48 h-48 rounded-4 mr-16 overflow-hidden cursor-pointer shadow-1 hover:shadow-5"
                      )}
                  >

                    <Icon fontSize="large" color="action">cloud_upload</Icon>
                  </label>
                  {
                    form.images.length > 0 && form.images.map((item, index)=>
                      <Box className={
                        clsx(
                          classes.productImageUpload,
                          "flex items-center justify-center relative w-48 h-48 rounded-4 mr-16 overflow-hidden cursor-pointer shadow-1 hover:shadow-5"
                        )} >
                        <Box position ="absolute" right = "0px" top='0px' width='16px' height='16px' bgcolor='#fff' borderRadius='50px'  onClick={()=>removeImage(index)} >
                          <IconClose fontSize = "inherit"/>
                        </Box>
                        <img src={process.env.REACT_APP_FILE_PREVIEW_URL + item} onClick={()=>{setOpenLightBox(true); setCurrentImage(item)}} alt="" />
                      </Box>
                    )
                  }
                  {openLightBox &&
                    <Lightbox
                      className = "el-Lightbox"
                      mainSrc={process.env.REACT_APP_FILE_PREVIEW_URL + currentImage}
                      onCloseRequest={() => setOpenLightBox(false)}
                    />}
                </React.Fragment>
              </div>
            </div>
            <div className="md:w-full sm:w-full">
              <Checkbox
                checked={form.reExamination}
                onChange={e => { setInForm('reExamination', e.target.checked) }}
              />
              <label>Khám lại</label>
            </div>
            {
                form.reExamination === true &&
              <div className="flex flex-wrap">
                <div className="md:w-1/2 sm:w-1/2 p-4">
                  <MuiPickersUtilsProvider utils={DateFnsUtils} locale={viLocale}>
                    <KeyboardDatePicker
                      disableToolbar
                      fullWidth
                      className="mt-8 mb-16"
                      autoOk
                      label = "Chọn ngày khám lại"
                      variant="inline"
                      inputVariant="outlined"
                      value={moment(form.reExaminiationDate).format("YYYY-MM-DD")}
                      onChange={e => setInForm('reExaminiationDate', e) }
                      minDate={tomorrow}
                      format="dd/MM/yyyy"
                      invalidDateMessage="Ngày không hợp lệ"
                      minDateMessage = "Ngày khám phải lớn hơn ngày hôm nay"
                    />
                  </MuiPickersUtilsProvider>
                </div>
                <div className="md:w-1/2 sm:w-1/2 p-4">
                  <FuseChipSelect
                    className="mt-8 mb-24"
                    required
                    value={
                      { value: form.reExaminationTime, label: form.reExaminationTime}
                    }
                    onChange={(value) => setInForm('reExaminationTime', value.value)}
                    placeholder="Chọn thời gian khám lại"
                    textFieldProps={{
                      label: 'Chọn thời gian khám lại',
                      InputLabelProps: {
                        shrink: true
                      },
                      variant: 'outlined'
                    }}
                    options={reExamTimes}
                  />
                </div>
              </div>
            }
          </div>
    </div>
    )
}
export default ExaminationForm;
