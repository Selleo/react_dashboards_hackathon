import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie, getElementAtEvent } from "react-chartjs-2";
import { useEffect, useRef, useState } from 'react'
import { uniq, range } from 'lodash'

import client from '../../axios'

ChartJS.register(ArcElement, Tooltip, Legend);

const getRandomColor = () => {
  const r = Math.floor(Math.random() * 255);
  const g = Math.floor(Math.random() * 255);
  const b = Math.floor(Math.random() * 255);

  return "rgba(" + r + "," + g + "," + b + ", 0.5)";
};

const getChartColors = (totalNumber) => range(totalNumber).map(() => getRandomColor())

export const data = {
  labels: [],
  datasets: [
    {
      label: "# of Votes",
      data: [],
      backgroundColor: [],
      borderWidth: 1
    }
  ]
};

function PieChart() {
  const chartRef = useRef(null);
  const [apiData, setApiData] = useState(null)
  const [chartData, setChartData] = useState(data)
  const [regionChartData, setRegionChartData] = useState(data)

  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    client.get('/salesByRegion').then((response) => {
      setApiData(response.data)
    })
  }, [])

  useEffect(() => {
    if (apiData !== null) {
      const countries = uniq(apiData.map((data) => data.country))
      const countryData = countries.map((country) => apiData.filter((data) => data.country === country).length)

      setChartData({
        ...data,
        labels: countries,
        datasets: [{ ...data.datasets[0], data: countryData, backgroundColor: getChartColors(countries.length) }]
      })
    }
  }, [apiData])

  useEffect(() => {
    if (selectedCountry !== null) {
      const regionsData = apiData.filter((data) => data.country === selectedCountry)
      const regionLabels = regionsData.map((data) => data.region)
      const regionValues = regionsData.map((data) => data.valueInDollars)

      setRegionChartData({
        ...data,
        labels: regionLabels,
        datasets: [{ ...data.datasets[0], data: regionValues, backgroundColor: getChartColors(regionLabels.length) }]
      })
    }
  }, [selectedCountry])

  if (apiData === null) {
    return <div>Loading...</div>
  }

  return (
      <div style={{ padding: '24px' }}>
        <div>
          {selectedCountry !== null && (
              <button className="btn btn-blue" onClick={() => setSelectedCountry(null)}>
                Show countries
              </button>
          )}
        </div>
        <div>
          <Pie
              ref={chartRef}
              data={selectedCountry ? regionChartData : chartData}
              onClick={(event) => {
                const selectedElement = getElementAtEvent(chartRef.current, event);

                if (selectedCountry === null) {
                  setSelectedCountry(chartData.labels[selectedElement[0].index])
                }
              }}
          />
        </div>
      </div>
  )
}

export default PieChart
