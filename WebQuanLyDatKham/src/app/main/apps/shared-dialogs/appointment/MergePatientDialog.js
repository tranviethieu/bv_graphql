import React, { useState, useEffect, useMemo } from "react";
import { useForm } from "@fuse/hooks";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import viLocale from "date-fns/locale/vi";
import { showMessage } from "app/store/actions";
import { useDispatch } from "react-redux";
import clsx from "clsx";
import _ from "lodash";
import * as Actions from "./actions";
import {
  Icon,
  Button,
  ButtonGroup,
  TextField,
  Checkbox,
  FormControlLabel,
  Divider,
  Typography,
  IconButton,
  List,
  ListItem,
  Avatar,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  CardActions,
  CardContent,
  Card,
  CardHeader,
  TextareaAutosize,
  FormControl,
} from "@material-ui/core";
import moment from "moment";
import { FuseChipSelect } from "@fuse";
import { makeStyles } from "@material-ui/core/styles";
import { showConfirmDialog } from "../../shared-dialogs/actions";
import { hideMergePatientDialog, showMergePatientDialog } from "../actions";
import { showAppointmentDialog } from "../actions";
import ReactTable from "react-table";
import withFixedColumns from "react-table-hoc-fixed-columns";

const ReactTableFixedColumns = withFixedColumns(ReactTable);

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: "36ch",
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: "inline",
  },
  table: {
    '& .rt-tr': {

    }
  },
}));

