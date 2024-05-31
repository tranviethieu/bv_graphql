import React, { useState, useEffect } from 'react';
import { FusePageCarded } from '@fuse';
import { makeStyles } from '@material-ui/styles';
import { Paper, Button, Input, Icon, Typography, IconButton, Tooltip, FormControlLabel, TextField } from '@material-ui/core';
import { FuseAnimate, FuseChipSelect, FusePageSimple, AdvanceEditor } from '@fuse';
import { ThemeProvider } from '@material-ui/styles';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ReactTable from 'react-table';
import * as Actions from './store/actions';
import moment from 'moment';
import history from '@history';
import TableCircularLoading from 'app/fuse-layouts/shared-components/loading/TableCircularLoading';
import IOSSwitch from 'app/fuse-layouts/shared-components/components/IOSSwitch'
import { showMessage } from 'app/store/actions'
import * as BaseControl from 'app/main/utils/VTBaseControl'
import * as BaseConfig from './BaseConfig/BaseConfig'

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        alignItems: 'center',
        height: "100%",
        borderRadius: 2,
        padding: '0 6px',
        fontSize: 11,
        backgroundColor: 'rgba(0,0,0,.08);'
    },
    color: {
        width: 8,
        height: 8,
        marginRight: 4,
        borderRadius: '50%'
    }
}));

