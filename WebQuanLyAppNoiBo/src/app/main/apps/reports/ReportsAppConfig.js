import {AppointmentReportConfig } from './appointments/AppointmentReportConfig';
import { CallReportConfig } from './calls/CallReportConfig';
import { JobReportConfig } from './jobs/JobReportConfig';
import { SurveyReportConfig} from './surveys/SurveyReportConfig';

export const ReportsAppConfig = [
    AppointmentReportConfig,
    CallReportConfig,
    JobReportConfig,
    SurveyReportConfig,
    
]

// import React from 'react';

// export const ReportsAppConfig = {
//     settings: {
//         layout: {
//             config: {}
//         }
//     },
//     routes: [
//         {
//             path     : '/apps/reports/general-appointments',
//             component: React.lazy(() => import('./appointments/ReportGeneralAppointments'))
//         },
//         {
//             path     : '/apps/reports/general-jobs',
//             component: React.lazy(() => import('./jobs/JobReportGeneral'))
//         },
//         {
//             path     : '/apps/reports/self-jobs',
//             component: React.lazy(() => import('./jobs/JobReportSelf'))
//         },
//         {
//             path     : '/apps/reports/appointments',
//             component: React.lazy(() => import('./appointments/ReportAppointments'))
//         },
//         {
//             path     : '/apps/reports/calls/ringgroup',
//             component: React.lazy(() => import('./calls/ReportCallRingGroup'))
//         },
//         {
//             path     : '/apps/reports/calls/in',
//             component: React.lazy(() => import('./calls/ReportCallIn'))
//         },
//         {
//             path     : '/apps/reports/calls/out',
//             component: React.lazy(() => import('./calls/ReportCallOut'))
//         },
//         {
//             path     : '/apps/reports/surveys/:_id',
//             component: React.lazy(() => import('./surveys/ReportSurveyDetail'))
//         } ,
//         {
//             path     : '/apps/reports/surveys',
//             component: React.lazy(() => import('./surveys/ReportSurveys'))
//         },
//     ]
// };
