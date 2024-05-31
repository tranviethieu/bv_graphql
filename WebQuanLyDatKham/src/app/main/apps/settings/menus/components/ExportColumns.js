import moment from 'moment';
import _ from 'lodash';
export const exportColumns = [    
    {
        title: 'Tên chức năng',
        value: 'name',
        width:200
    },
    {
        title: 'Menu cấp cha',
        value: (row) => row.parent.name,
        width:200
    },
    {
        title: 'Đường dẫn menu',
        value: 'fullName',
        width:550
    },
    {
        title: 'Tiến độ',
        value:'process'        
    },  
    {
        title: 'EffortHour',
        value:'effortHour'        
    },
    {
        title: 'Completed Hour',
        value: (row)=>(row.process==100?row.effortHour:0),        
    },
    {
        title: 'Remained Hour',
        value: (row)=>(row.process<100?row.effortHour:0),        
    },
    {
        title: 'Hệ số giờ',
        value: (row)=>(row.developers? _.sumBy(row.developers,function(o){return o.rank}):1)
    },
    {
        title: 'Giờ (x) Hệ số',
        value: (row)=>row.totalEffortHour|| (row.effortHour*(row.developers? _.sumBy(row.developers,function(o){return o.rank}):1))
    },
    {
        title: 'Developers',
        value: (row) => row.developers && row.developers.map(d => (d.name)).join()      
    }
    
]