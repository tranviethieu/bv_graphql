import React, { useState } from 'react';
import { FusePageCarded } from '@fuse';
import {makeStyles} from '@material-ui/styles';
import { Button, Icon, Typography, Tooltip } from '@material-ui/core';
import { FuseAnimate } from '@fuse';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import ReactTable from 'react-table';
import clsx from 'clsx';
import graphqlService from "app/services/graphqlService";
import { QUERY_DEPARTMENTS} from "./query";
import history from '@history';
import * as StringUtils from "../../utils/StringUtils";

const useStyles = makeStyles(theme => ({
    root : {
        display        : 'flex',
        alignItems     : 'center',
        height         : 21,
        borderRadius   : 2,
        padding        : '0 6px',
        fontSize       : 11,
        backgroundColor: 'rgba(0,0,0,.08);'
    },
    color: {
        width       : 8,
        height      : 8,
        marginRight : 4,
        borderRadius: '50%'
    }
}));

function getDepartments(params, dispatch) {
    return graphqlService.query(QUERY_DEPARTMENTS, params, dispatch);
}

function Departments(props) {
    const dispatch = useDispatch();
    const [data, setData] = useState([]);

    function fetchData(state) {
        getDepartments({}, dispatch).then(
            response => {
                setData(response.data);
            }
        )
    }


    const classes = useStyles();
    return (
        <FusePageCarded
          classes={{
            content: "flex",
            header: "min-h-72 h-72 sm:h-136 sm:min-h-136"
          }}
          header={
            <div className="flex flex-1 w-full items-center justify-between" id = "el-DepartmentsApp-Header">

              <div className="flex items-center">
                <FuseAnimate animation="transition.expandIn" delay={300}>
                  <Icon className="text-32 mr-0 sm:mr-12">call_to_action</Icon>
                </FuseAnimate>
                <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                  <Typography className="hidden sm:flex" variant="h6">Khoa khám ({data.length})</Typography>
                </FuseAnimate>
              </div>

              <FuseAnimate animation="transition.slideRightIn" delay={300}>
                <Button component={Link} to="/apps/departments/new" className="whitespace-no-wrap btn-blue" variant="contained">
                  <span className="hidden sm:flex">Thêm khoa khám</span>
                </Button>
              </FuseAnimate>
            </div>
          }
          content={
            <ReactTable
              className="-striped -highlight h-full w-full sm:rounded-8 overflow-hidden el-TableDepartment"
              data={data}
              defaultPageSize={10}
              onFetchData = {fetchData}
              sortable={false}
              thStyle={{ whiteSpace: 'unset' }}
              // style={{ overflow: 'wrap' }}
              getTrProps={(state, rowInfo, column) => {
                return {
                  className: "cursor-pointer",
                  onClick: (e, handleOriginal) => {
                    if (rowInfo) {
                      // dispatch(Actions.openEditContactDialog(rowInfo.original));
                      history.push(`/apps/departments/${rowInfo.original._id}`)
                    }
                  }
                }
              }}
              noDataText = "Không có dữ liệu nào"
              columns={[
                {
                  Header: "#",
                  width: 50,
                  filterable: false,
                  Cell : row =><div>
                    {row.index + 1}
                  </div>
                },
                {
                  Header: 'Tên Khoa khám',
                  accessor: 'name',
                },
                {
                  Header: 'Mã Khoa khám',
                  accessor: 'code',
                },
                {
                  Header: 'Giờ phục vụ',
                  accessor: 'servingTimes',
                  Cell: row =>
                  <div className = "flex" id = "el-servingTimes">
                    {
                      row.value ? row.value.map((item, index) =>
                        (item.timeFrame && item.timeFrame.length > 0) ?
                          <div className={clsx(classes.root, props.className, "mr-4")} key={index}>

                            {/* {item.timeFrame.length} */}
                            <Tooltip title={item.timeFrame.map((item, index) => item +" ")} >
                              <div>{StringUtils.parseWeekDay( item.dayOfWeek)}</div>
                            </Tooltip>
                          </div>
                        : null
                      ) : null
                    }
                  </div>
                },
                {
                  Header: 'Trạng thái',
                  accessor: 'status',
                  className:"justify-center items-center",
                  Cell: row => <div>
                    {row.value?'Có':'Không'}
                  </div>
                }
              ]}
            />
          }
            // innerScroll
        />
    );
}

export default Departments;
