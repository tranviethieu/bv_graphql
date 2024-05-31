import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Button, Tab, Tabs, TextField, Fab, Icon, Typography, Tooltip, Switch, FormControlLabel, Radio, RadioGroup } from '@material-ui/core';
import { FuseAnimate, FusePageCarded, FuseScrollbars } from '@fuse';
import { useForm } from '@fuse/hooks';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import QuestionListItem from './components/QuestionListItem';
import * as Actions from './store/actions/survey.action';
import { showMessage } from 'app/store/actions'
import history from '@history';
import ConfirmDialog from '@fuse/components/Confirm/ConfirmDialog';
import { withStyles } from '@material-ui/core/styles';

const BlueRadio = withStyles({
    root: {
        color: "#487eb0",
        '&$checked': {
            color: "#487eb0",
        },
    },
    checked: {},
})(props => <Radio color="default" {...props} />);

const useStyles = makeStyles(theme => ({
    addButton: {
        position: 'fixed',
        right   : 12,
        top  : '50%',
        zIndex  : 1000
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
    _id:null,
    name: "",
    title: "",
    questions:[]
}
function SurveyEdit(props) {
    const classes = useStyles(props);
    const dispatch = useDispatch();
    const [tabValue, setTabValue] = useState(0);
    const { form, handleChange, setInForm, setForm } = useForm(initialSurvey);
    const questionRef = useRef(null);
    const [confirm, setConfirm] = useState(false);

    useEffect(()=>{
        const _id = props.match.params._id;
        switch(_id){
            case "new":
                break;
            default:
            Actions.getSurvey(_id).then(response =>{
                setForm(response.data)
            });
        }
    }, [props.match.params])
    function handleSubmit() {
        // console.log("submit survey data:", form);
        Actions.saveSurvey({ name: form.name, title: form.title, _id: form._id }, [...form.questions]).then(response => {
            dispatch(showMessage({ message: "Lưu thông tin khảo sát thành công" }))
            history.push("/apps/surveys/search")
        })
    }

    const handleQuestionChange = useCallback((question,index) => {
        setInForm(`questions[${index}]`, question);

    }, [setInForm]);

    function addNewQuestion(index) {
        var question = {
            name: `Câu hỏi ${index + 1}`,
            type: "TEXT",
            polls: [],
            title: '',
            instruction: '',
            dataType: 'TEXT',
            starNumb: 5,
            userField:'UNDEFINED'
        };
        // setInForm('questions', [...form.questions, question])
        setInForm('questions', [...form.questions.slice(0, index + 1), question,  ...form.questions.slice(index + 1)])
        scrollToBottom();

    };

    function scrollToBottom() {
        if (questionRef && questionRef.current) {
            // console.log("===> scroll to bottom: ", questionRef.current.scrollHeight)
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

    function onDelete (){
      Actions.removeSurvey(form._id).then(response => {
        if(response.code === 0){
              dispatch(showMessage({ message: "Xóa khảo sát thành công" }))
              history.push("/apps/surveys/search")
        }
      })
      setConfirm(false);
    }
    function handleQuestionRemove(index) {
        form.questions.splice(index, 1);
        setInForm(`questions`, form.questions);
    }
    return (
        <FusePageCarded
          ref={questionRef}
          classes={{
            toolbar: "p-0",
            header: "min-h-72 h-72 sm:h-136 sm:min-h-136"
          }}
          header={
            form && (
              <div className="flex flex-1 w-full items-center justify-between el-HeaderPage" id = "el-SurveyEdit-HeaderPage">
                <div className="flex flex-col items-start max-w-full">
                  <FuseAnimate animation="transition.slideRightIn" delay={300}>
                    <Typography className="normal-case flex items-center sm:mb-12" component={Link} role="button" to="/apps/surveys/search" color="inherit">
                      <Icon className="mr-4 text-20">arrow_back</Icon>
                      Khảo sát
                    </Typography>
                  </FuseAnimate>
                  <div className="flex items-center max-w-full">

                    <div className="flex flex-col min-w-0">
                      <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                        <Typography className="text-16 sm:text-20 truncate">
                          {form.name ? form.name : 'Tạo khảo sát'}
                        </Typography>
                      </FuseAnimate>
                      <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                        <Typography variant="caption">Chi tiết khảo sát</Typography>
                      </FuseAnimate>
                    </div>
                  </div>
                </div>
                <div className = "el-SurveyEdit-Button">
                  <FuseAnimate animation="transition.slideRightIn" delay={300}>
                    <Button
                      className="whitespace-no-wrap"
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
                      // component={Link} to="/apps/surveys/search"
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
          contentToolbar={
            <Tabs
              value={tabValue}
              onChange={handleChangeTab}
              indicatorColor="secondary"
              textColor="secondary"
              variant="scrollable"
              scrollButtons="auto"
              classes={{ root: "w-full h-64" }}
              id = "el-SurveyEdit-Tabs"
            >
              <Tab className="h-64 normal-case" label="Thông tin cơ bản" />
              <Tab className="h-64 normal-case" label="Bộ câu hỏi" />

            </Tabs>
          }
          content={
            <div className="p-12" id = "el-SurveyEdit-Content">
              <ConfirmDialog
                title="Xóa khảo sát?"
                open={confirm}
                onClose={()=>setConfirm(false)}
                onSubmit={onDelete}
                message="Bạn có chắc chắn muốn xóa khảo sát hiện tại"
                count={5}
              />
              {tabValue === 0 && form && (
                <div className="p-16 sm:p-24" id = "el-SurveyEdit-Info">
                  <div>

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
                      onInput = {(e) =>{
                        e.target.value = e.target.value.replace(/[^0-9a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồố&!ộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ,-/.\s]/gi, '')
                      }}
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
                      onInput = {(e) =>{
                        e.target.value = e.target.value.replace(/[^0-9a-zàáạảãâầấậẩẫăằắặẳẵèéẹ&ẻẽêềếệểễìí!ịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ,-/.\s]/gi, '')
                      }}
                      variant="outlined"
                      fullWidth
                    />

                  </div>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={form.disable === false}
                        onChange={(e) => setInForm('disable',!e.target.checked)}
                        name="disable"
                        color="secondary"
                      />
                    }
                    label= "Tắt/bật khảo sát"
                  />
                  <RadioGroup defaultValue= {form.target ? form.target : "EMPLOYEE"} name="target" value={form.target} onChange={handleChange} color="green">
                    <FormControlLabel control={<BlueRadio value= "EMPLOYEE"/>} label = "Nội bộ"/>
                    <FormControlLabel control={<BlueRadio value= "USER"/>} label = "Khách hàng"/>
                    <FormControlLabel control={<BlueRadio value= "VISITOR"/>} label = "Khách vãng lai"/>
                  </RadioGroup>
                </div>
              )}
              {
                tabValue === 1 && form && <div className="mt-20 px-20 h-full">
                  <FuseScrollbars className='pb-20'>
                    {
                      form.questions.map((question, index) =>
                        <div key={index}>
                          <QuestionListItem isLast={(form.questions && index === form.questions.length - 1) ? true : false}
                            onSaveSurvey={handleSubmit}
                            onAddNewQuestion={addNewQuestion}
                            onQuestionChange={handleQuestionChange}
                            onQuestionRemove={handleQuestionRemove}
                            question={question}
                            index={index}
                            key={index} />
                        </div>
                      )
                    }
                  </FuseScrollbars>
                  <div id = "el-SurveyEdit-ButtonAdd">
                    <FuseAnimate animation="transition.expandIn" delay={300}>
                      <Tooltip title={"Thêm câu hỏi mới"} placement="bottom">
                        <Fab
                          color="primary"
                          aria-label="add"
                          className={classes.addButton + ' btn-blue'}
                          onClick={e => addNewQuestion(form.questions ? form.questions.length : 0)}
                        >
                          <Icon>playlist_add</Icon>
                        </Fab>
                      </Tooltip>
                    </FuseAnimate>
                  </div>
                </div>
              }
            </div>
          }
        />
    )
}

// export default withReducer("surveySurveys", reducer)(SurveyEdit);
export default SurveyEdit;
