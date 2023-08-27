import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { LineChartData } from "../types/api.model";
import { faker } from "@faker-js/faker";
import { groupBy, map, omit } from "lodash";
import { format } from "date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Captures 0x + 4 characters, then the last 4 characters.
const truncateRegex = /^([a-zA-Z0-9]{8})[a-zA-Z0-9]+([a-zA-Z0-9]{6})$/;

/**
 * Truncates an ethereum address to the format 0x0000…0000
 * @param address Full address to truncate
 * @returns Truncated address
 */
export const truncateAddress = (address: string) => {
  const match = address.match(truncateRegex);
  if (!match) return address;
  return `${match[1]}…${match[2]}`;
};

export const options: ChartOptions<"line"> = {
  responsive: true,
  aspectRatio: 1 / 1.25,
  plugins: {
    legend: {
      position: "bottom" as const,
    },
    title: {
      display: true,
      text: "Addresses with GHG emission over time",
    },
  },
};

export default function LineChart({ data }: { data: LineChartData }) {
  return <Line options={options} data={lineDataToChartOptions(data)} />;
}

function lineDataToChartOptions(lineData: LineChartData) {
  const keyByDate = map(groupBy(lineData, "date_actual"), (_, key) =>
    format(new Date(key), "dd/MM/yyyy")
  );
  const groupByAddress = omit(groupBy(lineData, "address"), "null");
  return {
    labels: keyByDate,
    datasets: map(groupByAddress, (groupAsArray, address) => {
      const color = faker.color.rgb();
      return {
        label: address,
        data: groupAsArray.map((item) => Number(item.ghg_emission)),
        borderColor: color,
        backgroundColor: color,
      };
    }),
  };
}
