import { useMemo } from "react";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-date-fns";

import {
  Chart as ChartJS,
  TimeScale,       
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
} from "chart.js";

// register once
ChartJS.register(
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);


export default function PriceChart({ symbol, series }) {
  const data = useMemo(() => ({
    datasets: [
      {
        label: symbol,
        data: (series ?? []).map(p => ({ x: p.t, y: p.c })), // {x,y}
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.25,
        fill: true
      }
    ]
  }), [series, symbol]);

  const options = useMemo(() => ({
    parsing: false, // because we provide {x,y}
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: ctx => `$${(ctx.parsed?.y ?? 0).toFixed(2)}` } }
    },
    scales: {
      x: { type: "time", grid: { color: "rgba(255,255,255,.05)" } },
      y: { beginAtZero: false, grid: { color: "rgba(255,255,255,.05)" } }
    }
  }), []);

  if (!series?.length) return <div className="card">No data for {symbol} yet.</div>;
  return <div className="card"><div className="card-title">{symbol} — Intraday</div><Line data={data} options={options} /></div>;
}



// export default function PriceChart({ symbol, series }) {
//   const data = useMemo(() => ({
//     datasets: [
//       {
//         label: symbol,
//         data: (series ?? []).map(p => ({ x: p.t, y: p.c })), // <-- map to {x,y}
//         borderWidth: 2,
//         pointRadius: 0,
//         tension: 0.25,
//         fill: true
//       }
//     ]
//   }), [series, symbol]);

//   const options = useMemo(() => ({
//     parsing: false, // <-- we’re providing {x,y}
//     responsive: true,
//     plugins: {
//       legend: { display: false },
//       tooltip: {
//         enabled: true,
//         callbacks: {
//           label: ctx => `$${(ctx.parsed?.y ?? 0).toFixed(2)}`
//         }
//       }
//     },
//     scales: {
//       x: {
//         type: "time",
//         // remove any forced unit so both daily/intraday work:
//         // time: { unit: "minute" },
//         grid: { color: "rgba(255,255,255,0.05)" }
//       },
//       y: {
//         beginAtZero: false,
//         grid: { color: "rgba(255,255,255,0.05)" }
//       }
//     }
//   }), []);

//   if (!series || series.length === 0) {
//     return <div className="card">No data for {symbol} yet.</div>;
//   }

//   return (
//     <div className="card">
//       <div className="card-title">{symbol} — Intraday</div>
//       <Line data={data} options={options} />
//     </div>
//   );
// }

