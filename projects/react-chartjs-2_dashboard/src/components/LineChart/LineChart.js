import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { includes, range } from 'lodash'

import client from "../../axios";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug", "Sep", "Oct", "Nov", "Dec"]
const monthLabels = ['-01-', '-02-', '-03-', '-04-', '-05-', '-06-', '-07-', '-08-', '-09-', '-10-', '-11-', '-12-']

const data = {
  labels: [],
  datasets: [
    {
      label: "Sales",
      data: [],
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    }
  ]
};

function LineChart() {
  const [apiData, setApiData] = useState(null)
  const [dataPerMonth, setDataPerMonth] = useState([])
  const [pageIndex, setPageIndex] = useState(0)
  const monthData = dataPerMonth[pageIndex]

  const [chartData, setChartData] = useState(null)

  useEffect(() => {
    client.get('/salesByTime').then((response) => {
      setApiData(response.data)
    })
  }, [])

  useEffect(() => {
    if (apiData) {
      const allData = monthLabels.map((label) => apiData.filter((data) => includes(data.date, label)))

      setDataPerMonth(allData)
    }
  }, [apiData])

  useEffect(() => {
    if (monthData) {
      setChartData({
        ...data,
        labels:  monthData.map((data) => data.date),
        datasets: [{ ...data.datasets[0], data: monthData.map((data) => data.valueInDollars) }]
      })
    }
  }, [pageIndex, monthData])

  return (
      <div style={{ padding: '24px' }}>
        <div>
          <select onChange={(event) => setPageIndex(Number(event.target.value))}>
            {range(12).map((option) => (
                <option key={option} value={option}>
                  {months[option]}
                </option>
            ))}
          </select>
        </div>
        <div>
          {chartData !== null && <Line data={chartData} />}
        </div>
      </div>
  );
}

export default LineChart
