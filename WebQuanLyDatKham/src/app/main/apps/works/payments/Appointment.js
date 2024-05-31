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

export default function Appointments(props) {
    const dispatch = useDispatch();
    const [appointments, setAppointments] = useState({ data: [], page: 0, records: 0 });
    const [departments, setDepartments] = useState([])
    const [formFiltered, setFormFiltereds] = useState([]);
    const [textFilter, setTextFilter] = useState({ id: "inputPatient.fullName,inputPatient.address,inputPatient.phoneNumber", value: '' });
    const [tableFiltered, setTableFiltered] = useState({ page: 0, pageSize: 10, sorted: [{ id: 'createdTime', desc: true }] })
    function onTextSearch(text) {
        setTextFilter({ id: "inputPatient.fullName,inputPatient.address,inputPatient.phoneNumber", value: text });
    }

    function onSubmitFilter(filtered) {

        const keys = Object.keys(filtered);
        //convert object to array here
        setFormFiltereds(keys.map(id => ({
            id,
            value: filtered[id].toString(),
        })))
    }
    const onChangeTable = (state) => {
      let { page, pageSize, filtered } = state;
      setTableFiltered({ ...tableFiltered, page, pageSize, filtered});
    }
    const fetchData = () => {
        //do chỉ lọc những bệnh nhân đã được xác nhận nên phải lọc theo trạng thái approve và trong ngày hôm nay trở về trước
        const merged = { ...tableFiltered, filtered: [...formFiltered, textFilter, { id: "state", value: "APPROVE" },{id:"appointmentDate",value:moment().format("DD/MM/YYYY"),operation:"<="}] }

        Actions.get_appointments(merged, dispatch)
            .then(response => {
                setAppointments(response)
            })
    }

    useEffect(() => {
        Actions.get_departments(dispatch).then(response => {
            setDepartments(response.data)
        })
    }, [])

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
            <div className="flex flex-1 w-full items-center justify-between el-HeaderPage">
              <div className="flex flex-col">
                <div className="flex items-center mb-4">
                  <Icon className="text-18 el-TitleIcon" color="action">home</Icon>
                  <Icon className="text-16 el-TitleIcon" color="action">chevron_right</Icon>
                  <Typography color="textSecondary">Trang làm việc</Typography>

                </div>
                <FuseAnimate>
                  <Typography variant="h6">{appointments.records} Chờ tạo phiếu khám</Typography>
                </FuseAnimate>
              </div>
              <DemoFilter
                searchOption={{ onTextSearch, hideButton: true }}
                // createOption={{ onClick: () => dispatch(showSessionDialog({})),onSuccess:fetchData }}
              />
            </div>
          }
          content={
            <div className="el-cover-table">
              <ReactTable
                manual
                className="-striped -highlight h-full w-full sm:rounded-8 overflow-hidden el-TableUserAction"
                data={appointments.data && appointments.data}
                pages={appointments.pages}
                defaultPageSize={10}
                onFetchData={onChangeTable}
                // onPageChange={setPage}
                noDataText="Không có dữ liệu nào"
                defaultSorted={[{
                  id: "createdTime", desc: true
                }]}
                sortable={false}
                columns={[
                  {
                      Header: "#",
                      width: 30,
                      accessor: '_id',
                    Cell: row => <div>
                      {row.index + 1 + (tableFiltered.page * tableFiltered.pageSize)}
                    </div>
                  },
                  {
                    id: "appointmentDate",
                    Header: 'Giờ khám',
                    width: 100,
                    accessor: 'appointmentTime',
                    type: 'date',
                    // className: "el-TableCell-DateTime-Badge",
                    Cell: row => <div className="pl-12">
                      <Badge badgeContent={row.value} color="secondary" anchorOrigin={{
                        horizontal: 'left', vertical: 'top',
                      }}>
                        <span className="pl-24"></span>
                      </Badge>
                      {moment(row.original.appointmentDate).format("DD/MM")}
                    </div>
                  },
                  {
                    Header: "Tác vụ",
                    accessor: "_id",
                    width: 80,
                    filterable: false,
                    Cell: row => <div>
                      <Tooltip title="Tạo phiếu khám chữa bệnh" placement="bottom">
                        <IconButton  onClick={e => dispatch(showSessionDialog({ appointmentId: row.original._id, onSuccess: fetchData }))}><Icon>assignment_turned_in</Icon></IconButton>
                      </Tooltip>
                    </div>
                  },
                  {
                    Header: "Mã BN",
                    accessor: "patientCode",
                    maxWidth: 150,
                    Cell: row => <Button onClick={e => dispatch(showSessionDialog({ appointmentId: row.original._id, onSuccess: fetchData }))}>
                      {row.value}
                    </Button>
                  },
                  {
                    id: "inputPatient.FullName",
                    Header: 'Tên khách hàng',
                    accessor: 'inputPatient.fullName',

                  },
                  {
                    Header: 'Ngày sinh',
                    width: 100,
                    accessor: "inputPatient.birthDay",
                    Cell: row => <div>{moment(row.value).format("DD/MM/YYYY")}</div>
                  },
                  {
                    Header: 'Giới tính',
                    accessor: 'inputPatient.gender',
                    width: 80,
                    Cell: row => <Typography>
                      {row.value === "1" ? "Nam" : "Nữ"}
                    </Typography>
                  },
                  {
                    id: 'departmentId',
                    Header: 'Khoa khám',
                    accessor: 'department.name',
                    type: 'select',
                    options: departments,
                    Cell: row => <div>
                      {
                        row.value ? row.value : ""
                      }
                    </div>
                  },
                  {
                    Header: 'Nội dung khám',
                    accessor: 'note',
                    Cell: row => <Tooltip title={row.value || ''} placement="bottom">
                      <Typography className="text-12">{row.value}</Typography>
                    </Tooltip>
                  },
                  {
                    id: "channel",
                    Header: 'Đặt từ',
                    maxWidth: 100,
                    accessor: 'channel',
                    Cell: row => <div>
                      {StringUtils.parseChannel(row.value)}
                    </div>,
                    type: 'select',
                    options: channels
                  },
                  {
                    id: "state",
                    Header: "Tình trạng",
                    accessor: 'state',
                    width: 130,
                    Cell: row => <div>
                      {
                        row.value === "CANCEL" ? <Typography className = "uppercase">Đã hủy</Typography>
                        : row.value === "SERVED" ? <Typography className = "uppercase">Đã đến khám</Typography>
                        : row.value === "APPROVE" ? <Typography className = "uppercase">Đã duyệt</Typography>
                        :<Typography className = "uppercase">Chưa xác nhận</Typography>
                      }
                    </div>
                  },
                  {
                    id: "createdTime",
                    Header: 'Thời gian đặt',
                    width: 100,
                    accessor: 'createdTime',
                    type: 'date',
                    // className: "el-TableCell-DateTime-Badge",
                    Cell: row => <div className="pl-12">
                      {moment(row.original.createdTime).format("HH:mm DD/MM")}
                    </div>,
                  },
                ]}
              />
            </div>
          }
          // innerScroll
        />
    );
}