export default function MergePatientDialog({ user, onSelectPatient }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [listId, setListId] = useState([]);
  const [matchPatient, setMatchPatient] = useState({ data: [], children: [] });
  const [expandedTable, setExpandedTable] = useState({});
  const handleClose = () => {
    dispatch(hideMergePatientDialog());
  };

  const clickRow = (_id) => {
    let filtered = listId.filter((i) => i.id == _id);
    if (filtered.length == 0) {
      let updatedList = [...listId, { id: _id, ts: new Date().getTime() }];
      setListId(updatedList);
      return;
    }

    let updatedList = listId.filter((i) => i.id != _id);
    setListId(updatedList);

    let ts = new Date().getTime();
    let clickInfo = filtered[0];

    if (clickInfo.ts + 300 > ts) {
      // double click trong 300ms, call confirmPatient
      confirmPatient({ _id });
      return;
    }
  };

  useEffect(() => {
    searchPatient();
  }, [user]);

  function searchPatient() {
    let searchUser = { ...user };
    searchUser.birthDay = moment(user.birthDay).isValid()
      ? user.birthDay
      : new Date();
    searchUser.phoneNumber = '';
    searchUser.patientCode = '';
    Actions.get_patient_to_merge(searchUser, dispatch).then((response) => {
      let matchs = response.data.reduce(
        (all, p) => {
          let pushed = p;
          if (p.children.length > 0) {
            // check master data đã có chưa, vì có thể tìm bằng mã bn hoặc số đt
            let master = p.children[0].masterPatient;
            let checkMaster = p.data.filter(p => p.patientCode == master.patientCode);
            pushed = {
              data: checkMaster.length > 0 ? p.data : [...p.data, ...[master]],
              children: p.children,
            };
          }
          pushed.data = pushed.data.map((p) => ({
            ...p,
            ...{
              fullName: p.fullName.toUpperCase(),
              // pivot: `${p.fullName.toUpperCase()} | ${moment(p.birthDay).format(
              //   "YYYY-MM-DD"
              // )}`,
            },
          }));
          pushed.children = pushed.children.map((p) => ({
            ...p,
            ...{
              fullName: p.fullName.toUpperCase(),
              // pivot: `${p.fullName.toUpperCase()} | ${moment(p.birthDay).format(
              //   "YYYY-MM-DD"
              // )}`,
            },
          }));

          return {
            data: [...all.data, ...pushed.data],
            children: [...all.children, ...pushed.children],
          };
        },
        { data: [], children: [] }
      );

      matchs.data.sort(
        (a, b) =>
          new Date(a.birthDay).getTime() - new Date(b.birthDay).getTime()
      );
      matchs.data.sort((a, b) =>
        (a.fullName ? `${a.fullName}` : "").localeCompare(
          b.fullName ? `${b.fullName}` : ""
        )
      );
      setMatchPatient({ ...matchs });

      // let expand = matchs.data
      //   .map((d, i) => ({ [i]: true }))
      //   .reduce((all, d) => ({ ...all, ...d }), {});
      // setExpandedTable(expand);
    });
  }

  function mergePatient() {
    if (listId.length < 2) {
      return dispatch(
        showMessage({ message: "Bạn phải chọn ít nhất 2 bệnh nhân" })
      );
    }

    let _listId = listId.map((i) => i.id);

    let ref = matchPatient.data.find((p) => p._id == _listId[0]);

    Actions.merge_patient(
      {
        info: {
          phoneNumber: "",
          fullName: ref.fullName,
          birthDay: ref.birthDay,
        },
        childIds: _listId,
      },
      dispatch
    ).then((response) => {
      console.log("merge_patient: ", response);
      dispatch(showMessage({ message: "Gôp thông tin bệnh nhân thành công!" }));
      searchPatient();
    });
  }

  function confirmPatient({ _id }) {
    if (!_id) {
      if (listId.length > 1) {
        return dispatch(
          showMessage({ message: "Bạn chỉ được chọn 1 bệnh nhân" })
        );
      }
      if (listId.length == 0) {
        return dispatch(showMessage({ message: "Bạn chưa chọn bệnh nhân" }));
      }
    }

    let selectedId = _id ? _id : listId[0].id;
    let userData = matchPatient.data.filter((i) => i._id == selectedId)[0];
    let sentUser = _.omit(userData, ["pivot", "checkbox"]);
    onSelectPatient(sentUser);
    dispatch(hideMergePatientDialog());
  }

  function showData() {
    return matchPatient && matchPatient.data;
  }

  return (
    <Card>
      <CardHeader
        className="el-CardHeader-FU"
        action={
          <IconButton aria-label="settings" onClick={handleClose}>
            <Icon>close</Icon>
          </IconButton>
        }
        title="Xác nhận thông tin bệnh nhân phù hợp"
        subheader=""
      />
      <CardActions disableSpacing className="ml-8">
        <div style={{ display: "flex", marginTop: "1vh" }}>
          <Typography className="pl-12 text-15">
            Tick chọn vào thông tin bệnh nhận bạn muốn gộp và chọn{" "}
          </Typography>
          <Button
            style={{ marginLeft: "1vh", marginTop: "-1vh" }}
            className="btn-blue"
            onClick={mergePatient}
            variant="contained"
          >
            Gộp thông tin
          </Button>
        </div>
      </CardActions>
      <CardContent className="" style={{ height: "50vh" }}>
        {useMemo(
          () => (
            <ReactTableFixedColumns
              manual
              className={clsx(classes.table, "-striped -highlight h-full w-full el-TableUserAction")}
              data={showData()}
              loading={!showData()}
              noDataText="Không có dữ liệu nào"
              showPagination={false}
              sortable={false}
              getTrProps={(state, rowInfo, column) => {
                return {
                  onClick: (e, handleOriginal) => {
                    if (!rowInfo.groupedByPivot) clickRow(rowInfo.original._id);
                  },
                  style: {
                    cursor: "pointer"
                  }
                };
              }}
              // pivotBy={["pivot"]}
              // expanded={expandedTable}
              columns={[
                // {
                //   accessor: "pivot",
                // },
                {
                  width: 20,
                  accessor: "checkbox",
                  fixed: "left",
                  Cell: (row) => (
                    <input
                      type="checkbox"
                      checked={
                        listId.filter((i) => i.id == row.original._id).length >
                        0
                      }
                      readOnly
                    />
                  ),
                },
                {
                  Header: "Trạng thái",
                  width: 110,
                  accessor: "syncType",
                  fixed: "left",
                  aggregate: (values, rows) => values,
                  Aggregated: (row) => <div></div>,
                  Cell: (row) =>
                    row.original.syncType == "NONE" ? (
                      <div style={{ color: "teal" }}>Chưa đồng bộ</div>
                    ) : (
                      <div style={{ color: "limegreen" }}>Đã đồng bộ</div>
                    ),
                },
                {
                  Header: "Mã BN",
                  width: 110,
                  accessor: "patientCode",
                  fixed: "left",
                  Aggregated: (row) => <div></div>,
                  Cell: (row) => (
                    <div>{row.original.patientCode ?? "Chưa có"}</div>
                  ),
                },
                {
                  id: "fullName",
                  Header: "Tên khách hàng",
                  accessor: "fullName",
                  width: 150,
                  fixed: "left",
                  Aggregated: (row) => <div></div>,
                  Cell: (row) => <div>{row.original.fullName}</div>,
                },
                {
                  Header: "Ngày sinh",
                  width: 100,
                  accessor: "birthDay",
                  fixed: "left",
                  Aggregated: (row) => <div></div>,
                  Cell: (row) => (
                    <div>
                      {moment(row.original.birthDay).format("DD/MM/YYYY")}
                    </div>
                  ),
                },
                {
                  Header: "Giới tính",
                  accessor: "gender",
                  fixed: "left",
                  Aggregated: (row) => <div></div>,
                  Cell: (row) => (
                    <Typography>
                      {
                        ["", "Nam", "Nữ", "Giới tính khác"][
                        +row.original.gender
                        ]
                      }
                    </Typography>
                  ),
                },
                {
                  Header: "Địa chỉ",
                  width: 300,
                  accessor: "address",
                  fixed: "left",
                  Aggregated: (row) => <div></div>,
                  Cell: (row) => <div> {row.original.address} </div>,
                },
                {
                  Header: "Số điện thoại",
                  width: 100,
                  accessor: "phoneNumber",
                  fixed: "left",
                  Aggregated: (row) => <div></div>,
                  Cell: (row) => <div> {row.original.phoneNumber} </div>,
                },
                {
                  Header: "BHYT",
                  width: 110,
                  accessor: "insuranceCode",
                  fixed: "left",
                  Aggregated: (row) => <div></div>,
                  Cell: (row) => (
                    <div>{row.original.insuranceCode ?? "Chưa có"}</div>
                  ),
                },
              ]}
            />
          ),
          [matchPatient, listId]
        )}
      </CardContent>
      <CardActions disableSpacing className="ml-8">
        <div style={{ display: "flex" }}>
          <Typography className="pl-12 text-15">
            Để lựa chọn thông tin bệnh nhân, nháy đúp hoặc tick chọn bệnh nhân
            và chọn{" "}
          </Typography>
          <Button
            style={{ marginLeft: "1vh", marginTop: "-1vh" }}
            className="btn-blue"
            onClick={confirmPatient}
            variant="contained"
          >
            Xác nhận
          </Button>
        </div>
      </CardActions>
    </Card>
  );
}
