import mock from './../mock';
import _ from '@lodash';

const appointmentsDB = {
    appointments: [
        {
            'id': '1',
            'customer': {
                name: 'Phạm Văn Trọng',
                phoneNumber:'0123465687'
            },
            appointmentDate: '2019-11-20',
            appointmentTime: '08:00',
            department: 'Chuẩn đoán trước sinh',
            channel: "Web",
            createdTime: '2019-11-10',
            state:'register'
        },
        {
            'id': '2',
            'customer': {
                name: 'Nguyễn Quang Đăng',
                phoneNumber:'016335263'
            },
            appointmentDate: '2019-11-20',
            appointmentTime: '08:00',
            department: 'Sàng lọc sau sinh',
            channel: "CRM",
            createdTime: '2019-11-10',
            state:'confirmed'
        },
        {
            'id': '2',
            'customer': {
                name: 'Nguyễn Quang Đăng',
                phoneNumber:'0982396822'
            },
            appointmentDate: '2019-11-20',
            appointmentTime: '08:00',
            department: 'Xét nghiệm',
            channel: "VOIP",
            createdTime: '2019-11-10',
            state:'finished'
        }
    ]
}

mock.onGet('/api/appointments').reply(() => {
    return [200, appointmentsDB.appointments];
});
mock.onGet('/api/appointment').reply((request) => {
    const {id} = request.params;
    const response = _.find(appointmentsDB.appointments, {id});
    return [200, response];
});
