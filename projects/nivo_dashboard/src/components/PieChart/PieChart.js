import { ResponsivePie } from "@nivo/pie";
import { useState } from "react";
import useGetPieData from "./useGetPieData";
import useGetContainerSize from "./useGetContainerSize";
import cn from "classnames";

const enabledClasses = "bg-slate-700 text-slate-100"
const disabledClasses = "text-slate-500 bg-slate-300 cursor-default"

function PieChart({ containerRef }) {
  const [selectedCountry, setSelectedCountry] = useState(null);

  const { containerSize } = useGetContainerSize({ containerRef });
  const { data } = useGetPieData({ selectedCountry });

  if (!data || !containerSize) {
    return "Loading...";
  }
  return (
    <>
      <h3 className="text-lg inline-block">
        Sales in {selectedCountry || "countries"}
      </h3>
      <button
        className={cn("border p-2 ml-2", {
          [enabledClasses]: selectedCountry,
          [disabledClasses]: !selectedCountry,
        })}
        onClick={() => setSelectedCountry(null)}
      >
        Go back to countries
      </button>
      <ResponsivePie
        data={data}
        value="valueInDollars"
        id={selectedCountry ? "region" : "country"}
        width={containerSize.width}
        height={containerSize.height}
        innerRadius={selectedCountry ? 0.5 : 0}
        colors={{ scheme: 'set3' }}
        padAngle={selectedCountry ? 0 : 2}
        arcLabel={(e) => '$'+Math.round(e.value/1000)+'k'}
        arcLinkLabelsSkipAngle={1}
        arcLabelsSkipAngle={7}
        valueFormat=" >-$"
        activeOuterRadiusOffset={selectedCountry ? 0 : 10}
        activeInnerRadiusOffset={selectedCountry ? 0 : 10}
        transitionMode="middleAngle"
        motionConfig="slow"
        onClick={({ data }) =>
          !selectedCountry && setSelectedCountry(data.country)
        }
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
