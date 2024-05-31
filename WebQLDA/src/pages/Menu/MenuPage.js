import Page from 'components/Page';
import React from 'react';
import { Button,ButtonGroup,Card,CardBody,CardHeader,Input} from 'reactstrap';
import ToggleButton from "react-toggle-button";
import {Mutation} from 'react-apollo'
import {MdEdit,MdDelete,MdAddCircle} from 'react-icons/lib/md';
import authCheck from 'utils/authCheck';
import ReactTable from "react-table";
import { withApollo } from 'react-apollo'

import confirm from 'components/Confirmation'
import {QUERY_MENUS,DELETE_MENU,ALL_SLUG_BY_TYPE} from 'GqlQuery';


class MenuPage extends React.Component{
    state={
        data: [],
        page: 1,
        loading: true,
        slugs:[]
    }
    constructor(){
        super();
        // this.fetchData=this.fetchData.bind(this);        
    }
    onDelete=(row,mutation)=>{
        confirm(`Bạn có chắc chắn muốn xóa bản ghi '${row.name}'?`,{title:"Xóa bản ghi"}).then(
            (result)=>{
                mutation();
            },            
            (result) => {
                // `cancel` callback
                
            }
        )
    }
    fetchSlug=()=>{
        this.props.client.query({
          query:ALL_SLUG_BY_TYPE,
          variables:{type:"project"}
        }).then(result=>{
          if(authCheck(result.data.response)){
            this.setState({slugs:result.data.response.data});
          }
        })
      }
    componentDidMount(){
        this.fetchSlug();
        this.props.client.query({
            query: QUERY_MENUS,
            variables:{page:0,pageSize:0}        
        }).then(result=>{
            this.setState({data:result.data.menus.data,pages:result.data.menus.pages,page:result.data.menus.page,loading:false});
        })  
        
        
    }
    render=()=>{
        const {data,loading,slugs}=this.state;
        return(
        <Page title="Công ty"
                breadcrumbs={[{ name: 'Danh sách công ty', active: true }]}            
                className="ExtensionPage"> 
            <Card>
                <CardHeader className="bg-green">                        
                    <Button color="primary" onClick={e=>this.props.history.push("/menu-edit")}><MdAddCircle/> Thêm Menu</Button>
                </CardHeader>
                <CardBody>
                <div style={{height:10}}></div>
            
                    <ReactTable 
                        noDataText="Không có dữ liệu"   
                         // Forces table not to paginate or sort automatically, so we can handle it server-side
                        data={data}
                        loading={loading} // Display the loading overlay when we need it
                        
                        filterable
                        showPagination={false}
                        pageSize={data.length}
                        className="-striped -highlight"                     
                        columns={[    
                            {
                                Header:"#",
                                width:50,
                                style:{textAlign:"center"},
                                Cell: (row) => {
                                    return <div>{row.index+1}</div>;
                                    },
                                filterable:false
                            },  
                            {
                                Header:"Admin",
                                accessor:"isAdmin",
                                // filterMethod:(filter,row)=>{
                                //     // if(filter.value=="true")
                                //     //     return true;
                                //     // else if(filter.value=="false")
                                //     //     return false;
                                //     console.log("filter value:",filter.value)
                                //     // return filter.value;
                                //     return true;
                                // },
                                Filter:({filter,onChange})=>
                                    <Input bsSize="sm" type="select" style={{width:"100%"}} value={filter?filter.value:""}  
                                        onChange={e=>onChange(e.target.value)}>
                                        <option value="">show all</option>
                                        <option value="true">Is Admin</option>
                                        <option value="false">Not Admin</option>
                                    </Input>,
                                Cell:row=><ToggleButton value={row.value}/>
                            }, 
                            {
                                Header:"Dự án",
                                Filter:({filter,onChange})=>
                                    <Input bsSize="sm" type="select" style={{width:"100%"}} value={filter?filter.value:""}  
                                        onChange={e=>onChange(e.target.value)}>
                                        <option value="">show all</option>
                                        {
                                            slugs.map((item,index)=><option key={index} value={item.name}>
                                                {item.name}
                                            </option>)
                                        }
                                    </Input>,
                                accessor:"slug",
                            },                              
                            {
                                Header:"Tên Menu",
                                accessor:"name",                                
                                maxWidth:150,
                            },
                            {
                                Header:"Hoạt động",
                                accessor:"disable",
                                className:"text-center",
                                Filter:({filter,onChange})=>
                                    <Input bsSize="sm" type="select" style={{width:"100%"}} value={filter?filter.value:""}  
                                        onChange={e=>onChange(e.target.value)}>
                                        <option value="">show all</option>
                                        <option value="true">Disable</option>
                                        <option value="false">Enable</option>
                                    </Input>,
                                Cell:row=><ToggleButton value={!row.value}/>
                            }, 
                            {
                                Header:"Đường dẫn",
                                accessor:"path",
                            }, 
                            {
                                Header:"Menu Cha",
                                accessor:"parent.name",
                                style:{textAlign:"center"},
                            },                            
                            {
                                Header:"Icon",
                                accessor:"icon",
                            },                             
                            {
                                Header:"Cấp",
                                accessor:"level",                                
                                style:{textAlign:"center"},
                            },  
                            {
                                Header:"Thứ tự",
                                accessor:"sort",                                
                                style:{textAlign:"center"},
                            },  
                            {
                                Header:"Tác vụ",
                                maxWidth:100,
                                filterable:false,
                                sortable:false,
                                Cell: row=>(
                                    <ButtonGroup>
                                        <Button color="primary" onClick={()=>this.props.history.push("/menu-edit/"+row.original._id)}><MdEdit/></Button>
                                        {" "}
                                        <Mutation mutation={DELETE_MENU}
                                                variables={{_id:row.original._id}}
                                                onCompleted={(result)=>{
                                                    window.location.reload();
                                                }}
                                            >
                                                {mutation=>
                                                    <Button color="danger" onClick={()=>this.onDelete(row.original,mutation)}><MdDelete/></Button>
                                                }
                                            </Mutation>

                                    </ButtonGroup>
                                )
                            }
                        ]}
                        
                    />                                      
                            
                </CardBody>
            </Card>
        </Page>)
    }
}

export default withApollo(MenuPage);