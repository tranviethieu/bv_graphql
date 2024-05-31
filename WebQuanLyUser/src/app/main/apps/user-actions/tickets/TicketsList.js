import React, {useState, useEffect} from 'react';
import { Typography, Icon, Button, IconButton, Tooltip} from '@material-ui/core';
import { FuseAnimate, FusePageCarded} from '@fuse';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from '@fuse/hooks';
import ReactTable from 'react-table'
import * as Actions from '../store/actions';
import { showUserDialog, showUserActionDialog } from '../../shared-dialogs/actions'
import { makeStyles } from '@material-ui/styles';
import ChangeStateDialog from '../Dialog/ChangeStateTicketDialog';
import moment from 'moment'
export const row={
    height: "62px"
  }
const useStyles = makeStyles({
    root: {
        '&.horizontal': {},
        '&.vertical': {
            flexDirection: 'column'
        }
    }
});
const initChangeState = {
    actionId:null,
    state: "",
    root: false
}
function TicketsList(props){
    const classes = useStyles();
    const dispatch = useDispatch();
    const {form, setInForm} = useForm(initChangeState)
    const [tickets, setTicket] = useState([])
    const [page, setPage] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const [filterState, setFilterState] = useState({ filtered: [], page: 0, pageSize: 10});
    const userState = useSelector(({auth}) => auth.user);
    const [checkRoot, setRoot] = useState(false);

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
    const onChangeTable = (state) => {
      let { page, pageSize, filtered } = state;
      filtered = filtered.map(f=>({
        id:f.id,...f.value
      }))
      setFilterState({ ...filterState, page, pageSize, filtered });
    }
    const handleClickOpen = (type) => {
        dispatch(showUserActionDialog({rootClass: classes.root,  phoneNumber: "", type: type, className: "el-coverUAD" }))

    };
    const [open, setOpen] = useState(false);
    function handleCloseDialog(){
        setOpen(false)
    }
    function handleSubmitState(){
        setOpen(false)
        setFilterState({ ...filterState, page:page, pageSize: pageSize, filtered:filterState.filtered });
    }
    const fetchData = () => {
        var { page, pageSize, sorted, filtered } = filterState;
        var listState = {};
        filtered = filtered.filter((item)=>{
            return item.id!=="action" && item.id !== "state" && item.id !== "_id";
        })
        filtered.push({
            id: 'action', value: "TICKET"
        });
        filtered.push({ id: "state", value: "ACTIVE" })
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
        })
        filtered.push(listState)
        if(props.match.params._id){
          filtered.push({ id: "_id", value: props.match.params._id })
        }
        setPageSize(pageSize)
        Actions.getUserActions({ page, pageSize, sorted, filtered }, dispatch)
            .then(response => {
                setTicket(response)
            })
    }
    return (
            <FusePageCarded
              classes={{
                content: "flex",
                header: "min-h-72 h-72 sm:h-136 sm:min-h-136"
              }}
              header={
                <div className="flex flex-1 w-full items-center justify-between el-UAHeaderPage">

                  <div className="flex items-center">
                    <FuseAnimate animation="transition.expandIn" delay={300}>
                      <Icon className="text-32 mr-0 sm:mr-12">class</Icon>
                    </FuseAnimate>
                    <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                      <Typography className="hidden sm:flex" variant="h6">Yêu cầu ({tickets.records? tickets.records : 0})</Typography>
                    </FuseAnimate>
                  </div>
                  <FuseAnimate animation="transition.slideRightIn" delay={300}>
                    <Button onClick = {()=>handleClickOpen("TICKET")} className="whitespace-no-wrap btn-blue" variant="contained">
                      <span className="hidden sm:flex">Tạo yêu cầu</span>
                    </Button>
                  </FuseAnimate>
                </div>
              }
              content={
                <div className = "el-cover-table">
                  <ChangeStateDialog open = {open} onCloseDialog = {handleCloseDialog} onSubmitState={handleSubmitState} data={form}/>
                  <ReactTable
                    manual
                    className="-striped -highlight h-full w-full sm:rounded-8 overflow-hidden pt-16 el-TableUserAction"
                    data={tickets.data}
                    pages={tickets.pages}
                    defaultPageSize={10}
                    noDataText ="Không có dữ liệu nào"
                    onFetchData={onChangeTable}
                    filterable={true}
                    defaultSorted={[{
                        id: "createdTime", desc: true
                    }]}
                    onPageChange = {setPage}
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
                        id: "user.FullName",
                        Header: 'Người yêu cầu',
                        accessor: 'user.fullName',
                        Cell: row => <div>
                          <Button color="secondary" onClick={e=>dispatch(showUserDialog({rootClass: "el-coverFUD",phoneNumber:row.original.user.phoneNumber}))}>{row.value}</Button>
                        </div>
                      },
                      {
                        id: "user.PhoneNumber",
                        Header: 'Số điện thoại',
                        accessor: 'user.phoneNumber',

                      },
                      {
                        id: "createdTime",
                        minWidth: 110,
                        Header: 'Thời gian tạo',
                        accessor: 'createdTime',
                        type: 'date',
                        Cell: row => <div>{moment(row.value).format("HH:mm DD/MM")}</div>
                      },
                      {
                        Header:"Tiêu đề",
                        accessor: "data.Title",
                        filterable: false,

                        Cell: row=>
                        <div>
                          {
                            row.value?
                              <Tooltip title={row.value} placement="bottom">
                                <div>{row.value?row.value:""}</div>
                              </Tooltip>
                            :
                            <div></div>
                          }
                        </div>
                      },
                      {
                        Header: "Nội dung",
                        accessor: "data.Note",
                        filterable: false,
                        Cell: row=>
                        <div>
                          {
                            row.value?
                              <Tooltip title={row.value} placement="bottom">
                                <div>{row.value?row.value:""}</div>
                              </Tooltip>
                            :
                            <div></div>
                          }
                        </div>
                      },
                      {
                        id: "Data.Type",
                        minWidth: 100,
                        Header: "Loại yêu cầu",
                        accessor: "data.Type",
                        type: 'select',
                        options: [
                        {value: "/ADVISORY/i", label: 'Tư vấn'},
                        {value: "/COMPLAIN/i", label: 'Khiếu nại'},
                        ],
                        sortable: true,
                        Cell: row=>
                        <div>
                          {
                            row.value === 0 ?
                              <Tooltip title="Tư vấn" placement="bottom">
                                <Icon className="text-green">question_answer</Icon>
                              </Tooltip>
                            : <Tooltip title="Khiếu nại" placement="bottom">
                              <Icon className="text-red">feedback</Icon>
                            </Tooltip>
                          }
                        </div>
                      }
                        ,
                      {
                        id: "Data.State",
                        minWidth: 100,
                        Header: "Tình trạng",
                        accessor: "data.State",
                        type: 'select',
                        options: [
                        {value: "/waiting/i", label: 'Chưa xử lý'},
                        {value: "/complete/i", label: 'Đã xử lý'},
                        ],
                        Cell: row=>
                        <IconButton onClick = {(e) => {setInForm('state',row.original.data.State ); setInForm('actionId', row.original._id); setInForm('root', checkRoot); setOpen(true); }}>
                          {
                            row.value === 0 ?
                              <Tooltip title="Chưa xử lý" placement="bottom">
                                <Icon className="text-orange">access_time</Icon>
                              </Tooltip>
                            :
                            <Tooltip title="Đã xử lý" placement="bottom">
                              <Icon className="text-blue">check_circle</Icon>
                            </Tooltip>
                          }
                        </IconButton>
                      }
                    ]}
                  />
                </div>
              }
              // innerScroll
            />
    );
}

export default TicketsList;
