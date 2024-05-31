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
import { hideAppointmentDialog, showMergePatientDialog } from "../actions";
import {
  Icon,
  Button,
  ButtonGroup,
  TextField,
  Checkbox,
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
import {
  IndicationList,
  PendingIndicationList,
} from "../../shared-components/IndicationList";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: "36ch",
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: "inline",
  },
  errorDisable: {
    color: theme.palette.error.light,
  },
  error: {
    color: theme.palette.error.main,
    "&:disabled": {
      color: theme.palette.error.light,
    },
  },
}));

const defaultUser = {
  birthDay: new Date(),
  gender: "2",
  firstName: "",
  lastName: "",
  phoneNumber: "",
  nation: {
    code: "25",
    name: "Kinh",
  },
  nationality: {
    code: "1",
    name: "Việt Nam",
  },
  work: {
    code: "19",
    name: "Đối tượng khác",
  },
};
const defaultAppointment = {
  appointmentDate: new Date(),
  note: "",
  patientCode: "",
  patient: defaultUser,
  departmentId: null,
  serviceDemandId: null,
  // chứa indication services và thông tin đặt khám
  session: {},
  state: "NEW",
};
const defaultQuery = {
  patientCode: "",
  phoneNumber: "",
  fullName: "",
  birthDay: "",
};
const defaultMatchPatient = { data: [], children: [] };
const defaultSessionData = {
  indications: [],
  services: [],
  serviceDemandId: null,
  departmentId: null,
  appointmentDate: new Date(),
  appointmentTime: null,
  note: "",
};

