import React, { useState, useEffect } from 'react';
import { FormControlLabel, Checkbox, TextField } from '@material-ui/core';
import { useForm } from '@fuse/hooks';
import _ from 'lodash';


export default function ({ searchOption, filterOption, menuOption, fieldOption, exportOption, customElements, createOption, className, ...props }) {
    const [searchText, setSearchText] = useState('');
    const { form, handleChange, setForm, setInForm } = useForm({});
    const [listCheck, setListCheck] = useState([])
    useEffect(() => {

        if (filterOption && filterOption.attributes) {
            filterOption.attributes.forEach(function (att) {
                if (!form[att.name] && att.defaultValue){
                  form[att.name] = att.defaultValue
                  if(att.type === "checkbox"){
                    setListCheck(att.defaultValue)
                  }
                }
            })
        }
    }, [filterOption]);

    function handleCheck(valueCheck, checked, name){
      var tmpList = listCheck
      if (checked) {
        tmpList.push(valueCheck.value);
      } else {
        var tmpl
        tmpList = tmpList.filter(p => p !== valueCheck.value);
      }
      setListCheck([...tmpList])
      filterOption.onSubmitCheck(tmpList, name)
    }
    return (
        <div className={className}>
          <div className="el-flex-item flex-item-flex1">
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
              filterOption.attributes && filterOption.attributes.map((att, index) =>
                att.type === "checkbox" ?
                  att.options.map((valueCheck, index1) =>
                    (
                      <FormControlLabel
                        label={valueCheck.label}
                        control={
                          <Checkbox
                            checked={listCheck.includes(valueCheck.value)}
                            onChange={(e) => handleCheck(valueCheck, e.target.checked, att.name)}
                          />
                        }
                      />
                    )
                  )
                : null
              )}
          </div>
        </div>
    )
}
