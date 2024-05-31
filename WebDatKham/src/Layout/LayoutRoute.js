import React from 'react';
import { Route } from 'react-router-dom';

const LayoutRoute = ({ component: Component, layout: Layout,subcribedata, ...rest }) => (
  <Route
    {...rest}
    render={props => (
      <Layout {...props} subcribedata={subcribedata}>
        <Component {...props} subcribedata={subcribedata}/>
      </Layout>
    )}
  />
);

export default LayoutRoute;
