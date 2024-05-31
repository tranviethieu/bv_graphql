export const filterAttributes = [
    {
        name: 'process',
        label: "Tình trạng",
        type: "checkbox",
        defaultValue:["IN_QUEUE","CONCLUSION","WATING_CONCLUSION","CANCEL"],
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
export const filterAttributesWithDate = [
  {
      name: 'createdTime',
      label: "Ngày tạo",
      type: "date",
      className: "md:w-1/3 sm:w-1/3 mt-8 mr-8",
  },
    {
        name: 'process',
        label: "Tình trạng",
        type: "checkbox",
        defaultValue:[],
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
