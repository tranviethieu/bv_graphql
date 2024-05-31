
export const accountAttributes = [
    {
        name: '_id',
        label: 'Chọn tài khoản',
        type: 'select', 
        onChange: (form, value) => {
            // console.log("chonj tai khoan:", value);
            form.userName = value.userName;
            form.fullName = value.fullName;
            form.code = value.code;
            form.work = value.work;
            form.birthday = value.birthday;
            form.departmentId =value.departmentId
        }
    },  
    {
        name: 'fullName',
        label: 'Tên nhân viên',
        gridItem: {
            md:6
        }
    },
    {
        name: 'userName',
        label: 'Tên đăng nhập',
        gridItem: {
            md:6
        }
    },
    {
        name: 'code',
        label: 'Mã nhân viên',
        gridItem: {
            md:4
        }
    },
    {
        name: 'work',
        label: 'Chức danh',
        gridItem: {
            md:4
        }
    },
    {
        name: 'birthday',
        label: 'Năm sinh',
        type:'date',
        gridItem: {
            md:4
        }
    },
    {
        name: 'departmentId',
        label: 'Khoa',
        type: 'select',
        gridItem: {
            md:6
        }
    },
    {
        name: 'accountGroupIds',
        label: 'Loại tài khoản',
        type: 'select',
        isMulti: true,
        gridItem: {
            md:6
        }
    },
    
    {
        name: 'sipPhone',
        label: 'số máy nhánh',
        gridItem: {
            md:4
        }
    },
    {
        name: 'sipPassword',
        label: 'mật khẩu máy nhánh',
        gridItem: {
            md:4
        }
    },
    {
        name: 'sipPhones',
        label: 'Các kênh thoại được phép theo dõi',
        type: "select",
        isMulti:true,
        gridItem: {
            md:4
        }
    },
    {
        name: 'organizationIds',
        label: 'Nhóm giao việc',
        type: 'select',
        isMulti: true,        
    },
]