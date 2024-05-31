import React from 'react';
import {Avatar, ListItem, ListItemText, Typography} from '@material-ui/core';
import moment from "moment";
import clsx from 'clsx';
import StatusIcon from './StatusIcon';
import {makeStyles} from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
    contactListItem: {
        borderBottom: '1px solid ' + theme.palette.divider,
        '&.active'  : {
            // backgroundColor: theme.palette.background.paper
            backgroundColor: 'rgb(0,0,0,0.1)'
        }
    },
    unreadBadge    : {
        backgroundColor: theme.palette.secondary.main,
        color          : theme.palette.secondary.contrastText
    }
}));

function ContactListItem(props)
{
    const classes = useStyles(props);

    return (
        <ListItem
          button
          className={clsx(classes.contactListItem, "px-16 py-12 min-h-92 el-ContactListItem", {'active': (props.selectedContact && (props.selectedContact._id === props.contact._id))})}
          onClick={() => props.onContactClick(props.contact.id)}
        >
          <div className="relative mr-16">

            <div className="absolute right-0 bottom-0 -m-4 z-10">
              <StatusIcon status={"online"}/>
            </div>

            <Avatar src={props.contact.avatar ? props.contact.avatar : "assets/icons/integrate/icon-user-default.png"} alt={props.contact.name?props.contact.name:"Khách vãng lai"}>
              {!props.contact.avatar || props.contact.avatar === '' ? props.contact.name : ''}
            </Avatar>
          </div>

          <ListItemText
            classes={{
              root     : "min-w-px",
              secondary: "truncate"
            }}
            primary={props.contact.name?props.contact.name:"Khách vãng lai"}
            secondary={props.contact.recent_message&&props.contact.recent_message.body.text}
          />

          {
            <div className="flex flex-col justify-center items-end">
              {props.contact.recent_message.createdTime && (
                <Typography className="whitespace-no-wrap mb-8" style={{fontSize:"11px"}}>
                  { moment(props.contact.recent_message.createdTime).fromNow({withSuffix: false, forcePast: true})}
                </Typography>
              )}
              {(props.contact.unread > 0) && (
                <div
                  className={clsx(classes.unreadBadge, "flex items-center justify-center min-w-24 h-24 rounded-full text-14 text-center")}>{props.contact.unread}</div>
              )}
            </div>
          }
        </ListItem>
    )
}

export default ContactListItem;
