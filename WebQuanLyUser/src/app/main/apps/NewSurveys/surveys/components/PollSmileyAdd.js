import React, { } from 'react';
import { Icon, TextField, ListItem, FormControl, InputLabel, NativeSelect, Fab } from '@material-ui/core'
import { useForm } from '@fuse/hooks'
// import { makeStyles } from '@material-ui/styles';

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
function PollSmileyAdd(props) {
    // const classes = useStyles(props);
    const { form, handleChange, resetForm,setInForm } = useForm({value:'', display: "IMAGE", image: "/assets/images/emoji/angry.png"});
    function isFormInValid()
    {
        return form.value === '';
    }
    function handleSubmit(ev)
    {
        ev.preventDefault();
        if ( isFormInValid() )
        {
            return;
        }
        props.onListItemAdd(form);
        resetForm();
    }
    function handleChangeImage(item){
        setInForm('image', item)
    }
    return (
        <form onSubmit={handleSubmit}>
            <div>
                {
                    listIcon.map((item, id)=>
                        <img key={id} src = {item} width = "3%" className = "mr-2" onClick={()=>handleChangeImage(item)} alt=""/>
                    )
                }
            </div>
            <ListItem className="flex flex-1 pl-16">

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
                    ( form.display === "TEXTIMAGE") && <TextField
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
                <Fab
                    className="ml-16"
                    aria-label="Add"
                    size="small"
                    color="primary"
                    type="submit"
                    disabled={isFormInValid()}
                >
                    <Icon>save</Icon>
                </Fab>

            </ListItem>
        </form>
    )
}
export default PollSmileyAdd;