import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import * as Actions from "./store/actions/index";
import { useDispatch, useSelector } from 'react-redux';
import { showMessage } from 'app/store/actions/fuse';
import * as BaseActions from 'app/store/actions';
import { showUserDialog } from 'app/main/apps/shared-dialogs/actions'

export default function UpdateUserPhoneDialog(props) {
    const selectedIntegratedApp = useSelector(({ chatApp }) => chatApp.contacts.selectedIntegratedApp);
    const dispatch = useDispatch();
    // const [open, setOpen] = React.useState(false);
    const [phone, setPhone] = React.useState("")


    const handleUpdate = () => {
        if (props.userId && props.userId !== undefined && phone) {
            Actions.updateIntegratedUserPhoneNumber(props.userId, phone)
                .then(response => {
                    if (response && response.data) {
                        dispatch(showMessage({ message: "Cập nhật số điện thoại thành công" }));
                        dispatch(Actions.setSelectedConversation(response.data))
                        console.log("===> updated: ", response.data )
                        dispatch(BaseActions.closeDialog())
                        dispatch(showUserDialog({ rootClass: "el-coverFUD", phoneNumber: response.data.user.phoneNumber, channelType: selectedIntegratedApp.type === "ZALO_CHAT_OA" ? "ZALOMESSENGER" : selectedIntegratedApp.type === "FACEBOOK_CHAT" ? "FBMESSENGER" : null }))
                    }
                })
        }
    }
    return (
        <React.Fragment className = "el-UpdateUserPhoneDialog">
            <DialogTitle id="form-dialog-title">Cập nhật số điện thoại</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Cập nhật số điện thoại để kết nối người dùng với hệ thống
            </DialogContentText>
                <TextField
                    autoFocus
                    //   margin="dense"
                    id="name"
                    label="Số điện thoại"
                    type="phone"
                    fullWidth
                    onChange={e => { setPhone(e.target.value) }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={e => dispatch(BaseActions.closeDialog())} color="primary">
                    Hủy
            </Button>
                <Button onClick={handleUpdate} color="primary">
                    Cập nhật
            </Button>
            </DialogActions>
        </React.Fragment>
    );
}
