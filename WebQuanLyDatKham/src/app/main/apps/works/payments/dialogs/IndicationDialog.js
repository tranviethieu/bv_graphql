import React, { useState, useEffect, useMemo } from 'react';
import { useForm } from '@fuse/hooks';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import viLocale from "date-fns/locale/vi";
import { showMessage } from 'app/store/actions'
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx'
import _ from 'lodash';
import * as Actions from '../actions';
import { hideIndicationDialog } from './IndicationDialog.action';
import { Icon, Button, ButtonGroup, TextField, Divider, Typography, IconButton, CardActions, CardContent, Card, CardHeader, TextareaAutosize, FormControl } from '@material-ui/core';
import moment from 'moment';
import { FuseChipSelect } from '@fuse';
import { makeStyles } from '@material-ui/core/styles';
import ReactTable from 'react-table';
import { showConfirmDialog } from '../../../shared-dialogs/actions';

const defaultForm = {
    sessionCode: ''
}
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
export default function ConclusionDialog({ code, _id }) {
    const { form, setForm, setInForm, handleChange } = useForm(defaultForm);
    const userData = useSelector(({auth}) => auth.user.data);
    const dispatch = useDispatch();
    const [serviceCat, setServiceCat] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [selectedServiceCat, setSelectedServiceCat] = useState(null);
    const [selectedService, setSelectedService] = useState(null);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [doctors, setDoctors] = useState([]);//danh sach nay tam thoi truy xuat theo khoa
    const [amount, setAmount] = useState(0);
    const handleClose = () => {
        dispatch(hideIndicationDialog());
    };

    function loadDefaultData() {

        Actions.get_departments(dispatch).then(response => {
            setDepartments(response.data);
        });
        Actions.get_services(dispatch).then(response => {
            setServiceCat(response.data);
        })
    }

    useEffect(() => {
        loadDefaultData();
    }, []);

    useEffect(() => {
        if (selectedDepartment) {
            Actions.get_account_by_department(selectedDepartment.code).then(response => {
                setDoctors(response.data.map(d => ({
                    _id: d._id,
                    code: d.base && d.base.code,
                    departmentId: d.base && d.base.departmentId,
                    departmentName: d.base && d.base.departmentName,
                    work: d.base && d.base.work,
                    fullName:d.base&&d.base.fullName
                })));
            })
            setInForm("clinic", null);//reset lai thong tin phong kham
            setInForm("doctor", null)
        }
    },[selectedDepartment]);
    ///chon service thi moi co du lieu chi phi
    useEffect(() => {
        if (selectedPayment&&selectedService) {
            switch (selectedPayment.value) {
                case "BHYT":
                    setAmount(selectedService.priceOfInsurance)
                    break;
                case "KSK":
                case "VP":
                    setAmount(selectedService.price);
                    break;
                case "DV":
                    setAmount(selectedService.priceOfSelfService)
                    break;
                default:{
                    return;
                }
            }
        }

    },[selectedPayment,selectedService]);
    useEffect(() => {
        if (_id) {
            //fetch indication detail here
        } else
            if (code) {
                setInForm('sessionCode', code);
            }
    }, [code, _id]);
    useEffect(()=>{
      setSelectedService(null)
    }, [selectedServiceCat])
    function onSubmit() {
        // giá trị của 1 indication để đẩy lên server
        const data = {
            ...form, service: {code:selectedService && selectedService.code,name:selectedService && selectedService.name}, department: {code:selectedDepartment && selectedDepartment.code,name: selectedDepartment && selectedDepartment.name}
        }
        // variables dùng đẩy lên với api save_indication_cashier
        const variables = {
            data,patientType: selectedPayment && selectedPayment.value,amount
        }
        // giá trị đẩy ra store khi tạo mới
        const variables_add_store = {
          ...form, service: {code:selectedService && selectedService.code,name:selectedService && selectedService.name}, department: {code:selectedDepartment && selectedDepartment.code,name: selectedDepartment && selectedDepartment.name}, creator: {fullName: userData.base && userData.base.fullName, code: userData.base && userData.base.code}, createdTime: moment().format("YYYY-MM-DD HH:mm")
        }
        if (code){
          Actions.create_indication(data, dispatch).then(response => {
              if (response.code === 0) {
                  dispatch(showMessage({ message: "Thanh toán thành công" }))
                  dispatch(Actions.add_indication_in_store(variables_add_store, dispatch))
                  handleClose();
              } else {
                  dispatch(showMessage({message:response.message}))
              }
          })
        }
        else{
          dispatch(Actions.add_indication_in_store(variables_add_store, dispatch))
          dispatch(Actions.add_indication_update_server(data, dispatch))
          handleClose();
        }
    }
    function canBeSave() {
        return (
            selectedServiceCat && selectedService && selectedDepartment && form.clinic && form.doctor
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
            title="Thông tin chỉ định"
            subheader={"Phiếu khám " + form.sessionCode}
          />
          <CardContent className={clsx("el-CardContent-FULL")}>
            {
              useMemo(() => <div className="w-full px-4">
                <FuseChipSelect
                  margin='dense'
                  className="mt-8 mb-24"
                  style={{ height: 20 }}
                  value={
                    selectedServiceCat
                  }
                  onChange={(e) => setSelectedServiceCat(e)}
                  textFieldProps={{
                    label: 'Loại dịch vụ',
                    InputLabelProps: {
                      shrink: true
                    },
                    variant: 'outlined'
                  }}
                  isClearable={true}
                  options={serviceCat.map(d => ({
                    value: d._id, label: d.name, ...d
                  }))}
                />
              </div>, [serviceCat, selectedServiceCat])
            }
            {
              useMemo(() => <div className="w-full px-4">
                {
                  selectedServiceCat && <FuseChipSelect
                    margin='dense'
                    className="mt-8 mb-24"
                    style={{ height: 20 }}
                    value={
                      selectedService
                    }
                    onChange={(e) => setSelectedService(e)}
                    textFieldProps={{
                      label: 'Dịch vụ',
                      InputLabelProps: {
                        shrink: true
                      },
                      variant: 'outlined'
                    }}
                    isClearable={true}
                    options={selectedServiceCat && selectedServiceCat.services.map(d => ({
                      value: d._id, label: d.name, ...d
                    }))}
                                        />
                }
              </div>, [selectedServiceCat, selectedService])
            }
            {
              useMemo(() => <div className="w-full px-4">
                <FuseChipSelect
                  margin='dense'
                  className="mt-8 mb-24"
                  style={{ height: 20 }}
                  value={
                    selectedDepartment
                  }
                  onChange={(e) => setSelectedDepartment(e)}
                  textFieldProps={{
                    label: 'Khoa khám',
                    InputLabelProps: {
                      shrink: true
                    },
                    variant: 'outlined'
                  }}
                  isClearable={true}
                  options={departments.map(d => ({
                    value: d.code, label: d.name, ...d
                  }))}
                />
              </div>, [departments, selectedDepartment])
            }
            {
              useMemo(() => <div className="w-full px-4">
                {
                  selectedDepartment && <FuseChipSelect
                    margin='dense'
                    className="mt-8 mb-24"
                    style={{ height: 20 }}
                    value={
                      form.clinic && {
                        value: form.clinic.code, label: form.clinic.name
                      }
                    }
                    onChange={(e) => setInForm('clinic', e && { code: e.value, name: e.label })}
                    textFieldProps={{
                      label: 'Phòng khám',
                      InputLabelProps: {
                        shrink: true
                      },
                      variant: 'outlined'
                    }}
                    isClearable={true}
                    options={selectedDepartment&&selectedDepartment.clinics.map(d => ({
                      value: d.code, label: d.name, ...d
                    }))}
                                        />
                }
              </div>, [form.clinic, selectedDepartment])
            }
            {
              useMemo(() => <div className="w-full px-4">
                {
                  doctors && <FuseChipSelect
                    margin='dense'
                    className="mt-8 mb-24"
                    style={{ height: 20 }}
                    value={
                      form.doctor && {
                        value: form.doctor._id, label: form.doctor.fullName
                      }
                    }
                    onChange={(e) => setInForm('doctor', e ? _.omit(e,["value","label"]) : null)}
                    textFieldProps={{
                      label: 'Bác sỹ',
                      InputLabelProps: {
                        shrink: true
                      },
                      variant: 'outlined'
                    }}
                    isClearable={true}
                    options={doctors.map(d => ({
                      value: d._id, label: d.fullName, ...d
                    }))}
                             />
                }
              </div>, [doctors,form.doctor])
            }

            {/* {
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
            <Typography>Phí khám: {amount}</Typography> */}
          </CardContent>
          <CardActions>
            <Button variant="contained" color="secondary" onClick={onSubmit} disabled = {!canBeSave()}>Cập nhật chỉ định</Button>
          </CardActions>
        </Card>
    )
}
