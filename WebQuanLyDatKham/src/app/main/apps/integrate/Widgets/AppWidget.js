import React from 'react';

const icon = (type) => {
    console.log("type=", type);
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

function ModulesWidget(props) {
    const { app } = props;

    return (
        <div style={{ width: "100%", height: "100%", maxWidth: "240px", maxHeight: "120px", borderRadius: "3px", display: "block", cursor: "pointer", backgroundColor: "white", boxShadow: "0 4px 8px 0 rgba(255, 255, 255, 0.3), 0 6px 20px 0 rgba(0, 0, 0, 0.19" }} id = "el-integrate-AppWidget">
          <div style={{position:"absolute"}} className="w-full flex flex-1">
            {
              app.active && <img style={{ width: "32px", height: "32px", marginTop: "-16px", marginLeft: "-16px" }} src="assets/icons/integrate/icon-check.png" alt="" />
            }
            {/* <img style={{position:"absolute", width: "5px", height: "19px", float: "right", top: "8px", right: "8px", objectFit: "contain" }} alt="icon-menu" src='assets/icons/integrate/icon_menu.png' /> */}
          </div>
          <img style={{ width: "50px", height: "50px", objectFit: "contain", marginTop: "25px", marginLeft: "95px" }} alt="icon" src={icon(app.type)} />
          <div style={{ textAlign: "center", marginTop: "5px" }}>
            <span style={{ color: "#595959", fontSize: "17px" }}>{app.name}</span>
          </div>
        </div>
    )
}
export default React.memo(ModulesWidget);
