import { useState, useEffect } from 'react'
import { ResponsiveBar } from '@nivo/bar'
import db from "../../db.initial.json";

const transformDataFirst = (products, data) => {
  const result = products.map(product => {
    return {
      productType: product,
      price: data.reduce((acc, current) => {
        if (current.productType === product) {
          return acc + current.valueInDollars
        }

        return acc
      }, 0),
    }
  })

  return result
}

const transformDataSecond = (products, data) => {
  const companies = [...new Set(data.map(({ company }) => company))]

  const result = products.map(product => {
    const productResult = {
      productType: product,
    }

    companies.forEach(company => {
      const companyData = data.filter(item => {
        return item.productType === product && item.company === company
      })

      productResult[`${company}`] = companyData[0].valueInDollars
    })

    return productResult
  })

  return result
}

function BarChart() {
  const [tab, setTab] = useState('first')
  const [products, setProducts] = useState([])
  const [dataFirst, setDataFirst] = useState([])
  const [dataSecond, setDataSecond] = useState([])

  const legends = [
    {
      dataFrom: 'keys',
      anchor: 'top',
      direction: 'row',
      translateY: -30,
      itemsSpacing: 2,
      itemWidth: 100,
      itemHeight: 20,
      itemOpacity: 0.85,
      symbolSize: 20,
      effects: [
        {
          on: 'hover',
          style: {
            itemOpacity: 1
          }
        }
      ]
    }
  ]

  const tooltip = ({ id, value }) => (
    <div className="p-2 bg-white">
      <p><strong>{id}</strong> - {value}</p>
    </div>
  )

  const margin = { top: 40, right: 0, bottom: 30, left: 50 }

  useEffect(() => {
    const data = db.salesByCompanyProduct;
    const dataProducts = [
      ...new Set(data.map(({ productType }) => productType)),
    ];
    setProducts(dataProducts);

    // Display bars with total sale value of given product (without division by company)
    setDataFirst(transformDataFirst(dataProducts, data));

    // Display bars with total sale value of given product (stacked per company) example
    // Display bars with product sale value (each company should be in separate data series)
    setDataSecond(transformDataSecond(dataProducts, data));
  }, []);

  if (!products.length) {
    return "Loading..."
  }

  const enabledClasses = 'bg-slate-700 text-slate-100'
  const disabledClasses = 'text-slate-500 bg-slate-300'

  return (
    <>
      <div className="flex flex-auto justify-center">
        <button
          className={`border p-2 m-2 ${tab === 'first' ? disabledClasses : enabledClasses}`}
          onClick={() => setTab('first')}
          disabled={tab === 'first'}
        >
          Total sales
        </button>

        <button
          className={`border p-2 m-2 ${tab === 'second' ? disabledClasses : enabledClasses}`}
          onClick={() => setTab('second')}
          disabled={tab === 'second'}
        >
          Stacked
        </button>

        <button
          className={`border p-2 m-2 ${tab === 'third' ? disabledClasses : enabledClasses}`}
          onClick={() => setTab('third')}
          disabled={tab === 'third'}
        >
          Grouped
        </button>
      </div>

      {tab === 'first' && (
        <>
          <h3 className="text-lg">Total sale of products</h3>

          <div className="w-full h-[290px]">
            <ResponsiveBar
              data={dataFirst}
              keys={['price']}
              indexBy="productType"
              margin={{ top: 10, right: 0, bottom: 30, left: 50 }}
              colorBy="priceColor"
              tooltip={
                ({ value }) => (
                  <div className="p-2 bg-white">
                    <p><strong>Total sale:</strong> {value}</p>
                  </div>
                )
              }
            />
          </div>
        </>
      )}

      {tab === 'second' && (
        <>
          <h3 className="text-lg">Sales of products per company</h3>

          <div className="w-full h-[290px]">
            <ResponsiveBar
              data={dataSecond}
              keys={['LG', 'Samsung', 'Sharp', 'Toshiba', 'Mastercook']}
              indexBy="productType"
              margin={margin}
              tooltip={tooltip}
              legends={legends}
            />
          </div>
        </>
      )}

      {tab === 'third' && (
        <>
          <h3 className="text-lg">Sales of products per company</h3>

          <div className="w-full h-[290px]">
            <ResponsiveBar
              data={dataSecond}
              keys={['LG', 'Samsung', 'Sharp', 'Toshiba', 'Mastercook']}
              indexBy="productType"
              groupMode="grouped"
              margin={margin}
              tooltip={tooltip}
              legends={legends}
            />
          </div>
        </>
      )}
    </>
  )
}

export default BarChart
