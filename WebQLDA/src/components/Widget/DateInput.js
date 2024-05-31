import React from 'react';
import { MdClose } from 'react-icons/lib/md';
import { Button, ButtonGroup } from 'reactstrap'
import Moment from 'moment';

const validKeyCodes = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57,96,97,98,99,100,101,102,103,104,105];
const partern = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;

class DateInput extends React.Component {
    state = {
        value: "",
        scriptString: '',
        keyEnd: 0,
        keyCode: 0,
        inputSelection: false,
        updateSelection: false
    }
    //set default props:
   
    constructor(props) {
        super(props);
        this.inputRef = React.createRef();
        this.toDay=this.toDay.bind(this);
    }
    componentDidMount() {
        const { value } = this.props;        
        try{
            if(Moment(value).toDate()<new Date(1901,0,0))
                this.setState({ value: "__/__/____" })
            else
            this.setState({value:Moment(value).format("DD/MM/YYYY")})
        }catch{
            this.setState({ value: "__/__/____" })
        }
        
        
    }

    componentWillReceiveProps(nextProps) {
        // You don't have to do this check first, but it can help prevent an unneeded render
        const { value } = nextProps;        
        try{
            var valueStr=Moment(value).format("DD/MM/YYYY");
            if(valueStr!=this.state.value.replace("_","1")){
                if(Moment(value).toDate()<=new Date(1901,0,0))
                    this.setState({ value: "__/__/____" })
                else
                    this.setState({value:Moment(value).format("DD/MM/YYYY")})
            }
        }catch{
            this.setState({ value: "__/__/____" })
        }            
        
    }
    toDay(){
        this.state.str=Moment().format("DD/MM/YYYY");
        if(this.props.onChange){
            this.props.onChange(new Date());
        }
    }
    onClear = () => {
        this.setState({ value: "__/__/____" }, () => {
            this.refs.input.selectionStart = this.refs.input.selectionEnd = 0
        });
        this.refs.input.focus();
    }
    handleKeyDown(event) {

        event.preventDefault();
        var str = this.state.value;

        var start = event.target.selectionStart;
        var end = event.target.selectionEnd;
        var keyCode = event.keyCode;
        console.log(keyCode);
        var step = 1;
        if (validKeyCodes.indexOf(keyCode) < 0) {
            if (keyCode == 37 && start > 0) {
                if (start == 3 || start == 6)
                    step = 2
                this.setState({ value: str }, () => {
                    this.refs.input.selectionStart = this.refs.input.selectionEnd = start - step
                });
            } else if (keyCode == 39 && start < str.length) {
                if (start == 1 || start == 4)
                    step = 2
                this.setState({ value: str }, () => {
                    this.refs.input.selectionStart = this.refs.input.selectionEnd = start + step
                });
            }else if(keyCode==8&&start>0){
                if (start == 3 || start == 6){
                    str = str.substring(0, start-2) + "_/" + str.substring(start);
                    step = 2
                }else{
                    str = str.substring(0, start-1) + "_" + str.substring(start);
                }
                this.setState({ value: str }, () => {
                    this.refs.input.selectionStart = this.refs.input.selectionEnd = start - step
                });
            }
            return;
        }
        var charCode=String.fromCharCode(keyCode);
        if(keyCode>=96&&keyCode<=105){
            charCode=(keyCode-96)+'';
        }
        
        switch (end) {
            case 1:
            case 4:
                step = 2;
                str = str.substring(0, start) + charCode + str.substring(end + 1);
                break;
            case 0:
            case 3:
                str = str.substring(0, start) + charCode+"_" + str.substring(end + 2);
                break;
            case 6:
            case 7:
            case 8:
            case 9:
                str = str.substring(0, start) + charCode + str.substring(end + 1);
                break;
            case 2:
            case 5:
                str = str.substring(0, start + 1) + charCode + str.substring(end + 2);
                step = 2;
                break;

            default:

                return;
        }
        var formated=str.replace("_",1);
        var date = Moment(formated,"DD/MM/YYYY").toDate();
        if(date=="Invalid Date"){
            // alert("Ngày tháng chưa hơp lệ");
            return;
        }
        this.setState({ value: str }, () => {
            this.refs.input.selectionStart = this.refs.input.selectionEnd = start + step
        });
        this.state.value=str;
        if(this.props.onChange){
            this.props.onChange(Moment(str.replace("_","1"),"DD/MM/YYYY").toDate());
        }
    }
    onScriptChange(event) {
        console.log("change event");
        if (this.props.onChange) {
            console.log('props on Change?');
            this.props.onChange(Moment(event.target.value.replace("_","1").toDate()));
        } else{
            console.log('not found on Change?');
            this.setState({ value: event.target.value });
        }
    }
    render() {

        return (
            <div {...this.props} style={{position:"relative"}}>
                <input
                    ref="input"
                    onKeyDown={this.handleKeyDown.bind(this)}
                    onChange={this.onScriptChange.bind(this)}
                    value={this.state.value} 
                    style={{width:"100%",minHeight:30,border:"1px solid #dddddd",borderRadius:3,padding:"2px 10px", color:"#444444"}}
                    />
                <ButtonGroup style={{position:"absolute",right:0,height:"100%"}}>
                    <Button size="sm" color="success" onClick={this.toDay}>Hôm nay</Button>
                    <Button size="sm" color="info" onClick={this.onClear} ><MdClose/></Button>
                </ButtonGroup>


            </div>
        )
    }
}
export default DateInput;