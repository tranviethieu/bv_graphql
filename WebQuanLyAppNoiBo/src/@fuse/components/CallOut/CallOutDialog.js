import React,{useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from 'app/store/actions';
import { Dialog, DialogContent, Typography, Toolbar, AppBar, Avatar } from '@material-ui/core';
import graphqlService from 'app/services/graphqlService';
import LinearBuffer from './Progress';
import {QUERY_USER_BY_PHONE } from './query';
function CallOutDialog(props) {
    const dispatch = useDispatch();
    const calling = useSelector(({ calling }) => calling);
    useEffect(() => {
        if (calling.phoneNumber&&(!calling.user||calling.user.phoneNumber!==calling.phoneNumber)) {
            graphqlService.query(QUERY_USER_BY_PHONE, { phoneNumber: calling.phoneNumber }, dispatch).then(response => {
                if(response.data&&response.data.length>0)
                    dispatch(Actions.setUser(response.data[0]));
            })
        }
    },[calling, calling.user, calling.phoneNumber, dispatch]);

    function closeComposeDialog() {
        dispatch(Actions.clearCall());
    }
    return (
        <Dialog
            classes={{
                paper: "m-24"
            }}
            open={(calling && calling.phoneNumber && calling.phoneNumber.length > 0)?true:false}
            onClose={closeComposeDialog}
            fullWidth
            maxWidth="xs"
        >
            <AppBar position="static" elevation={1}>
                <Toolbar className="flex w-full justify-center">
                    <Typography variant="subtitle1" color="inherit">
                        Đang thiết lập cuộc gọi tới số <span className="font-bold">{calling.phoneNumber && calling.phoneNumber}</span>
                    </Typography>
                </Toolbar>
                {
                    calling.user && <div className="flex flex-col items-center justify-center pb-24">
                        <Avatar className="w-48 h-48" alt="KH" src={process.env.REACT_APP_FILE_PREVIEW_URL+calling.user.avatar} />
                        {
                            <Typography variant="h6" color="inherit" className="pt-8">
                                {calling.user.fullName}
                            </Typography>
                        }
                    </div>
                }
            </AppBar>
            <DialogContent classes={{ root: "p-24" }}>
                <LinearBuffer/>
                <Typography className="mt-12">
                    Cuộc gọi sẽ được tự động kết nối tới máy bàn của bạn ngay khi liên hệ được khách hàng, vui lòng chờ trong ít giây
                </Typography>

            </DialogContent>
        </Dialog>
    )
}
export default CallOutDialog;
