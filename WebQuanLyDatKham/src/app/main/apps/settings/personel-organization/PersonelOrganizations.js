import React, { useState } from 'react';
import { Button, Icon, Typography, IconButton, Tooltip} from '@material-ui/core';
import { FuseAnimate, FusePageCarded } from '@fuse';
// import { useDispatch } from 'react-redux';
import * as Actions from './store/actions';
import ReactTable from 'react-table';
// import moment from 'moment';
import history from '@history';

function PersonelOrganizations() {
    // const dispatch = useDispatch();
    const [personels, setPersonels] = useState([])
    const [page, setPage] = useState(0)
    const [pageSize, setPageSize] = useState(10)

    const fetchData = (state) =>{
      var { page ,pageSize } = state;
      setPageSize(pageSize)
      Actions.getPersonels({page, pageSize}).then(response =>{
        if(response.code === 0){
          setPersonels(response)
        }
      })
    }

    return (
            <FusePageCarded
              classes={{
                content: "flex",
                header: "min-h-72 h-72 sm:h-136 sm:min-h-136"
              }}
              header={
                <div className="flex flex-1 w-full items-center justify-between el-HeaderPage">

                  <div className="flex items-center">
                    <FuseAnimate animation="transition.expandIn" delay={300}>
                      <Icon className="text-32 mr-0 sm:mr-12">business</Icon>
                    </FuseAnimate>
                    <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                      <Typography className="hidden sm:flex" variant="h6">Tổ chức hành chính ({personels.records? personels.records : 0})</Typography>
                    </FuseAnimate>
                  </div>
                  <FuseAnimate animation="transition.slideRightIn" delay={300}>
                    <Button onClick = {()=>history.push("/apps/personel-organization/edit")} className="whitespace-no-wrap btn-blue" variant="contained">
                      <span className="hidden sm:flex">Tạo tổ chức hành chính</span>
                    </Button>
                  </FuseAnimate>
                </div>
              }
              content={
                <div className = "el-cover-table">
                  <ReactTable
                    manual
                    className="-striped -highlight h-full w-full sm:rounded-8 overflow-hidden el-UAsManagerTable"
                    id = "el-tableUAManager"
                    data={personels.data}
                    pages={personels.pages}
                    defaultPageSize={10}
                    onFetchData={fetchData}
                    onPageChange = {setPage}
                    noDataText= "Không có dữ liệu nào"
                    filterable={false}
                    defaultSorted={[{
                        id: "createdTime", desc: true
                    }]}
                    sortable={false}
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
                        Header: 'Tên tổ chức hành chính',
                        accessor: 'name',

                      },
                      {
                        Header: 'Mô tả',
                        accessor: 'description'
                      },
                      {
                        Header: 'Cấp tổ chức',
                        accessor: 'level'
                      },
                      {
                        Header: 'Tổ chức cấp trên',
                        accessor: 'parentId',
                        Cell: row =>
                        <div>
                          {
                            row.value ? row.original.parent.name : "#"
                          }
                        </div>
                      },
                      {
                        Header: "Tác vụ",
                        accessor: "_id",
                        filterable: false,
                        Cell: row => <div className = "el-groupButton-Table">
                          <Tooltip title="Chỉnh sửa" placement="bottom">
                            <IconButton onClick = {()=> history.push(`/apps/personel-organization/edit/${row.value}`)}>
                              <Icon className="text-green">edit</Icon>
                            </IconButton>
                          </Tooltip>
                        </div>
                      }
                    ]}
                  />
                </div>
              }
              // innerScroll
            />
    );
}

export default (PersonelOrganizations);
