import React, {useState, useEffect} from 'react';
import {Button, Typography, Dialog, Icon, IconButton, Slide, Tooltip, DialogTitle, TextField, DialogContent, DialogActions, FormControl, InputLabel, Select} from '@material-ui/core';
import {makeStyles} from '@material-ui/styles';
import {red} from '@material-ui/core/colors';
import { callout } from 'app/store/actions';
import withReducer from 'app/store/withReducer';
import reducer from './store/reducers';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from './store/actions/index'

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
});

const useStyles = makeStyles(theme => ({
    button               : {
        position               : 'absolute',
        right                  : 0,
        top                    : 200,
        minWidth               : 48,
        width                  : 48,
        height                 : 48,
        opacity                : .9,
        padding                : 0,
        borderBottomRightRadius: 0,
        borderTopRightRadius   : 0,
        zIndex                 : 999,
        color                  : theme.palette.getContrastText(red[500]),
        backgroundColor        : "rgb(39, 60, 117)",
        '&:hover'              : {
            backgroundColor: red[500],
            opacity        : 1
        }
    },
    '@keyframes rotating': {
        from: {
            transform: 'rotate(0deg)'
        },
        to  : {
            transform: 'rotate(360deg)'
        }
    },
    buttonIcon           : {
        // animation: '$rotating 3s linear infinite'
    },
    dialogPaper          : {
        position       : 'fixed',
        width          : 300,
        maxWidth       : '90vw',
        backgroundColor: theme.palette.background.paper,
        boxShadow      : theme.shadows[5],
        top            : 200,
        height         : '350px',
        minHeight      : '350px',
        bottom         : 0,
        right          : 0,
        margin         : 0,
        zIndex         : 1000,
        borderRadius   : 0
    }
}));

function CallOutPanel()
{
    const dispatch = useDispatch();
    const classes = useStyles();
    const [phoneNumber, setPhoneNumber] = useState("");
    const [campaignId, setCampaignId] = useState(null);
    const [listCampaign, setListCampaign] = useState([]);
    const open = useSelector(({callout}) => callout.state);
    const phone = useSelector(({callout}) => callout.phoneNumber)

    useEffect(()=>{
      if(open === true){
        if(phone){
          setPhoneNumber(phone)
        }
        Actions.getCallCampaign({filtered: [{id: "finished", value: 'false'}]}).then(response =>{
          console.log(response);
          if(response.code === 0){
            setListCampaign(response.data)
            if (response.data.length>0){
              setCampaignId(response.data[0]._id)
            }
            // console.log(response.data);
          }
        })
      }
      else{
        setPhoneNumber("")
        setCampaignId(null)
      }
    }, [phone, open])

    function canBeCall() {
        return (
            phoneNumber && phoneNumber.length>0
        )
    }
    return (
        <React.Fragment>
          <Tooltip title = "Tạo cuộc gọi mới">
            <Button id="fuse-settings" className={classes.button} variant="contained" onClick={ev => {dispatch(Actions.toggleCallPanel())}}>
              <Icon className={classes.buttonIcon}>phone_forwarded</Icon>
            </Button>
          </Tooltip>
          <Dialog
            TransitionComponent={Transition}
            aria-labelledby="settings-panel"
            aria-describedby="settings"
            open={open}
            keepMounted
            onClose={ev => {dispatch(Actions.toggleCallPanel())}}
            BackdropProps={{invisible: true}}
            classes={{
              paper: classes.dialogPaper
            }}
            className = "el-CallOutPanel"
          >
            <DialogTitle id="alert-dialog-title" className = "pr-0">
              <div className = "el-CallOutPanel-Header">
                <div className ='flex'>
                  <Icon className="mt-4">phone_forwarded</Icon>
                  <Typography className="mb-32" variant="h6">Tạo cuộc gọi mới</Typography>
                </div>
                <IconButton className="el-CallOutPanel-WhiteColor" onClick={ev => {dispatch(Actions.toggleCallPanel())}}>
                  <Icon>close</Icon>
                </IconButton>
              </div>
            </DialogTitle>
            <DialogContent>
              <div className="el-flex-item flex-item-flex1 mt-8">
                <TextField
                  placeholder="Số điện thoại"
                  disableUnderline
                  className="mt-8 mb-16"
                  fullWidth
                  variant="outlined"
                  value={phoneNumber||''}
                  onChange={ev =>
                    setPhoneNumber(ev.target.value.replace(/([^0-9\s])/gm, ""))}
                />
                <FormControl variant="outlined" className="mt-8 mb-16 w-full">
                  <InputLabel ref = {null}  id="demo-simple-select-outlined-label">
                    Loại cuộc gọi
                  </InputLabel>
                  <Select
                    native
                    labelWidth={85}
                    value={campaignId||''}
                    inputProps={{
                      name: 'direction',
                      id: 'outlined-age-native-simple',
                    }}
                    onChange={e => setCampaignId(e.target.value)}
                  >
                    <option value= {null}>Chưa chọn chiến dịch</option>
                    {
                      listCampaign && listCampaign.length > 0 && listCampaign.map((item, index) =>
                        <option key = {index} value = {item._id}>{item.name}</option>
                      )
                    }
                  </Select>
                </FormControl>
              </div>
              <Button
                className = "el-CallOutPanel-Button"
                fullWidth
                disabled={!canBeCall()}
                onClick = {() => dispatch(callout(phoneNumber, campaignId))}
              >
                <Icon fontSize = "inherit">call</Icon>
                Gọi
              </Button>
            </DialogContent>
            <DialogActions>
            </DialogActions>
          </Dialog>
        </React.Fragment>
    );
}

// export default CallOutPanel;
export default withReducer('callout', reducer)(CallOutPanel);
