import Page from "components/Page";
import React from "react";
import { Input, Row, Col, Label, Form, FormGroup, Card, CardBody, CardHeader } from "reactstrap";
import { withApollo, Mutation } from "react-apollo";
import authCheck from "utils/authCheck";
import showSlugModal from '../Slug/SlugModal'
import { QUERY_DEPARTMENTS, QUERY_ACCOUNT, QUERY_PROJECTS, MUTATION_EDIT, MUTATION_CREATE, MUTATION_REMOVE_ROLE, DELETE_ACCOUNT } from './query';
import "react-checkbox-tree/lib/react-checkbox-tree.css"
import ToggleButton from 'react-toggle-button';
import confirm from 'components/Confirmation';
import ReactTable from "react-table";
import Select from 'react-select';
import UploadFileForm from 'components/Widget/UploadImageForm'
import ShowRoleModal from './AccountRoleModal';
import { Button, IconButton, Typography } from '@material-ui/core';
import AddBoxIcon from '@material-ui/icons/AddBox';

import {
  MdDelete

} from "react-icons/lib/md";
import moment from "moment";


class AccountEditPage extends React.Component {
  constructor() {
    super();
    this.state = {
      name: "",
      title: "",
      titleId: "",
      fullName: "",
      departmentId: "",
      work: "",
      email: "",
      phoneNumber: "",
      avatar: null,
      gender: "",
      identity: "",
      address: "",
      mariaged: false,
      birthday: new Date(),
      description: "",
      claims: { admin: false },
      passwordHash: "",
      title: "",
      userName: "",
      titleId: "",
      root: false,
      departments: [],
      isEdit: false,
      projects: [],
      roles: [],
      isRoot: false,
      isActive: true,
      code: ''
    };
    this.handleUpdateFiles = this.handleUpdateFiles.bind(this);
  }
  componentDidMount() {
    this.fetchDetail(this.props.match.params._id);
    this.fetchDepartment();
    this.fetchProject();
  }
  onRemoveRole = (id) => {
    this.props.client.mutate({
      mutation: MUTATION_REMOVE_ROLE,
      variables: { _id: id }
    }).then(result => {
      if (authCheck(result.data.response)) {
        //remove from list
        const newRoles = this.state.roles.filter(role => (role._id !== id));
        this.setState({ roles: newRoles });
      }
    })
  }
  onCancel = () => {
    this.props.history.goBack();
  };
  fetchProject = () => {
    this.props.client.query({
      query: QUERY_PROJECTS
    }).then(result => {
      this.setState({ projects: result.data.response.data });
    })
  }
  fetchDetail = (_id) => {
    if (_id && _id.length > 0) {
      this.props.client
        .query({
          query: QUERY_ACCOUNT,
          variables: { _id }
        })
        .then(result => {
          console.log("get account response:", result.data.response);
          if (authCheck(result.data))

            this.setState({ isEdit: true, ...result.data.response.data });
        });
    }
  }
  fetchDepartment = () => {
    this.props.client.query({
      query: QUERY_DEPARTMENTS
    }).then(result => {
      if (authCheck(result.data.response)) {
        this.setState({ departments: result.data.response.data })
      }
    })
  }
  submit = () => {
    const {
      _id,
      avatar,
      passwordHash,
      userName,
      email,
      gender,
      birthday,
      mariaged,
      work,
      departmentId,
      address,
      isActive,
      title,
      fullName,
      phoneNumber,
      isEdit,
      isRoot,
      code
    } = this.state;
    this.props.client.mutate({
      mutation: isEdit === true ? MUTATION_EDIT : MUTATION_CREATE,
      variables: {
        account: {
          _id,
          avatar,
          passwordHash,
          email,
          code,
          userName,
          gender,
          birthday,
          mariaged,
          work,
          departmentId,
          address,
          title,
          fullName,
          phoneNumber,
          isRoot,
          isActive
        }
      }
    }).then(result => {
      if (authCheck(result.data.response)) {
        confirm("Cập nhật thành công").then(_ => this.onCancel());
      }
    })
  }
  onAddRole = (newroles) => {
    const { roles } = this.state;
    var _roles = roles.concat(newroles);
    this.setState({ roles: _roles });
  }
  handleUpdateFiles(serverId) {
    try {

      this.setState({
        avatar: serverId
      })
    } catch (err) {
      console.log(err);
    }
  }
  canBeDeleted = () => {
    return this.state._id
  }
  handleDelete = () => {
    confirm("Tài khoản bị xóa sẽ không thể đăng nhập vào các dự án liên kết với hệ thống tài khoản hiện tại.Vui lòng nhấn XÁC NHẬN để thực hiện hành động", { title: `Xóa tài khoản ${this.state.userName}?`, oklabel: "XÁC NHẬN", count: 3 }).then(() => {
      this.props.client.mutate({
        mutation: DELETE_ACCOUNT,
        variables: { _id: this.state._id }
      }).then(result => {
        if (result.data.response.code == 0) {
          confirm('Xóa tài khoản thành công', { oklabel: "Đóng", hideCancel: true }).then(() => this.props.history.goBack())
        } else {
          confirm(result.data.response.message, { hideCancel: true, title: "Không thành công", oklabel: "Đóng" })
        }
      })
    })
  }

