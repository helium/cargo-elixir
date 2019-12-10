import React, { Component } from 'react'
import Logo from "../../static/images/logocargo.svg";
import NavBarRow from './NavBarRow'
import SearchBar from './SearchBar'
import Media from 'react-media';

const styles = {
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: '#ffffff',
    width: 230,
    zIndex: 10,
  },
  title: {
    marginBottom: 0,
    paddingBottom: 16,
    marginLeft: 0,
    marginRight: 0,
    borderBottom: '1px solid #D3D3D3',
  },
  tip: {
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    borderBottom: '1px solid #D3D3D3',
    paddingBottom: 8,
    fontSize: 12,
    color: 'red'
  },
  tipSmallContainer: {
    fontSize: 12,
    color: 'red',
    width: 150,
    marginTop: 16,
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
  arrowUp: {
    width: 0,
    height: 0,
    borderLeft: '5px solid transparent',
    borderRight: '5px solid transparent',
    borderBottom: '5px solid #1B8DFF',
    marginRight: 16,
    position: "absolute",
    top: 4,
    right: 12,
  },
  arrowDown: {
    width: 0,
    height: 0,
    borderLeft: '5px solid transparent',
    borderRight: '5px solid transparent',
    borderTop: '5px solid #1B8DFF',
    marginRight: 16,
    position: "absolute",
    top: 4,
    right: 12,
  },
}

class NavBar extends Component {
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
    const { devices, names, selectDevice, selectedDevice, receivedNewDevice, findDevice } = this.props
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
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', borderBottom: '1px solid #D3D3D3', position: 'relative'}}>
                  <Logo style={{...styles.paddingBox, paddingTop: 16, paddingBottom: 16 }} />
                  {
                    receivedNewDevice && (
                      <p style={styles.tipSmallContainer}>New devices found, please reload the page to refresh device list</p>
                    )
                  }
                </div>

                <div style={{ display: 'flex', flexDirection: 'row', overflow: 'auto' }}>
                  <div style={{ borderBottom: '1px solid #D3D3D3', alignItems: 'center', display: 'flex' }}>
                    <div style={{ width: 200, paddingLeft: 8, paddingRight: 8 }}>
                      <SearchBar findDevice={findDevice}/>
                    </div>
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
                  <div style={{ position: 'relative' }}>
                    <p style={{...styles.paddingBox, ...styles.title, cursor: 'pointer'}} onClick={this.toggle}>Devices</p>
                    {
                      show ? <div style={styles.arrowUp}></div> : <div style={styles.arrowDown}></div>
                    }
                  </div>

                  <div style={{ padding: 16, borderBottom: '1px solid #D3D3D3' }}>
                    <SearchBar findDevice={findDevice}/>
                  </div>
                </div>

                {
                  receivedNewDevice && <p style={{...styles.paddingBox, ...styles.tip }}>New devices found, please reload the page to refresh device list</p>
                }

                <div style={{ overflow: 'scroll', maxHeight: 310 }}>
                  { show && devices.map((d, i) =>
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
