import React, { useState } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core'
import { showMessage } from 'app/store/actions'
import * as Actions from '../store/actions'
import { useDispatch } from 'react-redux';
import moment from 'moment'

function ConfirmDeleteDialog(props){
  const dispatch = useDispatch();
  const { open, handleClose, info } = props
  const [form, setForm] =  useState({})
  const [user, setUser] = useState({})
  function fetchData(){
    if(info){
      Actions.getUserAction(info, dispatch).then(response =>{
        setForm(response.data)
        setUser(response.data.user)
    });
    }
  }
  function removeUserAction(){
    Actions.deleteUserAction(info).then(response => {
      dispatch(showMessage({message: "Xóa hoạt động khách hàng thành công"}));
    })
  }
  return(
    <Dialog onClose = {handleClose} open = {open} onEnter={fetchData} id = "el-deleteUserActionDialog">
      <DialogTitle id = "el-deleteUA-title">Thông báo</DialogTitle>
      <DialogContent id = "el-deleteUA-content">
        <div id = "el-deleteUA-string">Bạn có chắc chắn muốn xóa hoạt động này của khách hàng <strong>{user.fullName}</strong> tạo vào lúc {moment(form.createdTime).format('HH:mm DD/MM/YYYY')} không?</div>
      </DialogContent>
      <DialogActions id = "el-deleteUA-buttonGroup">
        <Button onClick={handleClose} color = "primary" id = "el-deleteUA-buttonNo">
          Không
        </Button>
        <Button color="primary" onClick={()=>{removeUserAction();handleClose()}} variant="contained" id = "el-deleteUA-buttonYes">
          Có
        </Button>
      </DialogActions>
    </Dialog>
  );
}
export default ConfirmDeleteDialog;
