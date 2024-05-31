import history from '@history';
import { setDefaultSettings, setInitialSettings, setNavigation } from 'app/store/actions/fuse';
import { supportNavigation, adminNavigation, apponitment_checkin, doctor, scan_doctor, test_doctor, drug, communication, appointment_checkin } from 'app/fuse-configs/navigationConfig';
import _ from '@lodash';
import store from 'app/store';
import { ME, MUTATION_REGISTER_DEVICE, CHANGE_ACCOUNT_GROUP } from './query';
import graphqlService from 'app/services/graphqlService';
import elsagaService from 'app/services/elsagaService';
import { defaultSettings } from '@fuse';
import { showMessage } from 'app/store/actions';
export const SET_USER_DATA = '[USER] SET DATA';
export const REMOVE_USER_DATA = '[USER] REMOVE DATA';
export const USER_LOGGED_OUT = '[USER] LOGGED OUT';
export const REGISTER_DEVICE = '[USER] REGISTER DEVICE';

/**
 * Set user data from Auth0 token data
 */
export function setUserDataAuth0(tokenData) {
    const user = {
        role: ['admin'],
        from: 'auth0',
        data: {
            displayName: tokenData.username,
            photoURL: tokenData.picture,
            email: tokenData.email,
            settings: (tokenData.user_metadata && tokenData.user_metadata.settings) ? tokenData.user_metadata.settings : {},
            shortcuts: (tokenData.user_metadata && tokenData.user_metadata.shortcuts) ? tokenData.user_metadata.shortcuts : []
        }
    };

    return setUserData(user);
}

///chuyển qua đăng nhập theo nhóm tài khoản khác
export function change_group(groupId) {
    return (dispatch) => {
        graphqlService.mutate(CHANGE_ACCOUNT_GROUP, { groupId }, dispatch).then(response => {
            if (response.code === 0 && response.data) {
                loadUserData();
                dispatch(showMessage({ message: "Chuyển tài khoản thành công" }));
            } else {
                dispatch(showMessage({ message: response.message }));
            }
        })
    }
}

export function loadUserData() {
    ///fetch user info
    graphqlService.query(ME).then(response => {
        store.dispatch(setUserData(response && response.data));
        if (history.location.pathname.startsWith('/login')) {
            var regex = /redirect=(.+)/;
            if (regex.test(history.location.search)) {
                const redirect = regex.exec(history.location.search);
                if (redirect.length > 1 && !redirect[1].startsWith("/login")) {
                    history.push(redirect[1]);
                } else {
                    history.push("/apps/welcome");
                }

            } else
                history.push("/apps/welcome");
        }

        history.push("/");
    }, (error) => {
        store.dispatch(logoutUser())
    }
    )
}
function findShortcut(menuGraph) {
    let shortcuts = [];
    menuGraph.children.forEach(function (item) {
        if (item.type === "SHORTCUT") {
            shortcuts.push(item.id);
        }
        if (item.children) {
            item.children.forEach(function (sub) {
                const sub_shortcut = findShortcut(sub);
                shortcuts = shortcuts.concat(sub_shortcut);
            })
        }
    })
    return shortcuts;
}
/**
 * Set User Data
 */
export function setUserData(user) {
    return (dispatch) => {

        /*
        Set User Settings
         */
        dispatch(setDefaultSettings(defaultSettings));
        //set setNavigation
        //xử lý quick shortcut tại đây

        dispatch(setNavigation(user.menuGraph))
        

        /*
        Set User Data
         */
        let shortcuts = [];
        user.menuGraph.forEach(function (item) {
            shortcuts = shortcuts.concat(findShortcut(item));
        })

        // dispatch({
        //     type: SET_USER_DATA,
        //     payload: user.base
        // })
        dispatch(updateUserData({ ...user, shortcuts }))

        const cachedDevice = localStorage.getItem('device');
        if (cachedDevice) {
            //register
            const device = JSON.parse(cachedDevice);
            console.log("cachedDevice=", device);
            graphqlService.mutate(MUTATION_REGISTER_DEVICE, { data: { ...device, userId: user._id, platform: "WEB" } }).then(() => {
                dispatch(showMessage({ message: "Đăng ký nhận thông báo thành công" }));
            })
        } else {
            console.log("not found cachedDevice");
        }
    }
}

/**
 * Update User Settings
 */
export function updateUserSettings(settings) {
    return (dispatch, getState) => {
        const oldUser = getState().auth.user;
        const user = _.merge({}, oldUser, { data: { settings } });

        updateUserData(user);

        return dispatch(setUserData(user));
    }
}

/**
 * Update User Shortcuts
 */
export function updateUserShortcuts(shortcuts) {
    return (dispatch, getState) => {
        const user = getState().auth.user;
        const newUser = {
            ...user,
            data: {
                ...user.data,
                shortcuts
            }
        };

        updateUserData(newUser);

        return dispatch(setUserData(newUser));
    }
}

/**
 * Remove User Data
 */
export function removeUserData() {
    return {
        type: REMOVE_USER_DATA
    }
}

/**
 * Logout
 */
export function logoutUser() {

    return (dispatch, getState) => {

        elsagaService.logout();
        dispatch(setInitialSettings());

        dispatch({
            type: USER_LOGGED_OUT
        })
        const pathname = history.location.pathname;
        if (!pathname.startsWith("/login")) {
            history.push({
                pathname: '/login'
            });
        }
    }
}

/**
 * Update User Data
 */
function updateUserData(userSetting) {
    // console.log("userSetting:", userSetting);
    return (dispatch) => dispatch({
        type: SET_USER_DATA,
        payload: userSetting
    })

}
