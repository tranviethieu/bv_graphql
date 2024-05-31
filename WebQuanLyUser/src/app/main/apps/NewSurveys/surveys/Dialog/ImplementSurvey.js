import React, { useCallback, useState } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, AppBar, Typography, Divider, FormLabel } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { FuseAnimate } from '@fuse';
import ImplementQuestion from '../components/ImplementQuestion';
import * as Actions from '../store/actions/survey.action';
import { useForm } from '@fuse/hooks';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import viLocale from "date-fns/locale/vi";
import { showMessage } from 'app/store/actions'
import * as BaseConfig from '../BaseConfig/BaseConfig'

const initialSurvey = {
  _id: null,
  name: "",
  title: "",
  questions: []
}
const initUser = {
  _id: null,
  birthDay: new Date(),
  phoneNumber: "",
  fullName: "",
  address: ""
}
const initResult = {
  surveyId: null,
  data: []
}
function ImplementSurvey(props) {
  const dispatch = useDispatch();
  const { open, onCloseDialog, surveyIdProps, onSubmitResult } = props
  const { form, setForm } = useForm(initialSurvey);
  const { form: user, handleChange: handleUserChange, setForm: setUser, setInForm: setInUser } = useForm(initUser);
  const { form: result, setInForm: setResult } = useForm(initResult);

  const [loading, setLoading] = useState(false)

  function fetchData() {
    setForm({ data: [] })
    setResult('surveyId', surveyIdProps)
    Actions.getSurvey(surveyIdProps, dispatch).then(response => {
      setForm(response.data)
    });
  }
  const onAnswerChange = useCallback((question, index) => {
    // setResult(`data[${index}]`, { ...result.data, questionId: question._id, required: question.require, data: JSON.stringify({ value: question.answer }), })
    // console.log("====>  answer")
    setResult(`data[${index}]`, { ...result.data, questionId: question._id, questionName: question.title, required: question.require, data: { value: question.answer, otherAnswer: question.otherAnswer } })
  }, [setResult])

  function checkResult() {
    //check question require result
    for (let index in result.data) {
      let item = result.data[index]
      if (item) {
        if (item.required === true) {
          if (item.data.value === undefined || item.data.value === null || item.data.value <= 0) {
            return (false)
          } else {
            if (item.data.value.length === 0) {
              console.log("===> length 0")
              return (false)
            }
          }
        }
      }
    }
    return true
  }
  function handleSubmit() {
    if (loading) {
      return
    }
    if (user.phoneNumber && user.phoneNumber.length > 0) {
      //Cần convert data của câu trả lời về dạng string để khớp với server
      if (checkResult() === true) {
        setLoading(true)
        let tempData = []
        result.data.map(item => {
          // console.log("===> item: ", item)
          let temp = { ...item, data: JSON.stringify(item.data) }
          tempData.push(temp)
        })
        let mResult = { ...result, data: tempData }
        //
        Actions.submitSurveyResult(user.phoneNumber, user.fullName, mResult, dispatch)
          .then((response) => {
            setLoading(false)
            console.log("submit survey response: ", response)
            dispatch(showMessage({ message: "Thực hiện khảo sát thành công" }))
            onSubmitResult()
          })
      }
    }
  }

  function canBeSave() {
    return (
      form && user && user.fullName && user.fullName.length > 0 && user.phoneNumber && user.phoneNumber.length > 0 && checkResult()
    )
  }
  return (
    <Dialog open={open} onEnter={fetchData} onClose={onCloseDialog} aria-labelledby="form-dialog-title" classes={{ paper: "w-full h-auto m-24 rounded-8" }}>
      <AppBar position="static" elevation={1} style={{ backgroundColor: `${BaseConfig.BaseColor}` }}>
        <div className="m-8">
          <div className="flex items-center w-full" style={{ minHeight: "80px", textAlign: "center" }}>
            <Typography className="text-16 sm:text-20 p-12 truncate" style={{ margin: "auto", whiteSpace: "unset", wordBreak: "nomal" }}>
              {form.name && form.name}
            </Typography>
          </div>
        </div>
      </AppBar>
      <DialogContent>
        <DialogContentText>
          <div className="p-1">
            {form.questions &&
              <div className="p-8 sm:p-16">
                <FormLabel style={{ fontWeight: "bold", fontSize: "18px", color: `${BaseConfig.BaseColor}`, marginBottom: "20px" }}>THÔNG TIN</FormLabel>
                <div className="flex flex-wrap">
                  <div className="md:w-1/2 sm:w-1/2 p-4">
                    <TextField
                      className="mt-8 mb-16"
                      // error={user.fullName === ''}
                      required
                      autoFocus
                      label="Tên tên khách hàng"
                      margin="dense"
                      id="fullName"
                      name="fullName"
                      value={user.fullName || ''}
                      onChange={handleUserChange}
                      // variant="outlined"
                      fullWidth
                    />
                  </div>
                  <div className="md:w-1/2 sm:w-1/2 p-4">
                    <TextField
                      className="mt-8 mb-16"
                      // error={user.phoneNumber === ''}
                      required
                      label="Số điện thoại"
                      id="phoneNumber"
                      name="phoneNumber"
                      margin="dense"
                      value={user.phoneNumber}
                      onChange={handleUserChange}
                      // variant="outlined"
                      fullWidth
                      onKeyPress={e => {
                        // if (e.charCode === 13) onFetchUser();
                      }}
                    />
                  </div>
                </div>
                {/* <Divider /> */}
                <div className="mt-5">
                  <FormLabel style={{ fontWeight: "bold", fontSize: "18px", color: `${BaseConfig.BaseColor}`, marginBottom: "20px" }}>NỘI DUNG</FormLabel>
                  <div className='mt-20'>
                    {
                      form.questions.map((question, index) =>
                        <ImplementQuestion onAnswerChange={onAnswerChange} question={question} index={index} key={index} />
                      )
                    }
                  </div>
                </div>
              </div>
            }
          </div>
        </DialogContentText>
      </DialogContent>
      <DialogActions className='mb-10'>
        <Button onClick={onCloseDialog} variant="contained" color="primary" style={{ backgroundColor: "#D53636" }}>
          Hủy
        </Button>
        <Button
          className="whitespace-no-wrap"
          variant="contained"
          color="primary"
          disabled={!canBeSave()}
          onClick={e => {
            handleSubmit();
          }}
        >
          Gửi
          </Button>
      </DialogActions>
    </Dialog>
  );
}
export default ImplementSurvey;