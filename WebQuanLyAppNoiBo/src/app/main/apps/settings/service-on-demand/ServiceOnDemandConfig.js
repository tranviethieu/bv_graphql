import React from 'react';

export const ServiceOnDemandConfig = {
    settings: {
        layout: {}
    },
    routes: [
      {
          path: '/apps/service-on-demand',
          component: React.lazy(() => import('./ServiceOnDemandGraph'))
      }
  ]
};
