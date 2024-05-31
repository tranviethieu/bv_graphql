import Page from 'components/Page';
import React from 'react';
import { Card, CardTitle, CardText, CardImg, } from 'reactstrap';
import gql from 'graphql-tag';
import confirm from 'components/Confirmation';
import { withApollo } from 'react-apollo'
import authCheck from '../utils/authCheck';
import { GetLocalToken } from 'Constants';
import Button from '@material-ui/core/Button'

const DELETE_PROJECT = gql`
mutation($_id:String!){
    response:removeProject(_id:$_id){
        code
        message
    }
}
`
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
class Project extends React.Component {
    state = {
        data: []
    }
    fetchData = () => {
        this.props.client.query({
            query: QUERY_PROJECTS
        }).then(result => {
            authCheck(result.data);
            this.setState({ data: result.data.response.data })
        })
    }
    removeProject = (row) => {
        confirm(`Bạn có chắc chắn muốn xóa dự án ${row.name}`, { title: "Xóa dự án" }).then(result => {
            this.props.client.mutate({
                mutation: DELETE_PROJECT,
                variables: { _id: row._id }
            }).then(result => {
                authCheck(result.data);
                if (result.data.response.code == 0) {
                    this.fetchData();
                } else {
                    confirm(result.data.response.message, { hideCancel: true, title: "Không thành công" })
                }
            })
        })
    }
    componentDidMount() {
        this.fetchData();
    }
    render = () => {
        var session = GetLocalToken();
        var accessToken = session && session.access_token;
        return (
            <Page
                title="Dự án"
                breadcrumbs={[{ name: 'Dự án', active: true }]}
                className="ExtensionPage">

                <div className='flex flex-wap'>

                    {this.state.data.map((item, index) => <div key={index} className='home-flex-item' >
                        <Card inverse className="text-center border-0 bg-gradient-theme flex project-block-home">
                            <CardImg src={process.env.REACT_APP_FILE_PREVIEW_URL + item.thumbId} className='home-project-icon' />
                            <div className='project-card-content'>
                                <CardTitle>{item.name}</CardTitle>
                                <CardText>{item.description}</CardText>
                                <div>
                                    <Button variant='contained' className='goto-function-btn'
                                        onClick={e => {
                                            window.open(`${item.link}/${accessToken}`, '_blank')
                                        }} outline color="light">
                                        Đi tới
                                    </Button>

                                </div>
                            </div>
                        </Card>
                    </div>)}

                </div>
            </Page>
        )
    }

}

export default withApollo(Project);