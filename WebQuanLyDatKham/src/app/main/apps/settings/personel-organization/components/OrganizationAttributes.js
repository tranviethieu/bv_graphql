export const organizationAttributes = [
    {
        name: 'name',
        label: 'Tên menu'        
    },
    {
        name:'description',
        label: 'Mô tả chức năng',
        
    },
    {
        label: 'Thứ tự',
        name: 'priority',
        type: 'number',
        gridItem: {
            md: 6, xs: 12, sm: 12
        }
    },
    {
        name: 'leaderId',
        label: 'Trưởng bộ phận',
        type: 'select',
        gridItem: {
            md: 6, xs: 12, sm: 12
        }
    },
    {
        name: 'parentId',
        label: 'Tổ chức cấp cha',
        type: 'select'        
    },
]