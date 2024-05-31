import Page from 'components/Page';
import React from 'react';
import { Button, ButtonGroup, Card, CardBody, CardHeader, Input } from 'reactstrap';
import showSlugModal from '../Slug/SlugModal'
import { MdEdit, MdDelete, MdAddCircle } from 'react-icons/lib/md';
import authCheck from 'utils/authCheck';
import ReactTable from "react-table";
import { withApollo } from 'react-apollo'
import gql from 'graphql-tag';
import confirm from 'components/Confirmation'

const AllSlug = gql`
query($page:Int,$pageSize:Int,$sorted:[SortedInput],$filtered:[FilteredInput]){
    response:slugs(page:$page,pageSize:$pageSize,sorted:$sorted,filtered:$filtered){
        code
        message
        data{
            _id
            value
            type
        }
    }
}
`

const DELETE_SLUG=gql`
mutation($_id:String!){
    response:deleteSlug(_id:$_id){
        code
        message
    }
}
`


class SlugPage extends React.Component {
    state = {
        data: []
    }
    onDelete=(row)=>{
        confirm(`Bạn có chắc chắn muốn xóa bản ghi '${row.value}'?`,{title:"Xóa bản ghi"}).then(
            _=>{
                this.props.client.mutate({
                    mutation:DELETE_SLUG,
                    variables:{_id:row._id}
                }).then(result=>{
                    if(authCheck(result.data.response)){
                        confirm("Xóa bản ghi thành công",{hideCancel:true}).then(_=>this.fetchData({}))
                    }
                })
            },            
            _ => {
                // `cancel` callback
                
            }
        )
    }
    fetchData = (state) => {
        const{filtered,sorted}=state;
        this.props.client.query({
            query:AllSlug,
            variables:{filtered,sorted}
        }).then(result=>{
            if(authCheck(result.data.response)){
                this.setState({data:result.data.response.data});
            }
        })
    }
    render = () => {
        const{data} =this.state;
        return (
            <Page title="Danh sách Slug"
                breadcrumbs={[{ name: 'Danh sách Slug', active: true }]}>
                <Card>
                    <CardHeader>
                        <Button color="primary" outline onClick={e => {showSlugModal("Thêm slug").then(result=>{
                            if(result!==null){
                                data.splice(0,0,result);
                                this.setState({data})
                            }
                        })}}><MdAddCircle /> Thêm Slug</Button>
                    </CardHeader>
                    <CardBody>
                        <div style={{ height: 10 }}></div>

                        <ReactTable
                            noDataText="Không có dữ liệu"
                            // Forces table not to paginate or sort automatically, so we can handle it server-side
                            data={data}
                            onFetchData={this.fetchData}
                            filterable
                            showPagination={false}
                            pageSize={data.length}
                            className="-striped -highlight"
                            columns={[
                                {
                                    Header:"Loại",
                                    accessor:"type"
                                },
                                {
                                    Header:"Giá trị",
                                    accessor:"value"
                                },
                                {
                                    Header:"Tác vụ",
                                    filterable:false,
                                    Cell:row=><ButtonGroup>
                                        <Button color="info"><MdEdit/></Button>
                                        <Button color="danger" onClick={e=>{this.onDelete(row.original)}}><MdDelete/></Button>
                                    </ButtonGroup>
                                }
                            ]}
                        />

                    </CardBody>
                </Card>
            </Page>
        )
    }
}
export default withApollo(SlugPage)