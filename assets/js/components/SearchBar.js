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
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 8 }}>
          <input type="text" placeholder="Find a Device" onChange={this.onChange} value={this.state.deviceId} style={{ background: '#efefef', borderStyle: 'none', padding: '4px 10px', borderRadius: 4, marginLeft: 0, fontSize: 14, width: 'calc(100% - 40px)', marginRight: 4 }}/>
          <input type="submit" value="Go" style={{width: 40, borderRadius: 4, borderStyle: 'none',fontSize: 14, padding: 4, paddingLeft: 2, color: 'white', backgroundColor: '#38A2FF' }} />
        </div>
      </form>
    )
  }
}

export default SearchBar
