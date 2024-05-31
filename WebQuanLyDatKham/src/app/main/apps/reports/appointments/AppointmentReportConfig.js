import React from 'react';

export const AppointmentReportConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes: [
        {
            path     : '/apps/reports/general-appointments',
            component: React.lazy(() => import('./ReportGeneralAppointments'))
        },        
        {
            path     : '/apps/reports/appointments',
            component: React.lazy(() => import('./ReportAppointments'))
        },
        
    ]
};
