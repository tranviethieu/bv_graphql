import { menuAttributes } from './MenuAttributes';

export const exportMenuColumns = [{ title: "Id", value: "_id" },{title:"Level",value:"level"}, ...menuAttributes.map(m => ({
    title: m.label,
    value: row => row[m.name].toString(),
    type: m.type,
    isMulti:m.isMulti
}))
]
export const importMenuColumns = [{ Header: "Id", accessor: "_id"},{Header:"Level",accessor:"level"}, ...menuAttributes.map(m => ({
    Header: m.label,
    accessor: m.name,
    type: m.type,
    isMulti:m.isMulti
}))
]