import React, { Component } from "react";
import { Line } from "react-chartjs-2";
import upperCase from 'lodash/upperCase'

const styles = {
  timeline: {
    position: "absolute",
    bottom: "0px",
    background: "white",
    right: "0px",
    zIndex: 10,
    height: 150,
    overflow: "hidden",
    display: "flex",
    width: "100vw",
    fontFamily: '"Soleil", "Helvetica Neue", Helvetica, Arial, sans-serif',
  },
  valueBox: {
    width: 200,
    background: "#1B8DFF",
    color: "white",
    display: "flex",
    flexDirection: 'column',
    alignItems: "center",
    justifyContent: "center",
  },
  value: {
    fontSize: 42,
  },
  chart: {
    position: "relative",
    width: "100%",
  },
  close: {
    position: "absolute",
    top: 10,
    right: 15,
    fontSize: "24px",
    fontWeight: 300,
    color: "#D5DCE2",
    cursor: "pointer",
    zIndex: 10,
  },
  title: {
    position: "absolute",
    top: 10,
    left: 15,
    fontSize: "14px",
    fontWeight: 300,
    color: "#D5DCE2",
    marginTop: 5,
  }
}

class Timeline extends Component {
  constructor(props) {
    super(props)

    this.state = {
      timelineValue: 0
    }

    this.onHover = this.onHover.bind(this)
  }

  onHover(e, a) {
    const { packets, type, setHotspots } = this.props
    if (a[0]) {
      if (type === 'sequence') {
        this.setState({ timelineValue: packets.seq[a[0]._index] })
      } else {
        this.setState({ timelineValue: packets.data[packets.seq[a[0]._index]][type] })
      }
      setHotspots(packets.geoJson.features[a[0]._index])
    } else {
      this.setState({ timelineValue: 0 })
    }
  }

  render() {
    const { type, setChartType, chartData } = this.props
    return (
      <div style={styles.timeline}>
        <TimelineValue
          value={this.state.timelineValue}
          type={type}
        />
        <div style={styles.chart}>
          <span style={styles.title}>
            {upperCase(type)}
          </span>
          <span style={styles.close} onClick={() => setChartType(null)}>
            &times;
          </span>
          <div
            style={{
              position: "absolute",
              bottom: 0,
              width: "100%"
            }}
          >
            <Line
              data={chartData}
              options={{
                onHover: this.onHover,
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                  padding: {
                    top: 45,
                    bottom: 20,
                    left: 20,
                    right: 20,
                  }
                },
                legend: {
                  display: false
                },
                hover: {
                  intersect: false
                },
                tooltips: {
                  enabled: false
                },
                scales: {
                  xAxes: [
                    {
                      type: "time",
                      gridLines: {
                        display: false
                      },
                      time: {
                        unit: 'minute'
                      },
                      ticks: {
                        autoSkip: false,
                        maxRotation: 90,
                        minRotation: 90,
                      }
                    }
                  ],
                  yAxes: [
                    {
                      display: false,
                      gridLines: {
                        display: false
                      }
                    }
                  ]
                }
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

const TimelineValue = props => {
  const { value, type } = props;

  if (type === "sequence") {
    return (
      <div style={styles.valueBox}>
        <p style={styles.value}>
          {value}
        </p>
        <p>seq #</p>
      </div>
    );
  }

  if (type === "speed") {
    return (
      <div style={styles.valueBox}>
        <p style={styles.value}>
          {value}
        </p>
        <p>mph</p>
      </div>
    );
  }

  if (type === "elevation") {
    return (
      <div style={styles.valueBox}>
        <p style={styles.value}>
          {value}
        </p>
        <p>meters</p>
      </div>
    );
  }

  if (type === "rssi") {
    return (
      <div style={styles.valueBox}>
        <p style={styles.value}>
          {value}
        </p>
        <p>dBm</p>
      </div>
    );
  }

  if (type === "battery") {
    return (
      <div style={styles.valueBox}>
        <p style={styles.value}>
          {value.toFixed(2)}
        </p>
        <p>volts</p>
      </div>
    );
  }

  if (type === "snr") {
    return (
      <div style={styles.valueBox}>
        <p style={styles.value}>
          {value}
        </p>
        <p>SNR</p>
      </div>
    );
  }
  return null;
}

export default Timeline
