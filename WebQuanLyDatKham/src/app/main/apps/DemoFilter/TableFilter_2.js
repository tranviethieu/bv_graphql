import React, { useState, useEffect } from 'react';
import { FormControlLabel, Checkbox, TextField } from '@material-ui/core';
import { useForm } from '@fuse/hooks';
import { FuseChipSelect } from '@fuse';
import _ from 'lodash';
import clsx from 'clsx';
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import viLocale from "date-fns/locale/vi";
import moment from "moment"

export default function ({ searchOption, filterOption, menuOption, fieldOption, exportOption, customElements, createOption, className, ...props }) {
    const [searchText, setSearchText] = useState('');
    const { form, handleChange, setForm, setInForm } = useForm({});
    const [time, setTime] = useState(new Date())
    const [listCheck, setListCheck] = useState([])
    const [listOptions, setListOptions] = useState([])
    useEffect(() => {

        if (filterOption && filterOption.attributes) {
          if(filterOption.tabValue === 0){
            setTime(new Date())
          }
            filterOption.attributes.forEach(function (att) {
                if (!form[att.name] && att.defaultValue){
                  form[att.name] = att.defaultValue
                  if(att.type === "checkbox"){
                    setListCheck(att.defaultValue)
                  }
                }
            })
            if(filterOption.bonusOptions){
              var nameAtt = filterOption.attributes.map(x => x.name)
              filterOption.bonusOptions.forEach(function (bonus) {
                if(nameAtt.includes(bonus.name)){
                  setListOptions(formatDataSelect(bonus.options))
                }
              }
            )
        }
      }
    }, [filterOption]);
    function formatDataSelect(list){
      var data = list.map((item) => {
        return {
          value: item._id,
          label: item.name,
        };
      })
      return data;
    }
    function handleDate(name, date){
      filterOption.onSubmitDate(name, date)
    }
    function handleChipChange(value, name) {
        if(value){
          if (Array.isArray(value)) {
              setForm(_.set({ ...form }, name, value.map(v => v.value)));
          } else
              setForm(_.set({ ...form }, name, value.value));
          filterOption.onSubmitSelect(value, name)
        }
        else{
          if (Array.isArray(value)) {
              setForm(_.set({ ...form }, name, value.map(v => v.value)));
              filterOption.onSubmitSelect({value: []}, name)
          } else{
            setForm(_.set({ ...form }, name, ""));
            filterOption.onSubmitSelect({value: ""}, name)
          }
        }
    }
    function handleCheck(valueCheck, checked, name){
      var tmpList = listCheck
      if (checked) {
        tmpList.push(valueCheck.value);
      } else {
        tmpList = tmpList.filter(p => p !== valueCheck.value);
      }
      setListCheck([...tmpList])
      filterOption.onSubmitCheck(tmpList, name)
    }
    return (
        <div className={className}>
          <div className= {searchOption && searchOption.className}>
            {
                searchOption &&
              <TextField
                className = "w-full"
                placeholder="Từ khóa..."
                variant = "outlined"
                margin = 'dense'
                inputProps={{
                  'aria-label': 'Search'
                }}
                onChange={e => setSearchText(e.target.value)}
                onKeyPress={e => {
                  if (e.charCode === 13)
                  searchOption.onTextSearch && searchOption.onTextSearch(searchText);

                }}
                value={searchText}
              />
            }
          </div>
          <div className="el-flex-item flex-item-flex1" style = {{ display: "flex", alignItems: "center" }}>
            {
              filterOption && filterOption.attributes && filterOption.attributes.map((att, index) =>
                att.type === "checkbox" ?
                  att.options.map((valueCheck, index1) =>
                    (
                      <FormControlLabel
                        label={valueCheck.label}
                        className={clsx(att.className, "")}
                        control={
                          <Checkbox
                            checked={listCheck.includes(valueCheck.value)}
                            onChange={(e) => handleCheck(valueCheck, e.target.checked, att.name)}
                          />
                        }
                      />
                    )
                  )
                : att.type === "select" ? (
                  <FuseChipSelect
                    key={index}
                    className={clsx(att.className, "w-full")}
                    margin = "dense"
                    options={att.options ? att.options : listOptions}
                    onChange={(value) => handleChipChange(value, att.name)}
                    textFieldProps={{
                      label: att.label,
                      InputLabelProps: {
                        shrink: true
                      },
                      variant: 'outlined'
                    }}
                    isClearable={att.isClearable}
                    value={att.options && att.options.filter(option => ((att.isMulti && form[att.name] && form[att.name].includes(option.value)) || form[att.name] === option.value))}
                    isMulti={att.isMulti}
                  />
                )
                : att.type === "date" ?
                  <MuiPickersUtilsProvider  utils={DateFnsUtils} locale={viLocale}>
                    <DatePicker
                      disableToolbar
                      variant="inline"
                      margin = "dense"
                      className= {att.className}
                      helperText={null}
                      fullWidth
                      autoOk
                      label={att.label}
                      inputVariant="outlined"
                      value={time ? moment(time).format("YYYY-MM-DD") : new Date()}
                      onChange={
                        date => {
                          handleDate(att.name, moment(date).format("YYYY-MM-DD"));
                          setTime(moment(date).format("YYYY-MM-DD"))
                        }
                      }
                      format="dd/MM/yyyy"
                    />
                  </MuiPickersUtilsProvider>
                : null
              )}
          </div>
        </div>
    )
}
