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
    minWidth: 300,
     '&:hover': {
        backgroundColor: '#0D47A1 !important',
    }
  },
  title: {
    fontSize: 16,
    fontWeight: 500,
    color: '#1B8DFF',
    background: 'white',
    padding: '3px 10px 4px',
    borderRadius: 6,
    marginLeft: 0,
    maxWidth: 180,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  tag: {
    fontSize: 11,
    paddingTop: 5,
    paddingBottom: 3,
    lineHeight: 1
  },
  pillRed: {
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
  },
  pillGrey: {
    display: 'inline-block',
    fontSize: 10,
    backgroundColor: 'grey',
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

        className="podHover"
      >
        <p key={device.device_id} style={{ ...styles.title, color: selected ? '#1B8DFF' : '#ffffff', backgroundColor: selected ? '#ffffff' : '#1B8DFF' }}>{device.name}</p>
        <div style={{ textAlign: 'right' }}>
          {
            withinLast2Min ? (
              device.lat > 0 ? (
                <p style={styles.pillRed}>{timeAgo.format(latest, {flavour: "small"})}</p>
              ) : (
                <p style={styles.pillGrey}>No GPS Fix</p>
              )
            ) : (
              <p align="right" style={{ ...styles.tag, color: selected ? '#ffffff' : '#A9A9A9' }}>{timeAgo.format(latest, {flavour: "small"})}</p>
            )
          }
          <p align="right" style={{ ...styles.tag, color: selected ? '#ffffff' : '#A9A9A9', marginTop: -8, fontWeight: 500 }}>{name}</p>
        </div>
      </div>
    )
  }
}

export default NavBarRow
