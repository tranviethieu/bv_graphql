import Page from "components/Page";
import React, { Fragment } from "react";
import { Button, Input, Col, Label, Form, FormGroup } from "reactstrap";
import { withApollo } from "react-apollo";
import authCheck from "utils/authCheck";
import gql from "graphql-tag";
import { Mutation, Query } from "react-apollo";
import ToggleButton from "react-toggle-button";
import { MdAdd } from 'react-icons/lib/md'
import showSlugModal from '../Slug/SlugModal'
import { ALL_SLUG_BY_TYPE } from 'GqlQuery'

export const QUERY_DETAIL = gql`
  query AdminQuery($_id: String) {
    menu(_id: $_id) {
      code
      message
      data{
        _id
        name
        level
        description
        path
        disable
        icon
        slug
        parentId
        sort
        isAdmin
      }
    }
  }
`;
export const MUTATION_CREATE_MENU = gql`
  mutation Mutation($menu: MenuAdminInputType) {
    createMenu(menu: $menu) {
      code
      message
      data{_id}
    }
  }
`;
export const MUTATION_EDIT_MENU = gql`
  mutation Mutation($menu: MenuAdminInputType) {
    updateMenu(menu: $menu) {
      code
      message
      data{_id}
    }
  }
`;
export const QUERY_LIST_MENU = gql`
query AdminQuery($path:String!){
    response:menus(pageSize:0,filtered:[{id:"path",value:$path}],sorted:[{id:"level",desc:false}]){
      code
      message
      data{
        name
        _id
        level
        slug
      }
    }
  }
`;

class MenuEditPage extends React.Component {
  constructor() {
    super();
    this.state = {
      _id: "",
      slug: "",
      name: "",
      level: 1,
      description: "",
      path: "",
      sort: 1,
      disable: false,
      icon: "",
      isAdmin: false,
      slugs: [],
      parents: []
    };
  }

