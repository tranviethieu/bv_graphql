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
        {
            path     : '/apps/medical-session/under-examination',
            component: React.lazy(() => import('./WaitingIndications'))
        },
        {
            path     : '/apps/medical-session/session-complete',
            component: React.lazy(() => import('./ExaminationConclusions'))
        },

    ]
};
