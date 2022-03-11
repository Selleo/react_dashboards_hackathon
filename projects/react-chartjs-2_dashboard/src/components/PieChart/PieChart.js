import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie, getElementAtEvent } from "react-chartjs-2";
import { useEffect, useRef, useState } from 'react'
import client from '../../axios'

ChartJS.register(ArcElement, Tooltip, Legend);

export const data = {
  labels: [],
  datasets: [
    {
      label: "",
      data: [],
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

  useEffect(() => {
    client.get('/salesByRegion').then((response) => {
      setApiData(response.data)
    })
  }, [])

  if (apiData === null) {
    return <div>Loading...</div>
  }

  return (
      <div>
        <Pie
            ref={chartRef}
            data={data}
            onClick={(event) => {
              const selectedElement = getElementAtEvent(chartRef.current, event);
              console.log(selectedElement)
            }} />
      </div>
  )
}

export default PieChart
