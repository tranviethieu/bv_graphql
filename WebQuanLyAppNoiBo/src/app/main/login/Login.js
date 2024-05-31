import React, { useState, useEffect } from 'react'
import { Card, CardContent, Hidden, Typography } from '@material-ui/core';
import { darken } from '@material-ui/core/styles/colorManipulator';
import { makeStyles } from '@material-ui/styles';
import { FuseAnimate } from '@fuse';
import classNames from 'classnames';
import ElsagaLoginTab from './tabs/ElsagaLoginTab';
import elsagaService from 'app/services/elsagaService';
import CloseDragable from "./LoginCloseDragDialog";
import { useSelector, useDispatch } from 'react-redux';
import * as authActions from 'app/auth/store/actions';
import moment from 'moment'
const useStyles = makeStyles(theme => ({
  root: {
    // background: 'linear-gradient(to right, ' + theme.palette.primary.dark + ' 0%, ' + darken(theme.palette.primary.dark, 0.5) + ' 100%)',
    // color: theme.palette.primary.contrastText
    background: 'linear-gradient(to right, #008cb7 0%, #4dbce9 100%)', color: theme.palette.primary.contrastText
  }
}));

export default function Login(props) {
  // componentDidMount(){
  //     elsagaService.logout()
  //     // CloseDragable()
  // }
  const dispatch = useDispatch();
  useEffect(() => {
    const { token } = props.match.params;

    console.log("current token=", token);
    if (token) {
      //query login to current api system
      // props.verifyToken(token);
      localStorage.setItem('access_token', token);
      const expires_at = moment().add(1, 'days').toDate();
      localStorage.setItem('expires_at', expires_at);
      authActions.loadUserData()
      // dispatch(authActions.verifyToken(token));

    }
  }, [props.match.params]);

  const classes = useStyles(props);
  return (
    <React.Fragment>
      <div className={classNames(classes.root, "flex flex-col flex-1 flex-no-shrink p-24 md:flex-row md:p-0")} id="el-LoginPageCover">
        <Hidden>
          <CloseDragable></CloseDragable>
        </Hidden>
        <div className="flex flex-col flex-no-grow items-center text-white p-16 text-center md:p-128 md:items-start md:flex-no-shrink md:flex-1 md:text-left">

          <FuseAnimate animation="transition.expandIn">
            <img className="w-128 mb-32" src={process.env.REACT_APP_LOGO} alt="logo" id="el-ImageLogin" />
          </FuseAnimate>

          <FuseAnimate animation="transition.slideUpIn" delay={300}>
            <Typography variant="h3" className="font-light el-LoginTitle">
              {process.env.REACT_APP_HOSPITAL_UPPERCASE}
            </Typography>
          </FuseAnimate>

          <FuseAnimate delay={400}>
            <Typography variant="subtitle1" color="inherit" className="max-w-512 mt-16 el-LoginTitle2">
              Hệ thống quản trị nội bộ
            </Typography>
          </FuseAnimate>
        </div>

        <FuseAnimate animation={{ translateX: [0, '100%'] }}>

          <Card className="w-full max-w-400 mx-auto m-16 md:m-0 el-LoginForm">

            <CardContent className="flex flex-col items-center full-width">
              <img className="w-96 mb-32 el-LoginFormImage" src={process.env.REACT_APP_LOGO} alt="logo" />
              <Typography variant="h6" className="text-center md:w-full mb-48 el-LoginFormTitle">Đăng nhập hệ thống</Typography>

              <ElsagaLoginTab />


            </CardContent>
          </Card>
        </FuseAnimate>
      </div>
    </React.Fragment>
  )
}
