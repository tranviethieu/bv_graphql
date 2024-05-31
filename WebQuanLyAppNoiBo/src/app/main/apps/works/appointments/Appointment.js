import React, { useState, useEffect } from 'react';
import { FusePageSimple } from '@fuse';
import { Button, Icon, Typography, IconButton, Badge, Tooltip } from '@material-ui/core';
import { FuseAnimate } from '@fuse';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from './actions';
import ReactTable from 'react-table';
import * as StringUtils from "../../utils/StringUtils";
import moment from 'moment';
import { makeStyles } from '@material-ui/styles';
import { toggleCallPanel } from 'app/fuse-layouts/shared-components/CallOutPanel/store/actions'
import { showAppointmentStateDialog,showAppointmentDialog } from '../../shared-dialogs/actions/AppointmentDialog.action'
import { showUserDialog } from '../../shared-dialogs/actions'
import DemoFilter from '../../DemoFilter/TableFilter_2';
import { filterAttributes} from './FilterAttributes'

const useStyles = makeStyles(theme => ({
    content: {
        '& canvas': {
            maxHeight: '100%'
        }
    },

}));

export default function Appointments(props) {
    const dispatch = useDispatch();
    const classes = useStyles();
    const [appointments, setAppointments] = useState({data:[],page:0,records:0});
    const [departments, setDepartments] = useState([])
    const userState = useSelector(({ auth }) => auth.user);
    const [formFiltered, setFormFiltereds] = useState([{id:"state",value:"APPROVE"}]);
    const [textFilter, setTextFilter] = useState({ id: 'inputPatient.fullName,inputPatient.address,inputPatient.phoneNumber', value: '' });
    const [tableFiltered, setTableFiltered] = useState({ page: 0, pageSize: 10, sorted: [{ id: 'createdTime', desc: true }] })
    function onTextSearch(text) {
        setTextFilter({ id: 'inputPatient.fullName,inputPatient.address,inputPatient.phoneNumber', value: text });
    }
    function onSubmitCheck(listCheck, name){
      if(listCheck.length > 0){
        setFormFiltereds([{id: name, value: `[${listCheck.toString()}]`, operation: 'IN'}])
      }
      else{
        setFormFiltereds([])
      }
    }
    const fetchData = () => {
        //do chỉ lọc những bệnh nhân đã được xác nhận nên phải lọc theo trạng thái approve
        const merged = { ...tableFiltered, filtered: [...formFiltered, textFilter,{id:"appointmentDate",value:moment().format("DD/MM/YYYY"),operation:"<="}] }

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
      <FusePageSimple
        id = "el-ReportGeneralSMSs-Cover"
        classes={{
            toolbar: "min-h-80",
            rightSidebar: "w-288",
            content: classes.content,
        }}
        header={
          <div className="flex flex-1 w-full items-center justify-between p-24 el-UAHeaderPage">
            <div className="flex flex-col">
              <div className="flex items-center mb-4">
                <Icon className="text-18" color="action">home</Icon>
                <Icon className="text-16" color="action">chevron_right</Icon>
                <Typography color="textSecondary">Trang làm việc</Typography>

              </div>
              <FuseAnimate>
                <Typography variant="h6">{appointments.records} Lịch khám BN đã đặt</Typography>
              </FuseAnimate>
            </div>
          </div>
        }
        content={
          <div className="p-12 el-coverContent">
            <div className="el-block-report">
              <Typography className="pl-12 text-15 font-bold block-tittle">Lọc dữ liệu:</Typography>
              <DemoFilter
                className = "el-fillter-report-action"
                searchOption={{ onTextSearch, hideButton: true }}
                filterOption={{
                  attributes: filterAttributes,
                  onSubmitCheck
                }}
                // createOption={{ onClick: () => dispatch(showAppointmentDialog({onSuccess:fetchData})) }}
              />
            </div>
            <div className='el-block-report'>
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
                  {
                    Header: "Tác vụ",
                    accessor: "_id",
                    width: 80,
                    filterable: false,
                    Cell: row => <div>
                      <Tooltip title={row.original.inputPatient && row.original.inputPatient.phoneNumber} placement="bottom">
                        <IconButton onClick={e => dispatch(toggleCallPanel(row.original.user.phoneNumber))}><Icon className="text-green">call</Icon></IconButton>
                      </Tooltip>
                    </div>
                  },
                  {
                    Header: "Mã BN",
                    accessor: "patientCode",
                    maxWidth: 150,
                    Cell: row => <Button onClick={e=>dispatch(showAppointmentDialog({_id:row.original._id,onSuccess:fetchData}))}>
                      {row.value}
                    </Button>
                  },
                  {
                    id: "inputPatient.FullName",
                    Header: 'Tên khách hàng',
                    accessor: 'inputPatient.fullName',

                  },
                  {
                    Header: "Ngày sinh",
                    width: 80,
                    accessor: "inputPatient.birthDay",
                    Cell: row => <div>{moment(row.value).format("DD/MM/YYYY")} </div>
                  },
                  {
                    Header: 'Giới tính',
                    accessor: 'inputPatient.gender',
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
                      <Button onClick={
                        (e) => {
                          // setInForm('state', row.original.appointment.state); setInForm('actionId', row.original._id); setInForm('root', checkRoot); setOpen(true);
                          dispatch(showAppointmentStateDialog({ data: row.original,onSuccess:fetchData }));
                        }}>
                        {
                          row.value === "CANCEL" ? <Typography>Đã hủy</Typography>
                          : row.value === "SERVED" ? <Typography>Đã phục vụ</Typography>
                          : row.value === "APPROVE" ? <Typography>Chưa tới khám</Typography>
                          :<Typography>Chưa xác nhận</Typography>
                        }
                      </Button>
                    </div>
                  },

                ]}
              />
            </div>
          </div>
        }
        // innerScroll
      />
    );
}
