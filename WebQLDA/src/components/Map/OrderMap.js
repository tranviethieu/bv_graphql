import React, { Component,Fragment } from 'react';
import GoogleMapReact from 'google-map-react';
import Moment from 'moment'
import {medical_map,order_map,compass48,flagpink48,ballorange48,pingreen48,homemarker48} from 'assets/img/icon';
import Avatar from 'components/Avatar';
import {uniqueArray} from 'utils/ArrayHelper'
class OrderMap extends Component{
  static defaultProps = {
    center: {
      lat: 20.9772142,
      lng: 105.7812095
    },
    zoom: 11,
    openBallonId:""
  };
  constructor(props){
    super(props);
    this.state={openBallonId: props.openBallonId};
  }
  
  // componentDidUpdate(){
  //   this.setState({openBallonId:this.props.openBallonId});
  // }
  componentWillReceiveProps(nextProps) {
    // You don't have to do this check first, but it can help prevent an unneeded render
    if (nextProps.openBallonId !== this.state.openBallonId) {
      // this.setState({ openBallonId: nextProps.openBallonId });
      this.state.openBallonId=nextProps.openBallonId;
    }
  }

  onMarkerClick = (key,marker) => {  
    const{openBallonId} = this.state;
    
      if(openBallonId!=key)
        this.setState({openBallonId:key});
      else
        this.setState({openBallonId:""});
  };

