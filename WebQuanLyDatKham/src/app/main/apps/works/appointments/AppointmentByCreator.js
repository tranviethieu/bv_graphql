import React, { useState, useEffect } from "react";
import { FusePageSimple } from "@fuse";
import {
  Button,
  Icon,
  Typography,
  IconButton,
  Badge,
  Tooltip,
} from "@material-ui/core";
import { FuseAnimate } from "@fuse";
import { useDispatch } from "react-redux";
import * as Actions from "./actions";
import ReactTable from "react-table";
import * as StringUtils from "../../utils/StringUtils";
import moment from "moment";
import { makeStyles } from "@material-ui/styles";
import DemoFilter from "../../DemoFilter/TableFilter_2";
import withFixedColumns from "react-table-hoc-fixed-columns";
import "react-table-hoc-fixed-columns/lib/styles.css";

const ReactTableFixedColumns = withFixedColumns(ReactTable);

const useStyles = makeStyles((theme) => ({
  content: {
    "& canvas": {
      maxHeight: "100%",
    },
  },
}));

const filterAttributes = [
  {
    name: "departmentId",
    label: "Khoa khám",
    type: "select",
    className: "md:w-1/4 sm:w-1/4 mt-4 mr-8",
    isClearable: true,
  },
  {
    name: "appointmentDate",
    label: "Ngày đặt khám",
    type: "date",
    className: "md:w-1/4 sm:w-1/4 mt-8 mr-8",
  },
  {
    name: "state",
    label: "Tình trạng khám",
    type: "checkbox",
    defaultValue: ["APPROVE", "SERVED", "WAITING", "CANCEL"],
    options: [
      {
        value: "APPROVE",
        label: "Đã duyệt",
      },
      {
        value: "SERVED",
        label: "Đã đến khám",
      },
      {
        value: "WAITING",
        label: "Chưa xác nhận",
      },
      {
        value: "CANCEL",
        label: "Hủy khám",
      },
    ],
  },
];

