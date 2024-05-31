import React from 'react'
import { styles } from './styles';
import moment from 'moment'
export const PDFSMSLogs = (props) => (
  <div style={{ width: "600px", color: 'black', fontFamily: "Roboto" }} className="printPDf">
    <div style={{ display: 'flex' }}>
      <img style={{ width: "96px", height: "96px" }} alt="img_logo" src={process.env.REACT_APP_LOGO_IMAGE} />
      {/* <img style = {{width: "64px", height: "24px"}} alt = "img_logo" src = "assets/images/logos/elsaga.png"/> */}
      <div style={{ display: 'flex', alignItems: 'center', marginLeft: '15px' }}>
        <h4>{process.env.REACT_APP_HOSPITAL_UPPERCASE}</h4>
      </div>
    </div>
    <div style={{ marginTop: '35px' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: "20px", textTransform: 'uppercase' }}>
          Báo cáo lịch sử gửi SMS
        </div>
        <div style={{ fontSize: "12px" }}>
          {
            props.campaignName && props.campaignName !== "" ?
              `(Theo chiến dịch: ${props.campaignName})`
              : "(Tất cả chiến dịch)"
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
              <th style={{ wordWrap: "break-word", borderRight: "1px solid #333" }}>Số điện thoại</th>
              <th style={{ wordWrap: "break-word", borderRight: "1px solid #333" }}>Nội dung</th>
              <th style={{ wordWrap: "break-word", borderRight: "1px solid #333" }}>Trạng thái</th>
              <th style={{ wordWrap: "break-word", borderRight: "1px solid #333" }}>Số lần gửi lại</th>
              <th style={{ wordWrap: "break-word", borderRight: "1px solid #333" }}>Thời gian gửi</th>
            </tr>
          </thead>
          <tbody>
            {
              props.data && props.data && props.data.map((item, index) =>
                <tr>
                  <td style={{ wordWrap: "break-word", textAlign: "center", borderRight: "1px solid #333", borderTop: "1px solid #333" }}>
                    {index + 1}
                  </td>
                  <td style={{ wordWrap: "break-word", textAlign: "center", borderRight: "1px solid #333", borderTop: "1px solid #333", width: "80px" }}>
                    {item.phone_number ? item.phone_number : ""}
                  </td>
                  <td style={{ wordWrap: "break-word", borderRight: "1px solid #333", borderTop: "1px solid #333", width: "150px" }}>
                    {item.message ? item.message : ""}
                  </td>
                  <td style={{ wordWrap: "break-word", textAlign: "center", borderRight: "1px solid #333", borderTop: "1px solid #333", width: "100px" }}>
                    {item.state === true ? "Thành công" : "Không thành công"}
                  </td>
                  <td style={{ wordWrap: "break-word", textAlign: "center", borderRight: "1px solid #333", borderTop: "1px solid #333", width: "100px" }}>
                    {item.retry_num ? item.retry_num : 0}
                  </td>
                  <td style={{ wordWrap: "break-word", textAlign: "center", borderRight: "1px solid #333", borderTop: "1px solid #333", width: "100px" }}>
                    {moment(item.createdTime).format("DD/MM/YYYY HH:MM:ss")}
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
