import mock from '../mock';
// import _ from '@lodash';

const surveyDB={
    surveys:[
        {
            id: '1',
            name: 'Hỗ trợ sinh sản',
            createdTime: "2019-11-11",
            createdBy: {
                fullName:"Hoàng Nhật Minh"
            },
            description:"Khảo sát mức độ hài lòng của khách hàng"
        },
        {
            id: '2',
            name: 'Chuẩn đoán trước sinh',
            createdTime: "2019-11-11",
            createdBy: {
                fullName:"Hoàng Nhật Minh"
            },
            description:"Khảo sát mức độ hài lòng của khách hàng"
        },
        {
            id: '3',
            name: 'Chăm sóc & Điều trị SS',
            createdTime: "2019-11-11",
            createdBy: {
                fullName:"Hoàng Nhật Minh"
            },
            description:"Khảo sát mức độ hài lòng của khách hàng"
        },
        {
            id: '4',
            name: 'Khám chuyên sâu',
            createdTime: "2019-11-11",
            createdBy: {
                fullName:"Hoàng Nhật Minh"
            },
            description:"Khảo sát mức độ hài lòng của khách hàng"
        },
        {
            id: '5',
            name: 'Tự nguyện',
            createdTime: "2019-11-11",
            createdBy: {
                fullName:"Hoàng Nhật Minh"
            },
            description:"Khảo sát mức độ hài lòng của khách hàng"
        },
    ]
}

mock.onGet('/api/surveys').reply(() => {
    return [200, surveyDB.surveys];
});