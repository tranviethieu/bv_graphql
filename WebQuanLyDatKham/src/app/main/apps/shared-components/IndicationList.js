import React, { useState, useEffect } from "react";
import gql from "graphql-tag";
import graphqlService from "app/services/graphqlService";
import { useDispatch } from "react-redux";
import _ from "lodash";
import { FuseChipSelect } from "@fuse";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import {
  Icon,
  IconButton,
  Divider,
  Typography,
  List,
  ListItem,
  ListItemText,
  FormControl,
} from "@material-ui/core";
import { showConfirmDialog } from "../shared-dialogs/actions";
import { hideDialog } from "app/store/actions";
import { showResultDialog } from "../works/indications/actions";

const QUERY_MEDICALSERVICES = gql`
  query (
    $page: Int
    $pageSize: Int
    $filtered: [FilteredInput]
    $sorted: [SortedInput]
  ) {
    response: medicalServices(
      page: $page
      pageSize: $pageSize
      filtered: $filtered
      sorted: $sorted
    ) {
      code
      message
      data {
        code
        name
        _id
        categoryCode
        viewCode
        unit
        info
      }
    }
  }
`;

const QUERY_INDICATION_BY_SESSION = gql`
  query ($code: String!) {
    response: indication_by_session(code: $code) {
      code
      message
      data {
        _id
        code
        name
        result
        state
        files {
          _id
          name
        }
      }
    }
  }
`;

const CREATE_INDICATION = gql`
  mutation ($data: IndicationInput) {
    response: create_indication(data: $data) {
      code
      message
    }
  }
`;

const TERMINATE_INDICATION = gql`
  mutation ($_id: String!, $reason: String) {
    response: terminate_indication(_id: $_id, reason: $reason) {
      code
      message
    }
  }
`;

function get_medical_services(dispatch) {
  return graphqlService.query(QUERY_MEDICALSERVICES, dispatch);
}
function create_indication(data, dispatch) {
  return graphqlService.mutate(CREATE_INDICATION, { data }, dispatch);
}
function terminate_indication(_id, dispatch) {
  return graphqlService.mutate(
    TERMINATE_INDICATION,
    { _id, reason: "" },
    dispatch
  );
}
function get_indication_history(code, dispatch) {
  return graphqlService.query(QUERY_INDICATION_BY_SESSION, { code }, dispatch);
}

const indicationFilterData = { page: 0, pageSize: 50, sorted: null };

export function IndicationList({ sessionProp }) {
  const dispatch = useDispatch();
  const [indicationServices, setIndicationServices] = useState([]);
  const [indicationHistory, setIndicationHistory] = useState({
    session: "",
    data: [],
  });
  const [indicationFilter, setIndicationFilter] = useState({
    id: "name,code,categoryCode",
    value: "",
  });

  //#region useEffect
  useEffect(() => {
    getIndicationServices();
  }, [indicationFilter]);

  useEffect(() => {
    getIndicationHistory();
  }, [sessionProp]);
  //#endregion

  function getIndicationServices() {
    const merged = {
      ...indicationFilterData,
      filtered: [indicationFilter],
    };
    get_medical_services(merged, dispatch).then((response) => {
      setIndicationServices(response.data);
    });
  }

  let searchIndicationServices = _.debounce((value) => {
    setIndicationFilter({ id: "name,code,categoryCode", value: value });
  }, 250);

  function onInputChangeIndication(value) {
    searchIndicationServices(value);
  }

  function createIndication(selected) {
    if (!sessionProp) return;
    if (sessionProp.process.toUpperCase() == "CONCLUSION") return;
    let { code } = sessionProp;
    let selectedService = indicationServices.filter(
      (i) => i._id == selected._id
    )[0];
    let serviceId = selectedService._id;
    create_indication({ sessionCode: code, serviceId }, dispatch).then(
      (response) => {
        if (response.code === 0) getIndicationHistory();
      }
    );
  }

  function terminateIndication(indication) {
    if (!indication || !indication._id) return;

    let mess = `Chỉ định ${indication.code}?<br/><span style="color:black">${indication.name}</span>`;

    dispatch(
      showConfirmDialog({
        title: "Xác nhận xóa chỉ định",
        message: mess,
        onSubmit: () => {
          terminate_indication(indication._id, dispatch).then((response) => {
            if (response.code === 0) getIndicationHistory();
          });
        },
      })
    );
  }

  function getIndicationHistory() {
    if (!sessionProp) return;
    let { code } = sessionProp;
    // if (!code || indicationHistory.session == code) return;
    if (!code) return;
    get_indication_history(code, dispatch).then((response) => {
      setIndicationHistory({
        session: code,
        data: response.data,
      });
    });
  }

  function hidden() {
    return (
      sessionProp == null ||
      sessionProp._id == null ||
      sessionProp._id == "" ||
      indicationHistory.session != sessionProp.code
    );
  }

  return (
    <div className="w-full">
      <FormControl component="div" className="w-full px-4">
        <FuseChipSelect
          fullWidth
          margin="dense"
          className="mt-8 mb-24"
          value={null}
          style={{ height: 20 }}
          onChange={createIndication}
          onInputChange={onInputChangeIndication}
          textFieldProps={{
            label: "Chọn chỉ định",
            InputLabelProps: {
              shrink: true,
            },
            variant: "outlined",
          }}
          options={indicationServices.map((n) => ({
            value: `${n.categoryCode}:${n.code}`,
            label: n.name,
            _id: n._id,
          }))}
          isDisabled={hidden() || sessionProp.process.toUpperCase() == "CONCLUSION"}
        />
        <Divider />
        <List
          dense
          component="div"
          role="list"
          className="flex flex-wrap flex-grow justify-begin content-start overflow-y-auto py-0 h-sm"
        >
          {hidden() ? (
            <Typography className="text-14 text-center my-2"></Typography>
          ) : (
            indicationHistory.data.map((item, index) => (
              <ListItem key={index} className="p-0" style={{}}>
                <ListItemText
                  primary={
                    <Typography className="text-14 my-2">
                      {item.name}
                    </Typography>
                  }
                  secondary={
                    <span>
                      {item.state.toLowerCase() == "pending" ? (
                        <React.Fragment>
                          <span>Chờ xử lý</span>
                          <span
                            className="flex justify-end"
                            style={{
                              float: "right",
                            }}
                          >
                            <span
                              className="mx-3 cursor-pointer text-red"
                              onClick={() => {
                                terminateIndication(item);
                              }}
                            >
                              Xóa
                            </span>
                          </span>
                        </React.Fragment>
                      ) : item.state.toLowerCase() == "confirm" ? (
                        <React.Fragment>
                          <span style={{ color: "#1aa6f7" }}>
                            Đang thực hiện
                          </span>
                        </React.Fragment>
                      ) : (
                        <React.Fragment>
                          <span style={{ color: "limegreen" }}>Hoàn thành</span>
                          <span
                            className="flex"
                            style={{
                              justifyContent: "flex-end",
                              float: "right",
                            }}
                          >
                            <span
                              className="mx-3 cursor-pointer"
                              style={{ color: "#1aa6f7" }}
                              onClick={(e) =>
                                dispatch(showResultDialog({ data: item }))
                              }
                            >
                              Kết quả
                            </span>
                          </span>
                        </React.Fragment>
                      )}
                      <Divider />
                    </span>
                  }
                />
              </ListItem>
            ))
          )}
        </List>
      </FormControl>
    </div>
  );
}

