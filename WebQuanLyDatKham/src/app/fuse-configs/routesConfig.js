import React from 'react';
import {Redirect} from 'react-router-dom';
import {FuseUtils} from '@fuse/index';
import {appsConfigs} from 'app/main/apps/appsConfigs';
import {pagesConfigs} from 'app/main/pages/pagesConfigs';
import {authRoleExamplesConfigs} from 'app/main/auth/authRoleExamplesConfigs';
import {UserInterfaceConfig} from 'app/main/user-interface/UserInterfaceConfig';
import {DocumentationConfig} from 'app/main/documentation/DocumentationConfig';
import {LoginConfig} from 'app/main/login/LoginConfig';
// import {RegisterConfig} from 'app/main/register/RegisterConfig';
import {LogoutConfig} from 'app/main/logout/LogoutConfig';
// import {CallbackConfig} from 'app/main/callback/CallbackConfig';

const routeConfigs = [
    ...appsConfigs,
    ...pagesConfigs,
    ...authRoleExamplesConfigs,
    UserInterfaceConfig,
    DocumentationConfig,
    LoginConfig,
    // RegisterConfig,
    LogoutConfig,
    // CallbackConfig
];

const routes = [
    ...FuseUtils.generateRoutesFromConfigs(routeConfigs),
    {
        path     : '/',
        exact    : true,
        component: () => <Redirect to="/apps/dashboards/realtime"/>
        // component: () => <Redirect to="/"/> //sửa tạm demo thị trường
    },
    {
        path     : '/doctor',
        exact    : true,
        component: () => <Redirect to="/apps/user-actions/appointments"/>
    },
    {
        path     : '/drug',
        exact    : true,
        component: () => <Redirect to="/apps/user-actions/prescriptions"/>
    },
    {
        path     : '/test-doctor',
        exact    : true,
        component: () => <Redirect to="/apps/user-actions/examinations"/>
    },
    {
        path     : '/welcome',
        exact    : true,
        component: () => <Redirect to="/apps/welcome"/>
    },
    {
        component: () => <Redirect to="/pages/errors/error-404"/>
    }
];

export default routes;
