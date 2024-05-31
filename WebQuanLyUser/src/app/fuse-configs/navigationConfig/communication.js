export const communication = [
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
                'icon': 'ballot'
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
]