export function PendingIndicationList({ pendingIndications, setPendingIndications }) {
  const dispatch = useDispatch();
  const [indicationServices, setIndicationServices] = useState([]);
  const [indicationFilter, setIndicationFilter] = useState({
    id: "name,code,categoryCode",
    value: "",
  });

  //#region useEffect
  useEffect(() => {
    getIndicationServices();
  }, [indicationFilter]);
  //#endregion

  function getIndicationServices() {
    const merged = {
      ...indicationFilterData,
      filtered: [indicationFilter],
    };
    get_medical_services(merged, dispatch).then((response) => {
      setIndicationServices(response.data);
    });
  }

  let searchIndicationServices = _.debounce((value) => {
    setIndicationFilter({ id: "name,code,categoryCode", value: value });
  }, 250);

  function onInputChangeIndication(value) {
    searchIndicationServices(value);
  }

  function addPendingService(selected) {
    let selectedService = indicationServices.filter(
      (s) => s._id == selected._id
    )[0];
    if (pendingIndications.filter((s) => s._id == selectedService._id).length > 0)
      return;
    let appended = [...pendingIndications, selectedService];
    setPendingIndications(appended);
  }

  function removePendingService(selected) {
    if (!selected || !selected._id) return;
    let removed = pendingIndications.filter((s) => s._id != selected._id);
    if (removed.length >= pendingIndications.length) return;
    setPendingIndications(removed);
  }

  return (
    <div className="w-full">
      <FormControl component="div" className="w-full px-4">
        <FuseChipSelect
          fullWidth
          margin="dense"
          className="mt-8 mb-24"
          value={null}
          style={{ height: 20 }}
          onChange={addPendingService}
          onInputChange={onInputChangeIndication}
          textFieldProps={{
            label: "Chọn chỉ định",
            InputLabelProps: {
              shrink: true,
            },
            variant: "outlined",
          }}
          options={indicationServices.map((n) => ({
            value: `${n.categoryCode}:${n.code}`,
            label: n.name,
            _id: n._id,
          }))}
        />
        <Divider />
        <List
          dense
          component="div"
          role="list"
          className="flex flex-wrap flex-grow justify-begin content-start overflow-y-auto py-0 h-sm"
        >
          {pendingIndications &&
            pendingIndications.map((item, index) => (
              <ListItem key={index} className="p-0" style={{}}>
                <ListItemText
                  primary={
                    <Typography className="text-14 my-2">
                      {item.name}
                    </Typography>
                  }
                  secondary={
                    <span>
                      <span>Chưa xác nhận</span>
                      <span
                        className="flex"
                        style={{
                          justifyContent: "flex-end",
                          float: "right",
                        }}
                      >
                        <span
                          className="mx-3 cursor-pointer"
                          style={{ color: "red" }}
                          onClick={() => {
                            removePendingService(item);
                          }}
                        >
                          Xóa
                        </span>
                      </span>
                      <Divider />
                    </span>
                  }
                />
              </ListItem>
            ))}
        </List>
      </FormControl>
    </div>
  );
}

export function IndicationDialog({ sessionProp, onClose }) {
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(hideDialog("indication-dialog"));
    if (onClose) onClose();
  };
  return (
    <Card style={{ height: "70vh" }}>
      <CardHeader
        className="el-CardHeader-FU"
        action={
          <IconButton aria-label="settings" onClick={handleClose}>
            <Icon>close</Icon>
          </IconButton>
        }
        title="Chỉ Định"
        subheader={sessionProp.code || ""}
      />
      <CardContent
        className="el-CardContent-FU"
        style={{ height: "70vh", maxHeight: "70vh" }}
      >
        <IndicationList sessionProp={sessionProp} />
      </CardContent>
    </Card>
  );
}
