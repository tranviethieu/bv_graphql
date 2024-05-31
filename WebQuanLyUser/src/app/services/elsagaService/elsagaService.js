import axios from 'axios';
import FuseUtils from '@fuse/FuseUtils';
import moment from 'moment';
import { showMessage } from 'app/store/actions/fuse';
import history from '@history';
//đối towngj này sử dụng thư viện của fuse là: EventEmitter nó sẽ có chứa hàm không đồng bộ : on ("eventName"); tương tự như cách sử dụng redux
class elsagaService extends FuseUtils.EventEmitter {
    //hàm khởi tạo , hàm này được gọi khi đối tượng elsagaService được import từ 1 file khác vd trang Auth.js
    //chú ý để code nó gọi vào hàm này còn cân thêm 1 điều kiện khai báo nữa ở cuối file này const instance = new elsagaService(); thay vì export default elsagaService
    init() {
        //check xem phiên hiện tại có đang ở trạng thái đăng nhập không
        this.handleAuthentication();
    }
    handleResponse = (result, dispatch) => {

        return new Promise((resolve, reject) => {

            if (result.data.response) {
                if (result.data.response.code === 0) {
                    resolve(result.data.response);
                } else {
                    reject(result.data.response);

                    if (result.data.response.code === 2) {
                        //day ra trang login
                        if (dispatch) {
                            dispatch(showMessage({ message: "Bạn không có quyền truy cập chức năng này hoặc phiên truy cập đã kết thúc" }));
                        }
                        if (!history.location.pathname.startsWith("/login")) {
                            history.push(`/login?redirect=${history.location.pathname}`);
                        } else
                            history.push('/login');
                    } else if (dispatch) {
                        dispatch(showMessage({ message: result.data.response.message }));
                    }
                }
            } else {
                reject(result.data);
                dispatch(showMessage({ message: "Cấu trúc truy vấn chưa đúng định dạng" }))
            }
        })

    }
    //check phiên đăng nhập hiện tại thông qua check access_token và expires_at được lưu trong bộ nhớ trong: localStorage
    handleAuthentication = () => {
        let access_token = this.getAccessToken();
        let expires_at = this.getExpiresAt();
        if (!access_token || access_token == null || access_token === '' || expires_at < new Date()) {
            //nếu access_token không tồn tại chứng tỏ user chưa đăng nhập --> ta xóa toàn bộ thông tin trong localStorage và gửi lệnh logout ra ngoài
            this.setSession(null);//xóa localStorage
            this.emit('onAutoLogout', 'Vui lòng đăng nhập để sử dụng hệ thống');//gửi lệnh logout
        } else {
            this.emit('onAutoLogin', true);
        }
    };

    signInWithEmailAndPassword = (email, password) => {
        return new Promise((resolve, reject) => {
            const params = {
                'grant_type': process.env.REACT_APP_GRANT_TYPE,
                'username': email,
                'password': password,
                'client_secret': process.env.REACT_APP_CLIENT_SECRET,
                'client_id': process.env.REACT_APP_CLIENT_ID,
                'scope': process.env.REACT_APP_SCOPE
            };
            // const formData = new FormData();

            // for (let p in params) {
            //     formData.append(p, params[p]);
            // }
            let formBody = [];
            for (let p in params) {
                var encodedKey = encodeURIComponent(p);
                var encodedValue = encodeURIComponent(params[p]);
                formBody.push(encodedKey + "=" + encodedValue);
            }
            formBody = formBody.join("&");
            console.log("formbody=", formBody);
            const request = {
                method: 'POST',
                body: formBody,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                },
            };
            fetch(`${process.env.REACT_APP_API_LOGIN}`, request)
                .then(res => {
                    if (res.ok) {
                        return res.json();
                    } else {
                        reject(`Request rejected with status ${res.status}`);
                        this.setSession(null);//xóa localStorage
                        this.emit('onAutoLogout', 'Sai tên đăng nhập hoặc mật khẩu')
                    }
                })
                .then((data) => {
                    this.setSession(data);
                    resolve(data)
                })
                .catch((error) => {
                    console.log(error);
                });
        });
    };

    signInWithToken = () => {
        return new Promise((resolve, reject) => {
            axios.get('/api/auth/access-token', {
                data: {
                    access_token: this.getAccessToken()
                }
            })
                .then(response => {
                    if (response.data.user) {
                        this.setSession(response.data.access_token);
                        resolve(response.data.user);
                    }
                    else {
                        reject(response.data.error);
                    }
                });
        });
    };

    updateUserData = (user) => {
        // return axios.post('/api/auth/user/update', {
        //     user: user
        // });
        //chỗ này sẽ thay lại = GraphQL
    };

    setSession = data => {
        if (data && data.access_token) {
            localStorage.setItem('access_token', data.access_token);
            var expires_at = moment().add(data.expires_in, 'seconds').toDate();
            localStorage.setItem('expires_at', expires_at);
        }
        else {
            localStorage.removeItem('access_token');
            localStorage.removeItem('expires_at');
        }
    };

    logout = () => {
        this.setSession(null);
    };


    getAccessToken = () => {
        return window.localStorage.getItem('access_token');
    };
    getExpiresAt = () => {
        return window.localStorage.getItem("expires_at");
    }
}
//new instance nhằm gọi hàm init
const instance = new elsagaService();

export default instance;
