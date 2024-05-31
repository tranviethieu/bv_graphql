import React, { useEffect, useState } from 'react';
import { Drawer, AppBar, Toolbar, Typography, IconButton, Hidden, Avatar, Icon, Paper, Button, Tooltip } from '@material-ui/core';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import withReducer from 'app/store/withReducer';
import * as Actions from "./store/actions/index";
import * as BaseActions from 'app/store/actions';
import ChatTest from './ChatTest'
import ChatsSidebar from "./ChatsSidebar";
import ChatChanelSidebar from './ChatChanelSidebar'
import ContactSidebar from './ContactSidebar';
import UserSidebar from './UserSidebar';
import reducer from './store/reducers';
import { makeStyles } from '@material-ui/styles';
import _ from "@lodash"
import Select from 'react-select';
import history from '@history';
import * as utils from "@utils"
import { showUserDialog } from 'app/main/apps/shared-dialogs/actions'
import { showMessage } from 'app/store/actions/fuse';
import { showConfirmDialog } from '../shared-dialogs/actions';
import UpdateUserPhoneDialog from './UpdateUserPhoneDialog';
import { FuseChipSelect } from '@fuse';

// const drawerWidth = 400;
const drawerWidth = 280;
const contactSidebarWidth = 280;
const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    minHeight: '100%',
    position: 'relative',
    flex: '1 1 auto',
    height: 'auto',
    backgroundColor: theme.palette.background.default,
    width: '100%',
    overflow: 'hidden',
  },
  topBg: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
    backgroundImage: 'url("assets/images/integrate/integrateBG.jpeg")',
    backgroundColor: theme.palette.primary.dark,
    backgroundSize: 'cover',
    pointerEvents: 'none',
    objectFit: "cover",
    // filter          : "blur(6px)"
  },

  contentCardWrapper: {
    position: 'relative',
    // padding: 24,
    maxWidth: '90%',
    // maxWidth                      : '100%',
    display: 'flex',
    flexDirection: 'column',
    flex: '1 0 auto',
    // width: '100%',
    minWidth: '0',
    maxHeight: '100%',
    margin: '0 auto',
    [theme.breakpoints.down('sm')]: {
      padding: 16
    },
    [theme.breakpoints.down('xs')]: {
      padding: 12
    }
  },
  contentCard: {
    display: 'flex',
    position: 'relative',
    flex: '1 1 100%',
    flexDirection: 'row',
    backgroundImage: 'url("/assets/images/patterns/rain-grey.png")',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[1],
    borderRadius: 8,
    minHeight: 0,
    overflow: 'hidden',

  },
  drawerPaper: {
    width: drawerWidth,
    maxWidth: '100%',
    overflow: 'hidden',
    height: '100%',
    [theme.breakpoints.up('md')]: {
      position: 'relative'
    }
  },
  contentWrapper: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 100%',
    zIndex: 10,
    // maxWidth: `calc(100% - 75px - 40px - 280px)`,
    maxWidth: "100%",
    [theme.breakpoints.down('md')]: {
      // maxWidth: '100%',
    },
    background: `linear-gradient(to bottom, ${fade(theme.palette.background.paper, 0.8)} 0,${fade(theme.palette.background.paper, 0.6)} 20%,${fade(theme.palette.background.paper, 0.8)})`
  },
  content: {
    display: 'flex',
    flex: '1 1 100%',
    minHeight: 0,
    // width:"100%"
  },
  selectComponent: {
    zIndex: 1000,
    color: "black"
    // background: "white",
    // width: "300px",
    // height: "50px"

  }
}));

