import Page from "components/Page";
import React, { useEffect, useState } from "react";
import { Input, Row, Col, Label, Form, FormGroup, Card, CardBody, CardHeader } from "reactstrap";
import { MdClose } from 'react-icons/lib/md';
import { withApollo, Mutation } from "react-apollo";
import gql from "graphql-tag";
import authCheck from "utils/authCheck";
import { UPLOAD_MUTATION } from 'GqlQuery';
import ToggleButton from 'react-toggle-button';
import confirm from 'components/Confirmation';
import UploadFileForm from 'components/Widget/UploadImageForm';
import Button from '@material-ui/core/Button';
import { useForm } from 'hooks'


const DELETE_PROJECT = gql`
mutation($_id:String!){
    response:removeProject(_id:$_id){
        code
        message
    }
}
`

const QUERY_PROJECT = gql`
query($_id:String!){
    response:project(_id:$_id){
      code
      message
      data{
          _id
        name
        link
        thumbId
        active
        description
        
      }
    }
  }
`
const UPDATE_PROJECT = gql`
mutation($project:ProjectInput){
    response:updateProject(project:$project){
        code
        message
    }
}
`
const initialState = {
    name: "",
    link: "",
    thumbId: "",
    description: "",
    active: true
}
function ProjectDetail(props) {

    const { form, setForm, setInForm, handleChange } = useForm(initialState);

    const removeProject = () => {
        confirm("Việc xóa dự án có thể sẽ khiến cho các hệ thống liên quan tới dự án này không thể hoạt động.Chỉ xóa dự án khi bạn chăc chắn dự án không còn hoạt động nữa", { title: `Xóa dự án ${form.name}?`,count:10 }).then(() => {            
            props.client.mutate({
                mutation: DELETE_PROJECT,
                variables: { _id: form._id }
            }).then(result => {
                if (result.data.response.code == 0) {
                    confirm('Xóa dự án thành công').then(() => props.history.goBack())
                } else {
                    confirm(result.data.response.message, { hideCancel: true, title: "Không thành công" })
                }
            })
        })
    }
    useEffect(() => {
        const { _id } = props.match.params;
        if (_id) {
            props.client.query({
                query: QUERY_PROJECT,
                variables: { _id }
            }).then(result => {
                if (result.data.response.code == 0) {
                    setForm(result.data.response.data);
                }
            })
        }
    }, [props]);

    function handleUpdateFiles(serverId) {
        setInForm('thumbId', serverId);
    }
    const onUpdate = () => {
        // const { name, link, description, thumbId, _id, active } = state;
        props.client.mutate({
            mutation: UPDATE_PROJECT,
            variables: { project: form }
        }).then(result => {
            if (result.data.response.code == 0) {
                props.history.goBack();
            } else {
                confirm(result.data.response.message, { hideCancel: true, title: "Không thành công" });
            }
        })
    }

    return (
        <div className='block-table-content'>


            <Page
                title={"Chi tiết dự án"}
                breadcrumbs={[{ name: "Chi tiết dự án", active: true }]}
                className="hotnews"
            >
                <div className='top-btn'>
                    {
                        form._id &&
                        <Button onClick={removeProject} disabled={!form._id} className='btn-red m-10' variant="btn-red">
                            Xóa dự án
                    </Button>
                    }
                </div>
                
                <Row style={{ justifyContent: "center" }}>

                    <Col md={12}>
                        <div className='flex'>
                            <Col md={6}>
                                <Card className='full-height'>
                                    <CardBody>
                                        <Form style={{ padding: 20 }}>
                                            <FormGroup>
                                                <Label>
                                                    Tên dự án
                                                </Label>
                                                <Input value={form.name} name="name" onChange={handleChange} />
                                            </FormGroup>
                                            <FormGroup>
                                                <Label>
                                                    Link dự án
                                                </Label>
                                                <Input value={form.link} name="link" onChange={handleChange} />
                                            </FormGroup>
                                            <FormGroup>
                                                <Label>
                                                    Mô tả dự án
                                                </Label>
                                                <Input type="textarea" name="description" value={form.description} onChange={handleChange} />
                                            </FormGroup>
                                            <FormGroup row>
                                                <Label md={6}>
                                                    Trạng thái hoạt động:
                                            </Label>
                                                <Col>
                                                    <ToggleButton
                                                        value={form.active}
                                                        onToggle={(value) => {
                                                            setInForm('active', !value)
                                                        }} />
                                                </Col>
                                            </FormGroup>
                                        </Form>
                                    </CardBody>
                                </Card>
                            </Col>
                            <Col md={6}>
                                <Card className='full-height'>
                                    <CardBody>
                                        <FormGroup style={{ padding: 20 }}>
                                            <Label className="text-grey h6">
                                                Ảnh đại diện
                                        </Label>
                                            <UploadFileForm server={process.env.REACT_APP_UPLOADURL} onUpdateFiles={handleUpdateFiles} files={form.thumbId && form.thumbId != "" && [{ source: form.thumbId, options: { type: "local" } }]} allowMultiple={false} maxFiles={1} />

                                        </FormGroup>
                                    </CardBody>
                                </Card>
                            </Col>

                        </div>
                    </Col>
                    <div className='fix-bottom-right'>

                        <Button onClick={e => props.history.goBack()} variant='outlined' className='m-10'>
                            Trở lại
                            </Button>

                        <Button className='btn-green m-10' onClick={onUpdate} variant='contained'>
                            Cập nhật thông tin
                        </Button>

                    </div>

                </Row>

            </Page>
        </div>
    )

}

export default withApollo(ProjectDetail)