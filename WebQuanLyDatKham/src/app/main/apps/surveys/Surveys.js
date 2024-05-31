import React, { useState } from 'react';
import { FusePageCarded } from '@fuse';
import { Button, Icon, Typography,IconButton, Tooltip, Paper, Input } from '@material-ui/core';
import { FuseAnimate } from '@fuse';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ReactTable from 'react-table';
import * as Actions from './store/actions';
import moment from 'moment';
import history from '@history';
import { ThemeProvider } from '@material-ui/styles';
import ImplementSurvey from './Dialog/ImplementSurvey'

function Surveys(props) {
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [surveys, setSurveys] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [surveyId, setId] = useState(null);
    const [page, setPage] = useState(0)
    const [pageSize, setPageSize] = useState(10)

    function fetchData (state) {
        const { page, pageSize, filtered, sorted } = state;
        setPageSize(pageSize)
        Actions.getSurveys({page, pageSize, filtered, sorted}, dispatch).then(response=>{
            setSurveys(response);
        })
    }
    function handleCloseDialog(){
        setOpen(false)
    }
    function handleSubmitResult(){
        setOpen(false)
    }
    const mainTheme = useSelector(({ fuse }) => fuse.settings.mainTheme);
    return (
        <div>
          <ImplementSurvey open = {open} onCloseDialog = {handleCloseDialog} onSubmitResult={handleSubmitResult} surveyIdProps={surveyId}/>
          <FusePageCarded
            classes={{
              content: "flex",
              header: "min-h-72 h-72 sm:h-136 sm:min-h-136"
            }}
            header={
              <div className="flex flex-1 w-full items-center justify-between el-HeaderPage">

                <div className="flex items-center">
                  <FuseAnimate animation="transition.expandIn" delay={300}>
                    <Icon className="text-32 mr-0 sm:mr-12">ballot</Icon>
                  </FuseAnimate>
                  <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                    <Typography className="hidden sm:flex" variant="h6">Khảo sát ({surveys.records? surveys.records : 0})</Typography>
                  </FuseAnimate>
                </div>
                <div className="flex flex-1 items-center justify-center px-12" id = "el-Surveys-Search">

                  <ThemeProvider theme={mainTheme}>
                    <FuseAnimate animation="transition.slideDownIn" delay={300}>
                      <Paper className="flex items-center w-full max-w-512 px-8 py-4 rounded-8" elevation={1}>

                        <Icon className="mr-8" color="action">search</Icon>

                        <Input
                          placeholder="Tên khảo sát"
                          className="flex flex-1"
                          disableUnderline
                          fullWidth
                          value={searchText}
                          onChange={ev => {
                            setSearchText(ev.target.value.replace(/[^0-9a-zàáạảãâầấậẩẫăằắặẳẵèéẹ&ẻẽêềếệểễìí!ịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ,-/.\s]/gi, ''));
                            fetchData({
                              page: page,
                              pageSize: pageSize,
                              filtered: ev.target.value ?
                                [{ id: "name", value: `${ev.target.value.replace(/[^0-9a-zàáạảãâầấậẩẫăằắặẳẵèéẹ&ẻẽêềếệểễìí!ịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ,-/.\s]/gi, '')}`}
                                ]
                              : []
                            }
                            )}
                          }
                        />
                      </Paper>
                    </FuseAnimate>
                  </ThemeProvider>

                </div>
                <FuseAnimate animation="transition.slideRightIn" delay={300}>
                  <Button component={Link} to="/apps/surveys/edit/new" className="whitespace-no-wrap btn-blue" variant="contained">
                    <span className="hidden sm:flex">Tạo khảo sát</span>
                    <span className="flex sm:hidden">New</span>
                  </Button>
                </FuseAnimate>
              </div>
            }
            content={
              <ReactTable
                manual
                className="-striped -highlight h-full w-full sm:rounded-8 overflow-hidden el-TableSurvey"
                data={surveys.data}
                pages={surveys.pages}
                defaultPageSize={10}
                filterable={false}
                sortable={false}
                onPageChange = {setPage}
                noDataText= "Không có dữ liệu nào"
                onFetchData={fetchData}
                columns={[
                  {
                    Header: "#",
                    width: 50,
                    filterable: false,
                    Cell : row =><div>
                      {row.index + 1 + (page * pageSize)}
                    </div>
                  },
                  {
                    Header: 'Tên khảo sát',
                    accessor: 'name',
                    style: { justifyContent: "left", textAlign: "left", whiteSpace: "unset", wordBreak: "nomal", marginTop: '5px' },
                  },
                  {
                    Header: 'Tiêu đề',
                    accessor: 'title',
                    style: { justifyContent: "left", textAlign: "left", whiteSpace: "unset", wordBreak: "nomal", marginTop: '5px' },
                    Cell: row =>
                    <Tooltip title = {row.value} placement="bottom">
                      <div>{row.value}</div>
                    </Tooltip>
                  },
                  {
                    Header: "Trạng thái",
                    filterable: false,
                    accessor: "disable",
                    Cell: row => <div>{row.value === true ? "Không hoạt động" : "Hoạt động"}</div>,
                    maxWidth: 120
                  },
                  {
                    Header: "Đối tượng",
                    filterable: false,
                    accessor: "target",
                    Cell: row => <div>{row.value === "EMPLOYEE" ? "Nội bộ" : "Bệnh nhân và khách hàng"}</div>
                  },
                  {
                    Header: "Số câu hỏi",
                    filterable: false,
                    accessor: "questionIds.length",
                    maxWidth: 100
                  },
                  {
                    Header: 'Ngày tạo',
                    accessor: 'createdTime',
                    Cell: row => <div>{moment(row.value).format("DD/MM/YYYY")}</div>,
                    maxWidth: 120
                  },
                  {
                    Header: "Tác vụ",
                    accessor: "_id",
                    filterable: false,
                    width:120,
                    Cell: row => <div>
                      <IconButton title = "Chỉnh sửa khảo sát"
                        onClick={_=>history.push(`/apps/surveys/edit/${row.value}`)}
                      >
                        <Icon>
                          edit
                        </Icon>
                      </IconButton>
                      <IconButton title="Thực hiện khảo sát"
                        onClick = {(e) => {setId(row.value); setOpen(true);}}
                      >
                        <Icon>
                          cast_connected
                        </Icon>
                      </IconButton>
                    </div>
                  }
                ]}
              />
            }
          />
        </div>
    );
}

export default Surveys;
