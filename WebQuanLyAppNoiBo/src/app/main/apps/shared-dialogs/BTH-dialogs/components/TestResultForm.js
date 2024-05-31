import React, { useState, useCallback } from 'react';
import { TextField, Typography, FormLabel, Box, Icon } from '@material-ui/core';
import { useForm, useUpdateEffect } from '@fuse/hooks';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import { uploadAvatar } from 'app/store/actions';
import IconClose from '@material-ui/icons/Close'
import ListTest from "./ListTest";

const useStyles = makeStyles(theme => ({
  imageTypeRootStyle: {
    backgroundColor: "transparent",
    width: "auto",
    border: "none",
    '& img': {
      border: 'none',
    },
  }
}));

function TestResultForm(props) {
  const classes = useStyles(props);
  const { onTestChange, test } = props;
  const { form, handleChange, setInForm } = useForm(test);
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
  const handleTestChange = useCallback((unitResults) => {
    setInForm(`unitResults`, unitResults)
  }, [setInForm])
  useUpdateEffect(() => {
    onTestChange(form);
  }, [form, onTestChange]);

  return (
    <div className="el-coverTestResultForm">
      <Typography className="text-17 p-4">Kết quả xét nghiệm</Typography>
      <div>
        <div className="md:w-full sm:w-full p-4">
          <TextField
            className="mt-8 mb-16"
            error={form.title === '' || !form.title}
            required
            margin="dense"
            label="Tên kết quả xét nghiệm"
            id="title"
            name="title"
            value={form.title || ''}
            onChange={handleChange}
            variant="outlined"
            fullWidth
          />
        </div>
        <div className="md:w-full sm:w-full p-4">
          <TextField
            className="mt-8 mb-16"
            error={form.testId === '' || !form.testId}
            required
            margin="dense"
            label="Số mẫu"
            id="testId"
            name="testId"
            value={form.testId || ''}
            onChange={handleChange}
            variant="outlined"
            fullWidth
          />
        </div>
        <div className="pt-4 pb-4 pl-4">
          <FormLabel className="pb-2">Hình ảnh kết quả xét nghiệm</FormLabel>
          <div className="flex flex-wrap">
            <React.Fragment>
              <input
                accept="image/*"
                className="hidden"
                id="test"
                type="file"
                onChange={e => handleUploadImage(e)}
              />
              <label
                htmlFor="test"
                className={
                  clsx(
                    classes.productImageUpload,
                    "flex items-center justify-center relative w-48 h-48 rounded-4 mr-16 overflow-hidden cursor-pointer shadow-1 hover:shadow-5"
                  )}
              >

                <Icon fontSize="large" color="action">cloud_upload</Icon>
              </label>
              {
                form.images.length > 0 && form.images.map((item, index) =>
                  <Box className={
                    clsx(
                      classes.productImageUpload,
                      "flex items-center justify-center relative w-48 h-48 rounded-4 mr-16 overflow-hidden cursor-pointer shadow-1 hover:shadow-5"
                    )} >
                    <Box position="absolute" right="0px" top='0px' width='16px' height='16px' bgcolor='#fff' borderRadius='50px' onClick={() => removeImage(index)} >
                      <IconClose fontSize="inherit" />
                    </Box>
                    <img src={process.env.REACT_APP_FILE_PREVIEW_URL + item} onClick={() => { setOpenLightBox(true); setCurrentImage(item) }} alt="" />
                  </Box>
                )
              }
              {openLightBox &&
                <Lightbox
                  className="el-Lightbox"
                  mainSrc={process.env.REACT_APP_FILE_PREVIEW_URL + currentImage}
                  onCloseRequest={() => setOpenLightBox(false)}
                />}
            </React.Fragment>
          </div>
        </div>
        <div>
          <div className="mb-8">
            <FormLabel>Các chỉ mục xét nghiệm</FormLabel>
          </div>
          <ListTest unitResults={form.unitResults ? form.unitResults : []} onListTestChange={handleTestChange} />
        </div>
      </div>
    </div>
  )
}
export default TestResultForm;
