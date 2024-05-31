export const filterAttributes = [
    {
        name: 'state',
        label: "Tình trạng khám",
        type: "select",
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
    },
    // {
    //     name: 'state',
    //     label: "Tình trạng khám",
    //     type: "select",
    //     options: [
    //         {
    //             value: "APPROVE",
    //             label:"Chưa tới khám"
    //         },
    //         {
    //             value: "SERVED",
    //             label:"Đã phục vụ"
    //         },
    //         {
    //             value: "WAITING",
    //             label:"Chưa xác nhận"
    //         },
    //         {
    //             value: "CANCEL",
    //             label:"Hủy khám"
    //         }
    //     ]
    // },
    {
        name: 'appointmentDate',
        label: "Thời gian khám",
        type: "date"
    }
]
