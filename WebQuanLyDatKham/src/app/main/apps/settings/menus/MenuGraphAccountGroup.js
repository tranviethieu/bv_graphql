import React, { useState, useEffect } from 'react';
import { Button, Icon, Typography, Menu, MenuItem, Tooltip, IconButton } from '@material-ui/core';
import { FuseAnimate, FuseAnimateGroup, FusePageCarded } from '@fuse';
import { showMessage } from 'app/store/actions'
import * as Actions from './actions';
import {DownloadExcel,DownloadExcelMultiSheet} from '../../shared-components/DownloadExcel';
import _ from 'lodash';
import OrgChart from 'react-orgchart';
import 'react-orgchart/index.css';
import { useDispatch } from 'react-redux';
import { ExpandLess, ExpandMore } from '@material-ui/icons';

import { showQuickEditDialog, showQuickTableDialog } from '../../shared-dialogs/actions';

import {menuAttributes,exportCostColumns,quickTableColumns} from './components';


function MenuGraphAccountGroup(props) {
    const dispatch = useDispatch();
    let [nodes, setNodes] = useState([]);
    const [collapseLevel, setCollapseLevel] = useState(10);
    const [menuList, setMenuList] = useState([])

    function refetchMenu() {
        Actions.get_menu_list_by_group(props.match.params.groupId,dispatch).then(response => {
            if (response.code === 0) {
                setMenuList(response.data)
            }
            else {
                setMenuList([])
            }
        });
        Actions.get_menu_graph_by_group(props.match.params.groupId,dispatch).then(response => {
            if (response.code === 0) {
                // setNodes(response.data)
                nodes = response.data;
                nodes.forEach(function (node) {
                    doToggleAll(node, 10, true);
                })
                handleToggleAll(collapseLevel, false);
            }
        });
    }

    useEffect(() => {
        const { groupId } = props.match.params;
        if(groupId)
            refetchMenu();
    }, [props]);
    function DownloadDataSheets() {

        const data = menuList.filter(m => m.costNode);
        const totalHour = _.sumBy(data, function (n) {
            return parseInt(n.effortHour);
        })
        // const totalHour = data.sumBy(d => parseInt(d.effortHour));
        const totalDay = totalHour / 8;
        const totalMonth = totalDay / 24;
        data.push({ fullName: "Tổng giờ", effortHour: totalHour });
        data.push({ fullName: "Tổng ngày", effortHour: totalDay });
        data.push({ fullName: "Tổng tháng", effortHour: totalMonth });
        const dataSheets = [
            {
                xSteps: 1,
                columns:[{title:"PHÂN TÍCH CHỨC NĂNG HỆ THỐNG HRM"}]
            },
            {
                ySteps:1,
                data,columns: exportCostColumns
            },

        ];
        return dataSheets;
    }


    function handleToggleAll(level, collapse) {
        nodes.forEach(function (node) {
            doToggleAll(node, level, collapse);
        })
        setNodes([...nodes]);
    }
    function doToggleAll(node, level, collapse) {
        if (node.level < level) {
            if (node.collapse && !collapse) {
                node.collapse = false;
                node.children = node._children;
                if (node.children && node.children.length > 0) {
                    node.children.forEach(function (child) {
                        doToggleAll(child, level, collapse);
                    })
                }
            } else if (!node.collapse && collapse) {
                if (node.children && node.children.length > 0) {
                    node.children.forEach(function (child) {
                        doToggleAll(child, level, collapse);
                    })
                }
                node.collapse = true;
                node._children = [...node.children];
                node.children = [];
            }

        }
    }
    function updateNodeFromTree(nodes, itemChanged) {
        nodes.forEach(function (item) {
            if (item._id == itemChanged._id) {
                var keys = Object.keys(itemChanged);
                keys.forEach(function (key) {
                    item[key] = itemChanged[key];
                })
                //finish update
                return true;
            } else if (item.children && item.children.length > 0)
                updateNodeFromTree(item.children, itemChanged);
        })
    }

    const MyNodeComponent = ({ node }) => {
        const dispatch = useDispatch();
        function toggleChildren(node) {
            if (node.collapse) {
                node.collapse = false;
                node.children = node._children;
            } else {
                node.collapse = true;
                node._children = [...node.children];
                node.children = [];
            }
            setNodes([...nodes]);
        }
        return (
            <div>
              <Tooltip title={node.description}>
                <div>
                  <Button startIcon={<Icon>{node.icon}</Icon>} aria-controls="simple-menu" aria-haspopup="true">{node.priority}.{node.name}</Button>
                  {(node.type === "ITEM" || node.type === "HIDDEN" || node.type === "LINK" || node.type === "TAB") && <Typography className="text-12">({node.permissions.length} permissions)</Typography>}
                    {node.costNode ? <Typography>{node.effortHour} hours</Typography> :
                    <Typography className="text-12">{_.sumBy(node.costnodes, function (n) {
                      return parseInt(n.effortHour);
                    })} hours / {node.costnodes.length} module</Typography>
                    }
                    {
                      (node.children.length > 0 || (node._children && node._children.length > 0)) && <Typography>
                        <Button onClick={() => toggleChildren(node)} endIcon={node.collapse ? <ExpandMore /> : <ExpandLess />} >({(node.collapse && node._children && node._children.length) || node.children.length})</Button></Typography>
                    }
                    </div>
                    </Tooltip>

                    </div>
                    );
                  };
                  const menuColumns = [

                  ...quickTableColumns
                  ];
                  function handleSave(form) {
                    const submitData = convertFormToData(form);
                    // console.log("submitData:", submitData);
                    Actions.save(submitData).then(response => {
                      if (response.code === 0) {
                        dispatch(showMessage({ message: "Lưu thông tin ban/menu thành công" }))
                        //update menuList
                        const anode = menuList.find(m => m._id == form._id);
                        if (anode) {
                          var keys = Object.keys(submitData);
                          keys.forEach(function (k) {
                            anode[k] = submitData[k];
                          })
                        } else {
                          //add new
                          refetchMenu();
                          return;
                        }
                        //update the tree
                        updateNodeFromTree(nodes, submitData);

                        setNodes([...nodes]);
                      }
                    })
                  }
                  function convertFormToData(form) {
                    return _.omit(form, ["children", "_children", "collapse", "costnodes","fullName","parent"]);
                  }
                  function convertDataToForm(data) {
                    const form = { ...data };
                    return form;
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
                            <Typography className="hidden sm:flex" variant="h6">Sơ đồ cây chức năng</Typography>
                        </FuseAnimate>
                    </div>
                    <FuseAnimateGroup>
                        <FuseAnimate animation="transition.slideRightIn" delay={300}>
                            <IconButton>
                                <Icon>cloud_upload</Icon>
                            </IconButton>
                        </FuseAnimate>
                        <FuseAnimate animation="transition.slideRightIn" delay={300}>
                            <DownloadExcelMultiSheet name="menu function" dataSheets={DownloadDataSheets()}/>
                        </FuseAnimate>
                        <FuseAnimate animation="transition.slideRightIn" delay={300}>
                            <IconButton onClick={
                                () => dispatch(showQuickTableDialog({ rootClass: "w-full", columns: menuColumns, title: "Menu", subtitle: "Danh sách Menu", data: menuList }))}>
                                <Icon>menu</Icon>
                            </IconButton>
                        </FuseAnimate>
                    </FuseAnimateGroup>
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
                                    Chưa có dữ liệu cây
                      </Typography>
                            </div>
                    }
                </div>
            }
        // innerScroll
        />
    );
}

export default (MenuGraphAccountGroup);
