import React from 'react';
import PropTypes from 'utils/propTypes';

import classNames from 'classnames';
import { Card,Badge, CardBody } from 'reactstrap';


const CounterOverlay={
    position:"absolute",top:-4,left:5,
}
const CounterWidget=({
    title,
    number,
    textLeft,
    color,
    badgeColor,
    bgColor,
    className,
    badgeSize,
    ...restProps
})=>{
    const classes = classNames('cr-widget', className,{[`bg-${bgColor}`]: bgColor});
    return (
        <Card inverse className={classes} {...restProps}>
            <CardBody>
                <h4 style={CounterOverlay} className={badgeSize}><Badge style={{borderRadius:0,minWidth:"1.7em",minHeight:"1.7em"}} className="text-white" color={badgeColor}>{number}</Badge></h4>
            </CardBody>
            <CardBody style={{marginLeft:textLeft,alignContent:"center"}}>
                <div style={{textTransform:"uppercase",marginTop:"5px"}}>{title}</div>             
            </CardBody>
			
            
    </Card>

    )
}
CounterWidget.propTypes = {
    bgColor: PropTypes.string,
    number:PropTypes.number,
    title: PropTypes.string,
    subtitle: PropTypes.string,
    badgeSize:PropTypes.string,
    textLeft:PropTypes.number
  };
  
CounterWidget.defaultProps = {
    bgColor: 'info',
    number:0,
    badgeSize:"h1",
    textLeft:0
  };

export default CounterWidget;