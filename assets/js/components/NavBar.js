import React, { Component } from 'react'
import Logo from "../../static/images/logocargo.svg";
import NavBarRow from './NavBarRow'

const styles = {
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: '#ffffff',
    minWidth: 200
  },
  title: {
    marginBottom: 0,
    paddingBottom: 16,
    marginLeft: 0,
    marginRight: 0,
    borderBottom: '1px solid #D3D3D3',
  },
  paddingBox: {
    paddingLeft: 16,
    paddingRight: 16,
  }
}

class NavBar extends Component {
  render() {
    const { devices, selectDevice, selectedDevice } = this.props

    return (
      <div style={styles.container}>
        <div>
          <Logo style={{...styles.paddingBox, paddingTop: 8 }} />
          <p style={{...styles.paddingBox, ...styles.title}}>Devices</p>
        </div>

        <div>
          {devices.map(d =>
            <NavBarRow key={d.device_id} device={d} selectDevice={selectDevice} selectedDevice={selectedDevice} />
          )}
        </div>
      </div>
    )
  }
}

export default NavBar
