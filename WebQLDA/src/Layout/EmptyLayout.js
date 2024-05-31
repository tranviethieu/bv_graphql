import { Content } from './index';
import React from 'react';
import backgroundImage from 'assets/img/bg/login-bg.jpg';

const EmptyLayout = ({ children, ...restProps }) => (
  // <main className="cr-app bg-light" style={loginBackground} {...restProps}>
  //   <Content fluid>
  //     {children}
  //   </Content>
  // </main>
  // <main {...restProps}>
  <main>
      {children}
    
  </main>
);
const loginBackground = {
  backgroundImage: `url("${backgroundImage}")`,
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat"
};
export default EmptyLayout;
