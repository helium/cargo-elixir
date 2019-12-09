import React from "react"
import ReactMapboxGl, { Layer, Marker, Feature } from 'react-mapbox-gl';
import findIndex from 'lodash/findIndex'
import NavBar from '../components/NavBar'
import Inspector from '../components/Inspector'
import Timeline from '../components/Timeline'
import { packetsToChartData } from '../data/chart'
import geoJSON from "geojson";
import hotspotsJSON from '../data/hotspots.json'
import socket from "../socket"

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
      showHotspots: true,
      highlightHotspoted: null,
    }

    this.selectDevice = this.selectDevice.bind(this)
    this.setChartType = this.setChartType.bind(this)
    this.setHotspots = this.setHotspots.bind(this)
    this.clearHotspots = this.clearHotspots.bind(this)
    this.toggleHotspots = this.toggleHotspots.bind(this)
    this.highlightHotspot = this.highlightHotspot.bind(this)
    this.parsePackets = this.parsePackets.bind(this)
  }

  componentDidMount() {
    this.loadDevices()

    let channel = socket.channel("payload:new", {})
    channel.join()
      .receive("ok", resp => { console.log("Joined successfully", resp) })
      .receive("error", resp => { console.log("Unable to join", resp) })

    channel.on('new_payload', d => {
      if (this.state.selectedDevice && this.state.selectedDevice.device_id === d.device_id) {
        const packets = this.parsePackets(this.state.packets, d)
        const packetsArray = packets.seq.map(s => packets.data[s])
        packets.geoJson = geoJSON.parse(packetsArray, { Point: ["coordinates.lat", "coordinates.lon"]})
        const lastPacket = packetsArray[packetsArray.length - 1]

        this.setState({
          packets,
          lastPacket,
        })
      }

      const devices = this.state.devices
      const index = findIndex(this.state.devices, { device_id: d.device_id })
      devices[index].created_at = d.created_at
      this.setState({ devices })
    })
  }

  loadDevices() {
    fetch("api/oui/1")
      .then(res => res.json())
      .then(devices => {
        this.setState({ devices })
      })
  }

  selectDevice(d) {
    fetch("api/devices/" + d.device_id + "?last_at=" + d.created_at)
      .then(res => res.json())
      .then(data => {
        console.log("Received " + data.length + " Packets")
        let packets = {
          data: {},
          geoJson: null,
          seq: []
        }

        data.forEach(d => {
          packets = this.parsePackets(packets, d)
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
    this.setState({ hotspots: { data: [] } }, () => {
      const hotspots = { data: [], center: geoToMarkerCoords(properties.coordinates) }
      properties.hotspots.forEach(h => {
        if (hotspotsData[h]) hotspots.data.push(hotspotsData[h])
        else console.log("Found undefined hotspot name not shown on map, updating hotspots.json might help")
      })
      this.setState({ hotspots })
    })
  }

  clearHotspots() {
    this.setState({ hotspots: { data: [] } })
  }

  toggleHotspots() {
    this.setState({ showHotspots: !this.state.showHotspots })
  }

  highlightHotspot(h) {
    this.setState({ highlightedHotspot: h }, () => {
      setTimeout(() => {
        this.setState({ highlightedHotspot: null })
      }, 100)
    })
  }

  setChartType(chartType) {
    this.setState({ chartType })
  }

  parsePackets(packets, packet) {
    packet.battery = Number(packet.battery)
    packet.elevation = Number(packet.elevation)
    packet.lat = Number(packet.lat)
    packet.lon = Number(packet.lon)
    packet.rssi = Number(packet.rssi)
    packet.speed = Number(packet.speed)
    if (packet.lat == 0 || packet.lon == 0) return packets

    if (packets.data[packet.seq_num]) {
      if (packets.data[packet.seq_num].rssi < packet.rssi) packets.data[packet.seq_num].rssi = packet.rssi
      if (packets.data[packet.seq_num].battery > packet.battery) packets.data[packet.seq_num].battery = packet.battery
      packets.data[packet.seq_num].hotspots.push(packet.hotspot_id.replace("rapping", "dandy"))
    } else {
      packets.data[packet.seq_num] = {
        id: packet.id,
        key: packet.lat + packet.lon,
        coordinates: { lat: packet.lat, lon: packet.lon },
        speed: packet.speed,
        rssi: packet.rssi,
        battery: packet.battery,
        elevation: packet.elevation,
        seq_num: packet.seq_num,
        reported: packet.created_at
      }
      packets.data[packet.seq_num].hotspots = [packet.hotspot_id.replace("rapping", "dandy")]
      packets.seq.push(packet.seq_num)
    }
    return packets
  }

  render() {
    const { devices, mapCenter, selectedDevice, packets, lastPacket, hotspots, chartType, showHotspots, highlightedHotspot } = this.state

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
            showHotspots && hotspots.data.map((h, i) => {
              if (h.lng) {
                return (
                  <Marker
                    key={h.address + i}
                    style={styles.gatewayMarker}
                    anchor="center"
                    coordinates={[h.lng, h.lat]}
                  />
                )
              }
            })
          }

          {
            showHotspots && hotspots.data.map((h, i) => {
              if (h.lng) {
                return (
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
                )
              }
            })
          }

          {
            highlightedHotspot && showHotspots && (
              <Layer
                key="highlight-line"
                type="line"
                layout={{ "line-cap": "round", "line-join": "round" }}
                paint={{ "line-color": "white", "line-width": 2 }}
              >
                <Feature
                  coordinates={[
                    [highlightedHotspot.lng, highlightedHotspot.lat],
                    hotspots.center
                  ]}
                />
              </Layer>
            )
          }

          {
            showHotspots && highlightedHotspot && (
              <Marker
                key="highlight-hs"
                style={{...styles.gatewayMarker, border: "3px solid white" }}
                anchor="center"
                coordinates={[highlightedHotspot.lng, highlightedHotspot.lat]}
              />
            )
          }
        </Map>

        <NavBar
          devices={devices}
          names={devices.map(d => {
            const hotspot = hotspotsData[d.hotspot]
            if (hotspot) return hotspot.short_city + ", " + hotspot.short_state
            return "Unknown"
          })}
          selectDevice={this.selectDevice}
          selectedDevice={selectedDevice}
        />

        {
          lastPacket && (
            <Inspector
              lastPacket={lastPacket}
              selectedDevice={selectedDevice}
              setChartType={this.setChartType}
              clearHotspots={this.clearHotspots}
              toggleHotspots={this.toggleHotspots}
              chartType={chartType}
              hotspots={hotspots}
              showHotspots={showHotspots}
              highlightHotspot={this.highlightHotspot}
            />
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
