import React, { useEffect, useState } from 'react';
import { Icon, Typography, Button, FormControl,Avatar } from '@material-ui/core';
import { FuseAnimateGroup, FusePageSimple, FuseAnimate } from '@fuse';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import ReactTable from 'react-table';
import _ from 'lodash';
import Widget1 from '../widgets/Widget1';
import moment from 'moment';
import * as Actions from './actions';

const useStyles = makeStyles(theme => ({
    content: {
        '& canvas': {
            maxHeight: '100%'
        }
    },

}));

function OpenChannelReportGeneral(props) {
    const dispatch = useDispatch();
    const classes = useStyles(props);
    const [statisticdata, setStatisticdata] = useState([]);
    const [data, setData] = useState({});
    const [tableFiltered, setTableFiltered] = useState({ page: 0, pageSize: 20, sorted: [{ id: "CreatedTime", desc: true }] });
    useEffect(() => {
        Actions.get_report_index(dispatch).then(response => {
            setStatisticdata(response.data);
        })
    }, []);

    function fetchTable() {
        Actions.get_integrated_users(tableFiltered, dispatch).then(response => {
            setData(response);
        })
    }

    useEffect(() => {
        fetchTable();
    }, [tableFiltered])

    return (
        <FusePageSimple
          id="el-ReportGeneralSMSs-Cover"
          classes={{
            toolbar: "min-h-80",
            rightSidebar: "w-288",
            content: classes.content,
          }}
          header={
            <div className="flex flex-1 items-center justify-between p-24 el-HeaderPage">
              <div className="flex flex-col">
                <div className="flex items-center mb-4">
                  <Icon className="text-18 el-TitleIcon" color="action">home</Icon>
                  <Icon className="text-16 el-TitleIcon" color="action">chevron_right</Icon>
                  <Typography color="textSecondary">Báo cáo</Typography>
                  <Icon className="text-16 el-TitleIcon" color="action">chevron_right</Icon>
                  <Typography color="textSecondary">Báo cáo người dùng Mạng Xã Hội</Typography>
                </div>
                        <FuseAnimate>
                            <Typography variant="h6">{data.records} Tài khoản</Typography>
                        </FuseAnimate>
                    </div>

                </div>
            }
            content={
                <div className="flex flex-wrap p-12 el-coverContent">
                    <div className='el-block-report w-full mx-8'>
                        <FuseAnimateGroup
                            className="el-flex-row"
                            enter={{
                                animation: "transition.slideUpBigIn"
                            }}
                        >
                            <div className="el-card-white">
                                <Widget1 widget={{ value: statisticdata.find(d => d._id == "facebook_chat") && statisticdata.find(d => d._id == "facebook_chat").total + '', title: "Người dùng Facebook" }} color="text-blue" />
                            </div>
                            <div className="el-card-white">
                                <Widget1 widget={{ value: statisticdata.find(d => d._id == "zalo_chat_oa") && statisticdata.find(d => d._id == "zalo_chat_oa").total + '', title: "Người dùng Zalo" }} color="text-blue" />
                            </div>
                        </FuseAnimateGroup>
                    </div>
                    <ReactTable
                        className="-striped -highlight h-full overflow-hidden w-full el-TableUserActionReport"
                        data={data.data}
                        onFetchData={(state) => setTableFiltered(state)}
                        pages={data.pages}
                        manual
                        columns={
                            [
                                {
                                    Header: "Avatar",
                                    accessor: "avatar",
                                    Cell: row => <div>
                                        <Avatar src={row.value}>{row.original.name&&row.original.name.substring(0,1).toUpperCase()}</Avatar>
                                    </div>,
                                    width:80
                                },
                                {
                                    Header: "Tên",
                                    accessor: "name"
                                },
                                {
                                    Header: "Id MXH",
                                    accessor: "uid"
                                },
                                {
                                    Header: "Giới tính",
                                    accessor: "gender",
                                    Cell: row => <Typography>
                                        {row.value=="female"?"Nữ":row.value=="male"?"Nam":"N/A"}
                                    </Typography>,
                                    width:90
                                },
                                {
                                    Header: "Kênh",
                                    accessor: "channel.name"
                                },
                                {
                                    Header: "Tin nhắn gần nhất",
                                    accessor: "recent_message.createdTime",
                                    Cell: row => <Typography>
                                        {moment(row.value).format("DD/MM/YYYY")}
                                    </Typography>
                                },
                                {
                                    Header: "Nội dung gần nhất",
                                    accessor: "recent_message.body.text"
                                },
                                {
                                    Header: "Ngày tạo",
                                    accessor: "createdTime",
                                    Cell: row => <Typography>
                                        {moment(row.value).format("DD/MM/YYYY")}
                                    </Typography>
                                }
                            ]
                        }
                    />

                </div>
            }
        />
    )
}
export default OpenChannelReportGeneral;
