
import UserSurvey from './UserSurvey'
// import { authRoles } from 'app/auth';

export const UserSurveyAppConfig = {
    settings: {
        layout: {
            config: {
                navbar: {
                    display: false
                },
                toolbar: {
                    display: false
                },
                footer: {
                    display: false
                },
                leftSidePanel: {
                    display: false
                },
                rightSidePanel: {
                    display: false
                },
                callOutPanel: {
                    display: false
                }
            }
        }
    },
    // auth: authRoles.onlyGuest,
    routes: [
        {
            path: '/apps/do-survey/:_id/:fullName?/:phoneNumber?',
            component: UserSurvey
        }
    ]
};

