import React from 'react';

export const OpenChannelReportConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes: [
        {
            path     : '/apps/reports/openchannel/general',
            component: React.lazy(() => import('./OpenChannelReportGeneral'))
        },        
               
    ]
};
