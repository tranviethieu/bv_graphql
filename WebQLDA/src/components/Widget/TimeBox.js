import React from 'react';
import PropTypes from 'utils/propTypes';
import { MdClose } from 'react-icons/lib/md';
import {Label} from 'reactstrap'
const TimeBox=({
    title,
    subtitle,
    bgColor,
    showClose,
    onCloseClick,
  ...restProps  
})=>{

    return (<Label style={{backgroundColor:bgColor,padding:7,margin:5}} restProps>
        
        <div style={{fontWeight:"bold",textAlign:"center",fontSize:14}}>{title}</div>
        <div style={{textAlign:"center"}}>{subtitle}</div>
        {
            showClose?<div onClick={e=>{if(onCloseClick){onCloseClick()}}} className="text-center"><MdClose/></div>:null
        }
        
    </Label>)
}
TimeBox.propTypes={
    bgColor: PropTypes.string,
    title: PropTypes.string,
    subtitle: PropTypes.string,
    showClose:PropTypes.Boolean
}
TimeBox.defaultProps={
    bgColor:'#eeeeee',
    showClose:false
}
export default TimeBox;