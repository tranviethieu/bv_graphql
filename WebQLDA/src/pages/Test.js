import Page from 'components/Page';
import PropTypes from 'prop-types';
import React from 'react';
import { Button,ButtonGroup,Input,Row,Col,Label,Card,CardHeader,CardBody,Modal,ModalBody,ModalHeader,ModalFooter ,Form,FormGroup} from 'reactstrap';
import DateInput from 'components/Widget/DateInput';
import TimeInput from 'components/Widget/TimeInput';
import DateTimeInput from 'components/Widget/DateTimeInput';
import Moment from 'moment';
  
class SettingPage extends React.Component{
    
    state={
        testDate:new Date(),
        time:""
        // testDateTime:Moment().format("DD/MM/YYYY HH:mm")
    }
   
    static childContextTypes = {
        foo: PropTypes.string.isRequired,
    };
    getChildContext() {
        return { foo: "I m the foo" };
    }
    
    render=()=>{
        return(
            <Page
            title="Cài đặt"
            breadcrumbs={[{ name: 'Cài đặt', active: true }]}            
            className="SettingPage">
                <CardBody>
                    <Form>
                        <FormGroup>
                            
                        </FormGroup>
                    </Form>

                </CardBody>
            </Page>

        )
    }
}
export default SettingPage;