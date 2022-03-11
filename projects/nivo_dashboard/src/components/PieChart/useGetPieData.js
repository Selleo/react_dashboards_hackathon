import { useEffect, useMemo, useState } from "react";
import axios from "../../axios";

export default function useGetPieData({ selectedCountry }) {
  const [rawData, setRawData] = useState(null);

  useEffect(() => {
    axios.get("/salesByRegion").then(({ data }) => setRawData(data));
  }, []);

  const data = useMemo(() => {
    if (!rawData) {
      return [];
    }
    if (!selectedCountry) {
      return rawData.reduce((acc, item) => {
        let accItem = acc.find(({ country }) => country === item.country);
        if (accItem) {
          accItem.valueInDollars += item.valueInDollars;
        } else {
          const { region, ...itemWithoutRegion } = item;
          acc.push(itemWithoutRegion);
        }

        return acc;
      }, []);
    }

    return rawData.filter(({ country }) => country === selectedCountry);
  }, [selectedCountry, rawData]);

  return { data };
}
