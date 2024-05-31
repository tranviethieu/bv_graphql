import React, { useEffect, useState } from 'react';
import { Icon, Typography, Button, FormControl } from '@material-ui/core';
import { FuseAnimateGroup, FusePageSimple, FuseChipSelect } from '@fuse';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import ReactTable from 'react-table';
import _ from 'lodash';
import moment from 'moment';
import { useForm } from '@fuse/hooks';
import graphqlService from "app/services/graphqlService";
import { QUERY_SMS_HISTORY, QUERY_SMSCAMPAIGNS } from "./query";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import viLocale from "date-fns/locale/vi";
import { PDFSMSLogs } from '../PDFReport/PDFSMSLogs'
import { PDFExport } from '@progress/kendo-react-pdf';

const useStyles = makeStyles(theme => ({
  content: {
    '& canvas': {
      maxHeight: '100%'
    }
  },

}));

const initForm = {
  begin: moment().subtract(30, 'd'),
  end: new Date(),
  campaignId: {
    value: '',
    label: 'Không chọn'
  },
}

function ReportSMSLogs(props) {
  const dispatch = useDispatch();
  const classes = useStyles(props);
  // const pageLayout = useRef(null);

  const { form, setForm, setInForm } = useForm(initForm);
  // const [realtimeData, setRealtimeData] = useState([]);
  const [userActionsData, setUserActionsData] = useState([])
  const [campaignsData, setCampaignsData] = useState([])
  const [pageSizeCustom, setPageSize] = useState(10);
  const [pdfExportComponent, setPdfExportComponent] = useState(null);
  const [reportData, setReportData] = useState([])
  function handleDateBeginChange(e) {
    setInForm('begin', e)
  }
  function handleDateEndChange(e) {
    setInForm('end', e)
  }
  function searchReportSMSLogs(state) {
    // const { filtered } = state;
    const { pageSize, page } = state;
    if (pageSize) {
      setPageSize(pageSize)
    }
    else {
      setPageSize(pageSizeCustom)
    }
    fetchReportData()
    const sorted = [{ id: "createdTime", desc: true }]
    if (form.campaignId.value !== null && form.campaignId.value !== '') {
      let filtered = [{ id: 'campaign_id', value: form.campaignId.value }, { id: "createdTime", value: `${moment(form.begin).format("YYYY-MM-DD")},${moment(form.end).format("YYYY-MM-DD")}`, operation: "between" }];
      console.log("searchReportSMSLogs campaign_id: ", form.campaignId.value);

      graphqlService.query(QUERY_SMS_HISTORY, { page, pageSize: pageSize ? pageSize : pageSizeCustom, sorted, filtered }, dispatch).then(
        response => {
          console.log("searchReportSMSLogs response: ", response);

          setUserActionsData(response);
        }
      );
    }
    else {
      let filtered = [{ id: "createdTime", value: `${moment(form.begin).format("YYYY-MM-DD")},${moment(form.end).format("YYYY-MM-DD")}`, operation: "between" }];
      graphqlService.query(QUERY_SMS_HISTORY, { page, pageSize: pageSize ? pageSize : pageSizeCustom, sorted, filtered }, dispatch).then(
        response => {
          console.log("searchReportSMSLogs response: ", response);

          setUserActionsData(response);
        }
      );
    }
  }
  function fetchReportData() {
    const sorted = [{ id: "createdTime", desc: true }]
    if (form.campaignId.value !== null && form.campaignId.value !== '') {
      let filtered = [{ id: 'campaign_id', value: form.campaignId.value }, { id: "createdTime", value: `${moment(form.begin).format("YYYY-MM-DD")},${moment(form.end).format("YYYY-MM-DD")}`, operation: "between" }];

      graphqlService.query(QUERY_SMS_HISTORY, { sorted, filtered }, dispatch).then(
        response => {
          setReportData(response.data)
        }
      );
    }
    else {
      let filtered = [{ id: "createdTime", value: `${moment(form.begin).format("YYYY-MM-DD")},${moment(form.end).format("YYYY-MM-DD")}`, operation: "between" }];
      graphqlService.query(QUERY_SMS_HISTORY, { sorted, filtered }, dispatch).then(
        response => {
          setReportData(response.data)
        }
      );
    }
  }
  useEffect(() => {
    getCampaigns();
  }, [dispatch]);
  // useEffect(() => {
  //     // getAccounts();
  // })

  function getCampaigns(state) {
    getSMSCampaigns({}, dispatch).then(
      response => {
        console.log("fetchData response: ", response);

        response.data.splice(0, 0, {
          _id: '',
          name: 'Không chọn'
        });
        setCampaignsData(response.data);
      }
    )
  }
  function getSMSCampaigns(params, dispatch) {
    return graphqlService.query(QUERY_SMSCAMPAIGNS, params, dispatch);
  }

  function handleChipChange(value, name) {
    console.log("handeChipChange:", value);
    setForm(_.set({ ...form }, name, value));
  }

  function exportReportToExcel() {
    const ACCESS_TOKEN = "access_token";
    var access_token = localStorage.getItem(ACCESS_TOKEN);
    var fromDate = moment(form.begin).format("DD-MM-YYYY")
    var endDate = moment(form.end).format("DD-MM-YYYY")
    var urlToOpen = process.env.REACT_APP_API_HOST + '/export/smslog?range=' + fromDate + '-' + endDate + '&access_token=' + access_token;
    // var urlToOpen = 'https://api.telehub.elsaga.net/export/smsbyphone?range='+fromDate+'-'+endDate+ '&key='+form.key+'&access_token='+ access_token;
    // window.open(urlToOpen, '_blank', 'toolbar=0,location=0,menubar=0');
    var win = window.open(urlToOpen, '_blank', 'toolbar=0,location=0,menubar=0');
    win.focus();
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
              <Typography variant="h6">Báo cáo lịch sử gửi SMS</Typography>
            </div>
            <FuseAnimateGroup
              className="flex flex-wrap justify-center"
              enter={{
                animation: "transition.slideUpBigIn"
              }}
            >
              <Button variant="contained" className="mx-20" color="secondary" onClick={exportReportToExcel}>
                <Icon>import_export</Icon> Xuất excel
              </Button>
              <Button variant="contained" className="mx-20" color="secondary" onClick={() => { pdfExportComponent.save(); }}>
                <Icon>assignment</Icon> In báo cáo
              </Button>
              <div style={{ position: "absolute", left: "-1000px", top: 0 }}>
                <PDFExport
                  paperSize="A4"
                  margin="0.7cm"
                  fileName={`Báo cáo lịch sử SMS từ ${moment(form.begin).format("DD/MM/YYYY")} - ${moment(form.end).format("DD/MM/YYYY")}.pdf`}
                  ref={(component) => setPdfExportComponent(component)}
                >
                  <PDFSMSLogs data={reportData} begin={form.begin} end={form.end} campaignName={campaignsData.name} />
                </PDFExport>
              </div>
            </FuseAnimateGroup>
          </div>
        }
        content={
          <div className="p-12 el-coverContent" id="el-ReportSMSLogs-content">
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
                      id="begin"
                      name="begin"
                      label="Ngày bắt đầu"
                      inputVariant="outlined"
                      value={form.begin ? moment(form.begin).format("YYYY-MM-DD") : new Date()}
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
                      name="end"
                      label="Ngày kết thúc"
                      inputVariant="outlined"
                      value={form.end ? moment(form.end).format("YYYY-MM-DD") : new Date()}
                      onChange={handleDateEndChange}
                      format="dd/MM/yyyy"
                    />
                  </MuiPickersUtilsProvider>
                </div>
                <FormControl className="el-flex-item flex-item-flex1">
                  <FuseChipSelect
                    // className="mt-8 mb-16"
                    options={
                      campaignsData && campaignsData.map(item => ({
                        value: item._id,
                        label: item.name
                      }))
                    }
                    value={
                      form.sipPhones
                    }
                    onChange={(value) => handleChipChange(value, 'campaignId')}
                    placeholder="Chọn chiến dịch"
                    textFieldProps={{
                      label: 'Chọn chiến dịch',
                      InputLabelProps: {
                        shrink: true
                      },
                      variant: 'outlined'
                    }}

                  />
                </FormControl>
                <FuseAnimateGroup
                  className="flex flex-wrap justify-center"
                  enter={{
                    animation: "transition.slideUpBigIn"
                  }}
                >
                  <Button variant="contained" className="mx-20" color="secondary" onClick={searchReportSMSLogs}>
                    <Icon>search</Icon> Tìm kiếm
                  </Button>
                </FuseAnimateGroup>
              </div>
            </div>

            {/* <div className="w-full bg-green pt-8 p-2 mx-16 mt-24">
                  <h3 className="text-white">Có {realtimeData && realtimeData.total ? realtimeData.total : 0} kết quả trong báo cáo từ ngày 22/11/2019 đến ngày 22/11/2019 . </h3>
                </div> */}

            <div className="el-block-report flex">

              <ReactTable
                className="-striped -highlight h-full overflow-hidden w-full el-TableSMSLog"
                data={userActionsData.data}
                noDataText="Không có dữ liệu nào"
                onFetchData={searchReportSMSLogs}
                defaultPageSize={10}
                manual
                sortable={false}
                pages={userActionsData.pages}
                columns={[
                  {
                    Header: "#",
                    width: 70,

                    Cell: row => <div>{row.index + 1 + (userActionsData.page * pageSizeCustom)}</div>
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
                    Header: "Số lần gửi lại",
                    accessor: "retry_num",

                  },
                  {
                    Header: "Thời gian gửi",
                    accessor: "createdTime",

                    Cell: row => <div>{moment(row.value).format("DD/MM/YYYY HH:MM:ss")}</div>
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

export default ReportSMSLogs;
