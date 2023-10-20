import geoJSON from "geojson";
import findIndex from "lodash/findIndex";
import React from "react";
import Inspector from "../components/Inspector";
import NavBar from "../components/NavBar";
import SignUp from "../components/SignUp";
import Timeline from "../components/Timeline";
import { get } from "../data/Rest";
import { packetsToChartData } from "../data/chart";
import socket from "../socket";

import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Protocol } from "pmtiles";
import Map, { Layer, Marker, Source } from "react-map-gl";
import { mapLayersDark } from "./mapStyle";

const CURRENT_OUI = 1;

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
    zIndex: 2,
  },
  packetCircle: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: "#4790E5",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  transmittingMarker: {
    width: 14,
    height: 14,
    borderRadius: "50%",
    backgroundColor: "black",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "4px solid #fff",
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
    boxShadow: "0px 2px 4px 0px rgba(0,0,0,0.5)",
    cursor: "pointer",
  },
  mapStyle: {
    version: 8,
    sources: {
      protomaps: {
        type: "vector",
        tiles: [`https://pmtiles.heliumfoundation.wtf/world/{z}/{x}/{y}.mvt`],
      },
    },
    glyphs: "https://cdn.protomaps.com/fonts/pbf/{fontstack}/{range}.pbf",
    layers: mapLayersDark,
  },
};

const VECTOR_SOURCE_OPTIONS = {
  type: "vector",
  url: "https://mappers-tileserver.helium.wtf/public.h3_res9.json",
};

class MapScreen extends React.Component {
  constructor(props) {
    super(props);

    this.mapRef = React.createRef();
    this.state = {
      showSignUp: window.localStorage
        ? !window.localStorage.getItem("seenSignUp")
        : true,
      devices: [],
      allDevices: [],
      selectedDevice: null,
      packets: {},
      lastPacket: null,
      mapCenter: [-122.41919, 37.77115],
      hotspots: { data: [] },
      hexdata: null,
      showMappers: false,
      chartType: null,
      /* 
      setting to false as hotspots fetch is currently down
      when re-enabled we'll need to update the relevant Layers + Features
      */
      showHotspots: false,
      highlightHotspoted: null,
      transmittingDevices: {},
      loading: false,
      hotspotsData: {},
    };

    this.selectDevice = this.selectDevice.bind(this);
    this.findDevice = this.findDevice.bind(this);
    this.setChartType = this.setChartType.bind(this);
    this.setHotspots = this.setHotspots.bind(this);
    this.toggleHotspots = this.toggleHotspots.bind(this);
    this.highlightHotspot = this.highlightHotspot.bind(this);
    this.parsePackets = this.parsePackets.bind(this);
    this.hideSignUp = this.hideSignUp.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.toggleMappers = this.toggleMappers.bind(this);
  }

  componentWillUnmount() {
    maplibregl.removeProtocol("pmtiles");
  }