  fetchAllMenu = () => {
    this.props.client.query({
      query: QUERY_LIST_MENU,
      variables:{path:"#"}
    }).then(result => {
      if (authCheck(result.data.response)) {
        var parents=result.data.response.data.sort((a,b)=>{
          return a.slug>b.slug?1:a.slug<b.slug?-1:(a.name>b.name?1:-1)
        })
        this.setState({ parents: parents })
      }
    })
  }
  fetchSlug = () => {
    this.props.client.query({
      query: ALL_SLUG_BY_TYPE,
      variables: { type: "project" }
    }).then(result => {
      if (authCheck(result.data.response)) {
        this.setState({ slugs: result.data.response.data });
      }
    })
  }
  componentDidMount() {
    this.fetchSlug();
    this.fetchAllMenu();
    const _id = this.props.match.params._id;
    if (_id && _id.length > 0) {
      try {
        this.props.client
          .query({
            query: QUERY_DETAIL,
            variables: { _id: _id }
          })
          .then(result => {
            authCheck(result);
            var menu = result.data.menu.data;
            if (menu !== null) {
              this.setState(menu);
            }
          });
      } catch (err) {
        authCheck(err);
      }
    }
  }
  createOrUpdate = mutation => { };
  onCancel = () => {
    this.props.history.push("/menu");
  };
  render = () => {
    const { _id, icon, isAdmin, disable, slug, slugs, name, description, level, parentId, path, sort, parents } = this.state;
    return (
      <Page
        title="Quản trị menu"
        breadcrumbs={[{ name: "Quản trị Menu", active: true }]}
        className="CompanyPage"
      >
        <Form className="m-4">
          <FormGroup row>
            <Label md={3} sm={5} className="text-right">
              Disable
            </Label>
            <Col md={6} sm={7}>
              <ToggleButton
                value={disable}
                onToggle={value => {
                  this.setState({ disable: !disable });
                }}
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label md={3} sm={5} className="text-right">
              IsAdmin
            </Label>
            <Col md={6} sm={7}>
              <ToggleButton
                value={isAdmin}
                onToggle={value => {
                  this.setState({ isAdmin: !value });
                }}
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label md={3} sm={5} className="text-right">
              Tên Menu
            </Label>
            <Col md={6} sm={7}>
              <Input
                value={name}
                onChange={e => {
                  this.setState({ name: e.target.value });
                }}
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label md={3} sm={5} className="text-right">
              Đường dẫn
            </Label>
            <Col md={6} sm={7}>
              <Input
                value={path}
                onChange={e => this.setState({ path: e.target.value })}
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label md={3} sm={5} className="text-right">
              Menu cha
            </Label>
            <Col md={6} sm={7}>
              <Input
                value={parentId}
                onChange={e => this.setState({ parentId: e.target.value })}
                type="select"
              >
                <option value="">Menu gốc</option>
                {
                  parents.map((item, index) => <option key={index} value={item._id}>
                    {item.slug}: {item.name.toUpperCase()} - lv {item.level}
                  </option>)
                }
              </Input>
            </Col>
          </FormGroup>
        <FormGroup row>
          <Label md={3} sm={5} className="text-right">
            Icon
            </Label>
          <Col md={6} sm={7}>
            <Input
              type="select"
              value={icon}
              onChange={e => this.setState({ icon: e.target.value })}
            >
              <option value="">No Icon</option>
              <option value="MdBusiness">MdBusiness</option>
              <option value="MdCall">MdCall</option>
              <option value="MdMultilineChart">MdMultilineChart</option>
              <option value="MdSystemUpdate">MdSystemUpdate</option>
              <option value="MdKeyboardArrowDown">MdKeyboardArrowDown</option>
              <option value="MdExitToApp">MdExitToApp</option>
              <option value="MdVerifiedUser">MdVerifiedUser</option>
              <option value="MdSettings">MdSettings</option>
              <option value="MdAccountCircle">MdAccountCircle</option>
              <option value="MdEmail">MdEmail</option>
              <option value="MdWork">MdWork</option>
              <option value="MdHome">MdHome</option>
              <option value="icon_dichvu">Icon Dịch vụ</option>
              <option value="icon_report">Icon Report</option>
              <option value="icon_thongke">Icon Thống kê</option>
              <option value="icon_customer">Icon Khách hàng</option>
              <option value="icon_employee">Icon Nhân viên</option>
              <option value="icon_notification">Icon Thông báo</option>
              <option value="icon_location">Icon Vị trí</option>
              <option value="icon_money">Icon Tiền</option>
              <option value="icon_warning">Icon Cảnh báo</option>
              <option value="icon_working">Icon Công việc</option>
              <option value="icon_coupon">Icon Khuyến mãi</option>
              <option value="icon_news">Icon Tin tức</option>
            </Input>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label md={3} sm={5} className="text-right">
            Cấp độ
            </Label>
          <Col md={6} sm={7}>
            <Input
              type="select"
              value={level}
              onChange={e => this.setState({ level: e.target.value })}
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </Input>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label md={3} sm={5} className="text-right">
            Thứ tự
            </Label>
          <Col md={6} sm={7}>
            <Input
              type="select"
              value={sort}
              onChange={e => this.setState({ sort: e.target.value })}
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
            </Input>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label md={3} sm={5} className="text-right">
            Ghi chú
            </Label>
          <Col md={6} sm={7}>
            <Input
              value={description}
              onChange={e => this.setState({ description: e.target.value })}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label md={3} sm={5} className="text-right">
            Dự án
            </Label>
          <Col md={6} sm={7}>
            <Input
              value={slug}
              type="select"
              onChange={e => this.setState({ slug: e.target.value })}
            >
              <option value="">
                Chọn dự án
                  </option>
              {
                slugs.map((item, index) => <option key={index} value={item.name}>
                  {item.name}
                </option>)
              }
            </Input>
          </Col>
          <Col>
            <Button color="success" style={{ fontSize: 15 }} onClick={e => showSlugModal("Thêm Tên dự án", { type: "project-menu" }).then(result => { slugs.splice(0, 0, result); this.setState({ slug: result.name, slugs }) })}><MdAdd /></Button>
          </Col>
        </FormGroup>

        <FormGroup row>
          <Label md={3} sm={5} />
          <Col md={6} sm={7}>
            <Mutation
              mutation={
                _id === undefined || _id.length === 0
                  ? MUTATION_CREATE_MENU
                  : MUTATION_EDIT_MENU
              }
              variables={{
                menu: { _id, slug, name, path, description, icon, disable, level, parentId, sort, isAdmin }
              }}
              onCompleted={result => {
                this.onCancel();
              }}
            >
              {mutation => (
                <Button color="primary" onClick={mutation}>
                  Cập nhật thông tin
                  </Button>
              )}
            </Mutation>

            <Button color="link" onClick={this.onCancel}>
              Hủy
              </Button>
          </Col>
        </FormGroup>
        </Form>
      </Page >
    );
  };
}
export default withApollo(MenuEditPage);
