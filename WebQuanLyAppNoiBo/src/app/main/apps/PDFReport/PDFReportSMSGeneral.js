import React from 'react'
import { styles } from './styles';
import moment from 'moment'
export const PDFReportSMSGeneral = (props) => (
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
          Báo cáo tổng quát SMS
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
              <th style={{ wordWrap: "break-word", borderRight: "1px solid #333" }}>Tên chiến dịch</th>
              <th style={{ wordWrap: "break-word", borderRight: "1px solid #333" }}>Số lượng</th>
            </tr>
          </thead>
          <tbody>
            {
              props.data && props.data.campaigns && props.data.campaigns.map((item, index) =>
                <tr>
                  <td style={{ wordWrap: "break-word", textAlign: "center", borderRight: "1px solid #333", borderTop: "1px solid #333" }}>
                    {index + 1}
                  </td>
                  <td style={{ wordWrap: "break-word", borderRight: "1px solid #333", borderTop: "1px solid #333", width: "270px" }}>
                    {item.campaign_name ? item.campaign_name : ""}
                  </td>
                  <td style={{ wordWrap: "break-word", textAlign: "center", borderRight: "1px solid #333", borderTop: "1px solid #333", width: "270px" }}>
                    {item.total}
                  </td>
                </tr>
              )
            }
          </tbody>
          <tfoot>
            <tr>
              <td style={{ wordWrap: "break-word", textAlign: "center", borderTop: "1px solid #333" }}>
              </td>
              <td style={{ wordWrap: "break-word", borderTop: "1px solid #333", width: "540px" }}>
                <b>Tổng số tin nhắn gửi thành công: </b> {props.data ? props.data.success : ""} / {props.data ? props.data.total : ""}
              </td>
              <td style={{ wordWrap: "break-word", textAlign: "center", borderTop: "1px solid #333" }}>
              </td>
            </tr>
          </tfoot>
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
