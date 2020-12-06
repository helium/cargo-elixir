import React, { Component } from 'react'
import Logo from "../../static/images/logocargo.svg";
import LogoSm from "../../static/images/logocargo_30.svg";
import NavBarRow from './NavBarRow'
import SearchBar from './SearchBar'
import Media from 'react-media';
import Switch from "react-switch";

const styles = {
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: '#ffffff',
    width: 375,
    zIndex: 10,
    height: '100vh',
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
    width: 200,
    marginTop: 12,
    height: 30,
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
    height: 105,
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
    top: 9,
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
    top: 9,
    right: 12,
  },
}

class NavBar extends Component {
  constructor(props) {
    super(props)

    this.state = {
      show: true,
      toggleChecked: false
    }
    this.toggle = this.toggle.bind(this)    
    this.toggleMappers = this.toggleMappers.bind(this)
  }

  toggle() {
    this.setState({ show: !this.state.show})
  }

  toggleMappers(toggleChecked) {
    this.setState({ toggleChecked });
    this.props.toggleMappers()
  }

  render() {
    const { devices, names, selectDevice, selectedDevice, findDevice, loading, onSearchChange } = this.props
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
                  <LogoSm style={{...styles.paddingBox, paddingTop: 10, paddingBottom: 10 }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'row', overflow: 'auto' }}>
                  <div style={{ borderBottom: '1px solid #D3D3D3', alignItems: 'center', display: 'flex' }}>
                    <div style={{ width: 200, paddingLeft: 8, paddingRight: 8 }}>
                       Mappers 
                      <Switch height={18} widgth={20} onColor="#39a2fb" onChange={this.toggleMappers} checked={this.state.toggleChecked}/>
                      <SearchBar devices={devices} onSearchChange={onSearchChange}/>
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
                    Mappers 
                    <Switch height={18} widgth={20} onColor="#39a2fb" onChange={this.toggleMappers} checked={this.state.toggleChecked}/>
                    <p style={{...styles.paddingBox, ...styles.title}} >Devices</p>
                  </div>

                  <div style={{ padding: 16, borderBottom: '1px solid #D3D3D3' }}>
                    <SearchBar devices={devices} onSearchChange={onSearchChange}/>
                  </div>
                </div>

                <div style={{ overflow: 'scroll', maxHeight: 'calc(100vh - 190px)' }}>
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
