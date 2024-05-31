import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Avatar, Paper, Typography, TextField, IconButton, Icon, Fab, List, ListItem, ListItemIcon, ListItemText, Toolbar, DialogTitle, DialogContent } from '@material-ui/core';
import { FuseScrollbars } from '@fuse';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import moment from 'moment/moment';
import * as Actions from './store/actions';
import * as BaseActions from 'app/store/actions';
import { makeStyles } from '@material-ui/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Popover from '@material-ui/core/Popover';
import Divider from '@material-ui/core/Divider';
import Linkify from 'react-linkify';
import _ from '@lodash'

import CommentIcon from '@material-ui/icons/Comment';
import ChatCircleMenu from './CircleMenu/ChatCircleMenu'
import ChatAttachment from './ChatAttachment'
import UploadFileForm from './UploadFileForm'
import ChatDetectActions from './ChatDetectActions'

import * as utils from "@utils"
import 'moment/locale/vi'  // without this line it didn't work
moment.locale('vi')

////


const useStyles = makeStyles(theme => ({
  messageRow: {
    '&.contact': {
      '& .bubble': {
        // backgroundColor: theme.palette.primary.main,
        // color: theme.palette.primary.contrastText,
        backgroundColor: "#3C4252",
        color: "white",
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        '& .time': {
          marginLeft: 12
        }
      },
      '&.first-of-group': {
        '& .bubble': {
          borderTopLeftRadius: 20
        }
      },
      '&.last-of-group': {
        '& .bubble': {
          borderBottomLeftRadius: 20
        }
      }
    },
    '&.me': {
      paddingLeft: 40,

      '& .avatar': {
        order: 2,
        margin: '0 0 0 16px'
      },
      '& .bubble': {
        marginLeft: 'auto',
        // backgroundColor: theme.palette.grey[300],
        backgroundColor: "#3b5998",
        // color: theme.palette.getContrastText(theme.palette.grey[300]),
        color: "white",
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
        '& .time': {
          justifyContent: 'flex-end',
          right: 0,
          marginRight: 12
        }
      },
      '&.first-of-group': {
        '& .bubble': {
          borderTopRightRadius: 20
        }
      },

      '&.last-of-group': {
        '& .bubble': {
          borderBottomRightRadius: 20
        }
      }
    },
    '&.contact + .me, &.me + .contact': {
      paddingTop: 20,
      marginTop: 20
    },
    '&.first-of-group': {
      '& .bubble': {
        borderTopLeftRadius: 20,
        paddingTop: 13
      }
    },
    '&.last-of-group': {
      '& .bubble': {
        borderBottomLeftRadius: 20,
        paddingBottom: 13,
        '& .time': {
          display: 'flex'
        }
      }
    }
  }
}));

