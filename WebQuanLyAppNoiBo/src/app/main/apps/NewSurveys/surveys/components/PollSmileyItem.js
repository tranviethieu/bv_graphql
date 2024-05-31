import React from 'react';
import { Icon, TextField, ListItem, FormControl, InputLabel, NativeSelect, IconButton } from '@material-ui/core'
import { useForm,useUpdateEffect } from '@fuse/hooks'
// import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
const listIcon = [
    "/assets/images/emoji/angry.png",
    "/assets/images/emoji/mad.png",
    "/assets/images/emoji/bored-2.png",
    "/assets/images/emoji/confused.png",
    "/assets/images/emoji/happy.png",
    "/assets/images/emoji/happy-2.png",
    "/assets/images/emoji/suspicious-1.png",
    "/assets/images/emoji/sad.png",
    "/assets/images/emoji/in-love.png",
    "/assets/images/emoji/smiling.png"
];
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
function PollSmileyItem(props) {
    const { onListItemChange, onListItemRemove,index } = props;
    // const classes = useStyles(props);
    const { form, handleChange, setForm, setInForm } = useForm(props.poll);

    useUpdateEffect(() => {
        onListItemChange(form, index);
    }, [form, index, onListItemChange]);

    function handleChangeImage(item){
        setInForm('image', item)
    }
    return (
        <ListItem className="flex flex-1 pl-16">
            <span>
                {
                    listIcon.map((item, id)=>
                        <img key={id} src = {item} width = "25px" className = "mr-2" onClick={()=>handleChangeImage(item)} alt=""/>
                    )
                }
            </span>
            <TextField
                className="m-8 w-1/3"
                label="Giá trị"
                name="value"
                value={form.value}
                variant="standard"
                onChange={handleChange}
            />
            <FormControl className="m-8 w-1/3">
                <InputLabel>Kiểu hiển thị</InputLabel>
                <NativeSelect
                    className=""
                    name="display"
                    fullWidth
                    value={form.display}
                    defaultValue="IMAGE"
                    onChange={handleChange}
                >
                    <option value="IMAGE">Chỉ hình ảnh</option>
                    <option value="TEXTIMAGE">Nhãn và hình ảnh</option>
                </NativeSelect>
            </FormControl>
            {
                (form.display === "TEXTIMAGE") && <TextField
                    className="m-8 w-1/3"
                    label="Tiêu đề hiển thị"
                    name="label"
                    // value={form.label}
                    value={form.value}
                    variant="standard"
                    onChange={handleChange}
                    disabled
                />
            }
            <img src = {form.image} className = "mr-2" width ="5%" alt=""/>
            <IconButton onClick={e=> onListItemRemove(index)}>
                <Icon>delete</Icon>
            </IconButton>

        </ListItem>
    )
}
export default PollSmileyItem;