export default function AppointmentByCreator(props) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [appointments, setAppointments] = useState({
    data: [],
    page: 0,
    records: 0,
  });
  const [departments, setDepartments] = useState([]);
  const [formFiltered, setFormFiltereds] = useState([
    { id: "state", value: "[APPROVE,WAITING,SERVED,CANCEL]" },
  ]);
  const [textFilter, setTextFilter] = useState({
    id: "inputPatient.fullName,inputPatient.address,inputPatient.phoneNumber,approver.code,approver.fullName",
    value: "",
  });
  const [tableFiltered, setTableFiltered] = useState({
    page: 0,
    pageSize: 10,
    sorted: [{ id: "createdTime", desc: true }],
  });
  function onTextSearch(text) {
    setTextFilter({
      id: "inputPatient.fullName,inputPatient.address,inputPatient.phoneNumber,approver.code,approver.fullName",
      value: text.trim(),
    });
  }
  function onSubmitCheck(listCheck, name) {
    var filtered = formFiltered.filter((item) => {
      return item.id !== name;
    });
    if (listCheck.length > 0) {
      setFormFiltereds([
        ...filtered,
        { id: name, value: `[${listCheck.toString()}]`, operation: "IN" },
      ]);
    } else {
      setFormFiltereds([...filtered, { id: name, value: "[]" }]);
    }
  }
  function onSubmitSelect(value, name) {
    var filtered = formFiltered.filter((item) => {
      return item.id !== name;
    });
    const mergedFilter = [...filtered, { id: name, value: value.value }];
    setFormFiltereds(mergedFilter);
  }
  function onSubmitDate(name, date) {
    var filtered = formFiltered.filter((item) => {
      return item.id !== name;
    });
    const mergedFilter = [...filtered, { id: name, value: date }];
    setFormFiltereds(mergedFilter);
  }
  const fetchData = () => {
    var merged = {
      ...tableFiltered,
      filtered: [...formFiltered, textFilter],
      sorted: [{ id: "createdTime", desc: true }],
    };

    Actions.get_appointments(merged, dispatch).then((response) => {
      setAppointments(response);
    });
  };
  const onChangeTable = (state) => {
    let { page, pageSize, filtered } = state;
    setTableFiltered({ ...tableFiltered, page, pageSize, filtered });
  };
  useEffect(() => {
    Actions.get_departments(dispatch).then((response) => {
      setDepartments(response.data);
    });
  }, []);

  useEffect(() => {
    fetchData();
  }, [formFiltered, textFilter, tableFiltered]);

  return (
    <FusePageSimple
      id="el-ReportGeneralSMSs-Cover"
      classes={{
        toolbar: "min-h-80",
        rightSidebar: "w-288",
        content: classes.content,
      }}
      header={
        <div className="flex flex-1 w-full items-center justify-between p-24 el-HeaderPage">
          <div className="flex flex-col">
            <div className="flex items-center mb-4">
              <Icon className="text-18 el-TitleIcon" color="action">
                home
              </Icon>
              <Icon className="text-16 el-TitleIcon" color="action">
                chevron_right
              </Icon>
              <Typography color="textSecondary">Trang làm việc</Typography>
            </div>
            <FuseAnimate>
              <Typography variant="h6">
                {appointments.records} Lịch khám đã đặt
              </Typography>
            </FuseAnimate>
          </div>
        </div>
      }
      content={
        <div className="p-12 el-coverContent">
          <div className="el-block-report">
            <Typography className="pl-12 text-15 font-bold block-tittle">
              Lọc dữ liệu:
            </Typography>
            <DemoFilter
              className="el-fillter-report-action"
              searchOption={{
                onTextSearch,
                hideButton: true,
                className: "md:w-1/5 sm:w-1/5",
              }}
              filterOption={{
                bonusOptions: [{ name: "departmentId", options: departments }],
                attributes: filterAttributes,
                onSubmitCheck,
                onSubmitSelect,
                onSubmitDate,
              }}
            />
          </div>
          <div className="el-block-report">
            <ReactTableFixedColumns
              manual
              className="-striped -highlight h-full w-full el-TableUserAction"
              data={appointments.data && appointments.data}
              pages={appointments.pages}
              defaultPageSize={10}
              onFetchData={onChangeTable}
              // onPageChange={setPage}
              noDataText="Không có dữ liệu nào"
              defaultSorted={[
                {
                  id: "createdTime",
                  desc: true,
                },
              ]}
              sortable={false}
              columns={[
                {
                  Header: "#",
                  width: 30,
                  accessor: "_id",
                  fixed: "left",
                  Cell: (row) => (
                    <div>
                      {row.index +
                        1 +
                        tableFiltered.page * tableFiltered.pageSize}
                    </div>
                  ),
                },
                {
                  id: "createdTime",
                  Header: "Thời gian đặt",
                  fixed: "left",
                  width: 100,
                  accessor: "createdTime",
                  type: "date",
                  // className: "el-TableCell-DateTime-Badge",
                  Cell: (row) => (
                    <div className="pl-12">
                      {moment(row.original.createdTime).format("HH:mm DD/MM")}
                    </div>
                  ),
                },
                {
                  id: "appointmentDate",
                  Header: "Thời gian khám",
                  fixed: "left",
                  width: 100,
                  accessor: "appointmentDate",
                  type: "date",
                  // className: "el-TableCell-DateTime-Badge",
                  Cell: (row) => (
                    <div className="pl-12">
                      {/* <Badge
                        badgeContent={row.value}
                        color="secondary"
                        anchorOrigin={{
                          horizontal: "left",
                          vertical: "top",
                        }}
                      >
                        <span className="pl-24"></span>
                      </Badge> */}
                      {moment(row.value).format("DD/MM")}
                    </div>
                  ),
                },
                // {
                //   Header: "Tác vụ",
                //   accessor: "_id",
                //   fixed: "left",
                //   width: 80,
                //   filterable: false,
                //   Cell: (row) => (
                //     <div>
                //       <Tooltip
                //         title={
                //           row.original.inputPatient &&
                //           row.original.inputPatient.phoneNumber
                //         }
                //         placement="bottom"
                //       >
                //         <IconButton
                //           onClick={(e) =>
                //             dispatch(
                //               toggleCallPanel(
                //                 row.original.inputPatient.phoneNumber
                //               )
                //             )
                //           }
                //         >
                //           <Icon className="text-green">call</Icon>
                //         </IconButton>
                //       </Tooltip>
                //     </div>
                //   ),
                // },
                // {
                //   Header: "Mã BN",
                //   accessor: "patientCode",
                //   minWidth: 150,
                //   Cell: (row) => (
                //     <Button
                //       onClick={(e) =>
                //         dispatch(
                //           showAppointmentDialog({
                //             _id: row.original._id,
                //             onSuccess: fetchData,
                //           })
                //         )
                //       }
                //     >
                //       {row.value}
                //     </Button>
                //   ),
                // },
                {
                  id: "inputPatient.FullName",
                  Header: "Tên khách hàng",
                  accessor: "inputPatient.fullName",
                  width: 150,
                },
                {
                  Header: "Số ĐT",
                  accessor: "inputPatient.phoneNumber",
                  width: 100,
                },
                {
                  Header: "Ngày sinh",
                  width: 100,
                  accessor: "inputPatient.birthDay",
                  Cell: (row) => (
                    <div>{moment(row.value).format("DD/MM/YYYY")} </div>
                  ),
                },
                {
                  Header: "Giới tính",
                  accessor: "inputPatient.gender",
                  width: 80,
                  Cell: (row) => (
                    <Typography>{row.value === "1" ? "Nam" : "Nữ"}</Typography>
                  ),
                },
                {
                  id: "departmentId",
                  Header: "Khoa khám",
                  accessor: "department.name",
                  type: "select",
                  options: departments,
                  minWidth: 150,
                  Cell: (row) => <div>{row.value ? row.value : ""}</div>,
                },
                {
                  id: "approver.fullName",
                  Header: "Đại lý",
                  accessor: "approver.fullName",
                  minWidth: 175,
                  Cell: (row) => <Typography>{row.value}</Typography>,
                },
                {
                  Header: "Nội dung khám",
                  accessor: "note",
                  width: 150,
                  Cell: (row) => (
                    <Tooltip title={row.value || ""} placement="bottom">
                      <Typography className="text-12">{row.value}</Typography>
                    </Tooltip>
                  ),
                },
                // {
                //   id: "channel",
                //   Header: "Đặt từ",
                //   width: 150,
                //   accessor: "channel",
                //   Cell: (row) => (
                //     <div>{StringUtils.parseChannel(row.value)}</div>
                //   ),
                // },
                // {
                //   Header: "Tái khám",
                //   accessor: "followByDoctor",
                //   fixed: "right",
                //   minWidth: 80,
                //   Cell: (row) => (
                //     <div>
                //       {row.value === true ? (
                //         <Icon className="text-blue">check</Icon>
                //       ) : (
                //         ""
                //       )}
                //     </div>
                //   ),
                // },
                {
                  id: "state",
                  Header: "Tình trạng",
                  fixed: "right",
                  accessor: "state",
                  width: 120,
                  Cell: (row) => (
                    <div>
                      {row.value === "CANCEL" ? (
                        <Typography>Đã hủy</Typography>
                      ) : row.value === "SERVED" ? (
                        <Typography>Đã đến khám</Typography>
                      ) : row.value === "APPROVE" ? (
                        <Typography>Đã duyệt</Typography>
                      ) : (
                        <Typography>Chưa xác nhận</Typography>
                      )}
                    </div>
                  ),
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
