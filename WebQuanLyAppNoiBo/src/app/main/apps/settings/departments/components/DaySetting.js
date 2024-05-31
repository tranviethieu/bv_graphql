import React from 'react';
import { TextField, Typography } from '@material-ui/core';
import { useForm, useUpdateEffect } from '@fuse/hooks'
import _ from 'lodash';
import { FuseChipSelect } from '@fuse';

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
    var filter = workingDayEnum.filter(item=>(item.value===value));
    if(filter.length>0)
        return filter[0].key
    return "";
}

// const initialState={
//     timeFrame:[],
//     maxProcess:9,
//     dayOfWeek:"MONDAY"
// }
function DaySetting(props){
    const{dayOfWeek,maxProcess,timeFrame}=props;
    const { form, handleChange, setForm } = useForm({ dayOfWeek, maxProcess, timeFrame });
    const{onListItemChange,index} =props;
    const workingTimes=[];

    workingTimes.push({
        label: "Chọn khung giờ",
        value: ""
    });
    for (var i = 7; i < 19; i++) {
        var label = i < 10 ? `0${i}:00` : `${i}:00`
        var label30 = i < 10 ? `0${i}:30` : `${i}:30`
        workingTimes.push({
            label: label,
            value: label
        });
        workingTimes.push({
            label: label30,
            value: label30
        });
    }
    // console.log("current props:",props);
    useUpdateEffect(() => {
        onListItemChange(form, index);
    }, [form, index]);

    function handleChipChange(value, name) {
        setForm(_.set({ ...form }, name, value.map(item => item.value)));
    }

    return(
        <div className="flex w-full t-10">
          <Typography className="mt-8 mb-24 md:w-1/12 sm:w-1/12  m-5 p-5" variant="h6">{getDayName(props.dayOfWeek)}</Typography >
            <FuseChipSelect
              className="mt-8 mb-24 md:w-8/12 sm:w-8/12  m-5"
              options={
                workingTimes
              }
              value={props.timeFrame && props.timeFrame.map((item)=>({label:item, value:item}))}
                onChange={(value) => handleChipChange(value, 'timeFrame')}
                placeholder="Chọn giờ làm việc"
                textFieldProps={{
                    label: 'Chọn giờ làm việc',
                    InputLabelProps: {
                        shrink: true
                    },
                    variant: 'outlined'
                }}
                isMulti
                fullWidth
            />
            <TextField
                className="mt-8 mb-24 md:w-2/12 sm:w-2/12  m-l-5"
                label="Số hàng đợi tối đa"
                type="number"
                id="maxProcess"
                name="maxProcess"
                value={props.maxProcess}
                onChange={handleChange}
                variant="outlined"
            />
        </div>

    )
}

export default DaySetting;
