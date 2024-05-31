import React, { useState, useEffect, useMemo, useReducer } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "./css/customs.css";
import "./css/responsive.css";
import moment from "moment";
import _ from "lodash";
import DayPickerInput from "react-day-picker/DayPickerInput";
import "react-day-picker/lib/style.css";
import { useForm } from "../../hooks";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import viLocale from "date-fns/locale/vi";
import { showConfirmAlert } from "utils/VTBaseControl";
import { Typography, Tooltip } from "@material-ui/core";
// import { useDispatch } from 'react-redux';

import MomentLocaleUtils, {
  formatDate,
  parseDate,
} from "react-day-picker/moment";

import * as Actions from "./store";
import BookingSuccessDialog from "./dialog/BookingSuccessDialog";
import {
  createMuiTheme,
  MuiThemeProvider,
  withStyles,
} from "@material-ui/core/styles";
import Select from "react-select";

const defaultTheme = createMuiTheme();
const theme = createMuiTheme({
  overrides: {
    MuiTooltip: {
      tooltip: {
        fontSize: "1em",
        color: "yellow",
        backgroundColor: "#a80030",
      },
    },
  },
});

const genderOptions = [
  { label: "Nam giới", value: "1" },
  { label: "Nữ giới", value: "2" },
  { label: "Giới tính khác", value: "3" },
];

