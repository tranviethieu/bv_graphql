import React, { useState, useEffect,useCallback } from 'react';
import { useForm } from '@fuse/hooks'
import { Divider, IconButton, Icon, Button, List, ListItem, ListItemAvatar, ListItemText, Typography, Avatar } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import * as Actions from "../store/actions";
import BotWidget from './BotWidget';
import { makeStyles } from '@material-ui/styles';
const useStyles = makeStyles(theme => ({
    button: {
        margin: theme.spacing(1),
    },
    input: {
        display: 'none',
    },
}));
const initialData = {
    id: '',
    access_token: '',
    name: '',
    picture: '',
    expired: new Date()
}

function ZaloChatWidget() {
    const dispatch = useDispatch();
    const classes = useStyles();
    const drawer = useSelector(({ integrateApp }) => integrateApp.integrates.drawer)
    const { form: user, setForm: setUser } = useForm(initialData);
    const [pages, setPages] = useState([]);
    //thằng này dùng để cấu hình bot
    const [selectedChannel, setSelectedChannel] = useState(null);

    useEffect(() => {
        if (drawer.data && drawer.data.type === "ZALO_CHAT_OA") {
            if (drawer.data.template) {
                setUser(drawer.data.template);

            }
            if (drawer.data.channels)
                setPages(drawer.data.channels)
            else
                setPages([]);
        }
    }, [setUser, drawer.data])

    const handleSelectedChannelChange = useCallback((channel) => {
        var filter = pages.filter((item) => (item._id !== channel._id));
        setPages([...filter,channel])
    })
    function onOpen() {

    }
    function onClose() {
        dispatch(Actions.hideDrawer())
    }
    function loginZalo() {
        var zaloWindow = window.open(process.env.REACT_APP_LOGIN_ZALO_URL + 'zalo_chat_oa', 'MsgWindow', 'height=500,width=400');
        var timer = setInterval(function () {
            if (zaloWindow.closed) {
                clearInterval(timer);
                //reload data channel
                dispatch(Actions.showDrawer(drawer.data.type));
            }
        }, 1000);
    }

    return (
        <SwipeableDrawer
          className="h-full absolute z-30 el-ZaloChatWidget-Cover"
          variant="temporary"
          anchor="right"
          open={(drawer.open && drawer.data && drawer.data.type === "ZALO_CHAT_OA") ? true : false}
          onClose={onClose}
          onOpen={onOpen}
          style={{ position: 'absolute' }}
          ModalProps={{
            keepMounted: true,
            disablePortal: true,
            BackdropProps: {
              classes: {
                root: "absolute"
              }
            }
          }}
        >
          <div style={{ height: "100%", backgroundColor: "transparent", display: "flex", marginTop: "64px", color: "#595959" }} id = "el-ZaloChatWidget">
            {
              selectedChannel && <div style={{ backgroundColor: "#EBF1F4" }}>
                <div className="flex flex-1">
                  <IconButton onClick={e=>setSelectedChannel(null)} color="inherit">
                    <Icon>arrow_back</Icon>
                  </IconButton>

                  <Typography className="text-17 font-bold px-24 py-5 text-dark">Thiết lập chat bot</Typography>
                </div>
                <Divider />

                <BotWidget channel={selectedChannel} updateChange={handleSelectedChannelChange}/>

              </div>
            }
            {
              !selectedChannel && <div style={{ backgroundColor: "#EBF1F4" }}>
                <div className="flex flex-1">
                  <IconButton onClick={onClose} color="inherit">
                    <Icon>close</Icon>
                  </IconButton>

                  <Typography className="text-17 font-bold px-24 py-5 text-dark">Thiết lập liên kết với tài khoản Zalo của bạn</Typography>
                </div>
                <Divider />


                <div className="p-24 w-full">
                  {
                    drawer.data && drawer.data.active && drawer.data.template ?
                      <div className="flex bg-white p-12 flex flex-1" style={{ borderRadius: "3px", boxShadow: "0 4px 8px 0 rgba(255, 255, 255, 0.3), 0 6px 20px 0 rgba(0, 0, 0, 0.19" }}>
                        <Avatar style={{ marginTop: "20px", marginLeft: "20px", width: "110px", height: "110px" }} className="ml-4" src={user && user.picture} />
                        <div className="w-full pl-8">
                          <Typography style={{ fontSize: "20px", marginTop: "20px" }}>
                            Đang kết nối tới tài khoản
                          </Typography>
                          <div className="flex w-full p-16" style={{ backgroundColor: "#D9F6FE", borderRadius: "3px", justifyContent: "space-between" }}>
                            <div>
                              <Typography className="text-18 font-bold ml-1 mt-3" style={{ color: "#4464A2" }}>{user && user.name && user.name}</Typography>
                            </div>
                            <div>
                              <Button size="small" color="secondary" variant="contained" className={classes.button} onClick={_ => {
                                dispatch(Actions.disableIntegratedAccount(drawer.data._id));
                              }}>Ngắt kết nối</Button>
                              <Button size="small" color="primary" variant="contained" className={classes.button} onClick={loginZalo}>Chỉnh sửa</Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    :
                    <div style={{ marginTop: "20px", marginLeft: "20px", display: "flex" }}>
                      <img style={{ width: "50px", height: "50px", objectFit: "contain", }} src="assets/icons/integrate/icon-zalo.png" alt="login zalo" />
                      <Button variant="outlined" color="secondary" className={classes.button} onClick={loginZalo}>
                        Đăng nhập Zalo
                      </Button>
                    </div>
                  }
                  <List dense className={classes.root} style={{ fontSize: "18px" }}>
                    {pages.map((page, index) => {
                      console.log("page active: ", page.active)
                      return (
                        <ListItem key={index} button onClick={e => {
                          setSelectedChannel(page);
                        }}>

                          <ListItemAvatar>
                            <Avatar
                              alt={`${page.name}`}
                              src={page.image}
                            />
                          </ListItemAvatar>
                          <ListItemText style={{ fontSize: "20px", color: "#4464A2" }} id={index} primary={`${page.name}`} />

                          <IconButton>
                            <img src="assets/icons/integrate/icon-chatbot.png" style={{ width: 40, height: 40, filter: page.botOption&&page.botOption.enabled ? "" : "grayscale(100%)" }} alt = ""/>
                          </IconButton>
                        </ListItem>
                      );
                                })}
                            </List>
                        </div>

                    </div>
                }
            </div>
        </SwipeableDrawer>
    )
}

export default ZaloChatWidget;
