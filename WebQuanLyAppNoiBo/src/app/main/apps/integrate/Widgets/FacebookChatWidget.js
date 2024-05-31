import React, { useState, useEffect,useCallback } from 'react';
import { useForm } from '@fuse/hooks'
import { Divider, IconButton, Icon, Button, List, ListItem, ListItemAvatar, ListItemText, Typography, Avatar } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import * as Actions from "../store/actions";
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import axios from 'axios';
import { showMessage } from 'app/store/actions';
import _ from 'lodash';
import { makeStyles } from '@material-ui/styles';
import moment from 'moment';
import { omit } from '@utils';
import BotWidget from './BotWidget';


const initialData = {
    id: '',
    access_token: '',
    name: '',
    picture: '',
    expired: new Date()
}
const useStyles = makeStyles(theme => ({
    button: {
        margin: theme.spacing(1),
    },
    input: {
        display: 'none',
    },
}));


function FacebookChatWidget() {
    const dispatch = useDispatch();
    const classes = useStyles();
    const drawer = useSelector(({ integrateApp }) => integrateApp.integrates.drawer)
    const { form: user, setForm: setUser } = useForm(initialData);
    const [pages, setPages] = useState([]);
    const [active, setActive] = useState(false);
    //thằng này dùng để cấu hình bot
    const [selectedChannel, setSelectedChannel] = useState(null);

    const handleSelectedChannelChange = useCallback((channel) => {
        var filter = pages.filter((item) => (item._id !== channel._id));
        setPages([...filter, channel])
    })
    useEffect(() => {
      if (drawer.data && drawer.data.type === "FACEBOOK_CHAT") {
            console.log("drawer data:", drawer.data);
            if (drawer.data.template) {
                setUser(drawer.data.template);
                setActive(drawer.data.active);
            }
            if (drawer.data.channels)
                setPages(drawer.data.channels)
            else
                setPages([]);
        }
    }, [drawer.data])

    function saveIntegrateAccount(e) {
        const template = {
            access_token: e.accessToken,
            id: e.id,
            name: e.name,
            email: e.email,
            picture: e.picture ? e.picture.data.url : "",
            expired: moment().add(e.expiresIn, 'seconds')
        }
        const data = omit(drawer.data, ['channels']);//data ko co channels
        dispatch(Actions.saveIntegratedAccount({ ...data, active: true, template: JSON.stringify(template) }, true));
        //thiet lap kenh
        //vì đây là login lại nên ta sẽ reload lại kênh
        loadPages(e.id, e.accessToken);
    }
    function loadPages(id, access_token) {
        if (id !== null && access_token !== null) {
            axios.get(`https://graph.facebook.com/me/accounts?access_token=${access_token}`).then(response => {
                console.log("pages data:", response.data);
                // setPages(response.data.data);
                const pages = response.data.data;
                if (pages) {
                    pages.forEach(function (page) {
                        //xay dung doi tuong theo đúng cấu trúc lưu trên server
                        var channel = {
                            accessToken: page.access_token,
                            channelId: page.id,
                            active: true,//neu dể fail thì nó sẽ không được hiển thị trong danh sách channel
                            name: page.name,
                            image: "",
                            type: drawer.data.type
                        }
                        loadSubscribe(channel);
                    })
                }
            })
        }
    }
    function loadSubscribe(page) {
        var urlCheck = `https://graph.facebook.com/${page.channelId}/subscribed_apps?access_token=${page.accessToken}`;
        axios.get(urlCheck).then(response => {
            if (response.data.data.length > 0) {
                page.active = true;

            }
            saveIntegratedChannel(page)
        })
    }
    function saveIntegratedChannel(channel) {
        // console.log("facebooksidebar reducer: ", facebook)
        //hàm này cho phép cập nhật trạng thái subcribed cho nhiều page lên server
        Actions.saveIntegratedChannel(channel)
            .then(response => {
                if (response && response.data) {
                    pages.push(response.data)
                    setPages([...pages]);
                }
            })
    }
    function onOpen() {

    }
    function onClose() {
        dispatch(Actions.hideDrawer())
    }
    function responseFacebook(e) {
        console.log("responseFacebook:", e);
        // setUser(e);
        // loadPages(e.userID, e.accessToken);
        if (e && e !== null && e.status !== "unknown") {
            //đăng nhập xong thì gửi request lên sever, thành công thì lưu lại thông tin facebook đã đăng nhập vào redux và chuyển giao diện chọn page quản lý
            saveIntegrateAccount(e)
        }
    }
    function unSubscribe(channel) {
        var url = `https://graph.facebook.com/v5.0/${channel.channelId}/subscribed_apps?access_token=${channel.accessToken}`;
        axios.delete(url).then(response => {
            if (response.data && response.data.success) {
                dispatch(showMessage({ message: `Bỏ thiết lập theo dõi trang ${channel.name} thành công` }));

                Actions.unSubcribedChannel(channel._id).then(() => {
                    changePageSubcribedValue(channel, false)
                });
            }
        });
    }
    function subscribePage(channel) {
        console.log(`subscribePage: token: ${channel.accessToken}  pageID : ${channel.channelId}`)
        var url = `https://graph.facebook.com/v5.0/${channel.channelId}/subscribed_apps?subscribed_fields=feed,messages`;
        axios.post(url, `access_token=${channel.accessToken}`).then(response => {
            if (response.data && response.data.success) {
                dispatch(showMessage({ message: `Thiết lập theo dõi trang ${channel.name} thành công` }));
                Actions.subcribedChannel(channel._id).then(() => {
                    changePageSubcribedValue(channel, true)
                })
            }
        });
    }
    function changePageSubcribedValue(page, value) {
        page.active = value
        const currentIndex = pages.indexOf(page);
        const newChecked = [...pages];
        _.fill(newChecked, page, currentIndex, currentIndex)
        setPages(newChecked)
    }
    function componentClicked(e) {
        console.log("componentCLicked:", e);
    }
    return (
        <SwipeableDrawer
          className="h-full absolute z-30 el-FacebookChatWidget-Cover"
          variant="temporary"
          anchor="right"
          open={(drawer.open && drawer.data && drawer.data.type === "FACEBOOK_CHAT") ? true : false}
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
          <div style={{ width: "780px", height: "100%", backgroundColor: "transparent", display: "flex", marginTop: "64px", color: "#595959" }} id = "el-FacebookChatWidget">
            {
              selectedChannel && <div style={{ backgroundColor: "#EBF1F4" }}>
                <div className="flex flex-1">
                  <IconButton onClick={e => setSelectedChannel(null)} color="inherit">
                    <Icon>arrow_back</Icon>
                  </IconButton>

                  <Typography className="text-17 font-bold px-24 py-5 text-dark">Thiết lập chat bot</Typography>
                </div>
                <Divider />

                <BotWidget channel={selectedChannel} updateChange={handleSelectedChannelChange} />

              </div>
            }
            {
              !selectedChannel &&
              <div style={{ width: "720px", backgroundColor: "#EBF1F4" }}>
                <div className="flex flex-1">
                  <IconButton onClick={onClose} color="inherit">
                    <Icon>close</Icon>
                  </IconButton>

                  <Typography className="text-17 font-bold px-24 py-5 text-dark">Thiết lập liên kết với tài khoản Facebook của bạn</Typography>
                </div>
                <Divider />
                <div className="p-24 w-full">
                  {
                    drawer.data && drawer.data.active && drawer.data.template ?
                      <div className="flex bg-white p-12 flex flex-1" style={{ borderRadius: "3px", boxShadow: "0 4px 8px 0 rgba(255, 255, 255, 0.3), 0 6px 20px 0 rgba(0, 0, 0, 0.19" }}>
                        {/* <img style={{ width: "130px", height: "130px", objectFit: "contain", marginTop: "16px", marginLeft: "16px" }} alt="facebook" src={user && user.picture} /> */}
                        <Avatar style={{ marginTop: "20px", marginLeft: "20px", width: "110px", height: "110px" }} className="ml-4" src={user && user.picture} />
                        <div className="w-full pl-8">
                          <Typography style={{ fontSize: "20px", marginTop: "20px" }}>
                            Đang kết nối tới tài khoản
                          </Typography>
                          <div className="flex w-full p-16" style={{ backgroundColor: "#D9F6FE", borderRadius: "3px", justifyContent: "space-between" }}>
                            <Typography className="text-18 font-bold ml-1 mt-3" style={{ color: "#4464A2" }}>{user && user.name && user.name}</Typography>
                            <div>
                              <Button size="small" color="secondary" variant="contained" className={classes.button} onClick={_ => {
                                dispatch(Actions.disableIntegratedAccount(drawer.data._id));
                              }}>Ngắt kết nối</Button>
                              <FacebookLogin
                                appId={process.env.REACT_APP_FACEBOOK_APP_ID}
                                autoLoad={false}
                                fields="name,email,picture"
                                scope="manage_pages,pages_messaging"
                                onClick={componentClicked}
                                callback={responseFacebook}
                                render={renderProps => (
                                  <Button size="small" color="primary" variant="contained" className={classes.button} onClick={renderProps.onClick}>
                                    Cập nhật
                                  </Button>
                                )}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    :
                    <div style={{ marginTop: "20px", marginLeft: "20px", display: "flex" }}>
                      <img style={{ width: "50px", height: "50px", objectFit: "contain", }} src="assets/icons/integrate/icon-facebook-large.png" alt="icon facebook" />
                      <FacebookLogin
                        appId={process.env.REACT_APP_FACEBOOK_APP_ID}
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
                            <img src="assets/icons/integrate/icon-chatbot.png" style={{ width: 40, height: 40, filter: page.botOption&&page.botOption.enabled ? "" : "grayscale(100%)" }} alt = "" />
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

export default FacebookChatWidget;