function ExaminationBooking(props) {
  // const dispatch = useDispatch();
  const [services, setServices] = useState([]);
  const [timeFrames, setTimeFrames] = useState([]);

  const [selectedService, setSelectedService] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [nationalitys, setNationalitys] = useState([]);
  const [works, setWorks] = useState([]);
  const [nations, setNations] = useState([]);
  const [note, setNote] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const {
    form: user,
    setInForm: setInUser,
    handleChange: handleUserChange,
  } = useForm({
    phoneNumber: "",
    fullName: "",
    birthDay: new Date(),
    gender: "2",
    address: "",
    nation: { code: "25", name: "Kinh" },
    nationality: { code: "1", name: "Việt Nam" },
    work: { code: "19", name: "Đối tượng khác" },
  });
  const { form, setInForm, handleChange } = useForm({
    appointmentDate: new Date(),
  });

  useEffect(() => {
    getServices();
    loadNations();
    loadNationalitys();
    loadWorks();
  }, [props]);

  useEffect(() => {
    loadProvinces();
  }, [props, user.nationality]);

  useEffect(() => {
    if (form.departmentId) {
      getTimeFrames(form.departmentId, form.appointmentDate);
      getShiftDoctors(form.departmentId, form.appointmentDate);
    }
  }, [form.departmentId, form.appointmentDate]);
  useEffect(() => {
    setInUser("ward", null);
    setInUser("district", null);
    loadDistricts();
  }, [user.province]);
  useEffect(() => {
    setInUser("ward", null);
    loadWards();
  }, [user.district]);

  const handleDateChange = (date) => {
    setInForm("appointmentDate", date);
    //reset lại giờ chọn
    setInForm("appointmentTime", null);
  };
  function createServiceTree(data) {
    // Build lại services data theo object key _id để dễ access
    var objServices = data.reduce(
      (obj, ser) => {
        let _id = ser._id;
        obj[_id] = _.assign(obj[_id] ?? {}, ser, { children: [] });
        obj[ser.parentId ? ser.parentId : "0"].children.push(ser);
        return obj;
      },
      { 0: { children: [] } }
    );

    setServices(objServices);
  }

  function onServiceChange(_id, level) {
    if (selectedService.length < level) {
      setTimeFrames([]);
      return;
    }

    let preSelected = selectedService.slice(0, level);
    preSelected[level] = _id;
    setSelectedService(preSelected);
    if (
      services[_id].departments.length == 0 ||
      services[_id].departments[0]._id != form.departmentId
    )
      setTimeFrames([]);
    if (
      services[_id].departments.length > 0 &&
      services[_id].departments[0]._id != form.departmentId
    )
      setInForm("departmentId", services[_id].departments[0]._id);

    setInForm("serviceDemandId", _id);
  }

  function serviceFullName(level) {
    if (selectedService.length < level) return "";
    let sliced = selectedService.slice(0, level);
    return sliced.map((s) => services[s].name).join(" >> ");
  }

  function getTimeFrames(departmentId, date) {
    setTimeFrames([]);
    setInForm("appointmentTime", null);
    Actions.getTimeFrames(departmentId, date).then((response) => {
      if (response.data) {
        if (response.data.servtime_on_date) {
          setTimeFrames(response.data.servtime_on_date);
        }
      }
    });
  }

  function compareWithNow(date, time) {
    return moment(moment(date).format("YYYY-MM-DD") + " " + time).diff(
      moment()
    );
  }

  function getShiftDoctors(departmentId, date) {
    setDoctors([]);
    setInForm("shiftDoctorId", null);
    Actions.getShiftDoctors(departmentId, date).then((response) => {
      if (response.data) {
        if (response.data) {
          setDoctors(response.data);
        }
      }
    });
  }

  function getServices() {
    // Actions.getService().then(response => {
    //     if (response.data) {
    //         setServices(response.data)
    //     }
    // })
    Actions.getServiceList().then((response) => {
      if (response.data) {
        createServiceTree(response.data);
      }
    });
  }
  function loadProvinces() {
    if (user.nationality.code === "1") {
      Actions.get_provinces().then((response) => {
        if (response.code === 0) {
          setProvinces(response.data);
        }
      });
    } else {
      setProvinces([]);
    }
  }
  function loadNationalitys() {
    Actions.get_nationalitys().then((response) => {
      if (response.code === 0) {
        setNationalitys(response.data);
      }
    });
  }
  function loadNations() {
    Actions.get_nations().then((response) => {
      if (response.code === 0) {
        setNations(response.data);
      }
    });
  }
  function loadWorks() {
    Actions.get_works().then((response) => {
      if (response.code === 0) {
        setWorks(response.data);
      }
    });
  }
  function loadDistricts() {
    if (user.province && user.province.code) {
      Actions.get_districts(user.province.code).then((response) => {
        setDistricts(response.data);
      });
    } else {
      setDistricts([]);
    }
  }
  function loadWards() {
    if (user.district && user.district.code) {
      Actions.get_wards(user.district.code).then((response) => {
        setWards(response.data);
      });
    } else {
      setWards([]);
    }
  }

  function canSubmit() {
    console.log("canSubmit");
    if (user.phoneNumber === null || user.phoneNumber.trim() === "") {
      showConfirmAlert(
        "Thông báo",
        "Vui lòng điền số điện thoại",
        null,
        "Đóng",
        null,
        () => {}
      );
      return false;
    }
    if (user.phoneNumber.trim().length != 10) {
      showConfirmAlert(
        "Thông báo",
        "Số điện thoại sai định dạng. Vui lòng kiểm tra lại",
        null,
        "Đóng",
        null,
        () => {}
      );
      return false;
    }
    if (user.fullName === null || user.fullName.trim() === "") {
      showConfirmAlert(
        "Thông báo",
        "Vui lòng điền họ và tên",
        null,
        "Đóng",
        null,
        () => {}
      );
      return false;
    }
    if (
      moment(user.birthDay).format("YYYY-MM-DD") ===
      moment().format("YYYY-MM-DD")
    ) {
      showConfirmAlert(
        "Thông báo",
        "Vui lòng chọn ngày sinh",
        null,
        "Đóng",
        null,
        () => {}
      );
      return false;
    }
    if (timeFrames.length == 0) {
      showConfirmAlert(
        "Thông báo",
        "Vui lòng chọn dịch vụ khám",
        null,
        "Đóng",
        null,
        () => {}
      );
      return false;
    }
    if (form.appointmentDate == null) {
      showConfirmAlert(
        "Thông báo",
        "Vui lòng chọn ngày đặt khám",
        null,
        "Đóng",
        null,
        () => {}
      );
      return false;
    }
    if (form.appointmentTime == null) {
      showConfirmAlert(
        "Thông báo",
        "Vui lòng chọn giờ đặt khám",
        null,
        "Đóng",
        null,
        () => {}
      );
      return false;
    }
    return true;
  }

  function handleSubmit() {
    if (canSubmit()) {
      const submitForm = _.omit(form, []);
      const submitUser = _.omit(user, []);
      submitUser.birthDay = moment(submitUser.birthDay).format("YYYY-MM-DD");
      submitForm.appointmentDate = moment(submitForm.appointmentDate).format(
        "YYYY-MM-DD"
      );
      submitForm.inputPatient = submitUser;

      Actions.createAppoinmentUnauthorize(submitForm).then((response) => {
        if (response.code === 0) {
          setOpenDialog(true);
        } else {
          showConfirmAlert(
            "Đặt khám thất bại",
            response.message,
            null,
            "Đóng",
            null,
            () => {}
          );
        }
      });
    }
  }

  function buildSelect(render, list, selected) {
    let selectedOption = list.find((op) => op.value == selected);
    return render(list, selectedOption);
  }

  return (
    <MuiThemeProvider theme={theme}>
      <div className="container-fluid p-0">
        <BookingSuccessDialog
          open={openDialog}
          onClose={(e) => {
            setOpenDialog(false);
            window.location.href = process.env.REACT_APP_WEB_FULL;
          }}
        ></BookingSuccessDialog>
        <div className="full-width">
          <nav className="top-hotline">
            <div className="container">
              <ul>
                <li>
                  <a href="#">
                    <img src="images/clock.svg" width="16" />
                    <p>
                      Giờ khám:<b> 07:00-17:00</b>
                    </p>
                  </a>
                </li>
                <li>
                  <a href="#">
                    <img src="images/telephone.svg" width="16" />
                    <p>
                      Hotline:<b>{process.env.REACT_APP_HOTLINE}</b>
                    </p>
                  </a>
                </li>
              </ul>
            </div>
          </nav>
          <div className="container top-bar2 d-flex align-items-center justify-content-between">
            <div className="logo d-flex align-items-center">
              <a href="">
                <img
                  src={process.env.REACT_APP_LOGO_IMAGE}
                  alt={process.env.REACT_APP_HOSPITAL}
                />
              </a>
              <div>
                <p className="name-bv m-0 p-0">
                  {process.env.REACT_APP_HOSPITAL}
                </p>
                <h5 className="m-0 p-0">{process.env.REACT_APP_SLOGAN_EN}</h5>
                <p className="slogan m-0 p-0">
                  {process.env.REACT_APP_SLOGAN_VI}
                </p>
              </div>
            </div>
            <div className="emergency">
              <p className="emergency-title" title="Tổng đài">
                TỔNG ĐÀI:
              </p>
              <p className="emergency-phone">{process.env.REACT_APP_HOTLINE}</p>
            </div>
          </div>
        </div>
        {/* ======END HEADER======== */}
        <section className="container main-content">
          <div className="box-content-1024">
            <div className="full-width box-title">ĐẶT KHÁM TRỰC TUYẾN</div>
            <div className="box-content-content">
              <form>
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Số điện thoại: *</label>
                  <input
                    name="phoneNumber"
                    value={user.phoneNumber}
                    type="number"
                    className="form-control"
                    id="exampleInputEmail1"
                    aria-describedby="emailHelp"
                    onChange={handleUserChange}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "inherit",
                    justifyContent: "space-between",
                  }}
                >
                  <div className="form-group w-full">
                    <label>Họ tên: *</label>
                    <input
                      name="fullName"
                      value={user.fullName}
                      type="name"
                      className="form-control"
                      aria-describedby="Tên"
                      onChange={handleUserChange}
                    />
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "inherit",
                    justifyContent: "space-between",
                  }}
                >
                  <div className="form-group w-1/2">
                    <label htmlFor="exampleFormControlSelect2">
                      Ngày sinh: *
                    </label>
                    <MuiPickersUtilsProvider
                      utils={DateFnsUtils}
                      locale={viLocale}
                      className="el-Date"
                    >
                      <KeyboardDatePicker
                        disableToolbar
                        fullWidth
                        className="mt-8 mb-16"
                        autoOk
                        variant="inline"
                        id="birthDay"
                        maxDate={moment()}
                        name="birthDay"
                        inputVariant="outlined"
                        placeholder="DD/MM/YYYY"
                        views={["year", "month", "date"]}
                        openTo="year"
                        value={
                          moment(user.birthDay).format("YYYY-MM-DD") || moment()
                        }
                        onChange={(e) =>
                          setInUser("birthDay", moment(e).format("YYYY-MM-DD"))
                        }
                        format="dd/MM/yyyy"
                        invalidDateMessage="Ngày không hợp lệ"
                        margin="dense"
                      />
                    </MuiPickersUtilsProvider>
                  </div>
                  <div className="form-group w-1/2">
                    <label
                      htmlFor="select_gender"
                      style={{ marginBottom: "0.25rem" }}
                    >
                      Giới tính:
                    </label>
                    {buildSelect(
                      (data, selected) => (
                        <Select
                          onChange={(e) => setInUser("gender", e.value)}
                          value={selected}
                          options={data}
                        />
                      ),
                      genderOptions,
                      user.gender
                    )}
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "inherit",
                    justifyContent: "space-between",
                  }}
                >
                  <div className="form-group w-full">
                    <label htmlFor="exampleInputEmail1">Địa chỉ:</label>
                    <input
                      name="street"
                      value={user.street}
                      type="address"
                      className="form-control"
                      id="exampleInputEmail1"
                      aria-describedby="emailHelp"
                      onChange={handleUserChange}
                    />
                  </div>
                </div>
                {["0", ...selectedService].map(
                  (selected, i) =>
                    services[selected] &&
                    services[selected].children &&
                    services[selected].children.length > 0 && (
                      <div className="form-group" key={selected}>
                        {i == 0 ? (
                          <label htmlFor="select_service_0">
                            Hình thức khám: *
                          </label>
                        ) : (
                          <label
                            style={{ fontStyle: "italic", paddingLeft: 4 }}
                            htmlFor={`select_service_${i}`}
                          >
                            Chi tiết dịch vụ: {serviceFullName(i)}
                          </label>
                        )}

                        {buildSelect(
                          (servicesData, selectedOption) => (
                            <Select
                              id={`select_service_${i}`}
                              onChange={(e) => onServiceChange(e.value, i)}
                              placeholder={`Chọn ${
                                i == 0 ? "hình thức khám" : "dịch vụ"
                              }`}
                              value={selectedOption}
                              options={servicesData}
                            />
                          ),
                          services[selected].children.map((s) => ({
                            value: s._id,
                            label: s.name,
                          })),
                          selectedService[i]
                        )}

                        {selectedService[i] &&
                          services[selectedService[i]].note &&
                          services[selectedService[i]].note.length > 0 && (
                            <Tooltip
                              placement="right"
                              title={
                                <div
                                  style={{ padding: 20, fontSize: 12 }}
                                  dangerouslySetInnerHTML={{
                                    __html: services[selectedService[i]].note,
                                  }}
                                />
                              }
                            >
                              <span
                                style={{
                                  paddingLeft: 8,
                                  color: "red",
                                  fontSize: 12,
                                  textDecoration: "underline",
                                }}
                              >
                                Xem lưu ý
                              </span>
                            </Tooltip>
                          )}
                      </div>
                    )
                )}
                {selectedService.length > 0 &&
                  services[selectedService.at(-1)].departments.length > 1 && (
                    <div className="form-group">
                      <label htmlFor="exampleFormControlSelect1">
                        Chọn khoa khám: *
                      </label>

                      {buildSelect(
                        (servicesData, selectedOption) => (
                          <Select
                            onChange={(e) => setInForm("departmentId", e.value)}
                            placeholder={`Chọn khoa/phòng ban`}
                            value={selectedOption}
                            options={servicesData}
                          />
                        ),
                        services[selectedService.at(-1)].departments.map(
                          (s) => ({
                            value: s._id,
                            label: s.name,
                          })
                        ),
                        form.departmentId
                      )}
                    </div>
                  )}

                <div className="form-group">
                  <label htmlFor="exampleFormControlSelect2">
                    Chọn ngày khám
                  </label>
                  <MuiPickersUtilsProvider
                    utils={DateFnsUtils}
                    locale={viLocale}
                    className="el-Date"
                  >
                    <KeyboardDatePicker
                      disableToolbar
                      fullWidth
                      className="mt-8 mb-16"
                      autoOk
                      variant="inline"
                      id="appointmentDate"
                      name="appointmentDate"
                      placeholder="DD/MM/YYYY"
                      inputVariant="outlined"
                      value={
                        moment(form.appointmentDate).format("YYYY-MM-DD") ||
                        moment()
                      }
                      onChange={handleDateChange}
                      format="dd/MM/yyyy"
                      invalidDateMessage="Ngày không hợp lệ"
                      margin="dense"
                      minDate={moment()}
                      minDateMessage="Ngày khám không thể nhỏ hơn hôm nay"
                    />
                  </MuiPickersUtilsProvider>
                </div>
                <div className="form-group">
                  <label htmlFor="exampleFormControlSelect3">
                    Chọn khung giờ khám còn trống
                  </label>
                  <div
                    className="form-control"
                    style={{ minHeight: "100px", height: "auto" }}
                  >
                    {useMemo(() => {
                      return !timeFrames || timeFrames.length == 0 ? (
                        <span
                          style={{
                            color: "red",
                            display: "flex",
                            marginTop: "5px",
                          }}
                        >
                          <img
                            style={{ width: "16px", height: "16px" }}
                            src="images/ico-error.png"
                          ></img>
                          <p style={{ marginLeft: "1px" }}>
                            Không có khung giờ khám!
                          </p>
                        </span>
                      ) : (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            padding: "10px",
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, 60px)",
                            gridGap: "10px",
                          }}
                        >
                          {timeFrames.map((e, index) => {
                            return (
                              <TimeFrame
                                key={new Date().getTime() + index}
                                style={{
                                  margin: "5px",
                                  width: "60px",
                                  height: "58px",
                                  maxWidth: "60px",
                                  maxHeight: "58px",
                                }}
                                slot={e && e.remain && e.remain}
                                time={e && e.time && e.time}
                                disabled={
                                  compareWithNow(form.appointmentDate, e.time) <
                                  0
                                }
                                active={form.appointmentTime === e.time}
                                onSelect={(value) => {
                                  setInForm("appointmentTime", value);
                                }}
                              ></TimeFrame>
                            );
                          })}
                        </div>
                      );
                    }, [form.appointmentTime, timeFrames])}
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="exampleFormControlTextarea1">
                    Bệnh nhân ghi chú khác:
                  </label>
                  <textarea
                    name="note"
                    value={form.note}
                    className="form-control"
                    id="exampleFormControlTextarea1"
                    rows="3"
                    style={{ minHeight: "100px" }}
                    onChange={handleChange}
                  ></textarea>
                </div>
                <div className="form-group full-width justify-content-center text-center">
                  <button
                    type="button"
                    className="btn btn-primary btn-dangkykham"
                    onClick={handleSubmit}
                  >
                    Đăng ký khám
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
        <footer>
          <div className="footer_info p-0  container-fluid">
            <div className="container p-0 d-flex flex-wrap">
              <div className="footer_info_item col-md-4 col-sm-12">
                <p>
                  <span>{process.env.REACT_APP_HOSPITAL}</span>
                </p>
                <p>{process.env.REACT_APP_SLOGAN_EN}</p>
                <p className="mt-8">
                  <img src="images/map-marker.svg" alt="" width="16" />
                  {process.env.REACT_APP_ADDRESS}
                </p>
                {/* <div className="hotline_bottom">
                                    <p>
                                        <span className="sp-bg-red">CẤP CỨU:</span>
                                        <span className="sp-bg-white">02257.104.999 - 1</span>
                                    </p>
                                    <div className="clear"></div>
                                </div> */}
              </div>
              <div className="footer_info_item col-md-4 col-sm-12">
                <p>
                  <span>LIÊN HỆ</span>
                </p>
                <ul>
                  {/* <li><img src="images/telephone.svg" alt="" width="16"></img>Điện thoại: 02257.104.999 - 5</li> */}
                  {/* <li><img src="images/telephone.svg" alt="" width="16" />Cấp cứu 24/7: 0225.374.5122</li> */}
                  <li>
                    <img src="images/telephone.svg" alt="" width="16" />
                    Đường dây nóng: {process.env.REACT_APP_HOTLINE}
                  </li>
                </ul>
              </div>
              <div className="footer_info_item col-md-4 col-sm-12">
                <div className="full-width p-3"></div>
                <ul>
                  <li>
                    <img src="images/mail.svg" alt="" width="16" />
                    Email: {process.env.REACT_APP_EMAIL}
                  </li>
                  <li>
                    <img src="images/global.svg" alt="" width="16" />
                    Website:{" "}
                    <a href={process.env.REACT_APP_WEB_FULL} target="_blank">
                      {process.env.REACT_APP_WEB}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="copyright container text-white-50">
              Bản quyền ©{process.env.REACT_APP_YEAR} thuộc về{" "}
              {process.env.REACT_APP_HOSPITAL}
            </div>
          </div>
        </footer>
      </div>
    </MuiThemeProvider>
  );
}

