import React from 'react'
import {Input,Label} from 'reactstrap'



class AppointmentTime extends React.Component{
    
    render=()=>{
        return (
            <Label className="time-container">
                <Input type="radio" checked={this.props.checked} name={this.props.name} disabled={this.props.process===0} value={this.value} onChange={this.props.onChange}/>
                <div className="time-title">
                    <Label>{this.props.title}</Label>
                </div>
                <div className={this.props.process===0?'time-full':'time-value'}>
                    {
                        this.props.process===0?"FULL":
                        this.props.process
                    }
                </div>
            </Label>
        )
    }
}

export default AppointmentTime;