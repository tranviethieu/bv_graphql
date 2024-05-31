import React from 'react';
import {Redirect} from 'react-router-dom';

export const SupplyCategoriesConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path: '/apps/supply-categories',
            component: React.lazy(() => import('./SupplyCategories'))

        }
    ]
};
