import React, { useCallback, useState, useEffect } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, AppBar, Typography, Divider, FormLabel, Tooltip } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import ImplementQuestionPreview from '../components/ImplementQuestionPreview';
import { useForm } from '@fuse/hooks';
import QRCode from 'qrcode.react';
import copy from "copy-to-clipboard";
import { showMessage } from 'app/store/actions'

const downloadQR = (surveyId) => {
    const canvas = document.getElementById("HpQrcode");
    const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `qrcode_${surveyId}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
};
function SurveyQRCode(props) {
    const currentHost = window.location.origin + "/apps/do-survey/";
    const dispatch = useDispatch();
    const { open, onCloseDialog } = props
    return (
        <Dialog open={open} onClose={onCloseDialog} aria-labelledby="form-dialog-title" >
            <div >

                <AppBar position="static" elevation={1}>
                    <div className="m-8">
                        <div className="flex items-center w-full" style={{ minHeight: "60px", textAlign: "center" }}>
                            <Typography className="text-16 sm:text-20 p-12 truncate" style={{ margin: "auto" }}>
                                {"MÃ QRCODE"}
                            </Typography>
                        </div>
                    </div>
                </AppBar>
                <DialogContent style={{ width: "500px", height: "600px" }}>
                    <DialogContentText>
                        <div className="p-1" style={{ fontWeight: "bold", color: "#818080", textAlign: "left", }}>
                            <div style={{ marginTop: "15px", fontSize: "18px", }}>Chiến dịch khảo sát: </div>
                            <div style={{ marginTop: "10px", fontSize: "14px", }}>{props.title}</div>
                        </div>
                        <div style={{ display: "block", textAlign: "center", marginTop: "30px" }} className="HpQrcode" >
                            <QRCode
                                id="HpQrcode"
                                value={currentHost + props.surveyId}
                                size={300}
                                level={'H'}
                            />
                        </div>
                            <div style={{ marginTop: "20px", textAlign: "left", }}>
                            <span>{`URL: `}</span>
                            <Tooltip title="Copy">
                                <span style={{ textDecoration: "underline", textDecorationColor: "#C6C6C6", cursor: "pointer", wordBreak: "break-all" }} onClick={e => {
                                    copy(`${currentHost + props.surveyId}`)
                                    dispatch(showMessage({ message: "Đã copy URL vào clipboard" }))
                                }}
                                >{currentHost + props.surveyId}</span>
                            </Tooltip>
                            </div>
                        <div style={{ marginTop: "20px", textAlign: "center", }} >
                            <Button onClick={e => downloadQR(props.surveyId)} variant="contained" color="primary" style={{ width: "180px", height: "45px", backgroundColor: "#09A68D" }}>Tải ảnh</Button>
                        </div>
                    </DialogContentText>
                </DialogContent>
                <DialogActions className='mb-5 mr-5'>
                    <Button onClick={onCloseDialog} variant="contained" color="primary" style={{ backgroundColor: "#D53636" }}>
                        Đóng
                    </Button>
                </DialogActions>
            </div>
        </Dialog>
    );
}
export default SurveyQRCode;