import React, { useState, useEffect } from 'react';
import { Button, Icon, Typography, IconButton, Tooltip } from '@material-ui/core';
import { FuseAnimate, FusePageSimple } from '@fuse';
import { useDispatch } from 'react-redux';
import history from '@history';
import ReactTable from 'react-table';
import * as Actions from './store/actions';
import { useForm } from '@fuse/hooks';
import moment from 'moment';
import { makeStyles } from '@material-ui/styles';
import UpdateDialog from './Dialogs/UpdateJobToMeDialog'
import { filterAttributes} from './FilterAttributes'
import DemoFilter2 from '../DemoFilter/TableFilter_2';

const useStyles = makeStyles(theme => ({
  content: {
    '& canvas': {
      maxHeight: '100%'
    }
  },

}));
const initUpdate = {
    JobId:null,
    showType: "",
}

function JobsToMe() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false)
  const [jobsToMe, setJobsToMe] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10)
  const {form, setInForm} = useForm(initUpdate)
  const [filterState, setFilterState] = useState({ filtered: [], page: 0, pageSize: 10});
  const [formFiltered, setFormFiltereds] = useState([{id: "state", value: "[assign, processing]", operation: 'IN'}]);
  const [textFilter, setTextFilter] = useState({ id: "name", value: "" });

  useEffect(() => {
      fetchData();
  }, [formFiltered, textFilter, filterState]);
  function onTextSearch(text) {
      setTextFilter({ id: "name", value: text });
  }
  function onSubmitCheck(listCheck, name){
    if(listCheck.length > 0){
      setFormFiltereds([{id: name, value: `[${listCheck.toString()}]`, operation: 'IN'}])
    }
    else{
      setFormFiltereds([])
    }
  }
  const onChangeTable = (state) => {
    var { page, pageSize, filtered } = state;
    setFilterState({ ...filterState, page, pageSize, filtered });
  }
  function fetchData() {
    var { pageSize } = filterState;
    var merged = { ...filterState, filtered: [...formFiltered, textFilter] }
    setPageSize(pageSize)
      Actions.getJobsToMe(merged, dispatch).then(response => {
        setJobsToMe(response);
      })
  }
  function handleCloseDialog(){
      setOpen(false)
  }
  function handleSubmitState(){
    setFilterState({ ...filterState, page:page, pageSize: pageSize, filtered:[] });
    setOpen(false)
  }
  return (
    <FusePageSimple
      id="el-ReportAppointmentCover"
      classes={{
        root: classes.content,
      }}
      header={
        <div className="flex flex-1 items-center justify-between p-24 el-HeaderPage">

          <div className="flex items-center">
            <FuseAnimate animation="transition.expandIn" delay={300}>
              <Icon className="text-32 mr-0 sm:mr-12">featured_play_list</Icon>
            </FuseAnimate>
            <FuseAnimate animation="transition.slideLeftIn" delay={300}>
              <Typography className="hidden sm:flex" variant="h6">Công việc được giao ({jobsToMe.records? jobsToMe.records : 0})</Typography>
            </FuseAnimate>
          </div>
        </div>
      }
      content={
        <div className="p-12 el-coverContent">
          <div className="el-block-report">
            <Typography className="pl-12 text-15 font-bold block-tittle">Lọc dữ liệu:</Typography>
            <DemoFilter2
              className = "el-fillter-report-action"
              searchOption={{ onTextSearch, hideButton: true, className: "el-flex-item flex-item-flex1" }}
              filterOption={{
                attributes: filterAttributes,
                onSubmitCheck
              }}
              // createOption={{ onClick: () => dispatch(showAppointmentDialog({onSuccess:fetchData})) }}
            />
          </div>
          {/* Dữ liệu hiển thị */}
          <div className="w-full p-12 el-block-Call el-block-report">
            <UpdateDialog open = {open} onCloseDialog = {handleCloseDialog} onSubmitState={handleSubmitState} data={form}/>
            <div className="box-table-scroll">
              <ReactTable
                className="-striped -highlight el-TableCall"
                data={jobsToMe.data}
                defaultPageSize={10}
                onFetchData={onChangeTable}
                manual
                onPageChange={setPage}
                pages = {jobsToMe.pages}
                sortable={false}
                noDataText = "Không có dữ liệu nào"
                columns={[
                  {
                    Header: "#",
                    width: 50,
                    Cell: row => <Typography className="mt-8">
                      {row.index + 1 + (page * pageSize)}
                    </Typography>
                  },
                  {
                    Header: 'Công việc',
                    accessor: 'name',
                    Cell: row => <Tooltip title={row.value} placement="bottom">
                      <Button disableRipple style={{textTransform:"none"}} onClick={()=>row.original.linkedCampaign&&row.original.linkedCampaign.link&&history.push(row.original.linkedCampaign.link)}>{row.value}</Button>
                    </Tooltip>
                  },
                  {
                    Header: 'Người giao việc',
                    accessor: 'owner.base.fullName'
                  },
                  {
                    Header: 'Ngày bắt đầu',
                    accessor: "startTime",
                    Cell: row => <div>
                      {moment(row.value).format("DD/MM/YYYY")}
                    </div>,
                    maxWidth:150
                  },
                  {
                    Header: 'Ngày hết hạn',
                    accessor: "deathline",
                    Cell: row => <div>
                      {moment(row.value).format("DD/MM/YYYY")}
                    </div>,
                    maxWidth:150
                  },
                  {
                    Header: 'Ngày hoàn thành',
                    accessor: "completeTime",
                    Cell: row => <div>
                      {row.original.state === "COMPLETE" ? moment(row.value).format("DD/MM/YYYY") : 'Chưa hoàn thành'}
                    </div>,
                    maxWidth:150
                  },
                  {
                    Header: "Tiến trình",
                    accessor: 'process',
                    Cell: row => <div>
                      {row.value + "%"}
                    </div>,
                    maxWidth:80
                  },
                  {
                    Header: 'Trạng thái',
                    accessor: "state",
                    Cell: row => <div>
                      <Tooltip title = {row.value === "CANCEL" ? "Đã hủy" : row.value === "ASSIGN" ? "Chưa tiếp nhận" : row.value === "COMPLETE" ? "Đã hoàn thành" : "Đang thực hiện"} placement = "bottom">
                        <IconButton>
                          {
                            row.value === 'CANCEL' ?
                              <Icon className="text-red">highlight_off</Icon>
                            : row.value === 'COMPLETE' ?
                              <Icon className="text-green">check_circle</Icon>
                            : row.value === 'ASSIGN' ?
                              <Icon className="text-orange">radio_button_unchecked</Icon>
                            : <Icon className="text-blue">access_time</Icon>
                          }
                        </IconButton>
                      </Tooltip>
                    </div>,
                    maxWidth:80
                  },
                  {
                    Header: "Tác vụ",
                    accessor: "_id",
                    Cell: row => <div>
                      <Tooltip title = "Thông tin công việc" placement = "bottom">
                        <IconButton onClick = {(e) => {setInForm('showType', 'info' ); setInForm('_id', row.original._id); setOpen(true); }}>
                          <Icon className = "text-blue">info</Icon>
                        </IconButton>
                      </Tooltip>
                      <Tooltip title = "Cập nhật công việc" placement = "bottom">
                        <IconButton onClick = {(e) => {setInForm('showType', 'update' ); setInForm('_id', row.original._id); setOpen(true); }}>
                          <Icon>sync</Icon>
                        </IconButton>
                      </Tooltip>
                    </div>,
                    maxWidth:180
                  }
                ]}
              />
            </div>
          </div>
        </div>
      }
    />
  );
}

export default JobsToMe;
