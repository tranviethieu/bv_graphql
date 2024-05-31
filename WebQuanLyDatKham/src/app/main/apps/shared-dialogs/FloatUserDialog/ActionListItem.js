import React, { useState } from 'react';
import { IconButton, Icon, Typography, ListItem, Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import amber from '@material-ui/core/colors/amber';
import TodoChip from './TodoChip';
import clsx from 'clsx';
import moment from 'moment';
import InfoHistoryDialog from '../Dialogs/InfoHistoryDialog'

const useStyles = makeStyles(theme => ({
    todoItem: {
        '&.completed': {
            background: 'rgba(0,0,0,0.03)',
            '& .todo-title, & .todo-notes': {
                textDecoration: 'line-through'
            }
        }
    },
    margin: {
        margin: theme.spacing(2),
    },
    flexBetween: {
        justifyContent: "space-between",
        display: "flex"
    },

}));

function ActionListItem(props) {
    const classes = useStyles(props);
    const { createdTime, data, modifier, action, appointment, survey_result } = props.todo;
    const [open, setOpen] = useState(false);
    function handleClose(){
      setOpen(false)
    }
    function handleOpen(){
      setOpen(true)
    }
    return (
        <div id = "el-coverActionListItem">
          <InfoHistoryDialog open = {open} handleClose = {handleClose} data = {data} action = {action} modifier = {modifier} createdTime = {createdTime} survey_result = {survey_result} appointment = {appointment}/>
          <ListItem
            className={clsx(classes.todoItem, { "completed": props.todo.completed }, "border-solid border-b-1 py-16  px-0 sm:px-8 el-ActionListItem")}
            onClick={handleOpen}
            dense
            button
          >
            <div className="flex flex-1 flex-col relative overflow-hidden pl-8">
              <div className={clsx(classes.flexBetween, "mt-8")}>
                <TodoChip
                  className="mr-4"
                  title={action === "APPOINTMENT" ? "Đặt khám" : action === "EXAMINATION" ? "Kết quả khám" : action === "SCANRESULT" ? "Kết quả Chiếu/Chụp" : action === "TESTRESULT" ? "Kết quả xét nghiệm" :action === "PRESCRIPTION" ? "Đơn thuốc": action === "SURVEY" ? "Thực hiện khảo sát" : "Yêu cầu khách hàng"}
                    color={action === "APPOINTMENT" ? "#388E3C" : action === "EXAMINATION" ? "#F44336" : action === "SCANRESULT" ? "#9C27B0" : action === "TESTRESULT" ? "#0091EA" :action === "PRESCRIPTION" ? "#FF4000" : action === "SURVEY" ? "#5FB404" : "#FF9800" }
                          />
                    <Typography className="text-12" color="textSecondary">
                      {moment(createdTime).format("HH:mm [ngày] DD-MM-YYYY")}
                    </Typography>
                  </div>

                  {
                    action === "APPOINTMENT" && appointment && <div className={classes.flexBetween}>
                      <div>
                        <div
                          color="textPrimary"
                          className="todo-notes truncate flex flex-1"
                        >
                          <Typography className="text-12">Hẹn khám lúc:</Typography>
                          <Typography className="ml-4 text-12" color="secondary">
                            {appointment.appointmentTime} ngày {moment(appointment.appointmentDate).format("DD/MM/YYYY")}
                          </Typography>
                        </div>
                        <div
                          color="textPrimary"
                          className="todo-notes truncate flex flex-1"
                        >
                          <Typography className="text-12">Khoa khám:</Typography>
                          <Typography className="font-bold ml-4 text-12">{appointment.department ? appointment.department.name : ""}</Typography>
                        </div>
                        <div
                          color="textPrimary"
                          className="todo-notes truncate flex flex-1"
                        >
                          <Typography className="text-12">Nội dung khám:</Typography>
                          <Typography className="ml-4 text-12">{appointment.note>=45?appointment.note.substring(0, 45) + "...":appointment.note}</Typography>
                        </div>

                      </div>
                      <div>
                        {appointment.state === "WAITING" ?
                          <Tooltip title="Chờ duyệt" placement="bottom">
                            <Icon className="text-orange">radio_button_unchecked</Icon>
                          </Tooltip>
                        : appointment.state === "CANCEL" ?
                          <Tooltip title="Đã hủy" placement="bottom">
                            <Icon className="text-red">remove_circle</Icon>
                          </Tooltip>
                        : appointment.state === "SERVED" ?
                          <Tooltip title="Đã đến khám" placement="bottom">
                            <Icon className="text-blue">check_circle</Icon>
                          </Tooltip>
                        :
                        <Tooltip title="Đã duyệt" placement="bottom">
                          <Icon className="text-green">check_circle</Icon>
                        </Tooltip>
                        }
                      </div>

                    </div>
                  }
                  {
                    action === "EXAMINATION" && <div>
                      {data.Conclusion && data.Conclusion.length > 0 && <div
                        color="textPrimary"
                        className="todo-notes truncate flex flex-1"
                                                                        >
                        <Typography className="text-12">Kết luận:</Typography>
                        <Typography className="font-bold ml-4 text-12">{data.Conclusion}</Typography>
                      </div>
                      }
                      {data.ReExamination === true ? <div
                        color="textPrimary"
                        className="todo-notes truncate flex flex-1"
                                                     >
                        <Typography className="text-12">Khám lại lúc:</Typography>
                        <Typography className="ml-4 text-12" color="secondary">
                          {data.ReExaminationTime} ngày {moment(data.ReExaminiationDate).format("DD/MM/YYYY")}
                        </Typography>
                      </div>
                      : <div
                        color="textPrimary"
                        className="todo-notes truncate flex flex-1"
                        >
                        <Typography className="text-12">Không phải khám lại</Typography>
                      </div>
                      }
                    </div>
                  }
                  {
                    action === "SURVEY" && <div className={classes.flexBetween}>
                      <div>
                        <div
                          color="textPrimary"
                          className="todo-notes truncate flex flex-1"
                        >
                          <Typography className="text-12">Tên khảo sát:</Typography>
                          <Typography className="font-bold ml-4 text-12">{survey_result && survey_result.survey? survey_result.survey.name : ""}</Typography>
                        </div>

                        <div
                          color="textPrimary"
                          className="todo-notes truncate flex flex-1"
                        >
                          <Typography className="text-12">Đã trả lời:</Typography>
                          <Typography className="ml-4 text-12 font-bold">{survey_result && survey_result.survey? survey_result.data.length + "/" + survey_result.survey.questionIds.length + " câu hỏi" : ''}</Typography>
                        </div>
                      </div>
                    </div>
                  }
                  {
                    action === "TESTRESULT" && <div>
                      <div
                        color="textPrimary"
                        className="todo-notes truncate flex flex-1"
                      >
                        <Typography className="text-12">Tên kết quả xét nghiệm:</Typography>
                        <Typography className="font-bold ml-4 text-12">{data.Title}</Typography>
                      </div>
                      {data.TestId && data.TestId.length > 0 && <div
                        color="textPrimary"
                        className="todo-notes truncate flex flex-1"
                                                                >
                        <Typography className="text-12">Số mẫu:</Typography>
                        <Typography className="font-bold ml-4 text-12">{data.TestId}</Typography>
                      </div>
                      }
                      {data.UnitResults && <div
                        color="textPrimary"
                        className="todo-notes truncate flex flex-1"
                                           >
                        <Typography className="text-12">Số xét nghiệm:</Typography>
                        <Typography className="font-bold ml-4 text-12">{data.UnitResults ?data.UnitResults.length: 0}</Typography>
                      </div>
                      }
                    </div>
                  }
                  {
                    action === "SCANRESULT" && <div>
                      {data.Conclusion && data.Conclusion.length > 0 && <div
                        color="textPrimary"
                        className="todo-notes truncate flex flex-1"
                                                                        >
                        <Typography className="text-12">Kết luận:</Typography>
                        <Typography className="font-bold ml-4 text-12">{data.Conclusion}</Typography>
                      </div>
                      }
                      <div
                        color="textPrimary"
                        className="todo-notes truncate flex flex-1"
                      >
                        <Typography className="text-12">Số phim chụp chiếu:</Typography>
                        <Typography className="font-bold ml-4 text-12">{data.Images.length}</Typography>
                      </div>
                    </div>
                  }
                  {
                    action === "TICKET" && <div className={classes.flexBetween}>
                      <div>
                        <div
                          color="textPrimary"
                          className="todo-notes truncate flex flex-1"
                        >
                          <Typography className="text-12">Tiêu đề:</Typography>
                          <Typography className="font-bold ml-4 text-12">{data.Title}</Typography>
                        </div>
                        <div
                          color="textPrimary"
                          className="todo-notes truncate flex flex-1"
                        >
                          <Typography className="text-12">Loại yêu cầu:</Typography>
                          <Typography className="font-bold ml-4 text-12">{data.Type === 1? "Khiếu nại" : "Tư vấn"}</Typography>
                        </div>
                        <div
                          color="textPrimary"
                          className="todo-notes truncate flex flex-1"
                        >
                          <Typography className="text-12">Nội dung:</Typography>
                          <Typography className="ml-4 text-12">{data.Note && data.Note.length>=45?data.Note.substring(0, 45) + "...":data.Note}</Typography>
                        </div>
                      </div>
                      <div>
                        {data.State === 0 ?
                          <Tooltip title="Chưa xử lý" placement="bottom">
                            <Icon className="text-orange">access_time</Icon>
                          </Tooltip>
                        :
                        <Tooltip title="Đã xử lý" placement="bottom">
                          <Icon className="text-blue">check_circle</Icon>
                        </Tooltip>
                        }
                      </div>
                    </div>
                  }
                  {
                    action === "PRESCRIPTION" && <div>
                      <div
                        color="textPrimary"
                        className="todo-notes truncate flex flex-1"
                      >
                        <Typography className="text-12">Số thuốc kê:</Typography>
                        <Typography className="font-bold ml-4 text-12">{data.Drugs ? data.Drugs.length : 0}</Typography>
                      </div>

                      { data.Note && data.Note.length>0 &&
                        <div
                          color="textPrimary"
                          className="todo-notes truncate flex flex-1"
                        >
                          <Typography className="text-12">Ghi chú:</Typography>
                          <Typography className="ml-4 text-12">{data.Note.length>=45?data.Note.substring(0, 45) + "...":data.Note}</Typography>
                        </div>
                      }


                    </div>
                  }
                  <div
                    color="textPrimary"
                    className="todo-notes truncate flex flex-1"
                  >
                    <Typography className="text-12">Thực hiện bởi:</Typography>
                    <Typography className="font-bold ml-4 text-12">{modifier && modifier.account.base.fullName}</Typography>
                  </div>


                </div>

                <div className="px-8">
                  {
                    action === "appointment" && data && <IconButton onClick={(ev) => {
                      ev.preventDefault();
                      ev.stopPropagation();

                    }}>
                      {data.state === "waiting" ? (
                        <Icon style={{ color: amber[500] }}>check_box_outline_blank</Icon>
                      ) : (
                        <Icon>check_box</Icon>
                      )}
                    </IconButton>
                  }
                </div>
              </ListItem>
            </div>
    );
}

export default ActionListItem;
