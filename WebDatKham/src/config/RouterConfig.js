import React from 'react';
import {Redirect} from 'react-router-dom';
import {FuseUtils} from './FuseUtils'; 
import {appsConfigs} from 'app/main/apps/appsConfigs';
// import {authRoleExamplesConfigs} from 'app/main/auth/authRoleExamplesConfigs';
// import {LoginConfig} from 'app/main/login/LoginConfig';
// import {LogoutConfig} from 'app/main/logout/LogoutConfig';
// import {HomeConfig} from 'app/main/home/HomeConfig'

const routeConfigs = [
    ...appsConfigs,
    // ...authRoleExamplesConfigs,
    // LoginConfig,
    // LogoutConfig,
    // HomeConfig,
];

const routes = [
    ...FuseUtils.generateRoutesFromConfigs(routeConfigs),
    {
        path     : '/',
        exact    : true,
        component: () => <Redirect to="/"/>
    },
    {
        component: () => <Redirect to="/pages/errors/error-404"/>
    }
];

export default routes;