/*
TEXT
USER_PHONE

USER_LOCATION
*/
const questionsDefault = [
  {
    "title": "Xin chào, bạn đang cần tư vấn vấn đề gì?",
    "type": "TEXT"
  },
  {
    "title": "Vui lòng nhắn điện thoại của bạn để chúng tôi gửi tin nhắn thông báo khi cần.",
    "type": "USER_PHONE"
  },
  {
    "title": "Vui lòng cung cấp email của bạn.",
    "type": "USER_EMAIL"
  },
  {
    "title": "Bạn xác nhận muốn đặt lịch khám?",
    "type": "TEXT"
  },
  {
    "title": "Cảm ơn bạn, vui lòng liên hệ lại cho chúng tôi khi cần.",
    "type": "TEXT"
  },
]
export function debounce(func, wait = 20, immediate = true) {
  let timeout;
  return function () {
    const context = this;
    const args = arguments;
    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

function ChatTest(props) {
  const dispatch = useDispatch();
  const classes = useStyles(props);
  const chatRef = useRef(null);
  const [messageText, setMessageText] = useState('');
  const [scrollUp, setScrollUp] = useState(false);//mo phong chieu scroll cua nguoi dung de quyet dinh co load more khong
  const [topReach, setTopReach] = useState(false);//trạng thái reach top của panel
  //loged in user
  const [selectedConversation, setSelectedConversation] = useState(props.selectedConversation);
  const logedInUser = useSelector(({ auth }) => auth.user);

  //for question popover
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  //trongpv
  const conversations = useSelector(({ chatApp }) => chatApp.contacts.conversations);
  const chatPageSize = 15;

  const [data, setData] = useState({ messages: [], loading: false, page: 0, hasMore: false, loadMore: false })
  const [loadMore, setLoadMore] = useState(false)
  const lastRef = useRef(null)

  //handle message from subcription
  const handleMessage = useSelector(({ chatting }) => chatting.chattingContact);
  useEffect(() => {
    // console.log("===> handle message from chat: ", handleMessage)
    if (handleMessage && handleMessage !== null) {
      if (handleMessage.type === selectedConversation.recent_message.type) {
        if (handleMessage.uid === selectedConversation.uid) {
          var tempmess = [...data.messages, handleMessage]
          setData({ ...data, messages: tempmess })
        }
      }
    }
  }, [handleMessage]);

  useEffect(() => {
    if (data.messages && data.messages.length > 0) {
      scrollToBottom();
    }
  }, [data.messages]);

  useEffect(() => {
    // console.log("prop change: ", selectedConversation._id)
    setSelectedConversation(props.selectedConversation);
    handleChangeSelectedConversation()
  }, [props.selectedConversation._id])

  function handleChangeSelectedConversation() {
    setData({ messages: [], loading: false, page: 0, hasMore: false })
    loadChatMessages(0, chatPageSize, props.selectedConversation._id, [])
  }

  useEffect(() => {
    if (loadMore === true) {
      // console.log("===> effect load more: ", data)
      if (data.loading === false) {
        if (data.hasMore === true) {
          var mpage = data.page + 1
          // console.log("==> loadMore effect call load more")
          loadChatMessages(mpage, chatPageSize, selectedConversation._id, data.messages)
        }
      } else {
        setLoadMore(false)
      }
    }
  }, [loadMore])

  function loadChatMessages(page, pageSize, conversationId, currentMess) {
    const load = async () => {
      if (conversationId) {
        setData({ ...data, loading: true, loadMore: false })
        var loadMore = false
        Actions.getConversationMessages(page, pageSize, conversationId, dispatch)
          .then(response => {
            if (response && response.data) {
              // console.log("===>response count: ", response.data.length)
              var messages = response.data.concat(currentMess)
              if (response.data.length < pageSize) {
                loadMore = false
              } else {
                loadMore = true
              }
            }
            setData({ ...data, messages: messages, loading: false, page: page, hasMore: loadMore, })
            setLoadMore(false)
          })
      }
    }
    load()
  }
  //chi load more neu xuat phat tu hanh dong cua nguoi dung neu ko no se tu dong load more

  useEffect(() => {
    if (topReach && scrollUp) {
      setLoadMore(true);
    }
  }, [topReach, scrollUp]);

  function scrollToBottom() {
    // console.log("===> scroll page: ", data.page,chatRef.current)
    if (data.page === 0) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    } else {
      if (lastRef && lastRef.current) {
        chatRef.current.scrollTop = lastRef.current.offsetTop;
      } else {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }
    }
  }

  function shouldShowContactAvatar(item, i) {
    var chatMessages = data.messages
    return (
      item.direction === "IN" &&
      ((chatMessages[i + 1] && chatMessages[i + 1].direction !== "IN") || !chatMessages[i + 1])
    );
  }

  function isFirstMessageOfGroup(item, i) {
    var chatMessages = data.messages
    return (i === 0 || (chatMessages[i - 1] && chatMessages[i - 1].direction !== chatMessages[i].direction))
  }

  function isLastMessageOfGroup(item, i) {
    var chatMessages = data.messages
    return (i === chatMessages.length - 1 || (chatMessages[i + 1] && chatMessages[i + 1].direction !== chatMessages[i].direction))
  }

  function onInputChange(ev) {
    setMessageText(ev.target.value);
  }

  function onMessageSubmit(ev) {
    ev.preventDefault();
    createMessage(messageText, null)
  }
  function createMessage(mess, attachments, mesType = "TEXT") {
    if (mess === '') {
      return;
    }
    if (!selectedConversation) {
      return;
    }
    const channel_id = selectedConversation.recent_message.channel_id   //id của kênh/page
    const uid = selectedConversation.uid         //id của khách hàng
    const _id = ""
    const type = selectedConversation.type
    var att = []
    if (attachments) {
      attachments.map((e) => {
        const temp = { url: e.url, type: e.type }
        att.push(temp)
        console.log("====> chay vao day roi")
      })
    }
    const body = {
      text: mess,
      attachments: att,
      type: mesType
    }
    const direction = "OUT"
    const messageData = {
      channel_id,
      uid,
      _id,
      type,
      body,
      direction
    }

    let key = Date.now()//Biến key này để check và replace vào mảng sau khi gửi tin nhắn thành công
    //message for add manual
    let account = {
      fullName: logedInUser && logedInUser.data && logedInUser.data.fullName ? logedInUser.data.fullName : ""
    }
    const messTemp = { ...messageData, body: { text: mess, attachments: attachments }, account: account, createdTime: moment.now(), key: key }

    // Thêm thủ công trước khi gửi request lên sever để tạo hiệu ứng mượt khi chat
    var tempmess = [...data.messages, messTemp]
    // data.messages.push(messTemp);
    setMessageText('')
    setData({ ...data, messages: tempmess })
    chatRef.current.scrollTop = chatRef.current.scrollHeight;//gửi mess thì cuộn xuống cuối phần tin nhắn
    sendMessage(messageData, key, tempmess)//gọi hàm gửi tin nhắn, truyền thêm biến key = timestamp để xử lý tiếp khi nhận response

    // //Thay đổi nội dung bên contact sidebar và chuyển cuộc hội thoại đang chat lên đầu danh sách
    let tempConv = { ...selectedConversation, recent_message: messTemp, unread: 0 }

    let index = _.findIndex(conversations, { _id: selectedConversation._id })
    if (index !== -1) {
      let arr = utils.replaceObjectAtIndex(conversations, tempConv, index)
      let lastedArr = utils.moveObjectToFirst(arr, tempConv)
      dispatch(Actions.setIntegratedConversations(lastedArr))
      // console.log("lastedArr:", lastedArr);
    }
  }
  function sendMessage(mess, key, messages) {
    //
    Actions.sendOpenChannelMessage(mess, dispatch)
      .then((response) => {
        // console.log("=====> mes response: ", response)
        let responseMess = response.data
        if (responseMess) {
          // NEED UPDATE:  Chỗ này cần chỉnh sửa khi có thời gian:
          // 1. TRước khi gửi request tin nhắn add thủ công tin nhắn vào mảng để action cho mượt, set key = xxx
          // 2. Sau khi nhận được data trả về từ hàm này cần so sánh key để replace ngầm lại vào mảng cho chính xác, nếu lỗi thì xóa tin nhắn đó đi.
          // if (responseMess.type === selectedConversation.type && responseMess.uid === selectedConversation.uid) {
          //   //Check xem có đúng là cuộc hội thoại hiện tại ko, vì sẽ xảy ra trường hợp request này bị delay trong khi đã chuyển sang load cuộc hội thoại khác
          //   var index = _.findIndex(messages, { key: key })
          //   if (index !== -1) {
          //     // let arr = utils.replaceObjectAtIndex(messages, responseMess, index)
          //     // dispatch(Actions.setConversationMessages(arr))

          //     messages = utils.replaceObjectAtIndex(messages, responseMess, index);
          //     setData({ ...data, messages });
          //     console.log("====> Gửi thành công và add lại rồi nhé!")

          //   } else {
          //     console.log("====> done Không tìm thấy phần tử này trong mảng")
          //   }
          // }
        } else {
          //nếu response.data === null: Gửi tin nhắn không thành công thì phải remove tin nhắn đã add thủ công đi
          if (responseMess.type === selectedConversation.type && responseMess.uid === selectedConversation.uid) {
            //Check xem có đúng là cuộc hội thoại hiện tại ko, vì sẽ xảy ra trường hợp request này bị delay trong khi đã chuyển sang load cuộc hội thoại khác
            var tempIndex = _.findIndex(messages, { key: key })
            if (tempIndex !== -1) {
              // let arr = messages.splice(tempIndex, 1)
              // dispatch(Actions.setConversationMessages(arr))
              messages = messages.splice(tempIndex, 1)
              console.log("====> Gửi không thành công và remove rồi nhé")
            } else {
              console.log("====> not done Không tìm thấy phần tử này trong mảng")
            }
          }
        }
      })
  }


  return (
    <div className={clsx("flex flex-col relative", props.className)} style={{ minWidth: '130px' }} id="el-ChatTest">
      <FuseScrollbars
        ref={chatRef}
        className="flex flex-1 flex-col overflow-y-auto"
        onYReachStart={() => setTopReach(true)}
        // onYReachEnd={() => console.log("reach bottom")}
        onScrollUp={() => setScrollUp(true)}
        onScrollDown={() => { setScrollUp(false); setTopReach(false); }}
        scrollToTopOnChildChange={true}
      >
        {useMemo(() => (
          selectedConversation && data.messages && data.messages.length > 0 ?
            (
              <div className="flex flex-col pt-16 pl-56 pr-16 pb-40">
                {data.messages.map((item, i) => {
                  return (
                    <div
                      key={item.createdTime}
                      className={clsx(
                        classes.messageRow,
                        "flex flex-col flex-grow-0 flex-shrink-0 items-start justify-end relative pr-16 pb-4 pl-16",
                        { 'me': item.direction === "OUT" },
                        { 'contact': item.direction === "IN" },
                        { 'first-of-group': isFirstMessageOfGroup(item, i) },
                        { 'last-of-group': isLastMessageOfGroup(item, i) },
                        (i + 1) === data.messages.length && "pb-96"
                      )}
                      ref={(i === 2) ? lastRef : null}
                    >
                      {shouldShowContactAvatar(item, i) && (
                        <Avatar className="avatar absolute left-0 m-0 -ml-32" src={selectedConversation.avatar ? selectedConversation.avatar : "assets/icons/integrate/icon-user-default.png"} />
                      )}
                      {
                        item.body && item.body.text && item.body.text !== null &&
                        <React.Fragment>
                          <div className="bubble flex relative items-center justify-center p-12 max-w-full">
                            {
                              item.direction === "OUT" ?
                                <Tooltip title={item.account && item.account.fullName ? `Gửi bởi ${item.account.fullName} lúc ${moment(item.createdTime).lang("vi").fromNow()}` : moment(item.createdTime).fromNow()} placement="bottom">
                                  <div className="leading-tight whitespace-pre-wrap"><Linkify>{item.body.text}</Linkify></div>
                                </Tooltip>
                                :
                                <Tooltip title={moment(item.createdTime).fromNow()} placement="bottom">
                                  <div className="leading-tight whitespace-pre-wrap"><Linkify>{item.body.text}</Linkify></div>
                                </Tooltip>
                            }
                          </div>
                          {item.direction === "IN" && <ChatDetectActions text={item.body.text} userId={selectedConversation._id}></ChatDetectActions>}
                        </React.Fragment>
                      }
                      {/* CHỖ NÀY LÀ ĐỂ HIỂN THỊ ATTACHMENT */}
                      {
                        item.body.attachments &&
                        <ChatAttachment attachments={item.body.attachments}></ChatAttachment>
                      }
                      {isLastMessageOfGroup(item, i) &&
                        <div className="bubble flex relative items-center justify-center p-12 max-w-full" style={{ backgroundColor: "transparent" }}>
                          <Typography className="time absolute hidden w-full text-11 left-0 bottom-0 whitespace-no-wrap"
                            color="textSecondary">{
                              moment(item.createdTime).fromNow()
                            }</Typography>
                        </div>
                      }
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="flex flex-col flex-1">
                <div className="flex flex-col flex-1 items-center justify-center">
                  <Icon className="text-128" color="disabled">chat</Icon>
                </div>
                <Typography className="px-16 pb-24 text-center" color="textSecondary">
                  Start a conversation by typing your message below.
                </Typography>
              </div>
            )
        ), [data.messages])}
      </FuseScrollbars>
      {selectedConversation && (
        <div className="absolute bottom-0 right-0 left-0 py-16 px-8">
          <Toolbar style={{ display: "flex", justifyContent: "space-between", }} autoFocus={false}>
            <Fab color="primary" aria-label="add" className={classes.fab} onClick={handleClick}>
              <CommentIcon />
            </Fab>
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
            >
              <List component="nav" aria-label="main mailbox folders"
                style={{
                  backgroundColor: "rgb(255,255,255,0.4)"
                }}>
                {questionsDefault.map(e => (
                  <React.Fragment>
                    <ListItem button onClick={ev => {
                      createMessage(e.title, null, e.type)
                      handleClose()
                    }}>
                      <ListItemIcon>
                        <CommentIcon />
                      </ListItemIcon>
                      <ListItemText primary={e.title} />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </Popover>
            {/* for Chat media menu */}
            <ChatCircleMenu onSelected={(type) => {
              //IMAGE, VIDEO, AUDIO, FILE,
              // 'image/*' 'video/*' 'audio/*' 'image/*'
              var mediaType = []
              var title = ""
              switch (type) {
                case "IMAGE":
                  // setFileUploadType('image/*')
                  mediaType = ['image/*']
                  title = "Tải lên ảnh để gửi tin nhắn"
                  break
                case "VIDEO":
                  // setFileUploadType('video/*')
                  mediaType = ['video/*']
                  title = "Tải lên video để gửi tin nhắn"
                  break
                case "AUDIO":
                  // setFileUploadType('audio/*')
                  mediaType = ['audio/*']
                  title = "Tải lên file âm thanh để gửi tin nhắn"
                  break
                case "FILE":
                  // setFileUploadType('file/*')
                  mediaType = ['text/*',
                    'application/pdf',
                    'application/x-zip-compressed',
                    'application/msword',
                    'application/vnd.ms-excel',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                    'application/vnd.ms-powerpoint',
                  ]
                  title = "Tải lên file để gửi tin nhắn"
                  break
                default:
                  return
              }

              dispatch(BaseActions.openDialog({
                children: (
                  <React.Fragment>
                    <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
                    <DialogContent style={{ width: "auto !important" }}>
                      <UploadFileForm fileTypes={mediaType} server={process.env.REACT_APP_UPLOADURL} allowMultiple={true} maxFiles={1000} style={{ minHeight: "320px", marginBottom: "20px", }}
                        onSuccess={(files) => {
                          console.log("===> file for send message: ", files)
                          var atts = []
                          files.map((file) => {
                            var fileInfo = {
                              createdTime: file.file.lastModifiedDate,
                              name: file.file.name,
                              options: {
                                duration: 0,
                                type: 0,
                                view: 0
                              },
                              oriExtension: file.fileExtension
                            }
                            atts.push({
                              url: process.env.REACT_APP_FILE_PREVIEW_URL + file.serverId,
                              type: type,
                              fileInfo: fileInfo
                            })
                          })
                          createMessage(null, atts)
                        }}
                      >
                      </UploadFileForm>
                    </DialogContent>
                  </React.Fragment>
                )
              }))
            }}></ChatCircleMenu>

          </Toolbar>
          <Paper className="flex items-center relative rounded-24" elevation={1}>
            <TextField
              autoFocus={false}
              id="message-input"
              className="flex-1"
              InputProps={{
                disableUnderline: true,
                classes: {
                  root: "flex flex-grow flex-shrink-0 ml-16 mr-48 my-8",
                  input: ""
                },
                placeholder: "Nhập tin nhắn..."
              }}
              InputLabelProps={{
                shrink: false,
                className: classes.bootstrapFormLabel
              }}
              onChange={onInputChange}
              value={messageText}
              onKeyDown={e => {
                if (e.keyCode === 13) {
                  onMessageSubmit(e)
                }
              }}
            />
            <IconButton className="absolute right-0 top-0 ml-2" type="submit" onClick={e => onMessageSubmit(e)}>
              <Icon className="text-24" color="action">send</Icon>
            </IconButton>
          </Paper>
        </div>
        // </form>
      )}
    </div>
  );
}

export default ChatTest;
