import React,{useEffect} from 'react';
import { TextField, Typography} from '@material-ui/core';
import { useForm, useUpdateEffect } from 'hooks'
import _ from 'lodash';
import Select from 'react-select';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
    root:{
      display:"flex",
      justifyContent:"space-between",
      width:"100%"
    },
    col2: {
        width: "50%",
        marginTop:5
    },
    col1: {
        width: "20%",
        maxWidth: 100,
        marginTop:10
    },
    col3: {
        width: "25%",

    }

}));


const workingDayEnum = [
    { key: "Chủ nhật", value: "SUNDAY" },
    { key: "Thứ 2", value: "MONDAY" },
    { key: "Thứ 3", value: 'TUESDAY' },
    { key: "Thứ 4", value: "WEDNESDAY" },
    { key: "Thứ 5", value: "THURSDAY" },
    { key: "Thứ 6", value: "FRIDAY" },
    { key: "Thứ 7", value: "SATURDAY" }
]

function getDayName(value){
    var filter = workingDayEnum.filter(item=>(item.value==value));
    if(filter.length>0)
        return filter[0].key
    return "notfound";
}
const workingTimes = [];
workingTimes.push({
    label: "Chọn khung giờ",
    value: ""
});
for (var i = 7; i < 18; i++) {
    var label = i < 10 ? `0${i}:00` : `${i}:00`
    workingTimes.push({
        label: label,
        value: label
    });
}
function DaySetting(props){
    const { index, template, data, onChange } = props;

    const { form, handleChange, setForm, setInForm } = useForm(data);

    useEffect(() => {
        if(!data){
          setForm(template);
        }else if(data.dayOfWeek!=template.dayOfWeek||data.maxProcess!=form.maxProcess||data.timeFrame!=form.timeFrame){
          setForm(data);//load new data to form
        }
    },[template,data])
    const classes = useStyles(props);

    useUpdateEffect(() => {
      if(onChange)
        onChange(form, index);
    }, [form, index]);

    function handleChipChange(value, name) {
        setForm(_.set({ ...form }, name, value.map(item => item.value)));
    }

    return(

        form?<div className={classes.root}>
            <Typography className={classes.col1}>{getDayName(form.dayOfWeek)}</Typography >

             <Select
                value={form.timeFrame && form.timeFrame.map((item)=>({label:item, value:item}))}
                onChange={(value) => handleChipChange(value, 'timeFrame')}
                options={
                    workingTimes
                }
                placeholder={"Chọn giờ làm việc"}
                isClearable={true}
                menuPlacement="auto"
                menuPosition="fixed"
                className={classes.col2}
                isMulti
            />
            <TextField
                className={classes.col3}
                label="Số hàng đợi tối đa"
                type="number"
                id="maxProcess"
                name="maxProcess"
                value={form.maxProcess}
                onChange={handleChange}
                variant="outlined"
                margin="dense"
            />
        </div>
        :null
    )
}

export default DaySetting;
