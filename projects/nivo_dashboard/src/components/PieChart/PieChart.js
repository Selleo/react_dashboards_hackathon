import { ResponsivePie } from "@nivo/pie";
import { useState } from "react";
import useGetPieData from "./useGetPieData";
import useGetContainerSize from "./useGetContainerSize";

function PieChart({ containerRef }) {
  const [selectedCountry, setSelectedCountry] = useState(null);

  const { containerSize } = useGetContainerSize({ containerRef });
  const { data } = useGetPieData({ selectedCountry });

  if (!data || !containerSize) {
    return "Loading...";
  }

  return (
    <>
      <h3 className="text-lg">Sales in {selectedCountry || 'countries'}</h3>
      <ResponsivePie
        data={Object.values(data)}
        value="valueInDollars"
        width={containerSize.width}
        height={containerSize.height}
        padAngle={2}
        valueFormat=" >-$"
        margin={{
          top: 10,
          right: containerSize.width * 0.2,
          bottom: 10,
          left: containerSize.width * 0.2,
        }}
      />
    </>
  );
}

export default PieChart;
