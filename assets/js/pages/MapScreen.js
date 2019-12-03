import React from "react"
import ReactMapboxGl, { Layer, Marker, Feature } from 'react-mapbox-gl';
import NavBar from '../components/NavBar'
import Inspector from '../components/Inspector'
import Timeline from '../components/Timeline'
import { packetsToChartData } from '../data/chart'
import geoJSON from "geojson";
import hotspotsJSON from '../data/hotspots.json'

const hotspotsData = {}
hotspotsJSON.data.forEach(d => {
  hotspotsData[d.name.toLowerCase()] = d
})

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
  gatewayMarker: {
    width: 14,
    height: 14,
    borderRadius: "50%",
    backgroundColor: "#A984FF",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "3px solid #8B62EA",
    boxShadow: "0px 2px 4px 0px rgba(0,0,0,0.5)"
  }
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
      packets: {},
      lastPacket: null,
      mapCenter: [-122.419190, 37.771150],
      hotspots: { data: [] },
      chartType: null,
    }

    this.selectDevice = this.selectDevice.bind(this)
    this.setChartType = this.setChartType.bind(this)
    this.setHotspots = this.setHotspots.bind(this)
  }

  componentDidMount() {
    this.loadDevices()
  }

  loadDevices() {
    fetch("api/oui/1/devices")
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
        const packets = {
          data: {},
          geoJson: null,
          seq: []
        }

        data.forEach(d => {
          if (packets.data[d.seq_num]) {
            if (packets.data[d.seq_num].rssi < d.rssi) packets.data[d.seq_num].rssi = d.rssi
            if (packets.data[d.seq_num].battery > d.battery) packets.data[d.seq_num].battery = d.battery
            packets.data[d.seq_num].hotspots.push(d.hotspot_id.replace("rapping", "dandy"))
          } else {
            packets.data[d.seq_num] = {
              id: d.id,
              key: d.lat + d.lon,
              coordinates: { lat: d.lat, lon: d.lon },
              speed: d.speed,
              rssi: d.rssi,
              battery: d.battery,
              elevation: d.elevation,
              seq_num: d.seq_num,
              reported: d.created_at
            }
            packets.data[d.seq_num].hotspots = [d.hotspot_id.replace("rapping", "dandy")]
            packets.seq.push(d.seq_num)
          }
        })

        const packetsArray = packets.seq.map(s => packets.data[s])
        packets.geoJson = geoJSON.parse(packetsArray, { Point: ["coordinates.lat", "coordinates.lon"]})
        const lastPacket = packetsArray[packetsArray.length - 1]
        this.setState({
          selectedDevice: d,
          packets,
          lastPacket,
          mapCenter: [lastPacket.coordinates.lon, lastPacket.coordinates.lat],
          hotspots: { data: [] },
        })
      })
  }

  setHotspots({ properties }) {
    const hotspots = { data: [], center: geoToMarkerCoords(properties.coordinates) }
    properties.hotspots.forEach(h => {
      if (hotspotsData[h]) hotspots.data.push(hotspotsData[h])
      else console.log("Found undefined hotspot name not shown on map, consider updating hotspots.json")
    })
    this.setState({ hotspots })
  }

  setChartType(chartType) {
    this.setState({ chartType })
  }

  render() {
    const { devices, mapCenter, selectedDevice, packets, lastPacket, hotspots, chartType } = this.state

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
                {packets.geoJson.features.map((p, i) => (
                  <Feature
                    onMouseEnter={() => this.setHotspots(p)}
                    key={p.properties.key + i}
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

          {
            hotspots.data.map((h, i) => (
              <Marker
                key={h.address + i}
                style={styles.gatewayMarker}
                anchor="center"
                coordinates={[h.lng, h.lat]}
              />
            ))
          }

          {
            hotspots.data.map((h, i) => (
              <Layer
                key={"line-" + h.address + i}
                type="line"
                layout={{ "line-cap": "round", "line-join": "round" }}
                paint={{ "line-color": "#A984FF", "line-width": 2 }}
              >
                <Feature
                  coordinates={[
                    [h.lng, h.lat],
                    hotspots.center
                  ]}
                />
              </Layer>
            ))
          }
        </Map>

        <NavBar
          devices={devices}
          selectDevice={this.selectDevice}
          selectedDevice={selectedDevice}
        />

        {
          lastPacket && (
            <Inspector lastPacket={lastPacket} selectedDevice={selectedDevice} setChartType={this.setChartType} chartType={chartType} />
          )
        }

        {
          chartType && (
            <Timeline
              type={chartType}
              packets={packets}
              setChartType={this.setChartType}
              setHotspots={this.setHotspots}
              chartData={packetsToChartData(packets.seq.map(s => packets.data[s]), chartType)}
            />
          )
        }
      </div>
    )
  }
}

const geoToMarkerCoords = geo => [geo.lon, geo.lat]

export default MapScreen
