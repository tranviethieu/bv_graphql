import React, { useState, useEffect } from 'react';
import { FusePageCarded } from '@fuse';
import { Button, Icon, Typography, IconButton, Badge, Tooltip } from '@material-ui/core';
import { FuseAnimate } from '@fuse';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from './actions';
import ReactTable from 'react-table';
import * as StringUtils from "../../utils/StringUtils";
import moment from 'moment';
import { toggleCallPanel } from 'app/fuse-layouts/shared-components/CallOutPanel/store/actions'
import { showInfoDialog } from '../../shared-dialogs/actions/AppointmentDialog.action'
import { showUserDialog } from '../../shared-dialogs/actions'
import DemoFilter from '../../DemoFilter/TableFilter';
import { filterAttributes} from './FilterAttributes'

export default function Appointments(props) {
    const dispatch = useDispatch();
    const [appointments, setAppointments] = useState({data:[],page:0,records:0});
    const [departments, setDepartments] = useState([])
    const userState = useSelector(({ auth }) => auth.user);
    const [formFiltered, setFormFiltereds] = useState([]);
    const [textFilter, setTextFilter] = useState({ id: 'inputPatient.fullName,inputPatient.address,inputPatient.phoneNumber', value: '' });
    const [tableFiltered, setTableFiltered] = useState({ page: 0, pageSize: 10, sorted: [{ id: 'createdTime', desc: true }] })
    function onTextSearch(text) {
        setTextFilter({ id: 'inputPatient.fullName,inputPatient.address,inputPatient.phoneNumber', value: text });
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
        //do chỉ lọc những bệnh nhân đã được xác nhận nên phải lọc theo trạng thái approve
        const merged = { ...tableFiltered, filtered: [...formFiltered, textFilter] }

        Actions.get_appointments(merged, dispatch)
            .then(response => {
                setAppointments(response)
            })
    }
    const onChangeTable = (state) => {
      let { page, pageSize, filtered } = state;
      setTableFiltered({ ...tableFiltered, page, pageSize, filtered});
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
            <div className="flex flex-1 w-full items-center justify-between el-UAHeaderPage">
              <div className="flex flex-col">
                <div className="flex items-center mb-4">
                  <Icon className="text-18" color="action">home</Icon>
                  <Icon className="text-16" color="action">chevron_right</Icon>
                  <Typography color="textSecondary">Trang làm việc</Typography>

                </div>
                <FuseAnimate>
                  <Typography variant="h6">{appointments.records} Lịch sử đặt khám</Typography>
                </FuseAnimate>
              </div>
              <DemoFilter
                searchOption={{ onTextSearch, hideButton: true }}
                filterOption={{
                  attributes: filterAttributes,
                  onSubmitFilter
                }}
                // createOption={{ onClick: () => dispatch(showAppointmentDialog({onSuccess:fetchData})) }}
              />
            </div>
          }
          content={
            <div className="el-cover-table">
              <ReactTable
                manual
                className="-striped -highlight h-full w-full sm:rounded-8 overflow-hidden el-TableUserAction"
                data={appointments.data&&appointments.data}
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
                    id: "appointmentDate",
                    Header: 'Thời gian khám',
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
                  // {
                  //   Header: "Tác vụ",
                  //   accessor: "_id",
                  //   width: 80,
                  //   filterable: false,
                  //   Cell: row => <div>
                  //     <Tooltip title={row.original.patient && row.original.patient.phoneNumber} placement="bottom">
                  //       <IconButton onClick={e => dispatch(toggleCallPanel(row.original.patient.phoneNumber))}><Icon className="text-green">call</Icon></IconButton>
                  //     </Tooltip>
                  //   </div>
                  // },
                  {
                    Header: "Mã BN",
                    accessor: "patientCode",
                    maxWidth: 150,
                    Cell: row => <Button onClick={e=>dispatch(showInfoDialog({ data: row.original, options: "appointments"}))}>
                      {row.value}
                    </Button>
                  },
                  {
                    id: "inputPatient.FullName",
                    Header: 'Tên khách hàng',
                    accessor: 'patient.fullName',

                  },
                  {
                    Header: "Ngày sinh",
                    width: 80,
                    accessor: "patient.birthDay",
                    Cell: row => <div>{moment(row.value).format("DD/MM/YYYY")} </div>
                  },
                  {
                    Header: 'Giới tính',
                    accessor: 'patient.gender',
                    width:80,
                    Cell: row => <Typography>
                      {row.value ==="1"?"Nam":"Nữ"}
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
                  },
                  {
                    id: "state",
                    Header: "Tình trạng",
                    accessor: 'state',
                    width: 180,
                    Cell: row => <div>
                      {
                        row.value === "CANCEL" ? <Typography>Đã hủy</Typography>
                        : row.value === "SERVED" ? <Typography>Đã phục vụ</Typography>
                        : row.value === "APPROVE" ? <Typography>Chưa tới khám</Typography>
                        :<Typography>Chưa xác nhận</Typography>
                      }
                    </div>
                  },

                ]}
              />
            </div>
          }
        // innerScroll
        />
    );
}
