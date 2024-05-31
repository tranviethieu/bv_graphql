import React from 'react';

export const UserActionsConfig = {
    settings: {
        layout: {}
    },
    routes: [
      //appointment
      {
          path     : '/apps/user-actions/appointments/:_id',
          component: React.lazy(() => import('./appointments/AppointmentsApp'))
      },
        {
            path     : '/apps/user-actions/appointments',
            component: React.lazy(() => import('./appointments_medical/Appointment'))
        },
        //tickets
        {
            path     : '/apps/user-actions/tickets/:_id',
            component: React.lazy(() => import('./tickets/TicketsList'))
        },
        {
            path     : '/apps/user-actions/tickets',
            component: React.lazy(() => import('./tickets/TicketsList'))
        },
        //prescriptions
        {
            path     : '/apps/user-actions/prescriptions/:_id',
            component: React.lazy(() => import('./prescriptions/Prescriptions'))
        },
        {
            path     : '/apps/user-actions/prescriptions',
            component: React.lazy(() => import('./prescriptions/Prescriptions'))
        },
        //examinations
        {
            path     : '/apps/user-actions/examinations/:_id',
            component: React.lazy(() => import('./examinations/Examinations'))
        },
        {
            path     : '/apps/user-actions/examinations',
            component: React.lazy(() => import('./examinations/Examinations'))
        },
        //ScanResults
        {
            path     : '/apps/user-actions/scan-results/:_id',
            component: React.lazy(() => import('./scan-results/ScanResults'))
        },
        {
            path     : '/apps/user-actions/scan-results',
            component: React.lazy(() => import('./scan-results/ScanResults'))
        },
        //TestResults
        {
            path     : '/apps/user-actions/test-results/:_id',
            component: React.lazy(() => import('./test-results/TestResults'))
        },
        {
            path     : '/apps/user-actions/test-results',
            component: React.lazy(() => import('./test-results/TestResults'))
        },
    ]
};
