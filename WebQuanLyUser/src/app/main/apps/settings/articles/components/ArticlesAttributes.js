
export const articleAttributes = [
    {
        name: 'title',
        label: 'Tiêu đề bài viết',
        gridItem: {
            md: 6
        }
    },
    {
        name: 'type',
        label: 'Loại bài viết',
        gridItem: {
            md: 6
        },
        type: 'select',
        options: [
            //   {value:"ADMIN_TUTORIAL",label:"HDSD Admin"},
            //   {value:"USER_TUTORIAL",label:"HDSD Người dùng"},
            //   {value:"USER_NEWS",label:"Tin tức người dùng"},
            //   {value:"INTERNAL_NEWS",label:"Tin tức nội bộ"},
            //   {value:"USER_PROMOTION",label:"Quảng cáo người dùng"},

            { value: "USER_TUTORIAL", label: "HDSD Người dùng" },
            { value: "USER_NEWS", label: "Tin tức người dùng" },
            { value: "USER_PROMOTION", label: "Quảng cáo người dùng" },
        ]
    },
    {
        name: 'active',
        label: 'Hoạt động',
        type: 'checkbox',
    },
    {
        name: 'thumbImageId',
        maxFiles: 1,
        label: 'Ảnh thumb',
        type: "files",
        gridItem: {
            md: 6
        }
    },
    {
        name: 'coverImageId',
        label: 'Ảnh nền',
        maxFiles: 1,
        type: "files",
        gridItem: {
            md: 6
        }
    },
    {
        name: 'shortDesc',
        label: 'Tóm tắt',
        type: "editor"
    },
    {
        name: 'content',
        label: 'Nội dung',
        type: "editor"
    },
]
const filterIds = ["type"]
const filterAttributes = articleAttributes.filter((item) => filterIds.includes(item.name));
