

//menu cho tài khoản chăm sóc khách hàng

export const supportNavigation = [
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
        'id': 'manages',
        'title': "TRANG QUẢN TRỊ",
        'type': 'group',
        'icon': 'pages',
        'children': [
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

        ]
    },
]
