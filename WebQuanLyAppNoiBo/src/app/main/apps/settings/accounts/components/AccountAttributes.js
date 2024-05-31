
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
            md:3
        }
    },
    {
        name: 'userName',
        label: 'Tên đăng nhập',
        gridItem: {
            md:3
        }
    },
    {
        name: 'address',
        label: 'Địa chỉ',
        gridItem: {
            md:3
        }
    },
    {
        name: 'gender',
        label: 'Giới tính',
        type: 'select',
        options: [
          {value: "male", label: "Nam"},
          {value: "female", label: "Nữ"}
        ],
        gridItem: {
            md:3
        }
    },
    {
        name: 'nationIdentity',
        label: 'CMND',
        gridItem: {
            md:3
        }
    },
    {
        name: 'code',
        label: 'Mã nhân viên',
        gridItem: {
            md:3
        }
    },
    {
        name: 'work',
        label: 'Chức danh',
        gridItem: {
            md:3
        }
    },
    {
        name: 'birthday',
        label: 'Năm sinh',
        type:'date',
        gridItem: {
            md:3
        }
    },
    {
        name: 'title',
        label: 'Trình độ',
        gridItem: {
            md:6
        }
    },
    {
        name: 'certificate',
        label: 'Chứng chỉ hành nghề',
        gridItem: {
            md:6
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
