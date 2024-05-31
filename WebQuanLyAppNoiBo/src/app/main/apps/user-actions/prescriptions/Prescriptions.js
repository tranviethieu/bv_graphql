import React, {useState, useEffect} from 'react';
import { Typography, Icon, Button, Tooltip} from '@material-ui/core';
import { FuseAnimate, FusePageCarded} from '@fuse';
import { useDispatch } from 'react-redux';
import { useForm } from '@fuse/hooks';
import ReactTable from 'react-table'
import * as Actions from '../store/actions';
import { showUserDialog, showUserActionDialog } from '../../shared-dialogs/actions'
import { makeStyles } from '@material-ui/styles';
import Lightbox from 'react-image-lightbox';
import InfoDrugs from '../Dialog/InfoDrugs';
import moment from 'moment'
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
function Prescriptions(props){
    const classes = useStyles();
    const dispatch = useDispatch();
    const [prescriptions, setPrescription] = useState([])
    const [page, setPage] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const [openLightBox, setOpenLightBox] = useState(false)
    const [photoIndex, setPhotoIndex] = useState(0)
    const { form, setForm } = useForm({ currenImages: [], name: "", date: new Date() })
    const [ open, setOpen ] = useState(false)
    const [info, setInfo] = useState([])
    const [filterState, setFilterState] = useState({ filtered: [], page: 0, pageSize: 10});

    const handleClickOpen = (type) => {
        dispatch(showUserActionDialog({rootClass: classes.root,  phoneNumber: "", type: type, className: "el-coverUAD-Prescription" }))
    };
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
    function handleCloseInfo() {
        setOpen(false)
    }
    const fetchData = () => {
        var { page, pageSize, sorted, filtered } = filterState;
        filtered = filtered.filter((item)=>{
            return item.id!=="action" && item.id !== "state" && item.id !== "_id";
        })
        filtered.push({
            id: 'action', value: "PRESCRIPTION"
        });
        filtered.push({ id: "state", value: "ACTIVE" })
        if(props.match.params._id){
          filtered.push({ id: "_id", value: props.match.params._id })
        }
        setPageSize(pageSize)
        Actions.getUserActions({ page, pageSize, sorted, filtered })
            .then(response => {
                setPrescription(response)
            })
    }
    return (
            <FusePageCarded
              classes={{
                content: "flex",
                header: "min-h-72 h-72 sm:h-136 sm:min-h-136"
              }}
              header={
                <div className="flex flex-1 w-full items-center justify-between el-UAHeaderPage">

                  <div className="flex items-center">
                    <FuseAnimate animation="transition.expandIn" delay={300}>
                      <Icon className="text-32 mr-0 sm:mr-12">class</Icon>
                    </FuseAnimate>
                    <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                      <Typography className="hidden sm:flex" variant="h6">Đơn thuốc ({prescriptions.records? prescriptions.records : 0})</Typography>
                    </FuseAnimate>
                  </div>
                  <FuseAnimate animation="transition.slideRightIn" delay={300}>
                    <Button onClick = {()=>handleClickOpen("PRESCRIPTION")} className="whitespace-no-wrap btn-blue" variant="contained">
                      <span className="hidden sm:flex">Tạo đơn thuốc</span>
                    </Button>
                  </FuseAnimate>
                </div>
              }
              content={
                <div className = "el-cover-table">
                  <InfoDrugs onCloseInfoDialog = {handleCloseInfo} open = {open} drugs = {info} user={form}/>
                  {openLightBox && <Lightbox
                    className = "el-Lightbox"
                    imageTitle={"Đơn thuốc " + form.name + " vào "+ moment(form.date).format("HH:mm DD/MM/YYYY")}
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
                    data={prescriptions.data}
                    pages={prescriptions.pages}
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
                        Header: "Danh mục thuốc",
                        accessor: "data.Drugs",
                        filterable: false,
                        Cell: row =>
                        <div>
                          {
                            row.value && row.value.length>0?
                              <label htmlFor="text-button-file">
                                <Button
                                  className = "el-ButtonLowerCase-ShowDialog"
                                  component="span"
                                  onClick = {() =>{setOpen(true); setInfo(row.value); setForm({ currenImages: row.value, name: row.original.user.fullName, date: row.original.createdTime })}}>{row.value.length} loại thuốc
                                </Button>
                              </label>
                            :
                            <label htmlFor="text-button-file">
                              <Button
                                className = "el-ButtonLowerCase-ShowDialog"
                                component="span"
                                disabled
                              >0 loại thuốc
                              </Button>
                            </label>
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
                                <Button
                                  className = "el-ButtonLowerCase-ShowDialog"
                                  component="span"
                                  onClick={()=>{setOpenLightBox(true);setForm({ currenImages: row.value, name: row.original.user.fullName, date: row.original.createdTime })}}>{row.value.length} ảnh</Button>
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
                      },
                    ]}
                  />
                </div>
              }
              // innerScroll
            />
    );
}

export default Prescriptions;
