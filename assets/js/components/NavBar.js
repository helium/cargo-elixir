import React, { Component } from 'react'
import Logo from "../../static/images/logocargo.svg";
import NavBarRow from './NavBarRow'
import Media from 'react-media';

const styles = {
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: '#ffffff',
    minWidth: 200,
    zIndex: 10,
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
  },
  smallContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: '#ffffff',
    width: '100%',
    zIndex: 10,
    height: 132,
    overflow: 'hidden',
  },
}

class NavBar extends Component {
  render() {
    const { devices, names, selectDevice, selectedDevice } = this.props

    return (
      <Media queries={{
        small: "(max-width: 500px)",
        large: "(min-width: 501px)"
      }}>
        {matches => (
          <React.Fragment>
            {matches.small && (
              <div style={styles.smallContainer}>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', borderBottom: '1px solid #D3D3D3', }}>
                  <Logo style={{...styles.paddingBox, paddingTop: 16, paddingBottom: 16 }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'row', overflow: 'auto' }}>
                  <div style={{ borderBottom: '1px solid #D3D3D3', alignItems: 'center', display: 'flex' }}>
                    <p style={{ marginRight: 48, whiteSpace: 'nowrap' }}>Devices: {devices.length}</p>
                  </div>
                  {devices.map((d, i) =>
                    <div style={{ borderLeft: '1px solid #D3D3D3' }}>
                      <NavBarRow key={d.device_id} device={d} name={names[i]} selectDevice={selectDevice} selectedDevice={selectedDevice} />
                    </div>
                  )}
                </div>
              </div>
            )}
            {matches.large && (
              <div style={styles.container}>
                <div>
                  <Logo style={{...styles.paddingBox, paddingTop: 16, paddingBottom: 16 }} />
                  <p style={{...styles.paddingBox, ...styles.title}}>Devices: {devices.length}</p>
                </div>

                <div style={{ overflow: 'scroll', maxHeight: 310 }}>
                  {devices.map((d, i) =>
                    <NavBarRow key={d.device_id} device={d} name={names[i]} selectDevice={selectDevice} selectedDevice={selectedDevice} />
                  )}
                </div>
              </div>
            )}
          </React.Fragment>
        )}
      </Media>
    )
  }
}

export default NavBar
