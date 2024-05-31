import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { Button, Tab, Tabs, TextField, Fab, Icon, Typography, FormControlLabel, Switch } from '@material-ui/core';
import { FuseAnimate, FusePageCarded } from '@fuse';
import { FuseScrollbars } from '@fuse';
import { useForm } from '@fuse/hooks';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import QuestionListItem from './components/QuestionListItem';
import * as Actions from './store/actions/survey.action';
import { showMessage } from 'app/store/actions'
import history from '@history';
import Tooltip from '@material-ui/core/Tooltip';
import IOSSwitch from './components/IOSSwitch'
import NewQuestionDialog from './Dialog/NewQuestionDialog'

import * as BaseControl from 'app/main/utils/VTBaseControl'

const useStyles = makeStyles(theme => ({
    addButton: {
        position: 'fixed',
        right: 12,
        top: '50%',
        zIndex: 1000
    },
    productImageUpload: {
        transitionProperty: 'box-shadow',
        transitionDuration: theme.transitions.duration.short,
        transitionTimingFunction: theme.transitions.easing.easeInOut,
    },
    productImageItem: {
        transitionProperty: 'box-shadow',
        transitionDuration: theme.transitions.duration.short,
        transitionTimingFunction: theme.transitions.easing.easeInOut,
        '&:hover': {
            '& $productImageFeaturedStar': {
                opacity: .8
            }
        },
        '&.featured': {
            pointerEvents: 'none',
            boxShadow: theme.shadows[3],
            '& $productImageFeaturedStar': {
                opacity: 1
            },
            '&:hover $productImageFeaturedStar': {
                opacity: 1
            }
        }
    }
}));
const initialSurvey = {
    _id: null,
    name: "",
    title: "",
    questions: [],
}
function SurveyEdit(props) {
    const dispatch = useDispatch();
    const [tabValue, setTabValue] = useState(0);
    const { form, handleChange, setInForm, setForm } = useForm(initialSurvey);
    const classes = useStyles(props);
    const questionRef = useRef(null);
    const [mDisable, setMDisable] = useState(false)
    const [target, setTarget] = useState("USER")

    // const [openQuestionDialog, setOpenQuestionDialog] = useState({ open: false, question: {}, index: -1, isNew: true })

    useEffect(() => {
        const _id = props.match.params._id;
        switch (_id) {
            case "new":
                break;
            default:
                Actions.getSurvey(_id, dispatch).then(response => {
                    setForm(response.data)
                    if (response.data && response.data.disable) {
                        setMDisable(response.data.disable)
                    }
                    if (response.data && response.data.target) {
                        setTarget(response.data.target)
                    }
                    console.log("==> survey: ", response.data)
                });
        }
    }, [props.match.params])

    function handleSubmit() {
        console.log("==> questions: ", form.questions)
        Actions.saveSurvey({ name: form.name, title: form.title, _id: form._id, disable: mDisable, target: target }, [...form.questions])
            .then(response => {
                dispatch(showMessage({ message: "Lưu thông tin khảo sát thành công" }))
                history.push("/apps/surveys")
            })

    }

    const handleQuestionChange = useCallback((question, index) => {
        console.log("==> handleQuestionChange: ", question, " index: ", index)
        setInForm(`questions[${index}]`, question)
    }, [setInForm])

    function addNewQuestion(index) {
        console.log("===> add index: ", index)
        var question = {
            name: `Câu hỏi ${form.questions && form.questions.length + 1}`,
            type: "TEXT",
            polls: [],
            title: '',
            instruction: '',
            dataType: 'TEXT',
            starNumb: 5,
            userField: 'UNDEFINED'
        };
        setInForm('questions',
            [...form.questions.slice(0, index + 1),
                question,
            ...form.questions.slice(index + 1)])
        scrollToBottom()
    };

    function scrollToBottom() {
        if (questionRef && questionRef.current) {
            console.log("===> scroll to bottom: ", questionRef.current.scrollHeight)
            questionRef.current.scrollTop = questionRef.current.scrollHeight;
        }
    }

    function handleChangeTab(event, tabValue) {
        setTabValue(tabValue);
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

    function onDelete() {
        BaseControl.showConfirmAlert("Thông báo", "Bạn có chắc muốn xóa khảo sát này?", null, null, ((onSuccess) => {
            Actions.disableSurvey(form._id).then(response => {
                dispatch(showMessage({ message: "Xóa khảo sát thành công" }))
                history.push("/apps/surveys")
            })
        }),
            ((onCancel) => { })
        )
    }
    function handleQuestionRemove(index) {
        form.questions.splice(index, 1);
        setInForm(`questions`, form.questions);
    }
    return (
        <div>
            <FusePageCarded
                ref={questionRef}
                classes={{
                    toolbar: "p-0",
                    header: "min-h-72 h-72 sm:h-136 sm:min-h-136"
                }}
                header={
                    form && (
                        <div className="flex flex-1 w-full items-center justify-between">

                            <div className="flex flex-col items-start max-w-full">
                                <div className="flex items-center max-w-full w-full">
                                    <FuseAnimate animation="transition.slideRightIn" delay={300}>
                                        <Typography className="normal-case flex items-center sm:mb-12"
                                            role="button"
                                            color="inherit"
                                            onClick={e => history.goBack()}
                                        >
                                            <Icon className="mr-4 text-20">arrow_back</Icon>
                                        </Typography>
                                    </FuseAnimate>

                                    <div className="flex flex-col ml-20">
                                        <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                                            <Typography className="text-38 sm:text-20 truncate">
                                                {form.name ? form.name : 'Tạo khảo sát'}
                                            </Typography>
                                        </FuseAnimate>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <Button
                                    className="whitespace-no-wrap"
                                    variant="contained"
                                    disabled={!canBeRemove()}
                                    onClick={() => onDelete()}
                                    style={{ backgroundColor: "#D53636", color: "white" }}
                                >
                                    Xóa
                                </Button>
                                <Button
                                    className="whitespace-no-wrap ml-5"
                                    variant="contained"
                                    disabled={!canBeSave()}
                                    onClick={handleSubmit}
                                >
                                    Lưu thông tin
                                    </Button>
                                {/* {
                                    //TẠM ẨN CHỨC NĂNG CLONE NÀY ĐI, CHỈ HIỆN TRONG QUÁ TRÌNH PHÁT TRIỂN
                                    props.match.params._id && props.match.params._id !=="new" &&
                                    <Button
                                        className="whitespace-no-wrap ml-5"
                                        variant="contained"
                                        onClick={handleCloneSurvey}
                                    >
                                        Clone
                                    </Button>
                                } */}
                            </div>
                        </div>
                    )
                }
                contentToolbar={
                    <Tabs
                        value={tabValue}
                        onChange={handleChangeTab}
                        indicatorColor="secondary"
                        textColor="secondary"
                        variant="scrollable"
                        scrollButtons="auto"
                        classes={{ root: "w-full h-64 text-16" }}
                    >
                        <Tab className="h-64 normal-case" label="Thông tin cơ bản" />
                        <Tab className="h-64 normal-case" label="Bộ câu hỏi" />

                    </Tabs>
                }
                content={
                    <div className="p-12" style={{ paddingBottom: "25px" }}>

                        {tabValue === 0 && form && (
                            <div className="p-16 sm:p-24">
                                <div className="mt-10" style={{ width: "80%", margin: "auto", }}>

                                    <TextField
                                        className="mt-8 mb-16"
                                        error={form.name === ''}
                                        required
                                        label="Tên khảo sát"
                                        autoFocus
                                        id="name"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        variant="outlined"
                                        fullWidth
                                    />
                                    <TextField
                                        className="mt-8 mb-16"
                                        error={form.title === ''}
                                        label="Tiêu đề hiển thị"
                                        name="title"
                                        value={form.title}
                                        onChange={handleChange}
                                        variant="outlined"
                                        fullWidth
                                    />
                                    <div>
                                        <Tooltip title={"Bật/Tắt khảo sát"} placement="left">
                                            <FormControlLabel
                                                control={
                                                    <IOSSwitch
                                                        checked={!mDisable}
                                                        onChange={e => {
                                                            console.log("==> mdiable: ", mDisable)
                                                            setMDisable(!mDisable)
                                                        }}
                                                        labelPlacement="start"
                                                        value="disable"
                                                    />
                                                }
                                                label="Tắt/bật khảo sát"
                                            />
                                        </Tooltip>
                                    </div>
                                    {/* ở phiên bản dành cho app nội bộ này thì bỏ chức năng này, mặc định request lấy list dành cho nội bộ */}
                                    {/* <div>
                                        <Tooltip title={"Chỉ sử dụng khảo sát này trong nội bộ"} placement="left">
                                            <FormControlLabel
                                                control={
                                                    <IOSSwitch
                                                        checked={target === "EMPLOYEE"}
                                                        onChange={e => {
                                                            let temp = "EMPLOYEE"
                                                            if (e.target.checked === false) {
                                                                temp = "USER"
                                                            }
                                                            setTarget(temp)
                                                        }}
                                                        labelPlacement="start"
                                                        value="disable"
                                                    />
                                                }
                                                label="Chỉ sử dụng trong nội bộ"
                                            />
                                        </Tooltip>
                                    </div> */}
                                    <Button variant="contained" color="primary" style={{ float: "right", marginBottom: "20px" }} onClick={e => setTabValue(1)}>
                                        Tiếp tục
                                </Button>
                                </div>

                            </div>
                        )}
                        {
                            tabValue === 1 && form &&
                            <div className="mt-20 px-20 h-full" style={{ paddingBottom: "30px" }}>
                                <FuseScrollbars className='pb-20'>
                                    {
                                        form.questions.map((question, index) =>
                                            <div key={index}>
                                                <QuestionListItem isLast={(form.questions && index === form.questions.length - 1) ? true : false}
                                                    onSaveSurvey={handleSubmit}
                                                    onAddNewQuestion={addNewQuestion}
                                                    onQuestionChange={handleQuestionChange}
                                                    onQuestionRemove={handleQuestionRemove}
                                                    // onQuestionUpdate={handleQuestionUpdate}
                                                    question={question}
                                                    index={index}
                                                    key={index} />
                                            </div>
                                        )
                                    }
                                </FuseScrollbars>
                                <FuseAnimate animation="transition.expandIn" delay={300}>
                                    <Tooltip title={"Thêm câu hỏi mới"} placement="left">
                                        <Fab
                                            color="primary"
                                            aria-label="add"
                                            className={classes.addButton}
                                            onClick={e => addNewQuestion(form.questions ? form.questions.length : 0)}
                                        >
                                            <Icon>playlist_add</Icon>
                                        </Fab>
                                    </Tooltip>
                                </FuseAnimate>
                            </div>
                        }
                    </div>
                }
            />

        </div>
    )
}

export default SurveyEdit;
