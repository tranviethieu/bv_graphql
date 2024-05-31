import React from 'react';
import { Checkbox, TextField } from '@material-ui/core';
import {useForm, useUpdateEffect} from '@fuse/hooks';
import { FuseChipSelect } from '@fuse';

function UserMore(props) {
    const { onUserMoreChange, userMore } = props;
    const { form, handleChange, setInForm } = useForm(userMore);

    useUpdateEffect(() => {
        onUserMoreChange(form);
    }, [form, onUserMoreChange]);
    function handleUserChipChange(value, name) {
        setInForm("gender", value.value)
    }
    return (
        <div className="flex flex-wrap w-full el-coverUserMore">
          <div className="md:w-1/2 sm:w-1/2 p-4 select-up">
            <FuseChipSelect
              margin='dense'
              className="mt-8 mb-24"
              value={
                { value: form.gender, label: form.gender === "male"? "Nam giới" : form.gender === "female" ? "Nữ giới" : "Chưa xác định" }
              }
              style = {{ height: 20 }}
              onChange={(value) => handleUserChipChange(value, 'gender')}
              textFieldProps={{
                label: 'Giới tính',
                InputLabelProps: {
                  shrink: true
                },
                variant: 'outlined'
              }}
              options={[{ value: "female", label: "Nữ giới" }, { value: "male", label: "Nam giới" }, { value: "", label: "Chưa xác định" }]}

            />
          </div>
          <div className="md:w-1/2 sm:w-1/2 p-4" style={{ marginTop: "15px" }}>
            <Checkbox
              checked={form.mariage}
              id="mariage"
              name="mariage"
              onChange={handleChange}
            />
            <label>Đã lập gia đình</label>
          </div>

          <div className="md:w-1/2 sm:w-1/2 p-4">
            <TextField
              className="mt-8 mb-16"
              margin = "dense"
              label="Thư điện tử"
              id="email"
              name="email"
              value={form.email || ''}
              onChange={handleChange}
              variant="outlined"
              fullWidth
            />
          </div>
          <div className="md:w-1/2 sm:w-1/2 p-4">
            <TextField
              className="mt-8 mb-16"
              margin = "dense"
              label="Công việc"
              id="work"
              name="work"
              value={form.work || ''}
              onChange={handleChange}
              variant="outlined"
              fullWidth
            />
          </div>
        </div>
    )
}
export default UserMore;
