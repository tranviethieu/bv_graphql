export const serviceOnDemandAttributes = [
  {
    name: "name",
    label: "Tên menu",
    gridItem: {
      md: 6,
      xs: 12,
      sm: 12,
    },
  },
  {
    // label: "Mã dịch vụ (ServicePriceRefID trên HIS)",
    label: "ID dịch vụ HIS",
    name: "hisServiceId",
    gridItem: {
      md: 6,
      xs: 12,
      sm: 12,
    },
  },
  {
    label: "Thứ tự hiển thị",
    name: "priority",
    type: "number",
    gridItem: {
      md: 6,
      xs: 12,
      sm: 12,
    },
  },
  {
    name: "parentId",
    label: "Dịch vụ cha",
    type: "select",
    gridItem: {
      md: 6,
      xs: 12,
      sm: 12,
    },
  },
  {
    name: "price",
    label: "Phí dịch vụ",
    type: "number",
    gridItem: {
      md: 6,
      xs: 12,
      sm: 12,
    },
  },
  // {
  //     name: 'allowPatientSeen',
  //     label: 'Hiển thị với bệnh nhân đặt khám',
  //     type:'checkbox',
  //     gridItem: {
  //       md: 6,
  //       xs: 12,
  //       sm: 12,
  //     }
  // },
  {
    name: "note",
    label: "Ghi chú hướng dẫn cho bệnh nhân",
    type: "editor",
  },
  {
    name: "departmentIds",
    label: "Khoa khám",
    type: "select",
    isMulti: true,
    remainOrder: true
  },
];
