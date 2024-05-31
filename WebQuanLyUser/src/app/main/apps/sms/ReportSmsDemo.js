import React, { useState, useEffect } from 'react';
import { FusePageCarded } from '@fuse';
// import withReducer from 'app/store/withReducer';
import { Paper, Button, Input,Icon, Typography } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import { FuseAnimate } from '@fuse';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ReactTable from 'react-table';
import axios from 'axios';

function Sms() {
    const dispatch = useDispatch();
    const [searchText, setSearchText] = useState('');
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        axios.get('/api/appointments').then(response => {
            setAppointments(response.data);
        });
    }, [dispatch]);
    const mainTheme = useSelector(({ fuse }) => fuse.settings.mainTheme);
    return (
        <FusePageCarded
          classes={{
            content: "flex",
            header: "min-h-72 h-72 sm:h-136 sm:min-h-136"
          }}
          header={
            <div className="flex flex-1 w-full items-center justify-between">

              <div className="flex flex-col">
                <div className="flex items-center mb-16">
                  <Icon className="text-18" color="action">home</Icon>
                  <Icon className="text-16" color="action">chevron_right</Icon>
                  <Typography color="textSecondary">Trang chủ</Typography>
                  <Icon className="text-16" color="action">chevron_right</Icon>
                  <Typography color="textSecondary">Thống kê tin nhắn gửi đi</Typography>
                </div>
                <Typography variant="h6">Tổng số tin: 1043</Typography>
              </div>

              <div className="flex flex-1 items-center justify-center px-12">

                <ThemeProvider theme={mainTheme}>
                  <FuseAnimate animation="transition.slideDownIn" delay={300}>
                    <Paper className="flex items-center w-full max-w-512 px-8 py-4 rounded-8" elevation={1}>

                      <Icon className="mr-8" color="action">search</Icon>

                      <Input
                        placeholder="Tên/số điện thoại"
                        className="flex flex-1"
                        disableUnderline
                        fullWidth
                        value={searchText}
                        inputProps={{
                          'aria-label': 'Search'
                        }}
                        onChange={ev => setSearchText(ev.target.value)}
                      />
                    </Paper>
                  </FuseAnimate>
                </ThemeProvider>

              </div>
              <FuseAnimate animation="transition.slideRightIn" delay={300}>
                <Button component={Link} to="/apps/appointments/new" className="whitespace-no-wrap btn-blue" variant="contained">
                  <span className="hidden sm:flex">Tạo lịch khám</span>
                  <span className="flex sm:hidden">New</span>
                </Button>
              </FuseAnimate>
            </div>
          }
          content={
            <ReactTable
              className="-striped -highlight h-full w-full sm:rounded-8 overflow-hidden el-TableSMSDemo"
              data={appointments}
              defaultPageSize={10}
              filterable={true}
              noDataText = "Không có dữ liệu nào"
              sortable={false}
              columns={[
                {
                  Header: '#',
                  filterable:false,
                  width: 80,
                  Cell: row => <div>{(row.index + 1)}</div>
                },
                {
                  Header: 'Ngày',
                  accessor: 'date',
                },
                {
                  Header: "Người thực hiện",
                  accessor: 'actor',

                },
                {
                  Header: 'Nội dung',
                  accessor: "content"
                },
                {
                  Header: 'Số điện thoại',
                  accessor: "phoneNumber"
                },
              ]}
            />
            }
            innerScroll
        />
    );
}

export default Sms;
