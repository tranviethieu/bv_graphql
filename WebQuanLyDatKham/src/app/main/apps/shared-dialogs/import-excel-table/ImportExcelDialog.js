import React, { useState, useEffect } from 'react';
import { useForm } from '@fuse/hooks';
import { Icon, Button, IconButton, FormGroup, Input, InputLabel, NativeSelect, Typography } from '@material-ui/core';
import ReactTable from 'react-table';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import { useDispatch } from 'react-redux';
import * as Actions from '../actions';
import _ from '@lodash';
import { ExcelRenderer } from "react-excel-renderer";
import moment from 'moment'

function isInt(n){
    return Number(n) === n && n % 1 === 0;
}

function isFloat(n){
    return Number(n) === n && n % 1 !== 0;
}
export const getJsDateFromExcel = excelDate => {
     if(excelDate){
       if(isInt(excelDate) || isFloat(excelDate) || Number.isInteger(excelDate) || excelDate.includes("/")){
         // if(moment(new Date((excelDate - (25567 + 1)) * 86400 * 1000)).isValid()){
         //   return moment(new Date((excelDate - (25567 + 1)) * 86400 * 1000)).format("YYYY-MM-DD");
         // }
         // else{
         //   return ""
         // }
         // if(!excelDate.includes('-')){
         return moment().format("YYYY-MM-DD")
       }
       else{
         return new Date(excelDate)
       }
     }
};
export default function ImportExcelDialog({ title, subtitle, columns, submit, ...props }) {
    const dispatch = useDispatch();
    const [data, setData] = useState([]);
    const [rows, setRows] = useState([]);//cai nay la du lieu tho
    const [message, setMessage] = useState(null);
    const [editableColumns, setEditableColumns] = useState([]);
    ///ddinh nghia map ten columns va ten cell
    const { form, handleChange, setInForm, setForm } = useForm({});
    const [type, setType] = useState({});//dinh nghia kieu du lieu
    const handleClose = () => {
        dispatch(Actions.hideDialog('quick-table-dialog'));
    };
    function handleColSelectChange(oriIndex, e) {
        if (!e.target.value || e.target.value.length == 0) {
            setInForm(e.target.name, oriIndex)
        } else
            handleChange(e);
    }
    useEffect(() => {
        // console.log("colums change:",columns);
        columns.forEach(function (col, index) {
            const showInput = typeof (col.accessor) == "string";

            form[col.accessor] = index.toString();
            if(col.type)
                type[col.accessor] = col.type==="select"?(col.isMulti?"array":"string"):col.type;

            editableColumns.push({ ...col, Header: !showInput ? col.Header : <Input placeholder={index+ ':'+col.Header} className="w-full" value={index.toString} name={col.accessor} onChange={e=>handleColSelectChange(index.toString(),e)} /> })
        })
        setEditableColumns([...editableColumns]);
        setForm({ ...form });
        setType({ ...type });
    }, []);

    useEffect(() => {
        const data = [];
        if (rows) {
            const formKeys = Object.keys(form);
            // console.log("type=", type);
            rows.forEach(function (row) {
                if(row.length > 0){
                  const item = {};
                  formKeys.forEach(function (k) {
                      const value = row[form[k]];
                      if (type[k]) {
                          switch (type[k].toLowerCase()) {
                              case 'checkbox':
                                  item[k] = value=="true"||value=="True";
                                  break;
                              case 'number':
                                  item[k] = parseFloat(value);
                                  break;
                              case 'array':
                                  if(value)
                                      item[k] =value.split(',').filter(i=>i.trim().length>0);
                                  break;
                              case 'date':
                                  item[k] = getJsDateFromExcel(value);
                                  break;
                              default://string
                                  item[k] = value&&value.toString();
                                  break;
                          }
                      }else
                          item[k] = value&&value.toString();
                  })
                  data.push(item);
                }
              })
            // data.splice(0,2)
            setData(data);

        }
    }, [rows, form,type]);

    function checkFile(file) {
        let errorMessage = "";
        if (!file || !file[0]) {
            return;
        }
        const isExcel =
            file[0].type === "application/vnd.ms-excel" ||
            file[0].type ===
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        if (!isExcel) {
            errorMessage = "You can only upload Excel file!";
        }
        // console.log("file", file[0].type);
        const isLt2M = file[0].size / 1024 / 1024 < 2;
        if (!isLt2M) {
            errorMessage = "File must be smaller than 2MB!";
        }
        // console.log("errorMessage", errorMessage);
        return errorMessage;
    }
    const fileHandler = fileList => {
        // console.log("fileList", fileList);
        let fileObj = fileList;
        if (!fileObj) {
            setMessage("No file uploaded!")
            return false;
        }
        // console.log("fileObj.type:", fileObj.type);
        if (
            !(
                fileObj.type === "application/vnd.ms-excel" ||
                fileObj.type ===
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            )
        ) {
            setMessage("Unknown file format. Only Excel files are uploaded!");
            return false;
        }
        //just pass the fileObj as parameter
        ExcelRenderer(fileObj, (err, resp) => {
            if (err) {
                // console.log(err);
            } else {
                setRows(resp.rows.slice(1));
            }
        });
        return false;
    };

    const handleSubmit = async () => {
        if (submit) {
            submit(data);
        }
        handleClose();
    };
    // const handleDelete = key => {
    //     const rows = [...this.state.rows];
    //     this.setState({ rows: rows.filter(item => item.key !== key) });
    // };
    // const handleAdd = () => {
    //     const { count, rows } = this.state;
    //     const newData = {
    //         key: count,
    //         name: "User's name",
    //         age: "22",
    //         gender: "Female"
    //     };
    //     this.setState({
    //         rows: [newData, ...rows],
    //         count: count + 1
    //     });
    // };
    return (
        <Card className={props.className}>
          <CardHeader className="el-CardHeader-FU"
            action={
              <IconButton aria-label="settings" onClick={handleClose}>
                <Icon>close</Icon>
              </IconButton>
            }
            title={title}
            subheader={subtitle}
          />
          <CardContent className="el-CardContent-FU">
            {message && <Typography className="text-12 text-red">{message}</Typography>}
            <input
              accept="*"
              className="hidden"
              id="btn-upload-file"
              //multiple
              type="file"
              onChange={e => { fileHandler(e.target.files[0]) }}
            />
            <div className="flex p-12 flex-row">
              <label htmlFor="btn-upload-file">
                <Button component="span">
                  <Icon className =  "mr-4">cloud_upload</Icon>
                  Click để tải lên file Excel
                </Button>
              </label>
              <Button variant="contained" className="whitespace-no-wrap btn-blue" disabled={!data||data.length==0} onClick={handleSubmit}>
                Lưu
              </Button>
            </div>
            <ReactTable
              className="-striped -highlight w-full sm:rounded-8"
              data={data}
              defaultPageSize={20}
              sortable={false}
              getTdProps={() => ({
                style: { border: `none` },
              })}
              columns={[
                {
                  Cell: row => <IconButton onClick={() => {

                    if (data.length > row.index) {
                      data.splice(row.index, 1);
                      // console.log("newdata:", newData);
                      setData([...data]);
                    }
                  }}><Icon>delete</Icon></IconButton>,
                  width:60
                },
              ...editableColumns]}
            />
          </CardContent>
            <CardActions>
                <Button color="default" onClick={handleClose}>
                    Đóng
                </Button>
            </CardActions>
        </Card>
    )
}
