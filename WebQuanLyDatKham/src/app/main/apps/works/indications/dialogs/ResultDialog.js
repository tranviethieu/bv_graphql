import React, { useState, useEffect, useRef } from "react";
import { useForm } from "@fuse/hooks";
import { showMessage } from "app/store/actions";
import { useDispatch } from "react-redux";
import clsx from "clsx";
import _ from "lodash";
import * as Actions from "../actions";
import { hideResultDialog } from "../actions";
import {
  Icon,
  Box,
  Button,
  TextField,
  IconButton,
  CardActions,
  CardContent,
  Card,
  CardHeader,
  Typography,
  Divider,
} from "@material-ui/core";
import { uploadFile } from "app/store/actions";
import { makeStyles } from "@material-ui/core/styles";
import Lightbox from "react-image-lightbox";
import IconClose from "@material-ui/icons/Close";

const defaultForm = {
  code: null,
  result: "",
  images: [],
};

const useStyles = makeStyles((theme) => ({
  productImageUpload: {
    transitionProperty: "box-shadow",
    transitionDuration: theme.transitions.duration.short,
    transitionTimingFunction: theme.transitions.easing.easeInOut,
    width: "10rem",
    height: "10rem",
  },
}));

export default function ResultDialog({ data, code, onSuccess }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const { form, setForm, handleChange, setInForm } = useForm(defaultForm);
  const [openLightBox, setOpenLightBox] = useState(false);
  const [currentImage, setCurrentImage] = useState("");

  function handleUploadImage(e) {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    uploadFile(file).then((response) => {
      if (response.data) {
        setInForm(`images`, [
          ...form.images,
          { _id: response.data, name: file.name },
        ]);
      }
    });
  }
  function removeImage(index) {
    form.images.splice(index, 1);
    setInForm(`images`, form.images);
  }

  const handleClose = () => {
    onSuccess && onSuccess();
    dispatch(hideResultDialog());
  };
  useEffect(() => {
    if (data && data._id) {
      setForm({
        _id: data._id,
        result: data.result || (data.detail_results && data.detail_results.result) || "",
        images: data.files ?? [],
      });
    }
  }, [data]);
  function onSubmit() {
    let fileIds = form.images.map((i) => i._id);
    Actions.update_indication_result(
      form._id,
      form.result,
      fileIds,
      dispatch
    ).then((response) => {
      if (response.code === 0) {
        dispatch(
          showMessage({ message: "Cập nhật kết quả chỉ định thành công" })
        );
      } else {
        dispatch(showMessage({ message: response.message }));
      }
    });
    handleClose();
  }
  function canBeSave() {
    return form && (form.result || form.images.length);
  }
  function countLine(str) {
    return str.split(/\r\n|\r|\n/).length
  }

  function stripHtml(html) {
    html = html.replace(/\\n/g, "\n").replace(/<br\s?\/?>/gi, "\n");
    let tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    let text = tmp.textContent || tmp.innerText || "";
    return text;
  }
  return (
    <Card>
      <CardHeader
        className="el-CardHeader-FU"
        action={
          <IconButton aria-label="settings" onClick={handleClose}>
            <Icon>close</Icon>
          </IconButton>
        }
        title="Kết quả chỉ định"
        subheader={`Chỉ định ${data.code}`}
      />
      <CardContent
        className={clsx("el-CardContent-FULL")}
        style={{ maxHeight: "70vh", overflow: "auto" }}
      >
        <div className="w-full px-4 mb-16">
          <Typography className="mt-8 mb-16">
            Tên chỉ định: {data?.name}
          </Typography>
          <TextField
            margin="dense"
            className="mt-8 mb-24"
            value={form.result}
            name="result"
            onChange={handleChange}
            label="Kết quả chỉ định"
            variant="outlined"
            fullWidth
            multiline
            rows={Math.max(5, Math.min(15, countLine(stripHtml(form.result))))}
          />
        </div> 
        <Typography className="mb-8 relative">
          Hình ảnh kết quả
          <React.Fragment>
            <input
              accept="image/*"
              className="hidden"
              id="scan"
              type="file"
              ref={fileRef}
              onChange={(e) => handleUploadImage(e)}
            />
            <label
              htmlFor="scan"
              style={{ right: 0, position: "absolute", top: "-1.5rem" }}
            >
              <Button
                onClick={() => {
                  fileRef.current.click();
                }}
                variant="outlined"
                style={{ lineHeight: "initial", textTransform: "initial" }}
              >
                Chọn hình ảnh
              </Button>
            </label>
          </React.Fragment>
          <Divider />
        </Typography>

        <div className="flex flex-wrap">
          <React.Fragment>
            {form.images.length > 0 &&
              form.images.map((item, index) => (
                <Box
                  key={index}
                  className={clsx(
                    classes.productImageUpload,
                    "flex items-center justify-center relative rounded-4 mr-16 overflow-hidden cursor-pointer shadow-1 hover:shadow-5"
                  )}
                >
                  <Box
                    className="flex items-center justify-center absolute w-16 h-16 rounded-32 top-0 right-0 bg-white"
                    onClick={() => removeImage(index)}
                  >
                    <IconClose fontSize="inherit" />
                  </Box>
                  <img
                    src={process.env.REACT_APP_FILE_PREVIEW_URL + item._id}
                    onClick={() => {
                      setOpenLightBox(true);
                      setCurrentImage(item);
                    }}
                    alt=""
                  />
                </Box>
              ))}
            {openLightBox && (
              <Lightbox
                className="el-Lightbox"
                mainSrc={
                  process.env.REACT_APP_FILE_PREVIEW_URL + currentImage._id
                }
                onCloseRequest={() => setOpenLightBox(false)}
              />
            )}
          </React.Fragment>
        </div>
      </CardContent>
      <CardActions className="justify-end">
        <Button
          variant="contained"
          color="secondary"
          onClick={onSubmit}
          disabled={!canBeSave()}
        >
          Cập nhật kết quả chỉ định
        </Button>
      </CardActions>
    </Card>
  );
}
