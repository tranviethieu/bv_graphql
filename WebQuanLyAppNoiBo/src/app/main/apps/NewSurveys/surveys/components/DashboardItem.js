import React, { useState, useEffect } from 'react';


function DashboardItem(props) {
    return (
        <div style={{ width: "240px", height: "120px", backgroundColor: "#192D3E", borderRadius: "5px", display: "block", cursor: "pointer", boxShadow: "0 4px 8px 0 rgba(255, 255, 255, 0.3), 0 6px 20px 0 rgba(0, 0, 0, 0.19" }}>
            <div style={{ position: "relative",marginTop: "10px" , marginLeft:"10px" }} className="flex flex-1">
                <div style={{ textAlign: "center", }}>
                    <span style={{ color: "#fff", fontSize: "17px" }}>{props.title && props.title}</span>
                </div>
                <img style={{ position: "absolute", width: "5px", height: "24px", float: "right", top: "0px", right: "8px", objectFit: "none" }} alt="icon-menu" src='assets/icons/survey/icon_more.png' />
            </div>
            <div style={{ textAlign: "center", margin: "auto", marginTop:"15px" }}>
                <span style={{ color: "#fff", fontSize: "30px", fontWeight:"bold" }}>{props.value && props.value}</span>
            </div>
        </div>
    )
}
export default DashboardItem;