  render(){
    var height=400;
    if(this.props.height)
      height=this.props.height;
    const orderPlaces =  this.props.markers&&this.props.markers.filter((marker)=>{
      return marker.type=="order"||marker.type=="customer";
    })
    
    const locationPlaces = this.props.markers&&this.props.markers.filter((marker)=>{
      return marker.type=="location";
    })
    const employeePlaces = this.props.markers&&this.props.markers.filter((marker)=>{
      return marker.type=="employee"||marker.type=="account"||marker.type=="matching";
    })
    const taskPlaces = this.props.markers&&this.props.markers.filter((marker)=>{
      return marker.type=="task";
    })

    const TaskMarkers = taskPlaces &&
      taskPlaces.map((place) => (
        uniqueArray(place.items,"_id").map((task)=>
          task.order==null?null:
          <MarkerTask
          // required props
          key={task._id}
          lat={task.order.geo[0]}
          lng={task.order.geo[1]}
          type={place.type}
          slug={place.slug}
          // any user props
          show={this.state.openBallonId==task._id}
          item={task} />)
      ));
    const OrderMarkers = orderPlaces &&
      orderPlaces.map((place) => (
        uniqueArray(place.items,"_id").map((order)=>
          order.geo==null?null:
          <MarkerOrder
          // required props
          key={order._id}
          lat={order.geo[0]}
          lng={order.geo[1]}
          type={place.type}
          slug={place.slug}
          // any user props
          show={this.state.openBallonId==order._id}
          item={order} />)
      ));
      const EmployeeMarkers = employeePlaces &&
      employeePlaces.map((place) => (
        uniqueArray(place.items,"_id").map((item)=>
          item.geo==null?null:
          <MarkerEmployee
          // required props
          key={place.type=="matching"?item.locationId:item._id}
          lat={item.geo[0]}
          lng={item.geo[1]}
          type={place.type}
          slug={place.slug}
          // any user props
          show={this.state.openBallonId==(place.type=="matching"?item.locationId:item._id)}
          item={item} />)
      ));
    const LocationMarkers = locationPlaces&&
        locationPlaces.map((place)=>(
          uniqueArray(place.items,"address").map((location)=>
            location.geo==null?null:
            <MarkerLocation
            // required props
              key={location.address}
              lat={location.geo[0]}
              lng={location.geo[1]}
              type={place.type}
              slug={place.slug}
              // any user props
              show={this.state.openBallonId==location.address}
              item={location} />
          )
      ));
    return (
      // Important! Always set the container height explicitly
      <div style={{ height: height, width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyBKOI4vBd7Mm_hH-pwSyGZAM-qqgaVbpXU" }}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
          onChildClick={this.onMarkerClick}
        >
          {OrderMarkers}
          {LocationMarkers}
          {EmployeeMarkers}
          {TaskMarkers}
        </GoogleMapReact>
      </div>
    );
  }
}
export default OrderMap;

const MarkerOrder = ({ item,show,type }) => {
  const markerStyle = {    
    color: show ? '#60D4C8' : 'red',
    transform: show?"scale(1.5) translateX(-4px) translateY(-4px)":"",
    transition:show? "300ms":"",
    cursor: 'pointer',
    zIndex: show?11:10,
    fontSize:24
  };
  return(
    <Fragment>
      <div style={markerStyle}>
        {/* <MdPinDrop/> */}
        <img src={type=="order"?homemarker48:flagpink48} width={22}/>
      </div>
      {show && <OrderInfoWindow order={item} />}
    </Fragment>
  )
}
const MarkerTask = ({ item,show }) => {
  const markerStyle = {    
    color: show ? '#60D4C8' : 'red',
    transform: show?"scale(1.5) translateX(-4px) translateY(-4px)":"",
    transition:show? "300ms":"",
    cursor: 'pointer',
    zIndex: show?11:10,
    fontSize:24
  };
  return(
    <Fragment>
      <div style={markerStyle}>
        {/* <MdPinDrop/> */}
        <img src={order_map} width={18}/>
      </div>
      {show && <OrderInfoWindow order={item.order} />}
    </Fragment>
  )
}
const MarkerEmployee = ({ item,show,type }) => {
  const markerStyle = {    
    color: show ? '#60D4C8' : 'red',
    transform: show?"scale(1.5) translateX(-4px) translateY(-4px)":"",
    transition:show? "300ms":"",
    cursor: 'pointer',
    zIndex: show?11:10,
    fontSize:24
  };
  
  return(
    <Fragment>
      <div style={markerStyle}>
        <img src={type=="employee"?medical_map:compass48} width={24}/>
      </div>
      {show && (type== "employee"?<EmployeeInfoWindow employee={item} />:<AccountInfoWindow account={type=="matching"?item.account:item}/>)}
    </Fragment>
  )
}

const MarkerLocation = ({ item,show }) => {
  const markerStyle = {    
    color: show ? '#60D4C8' : 'red',
    transform: show?"scale(1.5) translateX(-4px) translateY(-4px)":"",
    transition:show? "300ms":"",
    cursor: 'pointer',
    zIndex: show?11:10,
    fontSize:24
  };
  return(
    <Fragment>
      <div style={markerStyle}>
        {/* <MdPinDrop/> */}
        <img src={medical_map} width={24}/>
      </div>
      {show && <div style={{width:250,backgroundColor:"#ffffff",padding:5}}><p>Địa chỉ: {item.address}</p></div>}
    </Fragment>
  )
}

// InfoWindow component
const OrderInfoWindow = (props) => {
  const { order } = props;
  const infoWindowStyle = {
    position: 'relative',
    bottom: 0,
    left: '0px',
    width: 220,
    backgroundColor: 'white',
    boxShadow: '0 2px 7px 1px rgba(0, 0, 0, 0.3)',
    padding: 10,
    fontSize: 12,
    zIndex: 100,
  };

  return (
    <div style={infoWindowStyle}>
      <div style={{ fontSize: 16 }}>
        {order.name}
      </div>      
      <div>
        <label style={{color:"grey"}}>SĐT:</label>{order.phoneNumber}
      </div>
      <div>
        <label style={{color:"grey"}}>Địa chỉ:</label>{order.address}
      </div>
      <div>
        <label style={{color:"grey"}}>Dịch vụ:</label>{order.service.name}
      </div> 
      <div style={{ color: 'green' }}>
        {Moment(order.updatedTime).fromNow()}
      </div>
    </div>
  );
};

const AccountInfoWindow =(props)=>{
  const { account } = props;
  const infoWindowStyle = {
    position: 'relative',
    bottom: 0,
    left: '35px',
    top:-100,
    width: 220,
    backgroundColor: 'white',
    boxShadow: '1px rgba(0, 0, 0, 0.3)',
    padding: 10,
    fontSize: 12,
    zIndex: 100,
  };

  return (
    <div style={{...infoWindowStyle,display:"flex" ,flexDirection:"row"}}>
      <div style={{ fontSize: 16,marginRight:5 }}>
        <Avatar src={account.info.image}/>
      </div>      
      <div>
        <h6>{account.info.fullName}</h6>
        <label style={{color:"grey"}}>SĐT:</label>{account.info.phoneNumber}
      </div>
    </div>
  );
}
const EmployeeInfoWindow = (props) => {
  const { employee } = props;
  const infoWindowStyle = {
    position: 'relative',
    bottom: 0,
    left: '35px',
    top:-50,
    width: 220,
    backgroundColor: 'white',
    boxShadow: '0 2px 7px 1px rgba(0, 0, 0, 0.3)',
    padding: 10,
    fontSize: 12,
    zIndex: 100,
  };

  return (
    <div style={infoWindowStyle}>
      <div style={{ fontSize: 16 }}>
        <Avatar src={employee.account.info.image}/>{employee.account.name}
      </div>      
      <div>
        <label style={{color:"grey"}}>SĐT:</label>{employee.account.info.phoneNumber}
      </div>
      <div>
        <label style={{color:"grey"}}>Địa chỉ:</label>{employee.address}
      </div>
      <div>
        <label style={{color:"grey"}}>Dịch vụ:</label>
        <ul style={{marginLeft:30}}>{employee.services.map((service,index)=><li>{service.name}</li>)}</ul>
      </div> 
    </div>
  );
};

