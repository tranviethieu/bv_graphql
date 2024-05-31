import mock from './../mock';
import _ from '@lodash';

const ticketsDB = {
    tickets: [
        {
            'id': '1',
            'customer': {
                name: 'Phạm Văn Trọng',
                phoneNumber:'0123465687'
            },
            title: "Có lỗi trong giao dịch",
            content: "Gửi giao dịch có vấn đề nên không thanh toán được",
            sendedDate: '2019-11-20',
            sendedTime: '08:00',
            department: 'Chuẩn đoán trước sinh',
            channel: "Web",
            state:'remaining' //chưa xử lý
        },
        {
            'id': '2',
            'customer': {
                name: 'Nguyễn Quang Đăng',
                phoneNumber:'016335263'
            },
            title: "Có lỗi trong giao dịch",
            content: "Gửi giao dịch có vấn đề nên không thanh toán được",
            sendedDate: '2019-11-20',
            sendedTime: '08:00',
            department: 'Chuẩn đoán trước sinh',
            channel: "Web",
            state:'done' 
        },
        {
            'id': '3',
            'customer': {
                name: 'Nguyễn Trần Trung Quân',
                phoneNumber:'0982396822'
            },
            title: "Có lỗi trong giao dịch",
            content: "Gửi giao dịch có vấn đề nên không thanh toán được",
            sendedDate: '2019-11-20',
            sendedTime: '08:00',
            department: 'Chuẩn đoán trước sinh',
            channel: "Web",
            state:'pending' 
        }
    ]
}

mock.onGet('/api/tickets').reply(() => {
    return [200, ticketsDB.tickets];
});
mock.onGet('/api/ticket').reply((request) => {
    const {id} = request.params;
    const response = _.find(ticketsDB.tickets, {id});
    return [200, response];
});
