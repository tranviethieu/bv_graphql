import { FuseScrollbars, FuseAnimateGroup, FuseUtils } from '@fuse';
import { AppBar, List, Typography, Toolbar, Icon, Button, Input, Paper, Tabs, Tab } from '@material-ui/core';
import React, { useMemo, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from './store/actions';

import CallListItem from './CallListItem';


function CallsSidebar(props) {
    const dispatch = useDispatch();

    const [searchText, setSearchText] = useState('');
    // const [calls, setCalls] = useState([]);

    const callEvents = useSelector(({ subscribe }) => subscribe.callEvents.calls);
    const history = useSelector(({ myCallHistory }) => myCallHistory.calls);
    const [page, setPage] = useState(0);
    const [tabValue, setTabValue] = useState(0);
    function handleChangeTab(event, tabValue) {
        setTabValue(tabValue);
    }

    useEffect(() => {
        //truy van du lieu lan dau tien
        const fetchCall = () => {
            var filtered = [{ id: 'src,dst', value: searchText }];
            var sorted = [{ id: "calldate", desc: true }];
            dispatch(Actions.getCalls({ filtered, sorted, pageSize: 5, page }));
        }
        fetchCall()
    }, [dispatch, page, searchText])
    // useEffect(() => {
    //     if (history.data) {
    //         setCalls(history.data);
    //     }
    // }, [history])

    // useEffect(() => {
    //     if (callEvents.event) {
    //         var existed = calls.filter(item => item.phoneNumber === callEvents.event.phoneNumber);
    //         var checklist = calls.filter(item => item.phoneNumber !== callEvents.event.phoneNumber);
    //         if (existed.length > 0) {
    //             callEvents.event.callNumber = existed[0].callNumber ? existed[0].callNumber : 0 + 1;
    //         } else {
    //             callEvents.event.callNumber = 0;
    //         }
    //         setCalls([callEvents.event, ...checklist]);
    //         if (calls.length === 0) {
    //             dispatch(Actions.selecteCall(callEvents.event));
    //         }
    //     }
    // }, [callEvents]);
    function handleSearchText(event) {
        setSearchText(event.target.value);
    }
    return (
        <div className="flex flex-col flex-auto h-full" id = "el-CallsSidebar">
          <AppBar
            position="static"
            color="default"
            elevation={1}
          >

            {useMemo(() => (
              <Toolbar className="px-16" id = "el-CallsSidebar-searchText">
                <Paper className="flex p-4 items-center w-full px-8 py-4 rounded-8" elevation={1}>

                  <Icon className="mr-8" color="action">search</Icon>

                  <Input
                    placeholder="Tìm kiếm cuộc gọi"
                    className="flex flex-1"
                    disableUnderline
                    fullWidth
                    value={searchText}
                    inputProps={{
                      'aria-label': 'Search'
                    }}
                    onInput = {(e) =>{
                      e.target.value = e.target.value.replace(/[^0-9a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s]/gi, '')
                    }}
                    onChange={handleSearchText}
                  />
                </Paper>
              </Toolbar>
            ), [searchText])}
          </AppBar>

          <FuseScrollbars className="overflow-y-auto flex-1">
            <List className="w-full">
              {useMemo(() => {
                function getFilteredArray(arr, searchText) {
                  if (searchText.length === 0) {
                    return arr;
                  }
                  return FuseUtils.filterArrayByString(arr, searchText);
                }

                const historyFiltered = getFilteredArray(history.data, searchText);
                const eventFiltered = getFilteredArray(callEvents, searchText);
                return (
                  <React.Fragment>
                    <FuseAnimateGroup
                      enter={{
                        animation: "transition.expandIn"
                      }}
                      className="flex flex-col flex-shrink-0"
                    >
                      <Tabs
                        id = "el-CallsSidebar-Tab"
                        value={tabValue}
                        onChange={handleChangeTab}
                        indicatorColor="secondary"
                        textColor="secondary"
                        variant="scrollable"
                        scrollButtons="auto"
                        classes={{ root: "w-full h-64" }}
                      >
                        <Tab className="h-64 normal-case" label="LỊCH SỬ CUỘC GỌI" />
                        <Tab className="h-64 normal-case" label="ĐANG PHỤC VỤ" />
                      </Tabs>
                      {
                        tabValue === 0 && <div className = "el-CallsSidebar-CallList">
                          {
                            historyFiltered.map(call => (
                              <CallListItem key={call._id} call={{
                                phoneNumber: call.callin ? call.src : call.dst,
                                phoneCode: call.callin ? call.dst : call.src,
                                direction: call.callin ? "IN" : "OUT",
                                atTime: call.atTime || call.calldate,
                                state: call.state || "DOWN",
                                ...call
                              }} onContactClick={(e) => dispatch(Actions.selecteCall(e))} />
                            ))
                          }
                          {
                            history.page < history.pages && <Typography className="text-center text-15 pt-16 el-CallsSidebar-LoadMoreButton">
                              <Button color="secondary" onClick={() => setPage(history.page + 1)}>Tải thêm</Button>
                            </Typography>
                          }
                        </div>
                      }
                      {
                        tabValue === 1 && <div className = "el-CallsSidebar-CallList">
                          {
                            eventFiltered.map(call => (
                              <CallListItem key={call._id} call={{
                                phoneNumber: call.phoneNumber || (call.dcontext && call.dcontext.indexOf('ext-') >= 0 ? call.src : call.dst),
                                phoneCode: call.phoneCode || (call.dcontext && call.dcontext.indexOf('ext-') >= 0 ? call.dst : call.src),
                                direction: call.direction || (call.dcontext && call.dcontext.indexOf('ext-') >= 0 ? "IN" : "OUT"),
                                atTime: call.atTime || call.calldate,
                                state: call.state || "DOWN",
                                ...call
                              }} onContactClick={(e) => dispatch(Actions.selecteCall(e))} />

                            ))
                          }
                          {
                            history.page < history.pages &&
                            <Typography className="text-center text-15 pt-16 el-CallsSidebar-LoadMoreButton">
                              <Button color="secondary" onClick={() => setPage(history.page + 1)}>Tải thêm</Button>
                            </Typography>
                          }
                        </div>
                      }
                    </FuseAnimateGroup>
                  </React.Fragment>
                )
              }, [history.data, history.page, history.pages, searchText, callEvents, tabValue, dispatch])
                    }
                </List>
            </FuseScrollbars>
        </div>
    )
}

export default CallsSidebar;
