import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie, getElementAtEvent } from "react-chartjs-2";
import { useEffect, useRef, useState } from 'react'
import { uniq } from 'lodash'

import client from '../../axios'

ChartJS.register(ArcElement, Tooltip, Legend);

export const data = {
  labels: [],
  datasets: [
    {
      label: "# of Votes",
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        "rgba(255, 99, 132, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(255, 206, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(153, 102, 255, 0.2)",
        "rgba(255, 159, 64, 0.2)"
      ],
      borderColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
        "rgba(255, 159, 64, 1)"
      ],
      borderWidth: 1
    }
  ]
};

function PieChart() {
  const chartRef = useRef(null);
  const [apiData, setApiData] = useState(null)
  const [chartData, setchartData] = useState(data)

  useEffect(() => {
    client.get('/salesByRegion').then((response) => {
      setApiData(response.data)
    })
  }, [])

  useEffect(() => {
    if (apiData !== null) {
      const countries = uniq(apiData.map((data) => data.country))
      const countryData = countries.map((country) => apiData.filter((data) => data.country === country).length)

      setchartData({ ...data, labels: countries, datasets: [{ ...data.datasets[0], data: countryData }] })
    }
  }, [apiData])

  if (apiData === null) {
    return <div>Loading...</div>
  }

  return (
      <div style={{ padding: '24px' }}>
        <Pie
            ref={chartRef}
            data={chartData}
            onClick={(event) => {
              const selectedElement = getElementAtEvent(chartRef.current, event);
              console.log(selectedElement)
            }} />
      </div>
  )
}

export default PieChart
