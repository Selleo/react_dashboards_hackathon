import { ResponsivePie } from "@nivo/pie";
import { useState } from "react";
import useGetPieData from "./useGetPieData";

function PieChart() {
  const [selectedCountry, setSelectedCountry] = useState(null);

  const { data } = useGetPieData({ selectedCountry });

  if (!data) {
    return "Loading...";
  }

  return (
    <ResponsivePie
      data={Object.values(data)}
      value="valueInDollars"
      width={400}
      height={400}
    />
  );
}

export default PieChart;
