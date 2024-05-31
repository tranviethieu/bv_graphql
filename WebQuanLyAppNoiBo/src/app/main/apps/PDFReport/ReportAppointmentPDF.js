import React from 'react'
import { styles } from './styles';
import moment from 'moment'
import * as StringUtils from "../utils/StringUtils";
export const ReportAppointmentPDF = (props) => (
  <div style={{ width: "600px", color: 'black', fontFamily: "Roboto" }} className="printPDf">
    <div style={{ display: 'flex' }}>
      <img style={{ width: "96px", height: "96px" }} alt="img_logo" src={process.env.REACT_APP_LOGO} />
      <div style={{ display: 'flex', alignItems: 'center', marginLeft: '15px' }}>
        <h4>{process.env.REACT_APP_HOSPITAL_UPPERCASE}</h4>
      </div>
    </div>
    <div style={{ marginTop: '35px' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: "20px", textTransform: 'uppercase' }}>
          Báo cáo đặt lịch khám
        </div>
        {/* <div style = {{ fontSize: "12px" }}>
            {
              props.timeFrame && props.timeFrame !== "" ?
            `(Khung giờ làm việc: ${props.timeFrame})`
              : "(Tất cả các khung giờ làm việc)"
            }
          </div> */}
        <div style={{ fontSize: "10px" }}>
          Từ ngày {moment(props.begin).format("DD/MM/YYYY")} đến {moment(props.end).format("DD/MM/YYYY")}
        </div>
      </div>
      <div style={{ marginTop: "10px", fontSize: "8px", width: "555px" }}>
        <table style={{ border: "1px solid black", cellPadding: 0, cellSpacing: 0, borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ wordWrap: "break-word", borderRight: "1px solid #333" }} >STT</th>
              <th style={{ wordWrap: "break-word", borderRight: "1px solid #333", width: "100px" }}>Tên khách hàng</th>
              <th style={{ wordWrap: "break-word", borderRight: "1px solid #333", width: "55px" }}>Số điện thoại</th>
              <th style={{ wordWrap: "break-word", borderRight: "1px solid #333", width: "30px" }}>Năm sinh</th>
              <th style={{ wordWrap: "break-word", borderRight: "1px solid #333", width: "50px" }}>Thời gian đặt</th>
              <th style={{ wordWrap: "break-word", borderRight: "1px solid #333", width: "50px" }}>Thời gian khám</th>
              <th style={{ wordWrap: "break-word", borderRight: "1px solid #333" }}>Nội dung khám</th>
              <th style={{ wordWrap: "break-word", borderRight: "1px solid #333", width: "100px" }}>Khoa/Phòng ban</th>
              <th style={{ wordWrap: "break-word", borderRight: "1px solid #333", width: "70px" }}>Kênh</th>
              <th style={{ wordWrap: "break-word", width: "70px" }}>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {
              props.data && props.data.map((item, index) =>
                <tr key={index}>
                  <td style={{ wordWrap: "break-word", textAlign: "center", borderRight: "1px solid #333", borderTop: "1px solid #333" }}>
                    {index + 1}
                  </td>
                  <td style={{ wordWrap: "break-word", borderRight: "1px solid #333", borderTop: "1px solid #333", width: "100px" }}>
                    {item.user ? item.user.fullName : ""}
                  </td>
                  <td style={{ wordWrap: "break-word", textAlign: "center", borderRight: "1px solid #333", borderTop: "1px solid #333", width: "55px" }}>
                    {item.user ? item.user.phoneNumber : ""}
                  </td>
                  <td style={{ wordWrap: "break-word", textAlign: "center", borderRight: "1px solid #333", borderTop: "1px solid #333", width: "30px" }}>
                    {moment(item.user ? item.user.birthDay : "").format("YYYY")}
                  </td>
                  <td style={{ borderRight: "1px solid #333", borderTop: "1px solid #333", width: "50px" }}>
                    <div style={{ wordWrap: "break-word", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                      <div style={{ fontSize: '7px', border: "0.5px solid #333", borderRadius: "25px", marginTop: "1px", paddingLeft: "5px", paddingRight: "5px" }}>
                        {moment(item.createdTime).format("HH:mm")}
                      </div>
                      <div style={{ fontSize: '8px' }}>
                        {moment(item.createdTime).format("DD/MM/YYYY")}
                      </div>
                    </div>
                  </td>
                  <td style={{ borderRight: "1px solid #333", borderTop: "1px solid #333", width: "50px" }}>
                    <div style={{ wordWrap: "break-word", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                      <div style={{ fontSize: '7px', border: "0.5px solid #333", borderRadius: "25px", marginTop: "1px", paddingLeft: "5px", paddingRight: "5px" }}>
                        {item.appointment.appointmentTime}
                      </div>
                      <div style={{ fontSize: '8px' }}>
                        {moment(item.appointment.appointmentDate).format("DD/MM/YYYY")}
                      </div>
                    </div>
                  </td>
                  <td style={{ wordWrap: "break-word", borderRight: "1px solid #333", borderTop: "1px solid #333", width: "120px" }}>
                    {item.appointment.note}
                  </td>
                  <td style={{ wordWrap: "break-word", borderRight: "1px solid #333", borderTop: "1px solid #333", width: "100px" }}>
                    {item.appointment.department ? item.appointment.department.name : ""}
                  </td>
                  <td style={{ wordWrap: "break-word", textAlign: "center", borderRight: "1px solid #333", borderTop: "1px solid #333", width: "70px" }}>
                    {StringUtils.parseChannel(item.appointment.channel)}
                  </td>
                  <td style={{ wordWrap: "break-word", textAlign: "center", borderRight: "1px solid #333", borderTop: "1px solid #333", width: "70px" }}>
                    {item.appointment.state === "WAITING" ? "Chờ duyệt" : item.appointment.state === "CANCEL" ? "Đã hủy" : item.appointment.state === "SERVED" ? "Đã phục vụ" : "Đã duyệt"}
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
