import React, { useState, useEffect, useMemo } from 'react';
import { showMessage } from 'app/store/actions'
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx'
import _ from 'lodash';
import * as Actions from '../actions';
import { hideIndicationTransactionDialog } from './IndicationDialog.action';
import { Icon, Button, Typography, IconButton, CardActions, CardContent, Card, CardHeader, DialogContentText, Grid } from '@material-ui/core';
import moment from 'moment';
import { FuseChipSelect } from '@fuse';
const paymentTypes = [
    {
        value: "BHYT", label: "Có bảo hiểm",
    },
    {
        value:"VP",label:"Viện phí",
    },
    {
        value:"KSK",label:"Khám sức khỏe"
    },
    {
        value:"DV",label:"Khám dịch vụ"
    }
]
///code ở đây chính là mã phiếu khám, bắt buộc phải có
///_id là mã chỉ định trong tình huống cập nhật thông tin
export default function IndicationTransactionDialog({ data, onSuccess }) {
    const dispatch = useDispatch();
    const [selectedService, setSelectedService] = useState(null);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [amount, setAmount] = useState(0);
    const handleClose = () => {
        onSuccess && onSuccess();
        dispatch(hideIndicationTransactionDialog());
    };

    ///chon service thi moi co du lieu chi phi
    useEffect(() => {
        if (selectedPayment&&data.service_detail) {
            switch (selectedPayment.value) {
                case "BHYT":
                    setAmount(data.service_detail.priceOfInsurance)
                    break;
                case "KSK":
                case "VP":
                    setAmount(data.service_detail.price);
                    break;
                case "DV":
                    setAmount(data.service_detail.priceOfSelfService)
                    break;
                default:{
                    return;
                }
            }
        }

    },[selectedPayment,selectedService]);

    function onSubmit() {
      Actions.create_medical_transaction(data.code, selectedPayment.value).then(response =>{
        if(response.code === 0){
          dispatch(showMessage({message: "Thanh toán chỉ định thành công"}))
          handleClose();
        }
        else {
          dispatch(showMessage({message: response.message}))
        }
      })
    }
    function canBeSave() {
        return (
             selectedPayment
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
            title={"Chỉ định " + data.code}
            subheader={"Phiếu khám " + data.sessionCode}
          />
          <CardContent className={clsx("el-CardContent-FULL")}>
            <DialogContentText>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  Mã bệnh nhân:
                </Grid>
                <Grid item xs={6}>
                  <div className="font-bold el-GridWordWrap">
                    {data.patientCode}
                  </div>
                </Grid>
                <Grid item xs={6}>
                  Tên bệnh nhân:
                </Grid>
                <Grid item xs={6}>
                  <div className="font-bold el-GridWordWrap">
                    {(data.patient && data.patient.fullName) || (data.inputPatient && data.inputPatient.fullName)}
                  </div>
                </Grid>
                <Grid item xs={6}>
                  Nghề nghiệp:
                </Grid>
                <Grid item xs={6}>
                  <div className="font-bold el-GridWordWrap">
                    {(data.patient && data.patient.work && data.patient.work.name)}
                  </div>
                </Grid>
                <Grid item xs={6}>
                  Số điện thoại:
                </Grid>
                <Grid item xs={6}>
                  <div className="font-bold el-GridWordWrap">
                    {(data.patient && data.patient.phoneNumber) || (data.inputPatient && data.inputPatient.phoneNumber)}
                  </div>
                </Grid>
                <Grid item xs={6}>
                  Ngày sinh:
                </Grid>
                <Grid item xs={6}>
                  <div className="font-bold el-GridWordWrap">
                    {moment(data.patient && data.patient.birthDay).format("DD/MM/YYYY")}
                  </div>
                </Grid>
                <Grid item xs={6}>
                  Giới tính:
                </Grid>
                <Grid item xs={6}>
                  <div className="font-bold el-GridWordWrap">
                    {
                      data.patient && (data.patient.gender === "1" ? "Nam" : data.patient.gender === "2" ? "Nữ" : "Chưa xác định")
                    }
                  </div>
                </Grid>
                <Grid item xs={6}>
                  Địa chỉ:
                </Grid>
                <Grid item xs={6}>
                  <div className="font-bold el-GridWordWrap">
                    {
                      (data.patient && `${data.patient.street} - ${data.patient.ward && data.patient.ward.name} - ${data.patient.district &&data.patient.district.name} - ${data.patient.province &&data.patient.province.name} - ${data.patient.nationality &&data.patient.nationality.name}`)
                    }
                  </div>
                </Grid>
                <Grid item xs={6}>
                  Khoa khám:
                </Grid>
                <Grid item xs={6}>
                  <div className="font-bold el-GridWordWrap">
                    {data.department && data.department.name}
                  </div>
                </Grid>
                <Grid item xs={6}>
                  Phòng khám:
                </Grid>
                <Grid item xs={6}>
                  <div className="font-bold el-GridWordWrap">
                    {
                      data.clinic? data.clinic.name : ""
                    }
                  </div>
                </Grid>
                <Grid item xs={6}>
                  Bác sỹ:
                </Grid>
                <Grid item xs={6}>
                  <div className="font-bold el-GridWordWrap">
                    {
                      data.doctor? data.doctor.fullName : ""
                    }
                  </div>
                </Grid>
              </Grid>
            </DialogContentText>
            {
              useMemo(() => <div className="w-full px-4">
                {
                  <FuseChipSelect
                    margin='dense'
                    className="mt-8 mb-24"
                    style={{ height: 20 }}
                    value={
                      selectedPayment
                    }
                    onChange={(e) => setSelectedPayment(e)}
                    textFieldProps={{
                      label: 'Loại thanh toán',
                      InputLabelProps: {
                        shrink: true
                      },
                      variant: 'outlined'
                    }}
                    isClearable={true}
                    options={paymentTypes}
                  />
                }
              </div>, [selectedService,selectedPayment])
            }
            <Typography>Phí khám: {amount}</Typography>
          </CardContent>
          <CardActions>
            <Button variant="contained" color="secondary" onClick={onSubmit} disabled = {!canBeSave()}>Thanh toán</Button>
          </CardActions>
        </Card>
    )
}
