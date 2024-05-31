export const filterAttributes = [
    {
        name: 'state',
        label: "Tình trạng khám",
        type: "select",
        options: [
            {
                value: "APPROVE",
                label:"Đã duyệt"
            },
            {
                value: "SERVED",
                label:"Đã đến khám"
            },
            {
                value: "WAITING",
                label:"Chưa xác nhận"
            },
            {
                value: "CANCEL",
                label:"Hủy khám"
            }
        ]
    },
    {
        name: 'appointmentDate',
        label: "Thời gian khám",
        type: "date"
    }
]
