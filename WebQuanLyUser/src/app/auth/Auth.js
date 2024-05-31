import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as userActions from 'app/auth/store/actions';
import { bindActionCreators } from 'redux';
import * as Actions from 'app/store/actions';
import { loadUserData } from './store/actions/user.actions'
import elsagaService from 'app/services/elsagaService';//dòng lệnh này sẽ gọi hàm init trong file elsagaService.js
import usePushNotifications from "../pushnotify/usePushNotification";
import history from '@history';

//chúng ta sẽ xử lý chuyển hướng khi chưa login và xử lý notify trong hàm này
const whitelistAuth = ["/login", "/apps/do-survey"]

export default function Auth(props) {
    const dispatch = useDispatch();
    const userData = useSelector(({auth}) => auth.user.data);
    const {
        userConsent,
        pushNotificationSupported,
        userSubscription,
        onClickAskUserPermission,
        onClickSusbribeToPushNotification,
        onClickSendSubscriptionToPushServer,
        pushServerSubscriptionId,
        onClickSendNotification,
        error,
        loading
    } = usePushNotifications();
    const authenCheck = () => {
        //cách viết này tương tự như redux --> chắc là vẫn dùng redux chẳng qua nó đóng gói trong thư viện FuseUtil
        elsagaService.on('onAutoLogout', (message) => {
            if (message) {
                // this.props.showMessage({ message });
                dispatch(Actions.showMessage({ message }))
            }
            dispatch(userActions.logoutUser());
        });
        elsagaService.on("onAutoLogin", () => {
            // this.props.showMessage({ message: 'Đang cập nhật thông tin tài khoản' });
            dispatch(Actions.showMessage({ message: 'Đang cập nhật thông tin tài khoản' }))
            loadUserData();
        })
        elsagaService.init();
    }

    useEffect(() => {
        //ta chỉ check authen nếu như người dùng không ở trang login
        const pathname = window.location.pathname;
        let ischeck = true;
        whitelistAuth.forEach(item => {
            if (pathname.startsWith(item)) {
                ischeck = false;
                return;
            }
        })
        if(ischeck)
            authenCheck();
        
        // if (!history.location.pathname.startsWith('/login') && !userData.sub) {
        //     authenCheck();
        // }
    }, []);
    //check trạng thái login để đăng ký nhận push
    useEffect(() => {
        // console.log("user=",userData);
        if (userData.sub) {
            if (pushNotificationSupported) {
                // console.log("notification is supported with consent:", userConsent, userSubscription);
                if (userConsent !== "granted") {
                    onClickAskUserPermission();
                } else if (!userSubscription) {
                    onClickSusbribeToPushNotification();
                } else {
                    onClickSendSubscriptionToPushServer();
                }
            }
        }
    }, [pushNotificationSupported, userConsent, userSubscription, userData.sub]);
    const { children } = props;

    return (
        <React.Fragment>
            {/* <div>
                <p>Push notification are {!pushNotificationSupported && "NOT"} supported by your device.</p>
                <p>
                    User consent to recevie push notificaitons is <strong>{userConsent}</strong>.
                </p>
                <button onClick={onClickAskUserPermission}>Ask user permission</button>
            </div> */}
            {children}

        </React.Fragment>
    );

}

// function mapDispatchToProps(dispatch) {
//     return bindActionCreators({
//         logout: userActions.logoutUser,
//         setUserData: userActions.setUserData,
//         showMessage: Actions.showMessage,
//         hideMessage: Actions.hideMessage
//     },
//         dispatch);
// }

// export default connect(null, mapDispatchToProps)(Auth);
