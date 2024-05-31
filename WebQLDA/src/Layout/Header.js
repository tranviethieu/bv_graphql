import React from 'react';
import { SignOut } from 'Constants';
import bn from 'utils/bemnames';
import { GetLocalToken, GetProfile } from 'Constants';
import { withApollo } from "react-apollo";
import 'assets/css/style.css';
import MenuIcon from '@material-ui/icons/Menu';


import {
  Navbar,
  // NavbarToggler,
  Nav,
  NavItem,
  NavLink,
  Popover,
  PopoverBody,
  ListGroup,
  ListGroupItem,
  Button,
  FormGroup,
  Input,
  Col
} from 'reactstrap';

import {
  MdNotificationsActive,
  MdNotificationsNone,
  MdPersonPin,
  MdCall,
  MdCallMade,
  MdCallMissed,
  MdCallReceived,
  MdClearAll,
  MdExitToApp,
  MdHome
} from 'react-icons/lib/md';

import Avatar from 'react-avatar';
import { UserCard } from 'components/Card';
import Notifications from 'components/Notifications';

import withBadge from 'hocs/withBadge';
import SourceLink from 'components/SourceLink';
import { notificationsData } from 'demos/header';

const bem = bn.create('header');

const MdNotificationsActiveWithBadge = withBadge({
  size: 'md',
  color: 'primary',
  style: {
    top: -10,
    right: -10,
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  children: <small>5</small>,
})(MdNotificationsActive);


class Header extends React.Component {
  state = {
    isOpenNotificationPopover: false,
    isNotificationConfirmed: false,
    isOpenUserCardPopover: false,
    isOpenCallPopover: false,
    searchKey: "",
    suggests: [],
    customers: [],
    play: false,
    pause: true
  };
  token = {}
  profile = {}
  constructor(props) {
    super();
    this.token = GetLocalToken();
    // if (!this.token) {
    //   console.log("header check:not login")
    //   window.location.href = '/login';
    // }
    this.profile = GetProfile();
    this.url = "/sound/telephone-ring.mp3";
    this.audio = new Audio(this.url);
    this.audio.addEventListener('ended', function () {
      this.currentTime = 0;
      this.play();
    }, false);
  }
  play = () => {
    this.setState({
      play: true,
      pause: false
    });
    console.log(this.audio);
    this.audio.play();
  }

  pause = () => {
    this.setState({ play: false, pause: true });
    this.audio.pause();
  }
  componentDidUpdate() {

  }
  getSuggestionValue = suggestion => suggestion.fullName;
  renderSuggestion = suggestion => (
    <div className="account-select" onClick={e => { document.location.href = '/customer-edit/' + suggestion._id }}>
      {suggestion.fullName} ({suggestion.phoneNumber})
    </div>
  );
  toggleNotificationPopover = () => {
    this.setState({
      isOpenNotificationPopover: !this.state.isOpenNotificationPopover,
    });

    if (!this.state.isNotificationConfirmed) {
      this.setState({ isNotificationConfirmed: true });
    }
  };

  toggleUserCardPopover = () => {
    this.setState({
      isOpenUserCardPopover: !this.state.isOpenUserCardPopover,
    });
  };

  handleSidebarControlButton = event => {
    event.preventDefault();
    event.stopPropagation();

    document.querySelector('.cr-sidebar').classList.toggle('cr-sidebar--open');
  };
  toggleRightSidebar = () => {
    document.querySelector(".right-sidebar").classList.toggle("right-sidebar--open");
    if (!this.state.isNotificationConfirmed) {
      this.setState({ isNotificationConfirmed: true });
    }
  }
  onSearchChange = (event, { newValue }) => {
    this.setState({
      searchKey: newValue
    });
  };

  onFetchRequested = ({ value }) => {
    // this.props.client.query({
    //   query: FETCH_CUSTOMER,
    //   variables: { filtered: [{ id: "key", value }], page: 0, pages: 10 }
    // }).then(result => {
    //   if (result.data.customers !== null) {
    //     this.setState({
    //       suggests: result.data.customers.data
    //     });
    //   }
    // })

  };
  toggleCall = () => {
    this.setState({ isOpenCallPopover: !this.state.isOpenCallPopover })
  }

  // Autosuggest will call this function every time you need to clear suggestions.
  onClearRequested = () => {
    this.setState({
      suggests: []
    });
  };
  onSelected = (event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) => {
    const { customers } = this.state;
    customers.push(suggestion);
    this.setState({
      searchKey: ''
    });
  }
  render() {
    const { isNotificationConfirmed, searchKey, suggests } = this.state;
    const inputProps = {
      placeholder: 'Tên hoặc SĐT khách hàng',
      value: searchKey,
      onChange: this.onSearchChange
    };
    return (
      <Navbar light expand className={bem.b('bg-white') + ' header-block'}>
        <Nav navbar className="ml-2">
          <Button color="link" style={{ color: "#273c75" }} onClick={this.handleSidebarControlButton}>
            {/* <MdClearAll size={35} /> */}
            <MenuIcon />
          </Button>
        </Nav>
        <Nav navbar>
          <div className="navbar-brand d-flex">

            <span style={{ margin: "3px auto 5px", color: "#333333" }}>
              <div className="flex-item"><a href="/" className="logo"> <img src={process.env.REACT_APP_LOGO} alt="Logo elsaga" style={{ width: 50 }} /></a></div>
            </span>
          </div>
        </Nav>

        <Nav navbar>
          <h3 className='logo-name'><SourceLink href="/">{process.env.REACT_APP_LOGO_NAME}</SourceLink></h3>
        </Nav>
        <Nav navbar className={bem.e('nav-right')}>

          <NavItem>

            <NavLink id="Popover2">
              <Avatar
                onClick={this.toggleUserCardPopover}
                src={process.env.REACT_APP_FILE_PREVIEW_URL + this.profile.image}
                name={this.profile.fullName}
                size={50}
                round={true}
                className="can-click"
              />
            </NavLink>
            <Popover
              placement="bottom-end"
              isOpen={this.state.isOpenUserCardPopover}
              toggle={this.toggleUserCardPopover}
              target="Popover2"
              className="p-0 border-0"
              style={{ minWidth: 250 }}>
              <PopoverBody className="p-0 border-light">
                <UserCard
                  title={this.profile.fullName}
                  subtitle={this.profile.partner && this.profile.partner.name}
                  text={`PhoneNumber:${this.profile.phoneNumber}`}
                  className="border-light">
                  <ListGroup flush>
                    <ListGroupItem onClick={e => { document.location.href = "/profile" }} tag="button" action className="border-light">
                      <MdPersonPin /> Hồ sơ
                    </ListGroupItem>

                    <ListGroupItem onClick={e => { SignOut() }} tag="button" action className="border-light">
                      <MdExitToApp /> Đăng xuất
                    </ListGroupItem>
                  </ListGroup>
                </UserCard>
              </PopoverBody>
            </Popover>
          </NavItem>
        </Nav>
      </Navbar>
    );
  }
}

export default withApollo(Header);

