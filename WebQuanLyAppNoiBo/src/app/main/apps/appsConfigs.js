import { AnalyticsDashboardAppConfig } from './dashboards/analytics/AnalyticsDashboardAppConfig';
import { ProjectDashboardAppConfig } from './dashboards/project/ProjectDashboardAppConfig';
import { ChatAppConfig } from "./chat/ChatAppConfig";
import { CallsEventConfig } from './call-modules/CallsEventConfig';

import { RealtimeDashboardAppConfig } from './dashboards/realtimes/RealtimeDashboardAppConfig';
import { CallsAppConfig } from './calls/CallsAppConfig';
import { ReportsAppConfig } from './reports/ReportsAppConfig';
// import { SurveysAppConfig } from './surveys/SurveysAppConfig';
import { SurveysAppConfig } from './NewSurveys/surveys/SurveysAppConfig';
import { UserSurveyAppConfig } from './NewSurveys/user-survey/UserSurveyAppConfig';
import { SmsAppConfig } from './sms/SmsAppConfig';
// import { AppointmentOfflineConfig } from './appointment-offline/AppointmentOfflineConfig';
import { IntegrateAppConfig } from './integrate/IntegrateAppConfig';
import { UserActionsConfig } from './user-actions/UserActionsConfig';
import { UserActionsManagerConfig } from './user-actions-manager/UserActionsManagerConfig'
import { CustomerAppConfig } from './customer/CustomerAppConfig'
import { AssignmentConfig } from './assignment/AssignmentConfig';
import { WorksConfig } from './works/WorksConfig';

import { SettingsConfig } from './settings/SettingsConfig'
import { NotifyAppConfig } from './notify/NotifyAppConfig'
import { WelcomeAppConfig } from './welcome/WelcomeAppConfig'
import { DoctorAppConfig } from './doctor/DoctorAppConfig'

export const appsConfigs = [
    // AnalyticsDashboardAppConfig,
    // ProjectDashboardAppConfig,
    // ChatAppConfig,
    // CallsEventConfig,
    // RealtimeDashboardAppConfig,
    // CallsAppConfig,
    SurveysAppConfig,
    UserSurveyAppConfig,
    // AssignmentConfig,
    SmsAppConfig,
    // UserActionsConfig,
    // UserActionsManagerConfig,
    // IntegrateAppConfig,
    CustomerAppConfig,
    // ...AppointmentOfflineConfig,
    // ...WorksConfig,
    ...ReportsAppConfig,
    ...SettingsConfig,
    NotifyAppConfig,
    WelcomeAppConfig,
    DoctorAppConfig,
];
