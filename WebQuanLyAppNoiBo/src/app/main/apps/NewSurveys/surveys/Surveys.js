import React, { useState, useEffect } from 'react';
import { FusePageCarded } from '@fuse';
import { makeStyles } from '@material-ui/styles';
import { Paper, Button, Input, Icon, Typography, IconButton, Tooltip, FormControlLabel } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import { FuseAnimate } from '@fuse';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ReactTable from 'react-table';
import * as Actions from './store/actions';
import moment from 'moment';
import history from '@history';
import ImplementSurvey from './Dialog/ImplementSurvey'
import SurveyQRCode from './Dialog/SurveyQRCode'
import TableCircularLoading from 'app/fuse-layouts/shared-components/loading/TableCircularLoading';
import IOSSwitch from './components/IOSSwitch'
import { showMessage } from 'app/store/actions'
import * as BaseControl from 'app/main/utils/VTBaseControl'
import * as BaseConfig from './BaseConfig/BaseConfig'

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        alignItems: 'center',
        height: 21,
        borderRadius: 2,
        padding: '0 6px',
        fontSize: 11,
        backgroundColor: 'rgba(0,0,0,.08);'
    },
    color: {
        width: 8,
        height: 8,
        marginRight: 4,
        borderRadius: '50%'
    }
}));

