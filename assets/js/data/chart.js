export const packetsToChartData = (packets, type) => {
  return {
    datasets: [{
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(71, 144, 229, 1)',
      borderColor: 'rgba(71, 144, 229, 1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(71, 144, 229, 1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 6,
      pointHoverBackgroundColor: 'rgba(71, 144, 229, 1)',
      pointHoverBorderColor: 'rgba(245,245,245,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 2,
      pointHitRadius: 10,
      data: packetsToData(packets, type)
    }]
  }
}

const packetsToData = (packets, type) => (
  packets.map(packet => {
    return {
      t: new Date(packet.reported),
      y: type === 'sequence' ? packet.seq_num : packet[type],
      id: packet.id
    }
  })
)
