import React, { useEffect, useState } from 'react';
import { Button, TextField, Icon, Typography } from '@material-ui/core';
import { FuseAnimate, FusePageCarded, FuseChipSelect } from '@fuse';
import { useForm } from '@fuse/hooks';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import viLocale from "date-fns/locale/vi";
import moment from 'moment'
import * as Actions from './store/actions';
import { showMessage } from 'app/store/actions'
import history from '@history';
import ConfirmDialog from '@fuse/components/Confirm/ConfirmDialog';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import XLSX from 'xlsx';
const today = new Date()
const tomorrow = new Date(today)
tomorrow.setDate(tomorrow.getDate() + 1)

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const initialCallCampaign = {
  name: '',
  phoneNumbers: [],
  startTime: new Date(),
  endTime: tomorrow,
  direction: 'OUT',
  finished: false,
  _id: null,
  description: ''
}
function CallCampaignEdit(props) {
    const dispatch = useDispatch();
    const classes = useStyles();
    const { form, handleChange, setInForm } = useForm(initialCallCampaign);
    const [confirm, setConfirm] = useState(false);
    const [isInputFromExcel, setIsInputFromExcel] = useState(false);
    const [displayDirection, setDisplayDirection] = useState({value: "OUT", label:"Gọi ra"})
    const [displayChoose, setDisplayChoose] = useState({value: false, label:"Nhập số điện thoại"})
    const [displayPhones, setDisplayPhones] = useState("")

    useEffect(()=>{
        const _id = props.match.params._id;
          if(_id){
            Actions.getCallCampaign(_id, dispatch).then(response =>{
                setInForm('name', response.data.name)
                setInForm('direction', response.data.direction)
                setInForm('phoneNumbers', response.data.phoneNumbers)
                setInForm('startTime', response.data.startTime)
                setInForm('endTime', response.data.endTime)
                setInForm('finished', response.data.finished)
                setInForm('_id', response.data._id)
                setInForm('description', response.data.description)
                setDisplayDirection({value: response.data.direction, label: response.data.direction === "OUT" ? "Gọi ra" : response.data.direction === "IN" ? "Gọi vào" : "Không xác định"})
                var tmpStringPhones = '';
                for(var i=0;i<response.data.phoneNumbers.length;i++){
                    var tmpItem = response.data.phoneNumbers[i];

                    if(validatePhoneNumber(tmpItem)){
                        tmpStringPhones +=  tmpItem.trim() + ','
                    }else{  }

                }
                tmpStringPhones = tmpStringPhones.replace(/,\s*$/, "");
                setDisplayPhones(tmpStringPhones);
            });
          }
    }, [dispatch, props.match.params, setInForm])
    function handleSubmit() {
        Actions.saveCallCampaign(form).then(response => {
          if(response.code === 0){
                dispatch(showMessage({ message: "Lưu thông tin chiến dịch thành công" }))
                history.goBack();
          }
        })
    }
    function handleChangePhones(e){
      var newPhones = e.split(",")
      setInForm('phoneNumbers', newPhones)
    }
    function validatePhoneNumber(phone) {
        const regex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
        return regex.test(phone)
    }

    function handleUploadFile(e) {
        setDisplayPhones('');
        form.phoneNumbers = []
        const file = e.target.files[0];
        if (!file) {
            return;
        }
        const reader = new FileReader();
        reader.onload = (evt) => { // evt = on_file_select event
            /* Parse data */
            const bstr = evt.target.result;
            const wb = XLSX.read(bstr, {type:'binary'});
            /* Get first worksheet */
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            /* Convert array of arrays */
            const data = XLSX.utils.sheet_to_csv(ws, {header:1});
            /* Update state */
            const answer_array = data.split('\n');
            // console.log("Data>>>"+data);
            var tmpStringPhones = '';
            for(var i=0;i<answer_array.length;i++){
                var tmpItem = answer_array[i];

                if(validatePhoneNumber(tmpItem)){
                    tmpStringPhones +=  tmpItem.trim() + ','
                    form.phoneNumbers.push(tmpItem)
                }else{  }

            }
            tmpStringPhones = tmpStringPhones.replace(/,\s*$/, "");
            setDisplayPhones(tmpStringPhones);

        };
        reader.readAsBinaryString(file);

    }
    function handleDirectionChange(e){
      setInForm('direction', e.value)
      setDisplayDirection(e)
    }
    function canBeSave() {
        return (
            form && form.name && form.name.length > 0
        )
    }
    function canBeRemove() {
        return (
            form && form._id
        )
    }

    function onDelete (){
        Actions.removeCallCampaign(form._id).then(response => {
          if(response.code === 0){
                dispatch(showMessage({ message: "Xóa chiến dịch thành công" }))
                history.goBack();
          }
          else {
            dispatch(showMessage({message: response.message}))
          }
        })
        setConfirm(false);
    }
    return (
        <FusePageCarded
          classes={{
            toolbar: "p-0",
            header: "min-h-72 h-72 sm:h-136 sm:min-h-136"
          }}
          header={
            form && (
              <div className="flex flex-1 w-full items-center justify-between" id = "el-Personel-HeaderPage">
                <div className="flex flex-col items-start max-w-full">
                  <FuseAnimate animation="transition.slideRightIn" delay={300}>
                    <Typography className="normal-case flex items-center sm:mb-12" component={Link} role="button" to="/apps/calls/campaigns" color="inherit">
                      <Icon className="mr-4 text-20">arrow_back</Icon>
                      Chiến dịch
                    </Typography>
                  </FuseAnimate>
                  <div className="flex items-center max-w-full">

                    <div className="flex flex-col min-w-0">
                      <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                        <Typography className="text-16 sm:text-20 truncate">
                          {form.name ? form.name : 'Tạo chiến dịch'}
                        </Typography>
                      </FuseAnimate>
                      <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                        <Typography variant="caption">Chi tiết chiến dịch</Typography>
                      </FuseAnimate>
                    </div>
                  </div>
                </div>
                <div className = "el-SurveyEdit-Button">
                  <FuseAnimate animation="transition.slideRightIn" delay={300}>
                    <Button
                      className="whitespace-no-wrap btn-red"
                      variant="contained"
                      disabled={!canBeRemove()}
                      onClick = {()=>setConfirm(true)}
                    >
                      Xóa
                    </Button>
                  </FuseAnimate>
                  {" "}
                  <FuseAnimate animation="transition.slideRightIn" delay={300}>
                    <Button
                      // component={Link} to="/apps/calls/campaigns"
                      className="whitespace-no-wrap"
                      color="secondary"
                      variant="contained"
                      disabled={!canBeSave()}
                      onClick={handleSubmit}
                    >
                      Lưu thông tin
                    </Button>
                  </FuseAnimate>
                </div>
              </div>
            )
          }
          content={
            <div className="p-12" id = "el-Personel-Content">
              <ConfirmDialog
                title="Xóa chiến dịch?"
                open={confirm}
                onClose={()=>setConfirm(false)}
                onSubmit={onDelete}
                message="Bạn có chắc chắn muốn xóa chiến dịch hiện tại"
                count={5}
              />
              <div className="p-16 sm:p-24" id = "el-Personel-Info">
                <div>

                  <TextField
                    className="mt-8 mb-16"
                    error={form.name === '' || form.name === null}
                    required
                    label="Tên chiến dịch"
                    autoFocus
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    onInput = {(e) =>{
                      e.target.value = e.target.value.replace(/[^0-9a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồố&!ộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ,-/.\s]/gi, '')
                    }}
                    variant="outlined"
                    fullWidth
                  />
                  <TextField
                    className="mt-8 mb-16"
                    required
                    label="Mô tả"
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    onInput = {(e) =>{
                      e.target.value = e.target.value.replace(/[^0-9a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồố&!ộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ,-/.\s]/gi, '')
                    }}
                    variant="outlined"
                    fullWidth
                  />
                  <FuseChipSelect
                    className="mt-8 mb-16"
                    value = {displayDirection}
                    onChange={(e) => handleDirectionChange(e)}
                    placeholder="Chọn loại cuộc gọi"
                    textFieldProps={{
                        label: 'Loại cuộc gọi',
                      InputLabelProps: {
                          shrink: true
                      },
                        variant: 'outlined'
                    }}
                    options={
                      [
                      {value: 'OUT', label: "Gọi ra"},
                      {value: 'IN', label: "Gọi vào"},
                      {value: 'UNDEFINED', label: "Không xác định"},
                      ]
                    }
                  />
                  <FuseChipSelect
                    className="mt-8 mb-16"
                    value = {displayChoose}
                    onChange={(e) => {setIsInputFromExcel(e.value); setDisplayChoose(e)}}
                    placeholder="Chọn hình thức nhập"
                    textFieldProps={{
                        label: 'Hình thức nhập số điện thoại',
                      InputLabelProps: {
                          shrink: true
                      },
                        variant: 'outlined'
                    }}
                    options={
                      [
                      {value: false, label: "Nhập số điện thoại"},
                      {value: true, label: "Lấy số điện thoại từ file excel"},
                      ]
                    }
                  />
                  {isInputFromExcel ?
                    <div>
                      Chọn file excel chứa danh sách số điện thoại
                      <React.Fragment>
                        <input
                          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                          className="hidden"
                          id="button-file"
                          type="file"
                          onChange={handleUploadFile}
                        />
                        <label
                          htmlFor="button-file"
                          className={
                            clsx(
                              classes.productImageUpload,
                              "flex items-center justify-center relative w-48 h-48 rounded-4 mr-16 overflow-hidden cursor-pointer shadow-1 hover:shadow-5"
                            )}
                        >
                          <Icon fontSize="large" color="action">cloud_upload</Icon>
                        </label>
                      </React.Fragment>
                    </div>
                  : <div></div>
                  }
                  <TextField
                    className="mt-8 mb-16"
                    required
                    // required
                    label="Số điện thoại (cách nhau bởi dấu phẩy)"
                    id="phoneNumbers"
                    name="phoneNumbers"
                    value={displayPhones}
                    onChange={e =>{handleChangePhones(e.target.value); setDisplayPhones(e.target.value)}}
                    variant="outlined"
                    fullWidth
                  />
                  <MuiPickersUtilsProvider utils={DateFnsUtils} locale={viLocale}>
                    <DatePicker
                      disableToolbar
                      className="mt-8 mb-16"
                      variant="inline"
                      label="Ngày bắt đầu"
                      helperText={null}
                      fullWidth
                      autoOk
                      inputVariant="outlined"
                      value={form.startTime ? moment(form.startTime).format("YYYY-MM-DD") : new Date()}
                      onChange={
                        date => {
                          setInForm('startTime', date);
                          (form.endTime === "" || moment(form.endTime).isBefore(date)) ? setInForm('endTime',moment(date).add(1, "days")) : setInForm('endTime', form.endTime)
                        }
                      }
                      format="dd/MM/yyyy"
                    />
                  </MuiPickersUtilsProvider>
                  <MuiPickersUtilsProvider  utils={DateFnsUtils} locale={viLocale}>
                    <DatePicker
                      disableToolbar
                      className="mt-8 mb-16"
                      variant="inline"
                      helperText={null}
                      fullWidth
                      autoOk
                      label="Ngày kết thúc"
                      inputVariant="outlined"
                      value={form.endTime ? moment(form.endTime).format("YYYY-MM-DD") : new Date()}
                      onChange={
                        date => {
                          setInForm('endTime', date);
                        }
                      }
                      format="dd/MM/yyyy"
                      minDate={moment(form.startTime).add(1, "days")}
                    />
                  </MuiPickersUtilsProvider>
                </div>

              </div>
            </div>
          }
        />
    )
}
export default CallCampaignEdit;
