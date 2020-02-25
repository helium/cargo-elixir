import React, { Component } from 'react'

const SearchBar = ({ onSearchChange }) => (
  <form style={styles.form} onSubmit={e => e.preventDefault()}>
    <div style={styles.container}>
      <input type="text" placeholder="Filter by device Id" onChange={onSearchChange} style={styles.input} />
    </div>
  </form>
)

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 8,
  },
  input: {
    background: '#efefef',
    borderStyle: 'none',
    padding: '4px 10px',
    borderRadius: 4,
    marginLeft: 0,
    fontSize: 14,
    width: '100%',
    marginRight: 4,
  },
}

export default SearchBar
