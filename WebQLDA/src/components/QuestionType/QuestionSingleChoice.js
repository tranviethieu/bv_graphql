import React,{Fragment} from 'react'
import {Input,Label,Col,FormGroup,Button,Form} from 'reactstrap'
import {MdAdd,MdDelete} from 'react-icons/lib/md';
import {QUERY_QUESTIONS} from 'GqlQuery';
import {withApollo} from 'react-apollo';
import authCheck from "utils/authCheck";

class QuestionSingleChoice extends React.Component{
    state={
        items:[],
        hasOther:false,
        questions:[]
    }
    constructor(props){
        super(props);
        try{
            
            this.state=JSON.parse(props.value);
            this.state.questions=[];
            console.log("state="+JSON.stringify(this.state));
        }catch(err){
            console.log("error="+JSON.stringify(err));
        }
    }

    changeitems=()=>{              
        this.props.onChange(JSON.stringify({items:this.state.items,hasOther:this.state.hasOther}));
    }
    componentDidMount = ()=>{
        //load other questions 
        try {
            this.props.client.query({
                query: QUERY_QUESTIONS,
                variables: { surveyId:this.props.surveyId },
            }).then(result=>{
                
                if(result.data){
                    authCheck(result);
                    this.setState({ questions: result.data.response.data });
                }
            })
            
        } catch (err) {
            console.log(err);
            authCheck(err);
        }
    }
    render=()=>{
        let{items,hasOther,questions} = this.state;
        
        return(
            <FormGroup row>
                <Label md={2} sm={4} xs={6} className="text-right">
                    Options:
                </Label>
                <Col md={10} sm={8} xs={6}>    
                    <Button color="primary" onClick={e=>{items.push({next:"",value:"",label:"",isOther:false});this.setState({items})}}><MdAdd/>&nbsp;Add Options</Button>
                    {
                        items.map((item,index)=>{
                            return(
                                <Form className="mt-2" inline key={index}>
                                    <Input bsSize="sm" placeholder="display label" type="text" value={item.label} onChange={e=>{item.label=e.target.value;this.setState({items});this.changeitems()}}/> 
                                    &nbsp;&nbsp;
                                    {
                                        item.isOther?null:<Input bsSize="sm" placeholder="value" type="text" value={item.value} onChange={e=>{item.value=e.target.value;this.setState({items});this.changeitems()}}/> 
                                    }
                                    &nbsp;&nbsp;
                                    <Input bsSize="sm" value={item.next} type="select" onChange={e=>{item.next=e.target.value; this.setState({items});this.changeitems();}}>
                                        <option value="" >
                                            Jump to Question if Selected
                                        </option>
                                        {
                                            questions.map((question,index)=>{
                                                return(
                                                    <option key={index} value={question._id}>
                                                        {question.name}
                                                    </option>
                                                )
                                            })
                                        }
                                    </Input>
                                    {hasOther?(<Fragment>
                                        &nbsp;&nbsp;
                                        <Label>
                                            <Input type="checkbox" checked={item.isOther} onChange={e=>{item.isOther=!item.isOther;this.setState({items});this.changeitems();}}/>Custom value
                                        </Label>
                                    </Fragment>):null}
                                    
                                    &nbsp;&nbsp;
                                    <Button color="danger" onClick={e=>{items.splice(index,1);this.setState({items})}}><MdDelete/></Button>
                                </Form>
                            )
                        })
                    }
                    
                    <div className="ml-4">
                        <Label check>
                            <Input type="checkbox" checked={hasOther} onChange={e=>{hasOther=!hasOther;this.setState({hasOther});this.changeitems();}}/>Enable customer answer
                        </Label>
                    </div>
                </Col>
            </FormGroup>
        )
    }
}
export default withApollo(QuestionSingleChoice)