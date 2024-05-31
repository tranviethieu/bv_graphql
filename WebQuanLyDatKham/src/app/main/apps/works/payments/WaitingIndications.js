import React, { useState, useEffect } from 'react';
import { FusePageCarded } from '@fuse';
import { Button, Icon, Typography, Tooltip, IconButton, Tab} from '@material-ui/core';
import { FuseAnimate } from '@fuse';
import { useDispatch } from 'react-redux';
import * as Actions from './actions';
import ReactTable from 'react-table';
import * as StringUtils from "../../utils/StringUtils";
import moment from 'moment';
import { showInfoDialog } from '../../shared-dialogs/actions/AppointmentDialog.action'
import DemoFilter from '../../DemoFilter/TableFilter';
import { showIndicationTransactionDialog } from './dialogs/IndicationDialog.action'
import DemoFilter2 from '../../DemoFilter/TableFilter_2';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
    content: {
        '& canvas': {
            maxHeight: '100%'
        }
    },

}));

export default function WaitingIndications(props) {
    const dispatch = useDispatch();
    const classes = useStyles();
    const [medicalSessions, setMedicalSessions] = useState({data:[],page:0,records:0});
    const [formFiltered, setFormFiltereds] = useState([{id: "paid", value: "false"}]);
    const [textFilter, setTextFilter] = useState({ id: "code,patient.fullName, sessionCode, patientCode", value: "" });
    const [tabValue, setTabValue] = useState(0);
    const [tableFiltered, setTableFiltered] = useState({ page: 0, pageSize: 10, sorted: [{ id: 'createdTime', desc: true }] })
    function onTextSearch(text) {
        setTextFilter({ id: "patientCode,patient.fullName", value: text });
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
        var merged = { ...tableFiltered, filtered: [...formFiltered, textFilter]}
        Actions.get_indications(merged, dispatch)
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
    return (
      <FusePageCarded
        classes={{
          content: "flex",
          header: "min-h-72 h-72 sm:h-136 sm:min-h-136"
        }}
        header={
          <div className="flex flex-1 w-full items-center justify-between el-HeaderPage">
            <div className="flex flex-col">
              <div className="flex items-center mb-4">
                <Icon className="text-18 el-TitleIcon" color="action">home</Icon>
                <Icon className="text-16 el-TitleIcon" color="action">chevron_right</Icon>
                <Typography color="textSecondary">Trang làm việc</Typography>

              </div>
              <FuseAnimate>
                <Typography variant="h6">{medicalSessions.records} Chỉ định chờ thanh toán</Typography>
              </FuseAnimate>
            </div>
            <DemoFilter
              searchOption={{ onTextSearch, hideButton: true }}
              // createOption={{ onClick: () => dispatch(showAppointmentDialog({onSuccess:fetchData})) }}
            />
          </div>
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
        content={<div className="el-cover-table">
          {/* <div className="el-block-report">
            <Typography className="pl-12 text-15 font-bold block-tittle">Lọc dữ liệu:</Typography>
            <DemoFilter2
              className = "el-fillter-report-action"
              searchOption={{ onTextSearch, hideButton: true }}
              // filterOption={{
              //   // attributes: filterAttributes,
              //   onSubmitCheck
              // }}
              // createOption={{ onClick: () => dispatch(showAppointmentDialog({onSuccess:fetchData})) }}
            />
          </div> */}
          {/* <div className='el-block-report'> */}
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
                  accessor: "sessionCode",
                  width: 150,
                  filterable: false,
                  Cell: row =>
                <Button onClick={e=>dispatch(showInfoDialog({ data: row.original, options: "indication"}))}>
                  {row.value}
                </Button>
              },
              {
                  Header: "Mã chỉ định",
                  accessor: "code",
                  maxWidth: 150,
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
                accessor: 'department.name',
                Cell: row => <div>
                  {
                    row.value ? row.value : ""
                  }
                </div>
              },
              {
                Header: 'Dịch vụ khám',
                accessor: 'service.name',
                Cell: row => <Tooltip title={row.value || ''} placement="bottom">
                  <Typography className="text-12">{row.value}</Typography>
                </Tooltip>
              },
              {
                id: "paid",
                Header: "Tình trạng",
                accessor: 'paid',
                width: 180,
                Cell: row => <div>
                  {
                    row.value === true ? <Typography className = "uppercase">Đã thanh toán</Typography>
                    : <Typography className = "uppercase">Chưa thanh toán</Typography>
                  }
                </div>
              },
              {
                  Header: "Tác vụ",
                  accessor: "_id",
                  width: 80,
                  filterable: false,
                Cell: row => <div>
                  <Tooltip title= "Thanh toán" placement="bottom">
                    <IconButton onClick={e=>dispatch(showIndicationTransactionDialog({ data: row.original ,onSuccess:fetchData }))}>
                      <Icon className="text-blue">monetization_on</Icon>
                    </IconButton>
                  </Tooltip>
                </div>
              },
            ]}
          />
        </div>
          // </div>
        }
        // innerScroll
      />
    );
}
