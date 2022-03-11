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
      <h3 className="text-lg">
        Sales in {selectedCountry || "countries"}
        {selectedCountry && (
          <button
            className="border p-2 m-2 bg-slate-700 text-slate-100"
            onClick={() => setSelectedCountry(null)}
          >
            Go back to countries
          </button>
        )}
      </h3>
      <ResponsivePie
        data={data}
        value="valueInDollars"
        id={selectedCountry ? "region" : "country"}
        width={containerSize.width}
        height={containerSize.height}
        padAngle={2}
        valueFormat=" >-$"
        motionConfig="slow"
        onClick={({ data }) => !selectedCountry && setSelectedCountry(data.country)}
        margin={{
          top: containerSize.height * 0.12,
          right: containerSize.width * 0.2,
          bottom: containerSize.height * 0.12,
          left: containerSize.width * 0.2,
        }}
      />
    </>
  );
}

export default PieChart;
