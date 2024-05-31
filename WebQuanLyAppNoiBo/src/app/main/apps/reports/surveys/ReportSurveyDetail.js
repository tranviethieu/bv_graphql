import React, { useState } from 'react';
import { Icon, Tooltip, Typography, Button } from '@material-ui/core';
import { FuseAnimateGroup, FusePageSimple, FuseAnimate } from '@fuse';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import ReactTable from 'react-table';
import Lightbox from 'react-image-lightbox';
import history from '@history';
import 'react-image-lightbox/style.css';
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import viLocale from "date-fns/locale/vi";
import graphqlService from "app/services/graphqlService";
import { QUERY_USERACTIONS_SURVEY } from "../queryReport";
import moment from 'moment';
import { useForm } from '@fuse/hooks';

const useStyles = makeStyles(theme => ({
  imageTypeRootStyle: {
    backgroundColor: "transparent",
    width: "auto",
    border: "none",
    '& img': {
      border: 'none',
    },
  },
  content: {
    '& canvas': {
      maxHeight: '100%'
    }
  },

}));

const initForm = {
  begin: moment().subtract(30, 'd'),
  end: new Date(),
}
function ReportSurveyDetail(props) {
  const dispatch = useDispatch();
  const classes = useStyles(props);
  // const pageLayout = useRef(null);
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [reportData, setReportData] = useState([]);
  const [openLightBox, setOpenLightBox] = useState(false)
  const [currentImage, setCurrentImage] = useState("");
  const { form, setInForm } = useForm(initForm);

  function handleDateBeginChange(e) {
    setInForm('begin', e)
  }
  function handleDateEndChange(e) {
    setInForm('end', e)
  }
  function getReportUserActions(state) {
    const filtered = [{ id: 'action', value: 'SURVEY' }, { id: 'createdTime', value: `${moment(form.begin).format("DD/MM/YYYY")},${moment(form.end).add(1, 'days').format("DD/MM/YYYY")}`, operation: "between" }, { id: "Data.SurveyId", value: `'${props.match.params._id}'` }];
    const sorted = [{ id: "createdTime", desc: true }]
    const { page, pageSize } = state;
    graphqlService.query(QUERY_USERACTIONS_SURVEY, { page, pageSize, sorted, filtered }, dispatch).then(
      response => {
        setPageSize(pageSize)
        setReportData(response);
      }
    );
  }
  return (
    <FusePageSimple
      id="el-ReportSurveyDetail-Cover"
      classes={{
        toolbar: "min-h-80",
        rightSidebar: "w-288",
        content: classes.content,
      }}

      header={
        <div className="flex flex-1 items-center justify-between p-24 el-HeaderPage">
          <div className="flex flex-col items-start max-w-full">
            <Typography className="normal-case flex items-center sm:mb-12" role="button" onClick={() => history.push("/apps/reports/surveys")}>
              <Icon className="mr-4 text-20">arrow_back</Icon>
              Báo cáo khảo sát khách hàng
            </Typography>
            <div className="flex items-center max-w-full">
              <div className="flex flex-col min-w-0">
                <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                  <Typography className="text-16 sm:text-20 truncate">
                    Báo cáo thực hiện khảo sát
                  </Typography>
                </FuseAnimate>
              </div>
            </div>
          </div>
        </div>
      }
      content={
        <div className="p-12 el-coverContent">
          <div className="el-block-report">
            <Typography className="pl-12 text-15 font-bold mb-10 block-tittle">Lọc dữ liệu:</Typography>
            <div className="el-fillter-report-action">
              <div className="el-flex-item flex-item-flex1">
                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={viLocale}>
                  <DatePicker
                    disableToolbar
                    variant="inline"
                    fullWidth
                    autoOk
                    required
                    id="begin"
                    name="begin"
                    label="Ngày bắt đầu"
                    inputVariant="outlined"
                    value={form.begin ? moment(form.begin).format("YYYY-MM-DD") : new Date()}
                    onChange={handleDateBeginChange}
                    format="dd/MM/yyyy"
                  />
                </MuiPickersUtilsProvider>
              </div>
              <div className="el-flex-item flex-item-flex1">
                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={viLocale}>
                  <DatePicker
                    disableToolbar
                    variant="inline"
                    fullWidth
                    autoOk
                    required
                    id="end"
                    name="end"
                    label="Ngày kết thúc"
                    inputVariant="outlined"
                    value={form.end ? moment(form.end).format("YYYY-MM-DD") : new Date()}
                    onChange={handleDateEndChange}
                    format="dd/MM/yyyy"
                  />
                </MuiPickersUtilsProvider>
              </div>
              <FuseAnimateGroup
                className="flex flex-wrap justify-center"
                enter={{
                  animation: "transition.slideUpBigIn"
                }}
              >
                <Button variant="contained" className="mx-20" color="secondary" onClick={() => getReportUserActions({ page: 0, pageSize: pageSize })}>
                  <Icon>search</Icon> Tìm kiếm
                </Button>
                {/* <Button variant="contained" className="mx-20" color="secondary">
                      <Icon>import_export</Icon> Xuất excel
                    </Button> */}
              </FuseAnimateGroup>
            </div>
          </div>




          <div className="el-block-report">
            <ReactTable
              className="-striped -highlight h-full overflow-hidden w-full el-TableSurveyReport"
              onFetchData={getReportUserActions}
              data={reportData.data}
              manual
              sortable={false}
              pages={reportData.pages}
              onPageChange={setPage}
              noDataText="Không có dữ liệu nào"
              defaultPageSize={10}

              SubComponent={(v) =>
                <div style={{ padding: '10px' }}>
                  <ReactTable
                    className="-striped -highlight h-full overflow-hidden w-full el-SubTableSurveyReport"
                    data={v.original.survey_result.data}
                    pageSize={v.original.survey_result.data.length}
                    noDataText="Không có dữ liệu nào"
                    showPagination={false}
                    sortable={false}
                    columns={[
                      {
                        Header: "Câu hỏi",
                        accessor: "",

                        Cell: row => <div>
                          {
                            row.original.question.require === true ?
                              <div>
                                {
                                  "Câu hỏi số " + (row.index + 1) + " (Bắt buộc)"
                                }
                              </div>
                              : "Câu hỏi số " + (row.index + 1)
                          }
                        </div>
                      },
                      {
                        Header: "Nội dung",
                        accessor: "question.title",

                        Cell: row =>
                          <Tooltip title={row.value} placement="bottom">
                            <div>{row.value}</div>
                          </Tooltip>
                      },
                      {
                        Header: "Loại câu hỏi",
                        accessor: "question.type",
                        Cell: row =>
                          <div>
                            {
                              row.value === "TEXT" ? "Kiểu văn bản" : row.value === "SINGLECHOICE" ? "Lựa chọn một" : row.value === "MULTIPLECHOICE" ? "Lựa chọn nhiều" : row.value === "RATING_STAR" ? "Đánh giá theo thang điểm" : "Đánh giá bằng biểu tượng"
                            }
                          </div>
                      },
                      {
                        Header: "Đáp án",
                        accessor: "data",
                        Cell: row => <div>
                          {
                            row.original.question.type === "SMILEY" ?
                              <div>
                                {
                                  row.original.question.polls.map((item, index) =>
                                    <div>
                                      {
                                        item.value === JSON.parse(JSON.stringify(row.value)).value &&
                                        <div>
                                          {
                                            item.display === "IMAGE" ?
                                              <div>
                                                <img src={item.image} width="20px" alt="" />
                                              </div>
                                              : <div style={{ display: "inline-flex" }}>
                                                <img src={item.image} width="20px" className="mr-2" alt="" />
                                                {item.label}
                                              </div>
                                          }
                                        </div>
                                      }
                                    </div>
                                  )
                                }
                              </div>
                              : row.original.question.type === "SINGLECHOICE" ?
                                <div>
                                  {
                                    row.original.question.polls.map((item, index) =>
                                      <div>
                                        {
                                          item.value === JSON.parse(JSON.stringify(row.value)).value &&
                                          <div>
                                            {
                                              item.display === "IMAGE" ?
                                                <div>
                                                  <img src={process.env.REACT_APP_FILE_PREVIEW_URL + item.image} width="20px" onClick={() => { setOpenLightBox(true); setCurrentImage(item.image) }} alt="" />
                                                </div>
                                                : item.display === "TEXT" ?
                                                  <div>
                                                    {item.value}
                                                  </div>
                                                  : item.display === "OTHER" ?
                                                    <div>
                                                      {item.value + ": " + JSON.parse(JSON.stringify(row.value)).otherAnswer}
                                                    </div>
                                                    : <div style={{ display: "inline-flex" }}>
                                                      <img src={process.env.REACT_APP_FILE_PREVIEW_URL + item.image} width="20px" className="mr-2" onClick={() => { setOpenLightBox(true); setCurrentImage(item.image) }} alt="" />
                                                      {item.value}
                                                    </div>
                                            }
                                          </div>
                                        }
                                      </div>
                                    )
                                  }
                                </div>
                                : row.original.question.type === "MULTIPLECHOICE" ?
                                  <div>
                                    {
                                      row.original.question.polls.map((item, index) =>
                                        <div key={index}>
                                          {
                                            JSON.parse(JSON.stringify(row.value)).value.map((list, id) =>
                                              <div key={id}>
                                                {
                                                  item.value === list &&
                                                  <div>
                                                    {
                                                      item.display === "IMAGE" ?
                                                        <div>
                                                          <img src={process.env.REACT_APP_FILE_PREVIEW_URL + item.image} width="20px" onClick={() => { setOpenLightBox(true); setCurrentImage(item.image) }} alt="" />
                                                        </div>
                                                        : item.display === "TEXT" ?
                                                          <div>
                                                            {item.value}
                                                          </div>
                                                          : item.display === "OTHER" ?
                                                            <div>
                                                              {item.value + ": " + JSON.parse(JSON.stringify(row.value)).otherAnswer}
                                                            </div>
                                                            : <div style={{ display: "inline-flex" }}>
                                                              <img src={process.env.REACT_APP_FILE_PREVIEW_URL + item.image} width="20px" className="mr-2" onClick={() => { setOpenLightBox(true); setCurrentImage(item.image) }} alt="" />
                                                              {item.value}
                                                            </div>
                                                    }
                                                  </div>
                                                }
                                              </div>
                                            )
                                          }
                                        </div>
                                      )
                                    }
                                  </div>
                                  : row.original.question.type === "RATING_STAR" ?
                                    <div>
                                      <div>
                                        {[...Array(JSON.parse(JSON.stringify(row.value)).value)].map((n, i) => (
                                          <Icon style={{ color: "orange" }}>
                                            star
                                          </Icon>
                                        ))}
                                        {[...Array(row.original.question.starNumb - JSON.parse(JSON.stringify(row.value)).value)].map((n, i) => (
                                          <Icon>
                                            star
                                          </Icon>
                                        ))}
                                        <p>
                                          {JSON.parse(JSON.stringify(row.value)).value} / {row.original.question.starNumb} sao
                                        </p>
                                      </div>
                                    </div>
                                    :
                                    JSON.parse(JSON.stringify(row.value)).value
                          }
                        </div>,

                      },
                    ]}
                  />
                </div>}
              columns={[
                {
                  Header: "#",
                  width: 50,
                  filterable: false,
                  Cell: row => <div>
                    {row.index + 1 + (page * pageSize)}
                  </div>
                },
                {
                  Header: "Số điện thoại",
                  accessor: "user.phoneNumber",
                  width: 120,

                },
                {
                  Header: "Họ tên",
                  accessor: "user.fullName",

                },
                {
                  Header: "Thời gian thực hiện",
                  accessor: "createdTime",

                  Cell: row => <div>{moment(row.value).format("DD/MM/YYYY")}</div>
                },
                {
                  expander: true,
                  Header: () => <div className="font-bold mt-12">Câu hỏi</div>,
                  width: 70,
                  Expander: ({ isExpanded, ...rest }) =>
                    <div>
                      {isExpanded
                        ? <Icon className="text-red">adjust</Icon>
                        : <Icon className="text-green">add_circle_outline</Icon>}
                    </div>,
                  style: {
                    cursor: "pointer",
                    fontSize: 25,
                    textAlign: "center",
                    userSelect: "none"
                  },

                }
              ]}
            />
          </div>
          {openLightBox &&
            <Lightbox
              className="el-Lightbox"
              mainSrc={process.env.REACT_APP_FILE_PREVIEW_URL + currentImage}
              onCloseRequest={() => setOpenLightBox(false)}
            />}
        </div>

      }
    />

  )
}

export default ReportSurveyDetail;
