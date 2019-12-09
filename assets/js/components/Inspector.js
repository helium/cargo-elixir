import React, { Component } from 'react'
import startCase from 'lodash/startCase'
import Media from 'react-media';

const styles = {
  container: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#EAF3FC',
    width: 350,
    zIndex: 10,
    overflow: 'hidden',
  },
  top: {
    padding: 8,
    borderBottom: '1px solid #1B8DFF',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottom: '1px solid #1B8DFF',
  },
  pod: {
    width: '50%',
    padding: 8,
    cursor: 'pointer',
    minWidth: 80,
  },
  header: {
    fontSize: 14,
    margin: 0,
    marginBottom: 4,
  },
  value: {
    fontSize: 22,
    color: '#8396a9',
    margin: 0,
  },
  bar: {
    backgroundColor: '#1B8DFF',
    height: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
  },
  arrowUp: {
    width: 0,
    height: 0,
    borderLeft: '5px solid transparent',
    borderRight: '5px solid transparent',
    borderBottom: '5px solid white',
    marginRight: 16,
  },
  arrowDown: {
    width: 0,
    height: 0,
    borderLeft: '5px solid transparent',
    borderRight: '5px solid transparent',
    borderTop: '5px solid white',
    marginRight: 16,
  },
  smallContainer: {
    position: 'absolute',
    top: 132,
    left: 0,
    backgroundColor: '#EAF3FC',
    width: '100%',
    zIndex: 10,
    overflow: 'hidden'
  },
  hotspotText: {
    fontSize: 14,
    color: '#8396a9',
  },
  pill: {
    display: 'inline-block',
    fontSize: 12,
    backgroundColor: '#1B8DFF',
    fontWeight: 'bold',
    color: '#ffffff',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 6,
    paddingBottom: 3,
    borderRadius: 15,
    marginTop: 2,
    cursor: 'pointer'
  }
}

class Inspector extends Component {
  constructor(props) {
    super(props)

    this.state = {
      show: true
    }
    this.toggle = this.toggle.bind(this)
  }

  toggle() {
    this.setState({ show: !this.state.show})
  }

  renderHotspotsList() {
    const { hotspots } = this.props
    if (hotspots.data.length > 0) return (
      <div style={{ maxHeight: 150, overflow: 'scroll', marginTop: 8 }}>
        <p style={styles.header}>Hotspots Witnessed: {hotspots.data.length}</p>
        {
          hotspots.data.map(h => (
            <p key={h.address} style={styles.hotspotText}>{h.name}</p>
          ))
        }
      </div>
    )
  }

