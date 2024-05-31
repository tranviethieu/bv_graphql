import React, { useState, useEffect, useMemo } from 'react';
import { useForm } from '@fuse/hooks';
import { showMessage } from 'app/store/actions'
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import * as Actions from '../actions';
import { Icon, Button, Typography, IconButton, CardActions, CardContent, Card, CardHeader, ButtonGroup, Tooltip } from '@material-ui/core';
import moment from 'moment';
import { showPrescriptionDialog } from '../actions';
import { showConfirmDialog } from '../../../shared-dialogs/actions';
import ReactTable from 'react-table';
import Lightbox from 'react-image-lightbox';
import withReducer from 'app/store/withReducer';
import reducer from '../reducers';

const defaultForm = {
  code: ''
}
function MedicalPrescriptionDialog({ _id, onSuccess, ...props }) {
  const { form, setForm } = useForm(defaultForm);
  const dispatch = useDispatch();
  const prescription = useSelector(({ prescription }) => prescription.data);
  const [openLightBox, setOpenLightBox] = useState(false)
  const { form: formImages, setForm: setFormImage } = useForm({ currenImages: [], date: new Date() })
  const [photoIndex, setPhotoIndex] = useState(0)

  const handleClose = () => {
    onSuccess && onSuccess();
    dispatch(Actions.hideMedicalPrescriptionDialog());
    dispatch(Actions.hidePrescriptionDialog());
    dispatch(Actions.reset_store_prescription())
  };
  function handleDeletePrescription(prescriptionId) {
    dispatch(showConfirmDialog({
      title: "Xác nhận xóa đơn thuốc", message: `Bạn có chắc muốn xóa đơn thuốc?`, onSubmit: () => {
        Actions.remove_medical_prescription(prescriptionId, dispatch).then(response => {
          if (response.code === 0) {
            dispatch(showMessage({ message: "Xóa đơn thuốc thành công" }))
            dispatch(Actions.remove_prescription_in_store(prescriptionId))
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
          dispatch(Actions.set_prescription_in_store(response.data.prescriptions))
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
        title="Đơn thuốc"
        subheader={"Phiếu khám " + form.code}
      />
      <CardContent className="el-CardContent-FULL" style={{ maxHeight: "70vh", overflow: "auto" }}>
        {
          openLightBox &&
          <Lightbox
            className="el-Lightbox"
            imageTitle={"Thời gian tạo đơn thuốc " + moment(formImages.date).format("HH:mm DD/MM/YYYY")}
            mainSrc={process.env.REACT_APP_FILE_PREVIEW_URL + formImages.currenImages[photoIndex]}
            nextSrc={process.env.REACT_APP_FILE_PREVIEW_URL + formImages.currenImages[(photoIndex + 1) % formImages.currenImages.length]}
            prevSrc={process.env.REACT_APP_FILE_PREVIEW_URL + formImages.currenImages[(photoIndex + formImages.currenImages.length - 1) % formImages.currenImages.length]}
            onCloseRequest={() => setOpenLightBox(false)}
            onMovePrevRequest={() =>
              setPhotoIndex((photoIndex + formImages.currenImages.length - 1) % formImages.currenImages.length)
            }
            onMoveNextRequest={() =>
              setPhotoIndex((photoIndex + 1) % formImages.currenImages.length)
            }
          />
        }
        {
          form.code &&
          <div className="mt-12" s>
            {/* <Typography className="pl-12 text-15 font-bold block-tittle">Kết luận khám</Typography> */}
            <ReactTable
              data={prescription}
              showPagination={false}
              pageSize={(prescription && prescription.length) || 1}
              noDataText="Chưa có đơn thuốc"
              sorted={[{ id: "createdTime", desc: true }]}
              sortable={false}
              border={true}
              columns={[
                {
                  Header: "Thời gian tạo",
                  accessor: "createdTime",
                  width: 120,
                  fixed: 'left',
                  Cell: row =>
                    <div>
                      {moment(row.value).format("DD/MM/YYYY HH:mm")}
                    </div>
                },
                {
                  Header: "Thuốc",
                  accessor: "drugs",
                  width: 350,
                  fixed: 'left',
                  className: "break-normal",
                  style: { whiteSpace: "unset" },
                  Cell: row => <div>
                    {
                      row.value && row.value.length > 0 ?
                        row.value.map((item, index) =>
                          <Typography>
                            {`${index + 1}. Mã: ${item.code}, Tên: ${item.name}, Đơn vị: ${item.unit}, Liều lượng: ${item.amount}, Chỉ định: ${item.instruction}`}
                          </Typography>
                        )
                        : "Không có thông tin thuốc"
                    }
                  </div>
                },
                {
                  Header: "Ảnh",
                  accessor: "images",
                  width: 100,
                  fixed: 'right',
                  Cell: row =>
                    <div>
                      {
                        row.value.length > 0 ?
                          <label htmlFor="text-button-file">
                            <Button
                              className="el-ButtonLowerCase-ShowDialog"
                              component="span"
                              onClick={() => { setOpenLightBox(true); setFormImage({ currenImages: row.value, date: row.original.createdTime }) }}>{row.value.length} ảnh</Button>
                          </label>
                          : <label htmlFor="text-button-file">
                            <Button
                              className="el-ButtonLowerCase-ShowDialog"
                              component="span"
                              disabled
                            >0 ảnh
                            </Button>
                          </label>
                      }
                    </div>
                },
                {
                  Header: "Tác vụ",
                  accessor: "_id",
                  width: 100,
                  fixed: 'right',
                  Cell: row => <ButtonGroup>
                    <Tooltip title="Chỉnh sửa" placement="bottom">
                      <Button className="text-blue p-0" style={{ border: "none" }} onClick={() => dispatch(showPrescriptionDialog({ data: row.original }))}>
                        <Icon>create</Icon>
                      </Button>
                    </Tooltip>
                    <Tooltip title="Xóa" placement="bottom">
                      <Button className="text-red p-0" style={{ border: "none" }} onClick={() => handleDeletePrescription(row.original._id)}>
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
        <Button variant="contained" color="primary" onClick={e => dispatch(showPrescriptionDialog({ code: form.code, data: null }))}>Thêm mới</Button>
      </CardActions>
    </Card>
  )
}
export default withReducer("prescription", reducer.prescription)(MedicalPrescriptionDialog)
