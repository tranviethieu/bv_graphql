import React from 'react';
import PropTypes from 'prop-types';
import { confirmable } from 'react-confirm';
import {Button,Modal,ModalHeader,ModalBody,ModalFooter,FormGroup,Form,Input} from 'reactstrap'; // your choice.
import { createConfirmation } from 'react-confirm';
import {client} from 'utils/apolloConnect'
import gql from "graphql-tag";
import authCheck from 'utils/authCheck'

export const CREATE_SLUG=gql`
mutation($slug:SlugInput!){
    response:createSlug(slug:$slug){
      code
      message
      data{
        _id
        value
      }
    }
  }
`

class SlugModal extends React.Component{
    state={
        value:"",
        type:""
    }
    onCreate = ()=>{
        const{value,type}=this.state;
        const {proceed,options}=this.props;
        client.mutate({
            mutation:CREATE_SLUG,
            variables:{slug:{type:options&&options.type?options.type:type,value}}
        }).then(result=>{
            authCheck(result.data);
            proceed(result.data.response.data);
        })
    }
    render=()=>{
        const {confirmMessage,dismiss,cancel,proceed,options}=this.props;
        return (
            <Modal toggle={dismiss} isOpen={true}>   
                <ModalHeader toggle={dismiss}>{confirmMessage}</ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Input placeholder="Nhập tên" value={this.state.value} onChange={e=>{this.setState({value:e.target.value})}}/>
                        </FormGroup>
                        {(!options||!options.type)&&
                            <FormGroup>
                                <Input placeholder="Nhập loại" value={this.state.type} onChange={e=>{this.setState({type:e.target.value})}}/>
                            </FormGroup>
                        }
                    </Form>
                </ModalBody>            
                <ModalFooter>                    
                    <div>
                        <Button color='default' onClick={cancel}> Bỏ qua </Button>{' '}
                        <Button color='primary' onClick={this.onCreate}>Xác nhận</Button>  
                    </div>   
                </ModalFooter>
            </Modal>
        )
    }
}
 
SlugModal.propTypes = {
  show: PropTypes.bool,            // from confirmable. indicates if the dialog is shown or not.
  proceed: PropTypes.func,         // from confirmable. call to close the dialog with promise resolved.
  cancel: PropTypes.func,          // from confirmable. call to close the dialog with promise rejected.
  dismiss: PropTypes.func,         // from confirmable. call to only close the dialog.
  confirmation: PropTypes.string,  // arguments of your confirm function
  options: PropTypes.object        // arguments of your confirm function
}
SlugModal.defaultProps={
    options:{type:""}
}
const confirm = createConfirmation(confirmable(SlugModal));
export default function(confirmMessage, options = {}) {
// You can pass whatever you want to the component. These arguments will be your Component's props
    return confirm({ confirmMessage, options });
}
// confirmable HOC pass props `show`, `dismiss`, `cancel` and `proceed` to your component.
//export default confirmable(Confirmation);