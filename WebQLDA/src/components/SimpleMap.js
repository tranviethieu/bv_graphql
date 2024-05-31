import React, { Component,Fragment } from 'react';
import GoogleMapReact from 'google-map-react';
import PropTypes from 'prop-types';
import {MdPinDrop,MdAccountBox,MdAccountBalance,MdAccountBalanceWallet} from 'react-icons/lib/md';

// InfoWindow component
const InfoWindow = (props) => {
  const { place } = props;
  const infoWindowStyle = {
    position: 'relative',
    bottom: 150,
    left: '-45px',
    width: 220,
    backgroundColor: 'white',
    boxShadow: '0 2px 7px 1px rgba(0, 0, 0, 0.3)',
    padding: 10,
    fontSize: 14,
    zIndex: 100,
  };

  return (
    <div style={infoWindowStyle}>
      <div style={{ fontSize: 16 }}>
        {place.name}
      </div>
      <div style={{ fontSize: 14 }}>
        <span style={{ color: 'grey' }}>
          {place.rating}{' '}
        </span>
        <span style={{ color: 'orange' }}>
          {String.fromCharCode(9733).repeat(Math.floor(place.rating))}
        </span>
        <span style={{ color: 'lightgrey' }}>
          {String.fromCharCode(9733).repeat(5 - Math.floor(place.rating))}
        </span>
      </div>
      <div style={{ fontSize: 14, color: 'grey' }}>
        {place.types[0]}
      </div>
      <div style={{ fontSize: 14, color: 'grey' }}>
        {'$'.repeat(place.price_level)}
      </div>
      <div style={{ fontSize: 14, color: 'green' }}>
        {place.opening_hours.open_now ? 'Open' : 'Closed'}
      </div>
    </div>
  );
};
const AnyReactComponent = ({ text }) => <div style={{fontSize:24,color:"red"}}><MdPinDrop/></div>;
const AnyReactComponent2 = ({ text }) => <div style={{fontSize:24,color:"red"}}><MdAccountBox/></div>;
const AnyReactComponent3 = ({ text }) => <div style={{fontSize:24,color:"red"}}><MdAccountBalance/></div>;
const AnyReactComponent4 = ({ text }) => <div style={{fontSize:24,color:"red"}}><MdAccountBalanceWallet/></div>;
const Marker = (props) => {
  const markerStyle = {
    border: '1px solid white',
    borderRadius: '50%',
    height: 10,
    width: 10,
    backgroundColor: props.show ? 'red' : 'blue',
    cursor: 'pointer',
    zIndex: 10,
  };

  return (
    <Fragment>
      <div style={markerStyle} />
      {props.show && <InfoWindow place={props.place} />}
    </Fragment>
  );
};
class SimpleMap extends Component {
  static defaultProps = {
    center: {
      lat: 20.9772142,
      lng: 105.7812095
    },
    zoom: 11
  };
  _onBoundsChange = (center, zoom, bounds, marginBounds) => {
    if (this.props.onBoundsChange) {
      this.props.onBoundsChange({center, zoom, bounds, marginBounds});
    } else {
      this.props.onCenterChange(center);
      this.props.onZoomChange(zoom);
    }
  }

  _onChildClick = (key, childProps) => {
    const markerId = childProps.marker.get('id');
    const index = this.props.markers.findIndex(m => m.get('id') === markerId);
    if (this.props.onChildClick) {
      this.props.onChildClick(index);
    }
  }

  _onChildMouseEnter = (key, childProps) => {
    const markerId = childProps.marker.get('id');
    const index = this.props.markers.findIndex(m => m.get('id') === markerId);
    if (this.props.onMarkerHover) {
      this.props.onMarkerHover(index);
    }
  }

  _onChildMouseLeave = (/* key, childProps */) => {
    if (this.props.onMarkerHover) {
      this.props.onMarkerHover(-1);
    }
  }

  _onBalloonCloseClick = () => {
    if (this.props.onChildClick) {
      this.props.onChildClick(-1);
    }
  }
  onChildClickCallback = (key) => {
    this.setState((state) => {
      const index = state.places.findIndex(e => e.id === key);
      state.places[index].show = !state.places[index].show; // eslint-disable-line no-param-reassign
      return { places: state.places };
    });
  };
  render() {
    // const Markers = this.props.markers &&
    //   this.props.markers.filter((m, index) => index >= rowFrom && index <= rowTo)
    //   .map((marker, index) => (
    //     <MarkerExample
    //       // required props
    //       key={marker.get('id')}
    //       lat={marker.get('lat')}
    //       lng={marker.get('lng')}
    //       // any user props
    //       showBallon={index + rowFrom === this.props.openBallonIndex}
    //       onCloseClick={this._onBalloonCloseClick}
    //       hoveredAtTable={index + rowFrom === this.props.hoveredRowIndex}
    //       scale={getScale(index + rowFrom, this.props.visibleRowFirst, this.props.visibleRowLast, K_SCALE_NORMAL)}
    //       {...markerDescriptions[marker.get('type')]}
    //       marker={marker} />
    //   ));
    return (
      // Important! Always set the container height explicitly
      <div style={{ height: 400, width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyBKOI4vBd7Mm_hH-pwSyGZAM-qqgaVbpXU" }}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
          onChildClick={this.onChildClickCallback}
        >
          <AnyReactComponent
            lat={20.9772142}
            lng={105.7812095}
            text="Elsaga"
          />
          <AnyReactComponent4
            lat={20.9572142}
            lng={105.7812095}
            text="Elsaga"
          />
          <AnyReactComponent2
            lat={20.9472142}
            lng={105.7812095}
            text="Elsaga"
          />
          <AnyReactComponent3
            lat={20.9372142}
            lng={105.7812095}
            text="Elsaga"
          />
          <Marker
            key={1}
            lat={21}
            lng={105.7812095}
            show={false}
            place={1}
          />
        </GoogleMapReact>
      </div>
    );
  }
}
InfoWindow.propTypes = {
  place: PropTypes.shape({
    name: PropTypes.string,
    formatted_address: PropTypes.string,
    rating: PropTypes.number,
    types: PropTypes.array,
    price_level: PropTypes.number,
    opening_hours: PropTypes.object,
  }).isRequired,
};

Marker.propTypes = {
  show: PropTypes.bool.isRequired,
  place: PropTypes.shape({
    name: PropTypes.string,
    formatted_address: PropTypes.string,
    rating: PropTypes.number,
    types: PropTypes.array,
    price_level: PropTypes.number,
    opening_hours: PropTypes.object,
  }).isRequired,
};
 
export default SimpleMap;