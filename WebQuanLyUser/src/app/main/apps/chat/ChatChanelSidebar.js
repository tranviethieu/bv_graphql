import React, { useMemo } from 'react';
import { Button, Tooltip } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from './store/actions';
import Badge from '@material-ui/core/Badge';
import * as utils from '@utils'
import _ from "@lodash"

const icon = (type) => {
    // console.log("type=", type);
    switch (type) {
        case "SMS":
            return "assets/icons/integrate/icon-sms.png";
        case "FACEBOOK_FEED":
            return "assets/icons/integrate/icon-facebook.png";
        case "FACEBOOK_MESSENGER":
            return "assets/icons/integrate/icon-facebook-mes.png";
        case "MAIL_SERVER":
            return "assets/icons/integrate/icon-email.png";
        case "CALL_CENTER":
            return "assets/icons/integrate/icon-call-center.png";
        case "FACEBOOK_BOT":
        case "ZALO_BOT":
            return "assets/icons/integrate/icon-chatbot.png";
        case "ZALO_CHAT_OA":
            return "assets/icons/integrate/icon-zalo.png";
        case "VOUCHER":
            return "assets/icons/integrate/icon-voucher.png";
        case "FACEBOOK_CHAT":
            return "assets/icons/integrate/icon-facebook.png";
        case "DOCUMENTS":
            return "assets/icons/integrate/icon-vbnb.png";
        case "CHECKLIST":
            return "assets/icons/integrate/icon-bang-kiem.png";
        default: return "";
    }
}


// const StyledBadge1 = withStyles(theme => ({
//     badge: {
//         right: 0,
//         top: 15,
//         //   border: `2px solid ${theme.palette.background.paper}`,
//         padding: '0 4px',
//         backgroundColor: '#EF3535',
//         color: "white",
//         variant:"dot"
//     },
// }))(Badge);

// function checkPhoneFromMessage(){
//     let text = "Đây là số điện thoại 0392095725  của trọng, số vina: 840857038923  còn mấy số 099887773444 và 09876788877 là số linh tinh"
//     // let pattern = /[0|84|+84][9|3|7|8|5]([0-9]{8})/
//     let pattern = /((84|0)+(9|3|7|8|5)+([0-9]{8})\b)/g
//     // console.log(pattern.test(text)); //
//     var phones = text.match(pattern)
//     console.log("phones: ", phones)
// }

function ChatChanelSidebar(props) {

    const dispatch = useDispatch();

    const selectedIntegratedApp = useSelector(({ chatApp }) => chatApp.contacts.selectedIntegratedApp);
    const integratedApps = useSelector(({ chatApp }) => chatApp.contacts.integratedApps);
    // const convesations = useSelector(({ chatApp }) => chatApp.contacts.conversations);

    return (
        <div id = "el-ChatChanelSidebar">
          <div className='flex-row'>
            {useMemo(() => (
              integratedApps && integratedApps.map(app => {
                return (
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    {/* <div style={{ width: "5px", height: "30px", margin: "auto", marginLeft: "5px", backgroundColor: `${(selectedIntegratedApp && (app._id === selectedIntegratedApp._id)) ? "red" : "transparent"}`, borderRadius: "2px" }}></div> */}
                    <div>
                      {/* <StyledBadge1 badgeContent={400}> */}
                      {/* <Badge color="error" variant="dot" badgeContent={app.newIncomming && app.newIncomming ? 1 : 0}> */}
                      <Tooltip title={app.name ? app.name : ""} placement="right">
                        <Button onClick={e => {

                          let temp = { ...app, newIncomming: false }
                          let index = _.findIndex(integratedApps, {_id: app._id})
                          dispatch(Actions.setIntegratedApps(utils.replaceObjectAtIndex(integratedApps, temp, index)))

                          dispatch(Actions.setSelectedIntegratedApp(app))

                          //     //trước khi set lại filter conversation thì reset chat-message và conversation-page về 0
                          Actions.resetBeforGetNewConversations(dispatch)
                          //set filter for load conversations
                          const appType = app.type
                          var filter = { id: "type", value: appType }
                          dispatch(Actions.setConversationFiltered([filter]))
                        }}>
                          <Badge color="error" variant="dot" badgeContent={app.newIncomming && app.newIncomming ? 1 : 0}>
                            <img style={{ width: "40px", height: "40px", margin: "auto", objectFit: "fill" }} alt={app.name && app.name} src={app.type && icon(app.type) ? icon(app.type) : ""}></img>
                          </Badge>
                          <p className="textWhiteBold">{app.name && app.name}</p>
                        </Button>
                      </Tooltip>
                      {/* </Badge> */}
                      {/* </StyledBadge1> */}
                      <div style={{ width: "auto", height: "4px", margin: "auto", marginLeft: "5px", backgroundColor: `${(selectedIntegratedApp && (app._id === selectedIntegratedApp._id)) ? "#0097e6" : "transparent"}`, borderRadius: "2px" }}></div>
                    </div>
                  </div>
                )
              })
            ), [dispatch, integratedApps, selectedIntegratedApp])}
          </div>
          </div >
    );
}
export default ChatChanelSidebar;
