import React from 'react';

export const OrganizationConfig = {
    settings: {
        layout: {}
    },
    routes: [
    //   {
    //       path: '/apps/personel-organization/edit/new/:_id',
    //       component: React.lazy(() => import('./PersonelOrganizationParent'))
    //   },
    //   {
    //       path: '/apps/personel-organization/edit/:_id',
    //       component: React.lazy(() => import('./PersionelOrganizationEdit'))
    //   },
    //   {
    //       path: '/apps/personel-organization/edit',
    //       component: React.lazy(() => import('./PersionelOrganizationEdit'))
    //   },
    //   {
    //       path: '/apps/personel-organizations',
    //       component: React.lazy(() => import('./PersonelOrganizations'))
    //   },
      {
          path: '/apps/personel-organization/chart',
          component: React.lazy(() => import('./OrganizationChart'))
      }
  ]
};
