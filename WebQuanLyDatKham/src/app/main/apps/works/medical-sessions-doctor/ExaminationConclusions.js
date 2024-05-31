import React, { useState, useEffect } from 'react';
import { FusePageCarded } from '@fuse';
import { Button, Icon, Typography, Tooltip, Menu, MenuItem } from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';
import { FuseAnimate } from '@fuse';
import { useDispatch } from 'react-redux';
import * as Actions from './actions';
import ReactTable from 'react-table';
import moment from 'moment';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import { showInfoDialog } from '../../shared-dialogs/actions/AppointmentDialog.action'
import DemoFilter from '../../DemoFilter/TableFilter';
import { showIndicationListDialog } from "../../shared-components/IndicationList.action";
import { showMedicalConclusionDialog, showReExaminationDialog, showMedicalPrescriptionDialog } from './actions'
import withFixedColumns from 'react-table-hoc-fixed-columns';
import 'react-table-hoc-fixed-columns/lib/styles.css'

const ReactTableFixedColumns = withFixedColumns(ReactTable);

export default function ExaminationConclusions(props) {
  const dispatch = useDispatch();
  const [medicalSessions, setMedicalSessions] = useState({ data: [], page: 0, records: 0 });
  const [formFiltered, setFormFiltereds] = useState([{ id: "process", value: "CONCLUSION" }]);
  const [textFilter, setTextFilter] = useState({ id: "textSearch", value: "" });
  const [tableFiltered, setTableFiltered] = useState({ page: 0, pageSize: 10, sorted: [{ id: 'createdTime', desc: true }] })
  const [currentPage, setCurrentPage] = useState(0);
  const [times, setTimes] = useState([]);
  const [createdTime, setCreatedTime] = useState(null);
  const [loading, setLoading] = useState(false);

  function onTextSearch(text) {
    setTextFilter({ id: "textSearch", value: text });
  }

  function onSubmitFilter(filtered) {

    const keys = Object.keys(filtered);
    //convert object to array here
    setFormFiltereds(keys.map(id => ({
      id,
      value: filtered[id].toString(),
    })))
  }
  
  const fetchData = () => {
    var merged = { ...tableFiltered, filtered: [...formFiltered, textFilter] };
    setLoading(true)
    Actions.get_medical_sessions(merged, dispatch).then((response) => {
      setMedicalSessions(response);
      setLoading(false)
    });
  };
  
  function showIndication(session) {
    dispatch(showIndicationListDialog({ sessionProp: session, onClose: fetchData }));
  }
  const onChangeTable = (state) => {
    let { page, pageSize, filtered } = state;
    setTableFiltered({ ...tableFiltered, page, pageSize, filtered });
  }

  useEffect(() => {
    fetchData();
  }, [formFiltered, textFilter, tableFiltered]);
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
              <Typography variant="h6">{medicalSessions.records.toLocaleString('vi-VN')} Lượt bệnh nhân đã khám</Typography>
            </FuseAnimate>
          </div>
          <DemoFilter
            searchOption={{ onTextSearch, hideButton: true }}
            placeHolder="Họ tên, SĐT, Mã BN/Phiên khám"
          // filterOption={{
          //   attributes: filterAttributes,
          //   onSubmitFilter
          // }}
          // createOption={{ onClick: () => dispatch(showAppointmentDialog({onSuccess:fetchData})) }}
          />
        </div>
      }
      content={
        <div className="el-cover-table">
          <ReactTableFixedColumns
            manual
            className="-striped -highlight h-full w-full sm:rounded-8 overflow-hidden el-TableUserAction"
            loading={loading}
            loadingText="Đang tải..."
            data={medicalSessions.data}
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
                fixed: "left",
                accessor: '_id',
                Cell: row => <div>
                  {row.index + 1 + (tableFiltered.page * tableFiltered.pageSize)}
                </div>
              },
              {
                width: 30,
                accessor: '_id',
                fixed: "left",
                Cell: row => <div>
                  <PopupState variant="popover" popupId="demo-popup-menu">
                    {(popupState) => (
                      <React.Fragment>
                        <MoreVert {...bindTrigger(popupState)} />
                        <Menu {...bindMenu(popupState)}>
                          <MenuItem onClick={e => dispatch(showReExaminationDialog({ data: row.original.patientInfo, patientCode: row.original.patientInfo.patientCode, onSuccess: fetchData }))}>Hẹn tái khám</MenuItem>
                          <MenuItem onClick={e => dispatch(showMedicalPrescriptionDialog({ _id: row.original._id, onSuccess: fetchData }))}>Tạo đơn thuốc</MenuItem>
                          <MenuItem onClick={e => dispatch(showMedicalConclusionDialog({ _id: row.original._id, onSuccess: fetchData }))}>Sửa kết luận khám</MenuItem>
                        </Menu>
                      </React.Fragment>
                    )}
                  </PopupState>
                </div>
              },
              {
                Header: "Mã KCB",
                width: 120,
                accessor: "appointment.code",
                fixed: "left",
                Cell: row => <div>{row.value ? row.value : "Chưa có mã KCB"}</div>
              },
              {
                Header: "Mã phiếu khám",
                accessor: "code",
                fixed: 'left',
                width: 200,
                filterable: false,
                Cell: row =>
                  <Button onClick={e => dispatch(showInfoDialog({ data: row.original, options: "medical_session" }))}>
                    {row.value}
                  </Button>
              },
              {
                Header: "Mã BN",
                fixed: 'left',
                accessor: "patientInfo.patientCode",
                width: 120,
              },
              {
                id: "patientInfo.fullName",
                fixed: 'left',
                Header: 'Tên khách hàng',
                accessor: 'patientInfo.fullName',
                width: 150,
              },
              {
                Header: 'Ngày sinh',
                width: 100,
                accessor: "patientInfo.birthDay",
                Cell: row => <div>{moment(row.value).format("DD/MM/YYYY")}</div>
              },
              {
                Header: 'Giới tính',
                accessor: 'patientInfo.gender',
                width: 80,
                Cell: row => <Typography>
                  {row.value === "1" ? "Nam" : "Nữ"}
                </Typography>
              },
              {
                id: 'department.code',
                Header: 'Khoa khám',
                accessor: 'department.name',
                Cell: row => <div>
                  {
                    row.value ? row.value : ""
                  }
                </div>
              },
              {
                id: 'clinic.code',
                Header: 'Phòng khám',
                accessor: 'clinic.name',
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
                Header: 'Chỉ định khám',
                accessor: 'indications',
                width: 250,
                className: "break-normal",
                style: { whiteSpace: "unset" },
                Cell: row => 
                  <Button
                    onClick={(e) => {
                      showIndication(row.original);
                    }}
                  >
                    Xem chỉ định
                  </Button>
              },
              {
                Header: 'Kết luận khám',
                accessor: 'conclusions',
                width: 250,
                className: "break-normal",
                style: { whiteSpace: "unset" },
                Cell: row => <div>
                  {
                    (!row || !row.value || row.value.length <= 0) ? "Chưa có kết luận khám" : 
                    row.value.map((item, index) => 
                      <div key={index}>
                        <b>{index + 1}.</b><u>{index == 0 ? " Bệnh chính:" : ""}</u>{` ${item.name}`}
                      </div>
                    )
                  }
                </div>
              },
              // {
              //   id: "process",
              //   Header: "Tình trạng",
              //   accessor: 'process',
              //   width: 180,
              //   fixed: 'right',
              //   Cell: row => <div>
              //     {
              //       row.value === "IN_QUEUE" ? <Typography className="text-12 uppercase">Tới khám</Typography>
              //         : row.value === "WATING_CONCLUSION" ? <Typography className="text-12 uppercase">Đang khám</Typography>
              //           : row.value === "CONCLUSION" ? <Typography className="text-12 uppercase">Đã khám</Typography>
              //             : <Typography className="text-12 uppercase">Hủy khám</Typography>
              //     }
              //   </div>
              // },
              {
                id: "createdTime",
                Header: 'Thời gian tạo',
                width: 100,
                fixed: 'right',
                accessor: 'createdTime',
                type: 'date',
                // className: "el-TableCell-DateTime-Badge",
                Cell: row => <div>
                  {moment(row.original.createdTime).format("HH:mm DD/MM")}
                </div>,
              },
            ]}
          />
        </div>
      }
    // innerScroll
    />
  );
}
