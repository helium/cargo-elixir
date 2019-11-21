import React, { Component } from 'react'

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #D3D3D3',
    paddingLeft: 16,
    paddingRight: 16,
  },
  title: {
    fontSize: 14
  },
  tag: {
    fontSize: 11,
    color: '#A9A9A9'
  }
}

class NavBarRow extends Component {
  render() {
    const { device } = this.props

    return (
      <div style={styles.container}>
        <p key={device.device_id} style={styles.title}>{device.device_id}</p>
        <div>
          <p style={styles.tag}>2h ago</p>
          <p style={styles.tag}>Location</p>
        </div>
      </div>
    )
  }
}

export default NavBarRow
