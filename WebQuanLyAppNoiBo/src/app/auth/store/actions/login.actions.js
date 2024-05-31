import elsagaService from 'app/services/elsagaService';
import { loadUserData,setUserData,logoutUser } from './user.actions';
import { QUERY_VERIFY_TOKEN } from './query';
import graphqlService from 'app/services/graphqlService';
import history from '@history';
import moment from 'moment';

export const LOGIN_ERROR = 'LOGIN_ERROR';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';

export function submitLogin({ email, password }) {
    return (dispatch) =>
        elsagaService.signInWithEmailAndPassword(email, password)
            .then((user) => {
                dispatch(loadUserData());

                return dispatch({
                    type: LOGIN_SUCCESS
                });
            }
            )
            .catch(error => {
                return dispatch({
                    type: LOGIN_ERROR,
                    payload: error
                });
            });
}
///hàm này dữ liệu tương tự submitLogin bên trên tuy nhiên dùng token được chuyển hướng từ hệ thống khác đẩy sang
export function verifyToken(token) {
    return (dispatch) =>
        graphqlService.query(QUERY_VERIFY_TOKEN, { token }, dispatch).then(response => {
            //chỗ này thành công thì còn phải lưu tiếp vào localStorage 
            localStorage.setItem('access_token', token);
            const expires_at = moment().add(1, 'days').toDate();
            localStorage.setItem('expires_at', expires_at);
            dispatch(setUserData(response && response.data));
            // console.log("current path:", history.location.pathname);
            //neu dang o trang login thi day ra desktop
            if (history.location.pathname.startsWith('/login'))
                // history.push("/");
                window.location.href = '/'
        }, (error) => dispatch(logoutUser())
        )
}
