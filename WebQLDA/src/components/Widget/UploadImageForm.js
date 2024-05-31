import React from "react";
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginFileEncode from 'filepond-plugin-file-encode';
import 'filepond/dist/filepond.min.css';
import icon_upload from 'assets/icons/upload_icon.png'
import PropTypes from 'utils/propTypes';
// Import the Image EXIF Orientation and Image Preview plugins
// Note: These need to be installed separately
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
// registerPlugin(FilePondPluginFileEncode);

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const UploadFileForm=({server,allowMultiple,maxFiles,onUpdateFiles,files,showIcon})=>{
    return(
        <div id = "uploadContainer" style = {{backgroundColor:"white", borderRadius:"5px", textAlign:"center"}}>
            <div style = {{width:"100%", minHeight:"212px", marginTop:"15px", marginBottom:"20px", borderRadius:"3px", borderColor:"#273c75", borderStyle:"dashed", borderWidth:"1.5px", display:"inline-block"}}>
                {showIcon&&<img src = {icon_upload} alt = "upload icon" style = {{width:"75px", height:"75px", marginTop:"10px", marginBottom:"10px", objectFit:"contain"}}></img>}
                <FilePond  
                            server = {{
                                url:server,
                                process:{
                                    onload:onUpdateFiles
                                }
                            }}
                            allowMultiple={allowMultiple}
                            maxFiles={maxFiles}
                            onupdatefiles={(fileItems) => {
                                console.log("--->uploaded file: ", fileItems)                                
                            }}
                            files={files}
                            style= {{maxHeight:"120px"}}
                />  
            </div>
        </div>
    )
}

UploadFileForm.propTypes = {
    server          : PropTypes.string,
    onUpdateFiles   : PropTypes.func,
    allowMultiple   : PropTypes.bool,
    maxFiles        : PropTypes.number
  };
  
UploadFileForm.defaultProps = {
    allowMultiple   :false,
    maxFiles        : 1,
};
export default UploadFileForm;