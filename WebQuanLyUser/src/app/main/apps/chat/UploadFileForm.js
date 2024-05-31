import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import * as Actions from 'app/store/actions';
import { useDispatch } from 'react-redux';

import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginFileEncode from 'filepond-plugin-file-encode';
import 'filepond/dist/filepond.min.css';
// import icon_upload from 'assets/icons/integrate/upload_icon.png'

// Import the Image EXIF Orientation and Image Preview plugins
// Note: These need to be installed separately
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileTypes from 'filepond-plugin-file-validate-type';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

// Register the plugins
registerPlugin(FilePondPluginFileEncode, FilePondPluginImageExifOrientation, FilePondPluginImagePreview, FilePondPluginFileTypes);

function UploadFileForm(props) {
    const dispatch = useDispatch();
    const [files, setFiles] = useState([])

    function checkFilesForSubbmit(){
        if(files.length===0){
            console.log("==> file rong")
            dispatch(Actions.showMessage({message: "Vui lòng tải lên file để gửi tin nhắn"}))
            return
        }else{
            var check = files.filter((item,index) => {return item.serverId==null})
            if (check.length>0){
                dispatch(Actions.showMessage({message: "Vui lòng chờ quá trình tải lên hoàn tất và tiếp tục"}))
                return
            }else{
                console.log("===>upload thanh cong: ",files.map(file=>file.serverId))
                props.onSuccess(files)
                dispatch(Actions.closeDialog())
            }
        }
    }

    return (
        <div id="uploadContainer" style={{ minHeight: "320px", backgroundColor: "white", borderRadius: "5px", textAlign: "center", ...props.style }} className = "el-UploadFileForm">
            <h1 style={{ color: "#08AC50", paddingTop: "20px" }}>Upload file</h1>
            <div style={{ minWidth: "540px", minHeight: "212px", marginTop: "15px", marginBottom: "20px", borderRadius: "3px", borderColor: "#08AC50", borderStyle: "dashed", borderWidth: "1.5px", display: "inline-block", fontSize: "16px" }}>
                <img src={'assets/icons/integrate/upload_icon.png'} alt="upload icon" style={{ width: "75px", height: "75px", marginTop: "10px", marginBottom: "10px", objectFit: "contain" }}></img>
                <FilePond
                    server={props.server}
                    allowMultiple={props.allowMultiple}
                    maxFiles={props.maxFiles}
                    acceptedFileTypes={props.fileTypes}
                    fileValidateTypeDetectType={(source, type) => new Promise((resolve, reject) => {
                        console.log(source, type);
                        // do custom type detection here and return with promise
                        resolve(type);
                    })}
                    onupdatefiles={(fileItems) => {
                        console.log("--->uploaded file: ", fileItems.map(file => file.file))
                        // props.onUpdateFiles(fileItems)
                        setFiles(fileItems)
                    }}
                    style={{ fontSize: "16px" }}
                />
            </div>
            <div style = {{textAlign:"right"}}>
                <Button component="span" onClick={e => dispatch(Actions.closeDialog())}>
                    CANCEL
                </Button>
                <Button component="span" style={{marginLeft:"10px"}} onClick = {e => checkFilesForSubbmit()}>
                    SEND MESSAGE
                </Button>
            </div>
        </div>
    )

}
export default UploadFileForm;
