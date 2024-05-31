import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { confirmable } from 'react-confirm';
import showMessage from  'components/Confirmation';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Form, Input } from 'reactstrap'; // your choice.
import { createConfirmation } from 'react-confirm';
import UploadFileForm from 'components/Widget/UploadFileForm'
import { client } from 'utils/apolloConnect'
import authCheck from 'utils/authCheck'
import { Typography, Icon, IconButton } from '@material-ui/core';
import ReactTable from 'react-table';
import { useForm } from '../../hooks';
import { QUERY_PREVIEW_UPLOAD,UPDATE_UPLOADED_ACCOUNTS,REMOVE_UPLOADED_ACCOUNTS} from './query';
import { ExcelRenderer } from "react-excel-renderer";
import moment from 'moment'
import {importAccountColumns} from './components/ImportAccountColumns'

function isInt(n){
    return Number(n) === n && n % 1 === 0;
}

function isFloat(n){
    return Number(n) === n && n % 1 !== 0;
}
export const getJsDateFromExcel = excelDate => {
     if(excelDate){
       if(isInt(excelDate) || isFloat(excelDate)){
         return moment(new Date((excelDate - (25567 + 1)) * 86400 * 1000)).format("YYYY-MM-DD");
       }
       else{
         return new Date(excelDate)
       }
     }
};


function ImportModal(props) {
    const { dismiss, cancel } = props;
    const [ fileId, setFileId ] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [message, setMessage] = useState("")
    const [rows, setRows] = useState([])
    const [editableColumns, setEditableColumns] = useState([]);
    const { form, handleChange, setInForm, setForm } = useForm({});
    const [type, setType] = useState({});//dinh nghia kieu du lieu
    const [columns, setColumns] = useState(importAccountColumns)

    useEffect(()=>{
      setColumns(importAccountColumns)
    },[])

    function fetchUploadFile() {
        client.query({
            query: QUERY_PREVIEW_UPLOAD,
            variables:{fileId}
        }).then(result => {
            setAccounts(result.data.response.data);
        })
    }
    // function handleUpdateFiles(serverId) {
    //     try {
    //         setFileId(serverId);
    //     } catch (err) {
    //         console.log(err);
    //     }
    // }
    //
    // useEffect(() => {
    //     fetchUploadFile();
    // },[fileId]);
    function onUpdateAccount() {
        client.mutate({
            mutation: UPDATE_UPLOADED_ACCOUNTS,
            variables:{data:accounts}
        }).then(result => {
            if (result.data.response.data) {
                showMessage("cập nhật thành công").then(()=>dismiss());
            } else {
                showMessage(result.data.response.message);
            }
        })

    }
    // function onRemoveAccount() {
    //     client.mutate({
    //         mutation: REMOVE_UPLOADED_ACCOUNTS,
    //         variables:{data:accounts.map(a=>a.userName)}
    //     }).then(result => {
    //         if (result.data.response.data) {
    //             showMessage("xóa thành công").then(()=>dismiss());
    //         } else {
    //             showMessage(result.data.response.message);
    //         }
    //     })
    // }
    // const handleClose = () => {
    //     dispatch(Actions.hideDialog('quick-table-dialog'));
    // };
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
            setAccounts(data);

        }
    }, [rows, form,type]);
    const fileHandler = fileList => {
      // console.log("fileList", fileList);
      let fileObj = fileList;
      if (!fileObj) {
          setMessage("Không có file nào được tải lên!")
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
          setMessage("File không đúng định dạng. Vui lòng tải lên các file có định dạng file excel!");
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
      // if (submit) {
      //     submit(data);
      // }
      // handleClose();
  };
    return (
        <Modal toggle={dismiss} isOpen={true} size="lg">
          <ModalHeader toggle={dismiss}>Cập nhật danh sách chỉnh sửa</ModalHeader>
          <ModalBody>
            <Typography>Vui lòng tải và làm theo <a href="/import_account_template.xlsx">file mẫu</a></Typography>
            {message && <Typography className="text-12 text-red">{message}</Typography>}
            <div className="flex p-12 flex-row">
              <input
                accept="*"
                className="hidden label-upload"
                id="upload-photo"
                //multiple
                type="file"
                onChange={e => { fileHandler(e.target.files[0]) }}
              />
              <label for="upload-photo">
                <div
                  // style = {{ marginBottom: "10px", fontSize: "15px" }}
                  className = "btn-upload"
                >
                  Click để tải lên file Excel
                </div>
              </label>
            </div>
            <ReactTable
              className="-striped -highlight w-full sm:rounded-8"
              data={accounts}
              defaultPageSize={20}
              sortable={false}
              getTdProps={() => ({
                style: { border: `none` },
              })}
              columns={[
                {
                  Cell: row => <IconButton onClick={() => {

                    if (accounts.length > row.index) {
                      accounts.splice(row.index, 1);
                      // console.log("newdata:", newData);
                      setAccounts([...accounts]);
                    }
                  }}><Icon>delete</Icon></IconButton>,
                  width:60
                },
              ...editableColumns]}
            />
          </ModalBody>
          <ModalFooter>
            <div>
              <Button color='primary' disabled={!accounts||accounts.length===0} onClick={onUpdateAccount}>Cập nhật</Button>
            </div>
          </ModalFooter>
        </Modal>
    )

}

const confirm = createConfirmation(confirmable(ImportModal));
export default function (confirmMessage, options = {}) {
    // You can pass whatever you want to the component. These arguments will be your Component's props
    return confirm({ confirmMessage, options });
}
