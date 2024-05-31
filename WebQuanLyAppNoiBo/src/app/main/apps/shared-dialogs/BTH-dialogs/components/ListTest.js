import React, { useCallback} from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, Icon, IconButton } from '@material-ui/core';
import {useForm, useUpdateEffect} from '@fuse/hooks';
import ListTestItem from './ListTestItem'

function ListTest(props) {
    const { onListTestChange, unitResults } = props;
    const { form, setInForm, setForm } = useForm(unitResults);

    useUpdateEffect(() => {
        onListTestChange(form);
    }, [form, onListTestChange]);


    const handleListItemChange = useCallback((item, index) => {
        setInForm(`[${index}]`, item);
    }, [setInForm]);

    function handleListItemRemove(index)
    {
        unitResults.splice(index, 1);
        setInForm('unitResults', unitResults);
    }
    function handleListItemAdd()
    {
        var item = {
            name: "",
            method: "",
            unit: "",
            value: "",
            state: "",
            sample:"",
            standard: "",
            femaleStandard: "",
            maleStandard:""
        }
        setForm([...unitResults,item])
    }
    return (
        <Table size="small" style={{border: '1px solid lightgray'}} className = "el-ListTest-Cover">
            <TableHead>
                <TableRow style={{border: '1px solid lightgray'}}>
                    <TableCell style = {{border: '1px solid lightgray' }}>
                        <div style = {{ textAlign: "center" }}>#</div>
                    </TableCell>
                    <TableCell style = {{border: '1px solid lightgray' }}>
                        <div style = {{ textAlign: "center" }}>Tên xét nghiệm</div>
                    </TableCell>
                    <TableCell style = {{border: '1px solid lightgray' }}>
                        <div style = {{ textAlign: "center" }}>Phương pháp xét nghiệm</div>
                    </TableCell>
                    <TableCell style = {{border: '1px solid lightgray' }}>
                        <div style = {{ textAlign: "center" }}>Loại mẫu</div>
                    </TableCell>
                    <TableCell style = {{border: '1px solid lightgray' }}>
                        <div style = {{ textAlign: "center" }}>Đơn vị lấy mẫu</div>
                    </TableCell>
                    <TableCell style = {{border: '1px solid lightgray' }}>
                        <div style = {{ textAlign: "center" }}>Kết quả</div>
                    </TableCell>
                    <TableCell style = {{border: '1px solid lightgray' }}>
                        <div style = {{ textAlign: "center" }}>Chỉ số bình thường (chung/nam/nữ)</div>
                    </TableCell>
                    <TableCell style = {{border: '1px solid lightgray' }}>
                        <div style = {{ textAlign: "center" }}>Đánh giá kết quả</div>
                    </TableCell>
                    <TableCell style = {{border: '1px solid lightgray' }}>
                        <IconButton onClick={() => handleListItemAdd()}>
                            <Icon className = "text-blue">
                                add_circle
                            </Icon>
                        </IconButton>
                    </TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {
                    unitResults.map((unit, index) => <ListTestItem key ={index} index={index} onListItemChange={handleListItemChange} onListItemRemove={handleListItemRemove} unit={unit}/>)
                }
            </TableBody>
        </Table>
    )
}
export default ListTest;
