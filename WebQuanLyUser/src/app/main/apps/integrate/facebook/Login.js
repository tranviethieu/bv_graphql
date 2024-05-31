import React, { useState } from 'react';
import { showMessage } from 'app/store/actions';
import { useDispatch } from 'react-redux';
import FacebookLogin from 'react-facebook-login';
import axios from 'axios';
import { Button, Typography } from '@material-ui/core';
import { FuseChipSelect } from '@fuse';

function Login(props) {
    const dispatch = useDispatch();
    const [user, setUser] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState(null);
    function componentClicked(e) {
        console.log("componentCLicked:", e);

    }
    function responseFacebook(e) {
        console.log("responseFacebook:", e);
        setUser(e);
        loadPages(e.userID, e.accessToken);
    }
    function loadPages(userID, access_token) {
        axios.get(`https://graph.facebook.com/me/accounts?access_token=${access_token}`).then(response => {
            console.log("pages data:", response.data);
            setAccounts(response.data.data);
        })
    }
    function onAccountChange(page) {
        dispatch(showMessage({ message: `Bạn đã lựa chọn theo dõi trang:${page.label}` }));
        setSelectedAccount(page);
        loadSubscribe(page);
    }
    function loadSubscribe(page) {
        var urlCheck = `https://graph.facebook.com/${page.value}/subscribed_apps?access_token=${page.access_token}`;
        axios.get(urlCheck).then(response => {
            console.log("subscribed:", response.data);
            setSelectedAccount({ ...page, subscribed_fields:response.data.data.length>0&& response.data.data[0].subscribed_fields })
        })
    }
    function subscribePage() {

        var url = `https://graph.facebook.com/v5.0/${selectedAccount.value}/subscribed_apps?subscribed_fields=feed, messages`;
        axios.post(url, `access_token=${selectedAccount.access_token}`).then(response => {
            if (response.data && response.data.success) {
                dispatch(showMessage({ message: `Thiết lập theo dõi trang ${selectedAccount.label} thành công` }));
                loadSubscribe(selectedAccount);
            }
        });

    }
    function removeSubscribe() {
        var url = `https://graph.facebook.com/v5.0/${selectedAccount.value}/subscribed_apps?access_token=${selectedAccount.access_token}`;
        axios.delete(url).then(response => {
            if (response.data && response.data.success) {
                dispatch(showMessage({ message: `Bỏ thiết lập theo dõi trang ${selectedAccount.label} thành công` }));
                loadSubscribe(selectedAccount);
            }
        });
    }

    return (
        <div className="p-16 sm:p-24 justify-center text-center" id = "el-Integrate-Login">
            <FacebookLogin
                appId="1515131395301241"
                autoLoad={true}
                fields="name,email,picture"
                scope="manage_pages,pages_messaging"
                onClick={componentClicked}
                callback={responseFacebook} />

            {
                accounts && accounts.length > 0 && <FuseChipSelect
                    className="mt-8 mb-24"
                    value={
                        selectedAccount
                    }
                    onChange={(value) => { onAccountChange(value) }}
                    placeholder="Chọn trang quản trị"
                    textFieldProps={{
                        label: 'Trang quản trị',
                        InputLabelProps: {
                            shrink: true
                        },
                        variant: 'outlined'
                    }}
                    options={accounts.map(item => ({ label: item.name, value: item.id, access_token: item.access_token }))}
                    isMulti={false}
                />
            }
            {
                selectedAccount && <div>
                    {
                        selectedAccount && selectedAccount.subscribed_fields ?
                            <div>
                                <Button variant="contained" color="secondary" onClick={removeSubscribe}>
                                    Bỏ theo dõi trang {selectedAccount.label} ?
                                </Button>
                                <div className="w-full">
                                    <Typography>Trang {selectedAccount.label} hiện đang được theo dõi với các quyền:</Typography>
                                    <div>
                                        {selectedAccount.subscribed_fields.map(field => <span key={field} className="p-2">{field}</span>)}
                                    </div>
                                </div>
                            </div>
                            :
                            <Button variant="contained" color="primary" onClick={subscribePage}>
                                Theo dõi trang {selectedAccount.label} ?
                            </Button>
                    }
                </div>
            }
        </div>
    )
}
export default Login;
