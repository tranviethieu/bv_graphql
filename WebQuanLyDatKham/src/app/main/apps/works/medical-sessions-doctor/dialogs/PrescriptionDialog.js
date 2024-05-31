import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useForm } from '@fuse/hooks';
import { showMessage } from 'app/store/actions'
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx'
import _ from 'lodash';
import * as Actions from '../actions';
import { hidePrescriptionDialog } from '../actions';
import { Icon, Button, FormLabel, IconButton, CardActions, CardContent, Card, CardHeader, Box } from '@material-ui/core';
import { uploadFile } from 'app/store/actions';
import IconClose from '@material-ui/icons/Close'
import { makeStyles } from '@material-ui/core/styles';
import Lightbox from 'react-image-lightbox';
import ListDrug from "./ListDrug";
const useStyles = makeStyles(theme => ({
  imageTypeRootStyle: {
    backgroundColor: "transparent",
    width: "auto",
    border: "none",
    '& img': {
      border: 'none',
    },
  },
  imageBtnWrapper: {
    backgroundImage: "linear-gradient(135deg, #008aff, #86d472)",
    borderRadius: "6px",
    boxSizing: "border-box",
    color: "#ffffff",
    display: "block",
    height: "38px",
    fontSize: "1.4em",
    fontWeight: "600",
    padding: "4px",
    position: "relative",
    textDecoration: "none",
    width: "6em",
    zIndex: "2",
    textAlign: "center",
  }
}));
const defaultForm = {
  sessionCode: '',
  images: []
}
export default function PrescriptionDialog({ data, code }) {
  const { form, setForm, setInForm, handleChange } = useForm(defaultForm);
  const classes = useStyles();
  const dispatch = useDispatch();
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
    setInForm(`images`, [...form.images]);
  }
  const handleDrugsChange = useCallback((drugs) => {
    setInForm(`drugs`, drugs)
  }, [setInForm]);

  const handleClose = () => {
    dispatch(hidePrescriptionDialog());
  };
  useEffect(() => {
    console.log(data);
    if (data && data._id) {
      setForm({
        _id: data._id,
        sessionCode: data.sessionCode,
        drugs: data.drugs ? data.drugs : [],
        images: data.images ? data.images : [],
      })
    } else {
      setForm({ sessionCode: code, images: [] })
    }
  }, [data]);
  function onSubmit() {
    if (form._id) {
      dispatch(Actions.remove_prescription_in_store(form._id))
      Actions.update_medical_session_prescription(form, dispatch).then(response => {
        if (response.code === 0) {
          dispatch(Actions.add_prescription_in_store(response.data))
          dispatch(showMessage({ message: "Cập nhật đơn thuốc thành công" }))
        }
        else {
          dispatch(showMessage({ message: response.message }))
        }
      })
    }
    else {
      Actions.update_medical_session_prescription(form, dispatch).then(response => {
        if (response.code === 0) {
          dispatch(Actions.add_prescription_in_store(response.data))
          dispatch(showMessage({ message: "Cập nhật đơn thuốc thành công" }))
        }
        else {
          dispatch(showMessage({ message: response.message }))
        }
      })
    }
    handleClose();
  }
  function canBeSave() {
    return (
      form && form.drugs && form.drugs.length > 0
    )
  }
  return (
    <Card>
      <CardHeader className="el-CardHeader-FU"
        action={
          <IconButton aria-label="settings" onClick={handleClose}>
            <Icon>close</Icon>
          </IconButton>
        }
        title="Tạo đơn thuốc"
      />
      <CardContent className={clsx("el-CardContent-FULL")} style={{ maxHeight: "70vh", overflow: "auto" }}>
        <div className="pt-8">
          <div className="mb-8">
            <FormLabel>Danh mục thuốc: </FormLabel>
          </div>
          <ListDrug drugs={form.drugs ? form.drugs : []} onListDrugChange={handleDrugsChange} />
        </div>
        <div className="px-8 pb-8 ">
          <FormLabel className="pb-2">Hình ảnh đơn thuốc</FormLabel>
          <div className="flex flex-wrap">
            <React.Fragment>
              <input
                accept="image/*"
                className="hidden"
                id="prescription"
                type="file"
                onChange={e => handleUploadImage(e)}
              />
              <label
                htmlFor="prescription"
                class={classes.imageBtnWrapper}
              >
                Chọn ảnh
              </label>
              {
                useMemo(() => <div className="flex">
                  {
                    form.images.length > 0 && form.images.map((item, index) =>
                      item && <Box className={
                        clsx(
                          classes.productImageUpload,
                          "flex items-center justify-center relative w-65 h-65 rounded-4 mr-16 overflow-hidden cursor-pointer shadow-1 hover:shadow-5"
                        )} >
                        <Box position="absolute" right="0px" top='0px' width='16px' height='16px' bgcolor='#fff' borderRadius='50px' onClick={() => removeImage(index)} >
                          <IconClose fontSize="inherit" />
                        </Box>
                        <img src={process.env.REACT_APP_FILE_PREVIEW_URL + item} onClick={() => { setOpenLightBox(true); setCurrentImage(item) }} alt="" />
                      </Box>
                    )
                  }
                </div>, [form.images, data])
              }
              {
                openLightBox &&
                <Lightbox
                  className="el-Lightbox"
                  mainSrc={process.env.REACT_APP_FILE_PREVIEW_URL + currentImage}
                  onCloseRequest={() => setOpenLightBox(false)}
                />
              }
            </React.Fragment>
          </div>
        </div>
      </CardContent>
      <CardActions>
        <Button variant="contained" color="secondary" onClick={onSubmit} disabled={!canBeSave()}>Cập nhật đơn thuốc</Button>
      </CardActions>
    </Card>
  )
}
