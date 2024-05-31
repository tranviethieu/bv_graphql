export const filterAttributes = [
    {
        name: 'process',
        label: "Tình trạng",
        type: "select",
        defaultValue:"",
        options: [
            {
                value: "IN_QUEUE",
                label:"Chờ khám"
            },
            {
                value: "WATING_CONCLUSION",
                label:"Chờ kết luận khám"
            },
            {
                value: "CONCLUSION",
                label:"Đã có kết luận khám"
            },
            {
                value: "CANCEL",
                label:"Hủy khám"
            }
        ]
    }
]
