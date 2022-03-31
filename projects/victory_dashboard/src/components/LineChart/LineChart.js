import React, { useState, useEffect } from "react";
import { VictoryChart, VictoryLabel, VictoryLine, VictoryTheme, VictoryAxis } from "victory";
import axiosInstance from "../../axios";

const tickValuesY = ["2021-02-07", "2021-02-14", "2021-02-21", "2021-02-28"];

function BarChart() {
  const [data, setData] = useState();
  const [februaryData, setFebruaryData] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get("/salesByTime")
      .then((response) => {
        setData(response.data);
      })
      .then(() => setLoading(false));
  }, []);

  useEffect(() => {
    setFebruaryData(data?.splice(31, 28));
  }, [data]);

  console.log({ februaryData });
  return (
    <VictoryChart domainPadding={10} theme={VictoryTheme.material}>
      <VictoryLabel text="Sales in February" x={150} y={20} textAnchor="end" />
      <VictoryAxis
        tickValues={tickValuesY}
        style={{
          tickLabels: {
            angle: -30,
          },
        }}
      />
      <VictoryAxis
        dependentAxis
        tickFormat={(x) => `$${x}`}
        tickLabelComponent={<VictoryLabel style={{ fontSize: "8px" }} />}
      />
      <VictoryLine
        style={{
          data: { stroke: "#c43a31" },
          parent: { border: "1px solid #ccc" },
        }}
        data={februaryData}
        y="valueInDollars"
      />
    </VictoryChart>
  );
}

export default BarChart;
