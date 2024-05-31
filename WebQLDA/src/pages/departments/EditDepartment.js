import React, { useState, useEffect } from 'react';
import { TextField, Typography, FormControlLabel, Switch } from '@material-ui/core';
import { Card, CardBody, CardHeader, Row, Col, ButtonGroup } from "reactstrap";
import { useForm } from 'hooks';
import confirm from 'components/Confirmation';
import { makeStyles } from '@material-ui/styles';
import _ from '@lodash';
import Page from "components/Page";
import { QUERY_DEPARTMENT, MUTATION_SAVE_DEPARTMENT, MUTATION_REMOVE_DEPARTMENT } from "./query";
import { withApollo } from "react-apollo";
import authCheck from "utils/authCheck";
import DaySetting from './components/DaySetting';
import Button from '@material-ui/core/Button';

const DayTemplates = [{ dayOfWeek: "MONDAY", maxProcess: 9 }, { dayOfWeek: "TUESDAY", maxProcess: 9 }, { dayOfWeek: "WEDNESDAY", maxProcess: 9 }, { dayOfWeek: "THURSDAY", maxProcess: 9 }, { dayOfWeek: "FRIDAY", maxProcess: 9 }, { dayOfWeek: "SATURDAY", maxProcess: 9 }, { dayOfWeek: "SUNDAY", maxProcess: 9 }];
const initialState = {
    name: '',
    description: '',
    status: false,
    hasAppointment: false
}
const validDayTimes = (workDays) => {
    const validDays = initialState.workingTimes;
    if (!workDays)
        return validDays;
    for (var i = 0; i < validDays.length; i++) {
        var day = validDays[i];
        var found = workDays.filter((item) => (item.dayOfWeek == day.dayOfWeek));

        if (found.length > 0) {
            validDays[i].maxProcess = found[0].maxProcess;
            validDays[i].timeFrame = found[0].timeFrame;
            console.log("validDays", i, validDays[i]);
        }
    }
    console.log("validDays:", validDays);
    return validDays;
}


const useStyles = makeStyles(theme => ({
    root: {
        padding: 24,
        backgroundColor: "white"
    },
    input: {
        marginTop: 8,
        marginBottom: 16
    },
    div: {
        padding: '15px',
        border: '2px solid gray'
    },
    label: {
        marginTop: 8,
        marginBottom: 4
    },
    flex1: {
        display: "flex",
        justifyContent: "space-between"
    }

}));


const EditDepartment = (props) => {
    const { form, handleChange, setForm, setInForm } = useForm(initialState);
    const classes = useStyles(props);

    useEffect(() => {
        const { _id } = props.match.params;
        switch (_id) {
            case "new":
                break;
            default: {
                props.client.query({
                    query: QUERY_DEPARTMENT,
                    variables: { _id }
                }).then(result => {
                    const data = result.data.response.data;
                    setForm(data);

                })
                break;
            }
        }
    }, [props.match.params]);

    function handleSubmit() {
        // dispatch(saveDepartment(form))
        props.client.mutate({
            mutation: MUTATION_SAVE_DEPARTMENT,
            variables: { data: form }
        }).then(result => {
            if (authCheck(result.data)) {
                confirm("Lưu dữ liệu thành công",{oklabel:"Đóng",hideCancel:true}).then(_ => props.history.goBack());
            }
        })
    }
    function handleDelete() {
        props.client.mutate({
            mutation: MUTATION_REMOVE_DEPARTMENT,
            variables: { _id: form._id }
        }).then(result => {
            if (authCheck(result.data)) {
                confirm("Xóa dữ liệu thành công",{oklabel:"Đóng",hideCancel:true}).then(_ => props.history.goBack());
            }
        })
    }

    function canBeDeleted() {
        return form._id && form._id.length > 0;
    }
    function canBeSubmitted() {
        return form.name.length > 0;
    }

    function handleWorkingTimeChange(value, index) {
        setInForm(`workingTimes[${index}]`, value);
    }
    function handleServingTimeChange(value, index) {
        setInForm(`servingTimes[${index}]`, value);
    }

    return (
        <div className='block-table-content'>

            <Page
                title="Chi tiết Account"
                breadcrumbs={[{ name: "Chi tiết Account", active: true }]}
                className="Account"
            >
                <div className='top-btn'>
                    <Button className='btn-red' variant='contained' disabled={!canBeDeleted()} onClick={handleDelete}>
                        XÓA
                    </Button>
                </div>
                <div className='fix-bottom-right'>
                    <ButtonGroup>

                        <Button onClick={e => props.history.goBack()} className='m-10'>
                            QUAY LẠI
                    </Button>
                        <Button variant='contained' className='btn-green m-10' disabled={!canBeSubmitted()} onClick={handleSubmit}>
                            LƯU THÔNG TIN
                    </Button>
                    </ButtonGroup>
                </div>

                <Card>
                    <CardBody>
                        <div className={classes.root}>
                            {form &&
                                <div>
                                    <TextField
                                        className={classes.input}
                                        error={form.name === ''}
                                        required
                                        label="Tên Phòng/Ban"
                                        autoFocus
                                        margin="dense"
                                        id="name"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        variant="outlined"
                                        fullWidth
                                    />
                                    <TextField
                                        className={classes.input}
                                        error={form.name === ''}
                                        required
                                        label="Mã Phòng/Ban (đồng bộ từ HIS)"
                                        autoFocus
                                        margin="dense"
                                        name="code"
                                        value={form.code}
                                        onChange={handleChange}
                                        variant="outlined"
                                        fullWidth
                                    />
                                    <TextField
                                        className={classes.input}
                                        label="Mô tả"
                                        margin="dense"
                                        id="description"
                                        name="description"
                                        value={form.description}
                                        onChange={handleChange}
                                        variant="outlined"
                                        fullWidth
                                    />

                                    <FormControlLabel
                                        label="Trạng thái"
                                        control={<Switch name="status" checked={form.status} color="primary" onChange={handleChange} />}
                                        labelPlacement="start"
                                    />
                                    
                                </div>
                            }
                        </div>

                    </CardBody>
                </Card>
            </Page>
        </div>
    )
}

export default withApollo(EditDepartment);
