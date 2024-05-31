import React from 'react';

import { Navbar, Nav, NavItem,Button,ButtonGroup } from 'reactstrap';
import callme from "assets/img/logo/callme.gif";
//import SourceLink from 'components/SourceLink';

class Footer extends React.Component{
  state={
     crmPath:"/"
  }
  toggleCall=()=>{
    console.log("currentpath:"+this.props.location.pathname);
    if(this.props.location.pathname!=="/call-event")
       this.setState({crmPath:this.props.location.pathname})
    this.props.history.push("/call-event");

  }
  render() {    
    // var callData = this.props.subcribedata;
    // console.log("footer data:"+JSON.stringify(callData));
    // let newCall=(callData!==undefined&&callData.newInboundEvent.state!=="Down");
    
    return (
      <Navbar style={{position:"fixed",bottom:0}}>
        <Nav navbar>
          <NavItem>
              {/* <ButtonGroup>
                <Button onClick={e=>{this.toggleCall()}} size="lg" color="green">
                  {newCall==false?"CALL":<img
                      src={callme}
                      style={{ width: "auto", height: 32, cursor: "pointer" }}
                      alt="logo"
                    />}
                </Button>
                <Button onClick={e=>{this.props.history.push(this.state.crmPath)}} sign="lg" color="primary">
                  CRM
                </Button>
              </ButtonGroup> */}
             
          </NavItem>
        </Nav>
      </Navbar>
    );
  };
}


export default Footer;