  render() {
    const { lastPacket, selectedDevice, setChartType, chartType, hotspots, clearHotspots, toggleHotspots, showHotspots } = this.props
    const { show } = this.state

    return (
      <Media queries={{
        small: "(max-width: 500px)",
        large: "(min-width: 501px)"
      }}>
        {matches => (
          <React.Fragment>
            {matches.small && (
              <div style={styles.smallContainer}>
                {
                  show && (
                    <React.Fragment>
                      <div style={{...styles.row, overflow: 'scroll'}}>
                        <div style={{...styles.pod, backgroundColor: chartType === 'sequence' && '#CBDEF2' }} className="podHover" onClick={() => setChartType("sequence")}>
                          <p style={styles.header}>Sequence #:</p>
                          <p style={styles.value}>{lastPacket.seq_num}</p>
                        </div>
                        <div style={{ ...styles.pod, backgroundColor: chartType === 'speed' && '#CBDEF2', borderLeft: '1px solid #1B8DFF' }} className="podHover" onClick={() => setChartType("speed")}>
                          <p style={styles.header}>Avg Speed:</p>
                          <p style={styles.value}>{lastPacket.speed}mph</p>
                        </div>

                        <div style={{...styles.pod, backgroundColor: chartType === 'elevation' && '#CBDEF2', borderLeft: '1px solid #1B8DFF'}} className="podHover" onClick={() => setChartType("elevation")}>
                          <p style={styles.header}>Elevation:</p>
                          <p style={styles.value}>{lastPacket.elevation}m</p>
                        </div>
                        <div style={{ ...styles.pod, borderLeft: '1px solid #1B8DFF', backgroundColor: chartType === 'battery' && '#CBDEF2', borderLeft: '1px solid #1B8DFF' }} className="podHover" onClick={() => setChartType("battery")}>
                          <p style={styles.header}>Voltage:</p>
                          <p style={styles.value}>{lastPacket.battery.toFixed(0)}</p>
                        </div>

                        <div style={{ ...styles.pod, backgroundColor: chartType === 'rssi' && '#CBDEF2', borderLeft: '1px solid #1B8DFF' }} className="podHover" onClick={() => setChartType("rssi")}>
                          <p style={styles.header}>RSSI:</p>
                          <p style={styles.value}>{lastPacket.rssi}</p>
                        </div>
                        <div style={{ ...styles.pod, borderLeft: '1px solid #1B8DFF', backgroundColor: chartType === 'snr' && '#CBDEF2', borderLeft: '1px solid #1B8DFF' }} className="podHover" onClick={() => setChartType("snr")}>
                          <p style={styles.header}>SNR:</p>
                          <p style={styles.value}>n/a</p>
                        </div>
                      </div>
                      <div style={{ padding: 8 }}>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                          <p style={styles.pill} onClick={toggleHotspots}>{showHotspots ? "Hide" : "Show"} Hotspot Paths</p>
                          <p style={styles.pill} onClick={clearHotspots}>Clear Hotspots List</p>
                        </div>
                        {this.renderHotspotsList()}
                      </div>
                    </React.Fragment>
                  )
                }
              </div>
            )}
            {matches.large && (
              <div style={styles.container}>
                <div style={styles.bar} onClick={this.toggle}>
                  <p style={{ color: 'white', fontSize: 14 }}>Last Packet Stats</p>
                  {
                    show ? <div style={styles.arrowUp}></div> : <div style={styles.arrowDown}></div>
                  }
                </div>
                {
                  show && (
                    <React.Fragment>
                      <div style={styles.top}>
                        <p style={styles.header}>Device ID:</p>
                        <p style={styles.value}>{selectedDevice.device_id}</p>
                        <p style={{...styles.header, marginTop: 8 }}>Hotspot:</p>
                        <p style={styles.value}>{startCase(lastPacket.hotspots[lastPacket.hotspots.length - 1])}</p>
                      </div>
                      <div style={styles.row}>
                        <div style={{...styles.pod, backgroundColor: chartType === 'sequence' && '#CBDEF2' }} className="podHover" onClick={() => setChartType("sequence")}>
                          <p style={styles.header}>Sequence #:</p>
                          <p style={styles.value}>{lastPacket.seq_num}</p>
                        </div>
                        <div style={{ ...styles.pod, backgroundColor: chartType === 'speed' && '#CBDEF2', borderLeft: '1px solid #1B8DFF' }} className="podHover" onClick={() => setChartType("speed")}>
                          <p style={styles.header}>Avg Speed:</p>
                          <p style={styles.value}>{lastPacket.speed}mph</p>
                        </div>
                      </div>
                      <div style={styles.row}>
                        <div style={{...styles.pod, backgroundColor: chartType === 'elevation' && '#CBDEF2'}} className="podHover" onClick={() => setChartType("elevation")}>
                          <p style={styles.header}>Elevation:</p>
                          <p style={styles.value}>{lastPacket.elevation}m</p>
                        </div>
                        <div style={{ ...styles.pod, borderLeft: '1px solid #1B8DFF', backgroundColor: chartType === 'battery' && '#CBDEF2' }} className="podHover" onClick={() => setChartType("battery")}>
                          <p style={styles.header}>Voltage:</p>
                          <p style={styles.value}>{lastPacket.battery.toFixed(0)}</p>
                        </div>
                      </div>
                      <div style={styles.row}>
                        <div style={{ ...styles.pod, backgroundColor: chartType === 'rssi' && '#CBDEF2'}} className="podHover" onClick={() => setChartType("rssi")}>
                          <p style={styles.header}>RSSI:</p>
                          <p style={styles.value}>{lastPacket.rssi}</p>
                        </div>
                        <div style={{ ...styles.pod, borderLeft: '1px solid #1B8DFF', backgroundColor: chartType === 'snr' && '#CBDEF2' }} className="podHover" onClick={() => setChartType("snr")}>
                          <p style={styles.header}>SNR:</p>
                          <p style={styles.value}>n/a</p>
                        </div>
                      </div>
                      <div style={{ padding: 8 }}>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                          <p style={styles.pill} onClick={toggleHotspots}>{showHotspots ? "Hide" : "Show"} Hotspot Paths</p>
                          <p style={styles.pill} onClick={clearHotspots}>Clear Hotspots List</p>
                        </div>
                        {this.renderHotspotsList()}
                      </div>
                    </React.Fragment>
                  )
                }
              </div>
            )}
          </React.Fragment>
        )}
      </Media>
    )
  }
}

export default Inspector
