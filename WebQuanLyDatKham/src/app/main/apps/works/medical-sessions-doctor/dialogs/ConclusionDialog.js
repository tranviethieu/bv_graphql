import React, { useEffect } from 'react';
import { useForm } from '@fuse/hooks';
import { showMessage } from 'app/store/actions'
import { useDispatch } from 'react-redux';
import clsx from 'clsx'
import _ from 'lodash';
import * as Actions from '../actions';
import { hideConclusionDialog } from '../actions';
import { Icon, Button, Checkbox, FormControlLabel, TextField, IconButton, CardActions, CardContent, Card, CardHeader } from '@material-ui/core';

const defaultForm = {
    code: "",
    name: ""
}
export default function ConclusionDialog({ data, sessionId }) {
    const { form, setForm, setInForm, handleChange } = useForm(defaultForm);
    const dispatch = useDispatch();

    const handleClose = () => {
        dispatch(hideConclusionDialog());
    };
    useEffect(() => {
        if (data && data.code) {
            setForm({
              code: data.code,
              name: data.name
            })
        // } else{
        //   setForm({sessionCode: code})
        }
    }, [data]);
    function onSubmit() {
      if(form.code){
        dispatch(Actions.remove_conclusion_in_store(form.code))
      //   Actions.update_medical_session_conclusion(sessionId, form, dispatch).then(response =>{
      //     if(response.code === 0){
      //       dispatch(Actions.add_conclusion_in_store(response.data))
      //       dispatch(showMessage({message: "Cập nhật kết luận khám thành công"}))
      //     }
      //     else{
      //       dispatch(showMessage({message: response.message}))
      //     }
      //   })
      // }
      // else{
      }
      
      Actions.update_medical_session_conclusion(sessionId, { code: form.code, name: form.name }, dispatch).then(response =>{
        if(response.code === 0){
          dispatch(Actions.add_conclusion_in_store(response.data))
          dispatch(showMessage({message: "Cập nhật kết luận khám thành công"}))
        }
        else{
          dispatch(showMessage({message: response.message}))
        }
      })
      handleClose();
    }
    function canBeSave() {
        return (
            form && form.name
        )
    }
    return (
        <Card>
          <CardHeader className="el-CardHeader-FU"
            action={
              <IconButton aria-label="settings" onClick={handleClose}>
                <Icon>close</Icon>
              </IconButton>
            }
            title="Tạo kết luận khám"
          />
          <CardContent className={clsx("el-CardContent-FULL")} style = {{ maxHeight: "70vh", overflow: "auto"}}>
            <div className="w-full px-4">
              <TextField
                margin='dense'
                className="mt-8 mb-24"
                value={form.name}
                name = "name"
                onChange={handleChange}
                label = "Kết luận khám"
                variant= 'outlined'
                fullWidth
              />
            </div>
            {/* <div className="w-full px-4">
              <TextField
                margin='dense'
                className="mt-8 mb-8"
                value={form.note}
                onChange={handleChange}
                name = "note"
                label = "Ghi chú"
                variant= 'outlined'
                fullWidth
              />
            </div>
            <FormControlLabel label="Bệnh chính"
              className="mb-8"
              control={
                <Checkbox
                  checked={form.main === true || false}
                  onChange={(e) => setInForm("main", e.target.checked)}
                />
              }
            /> */}
          </CardContent>
          <CardActions>
            <Button variant="contained" color="secondary" onClick={onSubmit} disabled = {!canBeSave()}>Cập nhật kết luận khám</Button>
          </CardActions>
        </Card>
    )
}
