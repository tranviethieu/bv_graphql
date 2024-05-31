import React from 'react';

export const PaymentConfig = {
  settings: {
      layout: {
      }
  },
    routes: [
        {
            path     : '/apps/payment/appointments',
            component: React.lazy(() => import('./Appointment'))
        },
        {
            path     : '/apps/payment/waiting-indications',
            component: React.lazy(() => import('./WaitingIndications'))
        }
    ]
};
