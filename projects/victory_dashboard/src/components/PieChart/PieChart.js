import { useState, useEffect } from 'react';
import axiosInstance from '../../axios';
import { VictoryPie } from 'victory';

function PieChart() {
  const [data, setData] = useState();
  const [dataForChart, setDataForChart] = useState();
  const [loading, setLoading] = useState(false);
  const [externalMutations, setExternalMutations] = useState([]);
  const [countries, setCountries] = useState([]);

  const [seeDetails, setSeeDetails] = useState('country');

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get('/salesByRegion')
      .then((response) => {
        setData(response.data);
      })
      .then(() => setLoading(false));
  }, []);

  useEffect(() => {
    const groupByCountry = data?.reduce((acc, val) => {
      let countryData = acc
        .filter((obj) => obj.country === val.country)
        .pop() || {
        country: val.country,
        valueInDollars: 0,
      };

      countryData.valueInDollars += val.valueInDollars;
      acc.push(countryData);
      return acc;
    }, []);

    setCountries(
      groupByCountry?.filter(
        (item, index, array) => index === array.indexOf(item)
      )
    );

    setDataForChart(
      groupByCountry?.filter(
        (item, index, array) => index === array.indexOf(item)
      )
    );
  }, [data]);

  const handleReset = () =>
    setExternalMutations([
      {
        target: 'data',
        eventKey: 'all',
        mutation: () => {
          setSeeDetails('country');
          setDataForChart(countries);
          return { data: dataForChart, y: 'valueInDollars' };
        },
        callback: () => setExternalMutations(undefined),
      },
    ]);

  if (loading) {
    return <div>Loading</div>;
  }

  return (
    <>
      <button onClick={handleReset}>Reset</button>
      <VictoryPie
        data={dataForChart}
        x={seeDetails}
        y="valueInDollars"
        colorScale={['tomato', 'orange', 'gold', 'cyan', 'navy']}
        externalEventMutations={externalMutations}
        events={[
          {
            target: 'data',
            eventHandlers: {
              onClick: () => {
                setSeeDetails('region');
                return [
                  {
                    target: 'data',
                    mutation: (props) => {
                      setDataForChart(
                        data.filter(
                          (data) => data.country === props.datum.country
                        )
                      );
                      return { data: dataForChart };
                    },
                  },
                ];
              },
            },
          },
        ]}
      />
    </>
  );
}

export default PieChart;
