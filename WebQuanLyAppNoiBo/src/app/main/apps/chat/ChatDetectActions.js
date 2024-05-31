import React, {  } from 'react';
import Divider from '@material-ui/core/Divider';
import { Button } from '@material-ui/core';
import * as Actions from "./store/actions/index";
import { showMessage } from 'app/store/actions/fuse';
import { useDispatch, useSelector } from 'react-redux';
import { showUserDialog } from 'app/main/apps/shared-dialogs/actions'


function getFirstPhone(text) {
    // let telInteger = text
    // console.log("====> text: ", telInteger,)
    // var regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
    // var phoneList = telInteger.match(regex);
    // if (phoneList && phoneList.length > 0) {
    //     return phoneList[0];
    // }
    // console.log("  phone detected: ", phoneList)

    var telInteger = text.replace(/[^0-9|^ ]/g,'').replace(/^84/gi,'0').replace(/[s| ]84/gi,' 0');
    // console.log("telInteger=", telInteger);
    var regex = /([0|84](3[2-9]|5[689]|7[06-9]|8[1-689]|9[0-46-9])\d{7})/g;
    var phoneList = telInteger.match(regex);
    if (phoneList && phoneList.length > 0) {
        // console.log("phone= ", phoneList[0]);
        return phoneList[0];
    }
    // return phoneList;

}
function ChatDetectActions(props) {
    const selectedIntegratedApp = useSelector(({ chatApp }) => chatApp.contacts.selectedIntegratedApp);
    const dispatch = useDispatch();
    let text = props.text
    let phone = null
    if (text && text !== null && text !== undefined) {
        phone = getFirstPhone(text)
    }
    return (
        phone ?
            <div className="bubble flex relative items-center justify-center p-12 max-w-full mt-10" style={{ borderRadius: "10px", backgroundColor: "#3b5998", textAlign: "center" }} id = "el-ChatDetectActions">
							<div className="leading-tight whitespace-pre-wrap">
								<div style={{ color: "#ffffff", fontSize: "18px", marginTop: "10px" }}>{phone}</div>
								<Divider style={{ marginTop: "20px" }} />
								<Button variant="outline" style={{ marginTop: "5px", color: "white" }} onClick={e => {
									if (props.userId && props.userId !== undefined) {
										Actions.updateIntegratedUserPhoneNumber(props.userId, phone)
										.then(response => {
											if (response && response.data) {
												dispatch(showMessage({ message: "Cập nhật số điện thoại thành công" }));
												dispatch(Actions.setSelectedConversation(response.data))
												dispatch(showUserDialog({ rootClass: "el-coverFUD", phoneNumber: response.data.user.phoneNumber, channelType: selectedIntegratedApp.type === "ZALO_CHAT_OA" ? "ZALOMESSENGER" : selectedIntegratedApp.type === "FACEBOOK_CHAT" ? "FBMESSENGER" : null }))
											}
										})
									}
								}}>Cập nhật số điện thoại</Button>
							</div>
            </div>
            : null
    )
}
export default ChatDetectActions;
