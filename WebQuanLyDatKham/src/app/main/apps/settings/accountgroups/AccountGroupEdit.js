import React, { useEffect, useState, useMemo } from 'react';
import { Button, TextField, Icon, Typography, Card, CardHeader, CardContent, IconButton, Checkbox } from '@material-ui/core';
import { FuseAnimate, FusePageCarded, FuseChipSelect } from '@fuse';
import _ from '@lodash';
import { useForm } from '@fuse/hooks';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import * as Actions from './actions';
import { showMessage } from 'app/store/actions'
import history from '@history';
import ConfirmDialog from '@fuse/components/Confirm/ConfirmDialog';

const initialPersonel = {
  name: '',
  description: '',
  // departmentId: '',
  permissions: []
}
function AccountGroupEdit(props) {
  const dispatch = useDispatch();
  const { form, handleChange, setForm, setInForm } = useForm(initialPersonel);
  const [namedApi, setNamedApi] = useState({});//api đã được convert sang kiểu dictionary để hiern thị được tên tiếng việt
  const [menus, setMenus] = useState([]);
  const [confirm, setConfirm] = useState(false);
  const [permissions, setPermissions] = useState([]);
  const [checkAll, setCheckAll] = useState(false);
  const [textSearch, setTextSearch] = useState('');

  useEffect(() => {
    const _id = props.match.params._id;
    switch (_id) {
      case 'new':
        const parentId = props.match.params.parentId;
        if (parentId) {
          setInForm('parentId', parentId)
        }
        break;
      default:
        if (_id)
          Actions.get(_id, dispatch).then(response => {
            setForm(response.data);
          });
    }
  }, [dispatch, props.match.params, setInForm])
  useEffect(() => {
    Actions.allMenu(dispatch).then(response => {
      setMenus(response.data);
    })
    Actions.allPermission(dispatch).then(response => {
      const namedApi = {};
      response.data.forEach(function (item) {
        namedApi[item.permission] = item.title;
      });
      setNamedApi(namedApi);
      setPermissions(response.data);
    });

  }, [])
  function handleSubmit() {
    Actions.save(form).then(response => {
      if (response.code === 0) {
        dispatch(showMessage({ message: "Lưu thông tin ban/tổ chức hành chính thành công" }))
        history.goBack();
      }
    })
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
  function handlePermissionChange(permission, checked) {
    console.log("handler permisison change")
    if (checked) {
      form.permissions.push(permission);
    } else {
      form.permissions = form.permissions.filter(p => p !== permission);
    }
    setInForm("permissions", [...form.permissions]);
  }
  function handleCheckAllMenu(menu, checked) {
    if (checked) {
      const newPermissions = form.permissions.concat(menu.permissions).filter((value, index, self) => self.indexOf(value) === index);
      setInForm("permissions", newPermissions);
    } else {
      const permissions = _.union(menu.permissions, menu.subPermissions);
      const newPermissions = form.permissions.filter((value) => (permissions.indexOf(value) < 0));
      setInForm("permissions", newPermissions);
    }
  }
  function handleCheckAll(checked) {
    if (checked) {
      setInForm("permissions", permissions.map(p => p.permission));
    } else {
      setInForm("permissions", []);
    }
  }
  function isUnCheck(menu) {
    return menu.permissions.some(p => form.permissions.indexOf(p) < 0);
  }

  function onDelete() {
    Actions.remove(form._id, dispatch).then(response => {
      if (response.code === 0) {
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
          <div className="flex flex-1 w-full items-center justify-between el-HeaderPage" id="el-Personel-HeaderPage">
            <div className="flex flex-col">
              <div className="flex items-center mb-4">
                <Icon className="text-18 el-TitleIcon" color="action">home</Icon>
                <Icon className="text-16 el-TitleIcon" color="action">chevron_right</Icon>
                <Typography color="textSecondary">Thiết lập</Typography>
                <Icon className="text-16 el-TitleIcon" color="action">chevron_right</Icon>
                <Typography color="textSecondary">Nhóm tài khoản</Typography>
              </div>
              <FuseAnimate>
                <Typography variant="h6">Tạo nhóm tài khoản</Typography>
              </FuseAnimate>
            </div>
            <div className="el-SurveyEdit-Button">
              <FuseAnimate animation="transition.slideRightIn" delay={300}>
                <Button
                  className="whitespace-no-wrap btn-red"
                  variant="contained"
                  disabled={!canBeRemove()}
                  onClick={() => setConfirm(true)}
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
        <div className="p-12" id="el-Personel-Content">
          <ConfirmDialog
            title="Xóa nhóm tài khoản?"
            open={confirm}
            onClose={() => setConfirm(false)}
            onSubmit={onDelete}
            message="Bạn có chắc chắn muốn xóa nhóm tài khoản hiện tại"
            count={5}
          />
          <div className="p-16 sm:p-24" id="el-Personel-Info">
            <div>
              {useMemo(() =>
                <TextField
                  className="mt-8 mb-16"
                  error={form.name === '' || form.name === null}
                  required
                  label="Tên nhóm tài khoản"
                  autoFocus
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                />, [form.name]
              )}

              {useMemo(() =>
                <TextField
                  className="mt-8 mb-16"
                  label="Mô tả"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                />, [form.description]
              )}
              <div className="flex flex-row px-8">
                <div>
                  <Checkbox checked={checkAll === true} onChange={e => { handleCheckAll(e.target.checked); setCheckAll(!checkAll) }} />
                  <label>{checkAll === true ? "Bỏ chọn tất cả" : "Chọn tất cả"}</label>
                </div>
                <div>
                  <TextField
                    placeholder="Tìm theo tên menu"
                    value={textSearch}
                    onChange={e => setTextSearch(e.target.value)}
                    inputProps={{
                      'aria-label': 'Search'
                    }}
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                </div>
              </div>

            </div>
            {
              useMemo(() =>
                <div>
                  {
                    textSearch && menus && menus.filter(m=>m.name.toLowerCase().indexOf(textSearch.toLowerCase())>=0||(m.permissions&&m.permissions.find(p=>p.toLowerCase().indexOf(textSearch.toLowerCase())>=0))).map((menu, index) =>
                      <Card key={index} className="mt-8 text-14 p-8">
                        <CardHeader
                          title={<Typography className="text-16">{menu.fullName}</Typography>}
                          className="px-16 py-2"
                          action={
                            <div>
                              {isUnCheck(menu) ?
                                <IconButton aria-label="more" onClick={() => handleCheckAllMenu(menu, true)}>
                                  <Icon>check_box_outline_blank</Icon>
                                </IconButton> :

                                <IconButton aria-label="more" onClick={() => handleCheckAllMenu(menu, false)}>
                                  <Icon>check_box</Icon>
                                </IconButton>
                              }

                            </div>
                          }
                        />
                        <CardContent className="flex flex-wrap">
                          {
                            _.union(menu.permissions, menu.subPermissions).map((permission, pindex) =>
                              <div>
                                <Checkbox value={permission} checked={form.permissions.includes(permission)} onChange={e => handlePermissionChange(permission, e.target.checked)} />
                                <label>{namedApi[permission]}</label>
                              </div>
                            )
                          }
                        </CardContent>
                      </Card>
                    )
                  }
                </div>, [menus, form.permissions,textSearch])
            }



          </div>
        </div>
      }
    />
  )
}
export default AccountGroupEdit;
