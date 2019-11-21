import React from "react"
import ReactMapboxGl, { Layer, Marker, Feature } from 'react-mapbox-gl';
import NavBar from '../components/NavBar'
import geoJSON from "geojson";

const styles = {
  selectedMarker: {
    width: 14,
    height: 14,
    borderRadius: "50%",
    backgroundColor: "#1B8DFF",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "4px solid #fff",
    animation: 'pulse 2s ease infinite'
  },
}

const Map = ReactMapboxGl({
  accessToken:
    'pk.eyJ1IjoicGV0ZXJtYWluIiwiYSI6ImNqMHA5dm8xbTAwMGQycXMwa3NucGptenQifQ.iVCDWzb16acgOKWz65AckA'
})

class MapScreen extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      devices: [],
      selectedDevice: null,
      packetsGeoJson: [],
      mapCenter: [-122.419190, 37.771150],
    }

    this.selectDevice = this.selectDevice.bind(this)
  }

  componentDidMount() {
    this.loadDevices()
  }

  loadDevices() {
    fetch("https://cargo.helium.com/oui/1/devices")
      .then(res => res.json())
      .then(devices => {
        this.setState({ devices })
      })
  }

  selectDevice(d) {
    const payloadRange = d.created_at ? Math.floor((Math.abs(new Date() - new Date(d.created_at))/1000)/60) + 120 : 120;
    fetch("https://cargo.helium.com/devices/" + d.device_id + "/payloads/" + payloadRange)
      .then(res => res.json())
      .then(data => {
        const packets = data.map(d => ({
          id: d.id,
          key: d.lat + d.lon,
          coordinates: { lat: d.lat, lon: d.lon },
          speed: d.speed,
          rssi: d.rssi,
          battery: d.battery,
          elevation: d.elevation,
          hotspot_id: d.hotspot_id.replace("rapping", "dandy"),
          seq_num: d.seq_num,
          reported: d.created_at
        }))

        const lastPacket = packets[packets.length - 1]
        const packetsGeoJson = geoJSON.parse(packets, { Point: ["coordinates.lat", "coordinates.lon"]})
        this.setState({
          selectedDevice: d,
          packetsGeoJson,
          mapCenter: [lastPacket.coordinates.lon, lastPacket.coordinates.lat],
          lastPacket,
        })
      })
  }

  render() {
    const { devices, mapCenter, packetsGeoJson, selectedDevice, lastPacket } = this.state

    return (
      <div style={{ flex: 1 }}>
        <Map
          style="mapbox://styles/petermain/cjyzlw0av4grj1ck97d8r0yrk"
          container="map"
          center={mapCenter}
          containerStyle={{
            height: '100vh',
            width: '100vw'
          }}
          movingMethod="jumpTo"
        >
          {
            selectedDevice && (
              <Layer key={selectedDevice.device_id} type="circle" paint={{"circle-color": "#4790E5"}}>
                {packetsGeoJson.features.map(p => (
                  <Feature
                    key={p.properties.key}
                    coordinates={geoToMarkerCoords(p.properties.coordinates)}
                  />
                ))}
              </Layer>
            )
          }

          {
            lastPacket && (
              <Marker
                style={styles.selectedMarker}
                anchor="center"
                coordinates={geoToMarkerCoords(lastPacket.coordinates)}
              />
            )
          }
        </Map>

        <NavBar
          devices={devices}
          selectDevice={this.selectDevice}
          selectedDevice={selectedDevice}
        />
      </div>
    )
  }
}

const geoToMarkerCoords = geo => [geo.lon, geo.lat]

export default MapScreen
