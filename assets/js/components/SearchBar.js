import React, { Component } from 'react'

class SearchBar extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { devices, onSearchChange } = this.props

    return (
      <form style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} onSubmit={this.onSubmit}>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 8 }}>
          <input type="text" placeholder="Filter by device Id" onChange={onSearchChange} style={{ background: '#efefef', borderStyle: 'none', padding: '4px 10px', borderRadius: 4, marginLeft: 0, fontSize: 14, width: '100%', marginRight: 4 }}/>
        </div>
      </form>
    )
  }
}

export default SearchBar
