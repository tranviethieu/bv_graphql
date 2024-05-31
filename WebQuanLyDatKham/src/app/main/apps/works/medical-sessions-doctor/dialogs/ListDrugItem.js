import React from 'react';
import { Icon, TextField, TableCell, TableRow, IconButton } from '@material-ui/core'
import { useForm,useUpdateEffect } from '@fuse/hooks'
function ListDrugItem(props) {
    const { onListItemChange, onListItemRemove,index } = props;
    // const classes = useStyles(props);
    const { form, handleChange } = useForm(props.drug);

    useUpdateEffect(() => {
        onListItemChange(form, index);
    }, [form, index, onListItemChange]);
    return (
        <TableRow className = "el-ListDrugItem-cover">
          <TableCell style = {{border: '1px solid lightgray' }}>
            {index + 1}
          </TableCell>
          <TableCell style = {{border: '1px solid lightgray' }}>
            <TextField
              variant="outlined"
              name="code"
              value={form.code}
              onChange={handleChange}
              margin="dense"
            />
          </TableCell>
          <TableCell style = {{border: '1px solid lightgray' }}>
            <TextField
              variant="outlined"
              name="name"
              value={form.name}
              onChange={handleChange}
              margin="dense"
            />
          </TableCell>
          <TableCell style = {{border: '1px solid lightgray' }}>
            <TextField
              name="unit"
              value={form.unit}
              variant="outlined"
              onChange={handleChange}
              margin="dense"
            />
          </TableCell>
          <TableCell style = {{border: '1px solid lightgray' }}>
            <TextField
              name="amount"
              value={form.amount}
              variant="outlined"
              onChange={handleChange}
              margin="dense"
            />
          </TableCell>
          <TableCell style = {{border: '1px solid lightgray' }}>
            <TextField
              name="instruction"
              value={form.instruction}
              variant="outlined"
              onChange={handleChange}
              margin="dense"
            />
          </TableCell>
          <TableCell style = {{border: '1px solid lightgray' }}>
            <IconButton onClick={e=> onListItemRemove(index)}>
              <Icon>delete</Icon>
            </IconButton>
          </TableCell>
        </TableRow>
    )
}
export default ListDrugItem;
