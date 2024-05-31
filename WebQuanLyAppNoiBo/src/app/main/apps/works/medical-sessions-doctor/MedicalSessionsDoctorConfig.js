import React from 'react';

export const MedicalSessionsDoctorConfig = {
  settings: {
      layout: {
      }
  },
    routes: [
        {
            path     : '/apps/medical-session/awaiting-examination',
            component: React.lazy(() => import('./AwaitingExaminations'))
        },
        // {
        //     path     : '/apps/medical-session/awaiting-indication',
        //     component: React.lazy(() => import('./AwaitingExaminations'))
        // },
        // {
        //     path     : '/apps/medical-session//apps/medical-session/session-complete',
        //     component: React.lazy(() => import('./AwaitingExaminations'))
        // },

    ]
};
