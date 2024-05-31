import React from 'react';

export const IndicationConfig = {
  settings: {
      layout: {
      }
  },
    routes: [
        {
            path     : '/apps/indications/indication-complete',
            component: React.lazy(() => import('./ResolvedIndications'))
        },
        {
            path     : '/apps/indications/awaiting-indication',
            component: React.lazy(() => import('./PendingIndications'))
        },
        {
            path     : '/apps/indications/processing-indications',
            component: React.lazy(() => import('./ConfirmIndications'))
        }
    ]
};
