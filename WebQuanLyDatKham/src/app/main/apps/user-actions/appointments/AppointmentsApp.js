import React, { useState, useEffect} from 'react';
import { FusePageCarded } from '@fuse';
import withReducer from 'app/store/withReducer';
import reducer from '../store/reducers';
import { Button, Icon, Typography, IconButton, Badge, Tooltip} from '@material-ui/core';
import { FuseAnimate } from '@fuse';
import { useDispatch, useSelector} from 'react-redux';
import * as Actions from '../store/actions';
import { makeStyles } from '@material-ui/styles';
import ReactTable from 'react-table';
import * as StringUtils from "../../utils/StringUtils";
import moment from 'moment';
import { toggleCallPanel } from 'app/fuse-layouts/shared-components/CallOutPanel/store/actions'
// import ChangeStateDialog from '../../shared-dialogs/appointment/ChangeStateAppointmentDialog';
import { showAppointmentStateDialog} from '../../shared-dialogs/actions/AppointmentDialog.action'
import { useForm } from '@fuse/hooks';
import { showUserDialog, showUserActionDialog } from '../../shared-dialogs/actions'
import CheckCircle from '@material-ui/icons/CheckCircle'

const useStyles = makeStyles({
    root: {
        '&.horizontal': {},
        '&.vertical': {
            flexDirection: 'column'
        }
    }
});
const channels = [
  {value: "CRM", label: "CRM"},
  {value: "APP", label: "Ứng dụng"},
  {value: "WEB", label: "Website"},
  {value: "FBCHATBOT", label: "FacebookBot"},
  {value: "FBMESSENGER", label: "FacebookChat"},
  {value: "ZALOCHATBOT", label: "ZaloBot"},
  {value: "ZALOMESSENGER", label: "ZaloChat"},
  // {value: "CALL", label: "Điện thoại"},
]
const states = [
  {value: "/WAITING/i", label: "Chưa xác nhận"},
  {value: "/CANCEL/i", label: "Đã hủy"},
  {value: "/APPROVE/i", label: "Đã duyệt"},
  {value: "/SERVED/i", label: "Đã đến khám"},
]
const initChangeState = {
    actionId:null,
    state: "",
    root: false
}
function Appointments(props) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [appointments, setAppointments] = useState([]);
    const {form, setInForm} = useForm(initChangeState)
    const [ departments, setDepartments ] = useState([])
    const [page, setPage] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const [filterState, setFilterState] = useState({ filtered: [], page: 0, pageSize: 10});
    const userState = useSelector(({auth}) => auth.user);
    const [checkRoot, setRoot] = useState(false);
    const [ appointmentData, setAppointmentData ] = useState([])
    useEffect(()=>{
      Actions.getDepartments({}).then(response =>{
        setDepartments(response.data)
      })
    }, [])
    useEffect(() => {
      if(userState.data){
        if(userState.data.isRoot === true){
          setRoot(true)
        }
        else{
          setRoot(false)
        }
      }
    }, [userState.data]);
    useEffect(() => {
        fetchData();
    }, [filterState, props]);
    const handleClickOpen = (type) => {
        dispatch(showUserActionDialog({rootClass: classes.root,  phoneNumber: "", type: type, className: "el-coverUAD" }))

    };
    function handleCloseDialog(){
        setOpen(false)
    }
    function handleSubmitState(){
        setFilterState({ ...filterState, page:0, pageSize: pageSize, filtered: filterState.filtered });
        setOpen(false)
    }
    const onChangeTable = (state) => {
      let { page, pageSize, filtered } = state;
      filtered = filtered.map(f=>({
        id:f.id,...f.value
      }))
      filtered.forEach(function(item, index){
          if(item.id === "user.FullName" || item.id === "user.PhoneNumber") {
              if(item.value.length > 1){
                  if (item.value.indexOf("/i") === (item.value.length - 2)){
                      let deleteIValue = item.value.substring(0, item.value.length - 1);
                      filtered[index].value= deleteIValue
                      if (item.value.indexOf('/') > -1){
                          let newValue = item.value.replace(/\//g, "");
                          filtered[index].value=`/${newValue}/i`
                      }
                      else{
                          filtered[index].value=`/${item.value}/i`
                      }
                  }
                  else{
                      filtered[index].value=`/${item.value}/i`
                  }
              }
              else{
                  filtered[index].value=`/${item.value}/i`
              }
          }
          else if(item.id === "Data.DepartmentId"){
              if (item.value.indexOf("'") > -1){
                  let newId = item.value.replace(/'/g, "");
                  filtered[index].value = `'${newId}'`;
              }
              else{
                  filtered[index].value=`'${item.value}'`
              }
          }
      })
      setFilterState({ ...filterState, page, pageSize, filtered });
    }
    const fetchData = () => {
        var { page, pageSize, sorted, filtered } = filterState;
        filtered = filtered.filter((item)=>{
            return item.id!=="action" && item.id!=="state" && item.id!== "_id";
        })
        filtered.push({
            id: 'action', value: "APPOINTMENT"
        });
        filtered.push({ id: "state", value: "ACTIVE" })
        if(props.match.params._id){
          filtered.push({ id: "_id", value: props.match.params._id })
        }
        Actions.getUserActions({ page, pageSize, sorted, filtered }, dispatch)
            .then(response => {
                setAppointments(response)
                setPageSize(pageSize)
                setAppointmentData(response.data)
            })
    }
    return (
            <FusePageCarded
              classes={{
                content: "flex",
                header: "min-h-72 h-72 sm:h-136 sm:min-h-136"
              }}
              header={
                <div className="flex flex-1 w-full items-center justify-between el-HeaderPage">
                  <div className="flex items-center">
                    <FuseAnimate animation="transition.expandIn" delay={300}>
                      <Icon className="text-32 mr-0 sm:mr-12">date_range</Icon>
                    </FuseAnimate>
                    <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                      <Typography className="hidden sm:flex" variant="h6">Lịch khám ({appointments.records? appointments.records : 0})</Typography>
                    </FuseAnimate>
                  </div>
                  <FuseAnimate animation="transition.slideRightIn" delay={300}>
                    <Button onClick = {()=>handleClickOpen("APPOINTMENT")} className="whitespace-no-wrap btn-blue" variant="contained">
                      <span className="hidden sm:flex">Tạo lịch khám</span>
                    </Button>
                  </FuseAnimate>
                </div>
              }
              content={
                <div className = "el-cover-table">
                  {/* <ChangeStateDialog open = {open} onCloseDialog = {handleCloseDialog} onSubmitState={handleSubmitState} data={form}/> */}
                  <ReactTable
                    manual
                    className="-striped -highlight h-full w-full sm:rounded-8 overflow-hidden el-TableUserAction"
                    data={appointmentData ? appointmentData : []}
                    pages={appointments.pages}
                    defaultPageSize={10}
                    onFetchData={onChangeTable}
                    onPageChange = {setPage}
                    noDataText= "Không có dữ liệu nào"
                    filterable={true}
                    defaultSorted={[{
                        id: "createdTime", desc: true
                    }]}
                    sortable={false}
                    columns={[
                      {
                        Header: "#",
                        width: 50,
                        filterable: false,
                        Cell : row =><div>
                          {row.index + 1 + (page * pageSize)}
                        </div>
                      },
                      {
                        Header: "Mã BN",
                        accessor: "user.patientCode",
                      },
                      {
                        id: "user.FullName",
                        Header: 'Tên khách hàng',
                        accessor: 'user.fullName',
                        Cell: row => <div>
                          <Button color="secondary" onClick={e=>dispatch(showUserDialog({rootClass: "el-coverFUD",phoneNumber:row.original.user.phoneNumber}))}>{row.value}</Button>
                        </div>,
                      },
                      {
                        id: "user.PhoneNumber",
                        Header: 'Số điện thoại',
                        accessor: 'user.phoneNumber',

                      },
                      {
                        id: "createdTime",
                        Header: 'Thời gian đặt',
                        accessor: 'createdTime',
                        type: 'date',

                        Cell: row => <div>{moment(row.value).format("HH:mm DD/MM")}</div>
                      },
                      {
                        id: "Data.AppointmentDate",
                        Header: 'Thời gian khám',
                        accessor: 'appointment.appointmentDate',
                        type: 'date',
                        // className: "el-TableCell-DateTime-Badge",
                        Cell: row => <div>
                          <Badge badgeContent={row.original.appointment.appointmentTime} color="secondary" anchorOrigin={{
                            horizontal: 'left', vertical: 'top',
                          }}>
                            <span className="pl-24"></span>
                          </Badge>
                          {
                            moment(row.value).format("DD/MM")
                          }
                        </div>
                      },
                      {
                        id: 'Data.DepartmentId',
                        Header: 'Khoa khám',
                        accessor: 'appointment.department.name',
                        type: 'select',
                        options: departments,
                        Cell: row => <div>
                          {
                            row.value? row.value : "Khoa phòng ban đã bị xóa/không tồn tại"
                          }
                        </div>
                      },
                      {
                        id: "Data.Channel",
                        Header: 'Kênh',
                        accessor: 'appointment.channel',
                        Cell: row => <div>
                          {StringUtils.parseChannel(row.value)}
                        </div>,
                        type: 'select',
                        options: channels
                      },
                      {
                        id: "Data.State",
                        Header: "Tình trạng",
                        accessor: 'appointment.state',
                        Cell: row => <div>
                          <Tooltip title={row.value === "WAITING" ? "Chưa xác nhận" : row.value === "CANCEL" ? "Đã hủy" : row.value === "SERVED" ? "Đã đến khám" : "Đã duyệt"} placement="bottom">
                            <IconButton onClick={
                              (e) => {
                                // setInForm('state', row.original.appointment.state); setInForm('actionId', row.original._id); setInForm('root', checkRoot); setOpen(true);
                                dispatch(showAppointmentStateDialog({ data: row.original }));
                              }}>
                              {row.value === "WAITING" ? <Icon className="text-orange">radio_button_unchecked</Icon>
                              : row.value === "CANCEL" ? <Icon className="text-red">remove_circle</Icon>
                              : row.value==="SERVED"?<CheckCircle style ={{ color: "royalblue" }} />
                              :<Icon className="text-green">check_circle</Icon>}
                            </IconButton>
                          </Tooltip>
                        </div>,
                        type: 'select',
                        options: states
                      },
                      {
                        Header: "Tác vụ",
                        accessor: "_id",
                        filterable: false,
                        Cell: row => <div>
                          <Tooltip title="Gọi cho khách hàng" placement="bottom">
                            <IconButton onClick={e=>dispatch(toggleCallPanel(row.original.user.phoneNumber))}><Icon className="text-green">call</Icon></IconButton>
                          </Tooltip>
                        </div>
                        }
                    ]}
                />
                </div>
            }
            // innerScroll
        />
    );
}

export default withReducer('appointmentsApp', reducer)(Appointments);
