import React, { useState, useEffect } from 'react';
import { Button, Icon, Typography, Menu, MenuItem, IconButton, Tooltip, Card, CardContent, CardHeader, CardActions, Avatar } from '@material-ui/core';
import { FuseAnimate, FusePageCarded } from '@fuse';
import { showMessage } from 'app/store/actions'
import * as Actions from './actions';
import history from '@history';
import _ from 'lodash';
import OrgChart from 'react-orgchart';
import 'react-orgchart/index.css';
import { useDispatch } from 'react-redux';
import { showQuickEditDialog, showQuickTableDialog } from '../../shared-dialogs/actions';
import { serviceOnDemandAttributes } from './components';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { MoreVert, ExpandLess, ExpandMore } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 285,
    minWidth: 180,
    // width: 200,
    padding: 4
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
}));

const showEditDialog = (data, submit, attributes) => {

  console.log("attributes:", attributes);
  return (dispatch) => dispatch(showQuickEditDialog(
    {
      rootClass: "md:w-full lg:w-2/3",
      className: 'pb-100 height-70vh el-CardContent-FULL',
      title: data ? "Cập nhật" : "Thêm mới",
      subtitle: "Dịch vụ trực tuyến",
      attributes: attributes,
      data: data,
      submit: submit

    }));
}