export default ExaminationBooking;

function TimeFrame(props) {
  const { slot, time, active, disabled, onSelect } = props;
  const [bgColor, setBgColor] = useState("#e7e7e7");
  const [textColor, setTextColor] = useState("#000");
  const [slotBgColor, setSlotBgColor] = useState("#2371f2");

  useEffect(() => {
    setSlotBgColor(disabled ? "#636363" : "#2371f2");
    setTextColor(slot < 0 || active ? "#fff" : "#000");
    if (slot <= 0) {
      setBgColor("red");
    } else if (active) {
      setBgColor("#efb632");
    } else {
      setBgColor("#e7e7e7");
    }
  }, [time, active, slot, disabled]);

  return (
    <div
      style={{
        textAlign: "center",
        display: "block",
        cursor: "pointer",
        fontSize: "15px",
        backgroundColor: "#e7e7e7",
        ...props.style,
      }}
      onClick={(e) => {
        if (slot > 0 && !disabled) {
          onSelect(time);
        }
      }}
    >
      <div
        style={{
          backgroundColor: `${bgColor}`,
          color: `${textColor}`,
          width: "100%",
          height: "34px",
        }}
      >
        <p style={{ paddingTop: "5px" }}>{time}</p>
      </div>
      <div
        style={{
          color: "white",
          width: "100%",
          height: "24px",
          backgroundColor: `${slotBgColor}`,
        }}
      >
        {slot < 0 ? 0 : slot}
      </div>
    </div>
  );
}
