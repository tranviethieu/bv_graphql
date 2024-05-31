import Login from './Login';
import ChooseHospital from './ChooseHospital'
import {authRoles} from 'app/auth';

export const LoginConfig = {
    settings: {
        layout: {
            config: {
                navbar        : {
                    display: false
                },
                toolbar       : {
                    display: false
                },
                footer        : {
                    display: false
                },
                leftSidePanel : {
                    display: false
                },
                rightSidePanel: {
                    display: false
                },
                callOutPanel: {
                  display:false
                },
                // currentCallPanel: {
                //   display:false
                // }
            }
        }
    },
    auth    : authRoles.onlyGuest,
    routes  : [
        {
            path     : '/login/:token?',
            component: Login
        },
        {
            path     : '/choose-hospital',
            component: ChooseHospital
        }
    ]
};
