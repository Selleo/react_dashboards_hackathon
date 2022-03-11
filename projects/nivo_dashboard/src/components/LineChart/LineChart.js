import { useState, useEffect } from 'react'
import { ResponsiveLineCanvas } from '@nivo/line'
import axios from '../../axios'

const transformData = (data) => {
  return [
    {
      id: 'Sales',
      data: data.map(item => {
        return {
          x: item.date,
          y: item.valueInDollars,
        }
      })
    }
  ]
}

const getLastMonth = (data) => {
  const last = data[data.length - 1]
  let parts = last.date.split('-')
  parts.pop()
  return parts.join('-')
}

const getDataForMonth = (data, month) => {
  const monthData = data.filter(item => {
    return item.date.includes(month)
  })

  return transformData(monthData)
}

const getMonthName = month => {
  const date = new Date(`${month}-01`)
  return date.toLocaleString('default', { month: 'long' })
}

const formatCurrency = value => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)

function LineChart() {
  const [data, setData] = useState({})
  const [months, setMonths] = useState([])
  const [selectedMonth, setSelectedMonth] = useState('')

  useEffect(() => {
    axios.get('/salesByTime').then(response => {
      const { data } = response

      const months = data.map(({ date }) => {
        let parts = date.split('-')
        parts.pop()
        return parts.join('-')
      })

      const uniqueMonths = [...new Set(months)]

      const dataByMonth = {}

      uniqueMonths.forEach(month => {
        dataByMonth[month] = getDataForMonth(data, month)
      })

      setData(dataByMonth)
      setMonths(uniqueMonths)
      setSelectedMonth(getLastMonth(data))
    })
  }, [])

  const handlePreviousMonth = () => {
    const index = months.indexOf(selectedMonth)
    if (index === 0) {
      return
    }

    const previousMonth = months[index - 1]
    setSelectedMonth(previousMonth)
  }

  const handleNextMonth = () => {
    const index = months.indexOf(selectedMonth)
    if (index === months.length - 1) {
      return
    }

    const nextMonth = months[index + 1]
    setSelectedMonth(nextMonth)
  }

  if (Object.keys(data).length === 0) {
    return 'Loading...'
  }

  return (
    <>
      <h3 className="text-lg">Sales in {getMonthName(selectedMonth)}</h3>

      <div style={{ height: "230px", width: "100%" }}>
        <ResponsiveLineCanvas
          data={data[selectedMonth]}
          margin={{ top: 5, right: 30, bottom: 60, left: 80 }}
          yFormat={number => formatCurrency(number)}
          axisLeft={{
            format: number => formatCurrency(number),
          }}
          axisBottom={{
            tickValues: [
              `${selectedMonth}-01`,
              `${selectedMonth}-05`,
              `${selectedMonth}-10`,
              `${selectedMonth}-15`,
              `${selectedMonth}-20`,
              `${selectedMonth}-25`,
              `${selectedMonth}-31`,
            ],
            tickRotation: -45,
          }}
        />
      </div>

      <div className="flex flex-auto justify-center">
        <button
          className="border p-2 m-2 bg-slate-700 text-slate-100"
          onClick={handlePreviousMonth}
        >
          Previous month
        </button>

        <button
          className="border p-2 m-2 bg-slate-700 text-slate-100"
          onClick={handleNextMonth}
        >
          Next month
        </button>
      </div>
    </>
  )
}

export default LineChart
