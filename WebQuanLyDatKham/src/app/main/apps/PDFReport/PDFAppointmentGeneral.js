import React from 'react'
import { styles } from './styles';
import moment from 'moment'
export const PDFAppointmentGeneral = (props) => (
  <div style={{ width: "600px", color: 'black', fontFamily: "Roboto" }} className="printPDf">
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
          Báo cáo đặt khám theo ngày
        </div>
        <div style={{ fontSize: "12px" }}>
          {
            props.department && props.department !== "" ?
              `(Theo phòng ban: ${props.department})`
              : "(Tất cả các phòng ban)"
          }
        </div>
        <div style={{ fontSize: "10px" }}>
          Từ ngày {moment(props.begin).format("DD/MM/YYYY")} đến {moment(props.end).format("DD/MM/YYYY")}
        </div>
      </div>
      <div style={{ marginTop: "10px", fontSize: "8px", width: "555px" }}>
        <table style={{ border: "1px solid black", cellPadding: 0, cellSpacing: 0, borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ wordWrap: "break-word", borderRight: "1px solid #333" }} >STT</th>
              <th style={{ wordWrap: "break-word", borderRight: "1px solid #333" }}>Ngày</th>
              <th style={{ wordWrap: "break-word", borderRight: "1px solid #333" }}>Tổng đặt khám</th>
              <th style={{ wordWrap: "break-word", borderRight: "1px solid #333" }}>Đã đến khám</th>
              <th style={{ wordWrap: "break-word", borderRight: "1px solid #333" }}>Đã hủy</th>
              <th style={{ wordWrap: "break-word", borderRight: "1px solid #333" }}>Chờ duyệt</th>
              <th style={{ wordWrap: "break-word", borderRight: "1px solid #333" }}>Đã duyệt</th>
            </tr>
          </thead>
          <tbody>
            {
              props.data && props.data.map((item, index) =>
                <tr>
                  <td style={{ wordWrap: "break-word", textAlign: "center", borderRight: "1px solid #333", borderTop: "1px solid #333" }}>
                    {index + 1}
                  </td>
                  <td style={{ wordWrap: "break-word", textAlign: "center", borderRight: "1px solid #333", borderTop: "1px solid #333", width: "90px" }}>
                    {moment(item.date).format("DD/MM/YYYY")}
                  </td>
                  <td style={{ wordWrap: "break-word", textAlign: "center", borderRight: "1px solid #333", borderTop: "1px solid #333", width: "90px" }}>
                    {item.total}
                  </td>
                  <td style={{ wordWrap: "break-word", textAlign: "center", borderRight: "1px solid #333", borderTop: "1px solid #333", width: "90px" }}>
                    {item.serves}
                  </td>
                  <td style={{ wordWrap: "break-word", textAlign: "center", borderRight: "1px solid #333", borderTop: "1px solid #333", width: "90px" }}>
                    {item.cancels}
                  </td>
                  <td style={{ wordWrap: "break-word", textAlign: "center", borderRight: "1px solid #333", borderTop: "1px solid #333", width: "90px" }}>
                    {item.waitings}
                  </td>
                  <td style={{ wordWrap: "break-word", textAlign: "center", borderRight: "1px solid #333", borderTop: "1px solid #333", width: "90px" }}>
                    {item.approves}
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
