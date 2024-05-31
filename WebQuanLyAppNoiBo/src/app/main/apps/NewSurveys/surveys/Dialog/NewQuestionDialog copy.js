
import {  Dialog, DialogActions, DialogContent, DialogContentText, AppBar, FormLabel } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, TextField, Checkbox, Divider, Tooltip, FormControl, InputLabel, NativeSelect, Fab, Icon, Typography } from '@material-ui/core';
import { useForm, useUpdateEffect } from '@fuse/hooks';
import PollList from '../components/PollList';
import PollSmileyList from '../components/PollSmileyList'


const initialQuestion = {
    name: '',
    type: "TEXT",
    polls: [],
    title: '',
    instruction: '',
    dataType: 'TEXT',
    starNumb: 5,
    userField: 'UNDEFINED'
}

// var question = {
//     name: `Câu hỏi ${form.questions && form.questions.length + 1}`,
//     type: "TEXT",
//     polls: [],
//     title: '',
//     instruction: '',
//     dataType: 'TEXT',
//     starNumb: 5,
//     userField: 'UNDEFINED'
// };
function NewQuestionDialog(props) {
   
    const { onQuestionChange, propsQuestion, index } = props;
    const { open, onCloseDialog } = props
    const { form, setForm, handleChange, setInForm } = useForm(question);
    // const [question, setQuestion] = useState(initialQuestion)

    console.log("===> chay vao dialog roi nhe")
    useEffect(() => {
        // setQuestion(props.propsQuestion)
        setForm(props.propsQuestion)
    },[props.propsQuestion])

    // const handlePollsChange = useCallback((polls) => {
    //     setForm(question)
    // }, [question]);

    function handlePollsChange(polls){
        // setQuestion({...question, polls: polls})
    }
    function canBeSave(){
        return question && question.type && question.title && question.title.length > 0 && question.instruction && question.instruction.length > 0
    }
    // useUpdateEffect(() => {
    //     onQuestionChange(form, index);
    // }, [form, onQuestionChange, index]);

    // useEffect(() => {
    //     setForm(question);
    // }, [question]);

    // function handleFormTypeChange(type) {
    //     var polls = [];
    //     var starNumb = 0;
    //     setInForm('type', type)
    //     setInForm('polls', polls);
    //     setInForm('starNumb', starNumb);
    // }

    function handleChangeTitle(e)
    {
        setQuestion({...question, title: e.target.value})
    }
    function handleChangeNote(e)
    {
        setQuestion({...question, instruction:e.target.value})
    }

    return (
        <Dialog open={open} onClose={onCloseDialog} aria-labelledby="form-dialog-title" classes={{ paper: "w-full h-auto m-24 rounded-8" }}>

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
                    {/* <DialogContentText> */}
                        {/* <div className="mt-10 p-24" style={{ width: "80%", margin: "auto", marginTop: "30px", boxShadow: "0 4px 8px 0 rgba(255, 255, 255, 0.3), 0 6px 20px 0 rgba(0, 0, 0, 0.19", borderRadius: "5px", }}> */}

                            {/* <Typography className="font-bold text-18">
                                Câu hỏi số {(index + 1)}
                            </Typography> */}
                        
                            <TextField
                                className="mt-8 mb-16"
                                error={!form.title || form.title === ''}
                                label="Tên câu hỏi"
                                name="title"
                                value={form.title ||""}
                                autoFocus
                                margin="dense"
                                onChange={handleChangeTitle}
                                variant="outlined"
                                fullWidth
                            />
                            <TextField
                                className="mt-8 mb-16"
                                label="Chú thích"
                                name="instruction"
                                margin="dense"
                                value={form.instruction ? form.instruction : ""}
                                onChange={handleChangeNote}
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
                                    onChange={e => {
                                        setQuestion({...question, type: e.target.value})
                                    }}
                                >
                                    <option value="TEXT">Kiểu văn bản</option>
                                    {/* <option value="DROPDOWN">Kiểu dropdown</option> */}
                                    <option value="SINGLECHOICE">Lựa chọn một</option>
                                    <option value="MULTIPLECHOICE">Lựa chọn nhiều</option>
                                    <option value="RATING_STAR">Đánh giá theo thang điểm</option>
                                    <option value="SMILEY">Đánh giá bằng biểu tượng</option>
                                </NativeSelect>
                            </FormControl>
                            {
                                question.type === "TEXT" && <FormControl className="w-full">
                                    <InputLabel>Kiểu dữ liệu</InputLabel>
                                    <NativeSelect
                                        className="mt-8 mb-16"
                                        name="dataType"
                                        fullWidth
                                        value={question.dataType ? question.dataType : ""}
                                        onChange={e => {
                                            setQuestion({...question, dataTyle : e.target.value})
                                        }}
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
                            {/* {
                                question && question.type === "DROPDOWN" &&
                                <div>
                                    <PollList polls={question && question.polls ? question.polls : []} onPollsChange={handlePollsChange} />
                                </div>
                            } */}
                            {
                                (question.type === "SINGLECHOICE" || question.type === "MULTIPLECHOICE") && <div>
                                    <PollList polls={question.polls ? question.polls : []} onPollsChange={handlePollsChange} />
                                </div>
                            }
                            {
                                question.type === "RATING_STAR" &&
                                <div>
                                    <FormControl className="w-full">
                                        <InputLabel>Thang điểm đánh giá</InputLabel>
                                        <NativeSelect
                                            className="mt-8 mb-16"
                                            name="starNumb"
                                            fullWidth
                                            value={question.starNumb && question.starNumb}
                                            defaultValue={5}
                                            onChange={e => {
                                                setQuestion({...question, starNumb: e.target.value})
                                            }}
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
                                question.type === "SMILEY" &&
                                <div>
                                    <PollSmileyList polls={question.polls ? question.polls : []} onPollsChange={handlePollsChange} />
                                </div>
                            }
                            <div>
                                <Checkbox
                                    name="require"
                                    checked={question.require === true}
                                    onChange={e => {
                                        setQuestion({...question, require: e.target.checked})
                                    }}
                                />
                                <label>Bắt buộc</label>
                            </div>
                            {/* <Divider className="mt-10 dark" /> */}
                        {/* </div> */}
                    {/* </DialogContentText> */}
                </DialogContent>
                }
            </div>
            <DialogActions className='mb-10'>

                <Button onClick={e => {
                    console.log("===> question: ", question)
                    // onQuestionChange(question)
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