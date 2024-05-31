import React from 'react';
import { Icon, TextField, TableCell, TableRow, IconButton } from '@material-ui/core'
import { useForm,useUpdateEffect } from '@fuse/hooks'

function ListTestItem(props) {
    const { onListItemChange, onListItemRemove,index } = props;
    const { form, handleChange } = useForm(props.unit);

    useUpdateEffect(() => {
        onListItemChange(form, index);
    }, [form, index, onListItemChange]);
    return (
            <TableRow className = "el-ListTestItem">
              <TableCell style = {{border: '1px solid lightgray' }}>
                {index + 1}
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
                  name="method"
                  value={form.method}
                  variant="outlined"
                  onChange={handleChange}
                  margin="dense"
                />
              </TableCell>
              <TableCell style = {{border: '1px solid lightgray' }}>
                <TextField
                  name="sample"
                  value={form.sample}
                  variant="outlined"
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
                  name="value"
                  value={form.value}
                  variant="outlined"
                  onChange={handleChange}
                  margin="dense"
                />
              </TableCell>
              <TableCell style = {{border: '0px solid lightgray', display: "flex" }}>
                <TextField
                  name="standard"
                  value={form.standard}
                  variant="outlined"
                  onChange={handleChange}
                  margin="dense"
                />
                <TextField
                  name="maleStandard"
                  value={form.maleStandard}
                  className = "ml-2"
                  variant="outlined"
                  onChange={handleChange}
                  margin="dense"
                />
                <TextField
                  name="femaleStandard"
                  value={form.femaleStandard}
                  className = "ml-2"
                  variant="outlined"
                  onChange={handleChange}
                  margin="dense"
                />
              </TableCell>
              <TableCell style = {{border: '1px solid lightgray' }}>
                <TextField
                  name="state"
                  value={form.state}
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
export default ListTestItem;
