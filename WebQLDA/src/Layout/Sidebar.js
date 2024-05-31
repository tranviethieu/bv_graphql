import React from "react";
import { GetLocalToken,GetProfile } from "Constants";
import { withApollo } from "react-apollo";
import authCheck from 'utils/authCheck';
import * as iconLib from 'assets/img/icon';


import {
  MdKeyboardArrowDown,
  MdExitToApp,
  MdVerifiedUser,
  MdSettings,
  MdAccountCircle,
  MdEmail,
  MdMultilineChart,
  MdWork,
  MdHome,
  MdSystemUpdate,
  MdCall,
  MdBusiness,

} from "react-icons/lib/md";

import { NavLink } from "react-router-dom";
import {
  // UncontrolledTooltip,
  Collapse,
  Nav,
  NavItem,
  NavLink as BSNavLink
} from "reactstrap";
import bn from "utils/bemnames";

export const icon_style={
  width:24,
  height:24,
  marginTop:-3,
  marginRight:10
}
export const svgicon_style={
  marginTop:-3,
  marginRight:5,
  marginLeft:5
}

const IconTranslate = ({ icon, ...restProps }) => {

  switch (icon) {
    case "MdBusiness":
      return <MdBusiness className={bem.e("nav-item-icon")}  style={svgicon_style}/>;
    case "MdCall":
      return <MdCall className={bem.e("nav-item-icon")} style={svgicon_style}/>;
    case "MdMultilineChart":
      return <MdMultilineChart className={bem.e("nav-item-icon")}  style={svgicon_style} />;
    case "MdSystemUpdate":
      return <MdSystemUpdate className={bem.e("nav-item-icon")}  style={svgicon_style} />;
    case "MdKeyboardArrowDown":
      return <MdKeyboardArrowDown className={bem.e("nav-item-icon")}  style={svgicon_style} />;
    case "MdExitToApp":
      return <MdExitToApp className={bem.e("nav-item-icon")}  style={svgicon_style} />;
    case "MdVerifiedUser":
      return <MdVerifiedUser className={bem.e("nav-item-icon")}  style={svgicon_style} />;
    case "MdSettings":
      return <MdSettings className={bem.e("nav-item-icon")}  style={svgicon_style} />;
    case "MdAccountCircle":
      return <MdAccountCircle className={bem.e("nav-item-icon")}  style={svgicon_style} />;
    case "MdEmail":
      return <MdEmail className={bem.e("nav-item-icon")}  style={svgicon_style} />;
    case "MdWork":
      return <MdWork className={bem.e("nav-item-icon")} style={svgicon_style} />;
    case "MdHome":
      return <MdHome className={bem.e("nav-item-icon")}  style={svgicon_style} />;
    default:
      return <img src={iconLib[icon]} style={icon_style}/>;
  }
};

const navSettings = [
  { to: '/profile', name: 'Tài khoản', exact: false, icon: MdVerifiedUser },
  // {to:'/setting', name: 'Cài đặt',exact:false,Icon: MdSettings},
  { to: '/login', name: 'Đăng xuất', exact: false, icon: MdExitToApp },
]
const navAdmins=[
  { to: '/home', name: 'Dự án', exact: false, icon: "MdHome" },
  { to: '/project', name: 'Quản lý dự án', exact: false, icon: "MdWork" },
  { to: '/department', name: 'Quản lý phòng ban', exact: false, icon: "MdBusiness" },
  { to: '/account', name: 'Quản lý tài khoản', exact: false, icon: "MdVerifiedUser" },
]
const navBasics=[
  { to: '/', name: 'Trang chủ', exact: false, icon: "MdBusiness" },
]
const bem = bn.create("sidebar");

class Sidebar extends React.Component {
  state = {

    menu: []
  };
  token = {};
  constructor(props) {
    super();
    this.token = GetLocalToken();
  }
  handleClick = name => () => {
    this.setState(prevState => {
      const isOpen = prevState[`isOpen${name}`];

      //close all others
      const currentState = {};
      if (!isOpen) {
        navSettings.forEach(function (menu) {
          if (menu !== name) {

            currentState[`isOpen${menu}`] = false;
          }
        })
      }
      currentState[`isOpen${name}`] = !isOpen
      return currentState;

    });

  };
  componentDidMount() {
    
    var profile = GetProfile();
    console.log(profile.roles);
    var isAdmin=profile.roles&&profile.roles.filter((item,index)=>{
      return (item.projectId==""||item.projectId===null)&&item.role=="Admin";
    })

    if(isAdmin.length>0||profile.isRoot){
      this.setState({menu:navAdmins})
    }else
      this.setState({menu:navBasics})
  }
  toggleSideBar = () => {
    document.querySelector(".cr-sidebar").classList.toggle("cr-sidebar--open");
  };
  render() {
    return (
      <aside className={bem.b()  + ' el-sidebar'} style={{paddingTop:10}}>
        <div className={bem.e("background")} />
        <div className={bem.e("content")}>
          <Nav vertical>
            {this.state.menu.map((item, index) => (
              <div key={index}>
                <NavItem className={bem.e("nav-item")}>
                  <BSNavLink
                    id={`navItem-${item.name}-${index}`}
                    className={bem.e("nav-item-collapse")}
                    tag={NavLink}
                    to={item.to}
                    activeClassName="active"
                    onClick={e => {
                      if (item.children === undefined||item.children.length==0) {
                        // this.toggleSideBar();
                      } else {
                        item.isOpen = !item.isOpen;
                      }
                    }}
                    exact={false}
                  >
                    <div className="d-flex">
                      <IconTranslate icon={item.icon} />
                      <span className=" align-self-start">{item.name}</span>
                    </div>

                  </BSNavLink>
                </NavItem>

              </div>
            ))}
          </Nav>
          <div style={{ height: 100 }}></div>
        </div>

      </aside>
    );
  }
}

export default withApollo(Sidebar);
