import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { confirmable } from 'react-confirm';

import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Form, Input } from 'reactstrap'; // your choice.
import { createConfirmation } from 'react-confirm';
import { client } from 'utils/apolloConnect'
import gql from "graphql-tag";
import authCheck from 'utils/authCheck'
import Select from 'react-select'
export const QUERY_PROJECTS = gql`
{
  response:projects(sorted:[{id:"name",desc:false}]){
    code
    message
    data{
        value:_id
        label:name        
    }
  }
}
`

const UPDATE_ROLE = gql`
mutation($accountId:String!,$role:String!,$projectIds:[String]!){
    response:updateGrantPermission_MultiProject(accountId:$accountId,role:$role,projectIds:$projectIds){
      code
      message
      data{
        _id
        project{
          name
          _id
        }
        role
        accountId
      }
    }
  }
`

const RoleModal = ({ dismiss, cancel, accountId, success }) => {
    console.log("accountId=", accountId);
    const [role, setRole] = useState(null);
    const [projectIds, setProjectIds] = useState([]);
    const [projects, setProjects] = useState([]);
    useEffect(() => {
        if (projects.length == 0) {
            client.query({
                query: QUERY_PROJECTS
            }).then(result => {
                if (authCheck(result.data.response)) {
                    setProjects(result.data.response.data);
                }
            })
        }
    })
    const onSubmit = () => {
        client.mutate({
            mutation: UPDATE_ROLE,
            variables: {
                role, projectIds: projectIds.map((item) => { return item.value }), accountId
            }
        }).then(result => {
            if (authCheck(result.data.response)) {

                success(result.data.response.data);
            }
            dismiss();
        })
    }

    return (
        <Modal toggle={dismiss} isOpen={true}>
            <ModalHeader toggle={dismiss}>Chọn quyền truy cập dự án</ModalHeader>
            <ModalBody>
                <Form>
                    <FormGroup>

                        <Select
                            value={projectIds}
                            isMulti={true}
                            options={projects}
                            onChange={e => { setProjectIds(e) }}
                            isClearable={true}
                            placeholder={"Chọn dự án"}
                        />

                    </FormGroup>
                    <FormGroup>
                        <Input type="select" value={role || ''} onChange={e => setRole(e.target.value)}>
                            <option value="">Chọn quyền</option>
                            <option value="Basic">Cơ bản</option>
                            <option value="Admin">Quản trị dự án</option>
                        </Input>
                    </FormGroup>
                </Form>
            </ModalBody>
            <ModalFooter>
                <div>
                    <Button color='info' onClick={cancel}> Bỏ qua </Button>{' '}
                    <Button color='primary' onClick={onSubmit}>Xác nhận</Button>
                </div>
            </ModalFooter>
        </Modal>
    )
}


const confirm = createConfirmation(confirmable(RoleModal));
export default function (props) {
    // You can pass whatever you want to the component. These arguments will be your Component's props
    return confirm(props);
}