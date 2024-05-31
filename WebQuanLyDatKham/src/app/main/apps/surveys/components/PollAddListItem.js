import React, { } from 'react';
import { Icon, TextField, ListItem, FormControl, InputLabel, NativeSelect, Fab, IconButton } from '@material-ui/core'
import { useForm } from '@fuse/hooks'
import clsx from 'clsx';
import { uploadFile } from 'app/store/actions';
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

function PollAddListItem(props) {
    const classes = useStyles(props);
    const { type } = props;
    const { form, handleChange, resetForm, setInForm } = useForm({ value: '', display: "TEXT" });

    function handleUploadPollImage(e) {
        const file = e.target.files[0];
        if (!file) {
            return;
        }
        uploadFile(file).then(response => {
            if (response.data) {
                setInForm('image', response.data);
            }
        });
    }
    function isFormInValid() {
        return form.value === '';
    }
    function removePollImage() {
        setInForm('image', null);
    }
    function handleSubmit(ev) {
        ev.preventDefault();
        if (isFormInValid()) {
            return;
        }
        // console.log("update from: ", { ...form, otherAnswer: "", other: true, image: null, label: null })
        if (form.display === "OTHER") {
            props.onListItemAdd({ ...form, otherAnswer: "", other: true, image: null, label: null })
            resetForm()
        } else {
            props.onListItemAdd(form);
            resetForm();
        }
    }
    return (
        <form onSubmit={handleSubmit}>
          {
            type === "DROPDOWN" ?
              <ListItem className="flex flex-1 pl-16">
                <TextField
                  className="m-8 w-full"
                  label="Giá trị"
                  name="value"
                  value={form.value}
                  variant="standard"
                  onChange={handleChange}
                  // multiline
                  // rowsMax="3"
                />
                <IconButton
                  disabled={isFormInValid()}
                type="submit">
                  <Icon>save</Icon>
                </IconButton>

              </ListItem>
            :
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
                  defaultValue="TEXT"
                  onChange={handleChange}
                >
                  <option value="TEXT">Chỉ nhãn</option>
                  <option value="IMAGE">Chỉ hình ảnh</option>
                  <option value="TEXTIMAGE">Nhãn và hình ảnh</option>
                  <option value="OTHER">Ý kiến khác</option>
                </NativeSelect>
              </FormControl>
              {
                (form.display === "TEXT" || form.display === "TEXTIMAGE") && <TextField
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
              {(form.display === "OTHER") && <TextField
                className="m-8 w-1/3"
                label="Tiêu đề hiển thị"
                name="label"
                value={form.value}
                variant="standard"
                onChange={handleChange}
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
                    form.image == null ? <label
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
              <IconButton
                disabled={isFormInValid()}
              type="submit">
                <Icon>save</Icon>
              </IconButton>

            </ListItem>
            }
        </form>
    )
}
export default PollAddListItem;
