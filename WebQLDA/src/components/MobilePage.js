import React from 'react';
import PropTypes from 'utils/propTypes';

import bn from 'utils/bemnames';

import { Breadcrumb, BreadcrumbItem,Card } from 'reactstrap';

import Typography from './Typography';

const bem = bn.create('page');

const MobilePage = ({
  title,
  breadcrumbs,
  tag: Tag,
  className,
  children,
  rightComp,
  ...restProps
}) => {
  const classes = bem.b('px-3', className);

  return (
    <Tag className={classes} {...restProps}>
      <div className={bem.e('header')} style={{display:"flex",flexDirection:"row"}}>
         {breadcrumbs && (
           <Breadcrumb className={bem.e('breadcrumb')}>
             <BreadcrumbItem>Home</BreadcrumbItem>
             {breadcrumbs.length &&
               breadcrumbs.map(({ name, active }, index) => (
                 <BreadcrumbItem key={index} active={active}>
                   {name}
                 </BreadcrumbItem>
               ))}
           </Breadcrumb>
         )}
{/*         
        <div style={{marginBottom:"auto",marginLeft:"auto"}}>
          {rightComp}
        </div> */}
      </div>
      <div style={{borderRadius:0,width:400, backgroundColor:"#ffffff"}} >
        {children}
      </div>
    </Tag>
  );
};

MobilePage.propTypes = {
  tag: PropTypes.component,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  className: PropTypes.string,
  children: PropTypes.node,
  breadcrumbs: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      active: PropTypes.bool,
    })
  ),
  rightComp: PropTypes.node
};

MobilePage.defaultProps = {
  tag: 'div',
  title: '',
  rightComp:<p></p>
};

export default MobilePage;
