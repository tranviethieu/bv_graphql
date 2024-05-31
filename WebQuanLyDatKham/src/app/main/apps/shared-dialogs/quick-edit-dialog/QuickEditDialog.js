import React, { useMemo } from 'react';
import { FuseChipSelect, UploadFileForm, AdvanceEditor } from '@fuse';
import { useForm } from '@fuse/hooks';
import { Icon, Button, IconButton, FormGroup, Input, InputLabel, OutlinedInput , Checkbox, FormControlLabel, Grid,FormControl, TextField } from '@material-ui/core';
import moment from 'moment';
import clsx from 'clsx'
import Card from '@material-ui/core/Card';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import viLocale from "date-fns/locale/vi";
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import { useDispatch } from 'react-redux';
import * as Actions from '../actions';
import _ from '@lodash';
export default function QuickEditDialog({ title, subtitle, attributes, data, submit, ...props }) {
    const dispatch = useDispatch();
    const { form, handleChange, setForm, setInForm } = useForm(data || {});
    function handleSubmit() {
        dispatch(Actions.hideDialog('quick-edit-dialog'));
        if (submit)
            submit(form);
    }

    const handleClose = () => {

        dispatch(Actions.hideDialog('quick-edit-dialog'));
    };
    function handleChipChange(value, name) {
        // console.log("handlechipchange:", name, value,Array.isArray(value));
        if(value.value)
            setForm(_.set({ ...form }, name, value.value));
        else if (Array.isArray(value)) {
            setForm(_.set({ ...form }, name, value.map(v=>v.value)));
        }
    }
    return (
        <Card>
          <CardHeader className="el-CardHeader-FU"
            action={
              <IconButton aria-label="settings" onClick={handleClose}>
                <Icon>close</Icon>
              </IconButton>
            }
            title={title}
            subheader={subtitle}
          />
          <CardContent className={clsx(props.className.includes("el-CardContent") ? "" : "el-CardContent-FU",props.className)}>

            <form>
              <Grid container justify="space-between" spacing={props.spacing ? props.spacing : 3}>
                {
                  attributes && attributes.map((att, index) =>
                    (!att.displayOption || att.displayOption(form)) && <Grid key={index} item md={att.gridItem ? att.gridItem.md : 12} xs={att.gridItem ? att.gridItem.xs : 12} sm={att.gridItem ? att.gridItem.sm : 12}>
                      {
                        att.type && att.type === "select"  ? (
                          <FuseChipSelect
                            key={index}
                            className="pt-8 w-full"
                            options={att.options}
                            disabled={att.disabled}
                            onChange={(value) => { if (att.onChange) { att.onChange(form, value) }; handleChipChange(value, att.name) }}
                            textFieldProps={{
                              label: att.label,
                              InputLabelProps: {
                                shrink: true
                              },
                              variant: 'outlined'
                            }}
                            value={
                              att.options && form[att.name] && 
                              (att.isMulti
                                ? (att.remainOrder
                                  ? form[att.name].map(val => att.options.filter(option => option.value == val)[0]).filter(v => v != null)
                                  : att.options.filter(option => form[att.name].includes(option.value)) 
                                )
                                : att.options.filter(option => form[att.name] == option.value)
                              )
                            }
                            isMulti={att.isMulti}
                          />
                        ) :
                        att.type === "files" ?
                          (
                            <FormGroup className="pt-16 w-full" variant="outlined" key={index}>
                              <InputLabel>{att.label}</InputLabel>
                              <UploadFileForm
                                maxFiles={att.maxFiles||10}
                                allowMultiple={true}
                                server={process.env.REACT_APP_UPLOAD_URL}
                                onUpdateFiles={(serverIds) => setInForm(att.name, serverIds)}
                              />
                            </FormGroup>

                          ) :
                        att.type === "gender" ?
                          <TextField
                            className = "mt-8"
                            disabled={att.disabled || (att.disableOption && att.disableOption(form))}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            label={att.labelOption?att.labelOption(form):att.label}
                            variant="outlined"
                            placeholder={att.description}
                            name={att.name}
                            type={att.type}
                            fullWidth
                            margin = {att.margin}
                            defaultValue={att.defaultValue}
                            value={form[att.name] === "male" ? "Nam" : form[att.name] === "female" ? "Nữ" : ""}
                            onChange={handleChange}
                            step={att.step}
                          />:
                        att.type === "editor" ?
                          (
                            <FormGroup className="pt-16 w-full" variant="outlined" key={index}>
                              <InputLabel>{att.label}</InputLabel>
                              <AdvanceEditor
                                onChange={content => setInForm(att.name, content)}
                                content={form[att.name]}
                              />
                            </FormGroup>
                          )
                        :
                        att.type === 'checkbox' ?
                          (
                            <FormControlLabel label={att.label}
                              control={<Checkbox
                                checked={form[att.name]}
                                onChange={(e) => setInForm(att.name, e.target.checked)}
                                disabled={att.disabled}
                                       />}
                            />
                          )
                        :
                        att.type === 'date' ?
                          <MuiPickersUtilsProvider utils={DateFnsUtils} locale={viLocale} key={index}>
                            <KeyboardDatePicker
                              disableToolbar
                              fullWidth
                              className="mt-8 mb-16"
                              autoOk
                              label={att.label}
                              variant="inline"
                              id={att.name}
                              defaultValue={att.defaultValue}
                              name={att.name}
                              disabled={att.disabled}
                              inputVariant="outlined"
                              value={moment(form[att.name]).format("YYYY-MM-DD")}
                              onChange={e => {setInForm(att.name, moment(e).format("YYYY-MM-DD"))}}
                              format="dd/MM/yyyy"
                              invalidDateMessage="Ngày không hợp lệ"
                            />
                          </MuiPickersUtilsProvider>
                        :
                        <TextField
                          className="mt-8"
                          label={att.label}
                          id={att.name}
                          defaultValue={att.defaultValue}
                          name={att.name}
                          type={att.type}
                          disabled={att.disabled}
                          value={form[att.name] == null ? "" : form[att.name]}
                          onChange={handleChange}
                          step={att.step}
                          variant="outlined"
                          fullWidth
                        />
                        // (
                        //   <FormControl className="mt-16 w-full" variant="outlined" key={index}>
                        //     <InputLabel htmlFor={att.name}>{att.label}</InputLabel>
                        //     {
                        //       (<OutlinedInput disabled={att.disabled} id={att.name} name={att.name} type={att.type} defaultValue={att.defaultValue} value={form[att.name]} onChange={handleChange} step={att.step}/>)
                        //     }
                        //
                        //     </FormControl >
                        //   )
                        }
                      </Grid>
                    )

                  }
                </Grid>
              </form>
            </CardContent>
            <CardActions>
              <Button variant="contained" color="primary" onClick={handleSubmit}>
                Lưu
              </Button>
              <Button color="default" onClick={handleClose}>
                Đóng
              </Button>
            </CardActions>
        </Card>
    )
}
