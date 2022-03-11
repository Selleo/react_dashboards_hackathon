import { useState, useEffect } from 'react'
import { ResponsiveBar } from '@nivo/bar'
import axios from '../../axios'

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
    axios.get('/salesByCompanyProduct').then(res => {
      const data = res.data
      const dataProducts = [...new Set(data.map(({ productType }) => productType))]
      setProducts(dataProducts)

      // Display bars with total sale value of given product (without division by company)
      setDataFirst(transformDataFirst(dataProducts, data))

      // Display bars with total sale value of given product (stacked per company) example
      // Display bars with product sale value (each company should be in separate data series)
      setDataSecond(transformDataSecond(dataProducts, data))
    })
  }, [])

  if (!products.length) {
    return "Loading..."
  }

  return (
    <>
      <div className="flex flex-auto justify-center">
        <button
          className="border p-2 m-2 bg-slate-700 text-slate-100"
          onClick={() => setTab('first')}
          disabled={tab === 'first'}
        >
          Total sales
        </button>

        <button
          className="border p-2 m-2 bg-slate-700 text-slate-100"
          onClick={() => setTab('second')}
          disabled={tab === 'second'}
        >
          Stacked
        </button>

        <button
          className="border p-2 m-2 bg-slate-700 text-slate-100"
          onClick={() => setTab('third')}
          disabled={tab === 'third'}
        >
          Grouped
        </button>
      </div>

      {tab === 'first' && (
        <>
          <h1 className="text-3xl">Total sale of products</h1>

          <div className="w-full h-96 mb-14">
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
          <h1 className="text-3xl">Sales of products per company</h1>

          <div className="w-full h-96 mb-14">
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
          <h1 className="text-3xl">Sales of products per company</h1>

          <div className="w-full h-96">
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
