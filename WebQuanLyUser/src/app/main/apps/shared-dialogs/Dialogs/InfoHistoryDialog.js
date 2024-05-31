import React, {useState} from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, DialogContentText } from '@material-ui/core'
import moment from 'moment'
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import InfoTest from '../../user-actions/Dialog/InfoTest'
import InfoDrugs from '../../user-actions/Dialog/InfoDrugs'

function InfoHistoryDialog(props){
  const { open, handleClose, data, action, createdTime, modifier, survey_result, appointment } = props
  const [currenImages, setCurrentImages] = useState([])
  const [openLightBox, setOpenLightBox] = useState(false)
  const [photoIndex, setPhotoIndex] = useState(0)
  const [openTest, setOpenTest] = useState(false)
  const [opentPres, setOpenPres] = useState(false)
  const [infoTest, setInfoTest] = useState([])
  const [infoPres, setInfoPres] = useState([])

  function handleCloseTest (){
    setOpenTest(false);
  }
  function handleClosePres (){
    setOpenPres(false);
  }
  return(
    <Dialog onClose = {handleClose} open = {open} id = "el-infoHistoryDialog">
      <InfoTest onCloseInfoDialog = {handleCloseTest} open = {openTest} test = {infoTest}/>
      <InfoDrugs onCloseInfoDialog = {handleClosePres} open = {opentPres} drugs = {infoPres}/>
      {
        openLightBox &&
        <Lightbox
          className = "el-Lightbox"
          imageTitle={"Ảnh liên quan"}
          mainSrc={process.env.REACT_APP_FILE_PREVIEW_URL + currenImages[photoIndex]}
          nextSrc={process.env.REACT_APP_FILE_PREVIEW_URL + currenImages[(photoIndex + 1) % currenImages.length]}
          prevSrc={process.env.REACT_APP_FILE_PREVIEW_URL + currenImages[(photoIndex + currenImages.length - 1) % currenImages.length]}
          onCloseRequest={() => {setOpenLightBox(false); setCurrentImages([])}}
          onMovePrevRequest={() => setPhotoIndex((photoIndex + currenImages.length - 1) % currenImages.length)}
          onMoveNextRequest={() =>setPhotoIndex((photoIndex + 1) % currenImages.length)}
        />
      }
      <DialogTitle id = "el-infoHistoryDialog-title">Chi tiết</DialogTitle>
      <DialogContent id = "el-infoHistoryDialog-content">
        <DialogContentText id = "el-infoHistoryDialog-contentText">
          <Grid container spacing={1}>
            <Grid item xs={6}>
              Loại hoạt động:
            </Grid>
            <Grid item xs={6}>
              <div className = "font-bold el-GridWordWrap">
                {action ===
                  "APPOINTMENT" ? "Đặt lịch khám"
                  : action === "SURVEY" ? "Thực hiện khảo sát"
                  : action === "SCANRESULT" ? "Kết quả chụp chiếu"
                  : action === "TESTRESULT" ? "Kết quả xét nghiệm"
                  : action === "EXAMINATION" ? "Kết quả khám"
                  : action === "TICKET" ? "Yêu cầu khách hàng"
                  : "Đơn thuốc"
                }
              </div>
            </Grid>
            <Grid item xs={6}>
              Thời gian tạo:
            </Grid>
            <Grid item xs={6}>
              <div className = "font-bold el-GridWordWrap">
                {moment(createdTime).format("HH:mm DD/MM/YYYY")}
              </div>
            </Grid>
            <Grid item xs={6}>
              Thực hiện bởi:
            </Grid>
            <Grid item xs={6}>
              <div className = "font-bold el-GridWordWrap">
                {modifier && modifier.account.base.fullName}
              </div>
            </Grid>
            {
              action === "APPOINTMENT" ?
                <Grid item xs={12}>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      Đăng ký qua kênh:
                    </Grid>
                    <Grid item xs={6}>
                      <div className = "font-bold el-GridWordWrap">
                        {appointment.channel}
                      </div>
                    </Grid>
                    <Grid item xs={6}>
                      Hẹn khám lúc:
                    </Grid>
                    <Grid item xs={6}>
                      <div className = "font-bold el-GridWordWrap">
                        {data.AppointmentTime} ngày {moment(data.AppointmentDate).format("DD/MM/YYYY")}
                      </div>
                    </Grid>
                    <Grid item xs={6}>
                      Khoa khám:
                    </Grid>
                    <Grid item xs={6}>
                      <div className = "font-bold el-GridWordWrap">
                        {appointment.department ? appointment.department.name : ""}
                      </div>
                    </Grid>
                    <Grid item xs={6}>
                      Nội dung khám:
                    </Grid>
                    <Grid item xs={6}>
                      <div className = "font-bold el-GridWordWrap">
                        {appointment.note ? appointment.note : ""}
                      </div>
                    </Grid>
                    <Grid item xs={6}>
                      Tình trạng:
                    </Grid>
                    <Grid item xs={6}>
                      <div className = "font-bold el-GridWordWrap">
                        {
                          appointment.state === "WAITING" ? "Chờ duyệt"
                          : appointment.state === "CANCEL" ? "Đã hủy"
                          : appointment.state === "SERVED" ? "Đã phục vụ"
                          : "Đã duyệt"
                        }
                      </div>
                    </Grid>
                  </Grid>
                </Grid>
              : action === "TICKET" ?
                <Grid item xs={12}>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      Tiêu đề:
                    </Grid>
                    <Grid item xs={6}>
                      <div className = "font-bold el-GridWordWrap">
                        {data.Title}
                      </div>
                    </Grid>
                    <Grid item xs={6}>
                      Loại yêu cầu:
                    </Grid>
                    <Grid item xs={6}>
                      <div className = "font-bold el-GridWordWrap">
                        {data.Type === 1? "Khiếu nại" : "Tư vấn"}
                      </div>
                    </Grid>
                    <Grid item xs={6}>
                      Tình trạng:
                    </Grid>
                    <Grid item xs={6}>
                      <div className = "font-bold el-GridWordWrap">
                        {data.Type === 1? "Đã xử lý" : "Chưa xử lý"}
                      </div>
                    </Grid>
                  </Grid>
                </Grid>
              : action === "EXAMINATION" ?
                <Grid item xs={12}>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      Kết luận của bác sỹ:
                    </Grid>
                    <Grid item xs={6}>
                      <div className = "font-bold el-GridWordWrap">
                        {data.Conclusion}
                      </div>
                    </Grid>
                    <Grid item xs={6}>
                      Ghi chú của bác sỹ:
                    </Grid>
                    <Grid item xs={6}>
                      <div className = "font-bold el-GridWordWrap">
                        {data.Note ? data.Note : ""}
                      </div>
                    </Grid>
                    <Grid item xs={6}>
                      Khám lại:
                    </Grid>
                    <Grid item xs={6}>
                      <div className = "font-bold el-GridWordWrap">
                        {
                          data.ReExamination === true ?
                            data.ReExaminationTime + "ngày" + moment(data.ReExaminiationDate).format("DD/MM/YYYY")
                          : "Không phải khám lại"
                        }
                      </div>
                    </Grid>
                  </Grid>
                </Grid>
              : action === "TESTRESULT" ?
                <Grid item xs={12}>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      Tên kết quả xét nghiệm:
                    </Grid>
                    <Grid item xs={6}>
                      <div className = "font-bold el-GridWordWrap">
                        {data.Title}
                      </div>
                    </Grid>
                    <Grid item xs={6}>
                      Số mẫu:
                    </Grid>
                    <Grid item xs={6}>
                      <div className = "font-bold el-GridWordWrap">
                        {data.TestId}
                      </div>
                    </Grid>
                    <Grid item xs={6}>
                      Số xét nghiệm:
                    </Grid>
                    <Grid item xs={6}>
                      {
                        data.UnitResults && data.UnitResults.length>0?
                          <label htmlFor="text-button-file">
                            <Button
                              className = "el-ButtonLowerCase-ShowDialog"
                              component="span"
                              onClick = {() =>{setOpenTest(true); setInfoTest(data.UnitResults)}}>{data.UnitResults.length} xét nghiệm
                            </Button>
                          </label>
                        :<label htmlFor="text-button-file">
                          <Button
                            className = "el-ButtonLowerCase-ShowDialog"
                            component="span"
                            disabled
                          >0 xét nghiệm
                          </Button>
                        </label>
                      }
                    </Grid>
                  </Grid>
                </Grid>
              : action === "PRESCRIPTION" ?
                <Grid item xs={12}>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      Ghi chú của bác sỹ:
                    </Grid>
                    <Grid item xs={6}>
                      <div className = "font-bold el-GridWordWrap">
                        {data.Note? data.Note : ""}
                      </div>
                    </Grid>
                    <Grid item xs={6}>
                      Danh mục thuốc:
                    </Grid>
                    <Grid item xs={6}>
                      {
                        data.Drugs && data.Drugs.length>0?
                          <label htmlFor="text-button-file">
                            <Button
                              className = "el-ButtonLowerCase-ShowDialog"
                              component="span"
                              onClick = {() =>{setOpenPres(true); setInfoPres(data.Drugs)}}>{data.Drugs.length} loại thuốc
                            </Button>
                          </label>
                        : <label htmlFor="text-button-file">
                          <Button
                            className = "el-ButtonLowerCase-ShowDialog"
                            component="span"
                            disabled
                          >0 loại thuốc
                          </Button>
                        </label>
                      }
                    </Grid>
                  </Grid>
                </Grid>
              : action === "SCANRESULT" ?
                <Grid item xs={12}>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      Kết luận của bác sỹ:
                    </Grid>
                    <Grid item xs={6}>
                      <div className = "font-bold el-GridWordWrap">
                        {data.Conclusion? data.Conclusion : ""}
                      </div>
                    </Grid>
                    <Grid item xs={6}>
                      Ghi chú của bác sỹ:
                    </Grid>
                    <Grid item xs={6}>
                      <div className = "font-bold el-GridWordWrap">
                        {data.Note? data.Note : ""}
                      </div>
                    </Grid>
                  </Grid>
                </Grid>
              : action === "SURVEY" ?
                <Grid item xs={12}>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      Tên khảo sát:
                    </Grid>
                    <Grid item xs={6}>
                      <div className = "font-bold el-GridWordWrap">
                        { survey_result && survey_result.survey && survey_result.survey.name? survey_result.survey.name : ""}
                      </div>
                    </Grid>
                    <Grid item xs={6}>
                      Tiêu đề:
                    </Grid>
                    <Grid item xs={6}>
                      <div className = "font-bold el-GridWordWrap">
                        {survey_result && survey_result.survey && survey_result.survey.title ? survey_result.survey.title : ""}
                      </div>
                    </Grid>
                  </Grid>
                </Grid>
              : <div></div>
            }
            {
              data.Images &&
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    Ảnh liên quan:
                  </Grid>
                  <Grid item xs={6} className = "el-GridWordWrap flex">
                    {
                      data.Images.length>0?
                        <label htmlFor="text-button-file">
                          <Button className = "el-ButtonLowerCase-ShowDialog" component="span" onClick={()=>{setCurrentImages(data.Images); setOpenLightBox(true)}}>{data.Images.length} ảnh</Button>
                        </label>
                      : <label htmlFor="text-button-file">
                        <Button
                          className = "el-ButtonLowerCase-ShowDialog"
                          component="span"
                          disabled
                        >0 ảnh
                        </Button>
                      </label>
                    }
                  </Grid>
                </Grid>
              </Grid>
            }
          </Grid>
        </DialogContentText>
      </DialogContent>
      <DialogActions className = "el-infoUA-buttonGroup">
        <Button onClick={handleClose} color = "primary" id = "el-infoUA-buttonClose">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
}
export default InfoHistoryDialog;
