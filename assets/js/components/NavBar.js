import React, { Component } from 'react'
// import Menu from './Menu'
// import Circle from './Circle'
// import TimeAgo from 'javascript-time-ago'
import Logo from "../../static/images/logocargo.svg";

const styles = {
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    padding: 20,
    backgroundColor: '#ffffff',
    height: '100vh'
  }
}

class NavBar extends Component {
  render() {
    const { devices } = this.props

    return (
      <div style={styles.container}>
        <Logo />
        <h1>Devices</h1>

        <div>
          {devices.map(d =>
            <p key={d.device_id}>{d.device_id}</p>
          )}
        </div>
      </div>
    )
  }
}

export default NavBar
