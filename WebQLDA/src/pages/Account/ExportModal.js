import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { confirmable } from 'react-confirm';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Form, Input } from 'reactstrap'; // your choice.
import { createConfirmation } from 'react-confirm';
import { client } from 'utils/apolloConnect'
import authCheck from 'utils/authCheck'
import { QUERY_DEPARTMENTS } from './query';
import { Select } from '@material-ui/core';


function ExportModal(props) {
    const { dismiss, cancel } = props;
    const [departments, setDepartments] = useState([]);
    const [selectedId, setSelectedId] = useState('');
    useEffect(() => {
        client.query({
            query: QUERY_DEPARTMENTS
        }).then(result => {
            if (authCheck(result.data)) {
                setDepartments(result.data.response.data);
            }
        })
    }, [props])
    function onDownload() {
        window.location.href = `${process.env.REACT_APP_EXPORT_URL}/account?departmentId=${selectedId}`;
        dismiss();
    }

    return (
        <Modal toggle={dismiss} isOpen={true}>
            <ModalHeader toggle={dismiss}>Tải danh sách tài khoản</ModalHeader>
            <ModalBody>
                <Form>
                    <FormGroup>
                        <Select
                            native
                            className="mt-8 mb-16"
                            className="w-full"
                            onChange={e => setSelectedId(e.target.value)}
                        >
                            <option value="">Tất cả</option>
                            {
                                departments && departments.map((item, index) =>
                                    <option value={item._id} key={index}>{item.name}</option>
                                )
                            }
                        </Select>
                    </FormGroup>

                </Form>
            </ModalBody>
            <ModalFooter>
                <div>
                    <Button color='default' onClick={cancel}> Bỏ qua </Button>{' '}
                    <Button color='primary' onClick={onDownload}>Tải về</Button>
                </div>
            </ModalFooter>
        </Modal>
    )

}

ExportModal.propTypes = {
    show: PropTypes.bool,            // from confirmable. indicates if the dialog is shown or not.
    proceed: PropTypes.func,         // from confirmable. call to close the dialog with promise resolved.
    cancel: PropTypes.func,          // from confirmable. call to close the dialog with promise rejected.
    dismiss: PropTypes.func,         // from confirmable. call to only close the dialog.
    confirmation: PropTypes.string,  // arguments of your confirm function
    options: PropTypes.object        // arguments of your confirm function
}
ExportModal.defaultProps = {
    options: { type: "" }
}
const confirm = createConfirmation(confirmable(ExportModal));
export default function (confirmMessage, options = {}) {
    // You can pass whatever you want to the component. These arguments will be your Component's props
    return confirm({ confirmMessage, options });
}
// confirmable HOC pass props `show`, `dismiss`, `cancel` and `proceed` to your component.
//export default confirmable(Confirmation);