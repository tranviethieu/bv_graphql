import React, {  } from 'react';
import { IconButton, TextField, Icon, Tooltip, Typography, Avatar, FormGroup, MenuItem } from '@material-ui/core';
import { useForm } from '@fuse/hooks';
import Formsy from 'formsy-react';
import Button from '@material-ui/core/Button';
import moment from 'moment';

import PersonIcon from '@material-ui/icons/Person';
import PhoneIcon from '@material-ui/icons/Phone';
import EmailIcon from '@material-ui/icons/Email';
import CakeIcon from '@material-ui/icons/Cake';
import GenderIcon from '@material-ui/icons/SupervisorAccount'
import LocationIcon from '@material-ui/icons/PersonPinCircle'


const defaultFormState = {

    fullName: '',
    phoneNumber: '',
    email: '',
    avatar: 'assets/icons/integrate/icon-user-default.png',
    address: '',
    birthday: '',
    gender: '',
};
function UserProfile(props) {

    const { form, handleChange } = useForm(defaultFormState);

    return (
        <div style={{ width: '100%', minWidth:"360px", maxWidth: '100%', height: "100%", overflowY: "scroll" }} id = "el-UserProfile">
            <IconButton onClick={props.onClose} color="inherit" style={{float:"left", marginBottom:"-10px"}}>
                <Icon>close</Icon>
            </IconButton>
            <div className="max-w-sm" style={{ backgroundColor: "white", maxWidth: "360px", margin: "auto", marginTop: "40px", marginBottom: "60px", paddingBottom: "40px", boxShadow: "0 4px 8px 0 rgba(255, 255, 255, 0.3), 0 6px 20px 0 rgba(0, 0, 0, 0.19)", borderRadius: "3px" }}>
                <div style={{ width: "100%", backgroundColor: "#2980b9", display: "flex", borderRadius: "3px", margin: "auto", flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ textAlign: "left", width: '100%', display: 'flex', justifyContent: 'content', height: "50px" }}>
                        <Button className='btn-blue' variant="outlined" color="secondary" style={{ fontSize: "10px", color: "white", paddingLeft: "5px", paddingRight: "5px", height: "35px", marginTop: "10px", marginLeft: "20px" }}>
                            Tạo lịch khám
                    </Button>
                    </div>
                    <div style={{ textAlign: "center", width: '100%', display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                        <Avatar style={{ width: "120px", height: "120px", }} src={form.avatar ? form.avatar : "assets/icons/integrate/icon-user-default.png"}></Avatar>
                        <Typography gutterBottom style={{ color: "white", fontSize: "14px", marginTop: "10px" }}>{form.fullName ? form.fullName : "Phạm Văn Trọng"}</Typography>
                    </div>
                    <div style={{ textAlign: "right", width: '100%', display: 'flex', justifyContent: 'center', marginBottom: "15px" }}>
                        <Button onClick={e => {

                        }}>
                            <Tooltip title={"Gọi tư vấn trực tiếp"} placement="top" >
                                <img style={{ width: "30px", height: "30px", objectFit: "cover" }} src={'assets/icons/integrate/icon-ac-call.png'} alt="open right pannel"></img>
                            </Tooltip>
                        </Button>
                        <Button onClick={e => {

                        }}>
                            <Tooltip title={"Gửi email thông báo"} placement="top" >
                                <img style={{ width: "30px", height: "30px", objectFit: "cover" }} src={'assets/icons/integrate/icon-ac-email.png'} alt="open right pannel"></img>
                            </Tooltip>
                        </Button>
                        <Button onClick={e => {

                        }}>
                            <Tooltip title={"Gửi Notification"} placement="top" >
                                <img style={{ width: "30px", height: "30px", objectFit: "cover" }} src={'assets/icons/integrate/icon-ac-notif.png'} alt="open right pannel"></img>
                            </Tooltip>
                        </Button>
                    </div>
                </div>
                <div style={{ width: "100%", backgroundColor: "white", display: "flex", borderRadius: "3px", margin: "auto" }}>
                    <Formsy
                        // onValidSubmit={handleSubmit}
                        // onValid={enableButton}
                        // onInvalid={disableButton}
                        // ref={formRef}
                        className="flex flex-col justify-center"
                        style={{ width: "calc(100% - 20px)" }}
                    >
                        <FormGroup style={{ display: "flex", width: "100%", }}>
                            <div className="flex" style={{ marginTop: "20px" }}>
                                <div className="min-w-48 pt-20">
                                    <PersonIcon />
                                </div>

                                <TextField
                                    className="mb-20 h-45"
                                    label="Họ và tên"
                                    autoFocus
                                    id="fullName"
                                    name="fullName"
                                    value={form.fullName}
                                    onChange={handleChange}
                                    variant="outlined"
                                    required
                                    fullWidth
                                    margin="dense"
                                />
                            </div>
                            <div className="flex">
                                <div className="min-w-48 pt-20">
                                    <PhoneIcon />
                                </div>

                                <TextField
                                    className="mb-20 h-45"
                                    label="Số điện thoại"
                                    autoFocus
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    value={form.phoneNumber}
                                    onChange={handleChange}
                                    variant="outlined"
                                    required
                                    fullWidth
                                    margin="dense"
                                />
                            </div>
                            <div className="flex">
                                <div className="min-w-48 pt-20">
                                    <EmailIcon />
                                </div>
                                <TextField
                                    className="mb-20 h-45"
                                    label="Email"
                                    autoFocus
                                    id="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    variant="outlined"
                                    required
                                    fullWidth
                                    margin="dense"
                                />
                            </div>
                            <div className="flex">
                                <div className="min-w-48 pt-20">
                                    <CakeIcon />
                                </div>
                                <TextField
                                    className="mb-20 h-45"
                                    id="birthday"
                                    name="birthday"
                                    label="Ngày sinh"
                                    type="date"
                                    value={moment(form.birthday).format("YYYY-MM-DD")}
                                    onChange={handleChange}
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                    variant="outlined"
                                    fullWidth
                                    margin="dense"
                                />
                            </div>
                            <div className="flex">
                                <div className="min-w-48 pt-20">
                                    <GenderIcon />
                                </div>
                                <TextField
                                    id="gender"
                                    select
                                    label="Chọn giới tính"
                                    className="mb-20 h-45"
                                    value={form.gender}
                                    onChange={handleChange}
                                    // SelectProps={{
                                    //     MenuProps: {
                                    //         className: classes.menu,
                                    //     },
                                    // }}
                                    // helperText="Chọn giới tính"
                                    variant="outlined"
                                    margin="dense"
                                    fullWidth
                                >
                                    {[{ value: "Nam" }, { value: "Nữ" }].map(option => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.value}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </div>
                            <div className="flex">
                                <div className="min-w-48 pt-20">
                                    <LocationIcon />
                                </div>
                                <TextField
                                    className="mb-20 h-45"
                                    label="Địa chỉ"
                                    autoFocus
                                    id="address"
                                    name="address"
                                    value={form.address}
                                    onChange={handleChange}
                                    variant="outlined"
                                    required
                                    fullWidth
                                    multiline
                                    rows="2"
                                // margin="dense"
                                />
                            </div>
                            <div className="flex" style={{ justifyContent: "right", display: "block" }}>
                                <Button variant="contained" color="primary" style={{ float: "right" }}>
                                    Cập nhật
                                </Button>
                            </div>
                        </FormGroup>
                    </Formsy>
                </div>
            </div>
        </div >
    )
}

export default UserProfile;
