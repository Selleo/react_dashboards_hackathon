import React, { useEffect, useState } from "react";
import client from "../../axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { uniq, range } from "lodash";

const primaryChartOptions = {
  responsive: true,
  plugins: {
    legend: null,
    title: {
      display: true,
      text: "Total sale of products",
    },
  },
};
const secondaryChartOptions = {
  plugins: {
    title: {
      display: true,
      text: "Sales of products per company",
    },
  },
  responsive: true,
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
    },
  },
};
const thirdChartOptions = {
  responsive: true,
  plugins: {
    legend: true,
    title: {
      display: true,
      text: "Total sale of products",
    },
  },
};

function BarChart() {
  const [data, setData] = useState([]);
  const [chart, setChart] = useState("chart1");

  const labels = uniq(data.map((label) => label.productType));
  const topLabelsSecondChart = uniq(data?.map((element) => element.company));
  const barsData = data.map((element) => element.valueInDollars);

  const primaryChartData = {
    labels,
    datasets: [
      {
        label: "",
        data: barsData,
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  const color = [
    "rgba(255, 99, 24, 0.5)",
    "rgba(222, 99, 132, 0.5)",
    "rgba(123, 99, 132, 0.5)",
    "rgba(144, 99, 42, 0.5)",
    "rgba(9, 99, 222, 0.5)",
  ];
  const secondaryChartData = {
    labels,
    datasets: topLabelsSecondChart.map((label, index) => ({
      label: label,
      data: data
        ?.filter((el) => el.company === label)
        ?.map((el) => el.valueInDollars),
      backgroundColor: color[index],
    })),
  };

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  useEffect(() => {
    client
      .get(`/salesByCompanyProduct`)
      .then((res) => setData(res.data))
      .catch((err) => console.log("err", err));
  }, []);

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <select onChange={(event) => setChart(event.target.value)}>
        <option value="chart1">chart 1</option>
        <option value="chart2">chart 2</option>
        <option value="chart3">chart 3</option>
      </select>

      {chart === "chart1" && (
        <Bar options={primaryChartOptions} data={primaryChartData} />
      )}
      {chart === "chart2" && (
        <Bar options={secondaryChartOptions} data={secondaryChartData} />
      )}
      {chart === "chart3" && (
        <Bar options={thirdChartOptions} data={secondaryChartData} />
      )}
    </div>
  );
}

export default BarChart;
