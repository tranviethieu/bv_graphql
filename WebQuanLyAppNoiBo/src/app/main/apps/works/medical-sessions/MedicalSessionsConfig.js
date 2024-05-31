import React from 'react';

export const MedicalSessionsConfig = {
  settings: {
      layout: {
      }
  },
    routes: [
        {
            path     : '/apps/medical-sessions',
            component: React.lazy(() => import('./MedicalSessions'))
        }

    ]
};
