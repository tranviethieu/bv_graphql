import { Content, Footer, Header, Sidebar } from './index';
import React from 'react';
import { AUTH_TOKEN, GetLocalToken } from 'Constants'

import {
  MdImportantDevices,
  // MdCardGiftcard,
  MdLoyalty,
} from 'react-icons/lib/md';
import NotificationSystem from 'react-notification-system';
import { NOTIFICATION_SYSTEM_STYLE } from 'utils/constants';
// import RighSidebar from './RighSidebar';

class MainLayout extends React.Component {
  static isSidebarOpen() {
    return document
      .querySelector('.cr-sidebar')
      .classList.contains('cr-sidebar--open');
  }
  state = {

  }

  componentWillReceiveProps({ breakpoint }) {
    if (breakpoint !== this.props.breakpoint) {
      this.checkBreakpoint(breakpoint);
    }
  }

  componentDidMount() {
    this.checkAuthenticated();
    this.checkBreakpoint(this.props.breakpoint);
    // this.openSidebar('open');

  }

  // close sidebar when
  handleContentClick = event => {
    // close sidebar if sidebar is open and screen size is less than `md`
    if (
      MainLayout.isSidebarOpen() &&
      (this.props.breakpoint === 'xs' ||
        this.props.breakpoint === 'sm' ||
        this.props.breakpoint === 'md')
    ) {
      this.openSidebar('close');
    }
  };
  checkAuthenticated() {
    const isLogin = this.props.location.pathname.includes('/login');
    const token = GetLocalToken();
    var currentPath = this.props.location.pathname;
    //console.log("token="+JSON.stringify(token));
    if((!token||token==null)&&!isLogin){
      this.props.history.push("/login");
      return; 
    }    
  }
  checkBreakpoint(breakpoint) {
    switch (breakpoint) {
      case 'xs':
      case 'sm':
      case 'md':
      case 'lg':
      case 'xl':
      default:
        return this.openSidebar('close');
      //return this.openSidebar('open');
    }
  }
  componentDidUpdate() {

    var subcribedata = this.props.subcribedata;
    if (subcribedata && subcribedata.newNotifyEvent && (this.state.event != subcribedata.newNotifyEvent)) {
      this.state.event = subcribedata.newNotifyEvent;
      if (this.notificationSystem) {

        this.notificationSystem.addNotification({
          title: <span><MdImportantDevices />&nbsp; {this.state.event.title}</span>,
          message: this.state.event.shortDesc,
          level: 'info',
          autoDismiss: 5
        });

      }
    }
  }


  openSidebar(openOrClose) {
    if (openOrClose === 'open') {
      return document
        .querySelector('.cr-sidebar')
        .classList.add('cr-sidebar--open');
    }
    document.querySelector('.cr-sidebar').classList.remove('cr-sidebar--open');
  }

  render() {
    const { children } = this.props;
    return (
      <main className="cr-app bg-light">
        <Header {...this.props} />
        <Sidebar />
        <Content fluid onClick={this.handleContentClick}>
          <div style={{ height: 90 }}></div>
          <div className="content-body">
            {children}
          </div>
          <Footer {...this.props} />
        </Content>
        {/* <RighSidebar {...this.props}/> */}
        <NotificationSystem
          dismissible={false}
          ref={notificationSystem =>
            (this.notificationSystem = notificationSystem)
          }
        // style={NOTIFICATION_SYSTEM_STYLE}
        />
      </main>
    );
  }
}

export default MainLayout;
