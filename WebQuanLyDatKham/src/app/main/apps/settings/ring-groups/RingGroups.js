import React, { useState } from 'react';
import { FusePageCarded } from '@fuse';
import { Button, Icon, Typography } from '@material-ui/core';
import { FuseAnimate } from '@fuse';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import ReactTable from 'react-table';
import graphqlService from "app/services/graphqlService";
import { QUERY_RINGGROUPS} from "./query";
import history from '@history';
import moment from "moment";
import DemoFilter from '../../DemoFilter/TableFilter';

function getRingGroups(params, dispatch) {
    return graphqlService.query(QUERY_RINGGROUPS, params, dispatch);
}


function RingGroups(props) {
    // const [searchText, setSearchText] = useState('');
    const dispatch = useDispatch();
    const [data, setData] = useState([]);
    // const [hover, setHover] = useState(true);

    function fetchData(state) {
        // const { page, pageSize, sorted } = state;
        // const filtered = [{ id: 'title', value: searchText }];
        getRingGroups({}, dispatch).then(
            response => {

                setData(response.data);
            }
        )
    }

    // function toggleHover() {
    //     setHover(!hover );
    //     console.log("toggleHover value: " + hover );
    //     if (hover == true){
    //         <Tooltip title="Click to add/remove shortcut" placement={props.variant === "horizontal" ? "bottom" : "left"}>
    //             {/* <IconButton
    //                 className="w-40 h-40 p-0"
    //                 aria-owns={addMenu ? 'add-menu' : null}
    //                 aria-haspopup="true"
    //                 onClick={addMenuClick}
    //             >
    //                 <Icon className={classes.addIcon}>star</Icon>
    //             </IconButton> */}
    //         </Tooltip>
    //     }

    // }

    // const classes = useStyles();
    // const mainTheme = useSelector(({ fuse }) => fuse.settings.mainTheme);
    return (
        <FusePageCarded
          classes={{
            content: "flex",
            header: "min-h-72 h-72 sm:h-136 sm:min-h-136"
          }}
          header={
            <div className="flex flex-1 w-full items-center justify-between el-HeaderPage">

              <div className="flex items-center el-Header-Left">
                <FuseAnimate animation="transition.expandIn" delay={300}>
                  <Icon className="text-32 mr-0 sm:mr-12">call_split</Icon>
                </FuseAnimate>
                <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                  <Typography className="hidden sm:flex" variant="h6">Nhánh tổng đài viên ({data.length})</Typography>
                </FuseAnimate>
              </div>
              {/*
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

              </div> */}
              <DemoFilter
                createOption={{ onClick: () => history.push("/apps/ring-groups/new") }}
              />
              {/* <div className = "el-Button-Right">
                <FuseAnimate animation="transition.slideRightIn" delay={300}>
                  <Button component={Link} to="/apps/ring-groups/new" className="whitespace-no-wrap btn-blue" variant="contained">
                <span className="hidden sm:flex">Tạo nhánh tổng đài viên</span>
              {/* <span className="flex sm:hidden">New</span> */}
              {/* </Button> */}
              {/* </FuseAnimate> */}
              {/* </div> */}
            </div>
          }
          content={
            <ReactTable
              className="-striped -highlight h-full w-full sm:rounded-8 overflow-hidden el-TableRing"
              data={data}
              defaultPageSize={5}
              pageSize = {data.length}
              sortable={false}
              onFetchData = {fetchData}
              thStyle={{ whiteSpace: 'unset' }}
              showPagination = {false}
              // style={{ overflow: 'wrap' }}
              getTrProps={(state, rowInfo, column) => {
                return {
                  className: "cursor-pointer",
                  onClick: (e, handleOriginal) => {
                    if (rowInfo) {
                      // dispatch(Actions.openEditContactDialog(rowInfo.original));
                      history.push(`/apps/ring-groups/${rowInfo.original._id}`)
                    }
                  }
                }
              }}
              noDataText = "Không có dữ liệu nào"
              columns={[
                {
                  Header: "#",
                  width: 50,
                  Cell: row =>
                  <div>
                    {row.index +1}
                  </div>
                },
                {
                  Header: 'Tên nhánh',
                  accessor: 'name',

                  Cell: row =>
                  <div className="mt-8">
                    {row.value}
                  </div>
                },
                {
                  Header: 'Đầu số tổng đài',
                  accessor: 'phoneCode',

                  Cell: row =>
                  <div className="mt-8">
                    {row.value}
                  </div>
                },
                {
                  Header: 'Ngày tạo',
                  accessor: 'createdTime',

                  Cell: row =>
                  <div className="mt-8">
                    {/* { */}
                    {moment(row.value).format('DD/MM/YYYY')}
                    {/* row.value ? row.value.map((item, index) =>
                      (item.timeFrame && item.timeFrame.length > 0) ?
                      <div className={clsx(classes.root, props.className, "mr-4")} key={index}>

                      <Tooltip title={item.timeFrame.map((item, index) => item +" ")} >
                      <div>{item.dayOfWeek}</div>
                      </Tooltip>
                      </div>
                      : null
                    ) : null */}
                    {/* } */}
                  </div>
                },
                // {
                //     Header: 'Giờ phục vụ',
                //     accessor: 'servingTimes',
                //
                //     Cell: row =>
                //         <div className="flex  mt-8">
                //             {
                //                 row.value ? row.value.map((item, index) =>
                //                     (item.timeFrame && item.timeFrame.length > 0) ?
                //                         <div className={clsx(classes.root, props.className, "mr-4")} key={index}>

                //                             <Tooltip title={item.timeFrame.map((item, index) => item +" ")} >
                //                                 <div>{item.dayOfWeek}</div>
                //                             </Tooltip>
                //                         </div>
                //                         : null
                //                 ) : null
                //             }
                //         </div>
                // },
              ]}
            />
          }
          // innerScroll
        />
    );
}

export default RingGroups;
