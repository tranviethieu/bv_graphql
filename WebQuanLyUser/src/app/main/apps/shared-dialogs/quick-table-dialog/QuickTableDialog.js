import React, { useState, useEffect } from 'react';
import { FuseChipSelect, UploadFileForm, AdvanceEditor } from '@fuse';
import { useForm } from '@fuse/hooks';
import { Icon, Button, IconButton, FormGroup, Input, InputLabel, NativeSelect, Checkbox, FormControlLabel, Grid } from '@material-ui/core';
import ReactTable from 'react-table';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import { useDispatch } from 'react-redux';
import * as Actions from '../actions';
import _ from '@lodash';

export default function QuickTableDialog({ title, subtitle, columns, data, submit, ...props }) {            
    const dispatch = useDispatch();
    const handleClose = () => {

        dispatch(Actions.hideDialog('quick-table-dialog'));
    };
    
    return (
        <Card className={props.className}>
            <CardHeader className="el-CardHeader-FU"
                action={
                    <IconButton aria-label="settings" onClick={handleClose}>
                        <Icon>close</Icon>
                    </IconButton>
                }
                title={title}
                subheader={subtitle}
            />
            <CardContent className="el-CardContent-FU">
                <ReactTable
                    className="-striped -highlight w-full sm:rounded-8"
                    data={data}
                    defaultPageSize={10}
                    getTdProps={() => ({
                        style: { border: `none` },
                    })}
                    columns={columns}
                />
            </CardContent>
            <CardActions>                
                <Button color="default" onClick={handleClose}>
                    Đóng
                </Button>
            </CardActions>
        </Card>
    )
}