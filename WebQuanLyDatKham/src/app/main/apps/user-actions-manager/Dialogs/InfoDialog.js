import React, { useState } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, DialogContentText } from '@material-ui/core'
// import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import * as Actions from '../store/actions'
import { useDispatch } from 'react-redux';
import moment from 'moment'

function InfoDialog(props){
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
  return(
    <Dialog onClose = {handleClose} open = {open} onEnter={fetchData} id = "el-infoUserActionDialog">
      <DialogTitle id = "el-infoUA-title">Chi tiết hoạt động của khách hàng</DialogTitle>
      <DialogContent id = "el-infoUA-content">
        <DialogContentText id = "el-infoUA-contentText">
          <Grid container spacing={1}>
            <Grid item xs={6}>
              Tên khách hàng:
            </Grid>
            <Grid item xs={6}>
              <div className = "font-bold el-GridWordWrap">
                {user.fullName}
              </div>
            </Grid>
            <Grid item xs={6}>
              Số điện thoại:
            </Grid>
            <Grid item xs={6}>
              <div className = "font-bold el-GridWordWrap">
                {user.phoneNumber}
              </div>
            </Grid>
            <Grid item xs={6}>
              Ngày sinh:
            </Grid>
            <Grid item xs={6}>
              <div className = "font-bold el-GridWordWrap">
                {moment(user.birthDay).format("DD/MM/YYYY")}
              </div>
            </Grid>
            <Grid item xs={6}>
              Địa chỉ:
            </Grid>
            <Grid item xs={6}>
              <div className = "font-bold el-GridWordWrap">
                {user.address}
              </div>
            </Grid>
            <Grid item xs={6}>
              Loại hoạt động:
            </Grid>
            <Grid item xs={6}>
              <div className = "font-bold el-GridWordWrap">
                {form.action ===
                  "APPOINTMENT" ? "Đặt lịch khám"
                  : form.action === "SURVEY" ? "Thực hiện khảo sát"
                  : form.action === "SCANRESULT" ? "Kết quả chụp chiếu"
                  : form.action === "TESTRESULT" ? "Kết quả xét nghiệm"
                  : form.action === "EXAMINATION" ? "Kết quả khám"
                  : form.action === "TICKET" ? "Yêu cầu khách hàng"
                  : "Đơn thuốc"
                }
              </div>
            </Grid>
            <Grid item xs={6}>
              Thời gian tạo:
            </Grid>
            <Grid item xs={6}>
              <div className = "font-bold el-GridWordWrap">
                {moment(form.createdTime).format("HH:mm DD/MM/YYYY")}
              </div>
            </Grid>
            <Grid item xs={6}>
              Tình trạng:
            </Grid>
            <Grid item xs={6}>
              <div className = "font-bold el-GridWordWrap">
                {form.state === "ACTIVE"? "Hiện hoạt": "Vô hiệu"}
              </div>
            </Grid>
            <Grid item xs={6}>
              Thông tin thêm:
            </Grid>
            <Grid item xs={6}>
              <div className = "font-bold el-GridWordWrap">
                {JSON.stringify(form.data)}
              </div>
            </Grid>

            {/* <Grid item xs = {12} >
                <ExpansionPanel className = "el-expandMoreUserInfo">
                <ExpansionPanelSummary
                className = "el-expandMoreSummary"
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                >
                <Typography>Thông tin thêm về khách hàng</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails className = "el-expandMoreDetail">
                <Grid container spacing={1} id = "el-GridContainerInExpand">
                <Grid item xs={6}>
                Giới tính:
                </Grid>
                <Grid item xs={6}>
                <div className = "font-bold el-GridWordWrapInExpand">
                {user.gender === "male" ? "Nam" : user.gender === "female" ? "Nữ" : "Chưa xác định"}
                </div>
                </Grid>
                <Grid item xs={6}>
                Tình trạng hôn nhân:
                </Grid>
                <Grid item xs={6}>
                <div className = "font-bold el-GridWordWrapInExpand">
                {user.mariage === true ? "Đã kết hôn" : "Độc thân"}
                </div>
                </Grid>
                <Grid item xs={6}>
                Công việc
                </Grid>
                <Grid item xs={6}>
                <div className = "font-bold el-GridWordWrapInExpand">
                {user.work}
                </div>
                </Grid>
                <Grid item xs={6}>
                Thư điện tử:
                </Grid>
                <Grid item xs={6}>
                <div className = "font-bold el-GridWordWrapInExpand">
                {user.email}
                </div>
                </Grid>
                </Grid>
                </ExpansionPanelDetails>
                </ExpansionPanel>
            </Grid>  */}
          </Grid>
        </DialogContentText>
      </DialogContent>
      <DialogActions id = "el-infoUA-buttonGroup">
        <Button onClick={handleClose} color = "primary" id = "el-infoUA-buttonClose">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>

  );
}
export default InfoDialog;
