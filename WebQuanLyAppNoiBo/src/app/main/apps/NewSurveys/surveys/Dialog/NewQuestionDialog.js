
import {  Dialog, DialogActions, DialogContent, DialogContentText, AppBar, FormLabel } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, TextField, Checkbox, Divider, Tooltip, FormControl, InputLabel, NativeSelect, Fab, Icon, Typography } from '@material-ui/core';
import { useForm, useUpdateEffect } from '@fuse/hooks';
import PollList from '../components/PollList';
import PollSmileyList from '../components/PollSmileyList'
const initialQuestion = {
    type: "TEXT",
    polls: [],
    title: '',
    instruction: '',
    dataType: 'TEXT',
    starNumb: 5,
    userField: 'UNDEFINED'
}
function NewQuestionDialog(props) {
   
    const { open, onCloseDialog } = props
    function canBeSave(){
        return form && form.type && form.title && form.title.length > 0
        // return true
    }


    const { onQuestionRemove, onQuestionChange, propsQuestion, index, isNew } = props;
    const { form, setForm, handleChange, setInForm } = useForm(propsQuestion);
    const [mIndex, setMIndex] = useState(-1)

    useEffect(() => {
        setForm(props.propsQuestion)
        setMIndex(index)
    },[props.propsQuestion])

    const handlePollsChange = useCallback((polls) => {
        setInForm(`polls`, polls);
    }, [setInForm]);
    useEffect(() => {
        setForm(propsQuestion);
    }, [propsQuestion]);

    function handleFormTypeChange(type) {
        var polls = [];
        var starNumb = 0;
        setInForm('type', type)
        setInForm('polls', polls);
        setInForm('starNumb', starNumb);
    }

    return (
        <Dialog open={open} onClose={onCloseDialog} maxWidth="md" aria-labelledby="form-dialog-title" classes={{ paper: "w-full h-auto m-24 rounded-8" }}>

            <div>
                <AppBar position="static" elevation={1} style={{ backgroundColor: "#00aa4f" }}>
                    <div className="m-8">
                        <div className="flex items-center w-full" style={{ minHeight: "60px", textAlign: "center" }}>
                            <Typography className="text-16 sm:text-20 p-12 truncate" style={{ margin: "auto" }}>
                                {props.title && props.title}
                            </Typography>
                        </div>
                    </div>
                </AppBar>
                {
                    form && 
                    <DialogContent>
                    <TextField
                className="mt-8 mb-16"
                error={form.title === ''}
                label="Tên câu hỏi"
                name="title"
                value={form.title}
                margin="dense"
                onChange={handleChange}
                variant="outlined"
                fullWidth
            />
            <TextField
                className="mt-8 mb-16"
                label="Chú thích"
                name="instruction"
                margin="dense"
                value={form.instruction ? form.instruction : ""}
                onChange={handleChange}
                variant="outlined"
                fullWidth
            />
            <FormControl className="w-full">
                <InputLabel>Chọn loại câu hỏi</InputLabel>
                <NativeSelect
                    className="mt-8 mb-16"
                    name="type"
                    fullWidth
                    value={form.type ? form.type : ""}
                    onChange={e => handleFormTypeChange(e.target.value)}
                >
                    <option value="TEXT">Kiểu văn bản</option>
                    <option value="DROPDOWN">Kiểu dropdown</option>
                    <option value="SINGLECHOICE">Lựa chọn một</option>
                    <option value="MULTIPLECHOICE">Lựa chọn nhiều</option>
                    <option value="RATING_STAR">Đánh giá theo thang điểm</option>
                    <option value="SMILEY">Đánh giá bằng biểu tượng</option>
                </NativeSelect>
            </FormControl>
            {
                form.type === "TEXT" && <FormControl className="w-full">
                    <InputLabel>Kiểu dữ liệu</InputLabel>
                    <NativeSelect
                        className="mt-8 mb-16"
                        name="dataType"
                        fullWidth
                        value={form.dataType ? form.dataType : ""}
                        onChange={handleChange}
                    >
                        <option value="TEXT">Văn bản tùy ý</option>
                        <option value="EMAIL">Email</option>
                        <option value="NUMBER">Chữ số</option>
                        <option value="DATE">Ngày tháng</option>
                        <option value="TEL">Số điện thoại</option>
                        <option value="TIME">Thời gian</option>
                        <option value="COLOR">Màu sắc</option>
                        <option value="IMAGE">Hình ảnh</option>
                        <option value="IMAGES">Nhiều hình ảnh</option>
                        <option value="TEXTS">Nhiều văn bản</option>
                        <option value="TEXTAREA">Đoạn văn bản</option>
                    </NativeSelect>
                </FormControl>
            }
            {
                form.type === "DROPDOWN" &&
                <div>
                    <PollList type={form.type} polls={form.polls ? form.polls : []} onPollsChange={handlePollsChange} />
                </div>
            }
            {
                (form.type === "SINGLECHOICE" || form.type === "MULTIPLECHOICE") && <div>
                    <PollList polls={form.polls ? form.polls : []} onPollsChange={handlePollsChange} />
                </div>
            }
            {
                form.type === "RATING_STAR" &&
                <div>
                    <FormControl className="w-full">
                        <InputLabel>Thang điểm đánh giá</InputLabel>
                        <NativeSelect
                            className="mt-8 mb-16"
                            name="starNumb"
                            fullWidth
                            value={form.starNumb}
                            defaultValue={5}
                            onChange={handleChange}
                        >
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                            <option value={4}>4</option>
                            <option value={5}>5</option>
                            <option value={6}>6</option>
                            <option value={7}>7</option>
                            <option value={8}>8</option>
                            <option value={9}>9</option>
                            <option value={10}>10</option>
                        </NativeSelect>
                    </FormControl>
                </div>
            }
            {
                form.type === "SMILEY" &&
                <div>
                    <PollSmileyList polls={form.polls ? form.polls : []} onPollsChange={handlePollsChange} />
                </div>
            }
            <div>
                <Checkbox
                    name="require"
                    checked={form.require === true}
                    onChange={handleChange}
                />
                <label>Bắt buộc</label>
            </div>
                </DialogContent>
                }
            </div>
            <DialogActions className='mb-10'>

                <Button onClick={e => {
                    console.log("===> question: ", form)
                    onQuestionChange(form, mIndex, isNew)
                }} variant="contained" color="primary" 
                disabled={!canBeSave()}>
                    LƯU
            </Button>
                <Button onClick={onCloseDialog} variant="contained" color="primary" >
                    ĐÓNG
            </Button>
            </DialogActions>
        </Dialog>
    );
}
export default NewQuestionDialog;