

export const menuAttributes = [
    
    {
        name: 'name',
        label: 'Tên menu',
        gridItem: {
            md: 4, xs: 12, sm: 12
        }
    },
    {
        name: 'icon',
        label: 'Icon',
        type: 'select',
        gridItem: {
            md: 4, xs: 12, sm: 12
        }
    },
    {
        name: 'parentId',
        label: 'Menu cha',
        type: 'select',
        gridItem: {
            md: 4, xs: 12, sm: 12
        }
    },
    {
        name: 'type',
        label: 'Loại menu',
        type: 'select',
        options: ["TAB", "ITEM", "GROUP", "COLLAPSE", "SHORTCUT", "CONTROLLER", "LINK", "DIVIDER"].map(item => ({ value: item, label: item })),
        gridItem: {
            md: 4, xs: 12, sm: 12
        }
    },
    {
        name: 'priority',
        label: 'Thứ tự hiển thị cùng cấp',
        type: 'number',
        gridItem: {
            md: 4, xs: 12, sm: 12
        }
    },
    {
        name: 'path',
        label: 'Đường dẫn',
        displayOption: (data) => data.type === "ITEM" || data.type === "GROUP" || data.type === "LINK" || data.type === "TAB" || data.type === "SHORTCUT",
        gridItem: {
            md: 4, xs: 12, sm: 12
        }
    },
    {
        name: 'shortcutAction',
        label: 'Biến hỗ trợ hành động',
        displayOption: (data) => data.type === "SHORTCUT"
    },
    {
        name: 'permissions',
        label: 'Quyền hiển thị menu',
        type: 'select',
        isMulti: true,
        gridItem: {
            md: 4, xs: 12, sm: 12
        }
    },
    {
        name: 'subPermissions',
        label: 'Quyền phụ',
        type: 'select',
        isMulti: true,
        gridItem: {
            md: 4, xs: 12, sm: 12
        }
    },
    {
        name: 'selfService',
        label: 'Menu cho 1 nhân viên cơ bản',
        type: 'checkbox',
        gridItem: {
            md: 4, xs: 12, sm: 12
        }
    },
    {
        name: 'description',
        label: 'Mô tả'
    },   
    {
        name: "projectId",
        label: "Dự án",
        type:'select'
    },
    {
        name: 'costNode',
        label: 'Tính chi phí thời gian',
        type: 'checkbox'
       
    },
    {
        name: 'effortHour',
        label: 'Chi phí thời gian theo giờ',
        type: 'number',
        displayOption: (data) => data.costNode === true,
        gridItem: {
            md: 4, xs: 12, sm: 12
        }
    },
    {
        name: 'devIds',
        label: 'Nhân sự làm',
        type: 'select',
        isMulti:true,
        displayOption: (data) => data.costNode === true,
        gridItem: {
            md: 4, xs: 12, sm: 12
        }
    },
    {
        name: 'process',
        label: 'Tiến độ hiện tại',
        type: 'number',
        displayOption: (data) => data.costNode === true,
        gridItem: {
            md: 4, xs: 12, sm: 12
        }
    },    
    {
        name: 'startTime',
        label: 'Thời gian bắt đầu dự kiến',
        type: 'date',
        displayOption: (data) => data.costNode === true,
        gridItem: {
            md: 6
        }
    },
    {
        name: 'deathline',
        label: 'Thời gian hoàn thành dự kiến',
        type: 'date',
        displayOption: (data) => data.costNode === true,
        gridItem: {
            md: 6
        }
    },
]