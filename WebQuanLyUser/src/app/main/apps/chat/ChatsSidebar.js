import { FuseScrollbars, FuseUtils } from '@fuse';
import { AppBar, Avatar, ListItemIcon, List, ListItemText, Menu, MenuItem, Typography, Toolbar, Icon, IconButton, Input, Paper, Button } from '@material-ui/core';
import React, { useMemo, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from "./store/actions";
import StatusIcon from "./StatusIcon";
import ContactListItem from './ContactListItem'
import _ from 'lodash';
import history from '@history';
import * as utils from "@utils"

const statusArr = [
  {
    title: 'Online',
    value: 'online'
  },
  {
    title: 'Away',
    value: 'away'
  },
  {
    title: 'Do not disturb',
    value: 'do-not-disturb'
  },
  {
    title: 'Offline',
    value: 'offline'
  }
];


function ChatsSidebar({ conversationId }) {
  const dispatch = useDispatch();
  // const contacts = useSelector(({ chatApp }) => chatApp.contacts.entities);
  // const user = useSelector(({ chatApp }) => chatApp.user);

  const [searchText, setSearchText] = useState('');
  const [statusMenuEl, setStatusMenuEl] = useState(null);
  const [moreMenuEl, setMoreMenuEl] = useState(null);


  //trongpv
  const user = useSelector(({ auth }) => auth.user);

  const selectedIntegratedApp = useSelector(({ chatApp }) => chatApp.contacts.selectedIntegratedApp);
  const selectedChannel = useSelector(({ chatApp }) => chatApp.contacts.selectedChannel)
  const integratedApps = useSelector(({ chatApp }) => chatApp.contacts.integratedApps);
  const conversations = useSelector(({ chatApp }) => chatApp.contacts.conversations);
  // const conversations = props.conversations
  // const [conversations, setConversations] = useState([])
  const conversationsPage = useSelector(({ chatApp }) => chatApp.contacts.conversations_page);
  const conversationsPageSize = useSelector(({ chatApp }) => chatApp.contacts.conversations_pageSize)
  var conversationsFiltered = useSelector(({ chatApp }) => chatApp.contacts.conversations_filtered)
  var conversationsSorted = useSelector(({ chatApp }) => chatApp.contacts.conversations_sorted)
  var [loadMore, setLoadMore] = useState(false)
  var canLoadMore = true
  const selectedConversation = useSelector(({ chatApp }) => chatApp.contacts.selectedConversation)

  //handle message from subcription
  const handleMessage = useSelector(({ chatting }) => chatting.chattingContact);
  useEffect(() => {
    // console.log("===> handle message from chat: ", handleMessage)
    if (handleMessage && handleMessage !== null) {
      ///new
      if (selectedConversation && (handleMessage.type === selectedConversation.recent_message.type && handleMessage.uid === selectedConversation.recent_message.uid)) {
        //tin nhắn đến thuộc cuộc hội thoại đang chat
        //Thay đổi nội dung recent_message
        var unread = selectedConversation.unread++
        unread++
        let temp = { ...selectedConversation, recent_message: handleMessage, unread: unread }
        let index = _.findIndex(conversations, { _id: selectedConversation._id })
        if (index !== -1) {
          const ret = utils.replaceObjectAtIndex(conversations, temp, index)
          // const movedItems = utils.moveObjectToFirst(ret, temp)//tạm thời không cần move lên đầu
          dispatch(Actions.setIntegratedConversations(ret))
        }
      } else {

        //set newIncomming = true nếu có trong mảng rồi làm gì thì làm
        let foundObject = _.find(integratedApps, function (e) {
          return (e.type === handleMessage.type);
        });
        if (foundObject) {
          const index = _.findIndex(integratedApps, { _id: foundObject._id })
          let temp = { ...foundObject, newIncomming: true }
          dispatch(Actions.setIntegratedApps(utils.replaceObjectAtIndex(integratedApps, temp, index)))
        }

        if (selectedIntegratedApp && (selectedIntegratedApp.type === handleMessage.type)) {
          //check xem có tồn tại trong list hiện tại ko.
          //Nếu có:
          // Thay đổi recent_message và unread, đưa lên đầu mảng.
          //Nếu không:
          //Request lấy getIntegratedUser, add vào đầu mảng
          //*****NOTE: TẠM THỜI CHƯA LỌC THEO CHANNEL ID */
          let foundObject = _.find(conversations, function (e) {
            return (e.uid === handleMessage.uid);
          });
          if (foundObject === null || foundObject === undefined) {
            //không tồn tại trong mảng:
            //gọi request integratedUser(uid, type) và add vào đầu mảng
            console.log("====> Khoong tim thay phan tu nay: ")
            Actions.getIntegratedUser(handleMessage.uid, handleMessage.type)
              .then((response) => {
                // console.log("---> get integratedUser: ", response.data)
                if (response && response.data) {
                  if (selectedChannel === null || selectedChannel.channel_id === response.data.recent_message.channel_id) {
                    //Nếu chọn tất cả hoặc
                    let mData = { ...response.data, }
                    let temp = [mData, ...conversations]
                    dispatch(Actions.setIntegratedConversations(temp))
                  }
                }
              })
          } else {
            //đã tồn tại trong mảng
            //foundObject.unread ++, move lên đầu
            let mData = { ...foundObject, recent_message: handleMessage, unread: foundObject.unread + 1 }
            // console.log("====> mData: ", mData)
            let index = _.findIndex(conversations, { _id: foundObject._id })
            let arr = utils.replaceObjectAtIndex(conversations, mData, index)
            let tmep = utils.moveObjectToFirst(arr, mData)
            dispatch(Actions.setIntegratedConversations(tmep))
          }
        } else {
          // type !== type của integra
          //Chưa cần xử lý gì
        }
      }
    }
    // }, [conversations, dispatch, handleMessage, integratedApps, selectedChannel, selectedConversation, selectedIntegratedApp]);
  }, [handleMessage]);

  function handleMoreMenuClose(event) {
    setMoreMenuEl(null);
  }
  function handleStatusSelect(event, status) {
    event.preventDefault();
    event.stopPropagation();
    dispatch(Actions.updateUserData({
      ...user,
      status
    }));
    setStatusMenuEl(null);
  }

  function handleStatusClose(event) {
    event.preventDefault();
    event.stopPropagation();
    setStatusMenuEl(null);
  }

  function handleSearchText(event) {
    setSearchText(event.target.value);
  }

  useEffect(() => {
    if (conversationsFiltered.length > 0) {
      loadData(conversationsPage, conversationsPageSize, conversationsFiltered, conversationsSorted)
    }
  }, [conversationsFiltered, conversationsPage, conversationsPageSize, conversationsSorted])

  function loadMoreData() {
    if (canLoadMore) {
      var page = conversationsPage + 1
      dispatch(Actions.setConversationsPage(page))
    }
  }

  async function loadData(page, pageSize, filter, sorted) {
    if (filter.length > 0) {//filter luôn phải có ít nhất 1 phần tử là type= FACEBOOK_CHAT || ZALO_OA... thì mới cho request

      canLoadMore = false
      // setLoadMore(false)
      await Actions.getIntegratedConversations(page, pageSize, filter, sorted, dispatch)
        .then(response => {
          if (response && response.data) {
            //gửi request lên sever rồi làm gì đó tiếp
            // console.log("get integrate user: ", response.data)

            var tempUser = [...conversations]
            response.data.map(element => {
              let index = _.findIndex(conversations, { _id: element._id })
              if (index === -1) {
                tempUser.push(element)
              }
            })
            dispatch(Actions.setIntegratedConversations(tempUser))
            // loadMore = false
            setLoadMore(false)
            if (response.data.lenght === pageSize) {
              canLoadMore = true
            }
          }
        })
    }
  }

  useEffect(() => {
    // console.log("conversation changed:", conversationId);
    if (conversationId) {
      const index = _.findIndex(conversations, { _id: conversationId })
      if (index !== -1) {
        const tempCon = conversations[index];
        // const ret = conversations.slice(0);
        // ret[index] = tempCon;
        // console.log("=====> updated conversations: ", ret)
        // dispatch(Actions.setIntegratedConversations(ret));
        dispatch(Actions.setSelectedConversation(tempCon));

        dispatch(Actions.setConversationMessages([]));
        dispatch(Actions.setChatPage(0));
      }
      //dispatch set selected conversation = đối tượng conversation đã cập nhật unread

    }
  }, [conversationId, conversations]);
  function handleConversationSelect(conversation) {
    history.push(`/apps/chat/${conversation._id}`)
    // console.log("=====> select conversation: ", conversation)

    // //Chọn 1 conversation:
    // //+ Set selectedConversationid = conversationid
    // //+ Set chat page = 0: để load tin nhắn của cuộc hội thoại mới bắt đầu từ page 0
    // //+ load messages của conversation hiện tại bắt đầu từ page 0,

    // //Khi chọn 1 conversation thì set luôn unread = 0 và dispatch để giao diện cập nhật
    // var tempCon = { ...conversation, unread: 0 }
    // // var res = _.unionBy([tempCon],conversations,  '_id');  //Hàm này cho phép replace item và đưa item lên đầu danh sách
    // const index = _.findIndex(conversations, { _id: conversation._id })
    // if (index !== -1) {
    //   const ret = conversations.slice(0);
    //   ret[index] = tempCon;
    //   console.log("=====> updated conversations: ", ret)
    //   dispatch(Actions.setIntegratedConversations(ret))
    // }
    // //dispatch set selected conversation = đối tượng conversation đã cập nhật unread
    // dispatch(Actions.setSelectedConversation(tempCon))

    // dispatch(Actions.setConversationMessages([]))
    // dispatch(Actions.setChatPage(0))
  }

  return (
    <div className="flex flex-col flex-auto h-full" id="el-ChatsSidebar">
      <AppBar
        position="static"
        color="default"
        elevation={1}
      >
        <Toolbar className="flex justify-between items-center px-16 pr-4">
          {user && (
            // <div className="relative w-40 h-40 p-0 cursor-pointer" onClick={() => dispatch(Actions.openUserSidebar())}>
            <div className="relative h-40 p-0 cursor-pointer">
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Avatar src={user && user.data && user.data.base && user.data.base.avatar} alt={user && user.data && user.data.base && user.data.base.fullName} className="w-40 h-40">
                  {user && user.data && user.data.base ? user.data.base.fullName : 'NoName'}
                </Avatar>
                <div style={{ marginTop: "10px", marginLeft: "5px", fontSize: "16px", fontWeight: 'bold' }}>{user && user.data && user.data.base ? user.data.base.fullName : ''}</div>
              </div>

              <div
                className="absolute right-0 bottom-0 -m-4 z-10 cursor-pointer"
                aria-owns={statusMenuEl ? 'switch-menu' : null}
                aria-haspopup="true"
              // onClick={handleStatusMenuClick}
              >
                <StatusIcon status={user.status} />
              </div>

              <Menu
                id="status-switch"
                anchorEl={statusMenuEl}
                open={Boolean(statusMenuEl)}
                onClose={handleStatusClose}
              >
                {statusArr.map((status) => (
                  <MenuItem onClick={(ev) => handleStatusSelect(ev, status.value)} key={status.value}>
                    <ListItemIcon className="min-w-40">
                      <StatusIcon status={status.value} />
                    </ListItemIcon>
                    <ListItemText primary={status.title} />
                  </MenuItem>
                ))}
              </Menu>
            </div>
          )}

        </Toolbar>
        {useMemo(() => (
          <Toolbar className="px-16">
            <Paper className="flex p-4 items-center w-full px-8 py-4 rounded-8" elevation={1}>

              <Icon className="mr-8" color="action">search</Icon>

              <Input
                placeholder="Tìm kiếm"
                className="flex flex-1"
                disableUnderline
                fullWidth
                value={searchText}
                inputProps={{
                  'aria-label': 'Search'
                }}
                onChange={handleSearchText}
              />
            </Paper>
          </Toolbar>
        ), [searchText])}
      </AppBar>

      <FuseScrollbars className="overflow-y-auto flex-1"
        onYReachEnd={() =>
        // handleLoadMore()
        {
          console.log("===> reach end...")
          // setLoadMore(true)
        }
        }
      >
        <List className="w-full">
          <React.Fragment>

            {conversations && conversations.length > 0 && (
              <Typography
                className="font-300 text-20 px-16 py-24"
                color="secondary"
              >
                Chats
              </Typography>
            )}

            {useMemo(() => {
              function getFilteredArray(arr, searchText) {
                if (searchText.length === 0) {
                  return arr;
                }
                return FuseUtils.filterArrayByString(arr, searchText);
              }
              const chatListArr = getFilteredArray([...conversations], searchText);
              return (
                <React.Fragment>
                  {
                    chatListArr && chatListArr.map(conversation => (
                      <ContactListItem key={conversation.id} contact={conversation} selectedContact={selectedConversation && selectedConversation} onContactClick={() => handleConversationSelect(conversation)} />
                    ))
                  }
                  <div style={{ marginTop: "20px", textAlign: "center" }}>
                    <Button
                      className="whitespace-no-wrap"
                      variant="contained"
                      onClick={() => loadMoreData()}
                      style={{ margin: "auto", width: "120px" }}
                    >
                      Tải thêm
                    </Button>
                  </div>
                </React.Fragment>
              )
            }, [conversations, searchText, selectedConversation, dispatch])}
            {/* </FuseAnimateGroup> */}
          </React.Fragment>
        </List>
      </FuseScrollbars>
    </div >
  )
}

export default ChatsSidebar;
