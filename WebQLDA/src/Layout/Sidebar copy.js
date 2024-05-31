import React from "react";
import { GetLocalToken } from "Constants";
import { withApollo } from "react-apollo";
import gql from "graphql-tag";
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

const QUERY_SIDEMENU = gql`
  query AdminQuery {
    response:myMenus (admin:true,showRootIfNotExist:true){
      data{
        name
        to
        icon
        children {
          name
          to
          icon
          children{
            name
            to
            icon
          }
        }
      }
    }
  }
`;
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
  { to: '/profile', name: 'Tài khoản', exact: false, Icon: MdVerifiedUser },
  // {to:'/setting', name: 'Cài đặt',exact:false,Icon: MdSettings},
  { to: '/login', name: 'Đăng xuất', exact: false, Icon: MdExitToApp },
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
    this.props.client.query({ query: QUERY_SIDEMENU }).then(result => {
      if(authCheck(result))
        this.setState({ menu: result.data.response.data });
    });
  }
  toggleSideBar = () => {    
    document.querySelector(".cr-sidebar").classList.toggle("cr-sidebar--open");
  };
  render() {
    return (
      <aside className={bem.b()} style={{paddingTop:10}}>
        <div className={bem.e("background")} />
        <div className={bem.e("content")}>
          <Nav vertical>
            {this.state.menu.map((item, index) => item.to == '/' ? null : (
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
                        this.toggleSideBar();
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

                    {!item.children || item.children.length === 0 ? (
                      ""
                    ) : (
                        <MdKeyboardArrowDown
                          className={bem.e("nav-item-icon")}
                          style={{
                            padding: 0,
                            transform: item.isOpen
                              ? "rotate(0deg)"
                              : "rotate(-90deg)",
                            transitionDuration: "0.3s",
                            transitionProperty: "transform"
                          }}
                        />
                      )}
                  </BSNavLink>
                </NavItem>
                {!item.children ? (
                  ""
                ) : (
                    <Collapse isOpen={item.isOpen}>
                      {item.children.map((child, idx) => (
                        <div key={idx}>
                          <NavItem className={bem.e("nav-item")}>
                            <BSNavLink
                              id={`navItem-${child.name}-${idx}`}
                              className="nav-item-collapse sub-sidebar"
                              tag={NavLink}
                              to={child.to}
                              activeClassName="active"
                              onClick={e => {
                                if (child.children === undefined||child.children.length==0) {
                                  this.toggleSideBar();
                                } else {
                                  child.isOpen = !child.isOpen;
                                }
                              }}
                              exact={child.exact}
                            >
                              <div className="d-flex">
                                <span className=" align-self-start">{child.name}</span>
                              </div>
                              {!child.children || child.children.length === 0 ? (
                                ""
                              ) : (
                                  <MdKeyboardArrowDown
                                    className={bem.e("nav-item-icon")}
                                    style={{
                                      padding: 0,
                                      transform: child.isOpen
                                        ? "rotate(0deg)"
                                        : "rotate(-90deg)",
                                      transitionDuration: "0.3s",
                                      transitionProperty: "transform"
                                    }}
                                  />
                                )}
                            </BSNavLink>
                          </NavItem>
                          {!child.children ? (
                            ""
                          ) : (
                              <Collapse isOpen={child.isOpen}>
                                <ul>
                                  {child.children.map(({ to, name, exact, Icon }, idxx) => (
                                    <div key={idxx}>
                                      <NavItem className={bem.e("nav-item")}>
                                        <BSNavLink
                                          id={`navItem-${name}-${idxx}`}
                                          className="sub-sidebar"
                                          tag={NavLink}
                                          to={to}
                                          activeClassName="active"
                                          onClick={this.toggleSideBar}
                                          exact={exact}
                                        >
                                          <span className="">{name}</span>

                                        </BSNavLink>
                                      </NavItem>
                                    </div>
                                  ))}
                                </ul>
                              </Collapse>
                            )}
                        </div>
                      ))}
                    </Collapse>
                  )}
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
