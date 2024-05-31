import React from 'react';
import { Row, Col, Button, Label,Modal,ModalHeader,ModalBody,ModalFooter,Form,FormGroup,Input } from 'reactstrap';
import {
    MdMessage,
    MdCall,
    MdStar
} from 'react-icons/lib/md';
import Avatar from 'components/Avatar'
import { withApollo } from 'react-apollo'
import gql from 'graphql-tag';
import confirm from 'components/Confirmation';
import CurrencyFormat from 'react-currency-format';
import { SipProvider } from 'react-sip';
import Moment from 'moment';
const PUSH_NOTIFY_TO = gql`
mutation($title:String,$message:String,$receiverId:String){
    response:pushOneTo(title:$title,message:$message,type:"account",receiverId:$receiverId){
        code
        message
        data
    }
}
`


class EmployeeInfo extends React.Component {
    state = {
        showMessage:false
    }

    sendNotify=(title,message,receiverId)=>{
        this.props.client.mutate({
            mutation:PUSH_NOTIFY_TO,
            variables:{title,message,receiverId}
        }).then(result=>{
            if(result.data.response.code!==0){
                confirm("Gửi tin chưa thành công",{hideCancel:true})
            }else{
                this.setState({showMessage:false})
            }
        });
    }
    render = () => {
        const { info,accountId,serviceSetting } = this.props;
        // console.log(info);
        return <div>
            <Row>
                <Col className="text-center">
                    <Avatar style={{ width: 80, height: 80, marginTop: 15 }} src={info && info.image} />
                    <div>
                        <Button onClick={e=>{
                            if(info&&info.phoneNumber&&info.phoneNumber!=''&&info.phoneNumber!=null)
                                this.context.startCall(info.phoneNumber);
                        }} style={{ width: "100%", margin: 5, marginTop: 10 }} size="sm" color="success">
                            <MdCall />&nbsp; Liên hệ
                        </Button>
                    </div>
                    <div>
                        <Button  onClick={e=>this.setState({showMessage:true})} color="warning" size="sm" style={{ width: "100%", margin: 5 }}>
                            <MdMessage/>&nbsp; Gửi thông báo
                        </Button>
                    </div>
                </Col>
                <Col md={5}>
                    <div style={{ paddingTop: 20 }}>
                        <h6>Họ và Tên:<Label style={{ fontWeight: "bold" }}>{info.fullName} </Label> </h6>
                        <h6>Số điện thoại: <Label style={{ fontWeight: "bold" }}>{info && info.phoneNumber}</Label> </h6>
                        <h6>Số dư: <Label style={{ fontWeight: "bold" }}>{serviceSetting&&<CurrencyFormat value={serviceSetting.ballance} displayType={'text'} thousandSeparator={true} suffix={' ₫'} />} </Label> </h6>
                        <h6>Điểm đánh giá:<Label style={{ fontWeight: "bold" }}>{serviceSetting&&serviceSetting.rating}<MdStar style={{ fontSize: 20, color: "green" }} /> / tổng số {serviceSetting&&serviceSetting.rateNumb} </Label> </h6>
                        
                        <hr/>
                        <h6><Label style={{ fontWeight: "bold" }}>Năm sinh: {Moment(info.birthday).format("DD/MM/YYYY")}</Label> </h6>
                        <h6><Label style={{ fontWeight: "bold" }}>Giới tính: {(info.gender=="male" || info.gender=="1")?"Nam":"Nữ"}</Label> </h6>
                        <h6><Label style={{ fontWeight: "bold" }}>Địa chỉ: {info.address}</Label> </h6>
                    </div>
                </Col>
                <Col md={5}>

                </Col>
            </Row>
            <Modal isOpen={this.state.showMessage} toggle={e=>this.setState({showMessage:false})}>
                <ModalHeader>
                    Gửi thông báo
                </ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Label>Chủ đề</Label>
                            <Input value={this.state.title} onChange={e=>this.setState({title:e.target.value})}/>
                        </FormGroup>
                        <FormGroup>
                            <Label>Nội dung</Label>
                            <Input type="textarea" value={this.state.messae} onChange={e=>this.setState({message:e.target.value})}/>
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={e=>this.sendNotify(this.state.title,this.state.message,accountId)}>Gửi</Button>
                    <Button color="info" onClick={e=>this.setState({showMessage:false})}>Đóng</Button>
                </ModalFooter>
            </Modal>
        </div>
    }
}
EmployeeInfo.contextTypes = SipProvider.childContextTypes;

export default withApollo(EmployeeInfo);