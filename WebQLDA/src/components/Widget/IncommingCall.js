import React from 'react';
import {} from 'reactstrap'
import { SipProvider, CALL_STATUS_STARTING, CALL_STATUS_STOPPING } from 'react-sip';
import {   ListGroup,
    ListGroupItem, } from 'reactstrap'
import { UserCard } from 'components/Card';
import {MdCall,MdCallEnd}from 'react-icons/lib/md';
import Moment from 'moment';
import {
    SIP_STATUS_DISCONNECTED,
    //SIP_STATUS_...,
    CALL_STATUS_IDLE,
    CALL_STATUS_ACTIVE,
    //CALL_STATUS_...,
    SIP_ERROR_TYPE_CONFIGURATION,
    SIP_STATUS_REGISTERED,
    SIP_STATUS_CONNECTED,
    SIP_STATUS_CONNECTING,
    SIP_STATUS_ERROR,
    //SIP_ERROR_TYPE_...,
    CALL_DIRECTION_INCOMING,
    CALL_DIRECTION_OUTGOING,
} from "react-sip";


class IncommingCall extends React.Component{
    constructor(props){
        super(props);
        this.state={
            callerId:"",
            counterpart:"",
            callId:"",
            duration:"00:00",
            startTime:new Date()
        }
    }
   
    componentDidUpdate(){
        
        var patt = /^<sip:(.*)@/i;
        if(this.context.call.status==CALL_STATUS_STARTING&& this.context.call.counterpart!=this.state.counterpart){
            try{
                this.state.counterpart=this.context.call.counterpart;            
                this.state.callerId = this.context.call.counterpart.match(patt)[1];            
                this.setState({});
            }catch(err){
                console.log(err);
            }
        }
        
    }
    componentDidMount(){
        this.interval = setInterval(() => {
            if(this.context.call.status == CALL_STATUS_ACTIVE){
                var duration=Moment.utc(Moment().diff(Moment(this.state.startTime))).format("mm:ss");                
                if(duration!=this.state.duration){
                    this.setState({duration});
                }
            }            
        }, 1000);
    }
    render=()=>{
        
        return <div>
            <UserCard
                title={'SĐT:'+this.state.callerId}
                subtitle={'ID:'+this.context.call.id+''}
                text={'time:'+ this.state.duration}
            className="border-light">
                <ListGroup flush>
                    {this.context.call.direction == CALL_DIRECTION_INCOMING&&<ListGroupItem color="success" onClick={e=>{this.context.answerCall();this.setState({startTime:new Date()})}} tag="button" action className="border-light">
                      <MdCall /> Nhấc máy
                    </ListGroupItem>
                    }
                    <ListGroupItem color="danger" onClick={this.context.stopCall} tag="button" action className="border-light">
                      <MdCallEnd /> Gác máy
                    </ListGroupItem>
                    
                  </ListGroup>
            </UserCard>

        </div>
    }
}

IncommingCall.contextTypes = SipProvider.childContextTypes;

export default IncommingCall;