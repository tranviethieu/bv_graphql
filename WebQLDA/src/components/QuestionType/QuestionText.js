import React from 'react'
import {Input,Label,Col,FormGroup} from 'reactstrap'


class QuestionText extends React.Component{

    constructor(props){
        super(props);
    }
    onChange=(e)=>{
        this.props.onChange(JSON.stringify({textType:e.target.value}));
    }
    render=()=>{
        return(
            <FormGroup row>
                <Label md={2} sm={4} xs={6} className="text-right">
                    Input Type:
                </Label>
                <Col md={10} sm={8} xs={6}>                
                    <Input type="select" onChange={this.onChange}>
                        <option value="text">
                            text
                        </option>
                        <option value="number">
                            number
                        </option>
                        <option value="date">
                            date
                        </option>
                    </Input>
                </Col>
            </FormGroup>
        )
    }
}
export default QuestionText