  handleRoleClick = (id) => {
    if (!id) {
      confirm("Chức năng này yêu cầu tạo tài khoản trước.", { hideCancel: true });
      return;
    }

    ShowRoleModal({ accountId: id, success: this.onAddRole })
  }

  render = () => {
    const {
      _id,
      userName,
      avatar,
      passwordHash,
      email,
      isRoot,
      gender,
      birthday,
      mariaged,
      work,
      isActive,
      code,
      departmentId,
      address,
      title,
      fullName,
      phoneNumber,
      departments,
      roles
    } = this.state;

    return (
      <div className='block-table-content'>
        <Page
          title="Chi tiết Account"
          breadcrumbs={[{ name: "Chi tiết Account", active: true }]}
          className="Account"
        >
          <div className='top-btn'>
            <Button className='btn-red' variant='contained' disabled={!this.canBeDeleted()} onClick={this.handleDelete}>
              XÓA
            </Button>
          </div>
          <div className='fix-bottom-right'>


            {" "}
            <Button onClick={this.onCancel} className='m-10'>
              QUAY LẠI
            </Button>
            <Button onClick={this.submit} className='btn-green m10' variant='contained'>
              CẬP NHẬT THÔNG TIN
            </Button>

          </div>

          <Row>
            <Col md={6}>
              <Card>
                <CardHeader>
                  Thông tin cơ bản
                </CardHeader>
                <CardBody>
                  <FormGroup row>
                    <Label md={3} className="text-right">
                      Mã nhân viên:
                    </Label>
                    <Col md={9}>
                      <Input
                        type="text"
                        value={code || ''}
                        bsSize="sm"
                        onChange={e => {
                          this.setState({ code: e.target.value });
                        }}
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label md={3} className="text-right">
                      Tên đăng nhập:
                    </Label>
                    <Col md={9}>
                      <Input
                        type="text"
                        value={userName || ''}
                        onChange={e => {
                          this.setState({ userName: e.target.value });
                        }}
                        bsSize="sm"
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label md={3} className="text-right">
                      Mật khẩu:
                    </Label>
                    <Col md={9}>
                      <Input
                        type="password"
                        value={passwordHash || ''}
                        placeholder="*******"
                        onChange={e => {
                          this.setState({ passwordHash: e.target.value });
                        }}
                        bsSize="sm"
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label md={3} className="text-right">
                      Họ và Tên:
                    </Label>
                    <Col md={9}>
                      <Input
                        type="text"
                        value={fullName || ''}
                        onChange={e => {
                          this.setState({ fullName: e.target.value });
                        }}
                        bsSize="sm"
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label md={3} className="text-right">
                      Email:
                    </Label>
                    <Col md={9}>
                      <Input
                        type="text"
                        value={email || ''}
                        onChange={e => {
                          this.setState({ email: e.target.value });
                        }}
                        bsSize="sm"
                      />
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Label md={3} className="text-right">
                      Số điện thoại:
                    </Label>
                    <Col md={9}>
                      <Input
                        type="text"
                        value={phoneNumber || ''}
                        onChange={e => {
                          this.setState({ phoneNumber: e.target.value });
                        }}
                        bsSize="sm"
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label md={3} className="text-right">
                      Ngày sinh
                    </Label>
                    <Col md={9}>
                      <Input bsSize="sm" type="date" value={moment(birthday).format('YYYY-MM-DD')} onChange={e => { this.setState({ birthday: e.target.value }) }} />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label md={3} className="text-right">Giới tính</Label>
                    <Col md={9}>
                      <Input type="select" value={gender || ''} onChange={e => { this.setState({ gender: e.target.value }) }}>
                        <option value="">Chọn</option>
                        <option value="1">Nam</option>
                        <option value="2">Nữ</option>
                      </Input>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label md={3} className="text-right">Đã lập gia đình</Label>
                    <Col md={9}>
                      <ToggleButton value={mariaged} onToggle={e => { this.setState({ mariaged: !e }) }} />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label md={3} className="text-right">Địa chỉ</Label>
                    <Col md={9}>
                      <Input value={address || ''} onChange={e => { this.setState({ address: e.target.value }) }} />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label md={3} className="text-right">
                      Chức danh:
                    </Label>
                    <Col md={9}>
                      <Input placeholder="BS/YT/GĐ" value={title} onChange={e => this.setState({ title: e.target.value })} />
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Label md={3} className="text-right">
                      Khoa:
                    </Label>
                    <Col md={9}>
                      <div style={{ display: "flex" }}>
                        <Input
                          type="select"
                          value={departmentId || ''}
                          onChange={e => {
                            this.setState({ departmentId: e.target.value });
                          }}
                          bsSize="sm"
                        >
                          <option>Chọn khoa/phòng</option>
                          {
                            departments.map((item, index) => <option key={index} value={item._id}>
                              {item.name}
                            </option>)
                          }
                        </Input>
                        <Button size="sm" color="success" style={{ fontSize: "14px", marginLeft: "5px" }} onClick={e => {
                          showSlugModal("Thêm phòng/ban", { type: "department" }).then(result => {
                            if (result !== null) {
                              departments.splice(0, 0, result);
                              this.setState({ department: result.value, departments })
                            }
                          })
                        }}><AddBoxIcon className="color-green m-1" style={{ fontSize: 20 }} /></Button>
                      </div>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label md={3} className="text-right">
                      Chức vụ:
                    </Label>
                    <Col md={9}>
                      <Input
                        type="text"
                        value={work || ''}
                        onChange={e => {
                          this.setState({ work: e.target.value });
                        }}
                        bsSize="sm"
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label md={3} className="text-right">
                      Avatar
                    </Label>
                    <Col md={9}>
                      <UploadFileForm server={process.env.REACT_APP_UPLOADURL} onUpdateFiles={this.handleUpdateFiles} files={avatar && avatar !== null && avatar != "" && [{ source: avatar, options: { type: "local" } }]} allowMultiple={false} maxFiles={1} />
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Label md={3} className="text-right">Quyền quản trị</Label>
                    <Col md={9}>
                      <ToggleButton value={isRoot} onToggle={e => { this.setState({ isRoot: !e }) }} />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label md={3} className="text-right">Trạng thái</Label>
                    <Col md={9}>
                      <ToggleButton value={isActive} onToggle={e => { this.setState({ isActive: !e }) }} />
                    </Col>
                  </FormGroup>
                </CardBody>
              </Card>

            </Col>
            <Col md={6}>
              <Card>
                <CardHeader>
                  <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between" }}>
                    <Typography style={{ paddingTop: 15 }}>Quyền truy cập dự án</Typography>
                    <IconButton onClick={e => this.handleRoleClick(_id)}><AddBoxIcon className="color-green m-1" style={{ fontSize: 25 }} /></IconButton>
                  </div>
                </CardHeader>
                <CardBody>
                  <ReactTable
                    data={roles}
                    showPagination={false}
                    filterable
                    pageSize={roles.length < 3 ? 3 : roles.length}
                    columns={[
                      {
                        Header: "Dự án",
                        accessor: "project._id",
                        Filter: ({ filter, onChange }) =>

                          <Select
                            value={this.state.projectFilter}
                            onChange={e => { this.state.projectFilter = e; onChange(e !== null ? e.value : "") }}
                            options={this.state.projects.map((item) => { return { value: item._id, label: item.name } })}
                            placeholder={"Tìm dự án"}
                            isClearable={true}
                            menuPlacement="auto"
                            menuPosition="fixed"
                          />,
                        Cell: row => <div>{row.original.project == null ? "Hệ thống dự án tổng" : row.original.project.name}</div>
                      },
                      {
                        Header: "Quyền",
                        accessor: "role",
                        Filter: ({ filter, onChange }) => <Input type="select" value={filter && filter.value} onChange={e => onChange(e.target.value)}>
                          <option value="">Chọn quyền</option>
                          <option value="Basic">Cơ bản</option>
                          <option value="Admin">Quản trị dự án</option>
                        </Input>,
                        Cell: row => <div>
                          {row.value == 'Admin' ? "Quản trị dự án" : "Cơ bản"}
                        </div>
                      },
                      {
                        width: 60,
                        filterable: false,
                        Cell: row => <Button onClick={e => this.onRemoveRole(row.original._id)} color="danger" size="sm">
                          <MdDelete />
                        </Button>
                      }
                    ]}
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Page>
      </div>
    );
  };
}
export default withApollo(AccountEditPage);
