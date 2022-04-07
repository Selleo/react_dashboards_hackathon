import {
  XYPlot,
  VerticalGridLines,
  HorizontalGridLines,
  XAxis,
  YAxis,
  VerticalBarSeries,
  VerticalBarSeriesCanvas,
  LabelSeries
} from "react-vis";
import axios from "axios";
import '../../../node_modules/react-vis/dist/style.css';
import { useEffect, useState } from 'react'

function BarChart() {
  const [data, setData] = useState([])

  useEffect(() => {
      const fetchData = async () => {
        const response = await axios({
          method: 'get',
          url: "http://localhost:3001/salesByCompanyProduct",
      })
      setData(response?.data)
      }
      fetchData()

    }, [])

  const byName = data.reduce((acc, product) => {
    if(acc[product.productType] === undefined) {
      acc[product.productType] = 0
    }
    acc[product.productType] += product.valueInDollars
    return acc
  }, {})

  const chartsData = Object.entries(byName).map((data) => (
    { x: data[0], y: data[1] }
  ))

  const labelData = chartsData.map((d, idx) => ({
    x: d.x,
    y: 0
  }));

  const BarSeries = VerticalBarSeries;

  return (
    <div style={{padding: "10px"}}>
      <h2>Total sell of products</h2>
        <XYPlot
          margin={{left: 70, top: 100}}
          animation
          xType="ordinal"
          width={600}
          fill="#4285F4"
          height={400}
          xDistance={100}
        >
          <VerticalGridLines />
          <HorizontalGridLines />
          <XAxis />
          <YAxis tickValues={[50000, 100000, 150000, 200000]}/>
          <BarSeries data={chartsData} left={0} />
          <LabelSeries data={labelData} />
        </XYPlot>
    </div>
  )
}

export default BarChart
