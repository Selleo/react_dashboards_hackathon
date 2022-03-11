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
        let accItem = acc.find(({ id }) => id === item.country);
        if (accItem) {
          accItem.valueInDollars += item.valueInDollars;
        } else {
          acc.push({ id: item.country, valueInDollars: item.valueInDollars });
        }

        return acc;
      }, []);
    }

    return [];
  }, [selectedCountry, rawData]);

  return { data };
}