  componentDidMount() {
    let protocol = new Protocol();
    maplibregl.addProtocol("pmtiles", protocol.tile);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        const { mapCenter } = this.state;
        if (mapCenter[0] == -122.41919 && mapCenter[1] == 37.77115) {
          console.log("Using browser location");
          this.setState({ mapCenter: [coords.longitude, coords.latitude] });
        }
      });
    }

    this.loadHotspots();

    this.loadDevices();

    let channel = socket.channel("payload:new", {});
    channel
      .join()
      .receive("ok", (resp) => {
        console.log("Joined successfully", resp);
      })
      .receive("error", (resp) => {
        console.log("Unable to join", resp);
      });

    channel.on("new_payload", (d) => {
      if (d.oui !== CURRENT_OUI) return;

      if (
        this.state.selectedDevice &&
        this.state.selectedDevice.device_id === d.device_id
      ) {
        const packets = this.parsePackets(this.state.packets, d);
        const packetsArray = packets.seq.map((s) => packets.data[s]);
        packets.geoJson = geoJSON.parse(packetsArray, {
          Point: ["coordinates.lat", "coordinates.lon"],
        });
        const lastPacket = packetsArray[packetsArray.length - 1];

        this.setState({
          packets,
          lastPacket,
        });
      }

      const allDevices = this.state.allDevices;
      const index = findIndex(this.state.allDevices, {
        device_id: d.device_id,
      });
      if (allDevices[index]) {
        allDevices[index].created_at = d.created_at;
        allDevices.sort(function(a, b) {
          return new Date(b.created_at) - new Date(a.created_at);
        });
        this.setState({ allDevices });

        const { transmittingDevices } = this.state;
        //transmittingDevices[d.device_id] = [Number(d.lon), Number(d.lat)]
        transmittingDevices[d.device_id] = d;
        this.setState({ transmittingDevices });
      } else {
        this.loadDevices();
      }
    });
  }

  // endpoint is down so not triggering fetch
  async loadHotspots() {
    // const { hotspotsData } = this.state;
    // this.client = new Client();
    // const list = await this.client.hotspots.list();
    // const spots = await list.take(1000000);
    // spots.forEach((d) => {
    //   hotspotsData[d.name.toLowerCase()] = d;
    // });
    // this.setState({ hotspotsData });
  }

  loadDevices() {
    get("oui/" + CURRENT_OUI)
      .then((res) => res.json())
      .then((devices) => {
        devices.sort(function(a, b) {
          return new Date(b.created_at) - new Date(a.created_at);
        });
        const allDevices = devices;
        this.setState({ devices, allDevices });
      });
  }

  onSearchChange(e) {
    const { devices, allDevices } = this.state;
    var results = allDevices.filter((obj) => {
      return obj.name.toLowerCase().includes(e.target.value.toLowerCase());
    });
    this.setState({ devices: results });
  }

  hideSignUp() {
    this.setState({ showSignUp: false });
  }

  toggleMappers() {
    this.setState({ showMappers: !this.state.showMappers });
  }

  selectDevice(d) {
    if (this.state.loading) return;

    this.setState({ loading: true }, () => {
      get("devices/" + d.device_id + "?last_at=" + d.created_at)
        .then((res) => res.json())
        .then((data) => {
          console.log("Received " + data.length + " Packets");
          let packets = {
            data: {},
            geoJson: null,
            seq: [],
          };

          data.forEach((d) => {
            packets = this.parsePackets(packets, d);
          });
          const packetsArray = packets.seq.map((s) => packets.data[s]);
          packets.geoJson = geoJSON.parse(packetsArray, {
            Point: ["coordinates.lat", "coordinates.lon"],
          });
          const lastPacket = packetsArray[packetsArray.length - 1];

          this.setState({
            selectedDevice: d,
            packets,
            lastPacket,
            hotspots: { data: [] },
            loading: false,
          });
          const map = this.mapRef.current.getMap();
          map.flyTo({
            center: [lastPacket.coordinates.lon, lastPacket.coordinates.lat],
          });
        })
        .catch((err) => {
          this.setState({ loading: false });
        });
    });
  }

  findDevice(deviceId) {
    get("oui/" + CURRENT_OUI + "?device_id=" + deviceId)
      .then((res) => res.json())
      .then((device) => {
        if (device.length == 0) {
          alert("Device " + deviceId + " does not exist");
          return;
        }
        this.selectDevice(device[0]);
      })
      .catch((err) => {
        alert("Server error: Please try again");
      });
  }

  setHotspots({ properties }) {
    const { hotspotsData } = this.state;
    this.setState({ hotspots: { data: [] } }, () => {
      const hotspots = {
        data: [],
        center: geoToMarkerCoords(properties.coordinates),
      };
      properties.hotspots.forEach((h) => {
        const hotspotName = h
          .trim()
          .split(" ")
          .join("-");
        if (hotspotsData[hotspotName])
          hotspots.data.push(hotspotsData[hotspotName]);
        else console.log("Found undefined hotspot name not shown on map", h);
      });
      this.setState({ hotspots });
    });
  }

  toggleHotspots() {
    this.setState({ showHotspots: !this.state.showHotspots });
  }

  highlightHotspot(h) {
    this.setState({ highlightedHotspot: h }, () => {
      setTimeout(() => {
        this.setState({ highlightedHotspot: null });
      }, 1000);
    });
  }

  setChartType(chartType) {
    this.setState({ chartType });
  }

  parsePackets(packets, packet) {
    packet.battery = Number(packet.battery);
    packet.elevation = Number(packet.elevation);
    packet.lat = Number(packet.lat);
    packet.lon = Number(packet.lon);
    packet.rssi = Number(packet.rssi);
    packet.speed = Number(packet.speed);
    packet.snr = Number(packet.snr);
    if (packet.lat == 0 || packet.lon == 0) return packets; //filter out africa packets
    if (packet.lat > 90 || packet.lat < -90) {
      console.log("Packet dropped, latitude value out of range");
      return packets;
    }
    if (packet.lat > 180 || packet.lat < -180) {
      console.log("Packet dropped, longitude value out of range");
      return packets;
    }
    const seq_id = packet.seq_num + "-" + packet.reported;

    if (packets.data[seq_id]) {
      if (packets.data[seq_id].rssi < packet.rssi)
        packets.data[seq_id].rssi = packet.rssi;
      if (packets.data[seq_id].battery > packet.battery)
        packets.data[seq_id].battery = packet.battery;
      packets.data[seq_id].hotspots.push(
        packet.hotspot_id.replace("rapping", "dandy")
      );
    } else {
      packets.data[seq_id] = {
        id: packet.id,
        key: packet.lat + packet.lon,
        coordinates: { lat: packet.lat, lon: packet.lon },
        speed: packet.speed,
        rssi: packet.rssi,
        battery: packet.battery,
        elevation: packet.elevation,
        seq_num: packet.seq_num,
        reported: packet.created_at,
        snr: packet.snr,
        seq_id,
      };
      packets.data[seq_id].hotspots = [
        packet.hotspot_id.replace("rapping", "dandy"),
      ];
      packets.seq.push(seq_id);
    }
    return packets;
  }

  render() {
    const {
      devices,
      mapCenter,
      selectedDevice,
      packets,
      lastPacket,
      hotspots,
      hexdata,
      showMappers,
      hotspotsData,
      chartType,
      showHotspots,
      highlightedHotspot,
      transmittingDevices,
      showSignUp,
    } = this.state;

    return (
      <div style={{ flex: 1 }}>
        <Map
          style={{
            height: "100vh",
            width: "100vw",
          }}
          initialViewState={{
            longitude: mapCenter[0],
            latitude: mapCenter[1],
            zoom: 11,
          }}
          minZoom={2}
          maxZoom={14}
          mapStyle={styles.mapStyle}
          localFontFamily="NotoSans-Regular"
          mapLib={maplibregl}
          attributionControl={false}
          ref={this.mapRef}
        >
          <Source id="source_id" {...VECTOR_SOURCE_OPTIONS} />

          {showMappers && (
            <Layer
              source-layer="public.h3_res9"
              source="source_id"
              id="public.h3_res9"
              type="fill"
              paint={{
                "fill-color": [
                  "interpolate",
                  ["linear"],
                  ["get", "best_rssi"],
                  -120,
                  "rgba(38,251,202,0.1)",
                  -100,
                  "rgba(38,251,202,0.45)",
                  -80,
                  "rgba(38,251,202,0.8)",
                ],
                "fill-opacity": 0.9,
                "fill-outline-color": "rgba(38,251,202,0.45)",
              }}
            />
          )}

          {selectedDevice &&
            packets.geoJson.features.map((packet, i) => (
              <Marker
                key={packet.properties.id}
                anchor="center"
                longitude={packet.properties.coordinates.lon}
                latitude={packet.properties.coordinates.lat}
              >
                <div style={styles.packetCircle} />
              </Marker>
            ))}

          {Object.keys(transmittingDevices).length > 0 &&
            Object.keys(transmittingDevices).map((id) => {
              return (
                <Marker
                  longitude={Number(transmittingDevices[id].lon)}
                  latitude={Number(transmittingDevices[id].lat)}
                  key={id}
                  anchor="center"
                  onClick={() => this.selectDevice(transmittingDevices[id])}
                >
                  <div style={styles.transmittingMarker} />
                </Marker>
              );
            })}

          {lastPacket && (
            <Marker
              anchor="center"
              longitude={lastPacket.coordinates.lon}
              latitude={lastPacket.coordinates.lat}
            >
              <div style={styles.selectedMarker} />
            </Marker>
          )}

          {/* {showHotspots &&
            hotspots.data.map((h, i) => {
              if (
                h.lng &&
                calculateDistance(
                  h.lat,
                  hotspots.center[1],
                  h.lng,
                  hotspots.center[0]
                ) < 0.4
              ) {
                //filter out africa packets
                return (
                  <Marker
                    key={h.address + i}
                    anchor="center"
                    longitude={h.lng}
                    latitude={lh.lat}
                    onClick={() => this.highlightHotspot(h)}
                  >
                    <div style={styles.gatewayMarker} />
                  </Marker>
                );
              }
            })}

          {showHotspots &&
            hotspots.data.map((h, i) => {
              if (
                h.lng &&
                calculateDistance(
                  h.lat,
                  hotspots.center[1],
                  h.lng,
                  hotspots.center[0]
                ) < 0.4
              ) {
                //filter out africa packets
                return (
                  <Layer
                    key={"line-" + h.address + i}
                    type="line"
                    layout={{ "line-cap": "round", "line-join": "round" }}
                    paint={{ "line-color": "#A984FF", "line-width": 2 }}
                  >
                    <Feature coordinates={[[h.lng, h.lat], hotspots.center]} />
                  </Layer>
                );
              }
            })} */}

          {/* {highlightedHotspot && showHotspots && (
            <Layer
              key="highlight-line"
              type="line"
              layout={{ "line-cap": "round", "line-join": "round" }}
              paint={{ "line-color": "white", "line-width": 2 }}
            >
              <Feature
                coordinates={[
                  [highlightedHotspot.lng, highlightedHotspot.lat],
                  hotspots.center,
                ]}
              />
            </Layer>
          )}

          {showHotspots && highlightedHotspot && (
            <Marker
              key="highlight-hs"
              style={{ ...styles.gatewayMarker, border: "3px solid white" }}
              anchor="center"
              coordinates={[highlightedHotspot.lng, highlightedHotspot.lat]}
            />
          )} */}
        </Map>

        <NavBar
          devices={devices}
          loading={this.state.loading}
          names={devices.map((d) => {
            const hotspotName = d.hotspot.replace(/-/g, "-");
            const hotspot = hotspotsData[hotspotName];
            if (hotspot)
              return (
                hotspot.geocode.longCity + ", " + hotspot.geocode.shortState
              );
            return "Unknown";
          })}
          selectDevice={this.selectDevice}
          findDevice={this.findDevice}
          selectedDevice={selectedDevice}
          onSearchChange={this.onSearchChange}
          toggleMappers={this.toggleMappers}
        />

        {lastPacket && (
          <Inspector
            lastPacket={lastPacket}
            selectedDevice={selectedDevice}
            setChartType={this.setChartType}
            toggleHotspots={this.toggleHotspots}
            chartType={chartType}
            hotspots={hotspots}
            showHotspots={showHotspots}
            highlightHotspot={this.highlightHotspot}
            highlightedHotspot={highlightedHotspot}
          />
        )}

        {chartType && (
          <Timeline
            type={chartType}
            packets={packets}
            setChartType={this.setChartType}
            setHotspots={this.setHotspots}
            chartData={packetsToChartData(
              packets.seq.map((s) => packets.data[s]),
              chartType
            )}
          />
        )}

        {showSignUp && <SignUp hideSignUp={this.hideSignUp} />}
      </div>
    );
  }
}

const geoToMarkerCoords = (geo) => [geo.lon, geo.lat];

const calculateDistance = (lat1, lat2, lng1, lng2) =>
  Math.sqrt(Math.pow(lat1 - lat2, 2) + Math.pow(lng1 - lng2, 2));

export default MapScreen;
