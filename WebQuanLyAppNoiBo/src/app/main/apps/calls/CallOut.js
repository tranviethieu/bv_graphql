import React, { useState } from 'react';
import { Button, TextField, Icon, Typography, IconButton, Badge, Tooltip, FormControl } from '@material-ui/core';
import { FuseAnimate, FusePageSimple, FuseAnimateGroup, FuseChipSelect } from '@fuse';
import { useDispatch } from 'react-redux';
// import { Link } from 'react-router-dom';
import ReactTable from 'react-table';
import * as Actions from './store/actions';
import moment from 'moment';
// import ReactPlayer from 'react-player';
import ReactAudioPlayer from 'react-audio-player';
import { toggleCallPanel } from 'app/fuse-layouts/shared-components/CallOutPanel/store/actions'
import { showUserDialog } from '../shared-dialogs/actions'
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import viLocale from "date-fns/locale/vi";

import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
  content: {
    '& canvas': {
      maxHeight: '100%'
    }
  },

}));

function CallOut() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState('');
  const [calls, setCalls] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(moment(new Date()).add(1, "days"));
  const [stateCall, setStateCall] = useState({ value: "all", label: "Tất cả cuộc gọi" })
  // const [playingFile, setPlayingFile] = useState(null);
  function fetchData(state, startDateRealtime, endDateRealtime, seacrchValue) {
    const { page, pageSize } = state;
    var { filtered } = state
    Actions.getCallOuts({ page, pageSize, filtered }, dispatch).then(response => {
      setCalls({ ...response, page, pageSize });
    })
  }
  function downloadRecord(recordingfile) {
    window.open(process.env.REACT_APP_DOWNLOAD_RECORDS + recordingfile, '_blank');
  }
  function handleChipChange(value) {
    setStateCall(value)
  }
  function handleSearch() {
    var stateCallData = ''
    var operationData = "=="
    if (stateCall.value === 'answered') {
      stateCallData = "ANSWERED"
    }
    else if (stateCall.value === 'all') {
      stateCallData = ''
    }
    else {
      stateCallData = "ANSWERED"
      operationData = "!="
    }
    fetchData({
      page: calls.page, pageSize: calls.pageSize,
      filtered: [
        { id: "calldate", value: `${moment(startDate).format("YYYY-MM-DD")},${moment(endDate).format("YYYY-MM-DD")}`, operation: "between" },
        { id: "phonenumber, phonecode", value: `${searchText.replace(/([^0-9\s])/gm, "")}` },
        { id: "disposition", value: stateCallData, operation: operationData }
      ]
    })
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
              <Icon className="text-32 mr-0 sm:mr-12">call_made</Icon>
            </FuseAnimate>
            <FuseAnimate animation="transition.slideLeftIn" delay={300}>
              <Typography className="hidden sm:flex" variant="h6">Danh sách cuộc gọi ra ({calls.records ? calls.records : 0})</Typography>
            </FuseAnimate>
          </div>
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
                  placeholder="Số điện thoại"
                  disableUnderline
                  fullWidth
                  variant="outlined"
                  value={searchText}
                  onChange={ev =>
                    setSearchText(ev.target.value.replace(/([^0-9\s])/gm, ""))}
                />
              </div>
              <div className="el-flex-item flex-item-flex1 ">
                <div className="el-CallDateFilter m-8">
                  <div className="el-filterDateSelectCall">
                    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={viLocale}>
                      <DatePicker
                        disableToolbar
                        variant="inline"
                        label="Ngày bắt đầu"
                        helperText={null}
                        fullWidth
                        autoOk
                        inputVariant="outlined"
                        value={startDate ? moment(startDate).format("YYYY-MM-DD") : new Date()}
                        onChange={
                          date => {
                            setStartDate(date);
                            (endDate === "" || moment(endDate).isBefore(date)) ? setEndDate(moment(date).add(1, "days")) : setEndDate(endDate)
                          }
                        }
                        format="dd/MM/yyyy"
                      />
                    </MuiPickersUtilsProvider>
                  </div>
                </div>
              </div>
              <div className="el-flex-item flex-item-flex1">
                <div className="el-CallDateFilter m-8">
                  <div className="el-filterDateSelectCall">
                    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={viLocale}>
                      <DatePicker
                        disableToolbar
                        variant="inline"
                        helperText={null}
                        fullWidth
                        autoOk
                        label="Ngày kết thúc"
                        inputVariant="outlined"
                        value={endDate ? moment(endDate).format("YYYY-MM-DD") : new Date()}
                        onChange={
                          date => {
                            setEndDate(date);
                          }
                        }
                        format="dd/MM/yyyy"
                        minDate={moment(startDate).add(1, "days")}
                      />
                    </MuiPickersUtilsProvider>
                  </div>
                </div>
              </div>
              <div className="el-flex-item flex-item-flex1 mt-8">
                <FormControl className="el-flex-item flex-item-flex1 w-full">
                  {/* <InputLabel>Chọn điện thoại viên</InputLabel> */}
                  <FuseChipSelect
                    // className="mt-8 mb-16"
                    options={
                      [
                        { value: "all", label: "Tất cả cuộc gọi" },
                        { value: "answered", label: "Đàm thoại" },
                        { value: "noanswered", label: "Không bắt máy" },
                      ]
                    }
                    value={
                      stateCall
                    }
                    onChange={(value) => handleChipChange(value)}
                    placeholder="Chọn tình trạng"
                    textFieldProps={{
                      label: 'Chọn tình trạng',
                      InputLabelProps: {
                        shrink: true
                      },
                      variant: 'outlined'
                    }}
                  />
                </FormControl>
              </div>
            </div>

            <FuseAnimateGroup
              className="flex flex-wrap justify-center"
              enter={{
                animation: "transition.slideUpBigIn"
              }}
            >
              <Button variant="contained" className="mx-20 my-8" color="secondary" onClick={handleSearch}>
                <Icon>search</Icon> Tìm kiếm
              </Button>
            </FuseAnimateGroup>
          </div>


          {/* Dữ liệu hiển thị */}
          <div className="w-full p-12 el-block-Call el-block-report">
            <Typography className="pl-12 text-15 font-bold mb-10 block-title">DANH SÁCH CUỘC GỌI:</Typography>
            <div className="box-table-scroll">
              <ReactTable
                className="-striped -highlight el-TableCall"
                data={calls.data}
                pages={calls.pages}
                defaultPageSize={10}
                onFetchData={fetchData}
                manual
                sortable={false}
                noDataText="Không có dữ liệu nào"
                columns={[
                  {
                    Header: "#",
                    width: 50,
                    Cell: row => <Typography className="mt-8">
                      {row.index + 1 + (calls.page * calls.pageSize)}
                    </Typography>
                  },
                  {
                    Header: 'Tên khách hàng',
                    accessor: 'user.fullName',
                    Cell: row => <div className="el-Call_UserName">
                      <Button color="secondary" style={{ color: row.value ? "" : "red" }} onClick={e => dispatch(showUserDialog({ rootClass: "el-coverFUD", phoneNumber: row.original.phonenumber }))}>{row.value || "Khách hàng mới"}</Button>
                    </div>
                  },
                  {
                    Header: 'Số điện thoại',
                    accessor: 'phonenumber',
                  },
                  {
                    Header: 'Chiến dịch',
                    accessor: 'campaign',
                    Cell: row => <div>
                      {row.value && row.value.name ? row.value.name : ""}
                    </div>
                  },
                  {
                    Header: "Tình trạng",
                    accessor: 'disposition',
                    Cell: row => <div>
                      {row.value === "ANSWERED" ? "Đàm thoại" : <div className="text-red">Không bắt máy</div>
                      }
                    </div>
                  },
                  {
                    Header: 'Gọi lúc',
                    accessor: "calldate",
                    Cell: row => <div className="el-CallAt">
                      <Badge badgeContent={moment(row.value).format("HH:mm")} color="secondary" anchorOrigin={{
                        horizontal: 'left', vertical: 'top',
                      }}>
                        <span className="pl-24"></span>
                      </Badge>
                      {moment(row.value).format("DD/MM/YYYY")}
                    </div>
                  },
                  {
                    Header: 'Người gọi ra',
                    accessor: "account.base",
                    Cell: row => <div className="el-Call-CallBy">
                      {row.value ? row.value.fullName : row.original.phonecode}
                    </div>
                  },
                  {
                    Header: 'Thời lượng',
                    accessor: "duration",
                    Cell: row => <div className="el-CallDuration">
                      {moment().startOf('day')
                        .seconds(row.value)
                        .format('mm:ss')}
                    </div>
                  },
                  {
                    Header: 'Đặt khám',
                    accessor: "appointments_num"
                  },
                  {
                    Header: "File ghi âm",
                    accessor: "recordingfile",
                    filterable: false,
                    Cell: row => (
                      row.original.disposition === "ANSWERED" && <ReactAudioPlayer title="File ghi âm cuộc gọi" className="el-ReactAudioPlayer" src={process.env.REACT_APP_DOWNLOAD_RECORDS + row.value} controls />
                    )
                  },
                  {
                    Header: "Tác vụ",
                    accessor: "id",
                    Cell: row => <div className="el-Call-ButtonOptionCall">
                      <Tooltip title="Gọi" placement="bottom">
                        <IconButton onClick={e => dispatch(toggleCallPanel(row.original.phonenumber))}><Icon className="text-green">call</Icon></IconButton>
                      </Tooltip>
                      <Tooltip title="Tải xuống file ghi âm" placement="bottom">
                        <IconButton onClick={e => downloadRecord(row.original.recordingfile)}><Icon className="text-green">cloud_download</Icon></IconButton>
                      </Tooltip>
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

export default CallOut;
