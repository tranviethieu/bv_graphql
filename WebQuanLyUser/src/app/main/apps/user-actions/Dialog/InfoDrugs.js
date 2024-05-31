import React from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, AppBar, Typography, Tooltip} from '@material-ui/core';
import moment from 'moment';
import { FuseAnimate } from '@fuse';
import ReactTable from 'react-table'

function InfoDrugs(props) {
    const { open, onCloseInfoDialog, drugs, user } = props

  return (
      <Dialog open={open} onClose={onCloseInfoDialog} aria-labelledby="form-dialog-title" classes={{paper: "w-full", paperWidthSm: "max-w-full"}}>
        <AppBar position="static" elevation={1}>
          <div className="m-8">
            <div className="flex flex-1 w-full items-center justify-between">

              <div className="flex flex-col items-start max-w-full">
                <div className="flex items-center max-w-full">
                  <div className="flex flex-col min-w-0">
                    <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                      <Typography className="text-14 sm:text-16 truncate p-8">
                        Thông tin đơn thuốc {user? user.name + " vào " + moment(user.date).format("HH:mm DD/MM/YYYY") : ""}
                      </Typography>
                    </FuseAnimate>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AppBar>
        <DialogContent>
          <DialogContentText>
            <ReactTable
              manual
              className="-striped -highlight h-full w-full sm:rounded-8 overflow-hidden pt-16 el-TableInfoDrugs"
              data={drugs}
              defaultPageSize={drugs.length}
              noDataText ="Không có dữ liệu nào"
              filterable={false}
              showPagination = {false}
              sortable ={false}
              columns={[
                {
                  Header: "#",
                  width: 50,
                  Cell : row =><div>
                    {row.index + 1}
                  </div>
                },
                {
                  Header: "Tên thuốc",
                  accessor: "Title",
                  Cell: row=>
                  <div>
                    {
                      row.value?
                        <Tooltip title = {row.value} placement = "bottom">
                          <div>{row.value}</div>
                        </Tooltip>
                      : <div></div>
                    }
                  </div>
                },
                {
                  Header: "Đơn vị",
                  accessor: "Unit",
                  Cell: row=>
                  <div>
                    {
                      row.value?
                        <Tooltip title = {row.value} placement = "bottom">
                          <div>{row.value}</div>
                        </Tooltip>
                      : <div></div>
                    }
                  </div>
                },
                {
                  Header: "Liều lượng",
                  accessor: "Amount",
                  Cell: row=>
                  <div>
                    {
                      row.value?
                        <Tooltip title = {row.value} placement = "bottom">
                          <div>{row.value}</div>
                        </Tooltip>
                      : <div></div>
                    }
                  </div>
                },
                {
                  Header: "Chỉ định",
                  accessor: "Instruction",
                  Cell: row=>
                  <div>
                    {
                      row.value?
                        <Tooltip title = {row.value} placement = "bottom">
                          <div>{row.value}</div>
                        </Tooltip>
                      : <div></div>
                    }
                  </div>
                }
              ]}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCloseInfoDialog} color="primary">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
  );
}
export default InfoDrugs;
