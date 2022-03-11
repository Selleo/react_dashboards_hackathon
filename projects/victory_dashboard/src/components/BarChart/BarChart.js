import React, { useState, useEffect } from "react";
import orderBy from "lodash/orderBy";
import {
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryLabel,
  VictoryStack,
  VictoryTheme,
  VictoryLegend,
} from "victory";
import axiosInstance from "../../axios";

function BarChart() {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [freezerData, setFreezerData] = useState();
  const [fridgeData, setFridgeData] = useState();
  const [microwaveData, setMicrowaveData] = useState();
  const [tvData, setTvData] = useState();
  const [washingMachineData, setWashingMachineData] = useState();

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get("/salesByCompanyProduct")
      .then((response) => {
        const data = orderBy(response.data, "productType");
        setData(data);
      })
      .then(() => setLoading(false));
  }, []);

  useEffect(() => {
    setFreezerData(data?.splice(0, 5));
    setFridgeData(data?.splice(0, 5));
    setMicrowaveData(data?.splice(0, 5));
    setTvData(data?.splice(0, 5));
    setWashingMachineData(data?.splice(0, 5));
  }, [data]);

  return (
    <VictoryChart domainPadding={20} theme={VictoryTheme.material}>
      <VictoryLegend
        x={10}
        y={20}
        orientation="horizontal"
        gutter={10}
        data={[
          { name: "LG", symbol: { fill: "#F4511E", type: "square" } },
          { name: "Samsung", symbol: { fill: "#FFF59D", type: "square" } },
          { name: "Sharp", symbol: { fill: "#DCE775", type: "square" } },
          { name: "Toshiba", symbol: { fill: "#8BC34A", type: "square" } },
          { name: "Mastercook", symbol: { fill: "#00796B", type: "square" } },
        ]}
      />
      <VictoryLabel text="Sales of products per company" x={200} y={10} textAnchor="end" />
      <VictoryAxis
        tickValues={[1, 2, 3, 4, 5]}
        tickFormat={["Freezer", "Fridge", "Microwave", "TV", "Washing\nmachine"]}
      />
      <VictoryAxis dependentAxis width={400} tickFormat={(x) => `${x}\nzł`} />

      <VictoryStack>
        <VictoryBar data={freezerData} x="company" y="valueInDollars" />
        <VictoryBar data={fridgeData} x="company" y="valueInDollars" />
        <VictoryBar data={microwaveData} x="company" y="valueInDollars" />
        <VictoryBar data={tvData} x="company" y="valueInDollars" />
        <VictoryBar data={washingMachineData} x="company" y="valueInDollars" />
      </VictoryStack>
    </VictoryChart>
  );
}

export default BarChart;
