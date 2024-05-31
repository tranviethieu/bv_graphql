
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
        Header: "Địa chỉ",
        accessor:"address"
    },
    {
        Header: "Giới tính (Nam:0 || Nữ: 1)",
        accessor:"gender"
    },
    {
        Header: "CMND",
        accessor:"nationIdentity"
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
        Header: "Trình độ",
        accessor:"title"
    },
    {
        Header: "Chứng chỉ hành nghề",
        accessor:"certificate"
    },
    {
        Header: "Năm sinh (YYYY-MM-DD)",
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
]
export const exportAccountColumns = importAccountColumns.map(item => ({
    title: item.Header,
    value: item.accessor || "",
    width:200
}))
