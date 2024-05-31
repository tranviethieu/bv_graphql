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

export default function QuickTableFetchDataDialog({ title, subtitle, columns, submit, fetchData, ...props }) {
    const dispatch = useDispatch();
    const [page, setPage] = useState(0)
    const [pageSize, setPageSize] = useState(5)
    const [data, setData] = useState([])

    const handleClose = () => {
        dispatch(Actions.hideDialog('quick-table-dialog'));
    };
    function handleFetchData(state) {
        const { page, pageSize, filtered, sorted } = state
        setPageSize(pageSize)
        fetchData({ page, pageSize, filtered: filtered, sorted: sorted })
            .then(response => {
                if (response) {
                    console.log("==> ratting response: ", response)
                    setData(response)
                }
            })
    }

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
                    manual
                    className="-striped -highlight w-full sm:rounded-8"
                    data={data && data.data}
                    defaultPageSize={5}
                    pages={data.pages}
                    noDataText="Không có dữ liệu nào"
                    onFetchData={handleFetchData}
                    onPageChange={setPage}
                    getTdProps={() => ({
                        style: { border: `none` },
                    })}
                    columns={[
                        {
                            Header: "#",
                            width: 50,
                            filterable: false,
                            Cell: row => <div>
                                {row.index + 1 + (page * pageSize)}
                            </div>
                        },
                        ...columns
                    ]}
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