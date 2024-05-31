export const filterAttributes = [

  {
      name: 'departmentId',
      label: "Khoa khám",
      type: "select",
      className: "md:w-1/4 sm:w-1/4 mt-4 mr-8",
      isClearable: true
  },
  {
      name: 'appointmentDate',
      label: "Ngày đặt khám",
      type: "date",
      className: "md:w-1/4 sm:w-1/4 mt-8 mr-8",
  },
    {
        name: 'state',
        label: "Tình trạng khám",
        type: "checkbox",
        defaultValue:["APPROVE", "WAITING"],
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
]
export const filterAttributesNoDate = [

  {
      name: 'departmentId',
      label: "Khoa khám",
      type: "select",
      className: "md:w-1/3 sm:w-1/3 mt-4 mr-8",
      isClearable: true
  },
    {
        name: 'state',
        label: "Tình trạng khám",
        type: "checkbox",
        defaultValue:["APPROVE", "WAITING"],
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
]
