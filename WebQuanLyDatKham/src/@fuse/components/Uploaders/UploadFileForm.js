import React from "react";
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginFileEncode from 'filepond-plugin-file-encode';
import {CloudUpload } from '@material-ui/icons'

registerPlugin(FilePondPluginFileEncode);


const UploadFileForm = ({ server, allowMultiple, maxFiles, onUpdateFiles, showIcon }) => {
    return (
        <div id="uploadContainer" style={{ backgroundColor: "white", borderRadius: "5px", textAlign: "center" }}>
            <div style={{ width: "100%", borderRadius: "3px", borderColor: "#08AC50", borderStyle: "dashed", borderWidth: "1.5px", display: "inline-block" }}>
                {showIcon && <CloudUpload/>}
                <FilePond
                    server={{
                        url: server,
                        process: {
                            onload: onUpdateFiles
                        }
                    }}
                    allowMultiple={allowMultiple}
                    maxFiles={maxFiles}
                    onupdatefiles={(fileItems) => {
                        console.log("--->uploaded file: ", fileItems)
                    }}
                    // files={files}
                    style={{ maxHeight: "120px" }}
                />
            </div>
        </div>
    )
}


export default UploadFileForm;