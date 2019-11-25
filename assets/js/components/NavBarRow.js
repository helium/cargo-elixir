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
  },
  title: {
    fontSize: 14
  },
  tag: {
    fontSize: 11,
  }
}

class NavBarRow extends Component {
  render() {
    const { device, selectDevice, selectedDevice } = this.props
    const selected = selectedDevice && selectedDevice.device_id === device.device_id

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
        <div>
          <p style={{ ...styles.tag, color: selected ? '#ffffff' : '#A9A9A9' }}>{timeAgo.format(new Date(device.created_at), {flavour: "small"})}</p>
          <p style={{ ...styles.tag, color: selected ? '#ffffff' : '#A9A9A9' }}>Location</p>
        </div>
      </div>
    )
  }
}

export default NavBarRow
