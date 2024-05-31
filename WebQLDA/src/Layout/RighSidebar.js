// import React from "react";
// import { withApollo } from "react-apollo";
// import gql from "graphql-tag";
// import { Card, CardHeader, CardBody } from 'reactstrap'
// import { MdClose } from 'react-icons/lib/md';
// import ReactTable from "react-table";
// import Moment from 'moment'



// class RightSidebar extends React.Component {

//     state = {
//         data: [],
//         pages: 0,
//         records: 0,
//         page:0
//     }
//     fetchInbox = (state) => {
//         const { page, pageSize } = state;
//         this.props.client.query({
//             query: QUERY_INBOXS,
//             variables: { page, pageSize }
//         }).then(result => {
//             this.setState(result.data.response)
//         })
//     }
//     toggleSideBar = () => {
//         document.querySelector(".right-sidebar").classList.toggle("right-sidebar--open");
//     };

//     componentDidUpdate(){
//         var subcribedata = this.props.subcribedata;
        
//         if (subcribedata && subcribedata.newNotifyEvent&&this.state.page==0&& (this.state.event != subcribedata.newNotifyEvent)) {
//             this.state.event = subcribedata.newNotifyEvent;
//             this.fetchInbox({pageSize:20,page:0});
//         }
//     }

//     render() {
//         return <aside className="right-sidebar">
//             <Card style={{position:"relative", height:"100%"}}>
//                 <CardHeader style={{ textAlign: "center", paddingTop: 13 }}>
//                     <h6>Thông báo</h6>
//                     <MdClose onClick={this.toggleSideBar} style={{ position: "absolute", right: 0, top: 13, fontSize: 20, fontWeigh: "bold" }} />
//                 </CardHeader>
//                 <CardBody style={{height:"100%"}}>
//                     <ReactTable
//                         noDataText="Không có dữ liệu"
//                         TheadComponent={props => null}
//                         manual
//                         onFetchData={this.fetchInbox}
//                         data={this.state.data}
//                         pages={this.state.pages}
//                         filterable={false}
//                         showPagination={true}
//                         showPageJump={false}
//                         showPageSizeOptions={false}
//                         nextText="Sau"
//                         previousText="Trước"
//                         pageText="Trang"
//                         onPageChange={page=>this.setState({page})}
//                         style={{ height: "calc(100% - 120px)" }}
//                         // className="-highlight bg-white"
//                         columns={[
//                             {
//                                 Cell: row => <div>
//                                     <small>{Moment(row.original.receivedTime).fromNow()}</small>
//                                     <h6>{row.original.title}</h6>
//                                     <p>{row.original.shortDesc}</p>
//                                 </div>
//                             }
//                         ]}
//                     />
//                 </CardBody>
//             </Card>
//         </aside>
//     }

// }
// export default withApollo(RightSidebar);