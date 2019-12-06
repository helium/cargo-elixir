import React, { Component } from 'react'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
TimeAgo.addLocale(en)
const timeAgo = new TimeAgo('en-US');

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 16,
    cursor: 'pointer',
    minWidth: 180,
  },
  title: {
    fontSize: 14
  },
  tag: {
    fontSize: 11,
    paddingTop: 5,
    paddingBottom: 3,
  },
  pill: {
    display: 'inline-block',
    fontSize: 10,
    backgroundColor: 'red',
    fontWeight: 'bold',
    color: '#ffffff',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 4,
    paddingBottom: 4,
    borderRadius: 15
  }
}

class NavBarRow extends Component {
  render() {
    const { device, name, selectDevice, selectedDevice } = this.props
    const selected = selectedDevice && selectedDevice.device_id === device.device_id
    const latest = new Date(device.created_at)
    const withinLast2Min = ((Date.now() - latest) / 1000) < 120

    return (
      <div
        style={{
          ...styles.container,
          backgroundColor: selected && '#1B8DFF',
          borderBottom: selected ? '1px solid #1B8DFF' : '1px solid #D3D3D3',
        }}
        onClick={() => selectDevice(device)}
      >
        <p key={device.device_id} style={{ ...styles.title, color: selected ? '#ffffff' : '#000000' }}>{device.device_id}</p>
        <div style={{ textAlign: 'right' }}>
          {
            withinLast2Min ? (
              <p style={styles.pill}>{timeAgo.format(latest, {flavour: "small"})}</p>
            ) : (
              <p align="right" style={{ ...styles.tag, color: selected ? '#ffffff' : '#A9A9A9' }}>Lastest: {timeAgo.format(latest, {flavour: "small"})}</p>
            )
          }
          <p align="right" style={{ ...styles.tag, color: selected ? '#ffffff' : '#A9A9A9', marginTop: -8 }}>{name}</p>
        </div>
      </div>
    )
  }
}

export default NavBarRow
