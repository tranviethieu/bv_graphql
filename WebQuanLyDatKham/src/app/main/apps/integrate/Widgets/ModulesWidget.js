import React, { useState } from 'react';

function ModulesWidget(props) {
    const [actived, setActived] = useState(props.actived)
    const [icon, setIcon] = useState(props.icon)
    const [title, setTitle] = useState(props.title)

    return (
        <div style={{ width: "100%", height: "100%", maxWidth: "240px", maxHeight: "120px", borderRadius: "3px", display: "block", cursor: "pointer", backgroundColor: "white", boxShadow: "0 4px 8px 0 rgba(255, 255, 255, 0.3), 0 6px 20px 0 rgba(0, 0, 0, 0.19" }} id = "el-ModulesWidget">
          <div id = "el-ModulesWidget1">
            <img style={{ width: "32px", height: "32px", marginTop: "-16px", marginLeft: "-16px" }} src={actived ? "assets/icons/integrate/icon-check.png" : ""} alt="" />
            <img style={{ width: "5px", height: "19px", float: "right", marginTop: "8px", marginRight: "8px", objectFit: "contain" }} alt="icon-menu" src='assets/icons/integrate/icon_menu.png' />
          </div>
          <img style={{ width: "50px", height: "50px", objectFit: "contain", marginTop: "5px", marginLeft: "95px" }} alt="icon" src={icon} />
          <div style={{ textAlign: "center", marginTop: "5px" }} id = "el-ModulesWidget2">
            <span style={{ color: "#595959", fontSize: "17px" }}>{title}</span>
          </div>
        </div>
    )
}
export default React.memo(ModulesWidget);
