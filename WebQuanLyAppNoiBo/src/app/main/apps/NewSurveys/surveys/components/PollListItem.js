import React, { useEffect, useState } from 'react';
import { Icon, TextField, ListItem, FormControl, InputLabel, NativeSelect, IconButton } from '@material-ui/core'
import { useForm, useUpdateEffect } from '@fuse/hooks'
import clsx from 'clsx';
import { uploadAvatar } from 'app/store/actions';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
    productImageUpload: {
        transitionProperty: 'box-shadow',
        transitionDuration: theme.transitions.duration.short,
        transitionTimingFunction: theme.transitions.easing.easeInOut,
    },
    productImageItem: {
        transitionProperty: 'box-shadow',
        transitionDuration: theme.transitions.duration.short,
        transitionTimingFunction: theme.transitions.easing.easeInOut,
        '&:hover': {
            '& $productImageFeaturedStar': {
                opacity: .8
            }
        }
    }
}));
function PollListItem(props) {
    const { onListItemChange, onListItemRemove, index, type } = props;
    const classes = useStyles(props);
    const { form, handleChange, setForm, setInForm } = useForm(props.poll);
    const [ lastIndex, setLastIndex ] = useState(-1)
    const [ hasChanged, setHasChanged ] = useState(false)

    function handleFormChange(e){
        setHasChanged(true)
        handleChange(e)
    }

    function handleUploadPollImage(e) {
        const file = e.target.files[0];
        console.log("File ảnh: ", e.target.files)
        if (!file) {
            return;
        }
        uploadAvatar(file).then(response => {
            if (response.data) {
                setForm({ ...form, image: response.data })
            }
        });
    }
    function removePollImage() {
        setInForm('image', null);
    }

    useEffect(() => {
        if(index !== lastIndex || form.value !== props.poll.value)
        {
            setLastIndex(index)
            setForm(props.poll)
        }
    }, [props.index, props.poll])

    return (
        type === "DROPDOWN" ?
            <ListItem className="flex flex-1 pl-16">
                <TextField
                    className="m-8 w-full"
                    label="Giá trị"
                    name="value"
                    value={form.value}
                    variant="standard"
                    onChange={e =>{
                            handleFormChange(e)
                        }}
                    // multiline
                    // rowsMax="3"
                    onKeyDown={e => {
                        if(e.keyCode == 13){
                            onListItemChange(form, index)
                            setHasChanged(false)
                         }
                    }}
                />
                <IconButton onClick={e => onListItemRemove(index)}>
                    <Icon>delete</Icon>
                </IconButton>
                {
                    hasChanged &&
                    <IconButton onClick={e => {
                        onListItemChange(form, index)
                        setHasChanged(false)
                    }}>
                        <Icon>save</Icon>
                    </IconButton>
                }
            </ListItem>
            :
            <ListItem className="flex flex-1 pl-16">
                <TextField
                    className="m-8 w-1/3"
                    label="Giá trị"
                    name="value"
                    value={form.value}
                    variant="standard"
                    onChange={e => handleFormChange(e)}
                />
                <FormControl className="m-8 w-1/3">
                    <InputLabel>Kiểu hiển thị</InputLabel>
                    <NativeSelect
                        className=""
                        name="display"
                        fullWidth
                        value={form.display}
                        defaultValue="TEXT"
                        onChange={e => handleFormChange(e)}
                    >
                        <option value="TEXT">Chỉ nhãn</option>
                        <option value="IMAGE">Chỉ hình ảnh</option>
                        <option value="TEXTIMAGE">Nhãn và hình ảnh</option>
                        <option value="OTHER">Ý kiến khác</option>
                    </NativeSelect>
                </FormControl>
                {
                    (form.display === "TEXT" || form.display === "TEXTIMAGE" || form.display === "OTHER") && <TextField
                        className="m-8 w-1/3"
                        label="Tiêu đề hiển thị"
                        name="label"
                        // value={form.label}
                        value={form.value}
                        variant="standard"
                        onChange={e => handleFormChange(e)}
                        disabled
                    />
                }
                {
                    (form.display === "IMAGE" || form.display === "TEXTIMAGE") && <React.Fragment>
                        <input
                            accept="image/*"
                            className="hidden"
                            id={form.value}
                            type="file"
                            onChange={handleUploadPollImage}
                        />
                        {
                            form.image === null ? <label
                                htmlFor={form.value}
                                className={
                                    clsx(
                                        classes.productImageUpload,
                                        "flex items-center justify-center relative w-48 h-48 rounded-4 mr-16 overflow-hidden cursor-pointer shadow-1 hover:shadow-5"
                                    )}
                            >

                                <Icon fontSize="large" color="action">cloud_upload</Icon>
                            </label> : <img onClick={removePollImage} className="max-w-none w-auto w-48 h-48" src={process.env.REACT_APP_FILE_PREVIEW_URL + form.image} alt="" />
                        }

                    </React.Fragment>
                }
                <IconButton onClick={e => onListItemRemove(index)}>
                    <Icon>delete</Icon>
                </IconButton>
                {
                    hasChanged &&
                    <IconButton onClick={e => {
                        onListItemChange(form, index)
                        setHasChanged(false)
                    }}>
                        <Icon>save</Icon>
                    </IconButton>
                }

            </ListItem>
    )
}
export default PollListItem;