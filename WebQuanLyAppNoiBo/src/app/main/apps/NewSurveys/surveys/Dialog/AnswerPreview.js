import React, { useCallback, useState, useEffect } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, AppBar, Typography, Divider, FormLabel } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import ImplementQuestionPreview from '../components/ImplementQuestionPreview';
import { useForm } from '@fuse/hooks';
import * as BaseConfig from '../BaseConfig/BaseConfig'

const initialSurvey = {
    _id: null,
    name: "",
    title: "",
    questions: []
}
const initUser = {
    _id: null,
    phoneNumber: "",
    fullName: "",
}
const initResult = {
    surveyId: null,
    data: []
}
function AnswerPreview(props) {
    const dispatch = useDispatch();
    const { open, onCloseDialog } = props
    const { form, setForm } = useForm(initialSurvey);
    const { form: user, handleChange: handleUserChange, setForm: setUser, setInForm: setInUser } = useForm(initUser);
    const { form: result, setInForm: setResult } = useForm(initResult);

    return (
        <Dialog open={open} onClose={onCloseDialog} aria-labelledby="form-dialog-title" classes={{ paper: "w-full h-auto m-24 rounded-8" }}>

            <div style={{ pointerEvents: "none" }}>
                {/* <div style={{ position: "absolute", width: '100%', height: '100%' }}> */}
                <AppBar position="static" elevation={1} style={{ backgroundColor: `${BaseConfig.BaseColor}` }}>
                    <div className="m-8">
                        <div className="flex items-center w-full" style={{ minHeight: "80px", textAlign: "center" }}>
                            <Typography className="text-16 sm:text-20 p-12 truncate" style={{ margin: "auto", whiteSpace: "unset", wordBreak: "nomal" }}>
                                {props.title && props.title}
                            </Typography>
                        </div>
                    </div>
                </AppBar>
                <DialogContent>
                    <DialogContentText>
                        <div className="p-1">
                            {form.questions && (
                                <div className="p-8 sm:p-16">
                                    <FormLabel style={{ fontWeight: "bold", fontSize: "18px", color: `${BaseConfig.BaseColor}`, marginBottom: "10px" }}>THÔNG TIN</FormLabel>
                                    <div className="flex flex-wrap mt-2">
                                        <div className="md:w-1/2 sm:w-1/2 p-4">
                                            <TextField
                                                className="mt-8 mb-16"
                                                error={props.user && props.user.fullName === ''}
                                                required
                                                label="Tên bệnh nhân"
                                                margin="dense"
                                                id="fullName"
                                                name="fullName"
                                                value={props.user && props.user.fullName}
                                                onChange={handleUserChange}
                                                variant="outlined"
                                                fullWidth
                                                disable={true}
                                                focus={false}
                                            />
                                        </div>
                                        <div className="md:w-1/2 sm:w-1/2 p-4">
                                            <TextField
                                                className="mt-8 mb-16"
                                                error={props.user && props.user.phoneNumber === ''}
                                                required
                                                label="Số điện thoại"
                                                id="phoneNumber"
                                                name="phoneNumber"
                                                margin="dense"
                                                value={props.user && props.user.phoneNumber}
                                                onChange={handleUserChange}
                                                variant="outlined"
                                                fullWidth
                                                disable={true}
                                                focus={false}
                                            />
                                        </div>
                                    </div>
                                    {/* <Divider /> */}
                                    <div className="mt-5">
                                        <FormLabel style={{ fontWeight: "bold", fontSize: "18px", color: `${BaseConfig.BaseColor}`, marginBottom: "10px" }}>NỘI DUNG</FormLabel>
                                        <div className='mt-5'>
                                            {
                                                props.result && props.result.map((item, index) =>
                                                    <ImplementQuestionPreview question={item.question} index={index} key={index} defaultValue={item.data} />
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </DialogContentText>
                </DialogContent>
            </div>
            <DialogActions className='mb-10'>
                <Button onClick={onCloseDialog} variant="contained" color="primary" >
                    Đóng
                    </Button>
            </DialogActions>
        </Dialog>
    );
}
export default AnswerPreview;