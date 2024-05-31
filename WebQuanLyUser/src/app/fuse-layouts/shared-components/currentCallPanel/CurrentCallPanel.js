import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent, CardActions, Button, Typography, Collapse, Avatar, IconButton, Icon, Divider, List, ListItem, ListItemText } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import clsx from 'clsx';
import { green } from '@material-ui/core/colors';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { showUserDialog } from 'app/main/apps/shared-dialogs/actions'
import * as Actions from '../quickPanel/store/actions'
const useStyles = makeStyles(theme => ({
    card: {
        maxWidth: 345,
        minWidth: 250,
        right: 0,
        bottom: 0,
        position: "absolute",
        zIndex: 999
    },
    dl: {
        width: 85,
        fontWeight: "bold",
        fontSize:15
    },
    dt: {
      width: 200
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    avatar: {
        color: green[500],
    },
}));
function CurrentCallPanel(props) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [expandHistory, setExpandHistory] = React.useState(false);
    const [expandBody, setExpandBody] = React.useState(false);
    const [callLogs, setCallLogs] = React.useState([])
    const handleExpandHistory = () => {
        setExpandHistory(!expandHistory);
    };

    const newCall = useSelector(({ subscribe }) => subscribe.callEvents.event);
    const [display, setDisplay] = useState(false);
    function toggleBody() {
        setExpandBody(!expandBody);
    }
    useEffect(() => {
        if (newCall && newCall.state === "UP") {
            setDisplay(true);
            // setExpandBody(true);
            Actions.getCallLogsByPhone({filtered: [{id: "phonenumber", value: newCall.phoneNumber}, {id: "lastapp", value: "DIAL"}]}).then(response =>{
              setCallLogs(response.data)
              // console.log(response);
            })
        }
    }, [newCall]);

    return (
        display && newCall ?
            <Card className={classes.card}>
              <CardHeader
                className = "el-CallPopUp-Header"
                avatar={
                  newCall.user && newCall.user.avatar ? <Avatar aria-label="recipe" src={newCall.user.avatar} className={classes.avatar}>
                    {newCall.user.fullName}
                  </Avatar> :
                  <Icon className={classes.avatar}>phone_in_talk</Icon>
                }
                action={
                  <IconButton aria-label="settings" onClick={e => setDisplay(false)}>
                    <Icon>close</Icon>
                  </IconButton>
                }
                title={newCall.user ? newCall.user.fullName : "KH mới"}
                subheader={newCall.phoneNumber}
                onClick={toggleBody}
              />
              {
                expandBody &&
                <React.Fragment className = "el-CallPopUp">
                  {newCall.user&&<CardContent>
                    <div className="flex">
                      <Typography className={classes.dl}>Giới tính:</Typography>
                      <Typography>{newCall.user.gender === "male" ? "Nam" : "Nữ"}</Typography>
                    </div>

                    <div className="flex">
                      <Typography className={classes.dl}>Ngày sinh:</Typography>
                      <Typography>{moment(newCall.user.birthDay).format("DD/MM/YYYY")}</Typography>
                    </div>
                    <div className="flex">
                      <Typography className={classes.dl}>Địa chỉ:</Typography>

                      {
                        newCall && newCall.user &&
                        <Typography
                          className={classes.dt}
                        >
                          {newCall.user.street} {newCall.user.ward && ` - ${newCall.user.ward.name}`} {newCall.user.district && ` - ${newCall.user.district.name}`}{newCall.user.province && ` - ${newCall.user.province.name}`} {newCall.user.nationality && ` - ${newCall.user.nationality.name}`
                          }
                        </Typography>
                      }
                    </div>
                  </CardContent>
                  }
                  <CardActions disableSpacing>
                    <Button onClick={e => {
                      setExpandBody(!expandBody);
                      dispatch(showUserDialog({className: "el-coverFUD", phoneNumber: newCall.phoneNumber, channelType: "CRM" }))
                    }
                    }>Chi tiết</Button>
                    <IconButton
                      className={clsx(classes.expand, {
                        [classes.expandOpen]: expandHistory,
                      })}
                      onClick={handleExpandHistory}
                      aria-expanded={expandHistory}
                      aria-label="show more"
                    >
                      <ExpandMoreIcon />
                    </IconButton>
                  </CardActions>
                  <Divider/>
                  <Collapse in={expandHistory} timeout="auto" unmountOnExit>
                    <CardContent>
                      <Typography paragraph>Cuộc gọi gần đây:</Typography>
                      <List className = "el-CallPopUp-ExpandContent">
                        {
                          callLogs && callLogs.length > 0 && callLogs.map((item, index) =>
                            <ListItem key={index}
                              className = "el-CurrentCallPanel-ListItem"
                              button
                            >
                              <div className = "el-CurrentCallPanel-Item">
                                <div className = "pb-2">Gọi lúc: {moment(item.calldate).format("HH:MM:ss DD/MM/YYYY")}</div>
                                {
                                  (!item.uniqueid.includes("callout") && item.dcontext=== "ext-local") &&
                                  <div>
                                    <div>
                                      {item.account&& `Người tiếp nhận: ${item.account.base.fullName}`}
                                    </div>
                                  </div>
                                }
                                {
                                  (item.uniqueid.includes("callout") || item.dcontext=== "from-internal") &&
                                  <div>
                                    <div>
                                      {item.account && `Người gọi ra: ${item.account.base.fullName}`}
                                    </div>
                                  </div>
                                }
                              </div>
                              <div className = "el-CurrentCallPanel-Item">
                                {
                                  (item.uniqueid.includes("callout") || item.dcontext=== "from-internal") ? <Icon className="text-red">call_made</Icon> : <Icon className="text-blue">call_received</Icon>
                                }
                              </div>
                              <Divider/>
                            </ListItem>
                          )}
                      </List>
                      {/* <Typography paragraph>:</Typography> */}
                    </CardContent>
                  </Collapse>
                </React.Fragment>
              }


            </Card>
            : <div></div>)

}
export default CurrentCallPanel;
