import mock from '../mock';
// import _ from '@lodash';

const departmentDB={
    departments:[
        {
            id: '1',
            name: 'Hỗ trợ sinh sản',
            timeFrame:['08:00','09:00','10:00','11:00','14:00','15:00',"16:00"]
        },
        {
            id: '2',
            name: 'Chuẩn đoán trước sinh',
            timeFrame:['08:00','09:00','10:00','11:00','14:00','15:00',"16:00"]
        },
        {
            id: '3',
            name: 'Chăm sóc & Điều trị SS',
            timeFrame:['08:00','09:00','10:00','11:00','14:00','15:00',"16:00"]
        },
        {
            id: '4',
            name: 'Khám chuyên sâu',
            timeFrame:['08:00','09:00','10:00','11:00','14:00','15:00',"16:00"]
        },
        {
            id: '5',
            name: 'Tự nguyện',
            timeFrame:['08:00','09:00','10:00','11:00','14:00','15:00',"16:00"]
        },
    ]
}

mock.onGet('/api/departments').reply(() => {
    return [200, departmentDB.departments];
});