export const filterAttributes = [
    {
        name: 'state',
        label: "Tình trạng khám",
        type: "checkbox",
        defaultValue:["APPROVE", "WAITING"],
        options: [
            {
                value: "APPROVE",
                label:"Chưa tới khám"
            },
            {
                value: "SERVED",
                label:"Đã phục vụ"
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
    }
]
