export const AUTH_TOKEN = 'auth-token'
export const PROFILE = 'profile'

export const GetLocalToken = () => {
    const tokenStr = localStorage.getItem(AUTH_TOKEN);
    try {
        if (tokenStr) {
            const token = JSON.parse(tokenStr);

            return token;
        }
    } catch (err) {
        console.log("getLocalToken error:" + JSON.stringify(err));
        localStorage.setItem(AUTH_TOKEN, undefined);
        //window.location.href='/login';
    }
}

export const GetProfile = () => {
    const profile = localStorage.getItem(PROFILE);
    if (profile) {
        return JSON.parse(profile);
    } else
        return {}
}

export const UpdateLocalToken = (token) => {
    localStorage.setItem(AUTH_TOKEN, JSON.stringify(token));
}

export const UpdateLocalSetting = (setting) => {
    const token = GetLocalToken();
    token.setting = setting;
    localStorage.setItem(AUTH_TOKEN, JSON.stringify(token));
}

export const SignOut = () => {
    console.log("signout from adminConstant");
    localStorage.setItem(AUTH_TOKEN, undefined);
    window.location.href = '/login';
}

//bat buoc phai co thuoc tinh nay de react-ndn,react-tag hoat dong
export const ItemTypes = {
    KNIGHT: 'knight'
};