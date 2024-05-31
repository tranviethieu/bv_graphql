import Page from 'components/Page';
import React, { useState, useEffect } from 'react';
import { Card, CardTitle, CardText, CardImg, Row } from 'reactstrap';
import { Typography } from '@material-ui/core'
import gql from 'graphql-tag';
import confirm from 'components/Confirmation';
import authCheck from "utils/authCheck";
import { withApollo } from 'react-apollo';
import Button from '@material-ui/core/Button';
import AddBoxIcon from '@material-ui/icons/AddBox';

const QUERY_PROJECTS = gql`
{
    response:projects{
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
function Project(props) {
    const [data, setData] = useState([]);

    const fetchData = () => {
        props.client.query({
            query: QUERY_PROJECTS
        }).then(result => {
            if (authCheck(result.data.response))
                setData(result.data.response.data);
        })
    }
    useEffect(() => { fetchData(); }, []);

    return (
        <Page
            title="Quản lý dự án"
            breadcrumbs={[{ name: 'Quản lý dự án', active: true }]}
            className="ExtensionPage">
            <Button className='btn-fixed-right-bottom' variant='contained' color="primary" onClick={() => props.history.push("/project-edit")}><AddBoxIcon /> THÊM DỰ ÁN</Button>
            <div className='flex flex-wap'>
                {data.map((item, index) => <div key={index} className='home-flex-item'>
                    <Card inverse className="text-center border-0 bg-gradient-theme flex project-block-home">
                        <CardImg src={process.env.REACT_APP_FILE_PREVIEW_URL + item.thumbId} className='home-project-icon' />
                        <div className='project-card-content'>

                            <CardTitle>{item.name}</CardTitle>
                            {/* <Typography style={{ fontSize: 11 }}>Id:{item._id}</Typography> */}
                            <CardText>{item.description}</CardText>
                            <div>
                                <Button variant='contained' onClick={() => props.history.push(`/project-edit/${item._id}`)} className='btn-green'>
                                    Chỉnh sửa
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>)}

            </div>
        </Page>
    )

}

export default withApollo(Project);