import React, { useState } from "react";
import { FusePageCarded } from "@fuse";
import {
  Icon,
  Typography,
  IconButton,
  Tooltip,
  Button,
  Box,
  TextField,
} from "@material-ui/core";
import { FuseAnimate } from "@fuse";
import { useDispatch } from "react-redux";
import * as Actions from "./store/action";
import ReactTable from "react-table";
import moment from "moment";
import { showUserDialog } from "../shared-dialogs/actions";

function CustomerAppUser(props) {
  const dispatch = useDispatch();
  // const [users, setUsers] = useState([]);
  // const [page, setPage] = useState(0)
  // const [pageSize, setPageSize] = useState(10)

  // console.log(props.match.params);

  // function fetchData(state) {
  //     const { page, pageSize, filtered, sorted } = state;
  //     setPageSize(pageSize)
  //     const convertFiltered = filtered.map(f => ({ id: f.id, value: f.value.value, operation: f.value.operation}))
  //     Actions.getUsers({ page, pageSize, filtered: convertFiltered, sorted }, dispatch).then(response => {
  //         setUsers(response);
  //     })
  // }
  // function handleShowUserDialog(phoneNumber) {
  //     dispatch(showUserDialog({ rootClass: "el-coverFUD", phoneNumber: phoneNumber }))
  // }

  return (
    <div>
      <FusePageCarded
        classes={{
          content: "flex",
          header: "min-h-72 h-72 sm:h-136 sm:min-h-136",
        }}
        header={
          <div className="flex flex-1 w-full items-center justify-between el-HeaderPage">
            <div className="flex items-center">
              <FuseAnimate animation="transition.expandIn" delay={300}>
                <Icon className="text-32 mr-0 sm:mr-12">
                  supervised_user_circle
                </Icon>
              </FuseAnimate>
              <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                <Typography className="hidden sm:flex" variant="h6">
                  Thông tin khách hàng
                </Typography>
              </FuseAnimate>
            </div>
          </div>
        }
        content={
          <UserInfoPanel />
        }
      />
    </div>
  );
}

function UserInfoPanel({}) {
  return (
    <Box className="el-block-report w-full flex m-0">
      <Box className="flex flex-wrap content-start justify-between m-8 pr-10">
        <TextField
          className="m-8"
          label="Họ tên"
          id="fullName"
          name="fullName"
          margin="dense"
          value={""}
          variant="outlined"
        />
        <TextField
          className="m-8"
          label="Số ĐT"
          id="fullName"
          name="fullName"
          margin="dense"
          value={""}
          variant="outlined"
        />
        <TextField
          className="m-8"
          label="Email"
          id="fullName"
          name="fullName"
          margin="dense"
          value={""}
          variant="outlined"
        />
        <TextField
          className="m-8"
          label="Ngày sinh"
          id="fullName"
          name="fullName"
          margin="dense"
          value={""}
          variant="outlined"
        />
        <TextField
          className="m-8"
          label="Giới tính"
          id="fullName"
          name="fullName"
          margin="dense"
          value={""}
          variant="outlined"
        />
        <TextField
          className="m-8"
          label="Địa chỉ"
          id="fullName"
          name="fullName"
          margin="dense"
          value={""}
          variant="outlined"
        />
        <TextField
          className="m-8"
          label="Tỉnh/Thành phố"
          id="fullName"
          name="fullName"
          margin="dense"
          value={""}
          variant="outlined"
        />
        <TextField
          className="m-8"
          label="Dân tộc"
          id="fullName"
          name="fullName"
          margin="dense"
          value={""}
          variant="outlined"
        />
        <TextField
          className="m-8"
          label="Công việc"
          id="fullName"
          name="fullName"
          margin="dense"
          value={""}
          variant="outlined"
        />
        <TextField
          className="m-8"
          label="CMND/CCCD"
          id="fullName"
          name="fullName"
          margin="dense"
          value={""}
          variant="outlined"
        />
        <TextField
          className="m-8"
          label="Mã BHYT"
          id="fullName"
          name="fullName"
          margin="dense"
          value={""}
          variant="outlined"
        />
      </Box>
      <Box className="flex flex-col m-8">
        <Button
          variant="contained"
          className="whitespace-no-wrap m-8"
          color="secondary"
        >
          <Icon>call</Icon> Gọi
        </Button>
        <Button
          variant="contained"
          className="whitespace-no-wrap m-8"
          color="secondary"
        >
          <Icon>assignment</Icon> Đặt khám
        </Button>
        <Button
          variant="contained"
          className="whitespace-no-wrap m-8"
          color="secondary"
        >
          <Icon>modeedit</Icon> Cập nhật
        </Button>
      </Box>
    </Box>
  );
}

export default CustomerAppUser;