///có 2 tình huống xảy ra là truyền _id vào hoặc phoneNumber vào, khi đó sẽ ưu tiên load theo _id trước
export default function AppointmentDialog({
  phoneNumber,
  data,
  _id,
  onSuccess,
}) {
  const dispatch = useDispatch();
  const classes = useStyles();

  const handleClose = () => {
    dispatch(hideAppointmentDialog());
  };
  const [serviceData, setServiceData] = useState({});
  const [departments, setDepartments] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [wards, setWards] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [works, setWorks] = useState([]);
  const [nations, setNations] = useState([]);
  const [nationalitys, setNationalitys] = useState([]);
  const { form, setForm, setInForm, handleChange } =
    useForm(defaultAppointment);
  const [queryPatient, setQueryPatient] = useState(defaultQuery);
  const [matchPatient, setMatchPatient] = useState(defaultMatchPatient);
  const [timeFrame, setTimeFrame] = useState([]);
  const [sessionHistory, setSessionHistory] = useState({ code: "", data: [] });
  const [selectedSessionIndex, setSelectedSessionIndex] = useState(-1);

  // dùng để lock input k cho sửa thông tin
  // ['user', 'appointment']
  const [lockStep, setLockStep] = useState([]);

  // #region useEffect
  useEffect(() => {
    loadDefaultData();
    if (_id) {
      Actions.get_appointment(_id, dispatch).then((response) => {
        let formData = response.data;

        if (["APPROVE", "SERVED"].includes(formData.state.toUpperCase()))
          setLockStep([...lockStep, "user", "appointment"]);

        let patient = formData.patient || formData.inputPatient || defaultUser;
        patient.fullName = patient.fullName.toUpperCase();

        if (formData.patientCode == null) {
          patient = formData.inputPatient;
        }

        let session = {
          ...defaultSessionData,
          ..._.pick(formData, [
            "serviceDemandId",
            "departmentId",
            "appointmentDate",
            "appointmentTime",
            "note",
          ]),
        };
        setForm({ ...formData, patient, session });
        searchPatientMerge(patient);
      });
    } else if (data) {
      let patient = data || defaultUser;
      patient.fullName = patient.fullName.toUpperCase();
      let newForm = { ...form, patient };
      setForm(newForm);
      searchPatientMerge(data);
    } else if (phoneNumber) {
      Actions.getUserByPhone(phoneNumber, dispatch).then((response) => {
        let patient = response.data || { ...defaultUser, phoneNumber };
        patient.fullName = patient.fullName.toUpperCase();
        let newForm = { ...form, patient };
        setForm(newForm);
      });
    } else {
      setForm({ ...form, session: defaultSessionData });
    }
  }, [phoneNumber, _id]);

  useEffect(() => {
    if (form.patient.province) {
      Actions.get_districts(
        {
          filtered: [
            {
              id: "provinceCode",
              value: form.patient.province.code,
              operation: "==",
            },
          ],
        },
        dispatch
      ).then((response) => {
        setDistricts(response.data);
        if (
          form.patient.district &&
          !response.data.find((d) => d.code === form.patient.district.code)
        ) {
          setInForm("patient.district", null);
          setInForm("patient.ward", null);
        }
      });
    } else {
      setDistricts([]);
      setWards([]);
    }
  }, [form.patient.province]);

  useEffect(() => {
    if (form.patient.district) {
      Actions.get_wards(
        {
          filtered: [
            {
              id: "districtCode",
              value: form.patient.district.code,
              operation: "==",
            },
          ],
        },
        dispatch
      ).then((response) => {
        setWards(response.data);
        if (
          form.patient.ward &&
          !response.data.find((d) => d.code === form.patient.ward.code)
        ) {
          setInForm("patient.ward", null);
        }
      });
    } else {
      setWards([]);
    }
  }, [form.patient.district]);

  useEffect(() => {
    if (
      form.patientCode ||
      (moment(form.patient.birthDay).isValid() && form.patient.fullName)
    ) {
      searchPatientMerge();
    }
  }, [form.patient]);

  useEffect(() => {
    if (!form.session.departmentId) return;

    let deptInfo = departments.find((d) => d._id === form.session.departmentId);
    if (!deptInfo || !deptInfo.enableTimeFrame) return;

    if (
      !form.session.appointmentDate ||
      !moment(form.session.appointmentDate).isValid()
    )
      return;

    Actions.get_timeframe(
      form.session.departmentId,
      form.session.appointmentDate,
      dispatch
    ).then((response) => {
      let times = [];
      if (response.code === 0) {
        times = response.data.timeFrame.map((t) => {
          let timeOver = moment().isAfter(
            moment(
              `${moment(form.session.appointmentDate).format("YYYY-MM-DD")} ${t.time
              }`
            )
          );
          return { ...t, timeOver };
        });
      }

      setTimeFrame(times);
    });
  }, [form.session.departmentId, form.session.appointmentDate]);

  useEffect(() => {
    if (!serviceData.hasOwnProperty("0") || !form.serviceDemandId) return;

    let path = findServicesPath(form.serviceDemandId);
    setInForm("session.services", path);
  }, [serviceData, form.serviceDemandId]);

  useEffect(() => {
    getSessionHistory();
  }, [matchPatient]);

  useEffect(() => {
    if (selectedSessionIndex >= 0) setSelectedSessionIndex(-1);
  }, [sessionHistory]);
  // #endregion

  //load toan bo du lieu lien quan den user
  function loadDefaultData() {
    Actions.get_works(dispatch).then((response) => {
      setWorks(response.data);
    });
    Actions.get_nations(dispatch).then((response) => {
      setNations(response.data);
    });
    Actions.get_nationalitys(dispatch).then((response) => {
      setNationalitys(response.data);
    });
    Actions.get_provinces(dispatch).then((response) => {
      setProvinces(response.data);
      loadDefaultProvince(response.data);
    });
    Actions.get_departments(dispatch).then((response) => {
      updateDepartments(response.data);
    });
    Actions.get_services(dispatch).then((response) => {
      createServiceTree(response.data);
    });
  }

  function updateDepartments(data) {
    let dayOfWeek = [
      "SUNDAY",
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
    ];

    let formated = data.map((dept) => {
      let workingDays = dayOfWeek
        .map((day, i) => ({
          i,
          ...dept.servingTimes.find((t) => t.dayOfWeek == day),
        }))
        .reduce((obj, d) => {
          obj[d.i] = d;
          return obj;
        }, {});
      dept.workingDays = workingDays;
      return dept;
    });
    setDepartments(formated);
  }

  function loadDefaultProvince(provincesList) {
    let defaultProvinceCode = process.env.REACT_APP_DEFAULT_PROVINCE_CODE;
    if (!defaultProvinceCode) return;

    let provinceInfo = provincesList.filter(
      (p) => p.code == defaultProvinceCode
    )[0];
    if (!provinceInfo) return;
    setInForm("patient.province", provinceInfo);
  }

  function searchPatientMerge(inputPatient, callback) {
    let patient = inputPatient || form.patient;
    patient.patientCode = patient.patientCode || form.patientCode;
    if (!patient.patientCode && !patient.phoneNumber && !patient.fullName)
      return;

    var sentPatient = _.pick(patient, [
      "patientCode",
      "phoneNumber",
      "fullName",
      "birthDay",
    ]);
    if (compareQueryPatient(sentPatient, queryPatient)) return;
    setQueryPatient(sentPatient);
    sentPatient.phoneNumber = '';
    sentPatient.patientCode = '';
    Actions.get_patient_to_merge(sentPatient, dispatch).then((response) => {
      let masters = [].concat(...response.data.map((d) => d.data));
      let children = [].concat(...response.data.map((d) => d.children));

      let matchs = { data: masters, children: children };

      setMatchPatient(matchs);
      callback && callback(matchs);
    });
  }
  function compareQueryPatient(a, b) {
    return (
      a.patientCode === b.patientCode &&
      a.phoneNumber === b.phoneNumber &&
      a.fullName === b.fullName &&
      a.birthDay === b.birthDay
    );
  }

  function handleUserChipChange(value, name) {
    setInForm(`patient.${name}`, value.value);
  }
  function handleUserCodeBaseChange(value, name) {
    setInForm(`patient.${name}`, { code: value.value, name: value.label });
  }
  function handleSessionClick(event, index) {
    setSelectedSessionIndex(index);
    setLockStep(
      index == -1
        ? lockStep.filter((s) => s != "appointment")
        : [...lockStep, "appointment"]
    );
  }

  function getSessionHistory(code) {
    let pCode = code || form.patientCode;
    if (!pCode) return;
    Actions.get_session_history(pCode, dispatch).then((response) => {
      if (response.data && response.data.length > 0) {
        let session = response.data.map((s) => ({
          ...s,
          serviceTree: findServicesPath(s.serviceDemandId),
        }));
        setSessionHistory({ code: pCode, data: session });
      }
    });
  }

  function showMergePatient(userInfo) {
    userInfo.patientCode = userInfo.patientCode || form.patientCode;
    dispatch(
      showMergePatientDialog({
        user: { ...userInfo },
        onSelectPatient: mergeDialogSelect,
      })
    );
    // dispatch(hideAppointmentDialog());
  }

  function mergeDialogSelect(selectedUser) {
    setLockStep([...lockStep, "user"]);
    setInForm("patientCode", selectedUser.patientCode);
    setInForm("patient", selectedUser);
  }

  function clearUserData() {
    let defaultProvinceCode = process.env.REACT_APP_DEFAULT_PROVINCE_CODE;
    let province = null;
    if (defaultProvinceCode) {
      province = provinces.filter((p) => p.code == defaultProvinceCode)[0];
    }

    let patient = !province ? { ...defaultUser } : { ...defaultUser, province };

    setInForm("patient", patient);
    setInForm("patientCode", "");
    setMatchPatient({ ...defaultMatchPatient });
    setQueryPatient({ ...defaultQuery });
    setLockStep([]);
  }

  function clickUpdateUser() {
    let mess = form.patientCode
      ? `Cập nhật bệnh nhân ${form.patientCode}`
      : `Tạo mới bệnh nhân`;
    dispatch(
      showConfirmDialog({
        title: mess,
        onSubmit: saveUser,
      })
    );
  }

  function saveUser() {
    let patient = { ...form.patient, patientCode: form.patientCode };
    Actions.update_patient(patient, dispatch).then((response) => {
      if (response.code === 0) {
        setInForm("patient", {
          ...form.patient,
          patientCode: response.data.patientCode,
        });
        setInForm("patientCode", response.data.patientCode);
        dispatch(showMessage({ message: "Cập nhật thông tin bệnh nhân" }));
      } else {
        dispatch(showMessage({ message: response.message }));
      }
    });
  }
  function saveAppointment() {
    if (!form.patientCode) {
      dispatch(showMessage({ message: "Vui lòng chọn bệnh nhân" }));
      return;
    }

    if (!form.session.serviceDemandId) {
      dispatch(showMessage({ message: "Vui lòng chọn dịch vụ khám" }));
      return;
    }

    // if (!form.session.appointmentTime) {
    //   dispatch(showMessage({ message: "Vui lòng chọn khung giờ khám" }));
    //   return;
    // }

    const submitForm = _.omit(form, [
      "department",
      "patient",
      "inputPatient",
      "user",
      "followByDoctor",
      "session",
      "sessions",
      "state",
    ]);
    const submitData = _.assign({}, submitForm);
    let pendingServiceIds = form.session.indications
      ? form.session.indications.map((s) => s._id)
      : [];

    submitData.appointmentDate = form.session.appointmentDate;
    submitData.appointmentTime = form.session.appointmentTime;
    submitData.serviceDemandId = form.session.serviceDemandId;
    submitData.departmentId = form.session.departmentId;
    submitData.note = form.session.note;

    Actions.create_appointment(submitData, pendingServiceIds, dispatch).then(
      (response) => {
        if (response.code === 0) {
          dispatch(showMessage({ message: "Gửi yêu cầu thành công" }));
          getSessionHistory();
          dispatch(hideAppointmentDialog());
          if (onSuccess) {
            onSuccess();
          }
        } else {
          dispatch(showMessage({ message: response.message }));
        }
      }
    );
  }
  function canSaveAppointment() {
    return !["APPROVE", "SERVED"].includes(form.state.toUpperCase());
  }

  function onClickCreateMedicalSession() {
    //
    //
    //
    // if (!form.serviceDemandId) {
    //   dispatch(showMessage({ message: "Vui lòng chọn dịch vụ khám" }));
    //   return;
    // }
    // let activeSessions = sessionHistory.data.filter((s) =>
    // ["IN_QUEUE", "WATING_CONCLUSION"].includes(s.process.toUpperCase())
    // );
    // if (activeSessions.length <= 0) {
    //   // createMedicalSession();
    //   return;
    // }
    // dispatch(
    //   showConfirmDialog({
    //     title: "Xác nhận tạo phiên khám mới",
    //     message: `Bệnh nhân đang có ${activeSessions.length} phiên khám chưa hoàn thành`,
    //     onSubmit: () => {
    //       createMedicalSession();
    //     },
    //   })
    // );
  }

  function setPendingIndications(indications) {
    setInForm("session", { ...form.session, indications });
  }

  function createMedicalSession() {
    const submitForm = _.omit(form, [
      "department",
      "departmentId",
      "patient",
      "inputPatient",
      "user",
      "followByDoctor",
      "appointmentDate",
      "note",
      "session",
      "sessions",
    ]);
    const submitUser = _.pick(form.patient, ["insuranceCode"]);
    let submitDepartment = _.pick(
      departments.find((d) => d._id === form.session.departmentId),
      ["code", "name"]
    );
    submitForm.department = submitDepartment;
    const submitData = _.assign({}, submitForm, submitUser);
    Actions.create_medical_session(submitData, dispatch).then((response) => {
      if (response.code === 0) {
        dispatch(showMessage({ message: "Tạo phiêm khám thành công" }));
        getSessionHistory();
      } else {
        dispatch(showMessage({ message: response.message }));
      }
    });
  }

  function createServiceTree(data) {
    // Build lại services data theo object key _id để dễ access
    var objServices = data.reduce(
      (obj, ser) => {
        obj[ser._id] = { ...ser, children: [] };
        let parentId = ser.parentId || "0";
        obj[parentId].children.push(ser);
        return obj;
      },
      { 0: { children: [] } }
    );

    setServiceData(objServices);
  }

  function findServicesPath(serviceId) {
    if (serviceId == null || serviceData[serviceId] == null) return [];
    return [...findServicesPath(serviceData[serviceId].parentId), serviceId];
  }

  function onServiceChange(service_id, level) {
    if (form.session.services.length < level) return;

    let services = [...form.session.services.slice(0, level)];
    if (service_id != null)
      services = [...form.session.services.slice(0, level), service_id];

    if (!services || services.length <= 0) {
      setInForm("session", {
        ...form.session,
        services,
        serviceDemandId: null,
        departmentId: null,
      });
      return;
    }

    let last = services.at(-1);
    let lastDept =
      serviceData[last] &&
      serviceData[last].departments &&
      serviceData[last].departments[0];
    setInForm("session", {
      ...form.session,
      services,
      serviceDemandId: last,
      departmentId: lastDept ? lastDept._id : "",
    });
  }

  function isShowService(level) {
    if (selectedSessionIndex <= -2) return false;

    if (selectedSessionIndex == -1) {
      if (!form.session || !form.session.services) return false;

      let selectedId = form.session.services[level];
      if (!selectedId) return false;

      let service = serviceData[selectedId];
      return service && service.children && service.children.length > 0;
    }

    let session = sessionHistory.data[selectedSessionIndex];
    let selectedId = session.serviceTree[level];
    if (!selectedId) return false;

    let service = serviceData[selectedId];
    return service && service.children && service.children.length > 0;
  }

  function getService(service_id, level) {
    if (!service_id || !serviceData || !serviceData[service_id]) return [];

    let serviceList = serviceData[service_id].children.map((d) => ({
      value: d._id,
      label: d.name,
    }));

    if (level == null) return serviceList;

    if (selectedSessionIndex == -1) {
      if (!form.session || !form.session.services) return null;
      let selectedId = form.session.services[level];
      if (!selectedId) return null;

      return serviceList.find((s) => s.value == selectedId);
    }

    let session = sessionHistory.data[selectedSessionIndex];
    let selectedId = session.serviceTree[level];
    if (!selectedId) return false;

    return serviceList.find((s) => s.value == selectedId);
  }

  function getServiceTree() {
    if (selectedSessionIndex < -1) return [];

    if (selectedSessionIndex == -1) {
      if (!form.session || !form.session.services) return [];
      return form.session.services;
    }

    if (
      form.patientCode != sessionHistory.code ||
      sessionHistory.data.length <= 0
    )
      return [];

    let session = sessionHistory.data[selectedSessionIndex];
    return session.serviceTree;
  }

  function isShowDepartmentDropdown() {
    return (
      selectedSessionIndex == -1 &&
      form.session &&
      form.session.services &&
      form.session.services.length > 0 &&
      serviceData[form.session.services.at(-1)].departments.length > 1
    );
  }

  function isShowDepartmentText() {
    if (selectedSessionIndex == -1)
      return (
        form.session &&
        form.session.services &&
        form.session.services.length > 0 &&
        // form.session.departmentId &&
        departments &&
        departments.length > 0
      );

    return (
      sessionHistory.data[selectedSessionIndex] &&
      sessionHistory.data[selectedSessionIndex].department
    );
  }

  function mapDepartment() {
    return !form.session || !form.session.services
      ? []
      : serviceData[form.session.services.at(-1)].departments.map((d) => ({
        value: d._id,
        label: d.name,
      }));
  }

  function getServiceDate() {
    if (selectedSessionIndex == -1) {
      if (!form.session || !form.session.appointmentDate) return moment();
      let date = moment(form.session.appointmentDate).format("YYYY-MM-DD");
      return date;
    }

    let session = sessionHistory.data[selectedSessionIndex];
    // format của sessionHistory appointmentTime là DateTime
    let date = moment(session.appointmentTime).format("YYYY-MM-DD");
    return date;
  }

  function setServiceDate(e) {
    let date = moment(e);
    setInForm("session.appointmentDate", date.format("YYYY-MM-DD"));
  }

  function checkDisableDate(d) {
    if (!form.session.departmentId) return true;

    let deptInfo = departments.find((d) => d._id === form.session.departmentId);
    if (!deptInfo) return true;

    let date = moment(d);
    if (!deptInfo.workingDays[date.day()]) return true;

    let workingDay = deptInfo.workingDays[date.day()];

    if (
      !workingDay.maxProcess ||
      !workingDay.timeFrame ||
      workingDay.timeFrame.length == 0
    )
      return true;
    return false;
  }

  function isShowServiceTime() {
    if (!form.session || !form.session.departmentId) return false;
    let deptInfo = departments.find((d) => d._id === form.session.departmentId);
    if (!deptInfo) return false;
    return deptInfo.enableTimeFrame;
  }

  function getServiceTimeOption() {
    if (selectedSessionIndex == -1) {
      let times = timeFrame.map((item, i) => ({
        value: item.time,
        label: `${item.time} (${item.remain} lượt trống)`,
        disabled: item.timeOver,
      }));
      return times;
    }

    let session = sessionHistory.data[selectedSessionIndex];
    let time = moment(session.appointmentTime).format("HH:mm");
    return [{ value: time, label: time }];
  }

  function getServiceTime() {
    if (selectedSessionIndex == -1) {
      let time = timeFrame
        .map((item) => ({
          value: item.time,
          label: `${item.time} - ${item.remain}`,
        }))
        .find((d) => d.value === form.session.appointmentTime);
      return time;
    }

    let session = sessionHistory.data[selectedSessionIndex];
    let time = moment(session.appointmentTime).format("HH:mm");
    return { value: time, label: time };
  }

  function setServiceTime(e) {
    let time = e ? e.value : null;
    setInForm("session.appointmentTime", time);
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
        title="Thông tin đăng ký khám"
        subheader=""
      />
      <CardContent className="" style={{ height: "70vh" }}>
        <div className="flex flex-wrap h-full">
          <div className="el-block-report md:w-1/4 sm:w-1/2 h-full flex flex-col">
            <Typography
              className="pl-12 text-15 font-bold mb-3 block-tittle flex justify-between"
              style={{ lineHeight: "28px" }}
            >
              Thông tin bệnh nhân
              <span className="flex align-center">
                {lockStep.includes("user") ? (
                  <Button
                    onClick={() => {
                      setLockStep(lockStep.filter((s) => s != "user"));
                    }}
                    variant="outlined"
                    style={{
                      lineHeight: "initial",
                      textTransform: "initial",
                      marginRight: "0.4rem",
                    }}
                  >
                    Sửa
                  </Button>
                ) : (
                  <Button
                    onClick={clickUpdateUser}
                    variant="outlined"
                    style={{
                      lineHeight: "initial",
                      textTransform: "initial",
                      marginRight: "0.8rem",
                    }}
                  >
                    Cập nhật
                  </Button>
                )}
                <Button
                  onClick={clearUserData}
                  variant="outlined"
                  className={classes.error}
                  style={{
                    lineHeight: "initial",
                    textTransform: "initial",
                  }}
                >
                  Nhập lại
                </Button>
              </span>
            </Typography>
            <div className="flex flex-wrap overflow-y-auto flex-grow">
              <div className="md:w-full sm:w-full px-4">
                <TextField
                  className="mt-8 mb-16"
                  // style={{ width: "49%", marginRight: "2%" }}
                  label="Mã bệnh nhân"
                  id="patientCode"
                  name="patientCode"
                  margin="dense"
                  value={form.patientCode || ""}
                  onChange={(e) => {
                    setInForm("patientCode", e.target.value);
                  }}
                  variant="outlined"
                  fullWidth
                  onBlur={() => {
                    searchPatientMerge();
                  }}
                  onKeyPress={(e) => {
                    if (e.charCode === 13) searchPatientMerge();
                  }}
                  disabled={lockStep.includes("user")}
                />
              </div>
              {matchPatient &&
                matchPatient.data &&
                matchPatient.data.length > 0 ? (
                <a
                  color="primary"
                  className="sm:w-full pr-5"
                  style={{ textAlign: "right" }}
                  onClick={(e) => showMergePatient(form.patient)}
                  variant="contained"
                  disabled={lockStep.includes("user")}
                >
                  {matchPatient.data.length || matchPatient.children.length}{" "}
                  bệnh nhân phù hợp
                </a>
              ) : (
                <a
                  color="primary"
                  className="sm:w-full pr-5"
                  style={{ textAlign: "right" }}
                  variant="contained"
                >
                  Không có bệnh nhân phù hợp
                </a>
              )}
              <div className="md:w-full sm:w-full px-4">
                <TextField
                  className="mt-8 mb-16"
                  required
                  autoFocus
                  label="Họ tên"
                  id="fullName"
                  name="patient.fullName"
                  onInput={(e) => {
                    e.target.value = e.target.value.toUpperCase();
                  }}
                  value={form.patient.fullName || ""}
                  onChange={(e) => {
                    setInForm("patient.fullName", e.target.value);
                  }}
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  onBlur={() => {
                    searchPatientMerge();
                  }}
                  onKeyPress={(e) => {
                    if (e.charCode === 13) searchPatientMerge();
                  }}
                  disabled={lockStep.includes("user")}
                />
              </div>
              <div className="md:w-full sm:w-full px-4">
                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={viLocale}>
                  <KeyboardDatePicker
                    disableToolbar
                    fullWidth
                    required
                    className="mt-8 mb-16"
                    autoOk
                    label="Ngày sinh"
                    variant="inline"
                    id="birthDay"
                    name="birthDay"
                    inputVariant="outlined"
                    value={moment(form.patient.birthDay).format("YYYY-MM-DD")}
                    onChange={(e) => {
                      setInForm(
                        "patient.birthDay",
                        moment(e).format("YYYY-MM-DD")
                      );
                    }}
                    format="dd/MM/yyyy"
                    invalidDateMessage="Ngày không hợp lệ"
                    margin="dense"
                    disabled={lockStep.includes("user")}
                  />
                </MuiPickersUtilsProvider>
              </div>
              <div className="md:w-full sm:w-full px-4">
                <TextField
                  className="mt-8 mb-20"
                  label="Số điện thoại"
                  id="phoneNumber"
                  name="patient.phoneNumber"
                  margin="dense"
                  value={form.patient.phoneNumber || ""}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9\s]/gi, "");
                  }}
                  onChange={(e) => {
                    setInForm("patient.phoneNumber", e.target.value);
                  }}
                  variant="outlined"
                  fullWidth
                  onBlur={() => {
                    searchPatientMerge();
                  }}
                  onKeyPress={(e) => {
                    if (e.charCode === 13) searchPatientMerge();
                  }}
                  disabled={lockStep.includes("user")}
                />
              </div>
              <Divider className="md:w-full sm:w-full px-4" />
              <div className="md:w-full sm:w-full px-4">
                <FuseChipSelect
                  fullWidth
                  margin="dense"
                  className="mt-20 mb-24"
                  value={
                    form.patient.work
                      ? {
                        value: form.patient.work.code,
                        label: form.patient.work.name,
                      }
                      : null
                  }
                  style={{ height: 20 }}
                  onChange={(value) => handleUserCodeBaseChange(value, "work")}
                  textFieldProps={{
                    label: "Nghề nghiệp",
                    InputLabelProps: {
                      shrink: true,
                    },
                    variant: "outlined",
                  }}
                  options={works.map((n) => ({
                    value: n.code,
                    label: n.name,
                  }))}
                  isDisabled={lockStep.includes("user")}
                />
              </div>
              <div className="md:w-full sm:w-full px-4">
                <FuseChipSelect
                  margin="dense"
                  className="mt-8 mb-24"
                  value={
                    form.patient.gender && {
                      value: form.patient.gender || "",
                      label:
                        form.patient.gender === "1"
                          ? "Nam giới"
                          : form.patient.gender === "2"
                            ? "Nữ giới"
                            : form.patient.gender === "3"
                              ? "Giới tính khác"
                              : "Chưa chọn",
                    }
                  }
                  required
                  style={{ height: 20 }}
                  onChange={(value) => handleUserChipChange(value, "gender")}
                  textFieldProps={{
                    label: "Giới tính",
                    InputLabelProps: {
                      shrink: true,
                    },
                    variant: "outlined",
                  }}
                  options={[
                    { value: "2", label: "Nữ giới" },
                    { value: "1", label: "Nam giới" },
                    { value: "3", label: "Giới tính khác" },
                  ]}
                  isDisabled={lockStep.includes("user")}
                />
              </div>
              <div className="md:w-full sm:w-full px-4">
                <FuseChipSelect
                  margin="dense"
                  className="mt-8 mb-24"
                  value={
                    form.patient.nation
                      ? {
                        value: form.patient.nation.code,
                        label: form.patient.nation.name,
                      }
                      : null
                  }
                  style={{ height: 20 }}
                  onChange={(value) =>
                    handleUserCodeBaseChange(value, "nation")
                  }
                  textFieldProps={{
                    label: "Dân tộc",
                    InputLabelProps: {
                      shrink: true,
                    },
                    variant: "outlined",
                  }}
                  options={nations.map((n) => ({
                    value: n.code,
                    label: n.name,
                  }))}
                  isDisabled={lockStep.includes("user")}
                />
              </div>
              <div className="md:w-full sm:w-full px-4">
                <FuseChipSelect
                  margin="dense"
                  className="mt-8 mb-24"
                  value={
                    form.patient.nationality
                      ? {
                        value: form.patient.nationality.code,
                        label: form.patient.nationality.name,
                      }
                      : null
                  }
                  style={{ height: 20 }}
                  onChange={(value) =>
                    handleUserCodeBaseChange(value, "nationality")
                  }
                  textFieldProps={{
                    label: "Quốc tịch",
                    InputLabelProps: {
                      shrink: true,
                    },
                    variant: "outlined",
                  }}
                  options={nationalitys.map((n) => ({
                    value: n.code,
                    label: n.name,
                  }))}
                  isDisabled={lockStep.includes("user")}
                />
              </div>
              <div className="md:w-full sm:w-full px-4">
                <FuseChipSelect
                  margin="dense"
                  className="mt-8 mb-24"
                  value={
                    form.patient.province
                      ? {
                        value: form.patient.province.code,
                        label: form.patient.province.name,
                      }
                      : null
                  }
                  style={{ height: 20 }}
                  onChange={(value) =>
                    handleUserCodeBaseChange(value, "province")
                  }
                  textFieldProps={{
                    label: "Tỉnh/Thành phố",
                    InputLabelProps: {
                      shrink: true,
                    },
                    variant: "outlined",
                  }}
                  options={provinces.map((n) => ({
                    value: n.code,
                    label: n.name,
                  }))}
                  isDisabled={lockStep.includes("user")}
                />
              </div>
              <div className="md:w-full sm:w-full px-4">
                <FuseChipSelect
                  margin="dense"
                  className="mt-8 mb-24"
                  value={
                    form.patient.district
                      ? {
                        value: form.patient.district.code,
                        label: form.patient.district.name,
                      }
                      : null
                  }
                  style={{ height: 20 }}
                  onChange={(value) =>
                    handleUserCodeBaseChange(value, "district")
                  }
                  textFieldProps={{
                    label: "Quận/Huyện",
                    InputLabelProps: {
                      shrink: true,
                    },
                    variant: "outlined",
                  }}
                  options={districts.map((n) => ({
                    value: n.code,
                    label: n.name,
                  }))}
                  isDisabled={lockStep.includes("user")}
                />
              </div>
              <div className="md:w-full sm:w-full px-4">
                <FuseChipSelect
                  margin="dense"
                  className="mt-8 mb-24"
                  value={
                    form.patient.ward
                      ? {
                        value: form.patient.ward.code,
                        label: form.patient.ward.name,
                      }
                      : null
                  }
                  style={{ height: 20 }}
                  onChange={(value) => handleUserCodeBaseChange(value, "ward")}
                  textFieldProps={{
                    label: "Phường/Xã",
                    InputLabelProps: {
                      shrink: true,
                    },
                    variant: "outlined",
                  }}
                  options={wards.map((n) => ({
                    value: n.code,
                    label: n.name,
                  }))}
                  isDisabled={lockStep.includes("user")}
                />
              </div>
              <div className="md:w-full sm:w-full px-4">
                <TextField
                  className="mt-8 mb-16"
                  label="Số nhà/Tên đường/Khu"
                  id="address"
                  name="patient.address"
                  value={form.patient.address || ""}
                  onChange={(e) => {
                    setInForm("patient.address", e.target.value);
                  }}
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  disabled={lockStep.includes("user")}
                />
              </div>
              <div className="md:w-full sm:w-full px-4">
                <TextField
                  className="mt-8 mb-16"
                  label="Số CMND/Thẻ căn cước"
                  id="nationIdentification"
                  name="patient.nationIdentification"
                  value={form.patient.nationIdentification || ""}
                  onChange={(e) => {
                    setInForm("patient.nationIdentification", e.target.value);
                  }}
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  disabled={lockStep.includes("user")}
                />
              </div>
              <div className="md:w-full sm:w-full px-4">
                <TextField
                  className="mt-8 mb-16"
                  label="Bảo hiểm Y tế"
                  id="insuranceCode"
                  name="patient.insuranceCode"
                  value={form.patient.insuranceCode || ""}
                  onChange={(e) => {
                    setInForm("patient.insuranceCode", e.target.value);
                  }}
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  disabled={lockStep.includes("user")}
                />
              </div>
            </div>
          </div>
          <div className="el-block-report md:w-1/4 sm:w-1/2 h-full flex flex-col">
            <Typography className="pl-12 text-15 font-bold mb-10 block-tittle">
              Thông tin yêu cầu
            </Typography>
            <div className="w-full px-4">
              <FuseChipSelect
                margin="dense"
                className="mt-8 mb-8"
                style={{ height: 20 }}
                value={getService("0", 0)}
                onChange={(e) => onServiceChange(e == null ? null : e.value, 0)}
                textFieldProps={{
                  label: "Dịch vụ khám",
                  InputLabelProps: {
                    shrink: true,
                  },
                  variant: "outlined",
                }}
                isClearable={true}
                options={getService("0")}
                isDisabled={lockStep.includes("appointment")}
              />
            </div>
            {getServiceTree().map(
              (selected, i) =>
                isShowService(i) && (
                  <div key={i} className="w-full px-4">
                    <FuseChipSelect
                      margin="dense"
                      className="mt-8 mb-8"
                      style={{ height: 20 }}
                      value={getService(selected, i + 1)}
                      onChange={(e) =>
                        onServiceChange(e == null ? null : e.value, i + 1)
                      }
                      textFieldProps={{
                        label: "Dịch vụ khám",
                        InputLabelProps: {
                          shrink: true,
                        },
                        variant: "outlined",
                      }}
                      isClearable={true}
                      options={getService(selected)}
                      isDisabled={lockStep.includes("appointment")}
                    />
                  </div>
                )
            )}
            {isShowDepartmentDropdown() && (
              <div className="w-full px-4">
                <FuseChipSelect
                  margin="dense"
                  className="mt-8 mb-8"
                  style={{ height: 20 }}
                  value={mapDepartment().find(
                    (d) => d.value === form.session.departmentId
                  )}
                  onChange={(e) =>
                    setInForm("session.departmentId", e ? e.value : null)
                  }
                  textFieldProps={{
                    label: "Khoa khám",
                    InputLabelProps: {
                      shrink: true,
                    },
                    variant: "outlined",
                  }}
                  isClearable={true}
                  options={mapDepartment()}
                  isDisabled={lockStep.includes("appointment")}
                />
              </div>
            )}
            {isShowDepartmentText() && (
              <Typography className="ml-12 mb-24 text-15 font-bold">
                {
                  !form.session.departmentId
                    ? !serviceData[form.session.services.at(-1)].children ||
                      serviceData[form.session.services.at(-1)].children
                        .length == 0
                      ? "Không có khoa khám"
                      : ""
                    : "Khoa khám: " +
                    (selectedSessionIndex == -1
                      ? departments.find(
                        (d) => d._id === form.session.departmentId
                      ).name
                      : sessionHistory.data[selectedSessionIndex].department
                        .name)

                  // !form.session.departmentId &&
                  // (!serviceData[form.session.services.at(-1)].children ||
                  // serviceData[form.session.services.at(-1)].children.length == 0) ?
                  //   "Không có khoa khám" :
                  //   "Khoa khám:" + selectedSessionIndex == -1
                  //     ? departments.find((d) => d._id === form.session.departmentId).name
                  //     : sessionHistory.data[selectedSessionIndex].department.name
                }
              </Typography>
            )}
            {selectedSessionIndex == -1 ? (
              <div className="w-full px-4">
                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={viLocale}>
                  <KeyboardDatePicker
                    disableToolbar
                    fullWidth
                    className="mt-8 mb-16"
                    autoOk
                    label="Ngày đặt"
                    variant="inline"
                    name="session.appointmentDate"
                    inputVariant="outlined"
                    value={getServiceDate()}
                    onChange={setServiceDate}
                    shouldDisableDate={(d) => checkDisableDate(d)}
                    format="dd/MM/yyyy"
                    invalidDateMessage="Ngày không hợp lệ"
                    margin="dense"
                    minDateMessage="Ngày đặt không thể nhỏ hơn ngày hiện tại"
                    minDate={new Date()}
                    maxDate={
                      new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 365)
                    } // 1 năm
                  />
                </MuiPickersUtilsProvider>
              </div>
            ) : (
              <div className="w-full px-4">
                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={viLocale}>
                  <KeyboardDatePicker
                    disableToolbar
                    fullWidth
                    className="mt-8 mb-16"
                    label="Ngày đặt"
                    variant="inline"
                    inputVariant="outlined"
                    value={getServiceDate()}
                    format="dd/MM/yyyy"
                    margin="dense"
                    minDate={new Date("0001-01-01")}
                    disabled
                  />
                </MuiPickersUtilsProvider>
              </div>
            )}
            {isShowServiceTime() && (
              <div className="w-full px-4">
                <FuseChipSelect
                  margin="dense"
                  className="mt-8 mb-24"
                  style={{ height: 20 }}
                  styles={{
                    option: (provided, state) => {
                      return {
                        ...provided,
                        color: state.isSelected ? "red" : "blue",
                      };
                    },
                  }}
                  value={getServiceTime()}
                  onChange={setServiceTime}
                  textFieldProps={{
                    label: "Thời gian đặt",
                    InputLabelProps: {
                      shrink: true,
                    },
                    variant: "outlined",
                  }}
                  isClearable={true}
                  isOptionDisabled={(option) => option.disabled}
                  options={getServiceTimeOption()}
                  isDisabled={lockStep.includes("appointment")}
                />
              </div>
            )}
            <div className="w-full px-4">
              <TextField
                className="mt-8 mb-16"
                label="Nội dung khám"
                name="session.note"
                margin="dense"
                value={
                  (selectedSessionIndex == -1
                    ? form.session && form.session.note
                    : sessionHistory.data[selectedSessionIndex].reason) || ""
                }
                onChange={(e) => {
                  setInForm("session.note", e.target.value);
                }}
                variant="outlined"
                fullWidth
                rows={3}
                multiline
                disabled={lockStep.includes("appointment")}
              />
            </div>
          </div>
          <div className="el-block-report md:w-1/4 sm:w-1/2 h-full flex flex-col">
            <Typography className="pl-12 text-15 font-bold mb-10 block-tittle">
              Chỉ định và kết quả
            </Typography>
            {selectedSessionIndex == -1 ? (
              <PendingIndicationList
                pendingIndications={
                  form.session && form.session.indications
                    ? form.session.indications
                    : []
                }
                setPendingIndications={setPendingIndications}
              />
            ) : (
              <IndicationList
                sessionProp={sessionHistory.data[selectedSessionIndex]}
              />
            )}
          </div>
          <div className="el-block-report md:w-1/4 sm:w-1/2 h-full flex flex-col">
            <Typography
              className="pl-12 text-15 font-bold mb-3 block-tittle flex justify-between"
              style={{ lineHeight: "28px" }}
            >
              Lịch sử khám
              {/* <Button
                onClick={onClickCreateMedicalSession}
                variant="outlined"
                style={{ lineHeight: "initial", textTransform: "initial" }}
                disabled={form.session != null}
              >
                Tạo phiên khám mới
              </Button> */}
            </Typography>
            <List
              dense
              component="div"
              role="list"
              className="overflow-y-auto h-full"
            >
              {!["APPROVE", "SERVED"].includes(form.state.toUpperCase()) &&
                form.session &&
                form.session.serviceDemandId && (
                  <ListItem
                    className="flex mb-10 px-2"
                    style={{ cursor: "pointer", alignItems: "baseline" }}
                    selected={selectedSessionIndex == -1}
                    onClick={(e) => {
                      handleSessionClick(e, -1);
                    }}
                  >
                    <ListItemText
                      style={{ flex: "1 1" }}
                      primary={moment(form.session.appointmentDate).format(
                        "DD/MM/YYYY"
                      )}
                    />
                    <ListItemText
                      style={{ textAlign: "left", flex: "4 1" }}
                      primary={
                        <div>
                          <Typography className="text-14 font-bold pr-8">
                            Phiêm khám chờ xác nhận
                          </Typography>
                          <Typography>
                            {serviceData[form.session.serviceDemandId]
                              ? serviceData[form.session.serviceDemandId].name
                              : ""}
                          </Typography>
                        </div>
                      }
                    />
                    {/* <ListItemText
                      primary="Chờ xác nhận"
                      style={{
                        color: "gray",
                        textAlign: "right",
                        flex: "1 1",
                      }}
                    /> */}
                  </ListItem>
                )}
              {form.patientCode == sessionHistory.code &&
                sessionHistory.data &&
                sessionHistory.data.map((item, index) => (
                  <ListItem
                    key={index}
                    className="flex px-2"
                    style={
                      ["CANCEL"].includes(item.process.toUpperCase())
                        ? { alignItems: "baseline" }
                        : { cursor: "pointer", alignItems: "baseline" }
                    }
                    selected={selectedSessionIndex == index}
                    onClick={(event) => {
                      if (
                        [
                          "IN_QUEUE",
                          "WATING_CONCLUSION",
                          "CONCLUSION",
                        ].includes(item.process.toUpperCase())
                      )
                        handleSessionClick(event, index);
                    }}
                  >
                    <ListItemText
                      style={{ flex: "1 1" }}
                      primary={moment(item.createdTime).format("DD/MM/YYYY")}
                    />
                    <ListItemText
                      style={{ textAlign: "left", flex: "3 1" }}
                      primary={
                        <div>
                          <Typography className="text-14 font-bold pr-8">
                            {item.code}
                          </Typography>
                          <Typography>
                            {item.services
                              ? item.services.name
                              : item.department
                                ? item.department.name
                                : ""}
                          </Typography>
                        </div>
                      }
                      secondary={`${item.prediagnosis || item.reason || ""}`}
                    />
                    {item.process.toUpperCase() == "IN_QUEUE" ? (
                      <ListItemText
                        primary="Đặt khám"
                        style={{
                          color: "limegreen",
                          textAlign: "right",
                          flex: "1 1",
                        }}
                      />
                    ) : item.process.toUpperCase() == "WATING_CONCLUSION" ? (
                      <ListItemText
                        primary="Đang khám"
                        style={{
                          color: "#1aa6f7",
                          textAlign: "right",
                          flex: "1 1",
                        }}
                      />
                    ) : item.process.toUpperCase() == "CONCLUSION" ? (
                      <ListItemText
                        primary="Đã khám"
                        style={{
                          color: "gray",
                          textAlign: "right",
                          flex: "1 1",
                        }}
                      />
                    ) : (
                      <ListItemText
                        primary="Đã hủy"
                        style={{
                          color: "red",
                          textAlign: "right",
                          flex: "1 1",
                        }}
                      />
                    )}
                  </ListItem>
                ))}
            </List>
          </div>
        </div>
      </CardContent>
      <CardActions disableSpacing className="justify-end mr-8">
        <div>
          <ButtonGroup>
            <Button
              disabled={!canSaveAppointment()}
              color="primary"
              onClick={saveAppointment}
              variant="contained"
            >
              {`${["APPROVE", "SERVED"].includes(form.state.toUpperCase())
                ? "Đã xác nhận"
                : "Xác nhận đặt khám"
                }`}
            </Button>
          </ButtonGroup>
        </div>
      </CardActions>
    </Card>
  );
}
