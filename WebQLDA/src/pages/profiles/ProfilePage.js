import Page from 'components/Page';
import React, { useState, useEffect } from 'react';
import { Button, Card, CardHeader, CardBody, Input, Row, Col, Label, Form, FormGroup } from 'reactstrap';
import { client } from 'utils/apolloConnect';
import authCheck from 'utils/authCheck';
import { ME, UPDATE_PROFILE,MUTATION_CHANGE_PASSWORD } from './query';
import moment from 'moment';
import ReactTable from 'react-table';
import history from '@history'
import { useForm } from 'hooks';
import Avatar from 'components/Avatar';
import confirm from 'components/Confirmation';
import UploadFileForm from 'components/Widget/UploadImageForm';
import ChangePwDialog from './ChangePwDialog';

function ProfilePage() {
    const [roles, setRoles] = useState([]);
    const { form, handleChange, setForm } = useForm(null);
    const [openPwModal, setOpenPwModal] = useState(false);

    function submitChangePw(data) {
        client.mutate({
            mutation: MUTATION_CHANGE_PASSWORD,
            variables:data
        }).then(result => {
            if (authCheck(result.data.response)) {
                setOpenPwModal(false);
                confirm("Đổi mật khẩu thành công", { hideCancel: true });
            }
        })
    }
    const fetchData = () => {
        client.query({
            query: ME
        }).then(result => {
            if (authCheck(result.data.response)) {
                const { userName, fullName, email, phoneNumber, image, title, department, birthday, gender } = result.data.response.data;
                setForm({ userName, fullName, email, phoneNumber, image, title, department, birthday, gender });
                setRoles(result.data.response.data.roles);
            }
        })
    }
    useEffect(() => {
        fetchData();
    }, [])
    function updateProfile() {
        client.mutate({
            mutation: UPDATE_PROFILE,
            variables: { account: form }
        }).then(result => {
            if (authCheck(result.data.response)) {
                confirm("Cập nhật tài khoản thành công", { hideCancel: true })
            }
        });
    }
    function handleUpdateFiles(serverId) {
        setForm({...form, image: serverId });
    }

    return (
        <Page title="Thông tin tài khoản"
            breadcrumbs={[{ name: 'Thông tin tài khoản', active: true }]}
            className="ProfilePage">
            <Row className="pb-3">
                <Col>
                    <Button color="info" onClick={history.goBack}> Quay lại</Button> {"  "}
                    {/* <Button color="success" onClick={updateProfile}> Lưu</Button>{"  "} */}
                    <Button color="warning" onClick={()=>setOpenPwModal(true)}> Đổi mật khẩu</Button>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <CardHeader>
                            Thông tin cơ bản
                        </CardHeader>
                        <CardBody>
                            {form ?
                                <Form className="m-4">
                                    <FormGroup row>
                                        <Label md={3} className="text-right">
                                            Avatar
                                        </Label>
                                        <Col md={9}>
                                            {/* <UploadFileForm server={process.env.REACT_APP_UPLOADURL} onUpdateFiles={handleUpdateFiles} files={form.image && form.image !== null && form.image != "" && [{ source: form.image, options: { type: "local" } }]} allowMultiple={false} maxFiles={1} /> */}
                                            <Avatar src={form.avatar}/>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Label md={3} sm={5} className="text-right">Tài khoản:</Label>
                                        <Col md={9} sm={7}>
                                            <Input name="userName" value={form.userName} disabled onChange={handleChange} type="text" />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Label md={3} sm={5} className="text-right">Họ và tên:</Label>
                                        <Col md={9} sm={7}>
                                            <Input name="fullName" value={form.fullName} disabled onChange={handleChange} type="text" />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Label md={3} sm={5} className="text-right">Chức danh:</Label>
                                        <Col md={9} sm={7}>
                                            <Input name="title" value={form.title} disabled onChange={handleChange} type="text" />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Label md={3} sm={5} className="text-right">Số điện thoại:</Label>
                                        <Col md={9} sm={7}>
                                            <Input name="phoneNumber" disabled value={form.phoneNumber} onChange={handleChange} type="text" />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Label md={3} sm={5} className="text-right">Email:</Label>
                                        <Col md={9} sm={7}>
                                            <Input value={form.email} disabled onChange={handleChange} type="text" />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Label md={3} sm={5} className="text-right">phòng/ban:</Label>
                                        <Col md={9} sm={7}>
                                            <Input name="department" disabled value={form.department&&form.department.name} type="text" />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Label md={3} sm={5} className="text-right">Giới tính</Label>
                                        <Col md={9} sm={7}>
                                            <Input name="gender" type="select" value={form.gender} disabled>
                                                <option value="">Chọn</option>
                                                <option value="1">Nam</option>
                                                <option value="2">Nữ</option>
                                            </Input>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Label md={3} sm={5} className="text-right">Ngày sinh</Label>
                                        <Col md={9} sm={7}>
                                            <Input name="birthday" disabled value={moment(form.birthday).format("YYYY-MM-DD")} type="date" />
                                        </Col>
                                    </FormGroup>

                                </Form>
                                : <div>Không thể load thông tin tài khoản</div>
                            }

                        </CardBody>
                    </Card>
                </Col>
                <Col>
                    <Card>
                        <CardHeader>
                            Vai trò
                        </CardHeader>
                        <CardBody>
                            <ReactTable
                                data={roles}
                                pageSize={roles.length}
                                showPagination={false}
                                columns={[
                                    {
                                        Header: "Dự án",
                                        accessor: "project.name",
                                        Cell: row => <div>
                                            {!row.value || row.value == '' ? 'HỆ THỐNG' : row.value}
                                        </div>
                                    },
                                    {
                                        Header: "Vai trò",
                                        accessor: "role"
                                    }
                                ]}
                            />

                        </CardBody>
                    </Card>
                </Col>
            </Row>
            <ChangePwDialog open={openPwModal} dismiss={() => setOpenPwModal(false)} submit={submitChangePw}/>
        </Page>
    )

}


export default ProfilePage;