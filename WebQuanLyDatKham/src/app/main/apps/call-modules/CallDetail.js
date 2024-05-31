import React, { useState } from 'react';
import { FuseScrollbars } from '@fuse';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import { Card, IconButton,Icon } from '@material-ui/core';
import ReactPlayer from 'react-player';
import moment from 'moment';

function CallDetail(props) {
    const selectedCall = useSelector(({ myCallHistory }) => myCallHistory.calls.selectedCall);
    const [playingFile, setPlayingFile] = useState(false);
    return (
      <div className={clsx("flex flex-col relative", props.className)} id = "el-CallDetail-Cover">
        <FuseScrollbars
          className="flex flex-1 flex-col overflow-y-auto"
        >
          <Card className="m-24 shadow-none border-1" id = "el-CallDetail">
            <table className="simple clickable">
              {/* <thead>
                <tr>
                <th></th>
                <th className="text-right"></th>
                </tr>
              </thead> */}
              <tbody>
                <tr>
                  <td className="text-center">Cuộc gọi</td>
                  <td className="text-center">{selectedCall._id ? "Đã kết thúc" : "Đang diễn ra"}</td>
                </tr>
                <tr>
                  <td className="text-center">Gọi lúc</td>
                  <td className="text-center">{moment(selectedCall.calldate).format("HH:mm DD/MM/YYYY")}</td>
                </tr>
                <tr>
                  <td className="text-center">Tình trạng</td>
                  <td className="text-center">{selectedCall.disposition}</td>
                </tr>
                <tr>
                  <td className="text-center">Thời lượng</td>
                  <td className="text-center">{moment().startOf('day')
                    .seconds(selectedCall.duration || 0)
                    .format('mm:ss')}
                    <IconButton onClick={e => setPlayingFile(!playingFile)}><Icon className="text-green">play_circle_filled</Icon></IconButton>
                  </td>
                </tr>
                <tr>
                  <td className="text-center">Số điện thoại</td>
                  <td className="text-center">{selectedCall.phoneNumber}</td>
                </tr>
                <tr>
                  <td className="text-center">Số tổng đài viên</td>
                  <td className="text-center">{selectedCall.phoneCode}</td>
                </tr>
                <tr>
                  <td className="text-center">Loại cuộc gọi</td>
                  <td className="text-center">
                    {
                      selectedCall.direction === "OUT" ?
                        <div><Icon className="text-red pt-4">call_made</Icon>Gọi đi</div>:<div><Icon className="pt-4 text-blue">call_received</Icon>Gọi đến</div>
                    }
                  </td>
                </tr>
                <tr>
                  <td className="text-center">Ghi âm</td>
                  <td className="text-center">
                    <ReactPlayer url={process.env.REACT_APP_DOWNLOAD_RECORDS + selectedCall.recordingfile} playing={playingFile} loop={false} controls={true} height="40px" />
                  </td>
                </tr>
              </tbody>
            </table>
          </Card>
        </FuseScrollbars>
        </div >
  )
}
export default CallDetail;
