import React from 'react';
import PropTypes from 'utils/propTypes';
import {MdCheck,MdClose,MdWarning,MdInfo} from 'react-icons/lib/md';

///đối tượng này lưu được nhiều trạng thái chứ không chỉ là 2 trạng thái như 1 check box thông thường
///mỗi 1 lần ấn check box nó sẽ đổi trạng thái đại diện bằng các cách hiển thị khác nhau
const StateCheckBox =({value,title,states,onChange})=>{
        //states={"":"",...states};
        let type=states[value];        
        return(
            <div className="pretty p-icon p-default">
                <input type="checkbox" checked={false} onChange={e=>{
                    //toggle to the next state --> also change type
                    
                    var found=false;
                    for(let key in states){
                        
                        if(found===true){
                            onChange(states[key]);
                            break;
                        }
                        if(key===value){
                            found=true;
                        }
                    }
                    if(found===false){
                        onChange("");
                    }
                }}/>
                {
                    type==="success"?(
                    <div className="state p-success text-success">
                        <MdCheck/>
                        <label>{title}</label>
                    </div>
                    ):
                    type==="warning"?(<div className="state p-warning text-warning">
                        <MdWarning/>
                        <label>{title}</label>
                    </div>):
                    type==="danger"?(<div className="state p-danger text-danger">
                        <MdClose/>
                        <label>{title}</label>
                    </div>):
                    type==="info"?(<div className="state p-info text-info">
                        <MdInfo/>
                        <label>{title}</label>
                    </div>):
                    (<div className="state">
                        
                        <label>{title}</label>
                    </div>)
                }
                
                
            </div>
        )
    }

StateCheckBox.propTypes={
    value:PropTypes.string,
    title:PropTypes.string,
    states:PropTypes.object
}
StateCheckBox.defaultProps={
    title:"",
    value:"",    
    states:{}
}
export default StateCheckBox;