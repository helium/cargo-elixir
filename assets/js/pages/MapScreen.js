import React from "react"
import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl';
import NavBar from '../components/NavBar'

const Map = ReactMapboxGl({
  accessToken:
    'pk.eyJ1IjoicGV0ZXJtYWluIiwiYSI6ImNqMHA5dm8xbTAwMGQycXMwa3NucGptenQifQ.iVCDWzb16acgOKWz65AckA'
})

class MapScreen extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      devices: []
    }
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

  render() {
    const { devices } = this.state
    return (
      <div style={{ flex: 1 }}>
        <Map
          style="mapbox://styles/petermain/cjyzlw0av4grj1ck97d8r0yrk"
          container="map"
          center={[-122.419190, 37.771150]}
          containerStyle={{
            height: '100vh',
            width: '100vw'
          }}
        >
          <Layer type="symbol" id="marker" layout={{ 'icon-image': 'marker-15' }}>
            <Feature coordinates={[-0.481747846041145, 51.3233379650232]} />
          </Layer>
        </Map>

        <NavBar
          devices={devices}
        />
      </div>
    )
  }
}

export default MapScreen
