import React, { useState } from 'react';
import { Icon, Typography, Button } from '@material-ui/core';
import { FuseAnimateGroup, FusePageSimple } from '@fuse';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import ReactTable from 'react-table';
// import _ from 'lodash';

// import * as APIRequest from "./GraphQLHelper";
import moment from 'moment';
import { useForm } from '@fuse/hooks';
import graphqlService from "app/services/graphqlService";
import { QUERY_SMS_QUEUES} from "./query";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import viLocale from "date-fns/locale/vi";

const useStyles = makeStyles(theme => ({
    content: {
        '& canvas': {
            maxHeight: '100%'
        }
    },

}));

const initForm = {
    begin: moment().subtract(30, 'd'),
    end: new Date()
}

function ReportSMSQueue(props) {
    const dispatch = useDispatch();
    const classes = useStyles(props);
    // const pageLayout = useRef(null);
    // const [searchText, setSearchText] = useState('');
    // const [tabValue, setTabValue] = useState(0);

    const [pageSizeCustom, setPageSize] = useState(10);
    const { form, setInForm } = useForm(initForm);
    // const [realtimeData, setRealtimeData] = useState([]);
    const [userActionsData, setUserActionsData] = useState([])
    const [page, setPage] = useState(0)

    function searchReportSMSQueues(state) {
        const { page, pageSize, filtered } = state;
        if (pageSize){
          setPageSize(pageSize)
        }
        else{
          setPageSize(pageSizeCustom)
        }
        const sorted = [{ id: "createdTime", desc: true }]
        graphqlService.query(QUERY_SMS_QUEUES, { page, pageSize, sorted, filtered }, dispatch).then(
            response => {
                // console.log("searchReportSMSQueues response: ", response);

                setUserActionsData(response);
            }
        );
    }
    function handleDateBeginChange(e){
        setInForm('begin', e)
    }
    function handleDateEndChange(e){
        setInForm('end', e)
    }

    return (
        <div>
          <FusePageSimple
            classes={{
              toolbar: "min-h-80",
              rightSidebar: "w-288",
              content: classes.content,
            }}

            header={
              <div className="flex flex-1 items-center justify-between p-24 el-HeaderPage">
                <div className="flex flex-col">
                  <Typography variant="h6">Báo cáo hàng đợi SMS</Typography>
                </div>
              </div>
            }
            content={
              <div className="p-12 el-coverContent" id = "el-ReportSMSQueue-content">
                <div className="el-block-report">
                  <Typography className="pl-12 text-15 font-bold mb-10 block-tittle">Lọc dữ liệu:</Typography>
                  <div className="el-fillter-report-action">
                    <div className="el-flex-item flex-item-flex1">
                      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={viLocale}>
                        <DatePicker
                          disableToolbar
                          variant="inline"
                          fullWidth
                          autoOk
                          required
                          margin = "dense"
                          id="begin"
                          name="begin"
                          label="Ngày bắt đầu"
                          inputVariant="outlined"
                          value={form.begin? moment(form.begin).format("YYYY-MM-DD"): new Date()}
                          onChange={handleDateBeginChange}
                          format="dd/MM/yyyy"
                        />
                      </MuiPickersUtilsProvider>
                    </div>
                    <div className="el-flex-item flex-item-flex1">
                      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={viLocale}>
                        <DatePicker
                          disableToolbar
                          variant="inline"
                          fullWidth
                          autoOk
                          required
                          id="end"
                          margin = "dense"
                          name="end"
                          label="Ngày kết thúc"
                          inputVariant="outlined"
                          value={form.end? moment(form.end).format("YYYY-MM-DD"): new Date()}
                          onChange={handleDateEndChange}
                          format="dd/MM/yyyy"
                        />
                      </MuiPickersUtilsProvider>
                    </div>
                    <FuseAnimateGroup
                      className="flex flex-wrap justify-center"
                      enter={{
                        animation: "transition.slideUpBigIn"
                      }}
                    >
                      <Button variant="contained" className="my-8 pb-8" color="secondary" onClick={searchReportSMSQueues}>
                        <Icon>search</Icon> Tìm kiếm
                      </Button>
                      {/* <Button variant="contained" className="mx-20" color="secondary">
                        <Icon>import_export</Icon> Xuất excel
                        </Button>
                        <Button variant="contained" className="mx-20" color="secondary">
                        <Icon>assignment</Icon> In báo cáo
                      </Button> */}
                    </FuseAnimateGroup>
                    {/* <div className="w-full bg-green pt-8 p-2 mx-16 mt-24">
                      <h3 className="text-white">Có {realtimeData && realtimeData.total ? realtimeData.total : 0} kết quả trong báo cáo từ ngày 22/11/2019 đến ngày 22/11/2019 . </h3>
                    </div> */}
                    {/* <div className="widget sm:w-1/3 md:w-1/3 p-12">
                      <TextField
                      name="key"
                      label="Nhập số điện thoại tìm kiếm"
                      type="phone"
                      onChange={handleChange}
                      InputLabelProps={{
                      shrink: true,
                      }}
                      variant="outlined"
                      margin="nomal"
                      fullWidth
                      />
                    </div> */}
                  </div>
                </div>
                <div className="el-block-report flex">

                  <ReactTable
                    className="-striped -highlight h-full overflow-hidden w-full el-TableSMSQueue"
                    data={userActionsData.data}
                    noDataText = "Không có dữ liệu nào"
                    onFetchData={searchReportSMSQueues}
                    onPageChange = {setPage}
                    defaultPageSize = {10}
                    manual
                    sortable={false}
                    pages = {userActionsData.pages}
                    columns={[
                      {
                        Header: "#",
                        width: 70,
                        Cell: row => <div>{row.index + 1 + (page * pageSizeCustom)}</div>
                      },
                      {
                        Header: "Số ĐT",
                        accessor: "phone_number",

                      },
                      {
                        Header: "Nội dung",
                        accessor: "message",

                      },
                      {
                        Header: "Trạng thái",
                        accessor: "state",

                        Cell: row => <div>{row.value === true ? <div>Thành công</div> : <div>Không thành công</div>}</div>
                      },
                      {
                        Header: "Số lần gửi",
                        accessor: "retry_num",

                      },
                      {
                        Header: "Thời gian gửi",
                        accessor: "createdTime",

                        Cell: row => <div>{moment(row.value).format("DD/MM/YYYY HH:mm:ss")}</div>
                      },
                    ]}
                  />
                </div>


              </div>

                }
            />
        </div>

    )
}

export default ReportSMSQueue;
