import React, { useState, useEffect, useRef } from 'react';
import { useForm } from '@fuse/hooks';
import { showMessage } from 'app/store/actions'
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx'
import _ from 'lodash';
import * as Actions from '../actions';
import { Icon, Button, Divider, Typography, IconButton, CardActions, CardContent, Card, CardHeader, Checkbox, ButtonGroup, Tooltip, Box } from '@material-ui/core';
import moment from 'moment';
import { showConclusionDialog } from '../actions';
import { showConfirmDialog } from '../../../shared-dialogs/actions';
import ReactTable from 'react-table';
import withReducer from 'app/store/withReducer';
import reducer from '../reducers';
import { uploadFile } from "app/store/actions";
import { makeStyles } from "@material-ui/core/styles";
import Lightbox from "react-image-lightbox";
import IconClose from "@material-ui/icons/Close";

const defaultForm = {
  code: ''
}

const useStyles = makeStyles((theme) => ({
  productImageUpload: {
    transitionProperty: "box-shadow",
    transitionDuration: theme.transitions.duration.short,
    transitionTimingFunction: theme.transitions.easing.easeInOut,
    width: "10rem",
    height: "10rem",
  },
}));
function MedicalConclusionDialog({ _id, onSuccess, ...props }) {
  const { form, setForm } = useForm(defaultForm);
  const dispatch = useDispatch();
  const conclusion = useSelector(({ conclusion }) => conclusion.data);
  const [images, setImages] = useState([]);
  const fileRef = useRef(null);
  const [openLightBox, setOpenLightBox] = useState(false);
  const [currentImage, setCurrentImage] = useState("");
  const classes = useStyles();
  const [isUpdateImage, setIsUpdateImage] = useState(false);

  function handleUploadImage(e) {
    setIsUpdateImage(true);
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    uploadFile(file).then((response) => {
      if (response.data) {
        setImages([...images, response.data]);
      }
    });
  }
  function removeImage(index) {
    setIsUpdateImage(true);
    images.splice(index, 1);
    setImages([...images]);
  }

  function onClickUpdateImage() {
    Actions.update_images_medical_conclusion(_id, images, dispatch).then(response => {
      if (response.code === 0) {
        dispatch(showMessage({ message: "Cập nhật hình ảnh kết luận khám thành công!" }))
      }
      else {
        dispatch(showMessage({ message: response.message }))
      }
    })
  }

  const handleClose = () => {
    onSuccess && onSuccess();
    dispatch(Actions.hideMedicalConclusionDialog());
    dispatch(Actions.hideConclusionDialog());
    dispatch(Actions.reset_store())
  };
  function handleDeleteConclusion(code) {
    dispatch(showConfirmDialog({
      title: "Xác nhận xóa kết luận khám", message: `Bạn có chắc muốn xóa kết luận khám?`, onSubmit: () => {
        Actions.remove_medical_conclusion(_id, code, dispatch).then(response => {
          if (response.code === 0) {
            dispatch(showMessage({ message: "Xóa kết luận khám thành công" }))
            dispatch(Actions.remove_conclusion_in_store(code))
          }
          else {
            dispatch(showMessage({ message: response.message }))
          }
        })
      }
    }))
  }
  useEffect(() => {
    if (_id) {
      Actions.get_medical_session_detail(_id, dispatch).then(response => {
        if (response.code === 0) {
          setForm(response.data);
          setImages(response.data.fileIds ?? [])
          dispatch(Actions.set_conclusion_in_store(response.data.conclusions ?? []))
        } else {
          dispatch(showMessage({ message: response.message }))
        }
      })
    }

  }, [_id])
  return (
    <Card>
      <CardHeader className="el-CardHeader-FU"
        action={
          <IconButton aria-label="settings" onClick={handleClose}>
            <Icon>close</Icon>
          </IconButton>
        }
        title="Kết luận khám"
        subheader={"Phiếu khám " + form.code}
      />
      <CardContent className="el-CardContent-FULL" style={{ maxHeight: "70vh", overflow: "auto" }}>
        { }
        {
          form.code &&
          <div className="mt-12">
            {/* <Typography className="pl-12 text-15 font-bold block-tittle">Kết luận khám</Typography> */}
            <ReactTable
              data={conclusion}
              showPagination={false}
              pageSize={conclusion.length || 1}
              noDataText="Chưa có kết luận khám"
              // sorted={[{ id: "createdTime", desc: true }]}
              sortable={false}
              columns={[
                {
                  Header: "Thời gian tạo",
                  accessor: "createdTime",
                  width: 120,
                  Cell: row =>
                    <div>
                      {moment(row.value).format("DD/MM/YYYY HH:mm")}
                    </div>
                },
                {
                  Header: "Kết luận khám",
                  accessor: "name",
                  width: 180,
                  className: "break-normal",
                  style: { whiteSpace: "unset" },
                },
                {
                  Header: "Ghi chú",
                  accessor: "note",
                  width: 180,
                  className: "break-normal",
                  style: { whiteSpace: "unset" },
                },
                {
                  Header: "Bệnh chính",
                  accessor: "main",
                  width: 90,
                  Cell: row => <Checkbox checked={row.index === 0} disabled></Checkbox>
                },
                {
                  Header: "Tác vụ",
                  accessor: "_id",
                  width: 90,
                  Cell: row => <ButtonGroup>
                    <Tooltip title="Chỉnh sửa" placement="bottom">
                      <Button className="text-blue p-0" style={{ border: "none" }} onClick={() => dispatch(showConclusionDialog({ sessionId: _id, data: row.original }))}>
                        <Icon>create</Icon>
                      </Button>
                    </Tooltip>
                    <Tooltip title="Xóa" placement="bottom">
                      <Button className="text-red p-0" style={{ border: "none" }} onClick={() => handleDeleteConclusion(row.original.code)}>
                        <Icon>delete</Icon>
                      </Button>
                    </Tooltip>
                  </ButtonGroup>
                }
              ]}
            />
          </div>
        }
      </CardContent>
      <CardActions className="justify-end pb-20 mr-8">
        <Button variant="contained" color="primary" onClick={e => dispatch(showConclusionDialog({ sessionId: _id, data: null }))}>Thêm mới</Button>
      </CardActions>
      <CardHeader
        className="el-CardHeader-FU"
        title="Hình ảnh kết luận khám"
        action={
          <Button
            onClick={() => {
              fileRef.current.click();
            }}
            variant="outlined"
            style={{ lineHeight: "initial", textTransform: "initial", color: "lawngreen", top: "1.5rem" }}
          >
            Chọn hình ảnh
          </Button>
        }
      />
      <CardContent>
        <Typography className="mb-8 relative">
          <React.Fragment>
            <input
              accept="image/*"
              className="hidden"
              id="scan"
              type="file"
              ref={fileRef}
              onChange={(e) => handleUploadImage(e)}
            />
            {/* <label
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
            </label> */}
          </React.Fragment>
          <Divider />
        </Typography>

        <div className="flex flex-wrap">
          <React.Fragment>
            {images.length > 0 &&
              images.map((item, index) => (
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
                    src={process.env.REACT_APP_FILE_PREVIEW_URL + item}
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
                  process.env.REACT_APP_FILE_PREVIEW_URL + currentImage
                }
                onCloseRequest={() => setOpenLightBox(false)}
              />
            )}
          </React.Fragment>
        </div>
      </CardContent>
      <CardActions className="justify-start pb-20 mr-8">

        <Button
          variant="contained"
          color="secondary"
          onClick={onClickUpdateImage}
          disabled={!isUpdateImage}
        >
          Cập nhật hình ảnh kết quả
        </Button>
      </CardActions>
    </Card>
  )
}
export default withReducer("conclusion", reducer.conclusion)(MedicalConclusionDialog)
