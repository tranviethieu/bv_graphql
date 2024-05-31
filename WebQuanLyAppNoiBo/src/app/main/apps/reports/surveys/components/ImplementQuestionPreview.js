import React, { useState, useEffect } from 'react';
import { TextField, Checkbox, IconButton, FormLabel, RadioGroup, Radio, FormGroup, FormControlLabel, Icon } from '@material-ui/core';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { useForm, useUpdateEffect } from '@fuse/hooks';

import { withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';

const useStyles = makeStyles({
    root: {
        '&:hover': {
            backgroundColor: 'transparent',
        },
    },
    icon: {
        borderRadius: '50%',
        width: 16,
        height: 16,
        boxShadow: 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
        backgroundColor: '#f5f8fa',
        backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
        '$root.Mui-focusVisible &': {
            outline: '2px auto rgba(19,124,189,.6)',
            outlineOffset: 2,
        },
        'input:hover ~ &': {
            backgroundColor: '#ebf1f5',
        },
        'input:disabled ~ &': {
            boxShadow: 'none',
            background: 'rgba(206,217,224,.5)',
        },
    },
    checkedIcon: {
        backgroundColor: '#137cbd',
        backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
        '&:before': {
            display: 'block',
            width: 16,
            height: 16,
            backgroundImage: 'radial-gradient(#fff,#fff 28%,transparent 32%)',
            content: '""',
        },
        'input:hover ~ &': {
            backgroundColor: '#106ba3',
        },
    },
});

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
const GreenRadio = withStyles({
    root: {
        color: green[400],
        '&$checked': {
            color: green[600],
        },
    },
    checked: {},
})(props => <Radio color="default" {...props} />);

const GreenCheckbox = withStyles({
    root: {
        color: green[400],
        '&$checked': {
            color: green[600],
        },
    },
    checked: {},
})(props => <Checkbox color="default" {...props} />);

function ImplementQuestionPreview(props) {
    const classes = useStyles();
    const { question, index, defaultValue } = props;

    const formInit = {
        ...question,
        answer: props.defaultValue ? props.defaultValue.value : null,
        otherAnswer: props.defaultValue ? props.defaultValue.otherAnswer : null,
    }
    const { form, handleChange, setInForm } = useForm(formInit);
    const [list, setList] = useState([]);
    const [starsSelected, selectStar] = useState(0);

    useEffect(() => {
        console.log("===> answer value: ", defaultValue)
        console.log("====> question: ", question)
        setInForm('_id', form._id)
        switch (form.type) {
            case 'MULTIPLECHOICE':
                {
                    setList(defaultValue.value)
                    setInForm('answer', defaultValue.value, 'otherAnswer', defaultValue.otherAnswer)
                    break
                }
            case 'SINGLECHOISE':
                {
                    setList(defaultValue.value)
                    setInForm('answer', defaultValue.value, 'otherAnswer', defaultValue.otherAnswer)
                    break
                }
            case 'RATING_STAR':
                {
                    selectStar(defaultValue.value)
                    setInForm('answer', defaultValue.value)
                    break
                }
            case 'TEXT':
                {
                    setInForm('answer', defaultValue.value ? defaultValue.value : "")
                    break
                }
            default:
                {
                    setInForm('answer', defaultValue.value ? defaultValue.value : null)
                }
        }

    }, [defaultValue])

    return (
        <div style={{ color: "rgba(0, 0, 0, 0.87)", paddingBottom: "5px" }}>
            <div>
                {/* <FormLabel style={{ fontWeight: "nomal", fontSize: "16px", color: "#818080" }}>{index + 1}.</FormLabel>
                <FormLabel style={{ fontWeight: "bold", fontSize: "16px", color: "#E13939" }}>{question.require === true ? " *" : "   "}</FormLabel>
                <FormLabel style={{ fontWeight: "bold", fontSize: "16px", color: "#818080" }}>{` ${question.title}`}</FormLabel> */}
                <FormLabel style={{ fontWeight: "nomal", fontSize: "16px", color: "rgba(0, 0, 0, 0.87)" }}>{index + 1}.</FormLabel>
                <FormLabel style={{ fontWeight: "nomal", fontSize: "16px", color: "rgba(0, 0, 0, 0.87)" }}>{question.require === true ? " *" : "   "}</FormLabel>
                <FormLabel style={{ fontWeight: "nomal", fontSize: "16px", color: "rgba(0, 0, 0, 0.87)" }}>{` ${question.title}`}</FormLabel>

            </div>
            <div style={{ paddingLeft: "25px" }}>

                {
                    form.type === "TEXT" &&
                    <TextField
                        className="mt-5 mb-16"
                        error={form.answer === ''}
                        required={form.require}
                        label={form.title}
                        id="answer"
                        // margin="dense"
                        name="answer"
                        value={form.answer ? form.answer : ""}
                        defaultValue=" "
                        onChange={handleChange}
                        variant="outlined"
                        fullWidth
                        multiline
                        rowsMax="100"
                        disable={true}
                    />
                }
                {
                    (form.type === "SMILEY") &&
                    <div>
                        <div className="mb-2" style={{ display: "flex" }}>
                            {
                                form.polls.map((pollItem, id) =>
                                    <div>
                                        {
                                            (pollItem.display === "IMAGE") &&
                                            <div style={{ margin: "8px", textAlign: "center" }} onClick={() => setInForm('answer', pollItem.value)}>
                                                <div style={{ textAlign: "center" }}>
                                                    <GreenRadio
                                                        checked={form.answer === pollItem.value}
                                                        onChange={handleChange}
                                                        disableRipple
                                                        name="radio-button-demo"
                                                    />
                                                </div>
                                                <div>
                                                    <img src={pollItem.image} className="mr-2" width="40px" alt="" />
                                                </div>
                                            </div>
                                        }
                                        {
                                            (pollItem.display === "TEXTIMAGE") &&
                                            <div style={{ margin: "8px", textAlign: "center" }} onClick={() => setInForm('answer', pollItem.value)}>
                                                <div style={{ textAlign: "center" }}>
                                                    <GreenRadio
                                                        checked={form.answer === pollItem.value}
                                                        onChange={handleChange}
                                                        disableRipple
                                                        name="radio-button-demo"
                                                    />
                                                </div>
                                                <div>
                                                    <div style={{ textAlign: "center" }}>
                                                        <img src={pollItem.image} width="40px" alt="" />
                                                    </div>
                                                    <div>
                                                        {pollItem.label}
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                )
                            }
                        </div>
                    </div>
                }
                {
                    form.type === "MULTIPLECHOICE" &&
                    <div>
                        <FormGroup className="mb-5">
                            {
                                form.polls.map((listpoll, index) =>
                                    <div>
                                        {
                                            listpoll.display === "TEXT" &&
                                            <FormControlLabel
                                                control={<GreenCheckbox id='answer' name='answer' checked={list.includes(listpoll.value)} value={listpoll.value} onChange={e => { console.log("===> pool: ", listpoll); e.target.checked === true ? setList([...list, e.target.value]) : setList(list.filter(x => x !== e.target.value)) }} />}
                                                label={listpoll.value}
                                            />
                                        }
                                        {
                                            listpoll.display === "IMAGE" &&
                                            <div style={{ display: "flex" }}>
                                                <FormControlLabel
                                                    control={<GreenCheckbox id='answer' name='answer' checked={list.includes(listpoll.value)} value={listpoll.value} onChange={e => { e.target.checked === true ? setList([...list, e.target.value]) : setList(list.filter(x => x !== e.target.value)) }} />}
                                                />
                                                <img src={process.env.REACT_APP_FILE_PREVIEW_URL + listpoll.image} width="48px" height="48px" alt="" />
                                            </div>
                                        }
                                        {
                                            listpoll.display === "TEXTIMAGE" &&
                                            <div style={{ display: "flex" }}>
                                                <FormControlLabel
                                                    control={<GreenCheckbox id='answer' name='answer' checked={list.includes(listpoll.value)} value={listpoll.value} onChange={e => { e.target.checked === true ? setList([...list, e.target.value]) : setList(list.filter(x => x !== e.target.value)) }} />}
                                                    label={listpoll.value} />
                                                <img src={process.env.REACT_APP_FILE_PREVIEW_URL + listpoll.image} width="48px" height="48px" alt="" />
                                            </div>
                                        }
                                        {
                                            listpoll.display === "OTHER" &&
                                            <div style={{ display: "block", width: "100%", }}>
                                                <FormControlLabel
                                                    control={<GreenCheckbox id='answer' name='answer' checked={list.includes(listpoll.value)} value={listpoll.value} onChange={e => { e.target.checked === true ? setList([...list, e.target.value]) : setList(list.filter(x => x !== e.target.value)) }} />}
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
                    <TextField
                        className="mt-8 mb-16"
                        error={form.answer === ''}
                        required={form.require}
                        label={form.title}
                        id="answer"
                        // margin="dense"
                        name="answer"
                        value={form.answer ? form.answer : ""}
                        defaultValue=" "
                        onChange={handleChange}
                        variant="outlined"
                        fullWidth
                        multiline
                        rowsMax="100"
                        disable={true}
                    />
                }
                {
                    form.type === "SINGLECHOICE" &&
                    <div>
                        <div className="mb-5">
                            <RadioGroup defaultValue="" name="answer" value={form.answer} onChange={handleChange}>
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
                                                        label={listpoll.label} />
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
                                                                    defaultValue=" "
                                                                    name="answer"
                                                                    value={form.otherAnswer && form.otherAnswer}
                                                                    variant="outlined"
                                                                    multiline
                                                                    rowsMax="100"
                                                                    fullWidth
                                                                    disable={true}
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
export default ImplementQuestionPreview;