import React, { useState, useEffect } from 'react';
import { Button, Icon, Typography, Menu, MenuItem, Tooltip, NativeSelect, InputLabel, FormGroup, IconButton } from '@material-ui/core';
import { FuseAnimate, FusePageCarded } from '@fuse';
import { showMessage } from 'app/store/actions'
import * as Actions from './actions';
import _ from 'lodash';
import OrgChart from 'react-orgchart';
import 'react-orgchart/index.css';
import { useDispatch } from 'react-redux';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import { showQuickEditDialog } from '../../shared-dialogs/actions';
import ReactTable from 'react-table';

const InitialAttributes = [
    {
        label: "Tên lớp gốc",
        name: 'rootClassName'
    },
    {
        label: "Nhãn trường",
        name: 'label'
    },
    {
        label: "Tên trường",
        name: 'name'
    },
    {
        label: "Chỉ số",
        name: 'index'
    },
    {
        label: "Kiểu dữ liệu",
        name: 'type',
        type: 'select',
        options: [
            {
                label: 'OBJECT', value: 'OBJECT'
            },
            {
                label: 'CHUỖI KÝ TỰ', value: 'STRING'
            },
            {
                label: 'SỐ NGUYÊN', value: 'INT'
            },
            {
                label: 'SỐ THẬP PHÂN', value: 'DOUBLE'
            },
            {
                label: 'NGÀY', value: 'DATE'
            },
            {
                label: 'ĐÚNG/SAI', value: 'BOOL'
            },
        ]
    },
    {
        label: "Biến cha",
        name: "parentId"
    },
    {
        label: "Bắt buộc nhập",
        name: "require"
    },
    {
        label: "Bắt buộc duy nhất",
        name: "unique"
    }
];
const showEditDialog = (data, submit, attributes) => {
    return (dispatch) => dispatch(showQuickEditDialog(
        {
            rootClass: "el-coverFUD",
            title: data ? "Cập nhật" : "Thêm mới",
            subtitle: "Định nghĩa dữ liệu nguồn",
            attributes: attributes || InitialAttributes,
            data: data,
            submit: submit
        }));
}
export default function CustomEntities(props) {
    let [nodes, setNodes] = useState([]);
    const [rootClasses, setRootClasses] = useState([]);
    const [collapseLevel, setCollapseLevel] = useState(1);
    const [selectedClass, setSelectedClass] = useState(null);
    const [attributes, setAttributes] = useState(InitialAttributes);
    const [showGraph, setShowGraph] = useState(false);
    const [data, setData] = useState([]);


    const dispatch = useDispatch();
    useEffect(() => {
        Actions.get_editable_classes(dispatch).then(response => {
            setRootClasses(response.data);
        })
    }, []);
    useEffect(() => {
        const { className } = props.match.params;
        if (className)
            setSelectedClass(className);
    }, [props]);
    function toggleGraph() {
        setShowGraph(showGraph => !showGraph);

    }
    function fetchGraph() {
        if (showGraph) {
            Actions.get_custom_entities_graph(selectedClass, dispatch).then(response => {
                if (response.code === 0) {
                    // setNodes(response.data)
                    nodes = response.data;
                    nodes.forEach(function (node) {
                        doToggleAll(node, 10, true);
                    })
                    handleToggleAll(collapseLevel, false);
                }
            });
            Actions.get_custom_entities(selectedClass, true, dispatch).then(response => {
                setAttributes([
                    {
                        label: "Tên lớp gốc",
                        name: 'rootClassName'
                    },
                    {
                        label: "Nhãn trường",
                        name: 'label'
                    },
                    {
                        label: "Tên trường",
                        name: 'name'
                    },
                    {
                        label: "Chỉ số",
                        name: 'index'
                    },
                    {
                        label: "Kiểu dữ liệu",
                        name: 'type',
                        type: 'select',
                        options: [
                            {
                                label: 'OBJECT', value: 'OBJECT'
                            },
                            {
                                label: 'CHUỖI KÝ TỰ', value: 'STRING'
                            },
                            {
                                label: 'SỐ NGUYÊN', value: 'INT'
                            },
                            {
                                label: 'SỐ THẬP PHÂN', value: 'DOUBLE'
                            },
                            {
                                label: 'NGÀY', value: 'DATE'
                            },
                            {
                                label: 'ĐÚNG/SAI', value: 'BOOL'
                            },
                        ]
                    },
                    {
                        label: "Biến cha",
                        name: "parentId",
                        type: 'select',
                        options: response.data.map((item) => ({
                            value: item._id, label: item.label
                        }))
                    },
                    {
                        label: "Bắt buộc nhập",
                        name: "require"
                    },
                    {
                        label: "Bắt buộc duy nhất",
                        name: "unique"
                    }
                ])
            })
        } else {
            Actions.get_custom_entities(selectedClass, false, dispatch).then(response => {
                setData(response.data);
            })
        }
    }
    useEffect(() => {
        if (selectedClass && selectedClass.length > 0) {
            fetchGraph();
        }
    }, [selectedClass, showGraph])
    function handleToggleAll(level, collapse) {
        nodes.forEach(function (node) {
            doToggleAll(node, level, collapse);
        })
        setNodes([...nodes]);
    }
    function handleSave(data) {
        const submitData = _.omit(data, ['fullName', 'children', '_children', 'collapse']);
        Actions.save_custom_entity(submitData, dispatch).then(response => {
            if (response.code == 0) {
                fetchGraph();
            } else {
                dispatch(showMessage({ title: response.message }));
            }
        })
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
    function handleDelete(_id) {
        Actions.remove_custom_entity(_id).then(response => {
            if (response.code === 0) {
                fetchGraph();
                dispatch(showMessage({ message: "Xóa thành công" }));             
            }
        })        
    }
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
                if (removed.length == 0) {
                    //tiep tuc check cac cap duoi
                    node.children.forEach(function (item) {
                        removeNodeFromTree(item, _id);
                    })
                }
            }
        }

        function handleDelete(_id) {
            Actions.remove_custom_entity(_id).then(response => {
                if (response.code === 0) {
                    nodes.forEach(function (node) {
                        removeNodeFromTree(node, _id);
                    })
                    setNodes([...nodes]);
                    dispatch(showMessage({ message: "Xóa thành công" }));
                    //xóa trong data

                }
                handleClose();
            })
            setConfirm(false);
        }
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
                <Tooltip title={node.label}>
                    <div>
                        <Button startIcon={<Icon>{node.icon}</Icon>} aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>{node.index > 0 && node.index + "."}{node.name}</Button>
                        <Typography>({node.type})</Typography>
                        {
                            (node.children.length > 0 || (node._children && node._children.length > 0)) && <Typography>
                                <Button onClick={() => toggleChildren(node)} endIcon={node.collapse ? <ExpandMore /> : <ExpandLess />} >({(node.collapse && node._children && node._children.length) || node.children.length})</Button></Typography>
                        }
                    </div>
                </Tooltip>
                {
                    node._id && <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={() => dispatch(showEditDialog(node, handleSave, attributes))}>Sửa</MenuItem>
                        <MenuItem onClick={() => dispatch(showEditDialog({ parentId: node._id, rootClassName: selectedClass }, handleSave, attributes))}>Thêm nhánh con</MenuItem>
                        <MenuItem onClick={() => dispatch(showEditDialog({ parentId: node.parentId, rootClassName: selectedClass }, handleSave, attributes))}>Thêm nhánh cùng cấp</MenuItem>
                        {
                            node.children.length === 0 && <MenuItem onClick={() => handleDelete(node._id)}>Xóa</MenuItem>
                        }

                    </Menu>
                }
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
                <div className="flex flex-1 w-full items-center justify-between">

                    <div className="flex flex-col">
                        <div className="flex items-center mb-4">
                            <Icon className="text-18" color="action">home</Icon>
                            <Icon className="text-16" color="action">chevron_right</Icon>
                            <Typography color="textSecondary">Thiết lập</Typography>
                            <Icon className="text-16" color="action">chevron_right</Icon>
                            <Typography color="textSecondary">Dữ liệu lõi</Typography>
                        </div>
                        <FuseAnimate>
                            <Typography variant="h6">Định nghĩa dữ liệu nguồn</Typography>
                        </FuseAnimate>
                    </div>
                    <div>
                        <FuseAnimate>
                            {
                                showGraph ? <IconButton onClick={toggleGraph}><Icon>menu</Icon></IconButton> :
                                    <IconButton onClick={toggleGraph}><Icon>apps</Icon></IconButton>
                            }
                        </FuseAnimate>

                        <FuseAnimate animation="transition.slideRightIn" delay={300}>

                            <Button disabled={!selectedClass} onClick={() => dispatch(showEditDialog({ rootClassName: selectedClass }, handleSave, attributes))} className="whitespace-no-wrap btn-blue" variant="contained">
                                <span className="hidden sm:flex">Tạo trường thông tin</span>
                            </Button>
                        </FuseAnimate>
                    </div>
                </div>
            }
            content={
                showGraph ? (<div className="el-cover-graph">
                    <FormGroup className="p-12 w-full">
                        <InputLabel>Lớp cần được định nghĩa trường thông tin</InputLabel>
                        <NativeSelect
                            value={selectedClass}
                            onChange={e => setSelectedClass(e.target.value)}
                        >
                            <option value="">Chọn lớp</option>
                            {
                                rootClasses && rootClasses.map((item) => <option>{item}</option>)
                            }
                        </NativeSelect>
                    </FormGroup>
                    {
                        nodes && nodes.length > 0 ?
                            <div className="el-orgchart-wrapper">
                                {
                                    nodes.map((item, index) =>
                                        <div className="el-orgchart-container">
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
                ) :
                    <div className="w-full">
                        <FormGroup className="p-12">
                            <InputLabel>Lớp cần được định nghĩa trường thông tin</InputLabel>
                            <NativeSelect
                                value={selectedClass}
                                onChange={e => setSelectedClass(e.target.value)}
                            >
                                <option value="">Chọn lớp</option>
                                {
                                    rootClasses && rootClasses.map((item) => <option>{item}</option>)
                                }
                            </NativeSelect>
                        </FormGroup>
                        <ReactTable
                            className="-striped -highlight h-full w-full sm:rounded-8 overflow-hidden el-TableDepartment"
                            data={data}
                            showPagination={false}
                            pageSize={data.length}
                            manual
                            thStyle={{ whiteSpace: 'unset' }}

                            noDataText="Không có dữ liệu"
                            columns={[
                                {
                                    Header: "#",
                                    width: 50,
                                    filterable: false,
                                    Cell: row => <div>
                                        {row.index + 1}
                                    </div>
                                },
                                {
                                    Header: 'Tên đầy đủ',
                                    accessor: 'fullName',
                                },
                                {
                                    Header: 'Tên trường',
                                    accessor: 'name',                                    
                                },
                                {
                                    Header: 'Nhãn trường',
                                    accessor: 'label'
                                },                                
                                {
                                    Header: 'Cha',
                                    accessor: 'parent.label'                                    
                                },
                                {
                                    Header: 'Chỉ mục',
                                    accessor: 'index',
                                    width: 120
                                },
                                {
                                    Header: 'Loại',
                                    accessor: 'type',
                                    width: 120
                                },
                                {
                                    width: 120,
                                    accessor:"_id",
                                    Cell: row => <div>
                                        <IconButton onClick={() => dispatch(showEditDialog(row.original, handleSave, attributes))}><Icon>edit</Icon></IconButton>
                                        <IconButton onClick={() => handleDelete(row.value)}><Icon>delete</Icon></IconButton>
                                    </div>
                                }
                            ]}
                        />
                    </div>
            }

        />
    );
}