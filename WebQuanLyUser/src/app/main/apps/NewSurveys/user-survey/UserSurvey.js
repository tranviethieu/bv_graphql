import React, { useCallback, useEffect, useState } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, AppBar, Typography, Divider, FormLabel } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { FuseAnimate } from '@fuse';
import ImplementQuestion from '../surveys/components/ImplementQuestion';
import * as Actions from './actions';
import { useForm } from '@fuse/hooks';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import viLocale from "date-fns/locale/vi";

import { showMessage } from 'app/store/actions'
import { withRouter } from 'react-router-dom';
import AnswerSuccess from '../surveys/Dialog/AnswerSuccess'
import LoadingOverlay from 'react-loading-overlay';

import * as BaseConfig from '../surveys/BaseConfig/BaseConfig'

const initialSurvey = {
    _id: null,
    name: "",
    title: "",
    questions: []
}

const initResult = {
    surveyId: null,
    data: []
}
function UserSurvey(props) {
    const dispatch = useDispatch();
    const { onCloseDialog, _id, onSubmitResult } = props
    const { form, setForm } = useForm(initialSurvey);
    const { form: result, setInForm: setResult } = useForm(initResult);
    const [open, setOpen] = useState(false)

    const [phoneNumber, setPhoneNumber] = useState("")
    const [loading, setLoading] = useState(false)

    function fetchData() {
        let surveyId = props.match.params._id
        if (surveyId) {
            setResult('surveyId', surveyId)
            Actions.get_survey(surveyId, dispatch).then(response => {
                setForm(response.data)
            });
        }
    }
    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        const phone = props.match.params.phoneNumber;
        console.log("==> phone: ", phone)
        setPhoneNumber(phone);
    }, [props])

    const onAnswerChange = useCallback((question, index) => {
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
        //app nội bộ thì không cần check phoneNumber vì ko cần nhập
        // if (phoneNumber && phoneNumber.length > 0) {
        if (checkResult() === true) {
            let tempData = []
            result.data.map(item => {
                let temp = { ...item, data: JSON.stringify(item.data) }
                tempData.push(temp)
            })
            let mResult = { ...result, data: tempData }

            console.log("phone: ", phoneNumber, " result: ", mResult)
            setLoading(true)

            Actions.submit_result({ data: mResult, phoneNumber }, dispatch)
                .then((response) => {
                    setLoading(false)
                    dispatch(showMessage({ message: "Thực hiện khảo sát thành công" }))
                    setOpen(true)
                })

        }
        // }
    }

    function canBeSave() {
        return (
            //app nội bộ thì bỏ check 2 thông số này
            // form && fullName && fullName.length > 0 && phoneNumber && phoneNumber.length > 0 && 
            checkResult()
        )
    }
    return (
        <LoadingOverlay
            active={loading}
            spinner
            text=''
            onClick={() => setLoading(false)}
        >
            <div style={{ minWidth: "320px", width: "100%", maxWidth: "680px", margin: "auto", backgroundColor: "white", overflow: "auto" }}>
                <AnswerSuccess open={open} onCloseDialog={e => setOpen(false)} />
                <AppBar position="static" elevation={1} style={{ backgroundColor: `${BaseConfig.BaseColor}` }}>
                    <div className="m-8">
                        <div className="flex items-center w-full " style={{ minHeight: "80px", textAlign: "center", }}>
                            <Typography className="text-16 sm:text-20 p-12 truncate" style={{ margin: "auto", whiteSpace: "unset", wordBreak: "nomal" }}>
                                {form && form.name && form.name}
                            </Typography>
                        </div>
                    </div>
                </AppBar>
                <DialogContent>
                    <DialogContentText>
                        <div className="p-1 text-16" style={{ margin: "auto" }}>
                            {form && form.questions ? (
                                <div className="p-8 sm:p-16">

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

                                    <DialogActions className='mb-10 mt-20'>
                                        <Button onClick={onCloseDialog} variant="contained" color="primary" style={{ backgroundColor: "#eb4034" }}>
                                            Hủy
                                </Button>
                                        <Button
                                            className="whitespace-no-wrap"
                                            variant="contained"
                                            color="primary"
                                            disabled={!canBeSave()}
                                            onClick={e => {
                                                handleSubmit();
                                                // onSubmitResult()
                                            }}
                                            style={{ backgroundColor: `${BaseConfig.BaseColor}` }}
                                        >
                                            Gửi
                                </Button>
                                    </DialogActions>
                                </div>
                            ) :
                                <div className="flex flex-1 items-center justify-between">
                                    <img src={"assets/icons/survey/oops.jpg"} alt={"oops"} style={{ width: "128px", height: "128px" }} />
                                    <span style={{ fontSize: "20px", paddingLeft: "10px", fontWeight: "bold" }} >Khảo sát không tồn tại hoặc đã bị xóa. Vui lòng kiểm tra lại!</span>
                                </div>
                            }
                        </div>
                    </DialogContentText>
                </DialogContent>
            </div>
        </LoadingOverlay>
    );
}
export default withRouter(React.memo(UserSurvey));