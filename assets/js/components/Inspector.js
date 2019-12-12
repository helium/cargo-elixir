import React, { Component } from 'react'
import startCase from 'lodash/startCase'
import Media from 'react-media';

const styles = {
  container: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#fff',
    width: 350,
    zIndex: 10,
    overflow: 'hidden',
  },
  top: {
    padding: 10,
    paddingBottom:12,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    padding: 10,
    paddingBottom: 0,
  },
  pod: {
    width: 'calc(50% - 5px)',
    padding: 10,
    cursor: 'pointer',
    borderRadius: 4,
    minWidth: 80,
        paddingBottom:14,
            backgroundColor: '#EAF3FC',
            boxSizing: 'border-box',
            marginBottom: 10,


  },
  header: {
    fontSize: 10,
    margin: 0,
    marginBottom: 4,
    fontWeight: 300,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  value: {
    fontSize: 22,
    color: '#38A2FF',
    margin: 0,
    fontWeight: 300,
    lineHeight: 0.7,
    letterSpacing: '-0.5px',
  },
  bar: {
    backgroundColor: '#1F8FFF',
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
    fontSize: 13,
    fontWeight: 500,
    color: '#ffffff',
    cursor: 'pointer',
    backgroundColor: '#A984FF',
    borderRadius: 4,
    margin: 0,
    marginBottom: 6,
    padding: '6px 10px',
    boxSizing: 'border-box',


  },
  pill: {
    display: 'inline-block',
    fontSize: 12,
    backgroundColor: '#1B8DFF',
    fontWeight: '500',
    color: '#ffffff',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 6,
    paddingBottom: 6,
    borderRadius: 4,
    marginTop: 2,
    width: '50%',
    cursor: 'pointer',
    margin: '10px 5px 10px 10px',
    textAlign: 'center',
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
    const { hotspots, highlightHotspot } = this.props
    if (hotspots.data.length > 0) return (
      <div style={{ maxHeight: 150, overflow: 'scroll', marginTop: 8, padding: 10 }}>
        <p style={styles.header}>{hotspots.data.length} Hotspots Witnessed</p>
        {
          hotspots.data.map(h => (
            <p key={h.address} style={styles.hotspotText} className="hotspotentry" onClick={() => highlightHotspot(h)}>{h.name}</p>
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
                        <div style={{...styles.pod, backgroundColor: chartType === 'sequence' && '#CBDEF2' }} className="podHoverblue" onClick={() => setChartType("sequence")}>
                          <p style={styles.header}>Sequence No.</p>
                          <p style={styles.value}>{lastPacket.seq_id.split("-")[0]}</p>
                        </div>
                        <div style={{ ...styles.pod, backgroundColor: chartType === 'speed' && '#CBDEF2' }} className="podHoverblue" onClick={() => setChartType("speed")}>
                          <p style={styles.header}>Avg Speed:</p>
                          <p style={styles.value}>{lastPacket.speed}mph</p>
                        </div>

                        <div style={{...styles.pod, backgroundColor: chartType === 'elevation' && '#CBDEF2'}} className="podHoverblue" onClick={() => setChartType("elevation")}>
                          <p style={styles.header}>Elevation</p>
                          <p style={styles.value}>{lastPacket.elevation}m</p>
                        </div>
                        <div style={{ ...styles.pod, borderLeft: '1px solid #A5CFFA', backgroundColor: chartType === 'battery' && '#CBDEF2' }} className="podHoverblue" onClick={() => setChartType("battery")}>
                          <p style={styles.header}>Voltage</p>
                          <p style={styles.value}>{lastPacket.battery.toFixed(0)}</p>
                        </div>

                        <div style={{ ...styles.pod, backgroundColor: chartType === 'rssi' && '#CBDEF2'}} className="podHoverblue" onClick={() => setChartType("rssi")}>
                          <p style={styles.header}>RSSI</p>
                          <p style={styles.value}>{lastPacket.rssi}</p>
                        </div>
                        <div style={{ ...styles.pod,  backgroundColor: chartType === 'snr' && '#CBDEF2' }} className="podHoverblue" onClick={() => setChartType("snr")}>
                          <p style={styles.header}>SNR</p>
                          <p style={styles.value}>n/a</p>
                        </div>
                      </div>
                      <div style={{ padding: 10 }}>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                          <p style={styles.pill} onClick={toggleHotspots}>{showHotspots ? "Hide" : "Show"} Hotspot Paths</p>
                          <p style={styles.pill} onClick={clearHotspots}>Close Hotspot List</p>
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
                        <div style={{...styles.pod, backgroundColor: chartType === 'sequence' && '#CBDEF2' }} className="podHoverblue" onClick={() => setChartType("sequence")}>
                          <p style={styles.header}>Sequence No.</p>
                          <p style={styles.value}>{lastPacket.seq_id.split("-")[0]}</p>
                        </div>
                        <div style={{ ...styles.pod, backgroundColor: chartType === 'speed' && '#CBDEF2' }} className="podHoverblue" onClick={() => setChartType("speed")}>
                          <p style={styles.header}>Avg Speed</p>
                          <p style={styles.value}>{lastPacket.speed}mph</p>
                        </div>
                     
                        <div style={{...styles.pod, backgroundColor: chartType === 'elevation' && '#CBDEF2'}} className="podHoverblue" onClick={() => setChartType("elevation")}>
                          <p style={styles.header}>Elevation</p>
                          <p style={styles.value}>{lastPacket.elevation}m</p>
                        </div>
                        <div style={{ ...styles.pod,  backgroundColor: chartType === 'battery' && '#CBDEF2' }} className="podHoverblue" onClick={() => setChartType("battery")}>
                          <p style={styles.header}>Voltage</p>
                          <p style={styles.value}>{lastPacket.battery.toFixed(0)}</p>
                        </div>
                     
                        <div style={{ ...styles.pod, backgroundColor: chartType === 'rssi' && '#CBDEF2'}} className="podHoverblue" onClick={() => setChartType("rssi")}>
                          <p style={styles.header}>RSSI</p>
                          <p style={styles.value}>{lastPacket.rssi}</p>
                        </div>
                        <div style={{ ...styles.pod,  backgroundColor: chartType === 'snr' && '#CBDEF2' }} className="podHoverblue" onClick={() => setChartType("snr")}>
                          <p style={styles.header}>SNR</p>
                          <p style={styles.value}>{lastPacket.snr}</p>
                        </div>
                      </div>
                      <div>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                          <p style={styles.pill} onClick={toggleHotspots}>{showHotspots ? "Hide" : "Show"} Hotspot Paths</p>
                          <p style={styles.pill} onClick={clearHotspots}>Close Hotspot List</p>
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
