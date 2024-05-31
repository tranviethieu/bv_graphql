import React, { useState, useEffect } from 'react';
import { useForm } from '@fuse/hooks'
import { FormGroup, IconButton, Icon, FormControl, InputLabel, Divider, Checkbox, Button, Typography, NativeSelect, TextField } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import * as Actions from "../store/actions";
import _ from 'lodash'
import { Viettel, Synway, Vivas } from './SmsConfigForm';

const initialData = {
  provider: "VIVAS",
  username: "",
  password: "",
  brandname: "",
  secretkey: "",
  messagetype: "UNSIGN"

}
function SmsConfigWidget() {
  const dispatch = useDispatch();
  const drawer = useSelector(({ integrateApp }) => integrateApp.integrates.drawer)
  const { form, handleChange, setForm } = useForm(initialData);
  const [active, setActive] = useState(false);
  useEffect(() => {
    if (drawer.data && drawer.data.sms_template && drawer.data.type === "SMS") {
      setForm(drawer.data.sms_template);
      setActive(drawer.data.active);
    }
  }, [drawer.data, setForm])

  function handleSubmit(form, active) {
    
    console.log("initialData",form);
    const data = _.omit(drawer.data, ['channels','sms_template']);//data ko co channels

    dispatch(Actions.saveIntegratedAccount({ ...data, active, template: JSON.stringify(form) }));
  }
  function onOpen() {

  }
  function onClose() {
    dispatch(Actions.hideDrawer())
  }
  return (
    <SwipeableDrawer
      className="h-full absolute z-30 el-SmsConfigWidget-Cover"
      variant="temporary"
      anchor="right"
      open={(drawer.open && drawer.data && drawer.data.type === "SMS") ? true : false}
      onClose={onClose}
      onOpen={onOpen}
      style={{ position: 'absolute' }}
      ModalProps={{
        keepMounted: true,
        disablePortal: true,
        BackdropProps: {
          classes: {
            root: "absolute"
          }
        }
      }}
    >
      <div style={{ width: "780px", height: "100%", backgroundColor: "transparent", display: "flex", marginTop: "64px", color: "#595959" }} id="el-SmsConfigWidget">
        <div style={{ width: "720px", backgroundColor: "#EBF1F4" }}>
          <IconButton onClick={onClose} color="inherit">
            <Icon>close</Icon>
          </IconButton>

          <Typography className="text-17 font-bold px-24 py-5 text-dark">Thiết lập liên kết tới nhà cung cấp SMS của bạn</Typography>
          <Divider />
          <div className="p-24 w-full">
            <FormGroup className="w-full">
              <FormControl>
                <InputLabel>Nhà cung cấp SMS</InputLabel>
                <NativeSelect
                  className="mt-8 mb-16"
                  name="provider"
                  value={form.provider}
                  onChange={handleChange}
                  fullWidth
                >
                  <option value="VIVAS">Vivas</option>
                  <option value="SYNWAY" >Synway SMG</option>
                  <option value="VIETTEL">Viettel</option>
                </NativeSelect>

              </FormControl>
            </FormGroup>
            {
              form.provider == "SYNWAY" && <Synway  data={form} active={active} handleSubmit={handleSubmit}/>
            }
            {
              form.provider == "VIVAS" && <Vivas data={form} active={drawer.data&&drawer.data.active} handleSubmit={handleSubmit}/>
            }
            {
              form.provider == "VIETTEL" && <Viettel data={form} active={drawer.data&&drawer.data.active} handleSubmit={handleSubmit}/>
            }
          </div>
        </div>
      </div>
    </SwipeableDrawer>
  )
}

export default SmsConfigWidget;
