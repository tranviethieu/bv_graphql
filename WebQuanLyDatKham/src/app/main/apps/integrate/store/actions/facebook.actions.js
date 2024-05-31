export const OPEN_FACEBOOK_LOGIN_SIDEBAR = '[FACEBOOK MODULES] OPEN FACEBOOK LOGIN SIDEBAR';
export const CLOSE_FACEBOOK_LOGIN_SIDEBAR = '[FACEBOOK MODULES] CLOSE FACEBOOK LOGIN SIDEBAR';
export const OPEN_FACEBOOK_CONNECT_SIDEBAR = '[FACEBOOK MODULES] OPEN FACEBOOK CONNECT SIDEBAR';
export const CLOSE_FACEBOOK_CONNECT_SIDEBAR = '[FACEBOOK MODULES] CLOSE FACEBOOK CONNECT SIDEBAR';
// export const OPEN_USER_SIDEBAR = '[FACEBOOK MODULES] OPEN USER SIDEBAR';
// export const CLOSE_USER_SIDEBAR = '[FACEBOOK MODULES] CLOSE USER SIDEBAR';
export const OPEN_MOBILE_FACEBOOK_LOGIN_SIDEBAR = '[FACEBOOK MODULES] OPEN MOBILE FACEBOOK LOGIN SIDEBAR';
export const CLOSE_MOBILE_FACEBOOK_LOGIN_SIDEBAR = '[FACEBOOK MODULES] CLOSE MOBILE FACEBOOK LOGIN SIDEBAR';
export const SET_FACEBOOK_LOGEDIN_USER = '[FACEBOOK MODULES] SET FACEBOOK LOGED IN USER'

export const SET_INTEGRATE_ID = '[INTEGRATE] SET INTEGRATE ID'


export function openMobileFacebookLoginSidebar() {
    return {
        type: OPEN_MOBILE_FACEBOOK_LOGIN_SIDEBAR
    }
}

export function closeMobileFacebookLoginSidebar() {
    return {
        type: CLOSE_MOBILE_FACEBOOK_LOGIN_SIDEBAR
    }
}

export function openFacebookLoginSidebar() {
    return {
        type: OPEN_FACEBOOK_LOGIN_SIDEBAR
    }
}

export function closeFacebookLoginSidebar() {
    return {
        type: CLOSE_FACEBOOK_LOGIN_SIDEBAR
    }
}

export function openFacebookConnectSidebar() {
    return {
        type: OPEN_FACEBOOK_CONNECT_SIDEBAR
    }
}

export function closeFacebookConnectSidebar() {
    return {
        type: CLOSE_FACEBOOK_CONNECT_SIDEBAR
    }
}
export function setFacebookLogedInUser(value) {
    return {
        type: SET_FACEBOOK_LOGEDIN_USER,
        value
    }
}
export function setIntegreateId(value){
    return {
        type: SET_INTEGRATE_ID,
        value
    }
}