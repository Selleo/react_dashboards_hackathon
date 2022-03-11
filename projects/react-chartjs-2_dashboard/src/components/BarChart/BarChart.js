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
import { uniq } from "lodash";

export const options = {
  responsive: true,
  plugins: {
    legend: null,
    title: {
      display: true,
      text: "Total sale of products",
    },
  },
};

function BarChart() {
  const [data, setData] = useState([]);

  const labels = data.map((label) => label.productType);
  const topLabels = uniq(data?.map((element) => element.productType));
  const barsData = data.map((element) => element.valueInDollars);

  const chartDataTest = {
    labels,
    datasets: [
      {
        label: "",
        data: barsData,
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
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
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Bar options={options} data={chartDataTest} />
    </div>
  );
}

export default BarChart;
