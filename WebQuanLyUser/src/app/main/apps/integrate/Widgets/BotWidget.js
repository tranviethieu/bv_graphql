import React, { useEffect } from 'react';
import { useForm } from '@fuse/hooks'
import { Button, Checkbox, TextField } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import * as Actions from "../store/actions";
import { showMessage } from 'app/store/actions/fuse';


const initialData = {
    enabled: false,
    image_url: "https://api.telehub.elsaga.net/images/hospital-building.jpg",
    title: "ĐẶT KHÁM QUA WEB",
    subtitle: "Truy cập trang đặt khám của bệnh viện để xem thêm",
    website: "http://telehub-ui.elsaga.net",
}

function BotWidget({ channel,updateChange }) {
    const dispatch = useDispatch();
    const { form, setForm, handleChange } = useForm(initialData);
    useEffect(() => {
        if (channel && channel.botOption) {
            setForm(channel.botOption);
        }
    }, [channel, setForm])

    function onSave() {
        Actions.saveBotTemplate(channel._id, form).then(response => {
            dispatch(showMessage({ message: "Cập nhật thành công" }));
            setForm(response.data);
            if (updateChange) {
                updateChange({ ...channel, botOption: form });
            }
        })
    }
    return (
        <div className="p-24 w-full" style={{maxWidth:550}} id = "el-integrate-BotWidget">
            <div className="mb-16">
                <Checkbox checked={form.enabled} onChange={handleChange} name="enabled" />
                <label>Đặt khám tự động</label>
            </div>
            <TextField
                name="title"
                value={form.title}
                label="Tiêu đề trang web"
                onChange={handleChange}
                fullWidth
                variant="outlined"
                className="mb-16"
            />
            <TextField
                name="subtitle"
                value={form.subtitle}
                label="Mô tả trang web"
                onChange={handleChange}
                className="mb-16"
                fullWidth
                variant="outlined"
            />
            <TextField
                name="website"
                value={form.website}
                label="Link web giới thiệu"
                onChange={handleChange}
                fullWidth
                variant="outlined"
                className="mb-16"
            />
            <TextField
                name="image_url"
                value={form.image_url}
                label="Link ảnh giới thiệu"
                onChange={handleChange}
                fullWidth
                variant="outlined"
                className="mb-16"
            />

            <Button variant="contained" color="primary" onClick={onSave}>
                Lưu
            </Button>
        </div>

    )
}
export default BotWidget;
