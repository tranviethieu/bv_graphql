// import { MaterialUIComponentsNavigation } from 'app/main/documentation/material-ui-components/MaterialUIComponentsNavigation';
// import { authRoles } from 'app/auth';

//day la list menu cho tài khoản tổng
export const adminNavigation = [

    {
        'id': 'workings',
        'title': 'TRANG LÀM VIỆC',
        'type': 'group',
        'icon': 'apps',
        'children': [
            {
                'id': 'project-dashboard',
                'icon':'show_chart',
                'title': 'Trang chủ',
                'type': 'item',
                'url': '/apps/dashboards/realtime'
            },
            {
                'id': 'calls-event',
                'title': 'Cuộc gọi',
                'icon':'call',
                'type': 'hidden',
                'url': '/apps/calls-event',
            },
            {
                'id': 'create-appointment',
                'title': 'Tạo lịch khám',
                'icon':'date_range',
                'type': 'hidden',
                'url': '/apps/appointments/new',
            },
            {
                'id': 'create-examination',
                'title': 'Tạo kết quả khám',
                'icon':'bubble_chart',
                'url': '/apps/examination/new',
            },
            {
                'id': 'create-testresult',
                'title': 'Tạo kết quả xét nghiệm',
                'icon':'blur_circular',
                'url': '/apps/testresult/new',
            },
            {
                'id': 'create-scanresult',
                'title': 'Tạo kết quả chụp chiếu',
                'icon':'center_focus_strong',
                'url': '/apps/scanresult/new',
            },
            {
                'id': 'create-prescription',
                'title': 'Tạo đơn thuốc',
                'icon':'assignment',
                'url': '/apps/prescription/new',
            },
            {
                'id': 'create-ticket',
                'title': 'Yêu cầu khách hàng',
                'icon':'class',
                'url': '/apps/tickets',
            },
            {
                'id': 'user-action',
                'title': 'Hoạt động của khách hàng',
                'icon':'contacts',
                'type': 'collapse',
                'children': [
                    {
                        'id': 'appointments',
                        'title': 'Lịch khám',
                        'type': 'item',
                        'url': '/apps/user-actions/appointments'
                    },
                    {
                        'id': 'examinations',
                        'title': 'Kết quả khám',
                        'type': 'item',
                        'url': '/apps/user-actions/examinations'
                    },
                    {
                        'id': 'test-results',
                        'title': 'Kết quả xét nghiệm',
                        'type': 'item',
                        'url': '/apps/user-actions/test-results'
                    },
                    {
                        'id': 'scan-results',
                        'title': 'Kết quả chụp chiếu',
                        'type': 'item',
                        'url': '/apps/user-actions/scan-results'
                    },
                    {
                        'id': 'prescriptions',
                        'title': 'Đơn thuốc',
                        'type': 'item',
                        'url': '/apps/user-actions/prescriptions'
                    },
                    {
                        'id': 'tickets',
                        'title': 'Yêu cầu khách hàng',
                        'type': 'item',
                        'url': '/apps/user-actions/tickets'
                    },
                ]
            },
            {
                'id': 'calls',
                'title': 'Quản lý cuộc gọi',
                'icon':'call',
                'type': 'collapse',
                'children': [
                    {
                        id: "call-search-in",
                        title: "Cuộc gọi vào",
                        type: "item",
                        url: "/apps/calls/in",
                        exact: true
                    },
                    {
                        id: "call-search-out",
                        title: "Cuộc gọi ra",
                        type: "item",
                        url: "/apps/calls/out",
                        exact: true
                    },
                    {
                        id: "call-campaign",
                        title: "Chiến dịch",
                        type: "item",
                        url: "/apps/calls/campaigns",
                        exact: true
                    }
                ]
            },
            {
                'id': 'chat',
                'title': 'Kênh chat',
                'type': 'item',
                'icon': 'chat',
                'url': '/apps/chat'
            },
            {
                'id': 'customer-surveys',
                'title': 'Khảo sát khách hàng',
                'type': 'item',
                'url': '/apps/surveys/search',
                'icon': 'ballot',
                // 'children': [
                //     {
                //         'id': 'edit-survey',
                //         'title': 'Tạo khảo sát khách hàng',
                //         'type': 'item',
                //         'url': '/apps/surveys/edit/new'
                //     },
                //     {
                //         'id': 'surveys',
                //         'title': 'Quản lý khảo sát khách hàng',
                //         'type': 'item',
                //         'url': '/apps/surveys/search'
                //     }
                // ]
            },
            {
                'id': 'notifys',
                'title': 'SMS',
                'type': 'collapse',
                'icon': 'question_answer',
                'children': [
                    {
                        'id': 'campaign-sms',
                        'title': 'Chiến dịch SMS',
                        'type': 'item',
                        'url': '/apps/sms/campaign-sms'
                    },
                    {
                        'id': 'send-sms',
                        'title': 'Gửi tin nhắn SMS',
                        'type': 'item',
                        'url': '/apps/sms/sendsms'
                    },
                    // {
                    //     'id': 'notifys-user',
                    //     'title': 'Gửi thông báo tới khách hàng',
                    //     'type': 'item',
                    //     'url': '/apps/notify/sendnotify-user'
                    // },
                    // {
                    //     'id': 'notify-employee',
                    //     'title': 'Gửi thông báo tới nhân viên',
                    //     'type': 'item',
                    //     'url': '/apps/notify/sendnotify-employee'
                    // },
                ]
            },
            {
                'id': 'assignment',
                'title': 'Quản lý công việc',
                'icon':'business_center',
                'type': 'collapse',
                'children': [
                  {
                      id: "assignment-alls",
                      title: "Tất cả công việc",
                      type: "item",
                      url: "/apps/assignments",
                      exact: true
                  },
                    {
                        id: "assignment-work-by-me",
                        title: "Công việc đã giao",
                        type: "item",
                        url: "/apps/assignment/workby",
                        exact: true
                    },
                    {
                        id: "assignment-work-to-me",
                        title: "Công việc được giao",
                        type: "item",
                        url: "/apps/assignment/workto",
                        exact: true
                    }
                ]
            },
        ]
    },
    {
        'id': 'reports',
        'title': 'TRANG BÁO CÁO',
        'type': 'group',
        'icon': 'import_export',
        'children': [
            {
                'id': 'report-appointments',
                'title': 'Báo cáo đặt lịch khám',
                'type': 'item',
                'icon': 'date_range',
                'url':'/apps/reports/appointments'
            },
            {
                'id': 'general-report',
                'title': 'Báo cáo tổng hợp đặt khám',
                'type': 'item',
                'icon': '360',
                'url': '/apps/reports/general-appointments'
            },
            {
                'id': 'call-report',
                'title': 'Báo cáo cuộc gọi',
                'type': 'collapse',
                'icon': 'call',
                'children': [
                    {
                        'id': 'report-ringgroup-in',
                        'title': 'Theo nhánh tổng đài viên',
                        'type': 'item',
                        // 'icon': 'call_ringgroup',
                        'url':'/apps/reports/calls/ringgroup'
                    },
                    {
                        'id': 'report-call-in',
                        'title': 'Theo cuộc gọi vào',
                        'type': 'item',
                        // 'icon': 'call_received',
                        'url':'/apps/reports/calls/in'
                    },
                    {
                        'id': 'report-call-out',
                        'title': 'Theo cuộc gọi ra',
                        'type': 'item',
                        // 'icon': 'call_made',
                        'url':'/apps/reports/calls/out'
                    },
                ]
            },
            {
                'id': 'report-sms',
                'title': 'Báo cáo SMS',
                'type': 'collapse',
                'icon': 'textsms',
                'url': '/apps/reports/sms',
                'children': [
                    {
                        'id': 'report-sms-general',
                        'title': 'Báo cáo tổng quát SMS',
                        'type': 'item',
                        // 'icon': 'question_answer',
                        'url':'/apps/reports/sms/general'
                    },
                    {
                        'id': 'report-sms-detail',
                        'title': 'Lịch sử gửi SMS',
                        'type': 'item',
                        // 'icon': 'question_answer',
                        'url':'/apps/reports/sms/history'
                    },
                    {
                        'id': 'report-sms-queue',
                        'title': 'Hàng đợi SMS chờ gửi',
                        'type': 'item',
                        // 'icon': 'question_answer',
                        'url':'/apps/reports/sms/queue'
                    },
                    {
                        'id': 'report-sms-byphone',
                        'title': 'Thống kê theo số điện thoại',
                        'type': 'item',
                        // 'icon': 'question_answer',
                        'url':'/apps/reports/sms/report-by-phone'
                    },
                ]
            },
            {
                'id': 'report-survey',
                'title': 'Báo cáo khảo sát khách hàng',
                'type': 'item',
                'icon': 'question_answer',
                'url':'/apps/reports/surveys'
            },
        ]
    },
    {
        'id': 'manages',
        'title': "TRANG QUẢN TRỊ",
        'type': 'group',
        'icon': 'pages',
        'children': [
            {
                'id': 'accounts',
                'title': 'Quản lý tài khoản',
                'type': 'item',
                'icon': 'supervisor_account',
                'url': '/apps/accounts'
            },
            {
                'id': 'personel-organization',
                'title': 'Quản lý tổ chức hành chính',
                'type': 'collapse',
                'icon': 'business',
                'children': [
                    {
                        'id': 'personel-organizations',
                        'title': 'Tổ chức hành chính',
                        'type': 'item',
                        'url':'/apps/personel-organizations'
                    },
                    {
                        'id': 'personel-organization-chart',
                        'title': 'Sơ đồ tổ chức hành chính',
                        'type': 'item',
                        'url':'/apps/personel-organization/chart'
                    },
                  ]
            },
            {
                'id': 'users',
                'title': "Khách hàng",
                'type': 'item',
                'icon':'account_box',
                'url':'/apps/users'
            },
            {
                'id': 'user-actions-manager',
                'title': 'Hoạt động của khách hàng',
                'type': 'item',
                'icon': 'contacts',
                'url': '/apps/user-actions-manager'
            },
            {
                'id': 'departments',
                'title': "Khoa/Phòng ban",
                'type': 'item',
                'icon':'call_to_action',
                'url':'/apps/departments'
            },
            {
                'id': 'ring-group',
                'title': "Nhánh tổng đài viên",
                'type': 'item',
                'icon':'call_split',
                'url':'/apps/ring-groups'
            },
        ]
    },
    {
        'id': 'setting',
        'title': 'TRANG CÀI ĐẶT',
        'type': 'group',
        'icon': 'pages',
        'children': [
            {
                'id': 'intergrates',
                'title': 'Cài đặt tích hợp',
                'icon':'apps',
                'type': 'item',
                'url': '/apps/integrate',
                'exact': true
            },
            {
                'id': 'menus',
                'title': 'Cài đặt menu',
                'icon':'menu',
                'type': 'item',
                'url': '/apps/menu/graph',
                'exact': true
            },
        ]
    },
    {
        'type': 'divider',
        'id': 'divider-1'
    },

];

// export default navigationConfig;
