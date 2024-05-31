import React from "react";

import { AUTH_TOKEN, PROFILE } from 'Constants';
import authCheck from 'utils/authCheck'
import { withApollo } from "react-apollo";
import 'styles/loginstyle.css'
import { ME } from 'GqlQuery';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

class LoginPage extends React.Component {
  state = {
    username: "",
    password: "",
    remember: true
  };

  doSubmit = () => {
    const { username, password } = this.state;
    const params = {
      'grant_type': process.env.REACT_APP_GRANT_TYPE,
      'username': username,
      'password': password,
      'client_secret': process.env.REACT_APP_CLIENT_SECRET,
      'client_id': process.env.REACT_APP_CLIENT_ID,
      'scope': process.env.REACT_APP_SCOPE
    };
    // const formData = new FormData();
    // for (let p in params) {
    //   formData.append(p, params[p]);
    // }
    let formBody = [];
    for (let p in params) {
      var encodedKey = encodeURIComponent(p);
      var encodedValue = encodeURIComponent(params[p]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    const request = {
      method: 'POST',
      body: formBody,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
    };
    fetch(`${process.env.REACT_APP_API_HOST}/identity/connect/token`, request)
      .then((response) => response.json())
      .then((data) => {
        // console.log('response:', data);
        //load my profile then go to dashboard
        localStorage.setItem(AUTH_TOKEN, JSON.stringify(data));
        this.props.client.query({
          query: ME
        }).then(result => {
          if (authCheck(result.data.response) && result.data.response.data !== null) {
            localStorage.setItem(PROFILE, JSON.stringify(result.data.response.data));
            this.props.history.push("/");
          }
        })

      })
      .catch((error) => {
        console.warn(error);
      });
  }
  // handleSubmitResult = (data) => {
  //   localStorage.setItem(AUTH_TOKEN, JSON.stringify(data.login.data));
  //   this.props.history.push("/");
  // }
  onLogoClick = () => { };

  render() {
    const { username, password, remember } = this.state;
    return (
      <div className="main-login bg-222f3e full-width">
        <main>
          <div className="login-box d-flex p-30">
            <div className="flex-item">
              <div className="login-logo">
                <div className="login-container">
                  <img src={process.env.REACT_APP_LOGO} alt="BỆNH VIỆN ĐA KHOA PHÚ THỌ ADMIN PORTAL" className="img-reponsive logo-img" />
                  <h2 className='text-white mt-10 text-bold'>{process.env.REACT_APP_HOSPITAL_NAME}</h2>
                  <h4 className='text-white mt-10'>HỆ THỐNG QUẢN TRỊ TRUNG TÂM</h4>
                </div>
              </div>
              <div className="content-box">
                <div className="text-box text-white mt-60">
                  <h4><b>AN TOÀN - HIỆU QUẢ -
                    DỄ SỬ DỤNG</b></h4>
                  <ul>
                    <li>Quản trị điều phối các hoạt động</li>
                    <li>Đa nền tảng trình duyệt, mobile (iOS, Android)</li>
                    <li>Hợp nhất dữ liệu, quản trị tập trung</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="flex-item">
              <div className="content-box">
                <div className="login-form">
                  {/* <div className="login-header bg-40739e p-20 text-bold text-white" style={{ backgroundColor: "#0091FF" }}> */}
                  <div className="login-header bg-40739e p-20 text-bold text-white">
                    <p>ĐĂNG NHẬP</p>
                  </div>
                  <div className="login-body d-flex flex-col">
                    <TextField id="login-user" label="Tên đăng nhập" variant="outlined" value={username} onKeyPress={e => {
                      if (e.charCode === 13) this.doSubmit();
                    }} onChange={e => this.setState({ username: e.target.value })} className="text-input" />

                    {/* <input value={username} onKeyPress={e => {
                      if (e.charCode === 13) this.doSubmit();
                    }} onChange={e => this.setState({ username: e.target.value })} type="text" className="text-input" placeholder="Tên đăng nhập" /> */}

                    <TextField id="login-password" label="Mật khẩu" variant="outlined" onKeyPress={e => {
                      if (e.charCode === 13) this.doSubmit();
                    }} value={password} onChange={e => this.setState({ password: e.target.value })} type="password" className="text-input mt-30" />

                    {/* <input onKeyPress={e => {
                      if (e.charCode === 13) this.doSubmit();
                    }} value={password} onChange={e => this.setState({ password: e.target.value })} type="password" className="text-input" placeholder="Mật khẩu" /> */}
                    {/* <Button onClick={this.doSubmit} className="btn-login text-white text-bold full-width mt-30" style={{ backgroundColor: "#0091FF" }}>ĐĂNG NHẬP</Button> */}
                    <Button onClick={this.doSubmit} className="btn-login text-white text-bold full-width mt-30">ĐĂNG NHẬP</Button>
                  </div>
                  <div className="login-footer"> <a href="#" className="link">Quên mật khẩu?</a> </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <footer>
          <div className="col-12 copy-right">
            <p className="text-center pading-24 text-white">{process.env.REACT_APP_COPYRIGHT}</p>
          </div>
        </footer>
      </div>

    );
  }
}
export default withApollo(LoginPage);
