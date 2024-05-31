import React from 'react';
import { makeStyles } from '@material-ui/styles';
import ImageBox from './ImageGallery'
import ReactPlayer from 'react-player';
import Linkify from 'react-linkify';
import FileIcon, { defaultStyles } from 'react-file-icon';
// import FileMessage from '../FileMessage/FileMessage';
const useStyles = makeStyles(theme => ({
    breakWord: {
        '& a': {
            wordBreak: 'break-all',
            wordWrap: 'break-word',
        },

    },

}
))

function ChatAttachment({ attachments }) {
    const classes = useStyles();

    const imageAttachments = attachments.filter((item, index) => item.type === "IMAGE");
    const videoAttachments = attachments.filter((item, index) => item.type === "VIDEO");
    const audioAttachments = attachments.filter((item, index) => item.type === "AUDIO");
    const fileAttachments = attachments.filter((item, index) => item.type === "FILE");
    const fallBackAttachments = attachments.filter((item, index) => item.type === "FALLBACK");
    // console.log(`---> image: ${imageAttachments}`, )
    return (
        <React.Fragment className = "el-ChatAttachment">
          {
            imageAttachments &&
            <div className="bubble flex relative items-center justify-center p-12" style={{ backgroundColor: "transparent",}} >
              <ImageBox images={imageAttachments.map(e => e.url)}></ImageBox>
            </div>
          }
          {
            videoAttachments &&
            videoAttachments.map(el =>
              <div className="bubble flex relative items-center justify-center p-12 max-w-full" style={{ backgroundColor: "transparent" }} >
                <ReactPlayer url={el.url && el.url} playing={false} loop={false} controls={true} minHeight="60px" />
              </div>
            )
          }
          {
            audioAttachments &&
            audioAttachments.map(el =>
              <div className="bubble flex relative items-center justify-center p-12 max-w-full" style={{ backgroundColor: "transparent" }} >
                <ReactPlayer url={el.url && el.url} playing={false} loop={false} controls={true} minHeight="60px" />
              </div>
            )
          }
          {
            fileAttachments &&
            fileAttachments.map(el =>
              <div className="bubble flex relative items-center justify-center p-12 max-w-full" >
                <div className={classes.breakWord + " leading-tight whitespace-pre-wrap max-w-full"}>{
                  (el.fileInfo && el.fileInfo.name) ?
                    <React.Fragment >
                      <FileIcon size = {32} extension={el.fileInfo && el.fileInfo.oriExtension ? el.fileInfo.oriExtension : ""}
                        {...defaultStyles[el.fileInfo && el.fileInfo.oriExtension ? el.fileInfo.oriExtension : ""]}
                      />
                      <a href={el.url} target="_blank" style={{textDecoration:"underline", color:"white", cursor:"pointe"}}>{el.fileInfo.name}</a>
                    </React.Fragment>
                  : (el.url ? <Linkify>{el.url}</Linkify> : null)}
                </div>
              </div>
            )
          }
          {
            fallBackAttachments &&
            fallBackAttachments.map(el => {
              return (
                <div className="bubble flex relative items-center justify-center p-12 max-w-full" >
                  <div className={classes.breakWord + " leading-tight whitespace-pre-wrap max-w-full"}>{el.url && <Linkify>{el.url && el.url}</Linkify>}</div>
                </div>
              )
            })
          }
        </React.Fragment>
    )

}
export default ChatAttachment;
