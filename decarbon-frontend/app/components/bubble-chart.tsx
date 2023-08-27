import React from "react";
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController,
  ChartData,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import { faker } from "@faker-js/faker";
import { flatMap, groupBy, map, omit } from "lodash";
import { BubbleChartData } from "../types/api.model";
import { format } from "date-fns";

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController
);

export default function BubbleChart({ data }: { data: BubbleChartData }) {
  return (
    <Chart
      type="line"
      options={{ plugins: { legend: { display: false } } }}
      data={bubbleDataToBubbleChartOptions(data)}
      className="mb-8"
    />
  );
}

function bubbleDataToBubbleChartOptions(data: BubbleChartData): ChartData {
  const keyByDate = map(groupBy(data, "date_actual"), (_, key) =>
    format(new Date(key), "dd/MM/yyyy")
  );
  const groupByAddress = omit(groupBy(data, "address"), "null");
  return {
    labels: keyByDate,
    datasets: flatMap(
      map(groupByAddress, (groupAsArray, address) => {
        const color = `${faker.color.rgb()}70`;
        return [
          {
            type: "line" as const,
            label: address,
            data: groupAsArray.map((item) => Number(item.ghg_emission)),
            borderColor: color,
            backgroundColor: color,
          },
          {
            type: "bubble" as const,
            data: groupAsArray.map((item, index) => ({
              x: index,
              y: Number(item.ghg_emission),
              r: Number(item.ghg_emission_per_hour),
            })),
            backgroundColor: color,
          },
        ];
      })
    ),
  };
}
