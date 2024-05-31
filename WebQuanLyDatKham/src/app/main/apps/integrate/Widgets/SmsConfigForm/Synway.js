import React, { useState, useEffect } from 'react';
import { useForm } from '@fuse/hooks'
import { FormGroup, IconButton, Icon, FormControl, InputLabel, Divider, Checkbox, Button, Typography, NativeSelect, TextField } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from "../../store/actions";


export function Synway({handleSubmit,data:initialData,active:initialActive,...props}) {

    const { form, handleChange, setForm } = useForm(initialData);
    const [active, setActive] = useState(false);
    useEffect(() => {
        setForm(initialData);
    }, [initialData]);
    useEffect(() => {
        setActive(initialActive);
    },[initialActive]);

    return (
        <div className="p-24 w-full">            
            <TextField
                className="mb-24"
                label="Tài khoản kết nối"
                autoFocus
                error={form.username === ''}
                name="username"
                value={form.username ? form.username : ''}
                onChange={handleChange}
                variant="outlined"
                required
                fullWidth
            />
            <TextField
                className="mb-24"
                label="Mật khẩu"
                autoFocus
                error={form.password === ''}
                name="password"
                value={form.password}
                onChange={handleChange}
                variant="outlined"
                required
                fullWidth
            />    
             <TextField
                className="mb-24"
                label="Địa chỉ gateway vd: http://192.168.1.1:8080"
                name="apihost"
                value={form.apihost}
                onChange={handleChange}
                variant="outlined"
                fullWidth
            />
             <TextField
                className="mb-24"
                label="Cổng sim Viettel (cách nhau bởi dấu phẩy)"
                name="viettelport"
                value={form.viettelport}
                onChange={handleChange}
                variant="outlined"
                fullWidth
            />
            <TextField
                className="mb-24"
                label="Cổng sim Mobifone (cách nhau bởi dấu phẩy)"
                name="mobiport"
                value={form.mobiport}
                onChange={handleChange}
                variant="outlined"
                fullWidth
            />
            <TextField
                className="mb-24"
                label="Cổng sim Vinaphone (cách nhau bởi dấu phẩy)"
                name="vinaport"
                value={form.vinaport}
                onChange={handleChange}
                variant="outlined"
                fullWidth
            />
            <TextField
                className="mb-24"
                label="Cổng sim vietnammobile (cách nhau bởi dấu phẩy)"
                name="vnmport"
                value={form.vnmport}
                onChange={handleChange}
                variant="outlined"
                fullWidth
            />
           <TextField
                className="mb-24"
                label="Cổng sim GMobile (cách nhau bởi dấu phẩy)"
                name="gmobiport"
                value={form.gmobiport}
                onChange={handleChange}
                variant="outlined"
                fullWidth
            />            
            <FormGroup className="w-full">
                <FormControl>
                    <InputLabel>Loại tin nhắn</InputLabel>
                    <NativeSelect
                        className="mt-8 mb-16"
                        name="messagetype"
                        value={form.messagetype || 'UNSIGN'}
                        onChange={handleChange}
                        fullWidth
                    >
                        <option value="UNSIGN">Không dấu</option>
                        <option value="SIGN">Có dấu</option>
                    </NativeSelect>

                </FormControl>
            </FormGroup>
            <div>
                <Checkbox checked={active} onChange={e => setActive(e.target.checked)} name="active" />
                <label>Kích hoạt</label>
            </div>
            <Button variant="contained" color="primary" onClick={() => { handleSubmit&&handleSubmit(form,active) }}>Lưu cấu hình</Button>
        </div>
    )
}