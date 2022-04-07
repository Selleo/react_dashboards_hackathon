import { useEffect, useState, useMemo } from 'react';
import {
  XYPlot,
  RadialChart,
} from 'react-vis';

import './styles.css'
import axios from '../../axios';

const HALF_PI = Math.PI / 2;
const COLORS = [
  '#f44336',
  '#9c27b0',
  '#2196f3',
  '#4caf50',
];
const EXTENDED_DISCRETE_COLOR_RANGE = [
  '#19CDD7',
  '#DDB27C',
  '#88572C',
  '#FF991F',
  '#F15C17',
  '#223F9A',
  '#DA70BF',
  '#125C77',
  '#4DC19C',
  '#776E57',
  '#12939A',
  '#17B8BE',
  '#F6D18A',
  '#B7885E',
  '#FFCB99',
  '#F89570',
  '#829AE3',
  '#E79FD5',
  '#1E96BE',
  '#89DAC1',
  '#B3AD9E'
];

const getColor = (index) => {
  return COLORS[COLORS.length];
};

function PieChart() {
  const [activeCountryName, setActiveCountryName] = useState(null);
  const [overallSum, setOverallSum] = useState(0);
  const [byCountry, setByCountry] = useState(null);

  useEffect(() => {
    (async () => {
      const response = await axios.get('/salesByRegion');

      let overallSum = 0;

      const byCountry = response.data.reduce((acc, entry) => {
        if (!acc[entry.country]) {
          acc[entry.country] = [];
          acc[entry.country].sum = 0;
        }

        acc[entry.country].push(entry);
        acc[entry.country].sum += entry.valueInDollars;

        overallSum += entry.valueInDollars;

        return acc;
      }, {});

      setOverallSum(overallSum);
      setByCountry(byCountry);
    })();
  }, []);

  const data = useMemo(() => {
    if (!byCountry) { return; }

    if (activeCountryName) {
      const countryData = byCountry[activeCountryName];
      const data = countryData.map((entry, index) => {
        const color =  getColor(index);
        const percentage = entry.valueInDollars / countryData.sum;

        return {
          label: entry.region,
          subLabel: (percentage * 100).toFixed(2) + '%',
          angle: HALF_PI * percentage,
          // color: color,
        };
      });

      return data;
    }

    let prevAngle = 0;
    const data = Object.entries(byCountry).map((data, index) => {
      const [countryName, entries] = data;
      const color =  getColor(index);
      const percentage = entries.sum / overallSum;
      const result = {
        label: countryName,
        subLabel: (percentage * 100).toFixed(2) + '%',
        angle: HALF_PI * percentage,
        radius: 100,
        // color: color,
      };
      prevAngle = result.angle;
      return result;
    });

    return data;
  }, [
    activeCountryName,
    byCountry,
    overallSum,
  ]);

  if (!data) {
    return null;
  }

  const onValueClick = (value) => {
    if (activeCountryName) {
      setActiveCountryName(null);
      return;
    }

    setActiveCountryName(value.label);
  }

  const plot = (
    <RadialChart
      animation='noWobble'
      data={data}
      width={600}
      height={400}
      showLabels={true}
      onValueClick={onValueClick}
      labelsStyle={{
        fontSize: 15,
        fontWeight: 'bold'
      }}
    />
  );

  return (
    <div className='flex flex-col w-full h-full items-center content-center'>
      <h2>
        {activeCountryName ? `Sale in ${activeCountryName} per region` : 'Sale per country'}
      </h2>
      {plot}
    </div>
  );
}

export default PieChart
