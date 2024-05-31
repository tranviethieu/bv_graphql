import React, { useState } from 'react';
import { Button, Icon, Typography, IconButton, Tooltip} from '@material-ui/core';
import { FuseAnimate, FusePageCarded } from '@fuse';
import { useDispatch } from 'react-redux';
import * as Actions from './store/actions';
import ReactTable from 'react-table';
import moment from 'moment';
import { showUserDialog } from '../shared-dialogs/actions'
import ConfirmDeleteDialog from "./Dialogs/ConfirmDeleteDialog"
import InfoDialog from "./Dialogs/InfoDialog"

function UAsManager() {
    const dispatch = useDispatch();
    const [userActions, setUserActions] = useState([]);
    const [page, setPage] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const [openConfirm, setOpenConfirm] = useState(false);
    const [open, setOpen] = useState(false)
    const [info, setInfo] = useState({})

    const fetchData = (state) => {
        var { page, pageSize, sorted } = state;
        var {filtered} = state
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
        Actions.getUserActions({ page, pageSize, sorted, filtered }, dispatch)
            .then(response => {
                setUserActions(response)
                setPageSize(pageSize)
            })
    }
    function showDialogConfirm (){
      setOpenConfirm(true);
    }
    function closeDialogConfirm () {
      setInfo({})
      setOpenConfirm(false);
        fetchData({page: 0, pageSize: pageSize, filtered :[]})
    }
    function closeDialog(){
      setOpen(false)
    }
    function openDialog () {
      setOpen(true)
    }
    return (
            <FusePageCarded
              classes={{
                content: "flex",
                header: "min-h-72 h-72 sm:h-136 sm:min-h-136"
              }}
              header={
                <div className="flex flex-1 w-full items-center justify-between">

                  <div className="flex items-center">
                    <FuseAnimate animation="transition.expandIn" delay={300}>
                      <Icon className="text-32 mr-0 sm:mr-12">contacts</Icon>
                    </FuseAnimate>
                    <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                      <Typography className="hidden sm:flex" variant="h6">Hoạt động của khách hàng ({userActions.records? userActions.records : 0})</Typography>
                    </FuseAnimate>
                  </div>
                </div>
              }
              content={
                <div className = "el-cover-table">
                  <ConfirmDeleteDialog open = {openConfirm} handleClose = {closeDialogConfirm} info = {info}/>
                  <InfoDialog info = {info} open = {open} handleClose = {closeDialog}/>
                  <ReactTable
                    manual
                    className="-striped -highlight h-full w-full sm:rounded-8 overflow-hidden el-UAsManagerTable"
                    id = "el-tableUAManager"
                    data={userActions.data}
                    pages={userActions.pages}
                    defaultPageSize={10}
                    onFetchData={fetchData}
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
                        accessor: 'user.phoneNumber'
                      },
                      {
                        minWidth: 110,
                        id: "createdTime",
                        Header: 'Thời gian tạo',
                        accessor: 'createdTime',
                        Cell: row => <div>{moment(row.value).format("HH:mm DD/MM/YYYY")}</div>
                      },
                      {
                        id: "action",
                        Header: 'Loại hoạt động',
                        accessor: 'action',
                        Cell: row =>
                        <div>
                          {
                            row.value === "APPOINTMENT" ? "Đặt lịch khám" : row.value === "SURVEY" ? "Thực hiện khảo sát" : row.value === "SCANRESULT" ? "Kết quả chụp chiếu" : row.value === "TESTRESULT" ? "Kết quả xét nghiệm" : row.value === "EXAMINATION" ? "Kết quả khám" : row.value === "TICKET" ? "Yêu cầu khách hàng" : "Đơn thuốc"
                          }
                        </div>
                      },
                      {
                        id: "state",
                        Header: 'Tình trạng',
                        accessor: 'state',
                        Cell: row =>
                        <Tooltip title = {row.value === "ACTIVE"? "Hiện hoạt" : "Vô hiệu"} placement = "bottom">
                          {
                            row.value === "ACTIVE"? <Icon className = "text-green">check_circle_outline</Icon> : <Icon className = "text-red">remove_circle_outline</Icon>
                          }
                        </Tooltip>
                      },
                      {
                        Header: "Tác vụ",
                        accessor: "_id",
                        filterable: false,
                        Cell: row => <div className = "el-groupButton-Table">
                          <Tooltip title="Chi tiết" placement="bottom">
                            <IconButton onClick = {() => {openDialog(); setInfo(row.value);}}>
                              <Icon className="text-blue">info</Icon>
                            </IconButton>
                          </Tooltip>
                          {
                            row.original.state === "ACTIVE" &&
                              <Tooltip title="Xóa" placement="bottom">
                                <IconButton onClick = {() => {showDialogConfirm(); setInfo(row.value);}}>
                                  <Icon className="text-red">delete</Icon>
                                </IconButton>
                              </Tooltip>
                          }
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

export default (UAsManager);
