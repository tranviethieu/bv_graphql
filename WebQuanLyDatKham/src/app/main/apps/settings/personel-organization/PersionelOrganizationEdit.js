import React, { useEffect, useState } from 'react';
import { Button, TextField, Icon, Typography, FormControl, InputLabel, Select } from '@material-ui/core';
import { FuseAnimate, FusePageCarded } from '@fuse';
import { useForm } from '@fuse/hooks';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
// import QuestionListItem from './components/QuestionListItem';
import * as Actions from './store/actions';
import { showMessage } from 'app/store/actions'
import history from '@history';
import ConfirmDialog from '@fuse/components/Confirm/ConfirmDialog';

const initialPersonel = {
  parentId: null,
  description: '',
  name: '',
  _id: null
}
function PersionelOrganizationEdit(props) {
    const dispatch = useDispatch();
    const { form, handleChange, setInForm } = useForm(initialPersonel);
    const [confirm, setConfirm] = useState(false);
    const [parentList, setParentList] = useState([])

    useEffect(()=>{
        const _id = props.match.params._id;
          if(_id){
            Actions.getPersonel(_id, dispatch).then(response =>{
                setInForm('parentId', response.data.parentId)
                setInForm('description', response.data.description)
                setInForm('_id', response.data._id)
                setInForm('name', response.data.name)
            });
          }
    }, [dispatch, props.match.params, setInForm])
  useEffect(() => {
    Actions.getPersonels({ sorted: [{id: "level", desc: false}]}).then(response =>{
        if(response.code === 0){
          setParentList(response.data)
        }
        else{
          setParentList([])
        }
      })
    }, [])
    function handleSubmit() {
        Actions.savePersonel(form).then(response => {
          if(response.code === 0){
                dispatch(showMessage({ message: "Lưu thông tin ban/tổ chức hành chính thành công" }))
                history.goBack();
          }
        })
    }
    function handleParentChange(e){
      setInForm('parentId', e)
    }
    function canBeSave() {
        return (
            form && form.name && form.name.length > 0
        )
    }
    function canBeRemove() {
        return (
            form && form._id
        )
    }

    function onDelete (){
        Actions.removePersonel(form._id).then(response => {
          if(response.code === 0){
                dispatch(showMessage({ message: "Xóa tổ chức thành công" }))
                history.goBack();
          }
        })
        setConfirm(false);
    }
    return (
        <FusePageCarded
          classes={{
            toolbar: "p-0",
            header: "min-h-72 h-72 sm:h-136 sm:min-h-136"
          }}
          header={
            form && (
              <div className="flex flex-1 w-full items-center justify-between el-HeaderPage" id = "el-Personel-HeaderPage">
                <div className="flex flex-col items-start max-w-full">
                  <FuseAnimate animation="transition.slideRightIn" delay={300}>
                    <Typography className="normal-case flex items-center sm:mb-12" component={Link} role="button" to="/apps/personel-organizations" color="inherit">
                      <Icon className="mr-4 text-20">arrow_back</Icon>
                      Tổ chức hành chính
                    </Typography>
                  </FuseAnimate>
                  <div className="flex items-center max-w-full">

                    <div className="flex flex-col min-w-0">
                      <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                        <Typography className="text-16 sm:text-20 truncate">
                          {form.name ? form.name : 'Tạo tổ chức hành chính'}
                        </Typography>
                      </FuseAnimate>
                      <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                        <Typography variant="caption">Chi tiết tổ chức hành chính</Typography>
                      </FuseAnimate>
                    </div>
                  </div>
                </div>
                <div className = "el-SurveyEdit-Button">
                  <FuseAnimate animation="transition.slideRightIn" delay={300}>
                    <Button
                      className="whitespace-no-wrap btn-red"
                      variant="contained"
                      disabled={!canBeRemove()}
                      onClick = {()=>setConfirm(true)}
                    >
                      Xóa
                    </Button>
                  </FuseAnimate>
                  {" "}
                  <FuseAnimate animation="transition.slideRightIn" delay={300}>
                    <Button
                      // component={Link} to="/apps/personel-organizations"
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
            )
          }
          content={
            <div className="p-12" id = "el-Personel-Content">
              <ConfirmDialog
                title="Xóa tổ chức hành chính?"
                open={confirm}
                onClose={()=>setConfirm(false)}
                onSubmit={onDelete}
                message="Bạn có chắc chắn muốn xóa tổ chức hành chính hiện tại"
                count={5}
              />
              <div className="p-16 sm:p-24" id = "el-Personel-Info">
                <div>
                  <FormControl variant="outlined" className = "w-full">
                    <InputLabel htmlFor="outlined-age-native-simple">Tổ chức cấp trên</InputLabel>
                    <Select
                      native
                      className="mt-8 mb-16"
                      value={form.parentId}
                      inputProps={{
                        name: 'parentId',
                        id: 'outlined-age-native-simple',
                      }}
                      onChange={e => handleParentChange(e.target.value)}
                    >
                      <option value= {null}>Không có tổ chức cấp trên</option>
                      {
                        parentList && parentList.length > 0 && parentList.map((item, index) =>
                          <option value={item._id}>{item.name} (cấp {item.level}) ({item.children.length} cấp dưới)</option>
                        )
                      }
                    </Select>
                  </FormControl>
                  <TextField
                    className="mt-8 mb-16"
                    error={form.name === '' || form.name === null}
                    required
                    label="Tên tổ chức hành chính"
                    autoFocus
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    onInput = {(e) =>{
                      e.target.value = e.target.value.replace(/[^0-9a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồố&!ộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ,-/.\s]/gi, '')
                    }}
                    variant="outlined"
                    fullWidth
                  />
                  <TextField
                    className="mt-8 mb-16"
                    label="Mô tả"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    onInput = {(e) =>{
                      e.target.value = e.target.value.replace(/[^0-9a-zàáạảãâầấậẩẫăằắặẳẵèéẹ&ẻẽêềếệểễìí!ịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ,-/.\s]/gi, '')
                    }}
                    variant="outlined"
                    fullWidth
                  />

                </div>

              </div>
            </div>
          }
        />
    )
}
export default PersionelOrganizationEdit;
