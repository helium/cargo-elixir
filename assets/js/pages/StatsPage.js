import React from "react"

const tabs = [
  { title: "Last 24 hours", time: '24h' },
  { title: "Last 7 days", time: '7d' },
  { title: "Last 30 days", time: '30d' },
  { title: "All time", time: 'all' },
]

class StatsPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tabIndex: 0,
      stats: null
    }
  }

  componentDidMount() {
    fetch(`api/stats?time=24h`)
      .then(res => res.json())
      .then(stats => this.setState({ stats }))
  }

  changeTab(tabIndex) {
    this.setState({ tabIndex, stats: null })
    fetch(`api/stats?time=${tabs[tabIndex].time}`)
      .then(res => res.json())
      .then(stats => this.setState({ stats }))
  }

  render() {
    const { tabIndex, stats } = this.state
    return (
      <div>
        <h1>Cargo Statistics</h1>
        <p>Currently transmitting devices: {!stats ? "loading" : stats.currentlyTransmitting}</p>
        <p>Devices that transmitted ({tabs[tabIndex].title}): {!stats ? "loading" : stats.devicesTransmitted}</p>
        <p>Hotspots that transmitted ({tabs[tabIndex].title}): {!stats ? "loading" : stats.hotspotsTransmitted}</p>
        <p>Packets transmitted ({tabs[tabIndex].title}): {!stats ? "loading" : stats.payloadsTransmitted}</p>
        {
          tabs.map((t, i) => (
            <button key={t.title} onClick={() => this.changeTab(i)}>{t.title}</button>
          ))
        }
      </div>
    )
  }
}

export default StatsPage
