import React, { useState, useEffect } from 'react';
import { FusePageSimple } from '@fuse';
import { Button, Icon, Typography, Tooltip, Tabs, Tab} from '@material-ui/core';
import { FuseAnimate } from '@fuse';
import { useDispatch } from 'react-redux';
import * as Actions from './actions';
import ReactTable from 'react-table';
import * as StringUtils from "../../utils/StringUtils";
import moment from 'moment';
import { showInfoDialog } from '../../shared-dialogs/actions/AppointmentDialog.action'
import DemoFilter from '../../DemoFilter/TableFilter';
import { filterAttributes} from './FilterAttributes'
import DemoFilter2 from '../../DemoFilter/TableFilter_2';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
    content: {
        '& canvas': {
            maxHeight: '100%'
        }
    },

}));

export default function MedicalSessions(props) {
    const dispatch = useDispatch();
    const classes = useStyles();
    const [medicalSessions, setMedicalSessions] = useState({data:[],page:0,records:0});
    const [formFiltered, setFormFiltereds] = useState([]);
    const [textFilter, setTextFilter] = useState({ id: 'patientCode,patient.fullName', value: '' });
    const [tabValue, setTabValue] = useState(0);
    const [tableFiltered, setTableFiltered] = useState({ page: 0, pageSize: 10, sorted: [{ id: 'createdTime', desc: true }] })
    function onTextSearch(text) {
        setTextFilter({ id: 'patientCode,patient.fullName', value: text });
    }

    function onSubmitFilter(filtered) {

        const keys = Object.keys(filtered);
        //convert object to array here
        setFormFiltereds(keys.map(id => ({
            id,
            value: filtered[id].toString(),
        })))
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
        var merged = {}
        if (tabValue === 0){
          merged = { ...tableFiltered, filtered: [...formFiltered, textFilter,{id:"createdTime",value:moment().format("DD/MM/YYYY"),operation:">="}] }
        }
        else {
          merged = { ...tableFiltered, filtered: [...formFiltered, textFilter] }
        }

        Actions.get_medical_sessions(merged, dispatch)
            .then(response => {
                setMedicalSessions(response)
            })
    }
    const onChangeTable = (state) => {
      let { page, pageSize, filtered } = state;
      setTableFiltered({ ...tableFiltered, page, pageSize, filtered});
    }

    useEffect(() => {
        fetchData();
    }, [formFiltered, textFilter, tableFiltered, tabValue]);

    function handleChangeTab(event, tabValue) {
      setTabValue(tabValue)
    }
    return (
      <FusePageSimple
        id = "el-ReportGeneralSMSs-Cover"
        classes={{
            toolbar: "min-h-80",
            rightSidebar: "w-288",
            content: classes.content,
        }}
        header={
          <div className="flex flex-1 w-full p-24 items-center justify-between el-UAHeaderPage">
            <div className="flex flex-col">
              <div className="flex items-center mb-4">
                <Icon className="text-18" color="action">home</Icon>
                <Icon className="text-16" color="action">chevron_right</Icon>
                <Typography color="textSecondary">Trang làm việc</Typography>

              </div>
              <FuseAnimate>
                <Typography variant="h6">{medicalSessions.records} Bệnh nhân đã khám</Typography>
              </FuseAnimate>
            </div>
            {/* <DemoFilter
                searchOption={{ onTextSearch, hideButton: true }}
                filterOption={{
              attributes: filterAttributes,
              onSubmitFilter
                }}
                // createOption={{ onClick: () => dispatch(showAppointmentDialog({onSuccess:fetchData})) }}
            /> */}
          </div>
        }
        contentToolbar={
          <Tabs
            value={tabValue}
            onChange={handleChangeTab}
            indicatorColor="secondary"
            textColor="secondary"
            variant="scrollable"
            scrollButtons="off"
            className="w-full border-b-1 px-24 el-Tabs"
          >
            <Tab className="text-14 font-600 normal-case" label={`Bệnh nhân trong ngày`} />
            <Tab className="text-14 font-600 normal-case" label={`Tất cả bệnh nhân`} />
          </Tabs>
        }
        /* <PopupState variant="popover" popupId="demo-popup-menu">
        {(popupState) => (
        <React.Fragment>
        <MoreVert {...bindTrigger(popupState)} />
        <Menu {...bindMenu(popupState)}>
        <MenuItem>Sửa thông tin kết luận</MenuItem>
        </Menu>
        </React.Fragment>
        )}
        </PopupState> */
        content={<div className="p-12 el-coverContent">
          <div className="el-block-report">
            <Typography className="pl-12 text-15 font-bold block-tittle">Lọc dữ liệu:</Typography>
            <DemoFilter2
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
              data={medicalSessions.data&&medicalSessions.data}
              pages={medicalSessions.pages}
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
                    Header: "#",
                    width: 30,
                    accessor: '_id',
                  Cell: row => <div>
                    {row.index + 1 + (tableFiltered.page * tableFiltered.pageSize)}
                  </div>
                },
                {
                  Header: "Mã khám",
                  accessor: "code",
                  width: 150,
                  filterable: false,
                  Cell: row =>
                  <Button onClick={e=>dispatch(showInfoDialog({ data: row.original}))}>
                    {row.value}
                  </Button>
                },
                {
                  Header: "Mã BN",
                  accessor: "patientCode",
                  maxWidth: 150,
                },
                {
                    id: "patient.fullName",
                    Header: 'Tên khách hàng',
                    accessor: 'patient.fullName',

                },
                {
                    Header: 'Ngày sinh',
                    width:100,
                    accessor: "patient.birthDay",
                  Cell: row => <div>{moment(row.value).format("DD/MM/YYYY")}</div>
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
                    accessor: 'appointment.department.name',
                  Cell: row => <div>
                    {
                      row.value ? row.value : ""
                    }
                  </div>
                },
                {
                    Header: 'Nội dung khám',
                    accessor: 'reason',
                  Cell: row => <Tooltip title={row.value || ''} placement="bottom">
                    <Typography className="text-12">{row.value}</Typography>
                  </Tooltip>
                },
                {
                    id: "appointment.channel",
                    Header: 'Đặt từ',
                    maxWidth: 100,
                    accessor: 'appointment.channel',
                  Cell: row => <div>
                    {StringUtils.parseChannel(row.value)}
                  </div>,
                },
                {
                    id: "process",
                    Header: "Tình trạng",
                    accessor: 'process',
                    width: 180,
                  Cell: row => <div>
                    {
                      row.value === "IN_QUEUE" ? <Typography>Chờ khám</Typography>
                      : row.value === "WATING_CONCLUSION" ? <Typography>Chờ kết luận khám</Typography>
                      : row.value === "CONCLUSION" ? <Typography>Đã có kết luận khám</Typography>
                      :<Typography>Hủy khám</Typography>
                    }
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
