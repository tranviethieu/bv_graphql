import React, { useState } from 'react';
import { FusePageCarded } from '@fuse';
import { makeStyles } from '@material-ui/styles';
import { Paper, Button, Input, Icon, Typography } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import { FuseAnimate } from '@fuse';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ReactTable from 'react-table';
import graphqlService from "app/services/graphqlService";
import { QUERY_SMSCAMPAIGNS } from "../query";
import history from '@history';
import moment from "moment";

const useStyles = makeStyles(theme => ({
    td: {
        textOverflow: "auto",
        whiteSpace:"normal !important"
    }
}));

function getSMSCampaigns(params, dispatch) {
    return graphqlService.query(QUERY_SMSCAMPAIGNS, params, dispatch);
}


function SMSCampaigns(props) {
    const [searchText, setSearchText] = useState('');
    const dispatch = useDispatch();
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    function fetchData(state) {
        const { page, pageSize, sorted, filtered } = state;
        setPageSize(pageSize)
        getSMSCampaigns({page,pageSize,sorted,filtered}, dispatch).then(
            response => {
                setData(response.data);
            }
        )
    }

    const classes = useStyles();
    const mainTheme = useSelector(({ fuse }) => fuse.settings.mainTheme);
    return (
        <FusePageCarded
          id = "el-SMSCampaigns-Cover"
          classes={{
            content: "flex",
            header: "min-h-72 h-72 sm:h-136 sm:min-h-136"
          }}
          header={
            <div className="flex flex-1 w-full items-center justify-between" id = "el-SMSCampaigns-Header">

              <div className="flex items-center">
                <FuseAnimate animation="transition.expandIn" delay={300}>
                  <Icon className="text-32 mr-0 sm:mr-12">sms</Icon>
                </FuseAnimate>
                <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                  <Typography className="hidden sm:flex" variant="h6">Chiến dịch gửi SMS</Typography>
                </FuseAnimate>
              </div>

              <div className="flex flex-1 items-center justify-center px-12">

                <ThemeProvider theme={mainTheme}>
                  <FuseAnimate animation="transition.slideDownIn" delay={300}>
                    <Paper className="flex items-center w-full max-w-512 px-8 py-4 rounded-8" elevation={1}>

                      <Icon className="mr-8" color="action">search</Icon>

                      <Input
                        placeholder="Tên chiến dịch SMS"
                        className="flex flex-1"
                        disableUnderline
                        fullWidth
                        value={searchText}
                        inputProps={{
                          'aria-label': 'Search'
                        }}
                        onChange={ev => {setSearchText(ev.target.value.replace(/[^0-9a-zàáạảãâầấậẩẫăằắặẳẵèéẹ&ẻẽêềếệểễìí!ịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ,-/.\s]/gi, ''));
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
                <Button component={Link} to="/apps/sms/campaign-sms/new" className="whitespace-no-wrap btn-blue" variant="contained">
                  <span className="hidden sm:flex">Tạo chiến dịch SMS</span>
                </Button>
              </FuseAnimate>
            </div>
          }
          content={
            <ReactTable
              className="-striped -highlight w-full sm:rounded-8 el-TableSMSCampain"
              data={data}
              defaultPageSize={10}
              defaultSorted={[{id:"priority",desc:false}]}
              onFetchData={fetchData}
              noDataText = "Không có dữ liệu nào"
              sortable={false}
              onPageChange = {setPage}
              thStyle={{ whiteSpace: 'unset' }}
              getTrProps={(state, rowInfo, column) => {
                return {
                  className: "cursor-pointer",
                  onClick: (e, handleOriginal) => {
                    if (rowInfo) {
                      // dispatch(Actions.openEditContactDialog(rowInfo.original));
                      history.push(`/apps/sms/campaign-sms/${rowInfo.original._id}`)
                    }
                  }
                }
              }}
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
                  Header: 'Tên chiến dịch',
                  accessor: 'name',

                },
                {
                  Header: 'Nội dung',
                  className:classes.td,
                  accessor: 'content'
                },
                {
                  Header: 'Mô tả',
                  accessor: 'description',

                },
                {
                  Header: 'Ưu tiên',
                  accessor: 'priority',
                  width:80,

                },
                {
                  Header: 'Ngày tạo',
                  accessor: 'createdTime',
                  width:120,

                  Cell: row =>
                  <div className="flex  mt-8">
                    {moment(row.value).format('DD/MM/YYYY')}
                  </div>
                },
              ]}
            />
          }
          // innerScroll
        />
    );
}

export default SMSCampaigns;
