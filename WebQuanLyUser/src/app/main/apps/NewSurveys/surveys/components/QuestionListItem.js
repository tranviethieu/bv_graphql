import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, TextField, Checkbox, ListItem, Divider, Tooltip, FormControl, InputLabel, NativeSelect, Fab, Icon, Typography, IconButton } from '@material-ui/core';
import { useForm, useUpdateEffect } from '@fuse/hooks';
import PollList from './PollList';
import PollSmileyList from './PollSmileyList'


const initialQuestion = {
    type: "TEXT",
    polls: [],
    title: '',
    instruction: '',
    dataType: 'TEXT',
    starNumb: 5,
    userField: 'UNDEFINED'
}
function QuestionListItem(props) {
    const { onQuestionRemove,
         onQuestionChange, 
        onAddNewQuestion,
        // onQuestionUpdate, 
        question, index } = props;
    const { form, setForm, handleChange, setInForm } = useForm(question);

    const [titleChanged, setTitleChanged] = useState(false)
    const [title, setTitle] = useState(question.title)
    const [instruction, setInstruction] = useState(question.instruction)
    const [instrucChanged, setInstrucChanged] = useState(false)


    const handlePollsChange = useCallback((polls) => {
        setInForm(`polls`, polls);
    }, [setInForm]);

    useEffect(() => {
        // console.log("====> id: ", question._id)
        setTitle(question.title)
        setInstruction(question.instruction)
        setForm(question)
    },[question])

    useUpdateEffect(() => {
        onQuestionChange(form, index);
    }, [form, onQuestionChange, index]);

    function handleFormTypeChange(type) {
        var polls = [];
        var starNumb = 0;
        setInForm('type', type)
        setInForm('polls', polls);
        setInForm('starNumb', starNumb);
    }
    function handleTitleChange(e)
    {  
        setTitleChanged(true)
        setTitle(e.target.value)
    }
    function handleInstructionChange(e){
        setInstrucChanged(true)
        setInstruction(e.target.value)
    }
    return (

        <div className="mt-10 p-24" style={{ width: "80%", margin: "auto", marginTop: "30px", boxShadow: "0 4px 8px 0 rgba(255, 255, 255, 0.3), 0 6px 20px 0 rgba(0, 0, 0, 0.19", borderRadius: "5px", }}>
            <div 
            // style={{ pointerEvents: "none" }}
            >
                <Typography className="font-bold text-18">
                    Câu hỏi số {(index + 1)}
                </Typography>
                <div className="flex">
                    <TextField
                        className="mt-8 mb-16"
                        error={title === ''}
                        label="Tên câu hỏi"
                        name="title"
                        value={title}
                        margin="dense"
                        onChange={handleTitleChange}
                        variant="outlined"
                        fullWidth
                        onKeyDown={e => {
                            if(e.keyCode == 13){
                                onQuestionChange({...form, title: title}, index)
                                setTitleChanged(false)
                             }
                        }}
                    />
                    {
                        titleChanged &&
                        <IconButton style={{marginLeft:"5px", width:"50px", height:"50px", marginTop:"5px"}}  onClick={e => {
                            onQuestionChange({...form, title: title}, index)
                            setTitleChanged(false)
                        }}>
                            <Icon>save</Icon>
                        </IconButton>
                    }
                </div>
                <div className="flex">
                    
                <TextField
                    className="mt-8 mb-16"
                    label="Chú thích"
                    name="instruction"
                    margin="dense"
                    value={instruction ? instruction : ""}
                    onChange={handleInstructionChange}
                    variant="outlined"
                    fullWidth
                    onKeyDown={e => {
                        if(e.keyCode == 13){
                            onQuestionChange({...form, instruction: instruction}, index)
                            setInstrucChanged(false)
                         }
                    }}
                />
                    {
                        instrucChanged &&
                        <IconButton style={{marginLeft:"5px", width:"50px", height:"50px", marginTop:"5px"}}  onClick={e => {
                            onQuestionChange({...form, instruction: instruction}, index)
                            setInstrucChanged(false)
                        }}>
                            <Icon>save</Icon>
                        </IconButton>
                    }
                </div>
               
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
            </div>

            <div className="w-full text-right">
                <Button onClick={e => {
                    console.log("==> index: ", index)
                    onQuestionRemove(index)}} 
                    className="justify-right" style={{ marginRight: "10px" }} variant="contained" color="primary"><Icon>delete</Icon>Xóa</Button>
                {/* <Button onClick={e => onQuestionUpdate(index)} className="justify-right" style={{ marginRight: "10px" }} variant="contained" color="primary"><Icon>update</Icon>Sửa</Button> */}
                <Button onClick={e =>
                    onAddNewQuestion(index)
                }
                    className="justify-right" variant="contained" color="primary"><Icon>add</Icon>Thêm mới</Button>
                {
                    props.isLast && props.isLast === true && <Button style={{ marginLeft: "10px" }} onClick={props.onSaveSurvey} className="justify-right" variant="contained" color="primary"><Icon>save</Icon>Lưu khảo sát</Button>
                }
            </div>
        </div>
    )
}
export default QuestionListItem;