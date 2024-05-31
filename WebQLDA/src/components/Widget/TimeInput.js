import React from 'react';
import { MdClose } from 'react-icons/lib/md';
import { Button, ButtonGroup ,Label} from 'reactstrap'
import Moment from 'moment';

const validKeyCodes = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105];
const partern = /^([0-6][0-9]):([0-6][0-9])$/;

class DateTimeInput extends React.Component {
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
        this.toDay = this.toDay.bind(this);
        this.onClear = this.onClear.bind(this);
    }
    componentDidMount() {
        const { value } = this.props;
        if (!partern.test(value.replace("_", "0")))
            this.setState({ value: "__:__" })
        else
            this.setState({ value })
    }

    componentWillReceiveProps(nextProps) {
        const { value } = nextProps;
        // this.refs.input.focus();
        if (value != this.state.value.replace("_","0")) {
            if (!partern.test(value))
                this.setState({ value: "__:__" })
            else {
                this.setState({ value })
            }
        }
    }
    onClear = () => {
        this.setState({ value: "__:__" }, () => {
            this.refs.input.selectionStart = this.refs.input.selectionEnd = 0
        });
        this.refs.input.focus();

    }
    toDay() {
        this.state.value = Moment().format("HH:mm");
        if (this.props.onChange) {
            this.props.onChange(this.state.value);
        }
    }
    handleKeyDown(event) {

        event.preventDefault();
        var str = this.state.value;

        var start = event.target.selectionStart;
        var end = event.target.selectionEnd;
        var keyCode = event.keyCode;
        var step = 1;
        if (validKeyCodes.indexOf(keyCode) < 0) {
            if (keyCode == 37 && start > 0) {
                if (start == 3)
                    step = 2
                this.setState({ value: str }, () => {
                    this.refs.input.selectionStart = this.refs.input.selectionEnd = start - step
                });
            } else if (keyCode == 39 && start < str.length) {
                if (start == 1)
                    step = 2
                this.setState({ value: str }, () => {
                    this.refs.input.selectionStart = this.refs.input.selectionEnd = start + step
                });
            } else if (keyCode == 8 && start > 0) {
                if (start == 3) {
                    str = str.substring(0, start - 2) + "_:" + str.substring(start);
                    step = 2
                } else if (start == 14) {
                    str = str.substring(0, start - 2) + "_:" + str.substring(start);
                    step = 2
                } else if (start == 11) {
                    str = str.substring(0, start - 2) + "_ " + str.substring(start);
                    step = 2
                } else {
                    str = str.substring(0, start - 1) + "_" + str.substring(start);
                }

                this.setState({ value: str }, () => {
                    this.refs.input.selectionStart = this.refs.input.selectionEnd = start - step
                });
            }
            return;
        }
        var charCode = String.fromCharCode(keyCode);
        if (keyCode >= 96 && keyCode <= 105) {
            charCode = (keyCode - 96) + '';
        }

        switch (end) {
            case 1:
                step = 2;
                str = str.substring(0, start) + charCode + str.substring(end + 1);
                break;
            case 0:
            case 3:
                str = str.substring(0, start) + charCode + "_" + str.substring(end + 2);
                break;
            case 2:
                str = str.substring(0, start + 1) + charCode + str.substring(end + 2);
                step = 2;
                break;
            case 4:
                str = str.substring(0, start) + charCode + str.substring(end + 1);
                break;
            default:
                return;
        }
        var formated = str.replace("_", 0);
        var date = Moment(formated, "HH:mm").toDate();
        if (date == "Invalid Date") {
            // alert("Ngày tháng chưa hơp lệ");
            return;
        }
        this.setState({ value: str }, () => {
            this.refs.input.selectionStart = this.refs.input.selectionEnd = start + step
        });
        this.state.value = str;
        if (this.props.onChange) {
            this.props.onChange(str.replace("_", "0"));
        }
    }
    onScriptChange(event) {
        // console.log("onChange event");
        if (this.props.onChange) {
            this.props.onChange(event.target.value);
        } else
            this.setState({ value: event.target.value });
    }
    render() {

        return (
            <Label style={{ position: "relative", width: 160,margin:"0 10px" }} {...this.props}>
                <input
                    ref="input"
                    onKeyDown={this.handleKeyDown.bind(this)}
                    onChange={this.onScriptChange.bind(this)}
                    value={this.state.value}
                    style={{ width: "100%", minHeight: 30, border: "1px solid #dddddd", borderRadius: 3, padding: "2px 10px", color: "#444444" }}
                />
                <ButtonGroup style={{ position: "absolute", right: 0, height: "100%" }}>
                    <Button size="sm" color="success" onClick={this.toDay}>Bây giờ</Button>
                    <Button size="sm" color="info" onClick={this.onClear} ><MdClose /></Button>
                </ButtonGroup>


            </Label>
        )
    }
}
export default DateTimeInput;