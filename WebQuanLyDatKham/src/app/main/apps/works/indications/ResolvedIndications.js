import React, { useState, useEffect } from "react";
import { FusePageCarded } from "@fuse";
import {
  Button,
  Icon,
  Typography,
  Tooltip,
  Menu,
  MenuItem,
} from "@material-ui/core";
import { FuseAnimate } from "@fuse";
import { useDispatch } from "react-redux";
import * as Actions from "./actions";
import ReactTable from "react-table";
import moment from "moment";
import { showInfoDialog } from "../../shared-dialogs/actions/AppointmentDialog.action";
import DemoFilter from "../../DemoFilter/TableFilter";
import DemoFilter2 from "../../DemoFilter/TableFilter_2";
import { showResultDialog } from "./actions";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import { MoreVert } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
  table: {
    "& .rt-tbody": {
      overflow: "visible !important",
    },
  },
}));

export default function ResolvedIndications(props) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [medicalSessions, setMedicalSessions] = useState({
    data: [],
    page: 0,
    records: 0,
  });
  const [formFiltered, setFormFiltereds] = useState([
    { id: "state", value: "RESOLVE" },
  ]);
  const [textFilter, setTextFilter] = useState({
    id: "textSearch",
    value: "",
  });
  const [tableFiltered, setTableFiltered] = useState({
    page: 0,
    pageSize: 10,
    sorted: [{ id: "_id", desc: true }],
    // sorted: [{ id: "createdTime", desc: true }],
  });
  const [loading, setLoading] = useState(false);

  function onTextSearch(text) {
    setTextFilter({
      id: "textSearch",
      value: text,
    });
  }

  function onSubmitFilter(filtered) {
    const keys = Object.keys(filtered);
    //convert object to array here
    setFormFiltereds(
      keys.map((id) => ({
        id,
        value: filtered[id].toString(),
      }))
    );
  }
  function onSubmitCheck(listCheck, name) {
    if (listCheck.length > 0) {
      setFormFiltereds([
        { id: name, value: `[${listCheck.toString()}]`, operation: "IN" },
      ]);
    } else {
      setFormFiltereds([]);
    }
  }
  const fetchData = () => {
    //do chỉ lọc những bệnh nhân đã được xác nhận nên phải lọc theo trạng thái approve
    var merged = { ...tableFiltered, filtered: [...formFiltered, textFilter] };
    setLoading(true);
    Actions.get_indications(merged, dispatch).then((response) => {
      setMedicalSessions(response);
      setLoading(false);
    });
  };
  const onChangeTable = (state) => {
    let { page, pageSize, filtered } = state;
    setTableFiltered({ ...tableFiltered, page, pageSize, filtered });
  };

  function stripHtml(html) {
    html = html.replace(/\\n/g, "\n").replace(/<br\s?\/?>/gi, "\n");
    let tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    let text = tmp.textContent || tmp.innerText || "";
    return text;
  }

  useEffect(() => {
    fetchData();
  }, [formFiltered, textFilter, tableFiltered]);
  return (
    <FusePageCarded
      classes={{
        content: "flex",
        header: "min-h-72 h-72 sm:h-136 sm:min-h-136",
      }}
      header={
        <div className="flex flex-1 w-full items-center justify-between el-HeaderPage">
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
                {medicalSessions.records.toLocaleString("vi-VN")} Chỉ định đã
                hoàn thành
              </Typography>
            </FuseAnimate>
          </div>
          <DemoFilter
            searchOption={{ onTextSearch, hideButton: true }}
            placeHolder="Họ tên, SĐT, Mã BN/Phiên khám"
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
      content={
        <div className="el-cover-table">
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
            className={clsx(
              classes.table,
              "-striped -highlight h-full w-full sm:rounded-8 overflow-hidden el-TableUserAction"
            )}
            loading={loading}
            loadingText="Đang tải..."
            data={medicalSessions.data}
            pages={medicalSessions.pages}
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
                Cell: (row) => (
                  <div>
                    {row.index +
                      1 +
                      tableFiltered.page * tableFiltered.pageSize}
                  </div>
                ),
              },
              {
                width: 30,
                accessor: "_id",
                Cell: (row) => (
                  <div>
                    <PopupState variant="popover" popupId="demo-popup-menu">
                      {(popupState) => (
                        <React.Fragment>
                          <MoreVert {...bindTrigger(popupState)} />
                          <Menu {...bindMenu(popupState)}>
                            <MenuItem
                              onClick={(e) => {
                                popupState.close();
                                dispatch(
                                  showResultDialog({
                                    data: row.original,
                                    onSuccess: fetchData,
                                  })
                                );
                              }}
                            >
                              Cập nhật kết quả chỉ định
                            </MenuItem>
                          </Menu>
                        </React.Fragment>
                      )}
                    </PopupState>
                  </div>
                ),
              },
              {
                Header: "Mã khám",
                accessor: "sessionCode",
                width: 150,
                filterable: false,
                Cell: (row) => (
                  <Button
                    onClick={(e) =>
                      dispatch(
                        showInfoDialog({
                          data: row.original,
                          options: "indication",
                        })
                      )
                    }
                  >
                    {row.value}
                  </Button>
                ),
              },
              // {
              //   Header: "Mã chỉ định",
              //   accessor: "code",
              //   maxWidth: 100,
              // },
              {
                Header: "Mã BN",
                accessor: "patientInfo.patientCode",
                maxWidth: 125,
              },
              {
                id: "patientInfo.fullName",
                Header: "Tên khách hàng",
                accessor: "patientInfo.fullName",
              },
              {
                Header: "Ngày sinh",
                width: 100,
                accessor: "patientInfo.birthDay",
                Cell: (row) => (
                  <div>{moment(row.value).format("DD/MM/YYYY")}</div>
                ),
              },
              {
                Header: "Giới tính",
                accessor: "patientInfo.gender",
                width: 80,
                Cell: (row) => (
                  <Typography>{row.value === "1" ? "Nam" : "Nữ"}</Typography>
                ),
              },
              {
                id: "department.code",
                Header: "Khoa phòng",
                accessor: "department.name",
                Cell: (row) => (
                  <div>
                    {`${row.value || ""}${
                      row.original.clinic
                        ? ` / ${row.original.clinic.name}`
                        : ""
                    }`}
                  </div>
                ),
              },
              {
                Header: "Dịch vụ",
                accessor: "service.name",
                Cell: (row) => (
                  <Tooltip title={row.value || ""} placement="bottom">
                    <Typography className="text-12">{row.value}</Typography>
                  </Tooltip>
                ),
              },
              {
                width: 400,
                Header: "Kết luận",
                // accessor: "result",
                accessor: "detail_results",
                Cell: (row) => (
                  // <Tooltip
                  //   title={
                  //     <Typography className="text-12 whitespace-pre-wrap">
                  //       {stripHtml(row.value[0].result)}
                  //     </Typography>
                  //   }
                  //   placement="bottom"
                  // >
                    <Typography className="text-12 whitespace-pre-wrap">
                      {stripHtml(row.value != null ? row.value.result : (row.origin ? row.origin.result : ""))}
                    </Typography>
                  // </Tooltip>
                ),
              },
              // {
              //   id: "state",
              //   Header: "Tình trạng",
              //   accessor: 'state',
              //   Cell: row => <div>
              //     {
              //       row.value === "PENDING" ? <Typography className = "text-12 uppercase">Chờ xử lý</Typography>
              //       : row.value === "CONFIRM" ? <Typography className = "text-12 uppercase">Đang thực hiện</Typography>
              //       : <Typography className = "text-12 uppercase">Đã hoàn thành</Typography>
              //     }
              //   </div>
              // },
              {
                id: "createdTime",
                Header: "Thời gian tạo",
                accessor: "createdTime",
                type: "date",
                // className: "el-TableCell-DateTime-Badge",
                Cell: (row) => (
                  <div className="pl-12">
                    {moment(row.original.createdTime).format("HH:mm DD/MM")}
                  </div>
                ),
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
