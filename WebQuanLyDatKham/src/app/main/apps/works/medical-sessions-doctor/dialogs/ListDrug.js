import React, { useCallback } from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, Icon, IconButton } from '@material-ui/core';
import { useForm, useUpdateEffect } from '@fuse/hooks';
import ListDrugItem from './ListDrugItem'

function ListDrug(props) {
  const { onListDrugChange, drugs } = props;
  const { form, setInForm, setForm } = useForm(drugs);

  useUpdateEffect(() => {
    onListDrugChange(form);
  }, [form, onListDrugChange]);


  const handleListItemChange = useCallback((item, index) => {
    setInForm(`[${index}]`, item);
  }, [setInForm]);

  function handleListItemRemove(index) {
    drugs.splice(index, 1);
    setInForm('drugs', drugs);
  }
  function handleListItemAdd() {
    var item = {
      code: "",
      name: "",
      unit: "",
      amount: "",
      instruction: ""
    }
    setForm([...drugs, item])
  }
  return (
    <Table size="small" style={{ border: '1px solid lightgray' }} className="el-ListDrugCover">
      <TableHead>
        <TableRow style={{ border: '1px solid lightgray' }}>
          <TableCell style={{ border: '1px solid lightgray' }}>
            <div style={{ textAlign: "center" }}>#</div>
          </TableCell>
          <TableCell style={{ border: '1px solid lightgray' }}>
            <div style={{ textAlign: "center" }}>Mã thuốc</div>
          </TableCell>
          <TableCell style={{ border: '1px solid lightgray' }}>
            <div style={{ textAlign: "center" }}>Tên thuốc</div>
          </TableCell>
          <TableCell style={{ border: '1px solid lightgray' }}>
            <div style={{ textAlign: "center" }}>Đơn vị</div>
          </TableCell>
          <TableCell style={{ border: '1px solid lightgray' }}>
            <div style={{ textAlign: "center" }}>Liều lượng</div>
          </TableCell>
          <TableCell style={{ border: '1px solid lightgray' }}>
            <div style={{ textAlign: "center" }}>Chỉ định</div>
          </TableCell>
          <TableCell style={{ border: '1px solid lightgray' }}>
            <IconButton onClick={() => handleListItemAdd()}>
              <Icon className="text-blue">
                add_circle
              </Icon>
            </IconButton>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {
          drugs.map((drug, index) => {
            if (drug && drug.keyIndex) {
              return <ListDrugItem key={drug.keyIndex} index={index} onListItemChange={handleListItemChange} onListItemRemove={handleListItemRemove} drug={drug} />
            } else {
              var d = new Date();
              drug["keyIndex"] = d.getTime();
              return <ListDrugItem key={drug.keyIndex} index={index} onListItemChange={handleListItemChange} onListItemRemove={handleListItemRemove} drug={drug} />
            }
          })
        }
      </TableBody>
    </Table>
  )
}
export default ListDrug;
