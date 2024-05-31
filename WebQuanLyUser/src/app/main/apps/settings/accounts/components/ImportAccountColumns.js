
export const importAccountColumns = [
    {
        Header: "Mã NV",
        accessor:"code"
    },
    {
        Header: "Họ và tên",
        accessor:"fullName"
    },
    {
        Header: "Tên đăng nhập",
        accessor:"userName"
    },
    {
        Header: "Số điện thoại",
        accessor:"phoneNumber"
    },
    {
        Header: "Email",
        accessor:"email"
    },
    {
        Header: "Chức danh",
        accessor:"work"
    },
    {
        Header: "Danh xưng",
        accessor:"title"
    },    
    {
        Header: "Năm sinh",
        accessor: "birthday",
        type:'date'
    },
    {
        Header: "Khoa",
        accessor:"departmentName"
    },
    {
        Header: "Số máy lẻ",
        accessor:"sipPhone"
    },
    {
        Header: "Mật khẩu tổng đài",
        accessor:"sipPassword"
    },
    {
        Header: "Nhánh",
        accessor:"sipPhones"
    },
    {
        Header: "Mật khẩu hệ thống",
        accessor:"passwordHash"
    }
]
export const exportAccountColumns = importAccountColumns.map(item => ({
    title: item.Header,
    value: item.accessor,
    width:200
}))