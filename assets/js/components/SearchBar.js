import React, { Component } from 'react'

class SearchBar extends Component {
  constructor(props) {
    super(props)

    this.state = {
      deviceId: ""
    }
    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onChange(e) {
    this.setState({ deviceId: e.target.value })
  }

  onSubmit(e) {
    e.preventDefault()
    this.props.findDevice(this.state.deviceId)
    this.setState({ deviceId: "" })
  }

  render() {
    return (
      <form style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} onSubmit={this.onSubmit}>
        <p style={{ fontSize: 12 }}>Find a device</p>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 8 }}>
          <input type="number" onChange={this.onChange} value={this.state.deviceId} style={{ width: 40, marginRight: 5 }}/>
          <input type="submit" value="Go" />
        </div>
      </form>
    )
  }
}

export default SearchBar
