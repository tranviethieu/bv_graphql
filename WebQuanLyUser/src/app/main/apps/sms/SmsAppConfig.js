import React from 'react';

export const SmsAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes: [
        {
            path     : '/apps/reports/sms/general',
            component: React.lazy(() => import('./ReportGeneralSMSs'))
        },
        {
            path     : '/apps/reports/sms/report-by-phone',
            component: React.lazy(() => import('./ReportSMSByPhone'))
        },
        {
            path     : '/apps/reports/sms/historybycampaign/:_id',
            component: React.lazy(() => import('./ReportSMSLogsByCampaign'))
        },
        {
            path     : '/apps/reports/sms/history',
            component: React.lazy(() => import('./ReportSMSLogs'))
        },
        {
            path     : '/apps/reports/sms/queue',
            component: React.lazy(() => import('./ReportSMSQueue'))
        },
        {
            path     : '/apps/reports/sms',
            component: React.lazy(() => import('./ReportSmsDemo'))
        },
        {
            path     : '/apps/sms/sendsms',
            component: React.lazy(() => import('./SendSms'))
        },
        {
            path     : '/apps/sms/campaign-sms/:_id',
            component: React.lazy(() => import('./campaign-sms/EditSMSCampaign'))
            // path: '/apps/ring-groups/:_id',
            // component: React.lazy(() => import('./EditRingGroup'))
        } ,   
        {
            path: '/apps/sms/campaign-sms',
            component: React.lazy(() => import('./campaign-sms/SMSCampaigns'))
        }  
    ]
};
