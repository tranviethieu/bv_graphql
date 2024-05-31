import React, { useEffect, useState } from 'react';
import { Button, Icon, Typography, Grid, Checkbox, FormControlLabel } from '@material-ui/core';
import { FuseAnimate, FuseChipSelect, FusePageSimple } from '@fuse';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import moment from 'moment'
import { useForm } from '@fuse/hooks';
import * as Actions from './store/actions';
import { showMessage } from 'app/store/actions'
import history from '@history';

const initMember = {
  _id: null,
  name: null,
  type: "PERSON"
}

function CreateAssignmentFromCampaign(props) {
    const dispatch = useDispatch();
    const { form, setForm } = useForm([])
    const [listMember, setListMember] = useState([])
    const [callCampaign, setCallCampaign] = useState({})
    const [displayPhones, setDisplayPhones] = useState("")
    const [all, setAll] = useState(false)

    useEffect(()=>{
      const campaignId = props.match.params.campaignId;
        if(campaignId){
          Actions.getCallCampaign(campaignId, dispatch).then(response =>{
            if(response.code === 0){
              setCallCampaign(response.data)
              var tmpStringPhones = '';
              for(var i=0;i<response.data.phoneNumbers.length;i++){
                  var tmpItem = response.data.phoneNumbers[i];
                  if(validatePhoneNumber(tmpItem)){
                      tmpStringPhones +=  tmpItem.trim() + ','
                  }else{  }
              }
              tmpStringPhones = tmpStringPhones.replace(/,\s*$/, "");
              setDisplayPhones(tmpStringPhones);
            }
          });
        }
        Actions.getMyStaff(dispatch).then(response => {
          if(response.code === 0){
            setListMember(response.data)
          }
        })
    }, [dispatch, props.match.params])
    function validatePhoneNumber(phone) {
        const regex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
        return regex.test(phone)
    }
    function handleSubmit() {
        Actions.saveJobCampaign(callCampaign._id,form).then(response => {
          if(response.code === 0){
            dispatch(showMessage({ message: "Giao việc thành công" }))
            history.push('/apps/assignment/workby');
          }
        })
    }
    function formatMember(member){
      var data = member.map((item) => {
        return {
          _id: item.value,
          type: "PERSON",
          name: item.label,
        };
      })
      return data;
    }
    function handleChangeMember(e){
      if(all === true){
        let newList = formatListAll(listMember)
        setForm(newList)
      }else{
        let newList = formatMember(e)
        setForm(newList)
      }
    }
    function formatListAll(list){
      var data = list.map((item) => {
        return {
          _id: item._id,
          type: "PERSON",
          name: item.base.fullName,
        };
      })
      return data;
    }
    function handleSetAll(all){
      if(all === false){
          setForm([])
      }
      else{
        handleChangeMember(listMember)
      }
    }
    function canBeSave() {
        return (
            form && form.length>0
        )
    }
    return (
        <FusePageSimple
          id="el-ReportAppointmentCover"
          classes={{
            toolbar: "p-0",
            header: "min-h-72 h-72 sm:h-136 sm:min-h-136 p-24"
          }}
          header={
            <div className="flex flex-1 w-full items-center justify-between" id = "el-Personel-HeaderPage">
              <div className="flex flex-col items-start max-w-full">
                <FuseAnimate animation="transition.slideRightIn" delay={300}>
                  <Typography className="normal-case flex items-center sm:mb-12" component={Link} role="button" to="/apps/calls/campaigns" color="inherit">
                    <Icon className="mr-4 text-20">arrow_back</Icon>
                    Giao việc
                  </Typography>
                </FuseAnimate>
                <div className="flex items-center max-w-full">

                  <div className="flex flex-col min-w-0">
                    <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                      <Typography className="text-16 sm:text-20 truncate">
                        Giao việc từ chiến dịch
                      </Typography>
                    </FuseAnimate>
                    <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                      <Typography variant="caption">Chi tiết giao việc</Typography>
                    </FuseAnimate>
                  </div>
                </div>
              </div>
              <div className = "el-SurveyEdit-Button">
                <FuseAnimate animation="transition.slideRightIn" delay={300}>
                  <Button
                    // component={Link} to="/apps/calls/campaigns"
                    className="whitespace-no-wrap"
                    color="secondary"
                    variant="contained"
                    disabled={!canBeSave()}
                    onClick={handleSubmit}
                  >
                    Lưu thông tin
                  </Button>
                </FuseAnimate>
              </div>
            </div>
          }
          content={
            <div className = "p-24" id = "el-CreateAssignmentFromCampaign-Content">
              <div className="el-block-report">
                <Typography className="pl-12 text-15 font-bold mb-10 block-tittle">THÔNG TIN CHIẾN DỊCH:</Typography>
                <div className='el-fillter-report-action'>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      Tên chiến dịch:
                    </Grid>
                    <Grid item xs={6}>
                      <div className = "font-bold el-GridWordWrap">
                        {callCampaign.name}
                      </div>
                    </Grid>
                    <Grid item xs={6}>
                      Thời gian bắt đầu - kết thúc:
                    </Grid>
                    <Grid item xs={6}>
                      <div className = "font-bold el-GridWordWrap">
                        {moment(callCampaign.startTime).format("DD/MM/YYYY") + " - " + moment(callCampaign.endTime).format("DD/MM/YYYY")}
                      </div>
                    </Grid>
                    <Grid item xs={6}>
                      Số điện thoại trong chiến dịch:
                    </Grid>
                    <Grid item xs={6}>
                      <div className = "font-bold el-GridWordWrap">
                        {displayPhones}
                      </div>
                    </Grid>
                  </Grid>
                </div>

              </div>
              <div className="w-full p-12 el-block-Call el-block-report">
                <Typography className="pl-12 text-15 font-bold mb-10 block-title">ĐỐI TƯỢNG NHẬN VIỆC:</Typography>
                <div>
                  {/* <FormControlLabel
                    className = "mb-8"
                    label = "Chọn tất cả đối tượng giao việc"
                    control={
                      <Checkbox
                    checked={all === true}
                    onChange={e => {setAll(!all); handleSetAll(e.target.checked === true ? true : false)}}
                    value="checkedB"
                    color="primary"
                      />
                    }
                  /> */}
                  <FuseChipSelect
                    onChange={(e) => handleChangeMember(e)}
                    placeholder="Chọn đối tượng giao việc"
                    isMulti
                    textFieldProps={{
                        label: 'Đối tượng giao việc (Bắt buộc)',
                      InputLabelProps: {
                          shrink: true
                      },
                        variant: 'outlined'
                    }}
                    options={listMember && listMember.map((item) => ({
                        value: item._id, label: item.base.fullName
                    }))}
                  />
                </div>

              </div>
            </div>
          }
        />
    )
}
export default CreateAssignmentFromCampaign;
