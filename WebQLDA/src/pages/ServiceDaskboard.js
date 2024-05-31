import Page from 'components/Page';
import React, { Fragment } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col, Label, Input, FormGroup, Card, Form, CardHeader, CardBody, Badge } from 'reactstrap';
import { withApollo, Mutation } from 'react-apollo'
import { MdCheckCircle } from 'react-icons/lib/md';
import ReactTable from "react-table";
import Moment from 'moment'
import gql from 'graphql-tag';
import confirm from 'components/Confirmation';
import { ProfitWidget, NumberWidget, IconWidget } from 'components/Widget';

import { FETCH_WORKING_TIME, QUERY_ORDERS, QUERY_EXPIRED_WORKTASKS, QUERY_TICKETS, UPDATE_TICKET } from "../GqlQuery";
import OrderMap from 'components/Map/OrderMap';
import Avatar from 'components/Avatar';
import { SipProvider} from 'react-sip';
import { uniqueArray } from '../utils/ArrayHelper';
const PUSH_NOTIFY_TO = gql`
mutation($title:String,$message:String,$receiverId:String,$type:String){
    response:pushOneTo(title:$title,message:$message,type:$type,receiverId:$receiverId){
        code
        message
        data
    }
}
`

const QUERY_TODAY_ORDERS = gql`
query Orders($page:Int,$pageSize:Int,$sorted:[SortedInput],$filtered:[FilteredInput]){
  response:orders(page:$page,pageSize:$pageSize,sorted:$sorted,filtered:$filtered){
    code
    message
    page
    records
    pages
    data{
      _id
      phoneNumber
      address
      geo
      createdTime
      status
      payAmount
      paid
      paymentMethod      
      user{
        fullName
        avatar
        phoneNumber
      }
      address
      tasks{
          _id
          startTime
          status
          account{
              _id
              name
          }
      }
      name
      service{
        name
        _id
        groupId
        group{
            name
        }
      }
      note
    }
  }
}
`
class ServiceDaskboard extends React.Component {
    state = {
        pendingOrders: [],
        confirmOrders: [],
        expiredTask: [],
        pendingTickets: [],
        pendingTicketPages: 1,
        pendingTicketRecords: 0,
        confirmOrderPages: 1,
        openBallonId: "",
        todayOrders: [],
        todayOrderRecords: 0,
        todayOrderPages: 1        
    }


    componentDidMount() {
        this.fetchPendingOrder();
        this.fetchExpiredTask();
    }
    componentDidUpdate() {
        var subcribedata = this.props.subcribedata;
        if (subcribedata && subcribedata.newNotifyEvent && (this.event != subcribedata.newNotifyEvent)) {
            this.event = subcribedata.newNotifyEvent;
            if (this.event.option.type == "expired-task")
                this.fetchExpiredTask();
            else if (this.event.option.type == "new-order") {
                this.fetchPendingOrder();
            } else if (this.event.option.type == "new-user-ticket" || this.event.option.type == "new-employee-ticket") {
                this.fetchTicket({ page: 0, pageSize: 5 });
            }
        }
    }
    sendNotify=()=>{
        const{messageInfo} = this.state;
        this.props.client.mutate({
            mutation:PUSH_NOTIFY_TO,
            variables:messageInfo
        }).then(result=>{
            if(result.data.response.code!==0){
                confirm("Gửi tin chưa thành công",{hideCancel:true})
            }else{
                this.setState({messageInfo:undefined})
            }
        });
    }
    onDelete = (row, mutation, isWaiting) => {
        confirm(`Bạn có chắc chắn muốn xóa yêu cầu từ khách hàng '${row.fullName}'?`, { title: "Xóa bản ghi" }).then(
            (result) => {
                mutation();
            },
            (result) => {
                // `cancel` callback

            }
        )
    }

