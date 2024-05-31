import React, { useState, useEffect} from 'react';
import { Typography, Icon, Button, Tooltip, Badge} from '@material-ui/core';
import { FuseAnimate, FusePageCarded} from '@fuse';
import { useDispatch } from 'react-redux';
import { useForm } from '@fuse/hooks';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import ReactTable from 'react-table'
import * as Actions from '../store/actions';
import { showUserDialog, showUserActionDialog } from '../../shared-dialogs/actions'
import { makeStyles } from '@material-ui/styles';
import moment from 'moment';

export const row={
    height: "62px"
  }
const useStyles = makeStyles({
    root: {
        '&.horizontal': {},
        '&.vertical': {
            flexDirection: 'column'
        }
    },
    imageTypeRootStyle: {
        backgroundColor:"transparent",
        width:"auto",
        border:"none",
        '& img': {
            border: 'none',
        },
    }
});
function Examinations(props){
    const classes = useStyles();
    const dispatch = useDispatch();
    const [examinations, setExamination] = useState([])
    const [page, setPage] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const [openLightBox, setOpenLightBox] = useState(false)
    const [photoIndex, setPhotoIndex] = useState(0)
    const { form, setForm } = useForm({ currenImages: [], name: "", date: new Date() })
    const [filterState, setFilterState] = useState({ filtered: [], page: 0, pageSize: 10});

    useEffect(() => {
        fetchData();
    }, [filterState, props]);
    const onChangeTable = (state) => {
      let { page, pageSize, filtered } = state;
      filtered = filtered.map(f=>({
        id:f.id,...f.value
      }))
      filtered.forEach(function(item, index){
          if(item.id === "user.FullName" || item.id === "user.PhoneNumber") {
              if(item.value.length > 1){
                  if (item.value.indexOf("/i") === (item.value.length - 2)){
                      let deleteIValue = item.value.substring(0, item.value.length - 1);
                      filtered[index].value= deleteIValue
                      if (item.value.indexOf('/') > -1){
                          let newValue = item.value.replace(/\//g, "");
                          filtered[index].value=`/${newValue}/i`
                      }
                      else{
                          filtered[index].value=`/${item.value}/i`
                      }
                  }
                  else{
                      filtered[index].value=`/${item.value}/i`
                  }
              }
              else{
                  filtered[index].value=`/${item.value}/i`
              }
          }
      })
      setFilterState({ ...filterState, page, pageSize, filtered });
    }
    const handleClickOpen = (type) => {
        dispatch(showUserActionDialog({rootClass: classes.root,  phoneNumber: "", type: type, className: "el-coverUAD" }))

    };
    const fetchData = () => {
        var { page, pageSize, sorted, filtered } = filterState;
        filtered = filtered.filter((item)=>{
            return item.id!=="action" && item.id!=="state" && item.id !== "_id";
        })
        filtered.push({
            id: 'action', value: "EXAMINATION"
        });
        filtered.push({ id: "state", value: "ACTIVE" })
        setPageSize(pageSize)
        if(props.match.params._id){
          filtered.push({ id: "_id", value: props.match.params._id })
        }
        Actions.getUserActions({ page, pageSize, sorted, filtered })
            .then(response => {
                setExamination(response)
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
                      <Icon className="text-32 mr-0 sm:mr-12">class</Icon>
                    </FuseAnimate>
                    <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                      <Typography className="hidden sm:flex" variant="h6">Kết quả khám ({examinations.records? examinations.records : 0})</Typography>
                    </FuseAnimate>
                  </div>
                  <FuseAnimate animation="transition.slideRightIn" delay={300}>
                    <Button onClick = {()=>handleClickOpen("EXAMINATION")} className="whitespace-no-wrap btn-blue" variant="contained">
                      <span className="hidden sm:flex">Tạo kết quả khám</span>
                    </Button>
                  </FuseAnimate>
                </div>
              }
              content={
                <div className = "el-cover-table">
                  {openLightBox && <Lightbox
                    className = "el-Lightbox"
                    imageTitle={"Kết quả khám " + form.name + " vào "+ moment(form.date).format("HH:mm DD/MM/YYYY")}
                    mainSrc={process.env.REACT_APP_FILE_PREVIEW_URL + form.currenImages[photoIndex]}
                    nextSrc={process.env.REACT_APP_FILE_PREVIEW_URL + form.currenImages[(photoIndex + 1) % form.currenImages.length]}
                    prevSrc={process.env.REACT_APP_FILE_PREVIEW_URL + form.currenImages[(photoIndex + form.currenImages.length - 1) % form.currenImages.length]}
                    onCloseRequest={() => setOpenLightBox(false)}
                    onMovePrevRequest={() =>
                      setPhotoIndex((photoIndex + form.currenImages.length - 1) % form.currenImages.length)
                    }
                    onMoveNextRequest={() =>
                      setPhotoIndex((photoIndex + 1) % form.currenImages.length)
                    }
                                   />}
                  <ReactTable
                    manual
                    className="-striped -highlight h-full w-full sm:rounded-8 overflow-hidden pt-16 el-TableUserAction"
                    data={examinations.data}
                    pages={examinations.pages}
                    defaultPageSize={10}
                    noDataText ="Không có dữ liệu nào"
                    onFetchData={onChangeTable}
                    filterable={true}
                    defaultSorted={[{
                      id: "createdTime", desc: true
                    }]}
                    onPageChange = {setPage}
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
                        id: "user.FullName",
                        Header: 'Tên khách hàng',
                        accessor: 'user.fullName',
                        Cell: row => <div>
                          <Button color="secondary" onClick={e=>dispatch(showUserDialog({rootClass: "el-coverFUD",phoneNumber:row.original.user.phoneNumber}))}>{row.value}</Button>
                        </div>
                      },
                      {
                        id: "user.PhoneNumber",
                        Header: 'Số điện thoại',
                        accessor: 'user.phoneNumber',

                      },
                      {
                        minWidth: 110,
                        id: "createdTime",
                        Header: 'Thời gian tạo',
                        accessor: 'createdTime',
                        Cell: row => <div>{moment(row.value).format("HH:mm DD/MM")}</div>,
                        type: 'date'
                      },
                      {
                        id: "Data.ReExamination",
                        Header: "Khám lại",
                        accessor: "data.ReExamination",
                        Cell: row=>
                        <div>{row.value===true?
                          <div style = {{ paddingLeft: "15px" }}>
                            <Badge badgeContent={row.original.data.ReExaminationTime} color="secondary" anchorOrigin={{
                              horizontal: 'left', vertical: 'top',
                            }}>
                              <span className="pl-24"></span>
                            </Badge>
                            {
                              moment(row.original.data.ReExaminiationDate).format("DD/MM/YYYY")
                            }
                          </div>
                        :"Không khám lại"}
                        </div>,
                        type: 'select',
                        options: [
                        {value: true, label: "Phải khám lại"},
                        {value: false, label: "Không khám lại"}
                        ]
                      },
                      {
                        Header: "Kết luận của bác sỹ",
                        accessor: "data.Conclusion",
                        filterable: false,
                        Cell: row=>
                        <Tooltip title={row.value} placement="bottom">
                          <div>{row.value?row.value:""}</div>
                        </Tooltip>
                      },
                      {
                        Header: "Ghi chú của bác sỹ",
                        accessor: "data.Note",
                        filterable: false,
                        Cell: row=>
                        <div>
                          {
                            row.value?
                              <Tooltip title={row.value} placement="bottom">
                                <div>{row.value?row.value:""}</div>
                              </Tooltip>
                            :
                            <div></div>
                          }
                        </div>
                      },
                      {
                        Header: "Ảnh",
                        accessor: "data.Images",
                        filterable: false,
                        Cell: row =>
                        <div>
                          {
                            row.value.length>0?
                              <label htmlFor="text-button-file">
                                <Button className = "el-ButtonLowerCase-ShowDialog" component="span" onClick={()=>{setOpenLightBox(true);setForm({ currenImages: row.value, name: row.original.user.fullName, date: row.original.createdTime })}}>
                                  {row.value.length} ảnh
                                </Button>
                              </label>
                            : <label htmlFor="text-button-file">
                              <Button
                                className = "el-ButtonLowerCase-ShowDialog"
                                component="span"
                                disabled
                              >0 ảnh
                              </Button>
                            </label>
                          }
                        </div>
                      }
                    ]}
                  />
                </div>
              }
            />
    );
}

export default Examinations;
