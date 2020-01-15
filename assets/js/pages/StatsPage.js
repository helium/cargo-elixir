import React from "react"

const tabs = [
  { title: "Last 24 hours", seconds: 86400 },
  { title: "Last 7 days", seconds: 86400 * 7 },
  { title: "Last 30 days", seconds: 86400 * 30 },
  { title: "All time", seconds: 1000000000 },
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
    fetch(`api/stats?seconds=${86400}`)
      .then(res => res.json())
      .then(stats => this.setState({ stats }))
  }

  changeTab(tabIndex) {
    this.setState({ tabIndex, stats: null })
    fetch(`api/stats?seconds=${tabs[tabIndex].seconds}`)
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
