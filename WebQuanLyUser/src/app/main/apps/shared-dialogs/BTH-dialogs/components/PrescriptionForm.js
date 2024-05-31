import React, {useState, useCallback} from 'react';
import { TextField, Typography, FormLabel, Box, Icon } from '@material-ui/core';
import {useForm, useUpdateEffect } from '@fuse/hooks';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import { uploadAvatar } from 'app/store/actions';
import IconClose from '@material-ui/icons/Close'
import ListDrug from "./ListDrug";

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
function PrescriptionForm(props) {
    const classes = useStyles(props);
    const { onPresChange, pres } = props;
    const { form, handleChange, setInForm } = useForm(pres);
    const [openLightBox, setOpenLightBox] = useState(false)
    const [currentImage, setCurrentImage] = useState("");
    function handleUploadImage(e) {
        const file = e.target.files[0];
        if (!file) {
            return;
        }
        uploadAvatar(file).then(response => {
            if (response.data) {
                setInForm(`images`, [...form.images, response.data])
            }
        });
    }
    function removeImage(index) {
        form.images.splice(index, 1);
        setInForm(`images`, form.images);
    }
    const handleDrugsChange = useCallback((drugs) => {
        setInForm(`drugs`, drugs)
    }, [setInForm]);
    useUpdateEffect(() => {
        onPresChange(form);
    }, [form, onPresChange]);

    return (
        <div className = "el-coverPrescriptionForm">
          <Typography className="text-17 p-4">Đơn thuốc</Typography>
          <div>
            <div className="md:w-full sm:w-full p-4">
              <TextField
                className="mt-8 mb-16"
                margin = "dense"
                label="Ghi chú của bác sỹ"
                id="note"
                name="note"
                value={form.note || ''}
                onChange={handleChange}
                variant="outlined"
                fullWidth
              />
            </div>
            <div className="pt-4 pb-4 pl-4">
              <FormLabel className="pb-2">Hình ảnh đơn thuốc</FormLabel>
              <div className = "flex flex-wrap">
                <React.Fragment>
                  <input
                    accept="image/*"
                    className="hidden"
                    id="prescription"
                    type="file"
                    onChange={e =>handleUploadImage(e)}
                  />
                  <label
                    htmlFor="prescription"
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
            <div className = "pt-8">
              <div className = "mb-8">
                <FormLabel>Danh mục thuốc: </FormLabel>
              </div>
              <ListDrug drugs = {form.drugs?form.drugs:[]} onListDrugChange={handleDrugsChange} />
            </div>
          </div>
        </div>
    )
}
export default PrescriptionForm;
