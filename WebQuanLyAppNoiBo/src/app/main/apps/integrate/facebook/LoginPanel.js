import React from 'react';
import { IconButton, Icon, Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { useDispatch } from 'react-redux';
import * as Actions from "../store/actions/index";
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'

const useStyles = makeStyles(theme => ({
    button: {
        margin: theme.spacing(1),
    },
    input: {
        display: 'none',
    },
}));



function LoginQuickPanel(props) {

    const dispatch = useDispatch();
    const classes = useStyles();

    function componentClicked(e) {
        console.log("componentCLicked:", e);
    }
    function responseFacebook(e) {
        console.log("responseFacebook:", e);
        // setUser(e);
        // loadPages(e.userID, e.accessToken);
        if(e && e !== null && e.status !== "unknown"){
            //đăng nhập xong thì gửi request lên sever, thành công thì lưu lại thông tin facebook đã đăng nhập vào redux và chuyển giao diện chọn page quản lý
            saveIntegrateAccount(e)
        }
    }
    function saveIntegrateAccount(e){
        const token = e.accessToken
        const name = e.name
        const uid = e.id
        const template =  {
            'accessToken': token,
            'uid':uid
        }
        const param = {
            active:"true",
            template: JSON.stringify(template),
            name:name,
            type:'FACEBOOK_CHAT'
        }
        Actions.saveIntegratedAccount( param, dispatch)
        .then(response => {
            console.log("respones: ", response.data._id)
            if(response && response.data && response.data._id){
                dispatch(Actions.setIntegreateId(response.data._id))
                dispatch(Actions.setFacebookLogedInUser(e))
                props.handleLogedIn()
            }
        })
    }

    return (
        <div style={{ width: "780px", height: "100%", backgroundColor: "transparent", display: "flex", marginTop: "64px", color: "#595959" }} id = "el-integrate-LoginPanel">
          <div style={{ width: "780px", height: "100%", backgroundColor: "#EBF1F4", float: "right" }}>
            <IconButton onClick={ev => dispatch(Actions.closeFacebookLoginSidebar())} color="inherit">
              <Icon>close</Icon>
            </IconButton>
            <Typography variant="h5" style={{ marginLeft: "40px", fontSize: "bold" }}>TÍCH HỢP FACEBOOK</Typography>
            <div style={{ width: "630px", height: "300px", marginLeft: "40px", marginTop: "20px", backgroundColor: "white", display: "flex", borderRadius: "3px", boxShadow: "0 4px 8px 0 rgba(255, 255, 255, 0.3), 0 6px 20px 0 rgba(0, 0, 0, 0.19)" }}>
              <img style={{ width: "130px", height: "130px", objectFit: "contain", marginTop: "16px", marginLeft: "16px" }} alt="facebook" src="assets/icons/integrate/icon-facebook-large.png" />
              <div style={{ marginLeft: "20px" }}>
                <Typography style={{ fontSize: "20px", marginTop: "20px" }}>
                  Giao tiếp với người dùng Facebook qua el-CRM
                </Typography>
                <Typography style={{ fontSize: "18px", marginTop: "20px" }}>
                  Kết nối trang Facebook của công ty bạn với Open Channel và giao tiếp với người dùng Facebook thông qua el-CRM.
                </Typography>
                <ul style={{ fontSize: "16px", marginTop: "15px" }}>
                  <li>Tự động phân phối tin nhắn đến theo các quy tắc hàng đợi</li>
                  <li>Giao diện trò chuyện quen thuộc của el-CRM</li>
                  <li>Tất cả các cuộc họi thoại đều được lưu vào lịch sử CRM</li>
                </ul>
              </div>
            </div>
            <div style={{ width: "630px", height: "300px", marginLeft: "40px", marginTop: "20px", backgroundColor: "white", display: "inline-block", borderRadius: "3px", boxShadow: "0 4px 8px 0 rgba(255, 255, 255, 0.3), 0 6px 20px 0 rgba(0, 0, 0, 0.19" }}>
              <Typography style={{ fontSize: "20px", marginTop: "20px", marginLeft: "20px" }}>
                Vui lòng xác thực với tài khoản Facebook quản lý các trang của bạn để nhận tin nhắn từ khách hàng el-CRM của bạn
              </Typography>
              <div style={{ width: "610", height: "1px", marginLeft: "20px", marginTop: "10px", borderBottom: "1px solid #979797" }}></div>
              <Typography style={{ fontSize: "16px", marginTop: "20px", marginLeft: "20px" }}>
                Kết nối trang Facebook của công ty bạn với el-CRM và bắt đầu giao tiếp với khách hàng thông qua trò chuyện el-CRM. Bạn cần tạo trang Facebook của công ty mình hoặc sử dụng một trang hiện có. Bạn phải là quản trị viên của trang đó.
              </Typography>
              <div style={{ marginTop: "20px", marginLeft: "20px", display: "flex" }}>
                <img style={{ width: "50px", height: "50px", objectFit: "contain", }} src="assets/icons/integrate/icon-facebook-large.png" alt="icon facebook" />
                <FacebookLogin
                  appId="1515131395301241"
                  autoLoad={false}
                  fields="name,email,picture"
                  scope="manage_pages,pages_messaging"
                  onClick={componentClicked}
                  callback={responseFacebook}
                  render={renderProps => (
                    <Button variant="outlined" color="secondary" className={classes.button} onClick={renderProps.onClick}>
                      Đăng nhập
                    </Button>
                  )}
                />
              </div>
            </div>
          </div>
        </div>
    );
}
export default LoginQuickPanel;