function Surveys(props) {
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [openQRCode, setOpenQRCode] = useState(false)
    const [surveys, setSurveys] = useState([]);
    const [surveyId, setId] = useState(null);
    const [surveyName, setSurveyName] = useState("")
    const [page, setPage] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const [loading, setLoading] = useState(false)
    const [statusFilter, setStatusFilter] = useState(true)
    const [targetFilter, setTargetFilter] = useState("EMPLOYEE")
    const [tableState, setTableState] = useState(null)

    useEffect(() => {
        if (tableState !== null) {
            fetchData(tableState)
        }
    }, [statusFilter, targetFilter])

    function fetchData(state) {
        const { page, pageSize, filtered, sorted } = state;
        var tempSort = [...sorted, { id: "createdTime", desc: true }]
        setPageSize(pageSize)
        setLoading(true)
        setTableState(state)
        console.log("==> table filter: ", filtered)
        let filter = [...filtered, { id: "disable", value: `${!statusFilter}` }, { id: "target", value: `${targetFilter}` }]// 
        Actions.getSurveys({ page, pageSize, filtered: filter, sorted: tempSort }, dispatch).then(response => {
            console.log("===> surveys: ", response)
            setSurveys(response);
            setLoading(false)
        })
    }
    function refreshData() {
        let state = { ...tableState, page: 0 }
        fetchData(state)
    }
    function handleCloseDialog() {
        setOpen(false)
    }
    function handleSubmitResult() {
        setOpen(false)
    }


    function duplicateSurvey(surveyId) {
        if (surveyId) {
            Actions.getSurvey(surveyId, dispatch)
                .then(response => {
                    if (response.data) {
                        let survey = response.data
                        let title = survey.title
                        let name = survey.name + "_COPY"
                        let disable = survey.disable
                        let target = survey.target
                        let questions = []
                        survey.questions.map(e => {
                            // let temp = {
                            //     name: e.name,
                            //     type: e.type,
                            //     polls: e.polls,
                            //     title: e.title,
                            //     instruction: e.instruction,
                            //     dataType: e.dataType,
                            //     starNumb: e.starNumb,
                            //     userField: e.userField
                            // }
                            let temp = { ...e, _id: null }
                            questions.push(temp)
                        })
                        Actions.saveSurvey({ name: name, title: title, disable: disable, target: target }, [...questions])
                            .then(res => {
                                if (res) {
                                    dispatch(showMessage({ message: "Copy khảo sát thành công" }))
                                    refreshData()
                                }
                            })
                    }
                })
        }
    }

    return (
        <div>
            <ImplementSurvey open={open} onCloseDialog={handleCloseDialog} onSubmitResult={handleSubmitResult} surveyIdProps={surveyId} />
            <SurveyQRCode open={openQRCode} onCloseDialog={e => setOpenQRCode(false)} surveyId={surveyId} title={surveyName} />
            <FusePageCarded
                classes={{
                    content: "flex",
                    header: "min-h-72 h-72 sm:h-136 sm:min-h-136"
                }}
                header={
                    <div className="flex flex-1 w-full items-center justify-between">

                        <div className="flex items-center">
                            <FuseAnimate animation="transition.expandIn" delay={300}>
                                <Icon className="text-32 mr-0 sm:mr-12"><img src={"assets/icons/survey/icon_survey.png"} alt="icon" style={{ maxWidth: "32px", maxHeight: "32px" }} /></Icon>
                            </FuseAnimate>
                            <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                                <Typography className="hidden sm:flex" variant="h6">Khảo sát({surveys.records})</Typography>
                            </FuseAnimate>
                        </div>
                        <FuseAnimate animation="transition.slideRightIn" delay={300}>
                            <Button component={Link} to="/apps/surveys/edit/new" className="whitespace-no-wrap" variant="contained">
                                <span className="hidden sm:flex">Tạo khảo sát</span>
                                <span className="flex sm:hidden">New</span>
                            </Button>
                        </FuseAnimate>
                    </div>
                }
                content={
                    <ReactTable
                        manual
                        className="-striped -highlight h-full w-full sm:rounded-8"
                        data={surveys.data}
                        pages={surveys.pages}
                        defaultPageSize={10}
                        filterable={true}
                        sortable={false}
                        onPageChange={setPage}
                        noDataText="Không có khảo sát nào"
                        onFetchData={fetchData}
                        style={{ fontSize: "15px", }}
                        loading={loading}
                        LoadingComponent={TableCircularLoading}
                        columns={[
                            {
                                Header: "#",
                                width: 50,
                                filterable: false,
                                Cell: row => <div>
                                    {row.index + 1 + (page * pageSize)}
                                </div>
                            },
                            {
                                Header: 'Tên khảo sát',
                                accessor: 'name',
                                className: "wordwrap",
                                style: { justifyContent: "left", textAlign: "left", whiteSpace: "unset", wordBreak: "nomal" },
                                Cell: row =>
                                    <Tooltip title="Thống kê chi tiết khảo sát">
                                        <span style={{ marginLeft: "10px", marginRight: "10px", textDecoration: "underline", textDecorationColor: "#C6C6C6", cursor: "pointer", }}
                                            onClick={_ => history.push(`/apps/survey/${row.original._id}`)}
                                        >
                                            {row.value}
                                        </span>
                                    </Tooltip>
                            },
                            {
                                Header: 'Tiêu đề',
                                accessor: 'title',
                                style: { justifyContent: "left", textAlign: "left", whiteSpace: "unset", wordBreak: "nomal" },
                                Cell: row =>
                                    <Tooltip title="Thống kê chi tiết khảo sát">
                                        <span style={{ marginLeft: "10px", marginRight: "10px", textDecoration: "underline", textDecorationColor: "#C6C6C6", cursor: "pointer", }}
                                            onClick={_ => history.push(`/apps/survey/${row.original._id}`)}
                                        >
                                            {row.value}
                                        </span>
                                    </Tooltip>
                            },
                            {
                                Header: 'Ngày tạo',
                                accessor: 'createdTime',
                                className: "justify-center",
                                filterable: false,
                                width: 120,
                                Cell: row => <div>{moment(row.value).format("DD/MM/YYYY")}</div>
                            },
                            {
                                Header: "Số câu hỏi",
                                filterable: false,
                                accessor: "questionIds.length",
                                width: 120,
                                className: "justify-center",
                            },

                            // {
                            //     Header: "Dùng nội bộ",
                            //     filterable: true,
                            //     accessor: "target",
                            //     width: 140,
                            //     Filter: filter =>
                            //         <FormControlLabel
                            //             control={
                            //                 <IOSSwitch
                            //                     checked={targetFilter === "EMPLOYEE"}
                            //                     onChange={e => {
                            //                         let temp = "EMPLOYEE"
                            //                         if (e.target.checked === false) {
                            //                             temp = "USER"
                            //                         }
                            //                         setTargetFilter(temp)
                            //                     }}
                            //                 />
                            //             }
                            //             label=""
                            //         />
                            //     ,
                            //     className: "justify-center",
                            //     Cell: row => <div style={{ padding: "5", textAlign: "center" }}>
                            //         <FormControlLabel
                            //             control={
                            //                 <IOSSwitch
                            //                     checked={row.value === "EMPLOYEE"}
                            //                     value="disable"
                            //                 />
                            //             }
                            //             label=""
                            //         />
                            //     </div>
                            // },
                            {
                                Header: "Trạng thái",
                                filterable: true,
                                accessor: "disable",
                                width: 120,
                                Filter: filter =>
                                    <FormControlLabel
                                        control={
                                            <IOSSwitch
                                                checked={statusFilter}
                                                onChange={e => setStatusFilter(e.target.checked)}
                                            />
                                        }
                                        label=""
                                    />
                                ,
                                className: "justify-center",
                                Cell: row => <div style={{ padding: "5", textAlign: "center" }}>
                                    <FormControlLabel
                                        control={
                                            <IOSSwitch
                                                checked={!row.value}
                                                value="disable"
                                            />
                                        }
                                        label=""
                                    />
                                </div>
                            },
                            {
                                Header: "Tác vụ",
                                accessor: "_id",
                                filterable: false,
                                width: 180,
                                Cell: row => <div>
                                    <Tooltip title="Chỉnh sửa khảo sát" placement="left">
                                        <IconButton title="Chỉnh sửa khảo sát"
                                            onClick={_ => history.push(`/apps/surveys/edit/${row.value}`)}
                                        >
                                            <Icon>
                                                edit
                                        </Icon>
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Gen mã QRCODE" placement="left">
                                        <IconButton title="Gen mã QRCODE"
                                            onClick={(e) => {
                                                console.log("===> data: ", row.original._id)
                                                setSurveyName(row.original.title); setId(row.value); setOpenQRCode(true);
                                            }}
                                        >
                                            <img src={"assets/icons/survey/icon_gen_qrcode.svg"} alt={"qrcode"} style={{ objectFit: "contain", width: "24px", height: "24px" }} />
                                        </IconButton>
                                    </Tooltip>
                                    {/* Phần khảo sát dành cho nội bộ này không hiển thị chức năng này */}
                                    {/* <Tooltip title="Thực hiện khảo sát" placement="left">
                                        <IconButton title="Thực hiện khảo sát"
                                            onClick={(e) => { setId(row.value); setOpen(true); }}
                                        >
                                            <Icon>
                                                pageview
                                        </Icon>
                                        </IconButton>
                                    </Tooltip> */}
                                    <Tooltip title="Copy thành khảo sát mới" placement="left">
                                        <IconButton title="Copy thành khảo sát mới"
                                            onClick={(e) => { duplicateSurvey(row.value) }}
                                        >
                                            <Icon>
                                                control_point_duplicate
                                        </Icon>
                                        </IconButton>
                                    </Tooltip>
                                    {
                                        statusFilter === false &&

                                        <Tooltip title="Xóa khảo sát" placement="left">
                                            <IconButton title="Xóa khảo sát và tất cả thông tin liên quan"
                                                onClick={(e) => {
                                                    BaseControl.showConfirmAlert("Thông báo", "Xóa khỏa sát và tất các thông tin liên quan đến khảo sát này. Bạn có chắc chắn muốn xóa?", null, null, ((onSuccess) => {
                                                        Actions.removeSurvey(row.value).then(_ => {
                                                            dispatch(showMessage({ message: "Xóa khảo sát thành công" }))
                                                            refreshData()
                                                        })
                                                    }),
                                                        ((onCancel) => { })
                                                    )
                                                }}
                                            >
                                                <Icon>
                                                    delete_outline
                                                </Icon>
                                            </IconButton>
                                        </Tooltip>
                                    }
                                </div>
                            }
                        ]}
                    />
                }
            />
        </div>
    );
}
export default Surveys;
