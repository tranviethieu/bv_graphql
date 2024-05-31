import React, { useState, useEffect } from 'react';

import { Avatar, Button, Icon, ListItemIcon, ListItemText, Popover, Menu, MenuItem, Typography } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import * as authActions from 'app/auth/store/actions';
import { Link } from 'react-router-dom';
import { profileAttributes } from './components/ProfileAttributes';
import { showQuickEditDialog } from '../../../app/main/apps/shared-dialogs/actions';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import { showChangePasswordDialog} from './change-password/ChangePassword';

const showEditDialog = (data, submit, attributes) => {
  return (dispatch) => dispatch(showQuickEditDialog(
    {
      rootClass: "sm:w-full md:w-2/3",
      className: 'pb-36',
      title: "Hồ sơ cá nhân",
      // subtitle: "Hồ sơ cá nhân",
      attributes: attributes || profileAttributes,
      data: data,
      submit: submit

    }));
}
function UserMenu(props) {
  const dispatch = useDispatch();
  const user = useSelector(({ auth }) => auth.user.data);  
  const base = user.base;
  const [userMenu, setUserMenu] = useState(null);
  const [attributes, setAttributes] = useState(profileAttributes);
  
  const userMenuClick = event => {
    setUserMenu(event.currentTarget);
  };
  useEffect(() => {
    setAttributes(profileAttributes)
  }, [])
  const userMenuClose = () => {
    setUserMenu(null);
  };

  return (
    
    base?<React.Fragment>

      <Button className="h-64" onClick={userMenuClick}>
        {base.avatar ?
          (
            <Avatar className="" alt="user photo" src={base.avatar} />
          )
          :
          (
            <Avatar className="">
              {base.fullName}
            </Avatar>
          )
        }

        <div className="hidden md:flex flex-col ml-12 items-start">
          <Typography component="span" className="normal-case font-600 flex">
            {base.title}{base.fullName}
          </Typography>
          <Typography className="text-11 capitalize" color="textSecondary">
            {base.work}
          </Typography>
        </div>

        <Icon className="text-16 ml-12 hidden sm:flex" variant="action">keyboard_arrow_down</Icon>
      </Button>

      <Popover
        open={Boolean(userMenu)}
        anchorEl={userMenu}
        onClose={userMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
        classes={{
          paper: "py-8"
        }}
      >

        <React.Fragment>
          <MenuItem onClick={() => {
            userMenuClose();
            dispatch(showEditDialog(base, attributes))
          }}
          >
            <ListItemIcon className="min-w-40">
              <Icon>account_circle</Icon>
            </ListItemIcon>
            <ListItemText className="pl-0" primary="Hồ sơ" />
          </MenuItem>
          <MenuItem onClick={() => {
            userMenuClose();
            dispatch(showChangePasswordDialog())
          }}
          >
            <ListItemIcon className="min-w-40">
              <Icon>vpn_key</Icon>
            </ListItemIcon>
            <ListItemText className="pl-0" primary="Đổi mật khẩu" />
          </MenuItem>
          {
            user.defaultGroup && <PopupState variant="popover" popupId="demo-popup-menu">
              {(popupState) => (
                <React.Fragment>
                  <MenuItem {...bindTrigger(popupState)}>
                    <ListItemIcon className="min-w-40">
                      <Icon>supervisor_account</Icon>
                    </ListItemIcon>
                    <div className="flex">
                      <Typography className="ml-4 font-bold">{user.defaultGroup.name} </Typography>                      
                    </div>
                    <ListItemIcon className="min-w-40">
                      <Icon>chevron_right</Icon>
                    </ListItemIcon>
                  </MenuItem>
                  <Menu {...bindMenu(popupState)}>
                    {
                      user.groupPermissions.map((group, index) => group._id != user.defaultGroupId ?
                        <MenuItem key={index} onClick={() => { popupState.close(); dispatch(authActions.change_group(group._id)); userMenuClose(); }}>
                          <div className="flex">
                            <Typography>chuyển</Typography>
                            <Typography className="ml-4 font-bold">{group.name} </Typography>                           
                          </div>
                        </MenuItem> :
                        <MenuItem key={index} onClick={popupState.close}>
                          <div className="flex">
                            <Typography className="ml-4 font-bold">{group.name} </Typography>
                          </div>
                        </MenuItem>
                      )
                    }

                  </Menu>
                </React.Fragment>
              )}
            </PopupState>
          }
          <MenuItem onClick={() => {
            dispatch(authActions.logoutUser());
            userMenuClose();
          }}>
            <ListItemIcon className="min-w-40">
              <Icon>power_settings_new</Icon>
            </ListItemIcon>
            <ListItemText className="pl-0" primary="Đăng xuất" />
          </MenuItem>
        </React.Fragment>

      </Popover>
    </React.Fragment>:null
  );
}

export default UserMenu;