    fetchTicket = (state) => {
        const { page, pageSize } = state;
        this.props.client.query({
            query: QUERY_TICKETS,
            variables: { filtered: [{ id: "status", value: '["pending","processing"]', operation: "in" }], sorted: [{ id: "createdTime", desc: true }], pageSize, page }
        }).then(result => {
            this.setState({ pendingTickets: result.data.response.data,pendingTicketRecords:result.data.response.records,pendingTicketPages:result.data.response.pages });
        })
    }
    fetchTodayOrder = (state) => {
        const { page, pageSize } = state;
        this.props.client.query({
            query: QUERY_TODAY_ORDERS,
            variables: { filtered: [{ id: "createdTime", value: Moment().format("DD/MM/YYYY") }], sorted: [{ id: "createdTime", desc: true }], pageSize, page }
        }).then(result => {
            this.setState({ todayOrders: result.data.response.data, todayOrderRecords: result.data.response.records, todayOrderPages: result.data.response.pages });
        })
    }
    fetchPendingOrder = () => {

        this.props.client.query({
            query: QUERY_ORDERS,
            variables: { filtered: [{ id: "status", value: 'pending' }], sorted: [{ id: "createdTime", desc: true }], pageSize: 1000 }
        }).then(result => {
            this.setState({ pendingOrders: result.data.response.data, pendingOrderPages: result.data.response.pages });
        })
    }
    fetchExpiredTask = () => {
        this.props.client.query({
            query: QUERY_EXPIRED_WORKTASKS,
        }).then(result => {
            this.setState({ expiredTask: result.data.response.data });
        })
    }
    fetchOrderConfirm = (state) => {
        const { pageSize, page } = state;
        this.props.client.query({
            query: QUERY_ORDERS,
            variables: { filtered: [{ id: "status", value: 'confirm' }], page, sorted: [{ id: "createdTime", desc: true }], pageSize }
        }).then(result => {
            this.setState({ confirmOrders: result.data.response.data, confirmOrderPages: result.data.response.pages });
        })
    }

