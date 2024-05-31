import React, { useState, useEffect } from 'react';
import { Button, TextField, Icon, Typography, IconButton, Tooltip } from '@material-ui/core';
import { FuseAnimate, FusePageSimple, FuseAnimateGroup, FuseChipSelect } from '@fuse';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ReactTable from 'react-table';
import * as Actions from './store/actions';
import { useForm } from '@fuse/hooks';
import moment from 'moment';
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import viLocale from "date-fns/locale/vi";
import ChangeStateDialog from './Dialog/ChangeStateCallCampaignDialog';
import history from '@history';
import { makeStyles } from '@material-ui/styles';
import DemoFilter from '../DemoFilter/TableFilter';

const useStyles = makeStyles(theme => ({
  content: {
    '& canvas': {
      maxHeight: '100%'
    }
  },

}));
const initChangeState = {
    _id:null,
    finished: false,
    root: false,
}
const listAdmin = [
  {
    value: "all",
    label: "Tất cả chiến dịch"
  },
  {
    value: "assigning",
    label: "Chiến dịch đã tạo"
  },
  {
    value: "assigned",
    label: "Chiến dịch liên quan đến công việc được giao"
  },
]
const listNormal = [
  {
    value: "assigning",
    label: "Chiến dịch đã tạo"
  },
  {
    value: "assigned",
    label: "Chiến dịch liên quan đến công việc được giao"
  },
]
function CallCampaigns() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState('');
  const [open, setOpen] = useState(false)
  const [callCampaigns, setCallCampaigns] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10)
  const [startDate, setStartDate] = useState(new Date());
  const [type, setType] = useState({value: 'assigned', label: 'Chiến dịch liên quan đến công việc được giao'})
  const [list, setList] = useState(listNormal)
  const [checkRoot, setRoot] = useState(false);
  const [myId, setMyId] = useState('')
  const {form, setInForm} = useForm(initChangeState)
  const [filterState, setFilterState] = useState({ filtered: [], page: 0, pageSize: 10});
  const userState = useSelector(({auth}) => auth.user);

  useEffect(() => {
    if(userState.data){
      setMyId(userState.data.sub)
      if(userState.data.isRoot === true){
        setType({value: "all",label: "Tất cả chiến dịch"})
        setList(listAdmin)
        setRoot(true)
      }
      else{
        setRoot(false)
        setList(listNormal)
      }
    }
  }, [userState.data]);
  useEffect(() => {
        fetchData(type);
  }, [filterState, type]);
  const onChangeTable = (state) => {
    var { page, pageSize, filtered } = state;
    setFilterState({ ...filterState, page, pageSize, filtered });
  }
  function fetchData(typeOfFetch) {
    var { page, pageSize, filtered } = filterState;
    setPageSize(pageSize)
    if(typeOfFetch.value === 'all'){
      Actions.getCallCampaigns({ page, pageSize, filtered }, dispatch).then(response => {
        setCallCampaigns(response.data);
      })
    }
    else if (typeOfFetch.value === 'assigned'){
      Actions.getMyAssignedCallCampaigns({ page, pageSize, filtered }, dispatch).then(response => {
        setCallCampaigns(response.data);
      })
    }
    else if (typeOfFetch.value === 'assigning'){
      Actions.getMyCallCampaigns({ page, pageSize, filtered }, dispatch).then(response => {
        setCallCampaigns(response.data);
      })
    }
  }
  function handleCloseDialog(){
      setOpen(false)
  }
  function handleSubmitState(){
      setOpen(false)
      setFilterState({ ...filterState, page:0, pageSize: pageSize, filtered:[] });
  }
  function handleSearch(){
    setFilterState({ ...filterState, page:page, pageSize: pageSize, filtered:[
    { id: "startTime", value: `${moment(startDate).format("YYYY-MM-DD")}`, operation: ">=" },
    { id: "name", value: `${searchText.replace(/([^0-9a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồố&!ộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ,-/.\s])/gm, "")}` }
    ] });
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
              <Typography className="hidden sm:flex" variant="h6">Chiến dịch ({callCampaigns? callCampaigns.length : 0})</Typography>
            </FuseAnimate>
          </div>
          <DemoFilter
            createOption={{ onClick: () => history.push("/apps/calls/campaigns/edit") }}
          />
          {/* <FuseAnimate animation="transition.slideRightIn" delay={300}>
            <Button component={Link} to="/apps/calls/campaigns/edit" className="whitespace-no-wrap btn-blue" variant="contained">
              <span className="hidden sm:flex">Tạo chiến dịch</span>
            </Button>
          </FuseAnimate> */}
        </div>
      }
      content={
        <div className="p-12 el-coverContent">

          {/* Lọc dữ liệu */}
          <div className="el-block-report">
            <Typography className="pl-12 text-15 font-bold mb-10 block-tittle">Tìm kiếm thông tin:</Typography>
            <div className='el-fillter-report-action'>
              <div className="el-flex-item flex-item-flex1 mt-8">
                <TextField
                  placeholder="Tên chiến dịch"
                  disableUnderline
                  margin = "dense"
                  fullWidth
                  variant="outlined"
                  value={searchText}
                  onChange={ev =>
                    setSearchText(ev.target.value.replace(/([^0-9a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồố&!ộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ,-/.\s])/gm, ""))}
                />
              </div>
              <div className="el-flex-item flex-item-flex1 ">
                <div className="el-CallDateFilter m-8">
                  <div className="el-filterDateSelectCall">
                    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={viLocale}>
                      <DatePicker
                        disableToolbar
                        variant="inline"
                        label="Chiến dịch bắt đầu từ ngày"
                        helperText={null}
                        fullWidth
                        autoOk
                        margin = "dense"
                        inputVariant="outlined"
                        value={startDate ? moment(startDate).format("YYYY-MM-DD") : new Date()}
                        onChange={
                          date => {
                            setStartDate(date)
                          }
                        }
                        format="dd/MM/yyyy"
                      />
                    </MuiPickersUtilsProvider>
                  </div>
                </div>
              </div>
              <div className="el-flex-item flex-item-flex1 ">
                <FuseAnimateGroup
                  className="flex flex-wrap justify-center"
                  enter={{
                      animation: "transition.slideUpBigIn"
                  }}
                >
                  <Button variant="contained" className="my-16" color="secondary" onClick = {handleSearch}>
                    <Icon>search</Icon> Tìm kiếm
                  </Button>
                </FuseAnimateGroup>
              </div>
            </div>

          </div>


          {/* Dữ liệu hiển thị */}
          <div className="w-full p-12 el-block-Call el-block-report">
            <ChangeStateDialog open = {open} onCloseDialog = {handleCloseDialog} onSubmitState={handleSubmitState} data={form}/>
            <div className = "el-ContentHeader-CallCampaigns">
              <div className = "el-ContentHeader-title">
                <Typography className="pl-12 text-15 font-bold block-title">DANH SÁCH CHIẾN DỊCH:</Typography>
              </div>
              <FuseChipSelect
                value = {type}
                onChange={(e) => setType(e)}
                className = "el-CallCampaigns-FuseChipSelect"
                placeholder="Chọn loại chiến dịch"
                margin = "dense"
                textFieldProps={{
                    label: 'Loại chiến dịch',
                  InputLabelProps: {
                      shrink: true
                  },
                    variant: 'outlined'
                }}
                options={list}
              />
            </div>
            <div className="box-table-scroll">
              <ReactTable
                className="-striped -highlight el-TableCall"
                data={callCampaigns}
                defaultPageSize={10}
                onFetchData={onChangeTable}
                manual
                onPageChange={setPage}
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
                    Header: 'Tên chiến dịch',
                    accessor: 'name'
                  },
                  {
                    Header: 'Loại cuộc gọi',
                    accessor: 'direction',
                    Cell: row => <div>
                      {
                        row.value === "IN" ? 'Gọi vào' : row.value === "OUT" ? "Gọi ra" : "Không xác định"
                      }
                    </div>
                  },
                  {
                    Header: 'Ngày bắt đầu',
                    accessor: "startTime",
                    Cell: row => <div>
                      {moment(row.value).format("DD/MM/YYYY")}
                    </div>
                  },
                  {
                    Header: 'Ngày kết thúc',
                    accessor: "endTime",
                    Cell: row => <div>
                      {moment(row.value).format("DD/MM/YYYY")}
                    </div>
                  },
                  {
                    Header: 'Số điện thoại',
                    accessor: "phoneNumbers.length",
                    Cell: row => <div>{row.value} số</div>
                  },
                  {
                    Header: 'Người tạo',
                    accessor: "owner.base.fullName"
                  },
                  {
                    Header: 'Trạng thái',
                    accessor: "finished",
                    Cell: row => <div>
                      <Tooltip title = {row.value === true ? "Đã kết thúc" : "Đang hoạt động"} placement = "bottom">
                        <IconButton onClick = {(e) => {setInForm('finished',row.value ); setInForm('_id', row.original._id); setInForm('root', checkRoot); setOpen((myId === row.original.owner._id || checkRoot === true) ? true : false); }}>
                          {
                            row.value === true ?
                              <Icon className="text-red">highlight_off</Icon>
                            :
                            <Icon className="text-green">check_circle</Icon>
                          }
                        </IconButton>
                      </Tooltip>
                    </div>
                  },
                  {
                    Header: "Tác vụ",
                    accessor: "_id",
                    Cell: row => <div>
                      <Tooltip title = "Chỉnh sửa" placement = "bottom">
                        <IconButton onClick = {()=> history.push(`/apps/calls/campaigns/edit/${row.value}`)}>
                          <Icon>edit</Icon>
                        </IconButton>
                      </Tooltip>
                      {
                        row.original.finished === false && myId === row.original.ownerId &&
                        <Tooltip title = "Tạo công việc" placement = "bottom">
                          <IconButton onClick = {()=> history.push(`/apps/assignments/createfromcampaign/${row.value}`)}>
                            <Icon className="text-blue">business_center</Icon>
                          </IconButton>
                        </Tooltip>
                      }
                    </div>
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

export default CallCampaigns;
