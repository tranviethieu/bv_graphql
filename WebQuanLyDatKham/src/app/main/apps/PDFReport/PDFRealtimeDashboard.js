import React from 'react'
import { styles } from './styles';
import moment from 'moment'
import * as StringUtils from "../utils/StringUtils";

export const PDFRealtimeDashboard = (props) => (
  <div style={{ width: "850px", color: 'black', fontFamily: "Roboto" }} className="printPDf">
    <div style={{ display: 'flex' }}>
      <img style={{ width: "96px", height: "96px" }} alt="img_logo" src={process.env.REACT_APP_LOGO_IMAGE} />
      {/* <img style = {{width: "64px", height: "24px"}} alt = "img_logo" src = "assets/images/logos/elsaga.png"/> */}
      <div style={{ display: 'flex', alignItems: 'center', marginLeft: '15px' }}>
        <h4>{process.env.REACT_APP_HOSPITAL_UPPERCASE}</h4>
        {/* <h4>HỆ THỐNG ĐẶT KHÁM VÀ CHĂM SÓC SỨC KHỎE ĐA KÊNH MECARE</h4> */}
      </div>
    </div>
    <div style={{ marginTop: '35px' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: "20px", textTransform: 'uppercase' }}>
          Báo cáo đặt khám trong ngày
        </div>
        <div style={{ fontSize: "12px" }}>
          <div>
            Trạng thái đặt khám: {props.stateFilter === "APPROVE" ? "Đã duyệt" : props.stateFilter === "WAITING" ? "Chờ duyệt" : "Tất cả trạng thái"}
          </div>
        </div>
        <div style={{ fontSize: "10px" }}>
          Từ ngày {moment(props.begin).format("DD/MM/YYYY")} đến {moment(props.end).format("DD/MM/YYYY")}
        </div>
      </div>
      <div style={{ marginTop: "10px", fontSize: "8px", width: "800px" }}>
        <table style={{ border: "1px solid black", cellPadding: 0, cellSpacing: 0, borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ wordWrap: "break-word", borderRight: "1px solid #333" }} >STT</th>
              <th style={{ wordWrap: "break-word", borderRight: "1px solid #333" }}>Khách hàng</th>
              <th style={{ wordWrap: "break-word", borderRight: "1px solid #333" }}>SĐT</th>
              <th style={{ wordWrap: "break-word", borderRight: "1px solid #333" }}>Ngày sinh</th>
              <th style={{ wordWrap: "break-word", borderRight: "1px solid #333" }}>Tháng sinh</th>
              <th style={{ wordWrap: "break-word", borderRight: "1px solid #333" }}>Năm sinh</th>
              <th style={{ wordWrap: "break-word", borderRight: "1px solid #333" }}>Giới tính</th>
              <th style={{ wordWrap: "break-word", borderRight: "1px solid #333" }}>Địa chỉ</th>
              <th style={{ wordWrap: "break-word", borderRight: "1px solid #333" }}>Thời gian đặt</th>
              <th style={{ wordWrap: "break-word", borderRight: "1px solid #333" }}>Thời gian khám</th>
              <th style={{ wordWrap: "break-word", borderRight: "1px solid #333" }}>Kênh</th>
              <th style={{ wordWrap: "break-word", borderRight: "1px solid #333" }}>Khoa/Phòng ban</th>
              <th style={{ wordWrap: "break-word", borderRight: "1px solid #333" }}>Nội dung khám</th>
              <th style={{ wordWrap: "break-word", borderRight: "1px solid #333" }}>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {
              props.data && props.data.map((item, index) =>
                <tr>
                  <td style={{ wordWrap: "break-word", textAlign: "center", borderRight: "1px solid #333", borderTop: "1px solid #333" }}>
                    {index + 1}
                  </td>
                  <td style={{ wordWrap: "break-word", textAlign: "center", borderRight: "1px solid #333", borderTop: "1px solid #333", width: "120px" }}>
                    {item.inputPatient ? item.inputPatient.fullName : ""}
                  </td>
                  <td style={{ wordWrap: "break-word", textAlign: "center", borderRight: "1px solid #333", borderTop: "1px solid #333", width: "70px" }}>
                    {item.inputPatient ? item.inputPatient.phoneNumber : ""}
                  </td>
                  <td style={{ wordWrap: "break-word", textAlign: "center", borderRight: "1px solid #333", borderTop: "1px solid #333", width: "30px" }}>
                    {moment(item.inputPatient ? item.inputPatient.birthDay : "").format("DD")}
                  </td>
                  <td style={{ wordWrap: "break-word", textAlign: "center", borderRight: "1px solid #333", borderTop: "1px solid #333", width: "30px" }}>
                    {moment(item.inputPatient ? item.inputPatient.birthDay : "").format("MM")}
                  </td>
                  <td style={{ wordWrap: "break-word", textAlign: "center", borderRight: "1px solid #333", borderTop: "1px solid #333", width: "30px" }}>
                    {moment(item.inputPatient ? item.inputPatient.birthDay : "").format("YYYY")}
                  </td>
                  <td style={{ wordWrap: "break-word", textAlign: "center", borderRight: "1px solid #333", borderTop: "1px solid #333", width: "90px" }}>
                    {item.inputPatient ? item.inputPatient.gender === '1' ? "Nam" : item.inputPatient.gender === '2' ? "Nữ" : "Chưa xác định" : ""}
                  </td>
                  <td style={{ wordWrap: "break-word", textAlign: "center", borderRight: "1px solid #333", borderTop: "1px solid #333", minWidth: "120px" }}>
                    {item.inputPatient &&
                      <span>
                        {item.inputPatient.street} {item.inputPatient.ward && ` - ${item.inputPatient.ward.name}`} {item.inputPatient.district && ` - ${item.inputPatient.district.name}`}{item.inputPatient.province && ` - ${item.inputPatient.province.name}`} {item.inputPatient.nationality && ` - ${item.inputPatient.nationality.name}`}
                      </span>
                    }
                  </td>
                  <td style={{ wordWrap: "break-word", textAlign: "center", borderRight: "1px solid #333", borderTop: "1px solid #333", width: "90px" }}>
                    {moment(item.createdTime ? item.createdTime : moment()).format("HH:mm DD/MM/YYYY")}
                  </td>
                  <td style={{ wordWrap: "break-word", textAlign: "center", borderRight: "1px solid #333", borderTop: "1px solid #333", width: "90px" }}>
                    {item.appointmentTime} {moment(item.appointmentDate ? item.appointmentDate : moment()).format("DD/MM/YYYY")}
                  </td>
                  <td style={{ wordWrap: "break-word", textAlign: "center", borderRight: "1px solid #333", borderTop: "1px solid #333", width: "90px" }}>
                    {item.channel ? StringUtils.parseChannel(item.channel) : ""}
                  </td>
                  <td style={{ wordWrap: "break-word", textAlign: "center", borderRight: "1px solid #333", borderTop: "1px solid #333", minWidth: "90px" }}>
                    {item.department ? item.department.name : "Khoa phòng ban đã bị xóa/không tồn tại"}
                  </td>
                  <td style={{ wordWrap: "break-word", textAlign: "center", borderRight: "1px solid #333", borderTop: "1px solid #333", minWidth: "90px" }}>
                    {item.note ? item.note : ""}
                  </td>
                  <td style={{ wordWrap: "break-word", textAlign: "center", borderRight: "1px solid #333", borderTop: "1px solid #333", width: "120px" }}>
                    {item.state === "WAITING" ? "Chờ duyệt" : item.state === "CANCEL" ? "Đã hủy" : item.state === "SERVED" ? "Đã đến khám" : "Đã duyệt"}
                  </td>
                </tr>
              )
            }
          </tbody>
        </table>
      </div>
      <style>{styles}</style>

      <div style={{ marginTop: "30px", fontSize: "8px", float: "right", marginRight: "50px", position: "relative" }}>
        <div style={{ textAlign: 'center' }}>
          <i>Ngày.....tháng.....năm.......</i>
        </div>
        <div style={{ fontWeight: "bold", textAlign: 'center' }}>
          Người lập biểu
        </div>
      </div>
    </div>
  </div>
)