function ChatApp(props) {
  const dispatch = useDispatch();
  const mobileChatsSidebarOpen = useSelector(({ chatApp }) => chatApp.sidebars.mobileChatsSidebarOpen);
  const userSidebarOpen = useSelector(({ chatApp }) => chatApp.sidebars.userSidebarOpen);
  const contactSidebarOpen = useSelector(({ chatApp }) => chatApp.sidebars.contactSidebarOpen);
  const [conversationId, setConversationId] = useState(null);
  const classes = useStyles(props);

  //trongpv

  const selectedIntegratedApp = useSelector(({ chatApp }) => chatApp.contacts.selectedIntegratedApp);
  const [selectedIntegratedAppChannel, setSelectedIntegratedAppChannel] = useState(null)
  const [integratedAppChannels, setIntegratedAppChannels] = useState([])

  const [members, setMembers] = useState([]);
  const [jobIdNew, setJobIdNew] = useState(null)
  // var conversations = useSelector(({ chatApp }) => chatApp.contacts.conversations)
  var selectedConversation = useSelector(({ chatApp }) => chatApp.contacts.selectedConversation);
  var conversationsFiltered = useSelector(({ chatApp }) => chatApp.contacts.conversations_filtered);

  useEffect(() => {
    Actions.get_assignable_account(dispatch).then(response => {
      setMembers(response.data);
    })
  }, []);
  useEffect(() => {
    var { conversationId } = props.match.params;
    if (conversationId) {
      setConversationId(conversationId);
    }
  }, [props]);
  useEffect(()=>{
    var { jobId } = props.match.params;
    if (jobId){
      Actions.get_job_assignment(jobId, dispatch).then(response =>{
        if(response.code === 0){
          if(response.data.state !== "COMPLETE" && response.state !== "CANCEL"){
            setJobIdNew(jobId)
          }
          else{
            setJobIdNew(null)
          }
        }
        else {
          dispatch(showMessage({message: response.message}));
        }
      })
    }
    else{
      setJobIdNew(null)
    }
  }, [props, jobIdNew])
  function finishJob(){
    dispatch(showConfirmDialog({
        title: "Xác nhận hoàn thành công việc", message: `Bạn có chắc muốn xác nhận hoàn thành công việc này?`, onSubmit: () => {
            Actions.updataStateJob(jobIdNew, "COMPLETE").then(response => {
                if (response.code === 0) {
                    dispatch(showMessage({ message: "Cập nhật công việc thành công" }));
                    setJobIdNew(null)
                    history.push("/apps/assignment/workto")
                } else {
                    dispatch(showMessage({ message: response.message}));
                }
            })
        }
    }))
  }
  function onAssignTo(member) {
    // console.log("assign to:", member,"conversation:",selectedConversation );
    const submitData = {
      members: [{ _id: member.value, name: member.label }],
      linked: {
        _id: selectedConversation._id,
        link: `/apps/chat/${selectedConversation._id}`,
        type:'integrateduser'
      },
      info:`${selectedConversation.name} - kênh ${selectedConversation.channel&&selectedConversation.channel.name}`
    }
    Actions.create_assign_job(submitData, dispatch).then(response => {
      if (response.code == 0) {
        dispatch(showMessage({ message: "Tạo ủy quyền thành công" }));
      } else {
        dispatch(showMessage({ message: response.message}));
      }
    });
  }
  useEffect(() => {
    dispatch(Actions.setSelectedChatChannel(null))
    setSelectedIntegratedAppChannel(null)
    setIntegratedAppChannels([])
    if (selectedIntegratedApp && selectedIntegratedApp.channels) {
      var temp = [{ value: null, label: "Tất cả" }]
      selectedIntegratedApp.channels.map(e => {
        temp.push({ value: e, label: e.name })
      })
      setIntegratedAppChannels(temp)
    }
  }, [dispatch, selectedIntegratedApp])

  useEffect(() => {
    //reset redux khi lấy lại list apps
    Actions.resetBeforGetNewIntegratedApps(dispatch)

    Actions.getIntegrateChatApps()
      .then(response => {
        if (response && response.data) {
          // console.log("list integrate apps: ", response.data)
          dispatch(Actions.setIntegratedApps(response.data))
          if (response.data.length > 0) {
            dispatch(Actions.setSelectedIntegratedApp(response.data[0]))

            //trước khi set lại filter conversation thì reset chat-message và conversation-page về 0
            Actions.resetBeforGetNewConversations(dispatch)

            //set filter for load conversations
            const appType = response.data[0].type
            var filter = { id: "type", value: appType }
            dispatch(Actions.setConversationFiltered([filter]))
          }
        }
      })
  }, [dispatch])

  const handleChange = selectedOption => {
    console.log("selected: ", selectedOption)
    setSelectedIntegratedAppChannel(selectedOption)
    dispatch(Actions.setSelectedChatChannel(selectedOption))

    let filId = "recent_message.channel_id"
    let tempFilltered = []

    if (selectedOption.value === null) {
      //trường hợp chọn tất cả: remove fillter với id channel.id ra khỏi mảng filter là xong
      // dùng filter: chỉ laasy ra những đối tượng có id != filId
      tempFilltered = _.filter(conversationsFiltered, function (e) {
        return (e.id !== filId)
      })
    } else {
      let foundObject = _.find(conversationsFiltered, function (e) {
        return (e.id === filId);
      });

      let fil = { id: filId, value: selectedOption.value.channelId }
      if (foundObject && foundObject !== null && foundObject !== undefined) {
        //nếu object này đã tồn tại thì replace
        let index = _.findIndex(conversationsFiltered, function (e) {
          return (e.id === filId)
        })
        if (index !== -1) {
          tempFilltered = utils.replaceObjectAtIndex(conversationsFiltered, fil, index)
        }
      } else {
        //nếu object này chưa tồn tại thì add vào
        tempFilltered = [...conversationsFiltered, fil]
      }
    }
    // console.log("app filtered new: ", tempFilltered)
    Actions.resetBeforSetNewConversationsFiltered(dispatch)
    dispatch(Actions.setConversationFiltered(tempFilltered))
  };

  function showUserInfo() {
    // console.log("===> phone: ", selectedConversation && selectedConversation.user && selectedConversation.user.phoneNumber)
    // console.log("===> user:", selectedConversation.user)
    if (selectedConversation) {
      console.log("===> chay vao day roi nhe,", selectedIntegratedApp)
      if (selectedConversation._id && selectedConversation.user && selectedConversation.user.phoneNumber) {
        dispatch(showUserDialog({ rootClass: "el-coverFUD", phoneNumber: selectedConversation.user.phoneNumber, channelType: selectedIntegratedApp.type === "ZALO_CHAT_OA" ? "ZALOMESSENGER" : selectedIntegratedApp.type === "FACEBOOK_CHAT" ? "FBMESSENGER" : null }))
      } else {
        dispatch(showMessage({ message: "Thông tin người dùng chưa được kết nối với hệ thống. Vui lòng cập nhật số điện thoại người dùng để kết nối vào hệ thống." }));
        dispatch(BaseActions.openDialog({
          children: (
            <UpdateUserPhoneDialog userId={selectedConversation._id} />
          )
        }))
      }
    }
  }
  return (
    <div className={clsx(classes.root)} id="el-ChatApp">
      <div className={clsx(classes.contentCardWrapper, 'container')}>
        <div style={{ width: "100%", height: "65px", backgroundColor: "transparent", display: "block", marginBottom: "10px" }}>
          <div className='flex-row'>
            <div className="select_chat">
              <ChatChanelSidebar></ChatChanelSidebar>
            </div>
            <div style={{ minWidth: "350px", marginLeft: "20px" }}>
              <Select
                className={clsx(classes.selectComponent)}
                value={selectedIntegratedAppChannel}
                onChange={handleChange}
                options={integratedAppChannels}
                placeholder={"Chọn kênh chat"}
                isClearable={true}
                isSearchable={true}
              />
            </div>
          </div>
          {/* <div style={{ marginTop: "5px", marginLeft: "5px", marginRight: "5px", height: "1px", backgroundColor: "#979797" }} /> */}
        </div>
        {/* <div style={{ display: 'flex', width: '100%' }}> */}
        <div className={classes.contentCard + ' chat-box-content'}>
          <Hidden mdUp>
            <Drawer
              className="h-full absolute z-20"
              variant="temporary"
              anchor="left"
              open={mobileChatsSidebarOpen}
              onClose={() => dispatch(Actions.closeMobileChatsSidebar())}
              classes={{
                paper: clsx(classes.drawerPaper, "absolute left-0")
              }}
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
              <ChatsSidebar conversationId={conversationId} />
            </Drawer>
          </Hidden>
          <Hidden smDown>
            <Drawer
              className="h-full z-20"
              variant="permanent"
              open
              style={{ width: `${contactSidebarWidth}`, maxWidth: `${contactSidebarWidth}` }}
              classes={{
                paper: classes.drawerPaper
              }}
            >
              <ChatsSidebar conversationId={conversationId} />
            </Drawer>
          </Hidden>
          <Drawer
            className="h-full absolute z-30"
            variant="temporary"
            anchor="left"
            open={userSidebarOpen}
            onClose={() => dispatch(Actions.closeUserSidebar())}
            classes={{
              paper: clsx(classes.drawerPaper, "absolute left-0")
            }}
            style={{ position: 'absolute' }}
            ModalProps={{
              keepMounted: false,
              disablePortal: true,
              BackdropProps: {
                classes: {
                  root: "absolute"
                }
              }
            }}
          >
            <UserSidebar />
          </Drawer>


          <main className={clsx(classes.contentWrapper, "z-10")}>
            {!selectedConversation ?
              (
                <div className="flex flex-col flex-1 items-center justify-center p-24">
                  <Paper className="rounded-full p-48">
                    <Icon className="block text-64" color="secondary">chat</Icon>
                  </Paper>
                  <Typography variant="h6" className="my-24">Chat</Typography>
                  <Typography className="hidden md:flex px-16 pb-24 mt-24 text-center" color="textSecondary">
                    Chọn một liên hệ để bắt đầu cuộc hội thoại!
                      </Typography>
                  <Button variant="outlined" color="primary" className="flex md:hidden normal-case" onClick={() => dispatch(Actions.openMobileChatsSidebar())}>
                    Chọn một liên hệ để bắt đầu cuộc hội thoại!
                      </Button>
                </div>
              ) : (
                <React.Fragment>
                  {/* {useMemo(() => ( */}
                  <AppBar className="w-full" position="static" elevation={1} >
                    <Toolbar className="px-16">
                      <IconButton
                        color="inherit"
                        aria-label="Open drawer"
                        onClick={() => dispatch(Actions.openMobileChatsSidebar())}
                        className="flex md:hidden"
                      >
                        <Icon>chat</Icon>
                      </IconButton>
                      <div style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center" }}>
                        {/* <div className="flex items-center cursor-pointer" onClick={() => dispatch(Actions.openContactSidebar())}> */}
                        <div className="flex items-center cursor-pointer" onClick={() => showUserInfo()}>
                          <div className="relative ml-8 mr-12">
                            <Avatar src={selectedConversation.avatar ? selectedConversation.avatar : "assets/icons/integrate/icon-user-default.png"} alt={selectedConversation.name ? selectedConversation.name : "Khách vãng lai"}>
                            </Avatar>
                          </div>
                          <Typography color="inherit" className="text-18 font-600">{selectedConversation.name ? selectedConversation.name : "Khách vãng lai"}</Typography>
                          <Typography style={{ marginLeft: "30px" }} color="inherit" className="text-18 font-600">{selectedConversation.channel && `Kênh: ${selectedConversation.channel.name}`}</Typography>
                        </div>
                        {
                          jobIdNew &&
                          <div>
                            <Button onClick = {() => finishJob()}>
                              <Tooltip title={"Hoàn thành công việc"} style={{ marginRight: "20px", color: "lightgreen" }}>
                                <Icon>
                                  check_circle
                                </Icon>
                              </Tooltip>
                            </Button>
                          </div>
                        }
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <div style={{minWidth:250}}>
                            <FuseChipSelect
                              onChange={(e) => onAssignTo(e)}
                              className="m-8 text-white"
                              size="sm"
                              // placeholder="Chọn người muốn ủy quyền"
                              // value={callCampaign ? { value: callCampaign._id, label: callCampaign.name } : null}
                              textFieldProps={{
                                label: 'Chọn người ủy quyền',
                                InputLabelProps: {
                                  shrink: true
                                },
                                variant: 'outlined'
                              }}
                              options={members && members.map((item) => ({
                                value: item._id, label: item.base.fullName
                              }))}
                            />
                          </div>
                          <Button onClick={e => showUserInfo()}>
                            <Tooltip title={"Thông tin cá nhân"} style={{ marginRight: "20px" }}>
                              <img style={{ width: "26px", height: "28px", objectFit: "cover" }} src={'assets/icons/integrate/icon-open-right-pannel.png'} alt="open right pannel"></img>
                            </Tooltip>
                          </Button>
                        </div>
                      </div>
                    </Toolbar>
                  </AppBar>
                  {/* ),[selectedConversation, dispatch])} */}

                  <div className={classes.content} style={{ display: "flex", width: '100%', height: "100%" }}>
                    {/* <Chat className="flex flex-1 z-10" /> */}
                    {/* trongpv Changed */}
                    <ChatTest className="flex flex-1 z-10" selectedConversation={selectedConversation} />
                    {/* {showProfilePannel &&
                          <div style={{ width: "100%", height: "100%", backgroundColor: "#EBF1F4", maxWidth: '50%', textAlign: "center", minWidth: '200px', padding: '8px', }}>
                          <UserProfile onClose={e => setShowProfilePannel(false)} />
                          </div>
                        } */}
                  </div>
                </React.Fragment>
              )
            }
          </main>
        </div>

        <Drawer
          className="h-full absolute z-30"
          variant="temporary"
          anchor="right"
          open={contactSidebarOpen}
          onClose={() => dispatch(Actions.closeContactSidebar())}
          classes={{
            paper: clsx(classes.drawerPaper, "absolute right-0")
          }}
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
          <ContactSidebar />
        </Drawer>

      </div>
      {/* </div> */}
      {/* </div> */}
    </div>
  );
}

export default withReducer('chatApp', reducer)(ChatApp);