function Notifies(props) {
    const dispatch = useDispatch();

    const [sendAll, setSendAll] = useState(true)
    const [accounts, setAccounts] = useState([])
    const [selectedAccounts, setSelectedAccounts] = useState([])
    const [types, setTypes] = useState([
        { label: "Mở ứng dụng", value: "OPEN_APP" },
        { label: "Mở nội dung thông báo", value: "OPEN_DETAIL_NOTIFY" },
        { label: "Mở link web", value: "OPEN_LINK" },
    ])
    const [selectedType, setSelectedType] = useState({ label: "Mở ứng dụng", value: "OPEN_APP" })

    const [title, setTitle] = useState('')
    const [shortContent, setShortContent] = useState('')
    const [content, setContent] = useState('')
    const [link, setLink] = useState('')


    useEffect(() => {
        fetchAccounts()
    }, [])

    function fetchAccounts() {
        Actions.getAccounts(dispatch)
            .then(response => {
                if (response.data) {
                    var arrs = []
                    response.data.map(e => {
                        let item = { value: e, label: `${e.base.fullName}${` - ${e.base.code}`}` }
                        arrs.push(item)
                    })
                    setAccounts(arrs)
                }
            })
    }

    function sendNotify() {
        let data = {
            "title": title,
            "data": {
                "type": selectedType.value,
                "linked": link,
                "click_action": "FLUTTER_NOTIFICATION_CLICK"
            },
            "subtitle": shortContent,
            "body": content,
            "appId": process.env.REACT_APP_NOTIFY_APP_ID
        }

        console.log("==> push data: ", data)
        if (sendAll) {
            Actions.notifiSendAll(data, dispatch)
                .then(response => {
                    if (response.data) {
                        // console.log("==> notif send response: ", response.data)
                        dispatch(showMessage({ message: "Gửi thông báo thành công" }))
                    }
                })
        } else {

            var userids = []
            for (var i = 0; i < selectedAccounts.length; i++) {
                let user = selectedAccounts[i].value
                if (user) {
                    userids.push(user._id)
                }
            }
            Actions.notifiSendByIds(userids, data, dispatch)
                .then(response => {
                    if (response.data) {
                        // console.log("==> notif send response: ", response.data)
                        dispatch(showMessage({ message: "Gửi thông báo thành công" }))
                    }
                })
        }

    }

    return (
        <div className="h-full block">
            <FusePageCarded
                classes={{
                    content: "flex",
                    header: "min-h-72 h-72 sm:h-136 sm:min-h-136"
                }}
                header={
                    <div className="flex flex-1 w-full items-center justify-between">

                        <div className="flex items-center">
                            <FuseAnimate animation="transition.expandIn" delay={300}>
                                <Icon className="text-32 mr-0 sm:mr-12">notifications</Icon>
                            </FuseAnimate>
                            <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                                <Typography className="hidden sm:flex" variant="h6">Gửi thông báo</Typography>
                            </FuseAnimate>
                        </div>
                        <FuseAnimate animation="transition.slideRightIn" delay={300}>
                            <Button className="whitespace-no-wrap" variant="contained" onClick={e => sendNotify()}>
                                <Icon className="text-32 mr-0 sm:mr-12">send</Icon>
                                <span className="hidden sm:flex">GỬI</span>
                            </Button>
                        </FuseAnimate>
                    </div>
                }
                content={
                    <div className="p-12 block w-full">
                        {/* <div className="p-12 w-full">
                            <Tooltip title={"Gửi thông báo tới toàn bộ thiết bị"} placement="left">
                                <FormControlLabel
                                    control={
                                        <IOSSwitch
                                            checked={sendAll}
                                            onChange={e => {
                                                setSendAll(e.target.checked)
                                            }}
                                            labelPlacement="end"
                                            value="disable"
                                        />
                                    }
                                    label="Gửi thông báo tới toàn bộ thiết bị"
                                />
                            </Tooltip>
                        </div>
                        {
                            sendAll === false &&
                            <div className="block p-12 w-full pt-0">
                                <Typography className="text-14 mb-8" component="h4">
                                    Chọn tài khoản gửi thông báo
                                </Typography>

                                <FuseChipSelect
                                    className="w-full my-16"
                                    value={selectedAccounts}
                                    onChange={e => setSelectedAccounts(e)}
                                    placeholder="Chọn tài khoản"
                                    textFieldProps={{
                                        label: 'Chọn tài khoản',
                                        InputLabelProps: {
                                            shrink: true
                                        },
                                        variant: 'outlined'
                                    }}
                                    options={accounts}
                                    isMulti
                                />
                            </div>
                        } */}
                        <div className="block p-12 w-full pt-0">
                            {/* <Typography className="text-14 mb-8" component="h4">
                                Lựa chọn hành động khi mở thông báo
                            </Typography> */}

                            <FuseChipSelect
                                className="w-full my-16"
                                value={selectedType}
                                onChange={e => setSelectedType(e)}
                                placeholder="Lựa chọn hành động khi mở thông báo"
                                textFieldProps={{
                                    label: ' Lựa chọn hành động khi mở thông báo',
                                    InputLabelProps: {
                                        shrink: true
                                    },
                                    variant: 'outlined'
                                }}
                                options={types}
                                isMulti={false}
                            />
                        </div>
                        {
                            selectedType.value === "OPEN_LINK" &&
                            <div className="block p-12 w-full pb-5 pt-0">
                                <TextField
                                    error={title === ''}
                                    label="Nhập địa chỉ web"
                                    name="link"
                                    value={link}
                                    onChange={e => setLink(e.target.value)}
                                    variant="outlined"
                                    fullWidth
                                />
                            </div>
                        }
                        <div className="block p-12 w-full pt-0">
                            {/* <Typography className="text-14 mb-8" component="h4">
                                Tiêu đề gửi
                            </Typography> */}

                            <TextField
                                error={title === ''}
                                label="Tiêu đề gửi"
                                name="title"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                variant="outlined"
                                fullWidth
                            />
                        </div>
                        <div className="block p-12 w-full pt-5">
                            {/* <Typography className="text-14 mb-8" component="h4">
                                Nội dung ngắn
                            </Typography> */}

                            <TextField
                                error={shortContent === ''}
                                label="Nội dung ngắn"
                                name="title"
                                value={shortContent}
                                onChange={e => setShortContent(e.target.value)}
                                variant="outlined"
                                fullWidth
                            />
                        </div>

                        <div className="block p-12 w-full pt-5">
                            {/* <Typography className="text-14 mb-8" component="h4">
                                Nội dung ngắn
                            </Typography> */}
                            <AdvanceEditor
                                onChange={content => setContent(content)}
                                content={content}
                                className="h-200"
                            />
                        </div>
                    </div>
                }
            />
        </div>
    );
}
export default Notifies;
