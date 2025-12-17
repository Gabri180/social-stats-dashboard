// frontend/src/components/charts/AreaChart.tsx
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface AreaChartProps {
  data: number[];
  labels: string[];
  title: string;
  colors?: { border: string; background: string };
}

export default function AreaChart({ data, labels, title, colors }: AreaChartProps) {
  const defaultColors = {
    border: 'rgb(34, 197, 94)',
    background: 'rgba(34, 197, 94, 0.2)'
  };

  const chartColors = colors || defaultColors;

  const chartData = {
    labels,
    datasets: [
      {
        label: title,
        data,
        borderColor: chartColors.border,
        backgroundColor: chartColors.background,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: chartColors.border
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0, 0, 0, 0.05)' }
      },
      x: {
        grid: { display: false }
      }
    }
  };

  return (
    <div className="h-64 w-full">
      <Line data={chartData} options={options as any} />
    </div>
  );
}
