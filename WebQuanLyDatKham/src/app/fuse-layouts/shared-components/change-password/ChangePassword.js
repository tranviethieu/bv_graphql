import React from 'react';
import { useForm } from '@fuse/hooks';
import { Icon,  TextField,Button, Typography, IconButton, CardContent, Card, CardHeader, CardActions } from '@material-ui/core';
import { showMessage } from 'app/store/actions'
import { useDispatch } from 'react-redux';
import { showDialog,hideDialog } from 'app/store/actions';
import * as Actions from './actions';
const key = "change-password-dialog";
export default function ChangePassword(props) {
    const dispatch = useDispatch();
    const { form, handleChange } = useForm({});

    function handleClose() {
        dispatch(hideDialog(key));
    }
    function canSubmit() {
        // console.log(form);
        return form.old_password&&form.new_password&&form.new_password.length>=6
    }
    function onSubmit() {
        Actions.change_password(form, dispatch).then(response => {
            if (response.data) {
                dispatch(showMessage({message:"Đổi mật khẩu thành công"}))
            } else {
                dispatch(showMessage({ message: "Mật khẩu cũ không chính xác"}));
            }
        })
    }
    return (
        <Card>
          <CardHeader className="el-CardHeader-FU"
            action={
              <IconButton aria-label="settings" onClick={handleClose}>
                <Icon>close</Icon>
              </IconButton>
            }
            title="Đổi mật khẩu"
            subheader=""
          />
          <CardContent>
            <div className="flex flex-wrap">
              <TextField
                className="mt-8 mb-16"
                required
                type="password"
                autoFocus
                label="Mật khẩu hiện tại"
                name="old_password"
                margin="dense"
                value={form.old_password || ''}
                onChange={handleChange}
                variant="outlined"
                fullWidth
              />
              <TextField
                className="mt-8 mb-16"
                required
                type="password"
                label="Mật khẩu mới"
                name="new_password"
                margin="dense"
                value={form.new_password || ''}
                onChange={handleChange}
                variant="outlined"
                fullWidth
              />
            </div>
          </CardContent>
          <CardActions className = "justify-end">
            <Button disabled={!canSubmit()} onClick={onSubmit} color = "primary" variant = "contained">Thực hiện</Button>
          </CardActions>
        </Card>
    )
}

export function showChangePasswordDialog() {
    return (dispatch) => {
        const dialog = {
            children: <ChangePassword/>,
            id: key,
            rootClass: "w-1/4"
        };
        dispatch(showDialog(dialog))
    }
}
