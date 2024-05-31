import React from 'react';
import { IconButton, Icon, Typography, Badge, ListItem, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import amber from '@material-ui/core/colors/amber';
import TodoChip from './TodoChip';
import clsx from 'clsx';
import moment from 'moment';

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
}));

function TodoListItem(props) {

    const classes = useStyles(props);
    const { createdTime, data, modifier, action } = props.todo;
    return (
        <ListItem
          className={clsx(classes.todoItem, { "completed": props.todo.completed }, "border-solid border-b-1 py-16  px-0 sm:px-8 el-HistoryListItem-Cover")}
          onClick={props.onClick}
          dense
          button
        >
          <div className="flex flex-1 flex-col relative overflow-hidden pl-8" id = "el-HistoryListItem">
            <Typography
              className="text-12 todo-title truncate"
              color="textSecondary"
            >
              <Box fontStyle="italic">
                {moment(createdTime).format("HH[g] mm[p] [ngày] DD/MM/YYYY")}
              </Box>
            </Typography>
            {
              action === "APPOINTMENT" && data && <div >
                <div
                  color="textPrimary"
                  className="todo-notes truncate flex flex-1"
                >
                  <Typography className="text-15">Thời gian đặt:</Typography>
                  <Typography className="font-bold ml-4 text-15">{data.appointmentDate}
                    <Badge badgeContent={data.appointmentTime} color="secondary" anchorOrigin={{
                      horizontal: 'right', vertical: 'bottom',
                    }}>
                      <span className="px-5"></span>
                    </Badge>
                  </Typography>
                </div>
                <div
                  color="textPrimary"
                  className="todo-notes truncate flex flex-1"
                >
                  <Typography className="text-15">Khoa/Phòng ban:</Typography>
                  <Typography className="font-bold ml-4 text-15">{data.department}</Typography>
                </div>
              </div>
            }
            {
              action === "EXAMINATION" && <div>
                {data.diagnostic && data.diagnostic.length > 0 && <div
                  color="textPrimary"
                  className="todo-notes truncate flex flex-1"
                                                                  >
                  <Typography className="text-15">Chuẩn đoán:</Typography>
                  <Typography className="font-bold ml-4 text-15">{data.diagnostic}</Typography>
                </div>
                }
                {data.indication && data.indication.length > 0 && <div
                  color="textPrimary"
                  className="todo-notes truncate flex flex-1"
                                                                  >
                  <Typography className="text-15">Chỉ định:</Typography>
                  <Typography className="font-bold ml-4 text-15">{data.indication}</Typography>
                </div>
                }
                {data.prescription && data.prescription.length > 0 && <div
                  color="textPrimary"
                  className="todo-notes truncate flex flex-1"
                                                                      >
                  <Typography className="text-15">Đơn thuốc:</Typography>
                  <Typography className="font-bold ml-4 text-15">{data.prescription}</Typography>
                </div>
                }
              </div>
            }
            {
              action === "TESTRESULT" && <div>
                <div
                  color="textPrimary"
                  className="todo-notes truncate flex flex-1"
                >
                  <Typography className="text-15">Loại xét nghiệm:</Typography>
                  <Typography className="font-bold ml-4 text-15">{data.type}</Typography>
                </div>
                {data.indication && data.indication.length > 0 && <div
                  color="textPrimary"
                  className="todo-notes truncate flex flex-1"
                                                                  >
                  <Typography className="text-15">Chỉ định:</Typography>
                  <Typography className="font-bold ml-4 text-15">{data.indication}</Typography>
                </div>
                }
                {data.note && data.note.length > 0 && <div
                  color="textPrimary"
                  className="todo-notes truncate flex flex-1"
                                                      >
                  <Typography className="text-15">Nhận xét:</Typography>
                  <Typography className="font-bold ml-4 text-15">{data.note}</Typography>
                </div>
                }
              </div>
            }
            {
              action === "SCANRESULT" && <div>
                <div
                  color="textPrimary"
                  className="todo-notes truncate flex flex-1"
                >
                  <Typography className="text-15">Loại Chụp:</Typography>
                  <Typography className="font-bold ml-4 text-15">{data.type}</Typography>
                </div>
                {data.indication && data.indication.length > 0 && <div
                  color="textPrimary"
                  className="todo-notes truncate flex flex-1"
                                                                  >
                  <Typography className="text-15">Chỉ định:</Typography>
                  <Typography className="font-bold ml-4 text-15">{data.indication}</Typography>
                </div>
                }
                {data.note && data.note.length > 0 && <div
                  color="textPrimary"
                  className="todo-notes truncate flex flex-1"
                                                      >
                  <Typography className="text-15">Nhận xét:</Typography>
                  <Typography className="font-bold ml-4 text-15">{data.note}</Typography>
                </div>
                }
              </div>
            }
            {
              action === "INSTRUCTION" && <div>
                {data.note && data.note.length > 0 && <div
                  color="textPrimary"
                  className="todo-notes truncate flex flex-1"
                                                      >
                  <Typography className="text-15">Nhận xét:</Typography>
                  <Typography className="font-bold ml-4 text-15">{data.note}</Typography>
                </div>
                }
                {data.indication && data.indication.length > 0 && <div
                  color="textPrimary"
                  className="todo-notes truncate flex flex-1"
                                                                  >
                  <Typography className="text-15">Chỉ định:</Typography>
                  <Typography className="font-bold ml-4 text-15">{data.indication}</Typography>
                </div>
                }

              </div>
            }
            <div
              color="textPrimary"
              className="todo-notes truncate flex flex-1"
            >
              <Typography className="text-15">Xử lý:</Typography>
              <Typography className="font-bold ml-4 text-15">{modifier && modifier.fullName}</Typography>
            </div>
            <div className={clsx(classes.labels, "flex mt-8")}>
              <TodoChip
                className="mr-4"
                title={action === "APPOINTMENT" ? "Đặt khám" : action === "EXAMINATION" ? "Kết quả khám" : action === "SCANRESULT" ? "Kết quả Chiếu/Chụp" : action === "TESTRESULT" ? "Kết quả xét nghiệm" : "Yêu cầu hỗ trợ"}
                color={action==="APPOINTMENT"?"#388E3C":action==="EXAMINATION"?"#F44336":action==="SCANRESULT"?"#9C27B0":action==="TESTRESULT"?"#0091EA":"#FF9800"}
              />
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
    );
}

export default TodoListItem;