    onDateChange = e => {
        const { rowEdit } = this.state;
        rowEdit.appointmentDate = e.target.value;
        this.setState({ rowEdit });
        this.props.client
            .query({
                query: FETCH_WORKING_TIME,
                variables: {
                    _id: this.state.rowEdit.departmentId,
                    date: Moment(e.target.value).format("DD/MM/YYYY")
                }
            })
            .then(result => {
                this.setState({ workingTimes: result.data.department.data.workingTimes });
            });
    };
    updateTicket = () => {
        const { editTicket } = this.state;
        if (editTicket) {
            this.props.client.mutate({
                mutation: UPDATE_TICKET,
                variables: { _id: editTicket._id, note: editTicket.note, status: editTicket.status }
            }).then(result => {
                if (result.data.response.code == 0) {
                    this.fetchTicket({page:0,pageSize:5});
                    this.setState({ editTicket: undefined });
                }
            })
        }
    }
    getTaskColor = (status) => {
        switch (status) {
            case "waiting":
                return "LightGray"
            default:
                return "Green"

        }
    }
    render = () => {
        const { pendingOrders, confirmOrders, expiredTask,  openBallonId, pendingTickets } = this.state;
        const TheadComponent = props => null;
        let expiredOrder = expiredTask.map((item) => item.order);        
        let expiredEmployee = expiredTask.map((item) => item.account);
        return (
            <Page title="Thống kê"
                breadcrumbs={[{ name: 'Thống kê', active: true }]} >

                <Row>
                    <Col>
                        <Button color="warning" onClick={e => this.props.history.push("/order-detail")}>
                            Tạo đặt dịch vụ
                            </Button>
                    </Col>
                </Row>
                <Row>
                    <Col md={3} style={{ padding: 0 }}>
                        <Card>
                            <CardHeader>
                                <strong>{expiredTask.length}</strong> VIỆC ĐANG TRỄ
                            </CardHeader>
                            <CardBody style={{ height: 500 }}>
                                {expiredTask.length == 0 ?
                                    <div style={{ height: "100%", textAlign: "center", position: "relative" }}>
                                        <MdCheckCircle style={{ color: "green", fontSize: 64, margin: "auto", marginTop: 100 }} />
                                        <h6>Hiện giờ không có việc trễ cần xử lý</h6>
                                    </div>
                                    : <ReactTable
                                        noDataText="Chưa có yêu cầu mới"
                                        TheadComponent={TheadComponent}
                                        data={expiredTask}
                                        onFetchData={this.fetchExpiredTask}
                                        pageSize={expiredTask.length}
                                        // defaultPageSize={3}
                                        // nextText="Sau"
                                        // previousText="Trước"
                                        // pageText="Trang"
                                        className="-highlight"
                                        showPageJump={false}
                                        showPageSizeOptions={false}
                                        showPagination={false}
                                        style={{height:490}}
                                        columns={[
                                            {
                                                Cell: row => <div>
                                                    <div style={{ display: "flex", flexDirection: "row" }}
                                                        onMouseEnter={e => {
                                                            if (openBallonId !== row.original.account_id) {
                                                                this.setState({ openBallonId: row.original.account._id });
                                                            }
                                                        }}
                                                        onMouseLeave={e => {
                                                            if (openBallonId == row.original.account._id) {
                                                                this.setState({ openBallonId: "" });
                                                            }
                                                        }}
                                                        
                                                    >
                                                        <div style={{ paddingRight: 10 }}>
                                                            <Avatar
                                                                className="can-click" src={row.original.account.info.image}
                                                                onClick={e => this.props.history.push(`/service-employee-history/${row.original.account._id}`)}
                                                            />
                                                        </div>
                                                        <div style={{width:"100%"}}>
                                                            <h6><small><span style={{ color: "grey" }}>Nhân viên:</span> {row.original.account.info.fullName} - {row.original.account.info.phoneNumber}</small></h6>
                                                            <h6><small><span style={{ color: "grey" }}>Công việc:</span> {row.original.order.service.name}</small></h6>
                                                            <h6><small><span style={{ color: "grey" }}>Làm việc từ: </span> {Moment(row.original.startTime).format("HH:mm")}-{Moment(row.original.endTime).format("HH:mm")} ngày {Moment(row.original.date).format("DD/MM")}</small></h6>
                                                            <div style={{position:"relative"}}>
                                                                <Badge color="warning">{row.original.status == "confirm" ? "Chưa bắt đầu" : "Chưa kết thúc"}</Badge>
                                                                <Badge style={{marginLeft:10,marginTop: 3 }} color="danger">Trễ {Moment(row.original.startTime).fromNow(true)}</Badge>                                                                
                                                                <Button onClick={e=>{this.setState({selectedExpiredTask:row.original})}} color="primary" size="sm" style={{float:"right",padding:"1px 7px"}}>Tác vụ</Button>
                                                            </div>
                                                            
                                                            <hr style={{ margin: "8px 0 0 0" }} />
                                                        </div>
                                                    </div>

                                                    <div style={{ display: "flex", flexDirection: "row", marginBottom: 10 }}
                                                        onMouseEnter={e => {
                                                            if (openBallonId !== row.original.order._id) {
                                                                this.setState({ openBallonId: row.original.order._id });
                                                            }
                                                        }}
                                                        onMouseLeave={e => {
                                                            if (openBallonId == row.original.order._id) {
                                                                this.setState({ openBallonId: "" });
                                                            }
                                                        }}
                                                       

                                                    >
                                                        <div style={{ paddingRight: 10 }}>
                                                            <Avatar
                                                                className="can-click" src={row.original.order.user && row.original.order.user.avatar}
                                                                onClick={e => this.props.history.push(`/user-detail/${row.original.userId}`)}
                                                            />
                                                        </div>
                                                        <div>
                                                            <h6><small><span style={{ color: "grey" }}>Khách hàng:</span> {row.original.order.name} - {row.original.order.phoneNumber}</small></h6>
                                                            <h6><small><span style={{ color: "grey" }}>Địa chỉ: </span>{row.original.order.address}</small></h6>
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                        ]
                                        }
                                    />
                                }
                            </CardBody>
                        </Card>
                    </Col>
                    <Col md={6}>
                        <Card>

                            <CardBody>
                                <OrderMap height={530} openBallonId={openBallonId} markers={[
                                    { slug: "pending-order", type: "order", items: pendingOrders },
                                    { slug: "expired-order", type: "customer", items: expiredOrder },
                                    { slug: "expired-employee", type: "account", items: expiredEmployee }
                                ]} displayInfoCallback={(slug, type, item) => {
                                    if (slug == "pending-order") {
                                        var task = pendingOrders.filter((o) => {
                                            return o._id == item._id;
                                        });
                                        if (task) {
                                            task[0].show = item.show;
                                        }
                                        this.setState({ pendingOrders })
                                    } else if (slug == "expired-task") {
                                        var task = expiredTask.filter((o) => {
                                            return o._id == item._id;
                                        });
                                        if (task) {
                                            task[0].show = item.show;
                                        }
                                        this.setState({ expiredTask })
                                    }
                                }} />
                            </CardBody>
                        </Card>
                    </Col>
                    <Col md={3} style={{ padding: 0 }}>
                        <Card>
                            <CardHeader>
                                <strong>{pendingOrders.length}</strong> ĐĂNG KÝ MỚI
                            </CardHeader>
                            <CardBody style={{ height: 500 }}>
                                <ReactTable
                                    noDataText="Chưa có yêu cầu mới"
                                    TheadComponent={TheadComponent}
                                    data={pendingOrders}
                                    pageSize={pendingOrders.length}
                                    // defaultPageSize={3}
                                    // nextText="Sau"
                                    // previousText="Trước"
                                    // pageText="Trang"
                                    className="-highlight"
                                    showPageJump={false}
                                    showPageSizeOptions={false}
                                    style={{height:490}}
                                    showPagination={false}
                                    columns={[
                                        {                                           
                                            Cell: row => <div style={{ display: "flex", flexDirection: "row", overflow: "hidden" }}
                                                onMouseEnter={e => {
                                                    if (openBallonId !== row.original._id) {
                                                        this.setState({ openBallonId: row.original._id });
                                                    }
                                                }}
                                                onMouseLeave={e => {
                                                    if (openBallonId == row.original._id) {
                                                        this.setState({ openBallonId: "" });
                                                    }
                                                }}
                                                onClick={e => this.props.history.push("/order-edit/" + row.original._id)}
                                            >
                                                <div style={{ paddingRight: 10 }}>
                                                    <Avatar
                                                        className="can-click"
                                                        src={row.original.user && row.original.user.avatar}
                                                    />
                                                </div>
                                                <div style={{ marginBottom: 5 }}>
                                                    <Badge color="info">
                                                        {Moment(row.original.updatedTime).fromNow()}
                                                    </Badge>
                                                    <Badge color={row.original.paid ? 'success' : 'danger'} className="ml-2">
                                                        {row.original.paymentMethod == "cash" ? "Thanh toán tiền mặt" : "Thanh toán online"}
                                                    </Badge>
                                                    <Badge className="ml-2" color={(Moment(row.original.tasks.filter((item)=>item.status!="cancel")[0].startTime).toDate()<Moment().add(12,'hours').toDate()?"danger":"success")}>từ {Moment(row.original.tasks.filter((item)=>item.status!="cancel")[0].startTime).format("HH[g]mm [ngày] DD/MM ")}</Badge>
                                                    <h6><small>Khách hàng: <strong>{row.original.name} - {row.original.phoneNumber}</strong></small></h6>
                                                    <h6><small>Dịch vụ: <strong>{row.original.service.group.name}</strong> - <strong>{row.original.service.name}</strong></small></h6>                                                    
                                                    <h6><small>Địa chỉ: <strong>{row.original.address} - {row.original.wards} - {row.original.district} - {row.original.province}</strong></small></h6>
                                                    {/* <h6 style={{maxLines:2,overflow:"hidden"}}><small>Ghi chú: <span>{row.original.note}</span></small></h6> */}
                                                </div>
                                            </div>
                                        }
                                    ]
                                    }
                                />

                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Card>
                            <CardHeader>
                                <strong>{this.state.todayOrderRecords}</strong> ĐĂNG KÝ HÔM NAY
                            </CardHeader>
                            <CardBody>
                                <ReactTable
                                    manual
                                    noDataText="Chưa có yêu cầu mới"
                                    TheadComponent={TheadComponent}
                                    data={this.state.todayOrders}
                                    onFetchData={this.fetchTodayOrder}
                                    pages={this.state.todayOrderPages}
                                    defaultPageSize={5}
                                    nextText="Sau"
                                    previousText="Trước"
                                    pageText="Trang"
                                    showPageJump={false}
                                    showPageSizeOptions={false}
                                    showPagination={this.state.todayOrderRecords > 5}
                                    columns={[
                                        {
                                            Cell: row => row.original.user ? <div>
                                                <div style={{ display: "flex", flexDirection: "row" }}>
                                                    <div style={{ paddingRight: 10 }}>
                                                        <Avatar
                                                            className="can-click"
                                                            style={{ width: 80, height: 80 }}
                                                            src={row.original.user.avatar}
                                                            onClick={e=>this.props.history.push(`order-edit/${row.original._id}`)}
                                                        />
                                                    </div>
                                                    <div style={{ marginBottom: 5, width: "100%" }}>
                                                        <h5><Badge color="primary"><span style={{ color: "white" }}>Dịch vụ: </span>{row.original.service.group.name}</Badge> - <Badge color="primary">{row.original.service.name}</Badge></h5>
                                                        <h6><span>Khách hàng:</span> <strong>{row.original.user.fullName} - {row.original.user.phoneNumber}</strong></h6>
                                                        <h6><small><span>Địa chỉ: </span>{row.original.address}</small></h6>

                                                    </div>
                                                    <div>
                                                        <small style={{ float: "right", color: "grey" }}>{Moment(row.original.createdTime).fromNow()}</small>
                                                        <Badge color={row.original.paid ? 'success' : "danger"} className="m-1 p-1" style={{ float: "right", textTransform: "uppercase" }}>Thanh toán {(row.original.paymentMethod == "cash" ? "Tiền mặt" : "Online")}</Badge>
                                                        <Badge className="m-1 p-1" style={{ float: "right", textTransform: "uppercase" }} color={(row.original.status == "pending" ? "warning" : "success")}>{(row.original.status == "pending" ? "TÌM NGƯỜI NHẬN" : "CHỜ PHỤC VỤ")}</Badge>

                                                    </div>
                                                </div>
                                                <div>
                                                    {
                                                        row.original.tasks.map((task,index) =>task.status!="cancel"&&<span key={index} style={{ margin: "0 5px" }}>

                                                            <div style={{ float: "left", display: "block-inline", textAlign: "center", lineHeight: 1, borderRadius: "50%", margin: 4, padding: "8px 10px", border: `1px solid ${this.getTaskColor(task.status)}`, color: "#aaaaaa" }}>
                                                                <span style={{ fontSize: 16, fontWeight: "bold" }}> {Moment(task.startTime).format("DD")}</span>
                                                                <br />
                                                                <small>{Moment(task.startTime).format("HH:mm")}</small>
                                                            </div>

                                                        </span>
                                                        )
                                                    }
                                                </div>
                                            </div> : null

                                        }
                                    ]
                                    }
                                />
                            </CardBody>
                        </Card>
                    </Col>
                    <Col>
                        <Card>
                            <CardHeader>
                                <strong>{this.state.pendingTicketRecords}</strong> PHẢN HỒI
                            </CardHeader>
                            <CardBody>
                                <ReactTable
                                    manual
                                    noDataText="Chưa có phản hồi mới"
                                    TheadComponent={TheadComponent}
                                    data={pendingTickets}
                                    onFetchData={this.fetchTicket}
                                    defaultPageSize={5}
                                    pages={this.state.pendingTicketPages}
                                    nextText="Sau"
                                    previousText="Trước"
                                    pageText="Trang"
                                    showPageJump={false}
                                    showPageSizeOptions={false}
                                    showPagination={this.state.pendingTicketRecords > 5}
                                    columns={[
                                        {
                                            Cell: row => row.original.user ? <div style={{ display: "flex", flexDirection: "row" }}>
                                                <div style={{ paddingRight: 10 }}>
                                                    <Avatar
                                                        className="can-click"
                                                        src={row.original.user.avatar}
                                                    />
                                                </div>
                                                <div style={{ marginBottom: 5, width: "100%" }}>
                                                    
                                                    <h6><Badge color="primary">Khách hàng:</Badge> {row.original.user.fullName} - {row.original.user.phoneNumber}</h6>
                                                    <h6><small><span>Lý do gửi: </span><strong>{row.original.type=="feedback"?"Phản hồi dịch vụ":row.original.type=="customer_away"?"Khách hàng không có nhà":""}</strong></small></h6>
                                                    <h6><small><span style={{ color: "grey" }}>Dịch vụ: </span>{row.original.order && row.original.order.service.name}</small></h6>
                                                    <h6><small><span style={{ color: "grey" }}>Nội dung: </span>{row.original.note}</small></h6>
                                                </div>
                                                <div>
                                                    <div><small style={{float: "right",  color: "grey" }}>{Moment(row.original.createdTime).fromNow()}</small></div>
                                                    <Badge className="p-1 m-1" style={{ textTransform: "uppercase", float: "right" }} color={(row.original.status == "pending" ? "warning" : "success")}>{(row.original.status == "pending" ? "Chờ xử lý" : "Đang xử lý")}</Badge>
                                                    <Button onClick={e => this.setState({ editTicket: row.original })} style={{ float: "right", marginTop: 5 }} size="sm" color="primary">Cập nhật</Button>
                                                </div>
                                            </div> :
                                            <div style={{ display: "flex", flexDirection: "row" }}>
                                                <div style={{ paddingRight: 10 }}>
                                                    <Avatar
                                                        className="can-click"
                                                        src={row.original.account.info.image}
                                                    />
                                                </div>
                                                <div style={{ marginBottom: 5, width: "100%" }}>                                                    
                                                    <h6><Badge color="secondary">Nhân viên:</Badge> {row.original.account.info.fullName} - {row.original.account.info.phoneNumber}</h6>
                                                    <h6><small><span>Lý do gửi: </span><strong>{row.original.type=="feedback"?"Phản hồi dịch vụ":row.original.type=="customer_away"?"Khách hàng không có nhà":""}</strong></small></h6>
                                                    <h6><small><span style={{ color: "grey" }}>Dịch vụ: </span>{row.original.order && row.original.order.service.name}</small></h6>
                                                    <h6><small><span style={{ color: "grey" }}>Nội dung: </span>{row.original.note}</small></h6>
                                                </div>
                                                <div>
                                                    <div><small style={{float: "right",  color: "grey" }}>{Moment(row.original.createdTime).fromNow()}</small></div>
                                                    <Badge className="p-1 m-1" style={{ textTransform: "uppercase", float: "right" }} color={(row.original.status == "pending" ? "warning" : "success")}>{(row.original.status == "pending" ? "Chờ xử lý" : "Đang xử lý")}</Badge>
                                                    <Button onClick={e => this.setState({ editTicket: row.original })} style={{ float: "right", marginTop: 5 }} size="sm" color="primary">Cập nhật</Button>
                                                </div>
                                            </div>
                                        }
                                    ]
                                    }
                                />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                {
                    this.state.selectedExpiredTask&&<Modal size="lg" isOpen={true} toggle={e=>this.setState({selectedExpiredTask:undefined})}>
                        <ModalHeader>
                            XỬ LÝ TRỄ VIỆC
                        </ModalHeader>
                        <ModalBody>
                            <div style={{ display: "flex", flexDirection: "row" }}>
                                <div style={{ paddingRight: 10 }}>
                                    <Avatar
                                        className="can-click" src={this.state.selectedExpiredTask.account.info.image}                                       
                                    />
                                </div>
                                    <div style={{width:"100%"}}>
                                        <h6><small><span style={{ color: "grey" }}>Nhân viên:</span> {this.state.selectedExpiredTask.account.info.fullName} - {this.state.selectedExpiredTask.account.info.phoneNumber}</small></h6>
                                        <h6><small><span style={{ color: "grey" }}>Công việc:</span> {this.state.selectedExpiredTask.order.service.name}</small></h6>
                                        <h6><small><span style={{ color: "grey" }}>Làm việc từ: </span> {Moment(this.state.selectedExpiredTask.startTime).format("HH:mm")}-{Moment(this.state.selectedExpiredTask.endTime).format("HH:mm")} ngày {Moment(this.state.selectedExpiredTask.date).format("DD/MM")}</small></h6>
                                        <div style={{position:"relative"}}>
                                            <Badge color="warning">{this.state.selectedExpiredTask.status == "confirm" ? "Chưa bắt đầu" : "Chưa kết thúc"}</Badge>
                                            <Badge style={{marginLeft:10,marginTop: 3 }} color="danger">Trễ {Moment(this.state.selectedExpiredTask.startTime).fromNow(true)}</Badge>                                                                                                            
                                        </div>
                                        
                                        <hr style={{ margin: "8px 0 0 0" }} />
                                    </div>
                                </div>
                                    <div style={{ display: "flex", flexDirection: "row", marginBottom: 10 }}>
                                        <div style={{ paddingRight: 10 }}>
                                            <Avatar
                                                className="can-click" src={this.state.selectedExpiredTask.order.user && this.state.selectedExpiredTask.order.user.avatar}
                                                
                                            />
                                        </div>
                                        <div>
                                            <h6><small><span style={{ color: "grey" }}>Khách hàng:</span> {this.state.selectedExpiredTask.order.name} - {this.state.selectedExpiredTask.order.phoneNumber}</small></h6>
                                            <h6><small><span style={{ color: "grey" }}>Địa chỉ: </span>{this.state.selectedExpiredTask.order.address} - {this.state.selectedExpiredTask.order.wards} - {this.state.selectedExpiredTask.order.district} - {this.state.selectedExpiredTask.order.province}</small></h6>
                                            <p>Ghi chú: {this.state.selectedExpiredTask.order.note}</p>
                                        </div>
                                    </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button onClick={e=>{this.setState({messageInfo:{type:"account",receiverId:this.state.selectedExpiredTask.accountId,name:"nhân viên "+this.state.selectedExpiredTask.account.name}})}} color="warning" size="sm">Nhắn tin nhân viên</Button>
                            <Button color="success" onClick={e=>{
                                try{
                                    if(this.state.selectedExpiredTask.account.info.phoneNumber!=''&&this.state.selectedExpiredTask.account.info.phoneNumber!=null)
                                    this.context.startCall(this.state.selectedExpiredTask.account.info.phoneNumber)
                                }catch(err){}
                            }} size="sm">Gọi nhân viên</Button>
                            <Button onClick={e=>{this.setState({messageInfo:{type:"user",receiverId:this.state.selectedExpiredTask.userId,name:"khách hàng "+this.state.selectedExpiredTask.order.name}})}} color="warning" size="sm">Nhắn tin khách hàng</Button>
                            <Button onClick={e=>{
                                try{
                                    this.context.startCall(this.state.selectedExpiredTask.order.phoneNumber)
                                }catch(err){}
                            }} color="success" size="sm">Gọi khách hàng</Button>
                            <Button onClick={e=>this.props.history.push(`/order-edit/${this.state.selectedExpiredTask.order._id}`)} color="primary" size="sm">Chi tiết đơn hàng</Button>
                            <Button color="info" size="sm" onClick={e=>this.setState({selectedExpiredTask:undefined})}>Đóng</Button>
                        </ModalFooter>
                    </Modal>
                }
                {this.state.editTicket && <Modal isOpen={true} toggle={e => this.setState({ editTicket: undefined })}>
                    <ModalHeader>
                        Cập nhập tình trạng Phản hồi
                    </ModalHeader>
                    <ModalBody>
                        <div style={{ display: "flex", flexDirection: "row" }}>
                            <div style={{ paddingRight: 10 }}>
                                {
                                    this.state.editTicket.user && <Avatar
                                        className="can-click"
                                        src={this.state.editTicket.user.avatar}
                                    />
                                }
                                {
                                    this.state.editTicket.account&&<Avatar
                                        className="can-click"
                                        src={this.state.editTicket.account.info.image}
                                    />
                                }
                            </div>
                            <div style={{ marginBottom: 5, width: "100%" }}>
                                <h6>
                                    <small style={{ color: "grey" }}>{Moment(this.state.editTicket.createdTime).fromNow()}</small>
                                </h6>
                                <h6>
                                {
                                    this.state.editTicket.account&&<div><Badge color="secondary">Nhân viên:</Badge> {this.state.editTicket.account.info.fullName} - {this.state.editTicket.account.info.phoneNumber}</div>
                                }
                                {
                                    this.state.editTicket.user&&<div><Badge color="primary">Khách hàng:</Badge> {this.state.editTicket.user.fullName} - {this.state.editTicket.user.phoneNumber}</div>
                                }
                                </h6>
                                <h6><small><span style={{ color: "grey" }}>Dịch vụ: </span>{this.state.editTicket.order && this.state.editTicket.order.service.name}</small></h6>
                                <h6><small><span style={{ color: "grey" }}>Nội dung: </span>{this.state.editTicket.note}</small></h6>
                            </div>
                            <div>
                                <Badge style={{ float: "right" }} color={(this.state.editTicket.status == "pending" ? "warning" : "success")}>{(this.state.editTicket.status == "pending" ? "Chờ xử lý" : "Đang xử lý")}</Badge>
                            </div>
                        </div>
                        <hr />
                        <Form>
                            <FormGroup>
                                <div>
                                    <Input onChange={e => { this.state.editTicket.note = e.target.value; this.setState({ editTicket: this.state.editTicket }) }} size="sm" placeholder="Nội dung ghi chú" type="textarea" />
                                </div>
                            </FormGroup>
                            <FormGroup check inline>
                                <Label check>
                                    <Input onChange={e => { this.state.editTicket.status = e.target.value; this.setState({ editTicket: this.state.editTicket }) }} type="radio" value="processing" name="status" /> <span className="text-warning">Đang xử lý</span>
                                </Label>
                            </FormGroup>
                            <FormGroup check inline>
                                <Label check>
                                    <Input onChange={e => { this.state.editTicket.status = e.target.value; this.setState({ editTicket: this.state.editTicket }) }} type="radio" value="approve" name="status" /><span className="text-success">Đã xử lý</span>
                                </Label>
                            </FormGroup>
                            <FormGroup check inline>
                                <Label check>
                                    <Input onChange={e => { this.state.editTicket.status = e.target.value; this.setState({ editTicket: this.state.editTicket }) }} type="radio" value="decline" name="status" /><span className="text-danger">Từ chối xử lý</span>
                                </Label>
                            </FormGroup>
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={this.updateTicket} color="primary" size="sm">Cập nhật</Button>
                        <Button onClick={e => this.setState({ editTicket: undefined })} color="info" size="sm">Bỏ qua</Button>
                    </ModalFooter>
                </Modal>
                }

            {
            this.state.messageInfo&&<Modal isOpen={true} toggle={e=>this.setState({messageInfo:undefined})}>
                <ModalHeader>
                    Gửi thông báo đến {this.state.messageInfo.name}
                </ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Label>Chủ đề</Label>
                            <Input value={this.state.messageInfo.title} onChange={e=>{this.state.messageInfo.title=e.target.value}}/>
                        </FormGroup>
                        <FormGroup>
                            <Label>Nội dung</Label>
                            <Input type="textarea" value={this.state.messageInfo.message} onChange={e=>{this.state.messageInfo.message=e.target.value}}/>
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={this.sendNotify}>Gửi</Button>
                    <Button color="info" onClick={e=>this.setState({messageInfo:undefined})}>Đóng</Button>
                </ModalFooter>
            </Modal>
            }
            </Page>
        )
    }
}
ServiceDaskboard.contextTypes = SipProvider.childContextTypes;
export default withApollo(ServiceDaskboard);