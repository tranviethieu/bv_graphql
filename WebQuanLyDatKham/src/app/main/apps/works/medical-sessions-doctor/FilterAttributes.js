export const filterAttributes = [
    {
        name: 'process',
        label: "Tình trạng",
        type: "select",
        defaultValue:"",
        options: [
            {
                value: "IN_QUEUE",
                label:"Tới khám"
            },
            {
                value: "WATING_CONCLUSION",
                label:"Đang khám"
            },
            {
                value: "CONCLUSION",
                label:"Đã khám"
            },
            {
                value: "CANCEL",
                label:"Hủy khám"
            }
        ]
    }
]
