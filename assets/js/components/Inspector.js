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
  smallContainer: {
    position: 'absolute',
    top: 105,
    left: 0,
    backgroundColor: '#fff',
    width: '100%',
    zIndex: 10,
    overflow: 'hidden'
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
   rowsm: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'no-wrap',
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
  podsm: {
    width: 100,
    padding: 10,
    cursor: 'pointer',
    borderRadius: 4,
    minWidth: 100,
    marginRight: 10,
        paddingBottom:14,
            backgroundColor: '#EAF3FC',
            boxSizing: 'border-box',
            marginBottom: 0,


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
}

class Inspector extends Component {
  constructor(props) {
    super(props)

    this.state = {
      show: true,
      showHS: true,
    }
    this.toggle = this.toggle.bind(this)
    this.toggleHS = this.toggleHS.bind(this)
  }

  toggle() {
    this.setState({ show: !this.state.show})
  }

  toggleHS() {
    this.setState({ showHS: !this.state.showHS })
  }

  renderHotspotsList() {
    const { hotspots, highlightHotspot, toggleHotspots, showHotspots, highlightedHotspot } = this.props
    const { showHS } = this.state
    if (hotspots.data.length > 0 && showHS) return (
      <div style={{ maxHeight: 150, overflow: 'scroll', padding: 10 }} className="nomargintop">
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
          <input type="checkbox" onChange={toggleHotspots} checked={showHotspots} />
          <p style={styles.header}>Show Hotspot Paths</p>
        </div>
        <p style={styles.header} className="paddingLeft">{hotspots.data.length} Hotspots Witnessed</p>
        <div className="hotspotwrapper">
        {
          hotspots.data.map(h => {
            if (highlightedHotspot && highlightedHotspot.address === h.address) {
              return (
                <p key={h.address} style={{ ...styles.hotspotText, backgroundColor: '#1F8FFF' }} className="hotspotentry" onClick={() => highlightHotspot(h)}>{h.name}</p>
              )
            }
            return (
              <p key={h.address} style={styles.hotspotText} className="hotspotentry" onClick={() => highlightHotspot(h)}>{h.name}</p>
            )
          })
        }
        </div>
      </div>
    )
  }

  renderHotspotsToggleBar() {
    const { showHS } = this.state
    const { hotspots } = this.props
    if (hotspots.data.length > 0) {
      return (
        <div style={{ ...styles.bar, backgroundColor: '#8D66E8' }} onClick={this.toggleHS}>
          <p style={{ color: 'white', fontSize: 14 }}>Hotspots List</p>
          {
            showHS ? <div style={styles.arrowUp}></div> : <div style={styles.arrowDown}></div>
          }
        </div>
      )
    } else {
      return <div />
    }
  }

  render() {
    const { lastPacket, selectedDevice, setChartType, chartType, hotspots, toggleHotspots } = this.props
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
              <div style={styles.bar} onClick={this.toggle}>
                  <p style={{ color: 'white', fontSize: 14 }}>Last Packet Stats</p>
                  {
                    show ? <div style={styles.arrowUp}></div> : <div style={styles.arrowDown}></div>
                  }
                </div>
                {
                  show && (
                    <React.Fragment>
                      <div style={{...styles.rowsm, overflowX: 'scroll'}}>
                        <div style={{...styles.podsm, backgroundColor: chartType === 'sequence' && '#CBDEF2' }} className="podHoverblue" onClick={() => setChartType("sequence")}>
                          <p style={styles.header}>Seq. No.</p>
                          <p style={styles.value}>{lastPacket.seq_id.split("-")[0]}</p>
                        </div>
                        <div style={{ ...styles.podsm, backgroundColor: chartType === 'speed' && '#CBDEF2' }} className="podHoverblue" onClick={() => setChartType("speed")}>
                          <p style={styles.header}>Avg Speed:</p>
                          <p style={styles.value}>{lastPacket.speed}mph</p>
                        </div>

                        <div style={{...styles.podsm, backgroundColor: chartType === 'elevation' && '#CBDEF2'}} className="podHoverblue" onClick={() => setChartType("elevation")}>
                          <p style={styles.header}>Elevation</p>
                          <p style={styles.value}>{lastPacket.elevation}m</p>
                        </div>
                        <div style={{ ...styles.podsm, backgroundColor: chartType === 'battery' && '#CBDEF2' }} className="podHoverblue" onClick={() => setChartType("battery")}>
                          <p style={styles.header}>Voltage</p>
                          <p style={styles.value}>{lastPacket.battery.toFixed(0)}</p>
                        </div>

                        <div style={{ ...styles.podsm, backgroundColor: chartType === 'rssi' && '#CBDEF2'}} className="podHoverblue" onClick={() => setChartType("rssi")}>
                          <p style={styles.header}>RSSI</p>
                          <p style={styles.value}>{lastPacket.rssi}</p>
                        </div>
                        <div style={{ ...styles.podsm,  backgroundColor: chartType === 'snr' && '#CBDEF2' }} className="podHoverblue" onClick={() => setChartType("snr")}>
                          <p style={styles.header}>SNR</p>
                          <p style={styles.value}>n/a</p>
                        </div>
                      </div>
                      {this.renderHotspotsToggleBar()}
                      {this.renderHotspotsList()}
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
                          <p style={styles.value}>{(Math.round(lastPacket.snr * 100) / 100).toFixed(2)}</p>
                        </div>
                      </div>
                      {this.renderHotspotsToggleBar()}
                      {this.renderHotspotsList()}
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
