export const filterAttributes = [
    {
        name: 'state',
        label: "Tình trạng khám",
        type: "checkbox",
        defaultValue: ["ASSIGN", "PROCESSING"],
        options: [
            {
                value: "ASSIGN",
                label:"Chưa tiếp nhận"
            },
            {
                value: "PROCESSING",
                label:"Đang thực hiện"
            },
            {
                value: "COMPLETE",
                label:"Đã hoàn thành"
            },
            {
                value: "CANCEL",
                label:"Đã hủy"
            }
        ]
    }
]
