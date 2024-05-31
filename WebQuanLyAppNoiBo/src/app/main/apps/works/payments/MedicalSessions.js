import React, { useState, useEffect } from 'react';
import { FusePageCarded } from '@fuse';
import { Button, Icon, Typography, IconButton, Badge, Tooltip } from '@material-ui/core';
import { FuseAnimate } from '@fuse';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from './actions';
import { makeStyles } from '@material-ui/styles';
import ReactTable from 'react-table';
import * as StringUtils from "../../utils/StringUtils";
import moment from 'moment';
import { toggleCallPanel } from 'app/fuse-layouts/shared-components/CallOutPanel/store/actions'
import {showSessionDialog } from './dialogs/SessionDialog.action';
import DemoFilter from '../../DemoFilter/TableFilter';

const useStyles = makeStyles({
    root: {
        '&.horizontal': {},
        '&.vertical': {
            flexDirection: 'column'
        }
    }
});
const channels = [
    { value: "CRM", label: "CRM" },
    { value: "APP", label: "Ứng dụng" },
    { value: "WEB", label: "Website" },
    { value: "FBCHATBOT", label: "FacebookBot" },
    { value: "FBMESSENGER", label: "FacebookChat" },
    { value: "ZALOCHATBOT", label: "ZaloBot" },
    { value: "ZALOMESSENGER", label: "ZaloChat" },
    // {value: "CALL", label: "Điện thoại"},
]
const states = [
    { value: "/WAITING/i", label: "Chưa xác nhận" },
    { value: "/CANCEL/i", label: "Không đến khám" },
    { value: "/APPROVE/i", label: "Đã duyệt" },
    { value: "/SERVED/i", label: "Đã đến khám" },
]

export default function MedicalSessions(props) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [medicalSessions, setMedicalSessions] = useState({ data: [], page: 0, records: 0 });
    const [formFiltered, setFormFiltereds] = useState([]);
    const [textFilter, setTextFilter] = useState({ id: 'code,patientCode', value: '' });
    const [tableFiltered, setTableFiltered] = useState({ page: 0, pageSize: 10, sorted: [{ id: 'createdTime', desc: true }] })
    function onTextSearch(text) {
        setTextFilter({ id: 'code,patientCode', value: text });
    }

    function onSubmitFilter(filtered) {

        const keys = Object.keys(filtered);
        //convert object to array here
        setFormFiltereds(keys.map(id => ({
            id,
            value: filtered[id].toString(),
        })))
    }
    const fetchData = () => {
        //do chỉ lọc những bệnh nhân đã được xác nhận nên phải lọc theo trạng thái approve và trong ngày hôm nay trở về trước
        const merged = { ...tableFiltered, filtered: [...formFiltered, textFilter, {id:"createdTime",value:moment().add(1, 'days').format("DD/MM/YYYY"),operation:"<="}] }

        Actions.search_medical_sessions(merged, dispatch)
            .then(response => {
                setMedicalSessions(response)
            })
    }

    useEffect(() => {
        fetchData();
    }, [formFiltered, textFilter, tableFiltered]);


    return (
        <FusePageCarded
            classes={{
                content: "flex",
                header: "min-h-72 h-72 sm:h-136 sm:min-h-136"
            }}
            header={
                <div className="flex flex-1 w-full items-center justify-between el-UAHeaderPage">
                    <div className="flex flex-col">
                        <div className="flex items-center mb-4">
                            <Icon className="text-18" color="action">home</Icon>
                            <Icon className="text-16" color="action">chevron_right</Icon>
                            <Typography color="textSecondary">Trang làm việc</Typography>

                        </div>
                        <FuseAnimate>
                            <Typography variant="h6">{medicalSessions.records} Chờ thanh toán</Typography>
                        </FuseAnimate>
                    </div>
                    <DemoFilter
                        searchOption={{ onTextSearch, hideButton: true }}
                        createOption={{ onClick: () => dispatch(showSessionDialog({})),onSuccess:fetchData }}
                    />
                </div>
            }
            content={
                <div className="el-cover-table">
                    <ReactTable
                        manual
                        className="-striped -highlight h-full w-full sm:rounded-8 overflow-hidden el-TableUserAction"
                        data={medicalSessions.data && medicalSessions.data}
                        pages={medicalSessions.pages}
                        defaultPageSize={10}
                        // onFetchData={onChangeTable}
                        // onPageChange={setPage}
                        noDataText="Không có dữ liệu nào"
                        defaultSorted={[{
                            id: "createdTime", desc: true
                        }]}
                        sortable={false}
                        columns={[
                            {
                                Header: "Mã khám",
                                accessor: "code",
                                width: 150,
                                filterable: false,
                                Cell: row => <div>
                                    <Button  onClick={e => dispatch(showSessionDialog({ _id: row.original._id, onSuccess: fetchData }))}>
                                        {row.value}
                                   </Button>
                                </div>
                            },
                            {
                                Header: "Mã BN",
                                accessor: "patientCode",
                                maxWidth: 150
                            },
                            {
                                Header: 'Tên khách hàng',
                                accessor: 'patient.fullName',

                            },
                            {
                                Header: 'Ngày sinh',
                                width: 100,
                                accessor: "patient.birthDay",
                                Cell: row => <div>{moment(row.value).format("DD/MM/YYYY")}</div>
                            },
                            {
                                Header: 'Giới tính',
                                accessor: 'patient.gender',
                                width: 80,
                                Cell: row => <Typography>
                                    {row.value == "1" ? "Nam" : "Nữ"}
                                </Typography>
                            },

                            {
                                Header: 'Nội dung khám',
                                accessor: 'reason',
                                Cell: row => <Tooltip title={row.value || ''} placement="bottom">
                                    <Typography className="text-12">{row.value}</Typography>
                                </Tooltip>
                            },
                            {
                                Header: "Thời gian",
                                accessor: 'createdTime',
                                width: 130,
                                Cell: row => <Typography>
                                    {moment(row.value).format("DD/MM/YYYY HH:mm")}
                                </Typography>
                            },
                            {
                                Header: "Người tạo",
                                accessor: 'creator.fullName',
                                width: 130,
                            },
                            {
                                Header: "Tình trạng",
                                accessor: 'process',
                                width: 130,
                            },

                        ]}
                    />
                </div>
            }
        // innerScroll
        />
    );
}
