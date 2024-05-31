import React, {useEffect, useState} from 'react';
import {Divider, Drawer, Button, List, ListItem, ListItemText, ListSubheader, Typography} from '@material-ui/core';
import {FuseScrollbars} from '@fuse';
import moment from 'moment';
import {useSelector, useDispatch} from 'react-redux';
import * as Actions from './store/actions/index'
import withReducer from 'app/store/withReducer';
import reducer from './store/reducers';
import {makeStyles} from '@material-ui/styles';
import history from '@history';
const useStyles = makeStyles(theme => ({
    root: {
        width: 300
    }
}));

function QuickPanel(props)
{
    const classes = useStyles();
    const dispatch = useDispatch();
    const myAccountActions = useSelector(({quickPanel}) => quickPanel.data);
    const state = useSelector(({quickPanel}) => quickPanel.state);
  const [pageSize, setPageSize] = useState(5)
  const userState = useSelector(({auth}) => auth.user);
    // fetchData(state){
    //   const { page, pageSize, filtered } = state;
    //   Actions.getMyAccountActions({page: 0, pageSize, filtered}, dispatch).then(response =>{
    //     setAccountActions(response)
    //   })
    // }
  useEffect(() => {
    if(userState.data&&userState.data.fullName)
        dispatch(Actions.getQuickPanelData({page: 0, pageSize: pageSize}));
    }, [dispatch, pageSize,userState.data]);
  function handleGotoDetail(_id, action, userActionType){
    if(action !== "LOGIN" && action !== "REMOVE_USERACTION" && userActionType){
      if(userActionType === 1){
        history.push(`/apps/user-actions/appointments/${_id}`)
      }
      else if(userActionType === 2){
        history.push(`/apps/user-actions/examinations/${_id}`)
      }
      else if(userActionType === 3){
        history.push(`/apps/user-actions/tickets/${_id}`)
      }
      else if(userActionType === 4){
        history.push(`/apps/user-actions/test-results/${_id}`)
      }
      else if(userActionType === 5){
        history.push(`/apps/user-actions/scan-results/${_id}`)
      }
      else if(userActionType === 7){
        history.push(`/apps/user-actions/prescriptions/${_id}`)
      }
      else return;
    }
    else return;
  }
    return (
        <Drawer
          className = "el-MyActionsPanel"
          classes={{paper: classes.root}}
          open={state}
          anchor="right"
          onClose={ev => {dispatch(Actions.toggleQuickPanel()); setPageSize(5)}}
        >
          <FuseScrollbars>

            <ListSubheader component="div" className = "el-MyActionsPanel-Header">Lịch sử hoạt động của tôi {myAccountActions ? "(" + myAccountActions.data.length + "/" + myAccountActions.records + ")" : ""}</ListSubheader>

            {/* <div className="mb-0 py-16 px-24">
              <Typography className="mb-12 text-32" color="textSecondary">
                {moment().format('dddd')}
              </Typography>
              <div className="flex">
                <Typography className="leading-none text-32" color="textSecondary">{moment().format('DD')}</Typography>
                <Typography className="leading-none text-16" color="textSecondary">th</Typography>
                <Typography className="leading-none text-32" color="textSecondary">{moment().format('MMMM')}</Typography>
              </div>
            </div> */}
            {/* <Divider/> */}
            <List className = "el-MyActionsPanel-List">
              {myAccountActions && myAccountActions.data.map((item, index) => (
                <ListItem key={index}
                  className = "el-MyActionsPanel-ListItem"
                  onClick = {()=>{item.data? handleGotoDetail(item.data._id, item.action, item.data.Action): handleGotoDetail( item.action)}}
                  button
                >
                  <div>
                    {item.action === "LOGIN" ? "Đăng nhập hệ thống" : item.action === "ADD_USERACTION" ? "Thêm hoạt động của khách hàng" : item.action === "UPDATE_USERACTION" ? "Cập nhật hoạt động của khách hàng" : item.action === "REMOVE_USERACTION" ? "Xóa hoạt động khách hàng" : "Hoạt động khác"}
                  </div>
                  {
                    (item.action === "ADD_USERACTION" || item.action === "UPDATE_USERACTION"  || item.action === "REMOVE_USERACTION" ) &&
                    <div className = "el-smallText">
                      { item.data &&
                        <div>
                          Loại hoạt động:
                          {
                            item.data.Action === 1 ? " Đặt khám" : item.data.Action === 2 ? " Kết quả khám" : item.data.Action === 3 ? " Yêu cầu khách hàng" : item.data.Action === 4 ? " Kết quả xét nghiệm" : item.data.Action === 5 ? " Kết quả chụp chiếu" : item.data.Action === 7? " Đơn thuốc" : " Hoạt động khác"
                          }
                        </div>
                      }
                    </div>
                  }
                  <div className = "el-smallText">
                    {moment(item.createdTime).format("HH:mm DD/MM/YYYY")}
                  </div>
                  <Divider/>
                </ListItem>
              ))}
            </List>
            <Divider/>
            {
              (myAccountActions && myAccountActions.data.length < myAccountActions.records) && <Typography className="text-center text-15 pt-16 el-CallsSidebar-LoadMoreButton">
                <Button color="secondary" onClick={() => setPageSize(pageSize + 5)}>Tải thêm</Button>
              </Typography>
            }
          </FuseScrollbars>
        </Drawer>
    );
}

export default withReducer('quickPanel', reducer)(QuickPanel);
