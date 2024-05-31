import React, { useCallback, useState } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, AppBar, Typography, Divider, FormLabel } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { FuseAnimate } from '@fuse';
import ImplementQuestion from '../components/ImplementQuestion';
import * as Actions from '../store/actions/survey.action';
import { useForm } from '@fuse/hooks';
import { showMessage } from 'app/store/actions'

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
  const { form: user, handleChange: handleUserChange, setForm: setUser } = useForm(initUser);
  const { form: result, setInForm: setResult } = useForm(initResult);

  const [loading, setLoading] = useState(false)

  function fetchData() {
    setForm({data:[]})
    setResult('surveyId', surveyIdProps)
    Actions.getSurvey(surveyIdProps, dispatch).then(response => {
      setForm(response.data)
    });
  }
  const onAnswerChange = useCallback((question, index) => {
    // setResult(`data[${index}]`, { ...result.data, questionId: question._id, required: question.require, data: JSON.stringify({ value: question.answer }), })
    // console.log("====>  answer")
    setResult(`data[${index}]`, { ...result.data, questionId: question._id, channel:"CRM", required: question.require, data: { value: question.answer, otherAnswer: question.otherAnswer } })
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
              // console.log("===> length 0")
              return (false)
            }
          }
        }
      }
    }
    return true
  }
  function handleSubmit() {
    if(loading){
      return
    }
    if (user.phoneNumber && user.phoneNumber.length > 0) {
      //Cần convert data của câu trả lời về dạng string để khớp với server
      if (checkResult() === true) {
        setLoading(true)
        let tempData = []
        result.data.map( item => {
          // console.log("===> item: ", item)
          let temp = {...item, data: JSON.stringify(item.data)}
          tempData.push(temp)
        } )
        let mResult = {...result, data:tempData}
        //
        if (user._id) {
          Actions.submitSurveyResult(user._id, mResult, dispatch)
            .then((response) => {
              setLoading(false)
              dispatch(showMessage({ message: "Thực hiện khảo sát thành công" }))
              onSubmitResult()
            })
          setUser(initUser)
        } else {
          Actions.createUser(user, dispatch).then(response => {
            if (response.data._id) {
              Actions.submitSurveyResult(response.data._id, mResult, dispatch)
                .then((response) => {
                  setLoading(false)
                  dispatch(showMessage({ message: "Thực hiện khảo sát thành công" }))
                  onSubmitResult()
                })
              setUser(initUser)
            }
          })
        }
      }
    }
  }
  function onFetchUser() {
      if (user.phoneNumber && user.phoneNumber.length > 0) {
          Actions.getUserInfo(user.phoneNumber, dispatch).then(response => {
              if (response.data && response.data.length > 0){
                  setUser(response.data[0]);
              }
              else{
                  setUser(initUser)
              }
          })
      }
    }
  function canBeSave() {
    return (
      form && user && user.fullName && user.fullName.length > 0 && user.phoneNumber && user.phoneNumber.length > 0 && checkResult()
    )
  }
  return (
    <Dialog open={open} onEnter={fetchData} onClose={onCloseDialog} aria-labelledby="form-dialog-title" classes={{paper: "w-full m-24 rounded-8"}} id = "el-ImplementSurveyDialog-Cover">
      <AppBar position="static" elevation={1} className = "el-ImplementSurvey-Title">
        <div className="m-8">
          <div className="flex flex-1 w-full items-center justify-between">
            <div className="flex flex-col items-start max-w-full">
              <div className="flex items-center max-w-full">
                <div className="flex flex-col min-w-0">
                  <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                    <Typography className="text-16 sm:text-20 truncate">
                      {form.name}
                    </Typography>
                  </FuseAnimate>
                  <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                    <Typography variant="caption">Thực hiện khảo sát</Typography>
                  </FuseAnimate>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppBar>
      <DialogContent>
        <DialogContentText>
          <div className="p-1">
            {form.questions &&
              <div className="p-8 sm:p-16">
                <FormLabel className = "el-TitleName">THÔNG TIN</FormLabel>
                <div className="flex flex-wrap">
                  <div className="md:w-1/2 sm:w-1/2 p-4">
                    <TextField
                      className="mt-8 mb-16"
                      error={user.phoneNumber === ''}
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
                        if (e.charCode === 13) onFetchUser();
                      }}
                    />
                  </div>
                  <div className="md:w-1/2 sm:w-1/2 p-4">
                    <TextField
                      className="mt-8 mb-16"
                      error={user.fullName === ''}
                      required
                      autoFocus
                      label="Tên khách hàng"
                      margin="dense"
                      id="fullName"
                      name="fullName"
                      value={user.fullName || ''}
                      onChange={handleUserChange}
                      // variant="outlined"
                      fullWidth
                    />
                  </div>
                </div>
                <Divider />
                <div className="mt-5">
                  <FormLabel className = "el-TitleName">NỘI DUNG</FormLabel>
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
