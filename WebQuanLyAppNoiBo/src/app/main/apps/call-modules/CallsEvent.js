import React from 'react';
import { Drawer, AppBar, Toolbar, Typography, Hidden, Avatar, Button } from '@material-ui/core';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { useSelector, useDispatch } from 'react-redux';
import clsx from 'clsx';
import withReducer from 'app/store/withReducer';
import CallsSidebar from "./CallsSidebar";
import StatusIcon from "./StatusIcon";
import history from '@history';
import { makeStyles } from '@material-ui/styles';
import CallDetail from './CallDetail';
import reducer from './store/reducers';
import { showAppointmentDialog } from '../shared-dialogs/actions'

const drawerWidth = 400;
const headerHeight = 200;

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'row',
        minHeight: '100%',
        position: 'relative',
        flex: '1 1 auto',
        height: 'auto',
        backgroundColor: theme.palette.background.default
    },
    topBg: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: headerHeight,
        backgroundImage: 'url("../../assets/images/backgrounds/header-bg.png")',
        backgroundColor: theme.palette.primary.dark,
        backgroundSize: 'cover',
        pointerEvents: 'none'
    },
    contentCardWrapper: {
        position: 'relative',
        padding: 24,
        // maxWidth: 1400,
        display: 'flex',
        flexDirection: 'column',
        flex: '1 0 auto',
        width: '100%',
        minWidth: '0',
        maxHeight: '100%',
        margin: '0 auto',
        [theme.breakpoints.down('sm')]: {
            padding: 16
        },
        [theme.breakpoints.down('xs')]: {
            padding: 12
        }
    },
    contentCard: {
        display: 'flex',
        position: 'relative',
        flex: '1 1 100%',
        flexDirection: 'row',
        // backgroundImage: 'url("/assets/images/patterns/rain-grey.png")',
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[1],
        borderRadius: 8,
        minHeight: 0,
        overflow: 'hidden'
    },
    drawerPaper: {
        width: drawerWidth,
        maxWidth: '100%',
        overflow: 'hidden',
        height: '100%',
        [theme.breakpoints.up('md')]: {
            position: 'relative'
        }
    },
    contentWrapper: {
        display: 'flex',
        flexDirection: 'column',
        flex: '1 1 100%',
        zIndex: 10,
        background: `linear-gradient(to bottom, ${fade(theme.palette.background.paper, 0.8)} 0,${fade(theme.palette.background.paper, 0.6)} 20%,${fade(theme.palette.background.paper, 0.8)})`
    },
    content: {
        display: 'flex',
        flex: '1 1 100%',
        minHeight: 0
    }
}));


function CallsEvent(props) {
    const selectedCall = useSelector(({ myCallHistory }) => myCallHistory.calls.selectedCall);
    const classes = useStyles(props);
    const dispatch = useDispatch();

    const handleClickOpen = (type, phoneNumber) => {
      dispatch(showAppointmentDialog({ phoneNumber: phoneNumber}));
    };

    return (
        <div className={clsx(classes.root)} id = "el-CallsEvent">
          <div className={classes.topBg} />
          <div className={clsx(classes.contentCardWrapper, 'container')}>
            <div className={classes.contentCard}>
              <Hidden smDown>
                <Drawer
                  className="h-full z-20"
                  variant="permanent"
                  open
                  classes={{
                    paper: classes.drawerPaper
                  }}
                >
                  <CallsSidebar />
                </Drawer>
              </Hidden>
              {selectedCall&&<main className={clsx(classes.contentWrapper, "z-10")}>
                <React.Fragment>
                  <AppBar className="w-full" position="static" elevation={1}>
                    <Toolbar className="px-16 flex flex-1 justify-between">

                      <div className="flex items-center cursor-pointer">
                        <div className="relative ml-8 mr-12">
                          <div className="absolute right-0 bottom-0 -m-4 z-10">
                            <StatusIcon status={selectedCall.status} />
                          </div>

                          <Avatar src={selectedCall && selectedCall.user && selectedCall.user.avatar}>
                            {selectedCall && selectedCall.user&&selectedCall.user.fullName ? selectedCall.user.fullName.substring(0,1) : 'KH'}
                          </Avatar>
                        </div>
                        <Typography color="inherit" className="text-18 font-600">{selectedCall.user ? selectedCall.user.fullName : selectedCall.phoneNumber}</Typography>

                      </div>
                      <div>
                        <Button className='btn-blue' variant="contained" onClick={() => handleClickOpen("APPOINTMENT", selectedCall.phoneNumber)}>Tạo lịch khám</Button>{" "}
                      </div>
                    </Toolbar>
                  </AppBar>
                  <div className={classes.content}>
                    <CallDetail className="flex flex-1 z-10" />
                  </div>
                </React.Fragment>

              </main>
              }
            </div>
          </div>
        </div>
    )
}

export default withReducer("myCallHistory",reducer)(CallsEvent);
