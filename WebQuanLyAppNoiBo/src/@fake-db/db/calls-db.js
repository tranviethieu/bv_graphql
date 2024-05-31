import mock from './../mock';
import _ from '@lodash';

const callDB = {
    calls: [
        {
            id: "1",
            direction: 0,
            state: 'served',
            phoneNumber: '0394093333',
            ringGroup: '1',
            createdTime: '2019-11-12',
            updator: 'Nguyễn Quang Đăng',
            ticket: {
                note: 'Chú thích yêu cầu'
            },
            appointment: {
                id: "1"
            },
            record: ''
        },
        {
            id: "2",
            direction: 0,
            state: 'served',
            phoneNumber: '0394093333',
            ringGroup: '1',
            createdTime: '2019-11-12',
            updator: 'Nguyễn Quang Đăng',
            ticket: {
                note: 'Chú thích yêu cầu'
            },
            appointment: {
                id: "1"
            },
            record: ''
        },
        {
            id: "3",
            direction: 0,
            state: 'served',
            phoneNumber: '0394093333',
            ringGroup: '1',
            createdTime: '2019-11-12',
            updator: 'Nguyễn Quang Đăng',
            ticket: {
                note: 'Chú thích yêu cầu'
            },
            appointment: {
                id: "1"
            },
            record: ''
        },
        {
            id: "4",
            direction: 0,
            state: 'served',
            phoneNumber: '0394093333',
            ringGroup: '1',
            createdTime: '2019-11-12',
            updator: 'Nguyễn Quang Đăng',
            ticket: {
                note: 'Chú thích yêu cầu'
            },
            appointment: {
                id: "1"
            },
            record: ''
        },
        {
            id: "5",
            direction: 0,
            state: 'missed',
            phoneNumber: '0394093333',
            ringGroup: '1',
            createdTime: '2019-11-12',
            updator: 'Nguyễn Quang Đăng',
            ticket: {
                note: 'Chú thích yêu cầu'
            },
            appointment: {
                id: "1"
            },
            record: ''
        }
    ],
    callsEvents: [
        {
            id: "1",
            direction: 0,
            state: 'up',
            phoneNumber: '0394093333',
            ringGroup: '1',
            createdTime: '2019-11-12',
            extension: '1000',
            customer: {
                name:"Nguyễn Tuấn DŨng"
            }
        },
        {
            id: "2",
            direction: 0,
            state: 'ring',
            phoneNumber: '0394093333',
            ringGroup: '1',
            createdTime: '2019-11-12',
            extension: '1000',
            customer: {
                name:"Bùi Thanh Hằng"
            }
        },
        {
            id: "3",
            direction: 0,
            state: 'down',
            phoneNumber: '0394093333',
            ringGroup: '1',
            createdTime: '2019-11-12',
            extension: '1000',
            customer: {
                name:"Phạm Văn Trọng"
            }
        },
        {
            id: "4",
            direction: 0,
            state: 'busy',
            phoneNumber: '0394093333',
            ringGroup: '1',
            createdTime: '2019-11-12',
            extension: '1000',
            customer: {
                name:"Mạc Văn Thông"
            }
        },
    ]
}



mock.onGet('/api/calls').reply(() => {
    return [200, callDB.calls];
});
mock.onGet('/api/calls/in').reply(() => {

    const response = _.find(callDB.calls, { 'direction': 0 });
    return [200, response];
});
mock.onGet('/api/calls/out').reply(() => {

    const response = _.find(callDB.calls, { 'direction': 1 });
    return [200, response];
});

mock.onGet('/api/calls/miss').reply(() => {
    const response = _.find(callDB.calls, { 'state': 'missed' });
    return [200, response];
});

mock.onGet('/api/calls/events').reply(() => {
    const response = callDB.callsEvents;
    return [200, response];
});