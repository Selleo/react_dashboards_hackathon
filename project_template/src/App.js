import "./App.css";
import cn from "classnames";
import LineChart from "./components/LineChart";
import BarChart from "./components/BarChart";
import PieChart from "./components/PieChart";

const cardStyles =
  "h-full rounded-md p-2 border border-slate-300 border-solid shadow-md shadow-slate-500 bg-slate-100";

function App() {
  return (
    <div className="bg-slate-200 h-screen">
      <div className="container mx-auto py-6 grid grid-cols-12 gap-6 h-full">
        <div className={cn("col-span-full", cardStyles)}>
          <LineChart />
        </div>
        <div
          className={cn(
            "col-span-10 col-start-2 md:col-start-1 md:col-span-6",
            cardStyles
          )}
        >
          <BarChart />
        </div>
        <div
          className={cn(
            "col-span-10 col-start-2 md:col-start-7 md:col-span-6",
            cardStyles
          )}
        >
          <PieChart />
        </div>
      </div>
    </div>
  );
}

export default App;
