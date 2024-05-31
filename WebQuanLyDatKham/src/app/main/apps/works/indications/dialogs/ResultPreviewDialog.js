import React, { useState, useEffect, useRef } from "react";
import { showMessage } from "app/store/actions";
import { useDispatch } from "react-redux";
import clsx from "clsx";
import _ from "lodash";
import * as Actions from "../actions";
import { hideResultPreviewDialog } from "../actions";
import {
  Icon,
  IconButton,
  Box,
  CardActions,
  CardContent,
  Card,
  CardHeader,
  Typography,
  Divider,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Lightbox from "react-image-lightbox";
import IconClose from "@material-ui/icons/Close";

const useStyles = makeStyles((theme) => ({
  productImageUpload: {
    transitionProperty: "box-shadow",
    transitionDuration: theme.transitions.duration.short,
    transitionTimingFunction: theme.transitions.easing.easeInOut,
    width: "20rem",
    height: "20rem",
  },
  productImageUploadBig: {
    transitionProperty: "box-shadow",
    width: "50rem",
    height: "50rem",
  },
}));

export default function ResultPreviewDialog({ indications }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [openLightBox, setOpenLightBox] = useState(false);
  const [currentImage, setCurrentImage] = useState("");

  const [files, setFiles] = useState([])

  const handleClose = () => {
    dispatch(hideResultPreviewDialog());
  };
  const addImg = (img_) => {
    setFiles(prev => [...prev, img_])
  }
  useEffect(() => {
    if (indications) {
      indications.map((value) => {
        if (value.files) {
          value.files.map((val) => {
            let img_ = {
              name: value.name,
              _id: val._id,
              nameImg: val.name
            };
            addImg(img_);
          })
        }
      })
    }
  }, [indications]);
  return (
    <Card>
      <CardHeader
        className="el-CardHeader-FU"
        action={
          <IconButton aria-label="settings" onClick={handleClose}>
            <Icon>close</Icon>
          </IconButton>
        }
        title="Xem kết quả chỉ định"
      />
      <CardContent
        className={clsx("el-CardContent-FULL")}
      // style={{ maxHeight: "70vh" }}
      // style={{ maxHeight: "70vh", overflow: "auto" }}
      >
        <div className="flex flex-wrap h-full">
          <div className="el-block-report sm:w-1/3 h-full flex flex-col" style={{ maxHeight: "70vh", overflow: "auto" }}>
            <React.Fragment
              className="el-block-report w-full h-full flex flex-col" style={{ maxHeight: "70vh", overflow: "auto" }}
            >
              {files.length > 0 &&
                files.map((item, index) => (
                  <Box
                    key={index}
                    className={clsx(
                      classes.productImageUpload,
                      "flex items-center justify-center relative rounded-4 mr-16 overflow-hidden cursor-pointer shadow-1 hover:shadow-5"
                    )}
                  >
                    <Box style={{ textAlign: "center", justifyContent: "center", backgroundColor: "rgba(0, 0, 0, 0.5)" }} className="w-full" position="absolute" right="0px" bottom='0px' height='25px' onClick={() => { setCurrentImage(item); }} >

                      <label style={{ fontSize: "16px", color: "Beige" }}>{item.name}</label>
                    </Box>
                    <img
                      src={process.env.REACT_APP_FILE_PREVIEW_URL + item._id}
                      onClick={() => {
                        // setOpenLightBox(true);
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
          <div className="el-block-report sm:w-2/3 h-full flex flex-col">
            {currentImage && currentImage._id && (
              // <div key={currentImage.nameImg}>
              //   <img src={process.env.REACT_APP_FILE_PREVIEW_URL + currentImage._id} />
              // </div>
              <Box
                key={currentImage.nameImg}
                className={clsx(
                  classes.productImageUploadBig,
                  "flex items-center justify-center relative rounded-4 mr-16 overflow-hidden cursor-pointer shadow-1 hover:shadow-5"
                )}
              >
                <Box style={{ textAlign: "center", justifyContent: "center", backgroundColor: "rgba(0, 0, 0, 0.5)" }} className="w-full" position="absolute" right="0px" top='0px' height='35px'>
                  <label style={{ fontSize: "22px", color: "Beige" }}>{currentImage.name}</label>
                </Box>
                <img
                  src={process.env.REACT_APP_FILE_PREVIEW_URL + currentImage._id}
                  alt=""
                />
              </Box>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
