import React from 'react';
import { Typography } from '@material-ui/core';
import { FuseAnimate } from '@fuse';
import { Link } from 'react-router-dom';

function Welcome() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center p-16">

      <div className="max-w-512 text-center">

        <FuseAnimate animation="transition.expandIn" delay={100}>
          <img className="w-128 mb-32" src={process.env.REACT_APP_LOGO_IMAGE} alt="logo" id="el-ImageLogin" />
          {/* <Typography variant="h1" color="inherit" className="font-medium mb-16">
                Tài khoản chưa được phân quyền
              </Typography> */}
        </FuseAnimate>

        <FuseAnimate delay={500}>
          <Typography variant="h5" color="textSecondary" className="mb-16">
            Chào mừng bạn đến với Hệ thống quản trị khách hàng {process.env.REACT_APP_HOSPITAL}!
              </Typography>
        </FuseAnimate>
        {/* <FuseAnimate delay={500}>
              <Typography color="textSecondary" className="mb-16">
                Vui lòng liên hệ với người quản trị hoặc sử dụng tài khoản khác để sử dụng các tính năng của hệ thống
              </Typography>
            </FuseAnimate> */}
        <FuseAnimate delay={500}>
          <Typography color="textSecondary" className="mb-16">
            <Link className="font-medium" to="/login">Quay lại trang đăng nhập</Link>
          </Typography>
        </FuseAnimate>
      </div>
    </div>
  );
}

export default Welcome;
