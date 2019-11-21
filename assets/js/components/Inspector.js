import React, { Component } from 'react'
import startCase from 'lodash/startCase'

const styles = {
  container: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#EAF3FC',
    minWidth: 240
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
    justifyContent: 'flex-end',
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

  render() {
    const { lastPacket, selectedDevice } = this.props
    const { show } = this.state

    return (
      <div style={styles.container}>
        <div style={styles.bar} onClick={this.toggle}>
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
                <p style={styles.value}>{startCase(lastPacket.hotspot_id)}</p>
              </div>
              <div style={styles.row}>
                <div style={styles.pod}>
                  <p style={styles.header}>Sequence #:</p>
                  <p style={styles.value}>{lastPacket.seq_num}</p>
                </div>
                <div style={{ ...styles.pod, borderLeft: '1px solid #1B8DFF' }}>
                  <p style={styles.header}>Avg Speed:</p>
                  <p style={styles.value}>{lastPacket.speed}mh</p>
                </div>
              </div>
              <div style={styles.row}>
                <div style={styles.pod}>
                  <p style={styles.header}>Elevation:</p>
                  <p style={styles.value}>{lastPacket.elevation}m</p>
                </div>
                <div style={{ ...styles.pod, borderLeft: '1px solid #1B8DFF' }}>
                  <p style={styles.header}>Voltage:</p>
                  <p style={styles.value}>{lastPacket.battery.toFixed(0)}</p>
                </div>
              </div>
              <div style={styles.row}>
                <div style={styles.pod}>
                  <p style={styles.header}>RSSI:</p>
                  <p style={styles.value}>{lastPacket.rssi}</p>
                </div>
                <div style={{ ...styles.pod, borderLeft: '1px solid #1B8DFF' }}>
                  <p style={styles.header}>SNR:</p>
                  <p style={styles.value}>n/a</p>
                </div>
              </div>
            </React.Fragment>
          )
        }
      </div>
    )
  }
}

export default Inspector
