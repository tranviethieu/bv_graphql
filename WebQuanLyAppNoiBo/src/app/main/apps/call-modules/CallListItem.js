import React from 'react';
import { Avatar, ListItem, ListItemText, Typography, Icon } from '@material-ui/core';
import StatusIcon from './StatusIcon';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { deepOrange, deepPurple } from '@material-ui/core/colors';
import { useDispatch } from 'react-redux';
import { showUserDialog } from 'app/main/apps/shared-dialogs/actions'
import moment from 'moment';

const useStyles = makeStyles(theme => ({
    CallListItem: {
        borderBottom: '1px solid ' + theme.palette.divider,
        '&.active': {
            backgroundColor: theme.palette.background.paper
        }
    },
    unreadBadge: {
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.secondary.contrastText
    },
    orangeAvatar: {

        color: '#fff',
        backgroundColor: deepOrange[500],
    },
    purpleAvatar: {

        color: '#fff',
        backgroundColor: deepPurple[500],
    },
}));

function CallListItem(props) {
    const classes = useStyles(props);
    const dispatch = useDispatch();
    // const { phoneNumber, phoneCode, callid, duration, recordingfile, direction, state, user, account, atTime } = props.call;
    const { phoneNumber, duration, direction, state, user, atTime } = props.call;
    return (
        <ListItem
          id = "el-CallListItemCover"
          button
          className={clsx(classes.CallListItem, "px-16 py-12 min-h-92 flex", { 'active': (props.selectedContact === phoneNumber)})}
          onClick={() => {
            dispatch(showUserDialog({ rootClass: "el-coverFUD", phoneNumber, channelType: "CRM" }));
            props.onContactClick(props.call)
          }}
        >

          <div className="relative mr-16" id = "el-CallListItem">
            <div className="absolute right-0 bottom-0 -m-4 z-10">
              <StatusIcon status={state} />
            </div>
            <Avatar src={user && user.avatar} alt={user && user.fullName} className={classes.orangeAvatar}>
              {user && user.fullName ? user.fullName.substring(0, 1) : "KH"}
            </Avatar>
          </div>

          <ListItemText
            classes={{
              root: "min-w-px",
              secondary: "truncate"
            }}
            primary={phoneNumber}
            secondary={user ? user.fullName : "Khách hàng mới"}
          />
          <div id = "el-CallListItem-TimeCall">
            <Typography className={state==="UP"?"text-red":""}>
              {moment().startOf('day')
                .seconds(duration||0)
                .format('mm:ss')}
            </Typography>
          </div>
          <div className="text-center" style={{ width: 100 }} id = "el-CallListItem-CallAtTime">
            {atTime && (
              <Typography className="whitespace-no-wrap text-13 text-grey">
                {moment(atTime).format("HH:mm DD/MM")}
              </Typography>
            )}
            {
              direction === "OUT" ? <Icon className="text-red">call_made</Icon> : <Icon className="text-blue">call_received</Icon>
            }
          </div>

        </ListItem>
    )
}

export default CallListItem;
