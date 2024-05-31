import React from 'react';
import PropTypes from 'utils/propTypes';
import CurrencyFormat from 'react-currency-format';
import classNames from 'classnames';

import { Card, CardBody, Label, CardSubtitle,CardFooter } from 'reactstrap';

const ProfitWidget = ({
  bgColor,
  icon: Icon,
  iconProps,
  titleProps,
  valueProps,
  value,
  title,
  subtitle,
  className,
  valueType,
  ...restProps
}) => {
  const classes = classNames(className, {
    [`bg-${bgColor}`]: bgColor,
  });
  return (
    <Card inverse className={classes} {...restProps}>
      <CardBody>
        <Icon  {...iconProps} /><Label style={titleProps}>{title}</Label>
      </CardBody>
      <CardBody>
        <h1 className="text-center" style={valueProps}>
            {(valueType=="number"||valueType=="currency")&&<CurrencyFormat value={value} displayType={'text'} thousandSeparator={true} suffix={valueType=='number'?'':' ₫'} />}
            {valueType=="text"&&value}
        </h1>
        
      </CardBody>
      <CardBody style={{height:48}}>
        <small style={{color:"#707070"}}>{subtitle}</small>
      </CardBody>
    </Card>
  );
};

ProfitWidget.propTypes = {
  bgColor: PropTypes.string,
  icon: PropTypes.component,
  iconProps: PropTypes.object,
  title: PropTypes.string,
  value:PropTypes.number,
  subtitle: PropTypes.string,
  titleProps:PropTypes.object,
  valueProps:PropTypes.object,
  valueType:PropTypes.string
};

ProfitWidget.defaultProps = {
  bgColor: 'default',
  icon: 'span',
  value:0,
  valueType:"currency",
  iconProps: { size: 20,color:"#707070" },
  titleProps:{marginLeft:5,color:"#707070"},
  valueProps:{color:"#707070",fontSize:28}
};

export default ProfitWidget;
