import React from 'react';
import {Paper, Chip, Typography, TextField, MenuItem} from '@material-ui/core';
import {emphasize} from '@material-ui/core/styles/colorManipulator';
import CreatableSelect from 'react-select/lib/Creatable';
import Select from 'react-select';
import clsx from 'clsx';
import {makeStyles} from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
    root            : {
        '& .fuse-chip-select__input': {
            color: theme.palette.text.primary
        },
        '&.standard'                : {
            '& $placeholder'   : {},
            '& $valueContainer': {
                paddingTop: 4
            }
        },
        '&.filled'                  : {
            '& $placeholder'   : {
                left: 12
            },
            '& $valueContainer': {
                paddingTop : 24,
                paddingLeft: 12
            },
            '& $chip'          : {
                border: '1px solid rgba(0, 0, 0, 0.12)'
            }
        },
        '&.outlined'                : {
            '& $placeholder'   : {
                left: 12
            },
            '& $valueContainer': {
                paddingLeft: 12,
                // paddingTop : 12
            }
        }
    },
    input           : {
        display: 'flex',
        padding: 0,
        height : 'auto'
    },
    valueContainer  : {
        display      : 'flex',
        flexWrap     : 'wrap',
        flex         : 1,
        alignItems   : 'center',
        paddingBottom: 4,
        paddingTop   : 12,
        minHeight    : 40
    },
    dense  : {
        display      : 'flex',
        flexWrap     : 'wrap',
        flex         : 1,
        alignItems   : 'center',
        minHeight    : 40,
        paddingLeft  : 12,
    },
    chip            : {
        margin: '4px 4px 4px 0'
    },
    chipFocused     : {
        backgroundColor: emphasize(
            theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
            0.08
        )
    },
    noOptionsMessage: {
        paddingLeft  : 12,
        // padding: `${theme.spacing()}px ${theme.spacing(2)}px`
    },
    singleValue     : {
        fontSize: 16
    },
    placeholder     : {
        position: 'absolute',
        left    : 0,
        fontSize: 16,
        margin  : 0
    },
    paper           : {
        position : 'absolute',
        zIndex   : 4,
        marginTop: theme.spacing(),
        left     : 0,
        right    : 0
    },
    divider         : {
        height: theme.spacing(2)
    }
}));

function NoOptionsMessage(props)
{
    const classes = useStyles();

    return (
        <Typography
          color="textSecondary"
          className={classes.noOptionsMessage}
          {...props.innerProps}
        >
          {props.children}
        </Typography>
    );
}

function inputComponent({inputRef, ...props})
{
    return <div ref={inputRef} {...props} />;
}

function Control(props)
{
    const classes = useStyles();

    return (
        <TextField
          fullWidth
          className={clsx(classes.root, props.selectProps.textFieldProps.variant)}
          InputProps={{
            inputComponent,
            inputProps: {
              className: classes.input,
              inputRef : props.innerRef,
              children : props.children,
              ...props.innerProps
            }
          }}
          {...props.selectProps.textFieldProps}
        />
    );
}

function Option(props)
{
    return (
        <MenuItem
          buttonRef={props.innerRef}
          selected={props.isFocused}
          component="div"
          style={{
            // opacity: props.isDisabled ? 220 : 110,
            color: props.isDisabled ? "#999" : "#000",
            fontWeight: props.isSelected ? 600 : 400
          }}
          {...props.innerProps}
        >
            {props.children}
        </MenuItem>
    );
}

function Placeholder(props)
{
    const classes = useStyles();

    return (
        <Typography
            color="textSecondary"
            className={classes.placeholder}
            {...props.innerProps}
        >
            {props.children}
        </Typography>
    );
}

function SingleValue(props)
{
    const classes = useStyles();

    return (
        <Typography style={{ color: props.isDisabled ? "#999" : "#000", }} className={classes.singleValue} {...props.innerProps}>
            {props.children}
        </Typography>
    );
}

function ValueContainer(props)
{
    const classes = useStyles();
    return <div className={props.selectProps.margin === "dense" ? classes.dense : classes.valueContainer}>{props.children}</div>;
}

function MultiValue(props)
{
    const classes = useStyles();

    return (
        <Chip
          tabIndex={-1}
          label={props.children}
            className={clsx(classes.chip, {
                [classes.chipFocused]: props.isFocused
            }, props.data.class)}
            onDelete={event => {
                props.removeProps.onClick();
                props.removeProps.onMouseDown(event);
            }}
        />
    );
}

function Menu(props)
{
    const classes = useStyles();

    return (
        <Paper square className={classes.paper} {...props.innerProps}>
            {props.children}
        </Paper>
    );
}

const components = {
    Control,
    Menu,
    MultiValue,
    NoOptionsMessage,
    Option,
    Placeholder,
    SingleValue,
    ValueContainer
};

function FuseChipSelect(props)
{
    return (
        props.variant === 'fixed' ? (
            <Select
              classNamePrefix="fuse-chip-select"
              noOptionsMessage = {() => "Không có mục nào"}
              placeholder={props.placeholder ? props.placeholder : "Chọn..."}
              {...props}
              components={components}
            />
        ) : (
            <CreatableSelect
              classNamePrefix="fuse-chip-select"
              noOptionsMessage = {() => "Không có mục nào"}
              placeholder={props.placeholder ? props.placeholder : "Chọn..."}
              {...props}
              components={components}
            />
        )
    );
}

export default React.memo(FuseChipSelect);
