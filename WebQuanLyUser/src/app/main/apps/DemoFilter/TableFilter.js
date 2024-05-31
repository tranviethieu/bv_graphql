import React, { useState, useEffect } from 'react';
import { Icon, Typography, FormControlLabel, Checkbox, Input, Paper, Button, ButtonGroup, Popper, Grow, Menu, MenuItem, ClickAwayListener, FormGroup, InputLabel, Select, OutlinedInput } from '@material-ui/core';
import { useForm } from '@fuse/hooks';
import _ from 'lodash';
import { FuseChipSelect, UploadFileForm, AdvanceEditor } from '@fuse';
import { ArrowDropDown, Search, ExpandMore, ExpandLess, Refresh } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import moment from 'moment';
const useStyles = makeStyles(theme => ({
  paper: {
    display: 'flex',
    width: 56
  },
  menu: {
    zIndex: 999,
    width: 350
  },
  textSearch: {
    width: 300,
    background: "white",
    color: "black",
    paddingLeft: "5px",
  }
}))


export default function ({ searchOption, filterOption, menuOption, fieldOption, exportOption, customElements, createOption, className, ...props }) {
  const classes = useStyles(props);
  const [searchText, setSearchText] = useState('');
  const [open, setOpen] = useState(false);
  const anchorRef = React.useRef(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { form, handleChange, setForm, setInForm } = useForm({});
  useEffect(() => {

    if (filterOption && filterOption.attributes) {
      filterOption.attributes.forEach(function (att) {
        if (!form[att.name] && att.defaultValue)
          form[att.name] = att.defaultValue
      })
    }
  }, [filterOption]);

  const handleClose = event => {
    if (event && anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };
  function handleChipChange(value, name) {
    if (Array.isArray(value)) {
      setForm(_.set({ ...form }, name, value.map(v => v.value)));
    } else
      setForm(_.set({ ...form }, name, value.value));



  }
  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen);
  };

  const handleClickMenuAction = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenuAction = () => {
    setAnchorEl(null);
  };
  function resetForm() {
    setForm({});
  }
  function onSubmit() {
    handleClose();
    if (filterOption.onSubmitFilter) {
      //chú ý chỉ submit những form nào hiện thuộc tính
      let omit = [];
      omit = filterOption.attributes && filterOption.attributes.filter(item => item.displayOption && !item.displayOption(form)).map(a => a.name);

      filterOption.onSubmitFilter(_.omit(form, omit));
    }
  }
  return (
    <div className={className} style={{ backgroundColor: "white" }}>
      <ButtonGroup variant="contained" color="primary" aria-label="table filter">

        {
          searchOption &&
          <div>
            <Input
              style={{ height: "100%" }}
              placeholder="Từ khóa..."
              className={classes.textSearch}
              disableUnderline
              inputProps={{
                'aria-label': 'Search'
              }}
              onChange={e => setSearchText(e.target.value)}
              onKeyPress={e => {
                if (e.charCode === 13)
                  searchOption.onTextSearch && searchOption.onTextSearch(searchText);

              }}
              value={searchText}
            />
            {
              !searchOption.hideButton &&
              <Button
                className="normal-case"
                variant="contained"
                onClick={() => searchOption.onTextSearch(searchText)}
              >
                <Icon className="mr-4">search</Icon>
                Tìm kiếm
              </Button>
            }

          </div>
        }
        {
          filterOption && <Button
            color="default"
            size="small"
            aria-controls={open ? 'split-button-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-label="select merge strategy"
            aria-haspopup="menu"
            ref={anchorRef}
            onClick={handleToggle}
          >
            <ArrowDropDown className="text-black" />
          </Button>
        }
        {
          menuOption &&
          <div>

            <Button onClick={handleClickMenuAction} endIcon={anchorEl ? <ExpandLess /> : <ExpandMore />} >Tác vụ</Button>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'center'
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleCloseMenuAction}
            >
              <MenuItem>Nhập từ file excel</MenuItem>
              <MenuItem>Xuất dữ liệu</MenuItem>
            </Menu>
          </div>
        }

        {
          fieldOption && <Button
            className="normal-case"
            variant="contained"
          >
            <Icon className="mr-4">refresh</Icon>
            Trường hiển thị
          </Button>
        }
        {
          exportOption &&
          <Button
            className="normal-case"
            variant="contained"
          >
            <Icon className="mr-4">cloud_download</Icon>
            Xuất dữ liệu
          </Button>
        }
        {
          createOption &&
          <Button
            className="normal-case"
            variant="contained"
            onClick={createOption.onClick}
          >
            <Icon className="mr-4">add</Icon>
            {createOption.label || "Tạo"}
          </Button>
        }
        {
          customElements && customElements.map((element) => element)
        }

      </ButtonGroup>
      {
        filterOption && <Popper className={classes.menu} open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin: placement === 'bottom' ? 'left top' : 'left bottom',
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <form className="flex flex-col p-24">
                    {
                      filterOption.attributes && filterOption.attributes.map((att, index) =>
                        (!att.displayOption || att.displayOption(form)) && (
                          att.type && att.type === "select" ? (
                            <FuseChipSelect
                              key={index}
                              className="pt-16 w-full"
                              options={att.options}
                              onChange={(value) => handleChipChange(value, att.name)}
                              textFieldProps={{
                                label: att.label,
                                InputLabelProps: {
                                  shrink: true
                                },
                                variant: 'outlined'
                              }}
                              value={att.options && att.options.filter(option => ((att.isMulti && form[att.name] && form[att.name].includes(option.value)) || form[att.name] === option.value))}
                              isMulti={att.isMulti}
                            />
                          ) :
                            att.type === "files" ?
                              (
                                <FormGroup className="pt-16 w-full" variant="outlined" key={index}>
                                  <InputLabel>{att.label}</InputLabel>
                                  <UploadFileForm
                                    maxFiles={10}
                                    allowMultiple={true}
                                    server={process.env.REACT_APP_UPLOADURL}
                                    onUpdateFiles={(serverIds) => setInForm(att.name, serverIds)}
                                  />
                                </FormGroup>
                              ) :
                              att.type === "editor" ?
                                (
                                  <FormGroup className="pt-16 w-full" variant="outlined" key={index}>
                                    <InputLabel>{att.label}</InputLabel>
                                    <AdvanceEditor
                                      onChange={content => setInForm(att.name, content)}
                                      content={form[att.name] || att.defaultValue || ''}
                                    />
                                  </FormGroup>
                                )
                                :
                                att.type === 'checkbox' ?
                                  (
                                    <FormControlLabel label={att.label}
                                      control={<Checkbox
                                        checked={form[att.name] || false}
                                        onChange={(e) => setInForm(att.name, e.target.checked)}
                                      />}
                                    />
                                  )
                                  :
                                  (
                                    <FormGroup className="pt-16 w-full" variant="outlined" key={index}>
                                      <InputLabel>{att.label}</InputLabel>
                                      {
                                        att.type === "date" ?
                                          (<OutlinedInput label={att.label} id={att.name} name={att.name} type={att.type} defaultValue={att.defaultValue} value={moment(form[att.name]).format("YYYY-MM-DD")} onChange={handleChange} />)
                                          :
                                          (<OutlinedInput id={att.name} name={att.name} type={att.type} defaultValue={att.defaultValue} value={form[att.name]} onChange={handleChange} step={att.step} />)
                                      }
                                    </FormGroup>
                                  )
                        )
                      )}

                    <FormGroup className="pt-16 flex">
                      <Button color="secondary" onClick={onSubmit} startIcon={<Search />}>Tìm kiếm</Button>
                      <Button color="secondary" onClick={resetForm} startIcon={<Refresh />}>Làm lại</Button>
                    </FormGroup>
                  </form>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      }
    </div>
  )
}
