import React, { useState, useEffect } from 'react';
import { TextField, Checkbox, IconButton, FormLabel, RadioGroup, Radio, FormGroup, FormControlLabel, Icon, FormControl } from '@material-ui/core';
import { useForm, useUpdateEffect } from '@fuse/hooks';

import { withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import { FuseChipSelect } from '@fuse';

const GreenRadio = withStyles({
    root: {
        color: "#487eb0",
        '&$checked': {
            color: "#487eb0",
        },
    },
    checked: {},
})(props => <Radio color="default" {...props} />);

const GreenCheckbox = withStyles({
    root: {
        color: "#487eb0",
        '&$checked': {
            color: "#487eb0",
        },
    },
    checked: {},
})(props => <Checkbox color="default" {...props} />);

const Star = ({ selected = false, onClick = f => f }) => (
    <IconButton onClick={onClick} style={{ padding: "8px" }}>
      {
        selected ?
          <Icon style={{ color: "orange" }}>
            star
          </Icon>
        :
        <Icon>
          star
        </Icon>
      }
    </IconButton>
);

function ImplementQuestion(props) {
    const { onAnswerChange, question, index } = props;
    const { form, handleChange, setInForm } = useForm(question);
    const [list, setList] = useState([]);
    const [starsSelected, selectStar] = useState(0);

    const [dropdownSuggesses, setDropdownSuggesses] = useState([])
    const [dropdownSelected, setDropdownSelected] = useState("")

    useEffect(() => {
        if (form.type === "MULTIPLECHOICE") {
            setInForm('answer', list)
        }
        else if (form.type === "RATING_STAR") {
            setInForm('answer', starsSelected)
        }
        else if (form.type === "DROPDOWN") {
            setInForm('answer', dropdownSelected.value)
        }
        else if (!form.answer) {
            setInForm('_id', form._id)
        }
    }, [setInForm, list, dropdownSelected, starsSelected, form._id, form.answer, form.type])

    useUpdateEffect(() => {
        // console.log("===> form change: ", form)
        onAnswerChange(form, index);
    }, [form, onAnswerChange, index, list, setInForm])

    useEffect(() => {
        let question = props.question
        if (question) {
            if (question.type === "DROPDOWN") {
                var temp = []
                form.polls.map((listpoll, index) => {
                    temp.push({ value: listpoll.value, label: listpoll.value })
                })
                setDropdownSuggesses(temp)
            }
        }
    }, [props.question])

    function handleChipChange(value) {
        setDropdownSelected(value)
    }


    return (
        <div style={{ color: "#818080", paddingBottom: "20px", fontSize: "14px" }}>
          <div>
            <FormLabel style={{ fontWeight: "nomal", fontSize: "16px", color: "#818080" }}>{index + 1}.</FormLabel>
            <FormLabel style={{ fontWeight: "bold", fontSize: "16px", color: "#E13939" }}>{question.require === true ? " *" : "   "}</FormLabel>
            <FormLabel style={{ fontWeight: "bold", fontSize: "16px", color: "#818080" }}>{` ${question.title}`}</FormLabel>
          </div>
          <div style={{ paddingLeft: "25px" }}>

            {
              form.type === "TEXT" &&
              <TextField
                className="mt-8 mb-16 pr-5"
                error={form.answer === ''}
                required={form.require}
                label={form.title}
                id="answer"
                // margin="dense"
                defaultValue=" "
                name="answer"
                value={form.answer}
                onChange={handleChange}
                // variant="outlined"
                multiline
                rowsMax="100"
                fullWidth
              />
            }

            {
              (form.type === "SMILEY") &&
              <div>
                <div className="mb-5" style={{ display: "flex" }}>
                  {
                    form.polls.map((pollItem, id)=>
                      <div key = {id}>
                        {
                          (pollItem.display === "IMAGE") &&
                          <div
                            style = {{ backgroundColor: (form.answer&&form.answer === pollItem.value)? "#487eb0" : "white", borderRadius: '10px' }}
                            className ="mr-2 el-HoverSurvey p-2"
                            onClick = {()=>setInForm('answer', pollItem.value)}
                          >
                            <img src ={pollItem.image} className ="mr-2" width = "40px" alt=""/>
                          </div>
                        }
                        {
                          (pollItem.display === "TEXTIMAGE") &&
                          <div style = {{ backgroundColor: (form.answer&&form.answer === pollItem.value)? "#487eb0" : "white", borderRadius: '10px'}} className ="mr-2 el-HoverSurvey p-2" onClick = {()=>setInForm('answer', pollItem.value)}>
                            <div style = {{ textAlign: "center"}}>
                              <img src ={pollItem.image} width = "40px" alt=""/>
                            </div>
                            <div style = {{ color: (form.answer&&form.answer === pollItem.value)? "white" : "currentColor" }}>
                              {pollItem.value}
                            </div>
                          </div>
                        }
                      </div>
                    )}
                </div>
              </div>
            }
            {
              form.type === "MULTIPLECHOICE" &&
              <div>
                <FormGroup className="mb-5 text-20">
                  {
                    form.polls.map((listpoll, index) =>
                      <div>
                        {
                          listpoll.display === "TEXT" &&
                          <FormControlLabel
                            control={
                              <GreenCheckbox
                                id='answer'
                                name='answer'
                                checked={list.includes(listpoll.value)}
                                value={listpoll.value}
                                onChange={e => { e.target.checked === true ? setList([...list, e.target.value]) : setList(list.filter(x => x !== e.target.value)) }} />
                            }
                            label={listpoll.value}
                          />
                        }
                        {
                          listpoll.display === "IMAGE" &&
                          <div style={{ display: "flex" }}>
                            <FormControlLabel
                              control={
                                <GreenCheckbox
                                  id='answer'
                                  name='answer'
                                  checked={list.includes(listpoll.value)}
                                  value={listpoll.value}
                                  onChange={e => { e.target.checked === true ? setList([...list, e.target.value]) : setList(list.filter(x => x !== e.target.value)) }}
                                />
                              }
                            />
                            <img src={process.env.REACT_APP_FILE_PREVIEW_URL + listpoll.image} width="48px" height="48px" alt="" />
                          </div>
                        }
                        {
                          listpoll.display === "TEXTIMAGE" &&
                          <div style={{ display: "flex" }}>
                            <FormControlLabel
                              control={

                                <GreenCheckbox id='answer'
                                  name='answer'
                                  checked={list.includes(listpoll.value)}
                                  value={listpoll.value}
                                  onChange={e => { e.target.checked === true ? setList([...list, e.target.value]) : setList(list.filter(x => x !== e.target.value)) }} />}
                              label={listpoll.value} />
                            <img src={process.env.REACT_APP_FILE_PREVIEW_URL + listpoll.image} width="48px" height="48px" alt="" />
                          </div>
                        }
                        {
                          listpoll.display === "OTHER" &&
                          <div style={{ display: "block", width: "100%", }}>
                            <FormControlLabel
                              control={
                                <GreenCheckbox
                                  id='answer'
                                  name='answer'
                                  checked={list.includes(listpoll.value)}
                                  value={listpoll.value}
                                  onChange={e => { e.target.checked === true ? setList([...list, e.target.value]) : setList(list.filter(x => x !== e.target.value)) }}
                                />
                              }
                              label={listpoll.value}
                            />
                            {
                              list.indexOf(listpoll.value) !== -1 &&
                              <FormControlLabel
                                style={{ width: "100%", marginLeft: "15px" }}
                                control={
                                  <TextField
                                    style={{ width: "100%", marginLeft: "15px" }}
                                    className="mt-8 mb-16 pr-5"
                                    error={form.answer === ''}
                                    required={form.require}
                                    label={listpoll.value}
                                    id="answer"
                                    defaultValue=""
                                    name="answer"
                                    value={form.otherAnswer && form.otherAnswer}
                                    onChange={e => { setInForm("otherAnswer", e.target.value) }}
                                    variant="outlined"
                                    multiline
                                    rowsMax="100"
                                    fullWidth
                                  />}
                              />
                            }
                          </div>
                        }

                      </div>

                    )
                  }
                </FormGroup>
              </div>
            }
            {

              form.type === "DROPDOWN" &&
              <div>
                <div className="mb-5">
                  <FormControl className="m-8 w-full">
                    <FuseChipSelect
                      className="w-full my-5"
                      // value={form.answer ? form.answer : ""}
                      value={dropdownSelected}
                      onChange={handleChipChange}
                      placeholder=""
                      name="answer"
                      textFieldProps={{
                        label: 'Lựa chọn',
                        InputLabelProps: {
                          shrink: true,
                        },
                        variant: 'standard',
                      }}
                      options={dropdownSuggesses}
                    />
                  </FormControl>
                </div>
              </div>
            }
            {
              form.type === "SINGLECHOICE" &&
              <div>
                <div className="mb-5">
                  <RadioGroup defaultValue="" name="answer" value={form.answer} onChange={handleChange} color="green">
                    {
                      form.polls.map((listpoll, index) =>
                        <div>
                          {
                            listpoll.display === "TEXT" &&
                            <FormControlLabel value={listpoll.value} control={<GreenRadio />} label={listpoll.value} />
                          }
                          {
                            listpoll.display === "IMAGE" &&
                            <div style={{ display: "flex" }}>
                              <FormControlLabel
                                control={<GreenRadio value={listpoll.value} />} />
                              <img src={process.env.REACT_APP_FILE_PREVIEW_URL + listpoll.image} width="48px" height="48px" alt="" />
                            </div>
                          }
                          {
                            listpoll.display === "TEXTIMAGE" &&
                            <div style={{ display: "flex" }}>
                              <FormControlLabel
                                control={<GreenRadio value={listpoll.value} />}
                                label={listpoll.value} />
                              <img src={process.env.REACT_APP_FILE_PREVIEW_URL + listpoll.image} width="48px" height="48px" alt="" />
                            </div>
                          }
                          {
                            listpoll.display === "OTHER" &&
                            <div style={{ display: "block", width: "100%", }}>
                              <FormControlLabel value={listpoll.value} control={<GreenRadio />} label={listpoll.value} />
                              {
                                form.answer === listpoll.value &&
                                <FormControlLabel
                                  style={{ width: "100%", marginLeft: "15px" }}
                                  control={
                                    <TextField
                                      style={{ width: "100%", marginLeft: "15px" }}
                                      className="mt-8 mb-16 pr-5"
                                      error={form.answer === ''}
                                      required={form.require}
                                      label={listpoll.value}
                                      id="answer"
                                      defaultValue=""
                                      name="answer"
                                      value={form.otherAnswer && form.otherAnswer}
                                      onChange={e => { setInForm("otherAnswer", e.target.value) }}
                                      variant="outlined"
                                      multiline
                                      rowsMax="100"
                                      fullWidth
                                    />}
                                />
                              }
                            </div>
                          }

                        </div>

                      )
                    }

                  </RadioGroup>
                </div>
              </div>
            }
            {
              form.type === "RATING_STAR" &&
              <div className="mb-5">
                <div className='w-full'>
                  {[...Array(form.starNumb)].map((n, i) => (
                    <Star
                      className='p-8'
                      key={i}
                      selected={i < starsSelected}
                      onClick={() => selectStar(i + 1)}
                    />
                  ))}
                </div>
                <p className="ml-5">
                  {starsSelected} / {form.starNumb} sao
                </p>
              </div>

            }
          </div>
        </div>
    )
}
export default ImplementQuestion;
