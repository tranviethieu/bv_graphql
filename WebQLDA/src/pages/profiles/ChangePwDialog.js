import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Form, Input } from 'reactstrap'; // your choice.
import { useForm } from 'hooks';
function ChangePwDialog({ open, dismiss, submit }) {
    const { form, handleChange,setForm } = useForm({});
    
    return (
        <Modal toggle={dismiss} isOpen={open}>
            <ModalHeader toggle={dismiss}>Đổi mật khẩu</ModalHeader>
            <ModalBody>
                <Form>
                    <FormGroup>
                        <Input name="oldpw" placeholder="Mật khẩu hiện tại" value={form.oldpw} onChange={handleChange} />
                    </FormGroup>
                    <FormGroup>
                        <Input name="newpw" placeholder="Mật khẩu mới" value={form.newpw} onChange={handleChange} />
                    </FormGroup>
                </Form>
            </ModalBody>
            <ModalFooter>
                <div>
                    <Button color='default' onClick={dismiss}> Bỏ qua </Button>{' '}
                    <Button color='primary' onClick={()=>submit(form)}>Xác nhận</Button>
                </div>
            </ModalFooter>
        </Modal>
    )
}
export default ChangePwDialog;