function ServiceOnDemandGraph() {
  const dispatch = useDispatch();
  const [nodes, setNodes] = useState([])
  const [attributes, setAttributes] = useState(serviceOnDemandAttributes);
  const [departments, setDepartments] = useState([]);
  const [menuList, setMenuList] = useState([])
  const classes = useStyles();

  function updateNewList(newList) {
    newList.forEach(function (item) {
      const check = menuList.find(m => m._id == item._id);
      if (check) {
        //update state here
        if (check.collapse) {
          item.collapse = true;
          item._children = [...item.children];
          item.children = [];
        } else {
          item.collapse = false;
        }
      }
    });
    setMenuList(newList);
  }

  ///san phẳng 1 graph mới thành list
  function flatten(nodes) {
    if (!nodes)
      return [];
    let newList = nodes;
    nodes.forEach(function (item) {
      if (item._children && item._children.length > 0) {
        newList = [...newList, ...flatten(item._children)];
      } else
        if (item.children && item.children.length > 0) {
          newList = [...newList, ...flatten(item.children)];
        }
    })
    return newList;
  }

  function handleSave(form) {
    const submitData = convertFormToData(form);
    console.log("handlesave:", submitData);
    Actions.save(submitData, dispatch).then(response => {
      if (response.code === 0) {
        dispatch(showMessage({ message: "Lưu thông tin ban/menu thành công" }));
        refetchData();
      } else {
        dispatch(showMessage({ message: response.message }));
      }
    })
  }
  function convertFormToData(form) {
    return _.omit(form, ["children", "_children", "collapse", "fullName", "parent", 'departments']);
  }
  function convertDataToForm(data) {
    const form = { ...data };
    return form;
  }

  function refetchData() {
    Actions.getGraph().then(response => {
      if (response.code === 0) {
        var newList = flatten(response.data);
        //compare to oldList to map state children
        updateNewList(newList);
        setNodes([{ name: "Danh mục", children: response.data }])
      }
    })
  }
  useEffect(() => {
    refetchData();
    Actions.getDepartments(dispatch).then(response => {
      setDepartments(response.data);
    })
  }, [])

  useEffect(() => {

    const deptAttribute = serviceOnDemandAttributes.find(m => m.name == "departmentIds");
    deptAttribute.options = departments.map(d => ({
      value: d._id, label: d.name
    }));
    const parentAttribute = serviceOnDemandAttributes.find(m => m.name == "parentId");
    parentAttribute.options = menuList.map(m => ({
      value: m._id, label: m.fullName
    }))
    setAttributes([...serviceOnDemandAttributes])
  }, [departments, menuList]);

  const MyNodeComponent = ({ node }) => {
    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [confirm, setConfirm] = useState(false);

    const handleClick = event => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    function removeNodeFromTree(node, _id) {

      if (node.children) {
        var removed = _.remove(node.children, function (item) {
          return item._id === _id
        })
        if (removed.length === 0) {
          //tiep tuc check cac cap duoi
          node.children.forEach(function (item) {
            removeNodeFromTree(item, _id);
          })
        }
      }
    }
    function handleDelete(_id) {
      Actions.remove(_id).then(response => {
        if (response.code === 0) {
          nodes.forEach(function (node) {
            removeNodeFromTree(node, _id);
          })
          setNodes([...nodes]);
          dispatch(showMessage({ message: "Xóa tổ chức thành công" }));
          //xóa trong data

        }
        handleClose();
      })
      setConfirm(false);
    }
    function toggleChildren(node) {
      if (node.collapse) {
        node.collapse = false;
        node.children = [...node._children];
        node._children = [];
      } else {
        node.collapse = true;
        node._children = [...node.children];
        node.children = [];
      }
      setNodes([...nodes]);
    }
    return (
      <div className="flex flex-col items-center">
        <Card className={classes.root}>
          <CardHeader title={<Tooltip title={node.note}>
            <div>
              <Typography className="font-bold text-14" aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>{node.priority > 0 && node.priority + "."}{node.name}</Typography>
              {
                node.departmentIds && <Typography>{node.departmentIds.length} khoa</Typography>
              }
            </div>
          </Tooltip>}
            action={
              <IconButton aria-label="settings" onClick={handleClick}>
                <MoreVert />
              </IconButton>
            }
          />
          {
            node._id && <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={() => dispatch(showEditDialog(convertDataToForm(node), handleSave, attributes))}>Sửa</MenuItem>
              <MenuItem onClick={() => dispatch(showEditDialog({ parentId: node._id, priority: 1 }, handleSave, attributes))}>Thêm nhánh con</MenuItem>
              <MenuItem onClick={() => dispatch(showEditDialog({ parentId: node.parentId, priority: node.priority + 1 }, handleSave, attributes))}>Thêm nhánh cùng cấp</MenuItem>
              {
                node.children && node.children.length === 0 && <MenuItem onClick={() => handleDelete(node._id)}>Xóa</MenuItem>
              }
            </Menu>
          }
          {
            node.leader && node.leader.base && <CardContent>

              <div className="flex">
                <Avatar style={{ width: 30, height: 30 }} src={node.leader.base.avatar} alt={node.leader.base.fullName.substring(0, 1)} />
                <div className="pl-8 text-left">
                  <Typography className="text-12 font-bold">
                    {node.leader.base.title} {node.leader.base.fullName}
                  </Typography>
                  <Typography className="text-11">
                    {node.leader.base.work}
                  </Typography>
                </div>
              </div>

            </CardContent>
          }
          {
            (node.children && node.children.length > 0 || (node._children && node._children.length > 0)) &&
            <CardActions className="justify-center p-0">
              <Button onClick={() => toggleChildren(node)} endIcon={node.collapse ? <ExpandMore /> : <ExpandLess />} >({(node.collapse && node._children && node._children.length) || node.children.length})</Button>
            </CardActions>
          }
        </Card>
      </div>
    );
  };

  return (
    <FusePageCarded
      classes={{
        content: "flex",
        header: "min-h-72 h-72 sm:h-136 sm:min-h-136"
      }}
      header={
        <div className="flex flex-1 w-full items-center justify-between p-24 el-HeaderPage">

          <div className="flex flex-col">
            <div className="flex items-center mb-4">
              <Icon className="text-18 el-TitleIcon" color="action">home</Icon>
              <Icon className="text-16 el-TitleIcon" color="action">chevron_right</Icon>
              <Typography color="textSecondary">Thiết lập</Typography>

            </div>
            <FuseAnimate>
              <Typography variant="h6">Chỉ mục dịch vụ đặt trực tuyến</Typography>
            </FuseAnimate>
          </div>
          <FuseAnimate animation="transition.slideRightIn" delay={300}>
            <Button onClick={() => dispatch(showEditDialog(null, handleSave, attributes))} className="whitespace-no-wrap btn-blue" variant="contained">
              <span className="hidden sm:flex">Thêm</span>
            </Button>
          </FuseAnimate>
        </div>
      }
      content={
        <div className="el-cover-graph">
          {
            nodes && nodes.length > 0 ?
              <div className="el-orgchart-wrapper">
                {
                  nodes.map((item, index) =>
                    <div className="el-orgchart-container" key={index}>
                      {
                        item &&
                        <OrgChart tree={item} NodeComponent={MyNodeComponent} />
                      }
                    </div>
                  )
                }
              </div>
              : <div className="flex flex-1 items-center justify-center h-full">
                <Typography color="textSecondary" variant="h5">
                  Chưa có dịch vụ trực tuyến
                </Typography>
              </div>
          }
        </div>
      }
    // innerScroll
    />
  );
}

export default (ServiceOnDemandGraph);
