import { useEffect, useState } from 'react';
import {
  XYPlot,
  XAxis,
  YAxis,
  HorizontalGridLines,
  VerticalGridLines,
  LineSeries,
  LabelSeries,
} from 'react-vis';
import axios from '../../axios';

function LineChart() {
  const [chartData, setChartData] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3001/salesByTime').then(({ data }) => {
      let newArr = data.map((el, index) => ({
        y: el.valueInDollars,
        x: index,
        label: el.date,
      }));

      setChartData(newArr);
    });
  }, []);

  const axisStyle = {
    ticks: {
      fontSize: '14px',
      color: '#333',
    },
    title: {
      fontSize: '16px',
      color: '#333',
    },
  };
  if (!chartData) {
    return null;
  }
  return (
    <div className="App">
      <XYPlot
        height={300}
        width={1255}
        margin={{
          left: 90,
          bottom: 100,
        }}
        padding={{

        }}
      >
        <HorizontalGridLines style={{ stroke: '#B7E9ED' }} />
        <VerticalGridLines style={{ stroke: '#B7E9ED' }} />
        <XAxis
          style={axisStyle}
          tickFormat={(_, i) => chartData[i].label}
          tickTotal={10}
          tickLabelAngle={-60}
        />
        <YAxis style={axisStyle} tickFormat={(v) => `${v} $`} />

        {chartData && (
          <LineSeries
            margin={10}
            style={{ fill: 'none' }}
            color="blue"
            data={chartData}
          />
        )}
      </XYPlot>
    </div>
  );
}

export default LineChart;
