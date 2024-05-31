import React from 'react';

export const DepartmentsConfig = {
    settings: {
        layout: {}
    },
    routes: [     

        {
            path: '/apps/departments/:_id',
            component: React.lazy(() => import('./EditDepartment'))
        } ,   
        {
            path     : '/apps/departments',
            component: React.lazy(() => import('./DepartmentsApp'))
        }   
    ]
};
