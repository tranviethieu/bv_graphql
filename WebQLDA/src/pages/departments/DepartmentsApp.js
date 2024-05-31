import Page from 'components/Page';
import React,{useState,useEffect} from 'react';
import {Label, Card, Input, CardHeader, CardBody } from 'reactstrap';
import { withApollo } from 'react-apollo';
import Button from '@material-ui/core/Button';

import {  MdAddCircle } from 'react-icons/lib/md';
import authCheck from 'utils/authCheck';
import ReactTable from "react-table";

import { QUERY_DEPARTMENTS } from "./query";

import * as StringUtils from "./utils";


function Departments(props) {
    const [searchText, setSearchText] = useState('');

    const [data, setData] = useState([]);
    const [hover, setHover] = useState(true);

    function fetchData(state) {
        props.client.query({
            query: QUERY_DEPARTMENTS
        }).then(result => {
            if (authCheck(result.data)) {
                setData(result.data.response.data);
            }
        });

    }

    return (
        <Page title="Quản lý khoa/phòng ban"
            breadcrumbs={[{ name: 'Quản lý khoa/phòng ban', active: true }]}
            className="CustomerPage">
                <Button className='btn-fixed-right-bottom' variant='contained' color="primary" onClick={e => { props.history.push("/department/new") }}><MdAddCircle /> Thêm phòng ban</Button>
                <div className='block-table-content'>
            <Card>
                <CardHeader>
                    <p className='card-tittle'>Danh sách phòng ban</p>
                </CardHeader>
                <CardBody>
                    <ReactTable
                        className="-striped -highlight h-full w-full sm:rounded-8 overflow-hidden el-Table"
                        data={data}
                        defaultPageSize={20}
                        onFetchData={fetchData}
                        thStyle={{ whiteSpace: 'unset' }}
                        // style={{ overflow: 'wrap' }}
                        getTrProps={(state, rowInfo, column) => {
                            return {
                                className: "cursor-pointer",
                                onClick: (e, handleOriginal) => {
                                    if (rowInfo) {
                                        // dispatch(Actions.openEditContactDialog(rowInfo.original));
                                        props.history.push(`/department/${rowInfo.original._id}`)
                                    }
                                }
                            }
                        }}
                        columns={[
                            {
                                Header: "#",
                                width: 50,
                                filterable: false,
                                Cell: row => <div>
                                    {row.index + 1}
                                </div>
                            },
                            {
                                Header: 'Tên phòng ban',
                                accessor: 'name',
                                className: "justify-center"
                            },
                            {
                                Header: 'Mã phòng ban',
                                accessor: 'code',
                                className: "justify-center"
                            },
                            {
                                Header: 'Trạng thái',
                                accessor: 'status',
                                width:120,
                                Cell: row =>
                                <div>
                                    <Input type="checkbox" checked={row.value} />
                                </div>
                                ,
                                className: "text-center"
                            },
                        ]}
                    />
                </CardBody>
            </Card>
            </div>
        </Page>
    );
}

export default withApollo(Departments);
