import React, { } from 'react';
import { TextField, Typography, FormGroup, FormControl, InputLabel, NativeSelect } from '@material-ui/core';
import {useForm, useUpdateEffect} from '@fuse/hooks';

function TicketForm(props) {
    const { onTicketChange, ticket } = props;
    const { form, handleChange} = useForm(ticket);
    useUpdateEffect(() => {
        onTicketChange(form);
    }, [form, onTicketChange]);
    return (
      <div className="p-4" id = "el-coverTicketForm">
          <Typography className="text-17">Yêu cầu khách hàng</Typography>
          <div className="p-4">
              <FormGroup className="w-full">
                  <FormControl>
                      <InputLabel>Loại yêu cầu:</InputLabel>
                      <NativeSelect
                          className="mt-16 mb-16"
                          label="Chọn loại yêu cầu"
                          id="type"
                          name="type"
                          value={form.type}
                          onChange={handleChange}
                          fullWidth
                          defaultValue="ADVISORY"
                      >
                          <option value="ADVISORY">Cần tư vấn</option>
                          <option value="COMPLAIN">Khiếu nại</option>
                      </NativeSelect>
                  </FormControl>
              </FormGroup>
          </div>
          <FormControl className="mt-8 mb-16" error = {form.title === "" || !form.title} required fullWidth>
              <TextField
                  error={form.title === ''|| !form.title}
                  label="Tiêu đề"
                  autoFocus
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  margin="dense"
                  required
                  variant="outlined"
              />
          </FormControl>
          <FormControl className="mt-8 mb-16" fullWidth>
              <TextField
                  label="Nội dung"
                  name="note"
                  multiline
                  rows="3"
                  value={form.note}
                  onChange={handleChange}
                  variant="outlined"
              />
          </FormControl>
      </div>
    )
}
export default TicketForm;
