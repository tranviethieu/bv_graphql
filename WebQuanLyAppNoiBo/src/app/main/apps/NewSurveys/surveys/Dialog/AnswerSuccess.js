import React, { useCallback } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, AppBar, Typography, Divider, FormLabel } from '@material-ui/core';

function AnswerSuccess(props) {
  const { open, onCloseDialog } = props

  const handleInstallApp = () => {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;
    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      //ios
      window.open("https://apps.apple.com/vn/app/b%E1%BB%87nh-vi%E1%BB%87n-ph%E1%BB%A5-s%E1%BA%A3n-h%C3%A0-n%E1%BB%99i/id1459524755?l=vi")
      return;
    } else
      if (/android/i.test(userAgent)) {
        //"Android"
        window.open("https://play.google.com/store/apps/details?id=com.elsaga.datkhambvpshn")
        return;
      } else {
        window.open("http://benhvienphusanhanoi.vn")
      }
    onCloseDialog()
  }
  return (
    <Dialog open={open} onClose={onCloseDialog} aria-labelledby="form-dialog-title" >
      <div style={{ width: "280px", }}>

        <AppBar position="static" elevation={1}>
          <div className="m-8">
            <div className="flex items-center w-full" style={{ minHeight: "60px", textAlign: "center" }}>
              <Typography className="text-16 sm:text-20 p-12 truncate" style={{ margin: "auto" }}>
                {"THANK YOU!"}
              </Typography>
            </div>
          </div>
        </AppBar>
        <DialogContent>
          <DialogContentText>
            <div className="p-1" style={{ fontSize: "14px", fontWeight: "bold", color: "#818080", textAlign: "left", }}>
              <div style={{ marginTop: "15px" }}>Cảm ơn bạn đã hoàn thành khảo sát của chúng tôi</div>
              <div style={{ marginTop: "15px" }}>Góp ý của bạn sẽ giúp dịch vụ của chúng tôi hoàn thiện hơn trong tương lai.</div>
              <div style={{ marginTop: "15px", }}>Vui lòng cài đặt ứng dụng "{process.env.REACT_APP_HOSPITAL}" để nhận thông báo và nhiều thông tin từ chúng tôi!</div>
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions className='mb-5 mr-5'>
          <Button onClick={e => {
            // window.open("http://benhvienphusanhanoi.vn/")
            onCloseDialog()
          }} variant="contained" color="primary" style={{ backgroundColor: "#D53636" }}>
            Đóng
        </Button>
          {/* <Button
            className="whitespace-no-wrap"
            variant="contained"
            color="primary"
            onClick={e => {
              onCloseDialog()
              // handleInstallApp
            }
            }
          >
            Cài app
          </Button> */}
        </DialogActions>
      </div>
    </Dialog>
  );
}
export default AnswerSuccess;