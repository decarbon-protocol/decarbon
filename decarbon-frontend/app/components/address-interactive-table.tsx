import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LineChartData, TableData } from "../types/api.model";
import { groupBy, map, omit, orderBy, sumBy } from "lodash";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LucideExternalLink } from "lucide-react";

// Captures 0x + 4 characters, then the last 4 characters.
const truncateRegex = /^(0x[a-zA-Z0-9]{8})[a-zA-Z0-9]+([a-zA-Z0-9]{8})$/;

/**
 * Truncates an ethereum address to the format 0x0000…0000
 * @param address Full address to truncate
 * @returns Truncated address
 */
const truncateEthAddress = (address: string) => {
  const match = address.match(truncateRegex);
  if (!match) return address;
  return `${match[1]}…${match[2]}`;
};

export default function AddressInteractiveTable({ data }: { data: TableData }) {
  return (
    <ScrollArea className="pr-2">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-48"></TableHead>
            <TableHead>Address</TableHead>
            <TableHead className="text-right">GHG Emissions (in kgCO2e)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map(({ address, ghg_emission, ghg_emission_group }, i) => (
            <TableRow key={address}>
              <TableCell className="font-medium">
                {ghg_emission_group === "Top_20" ? (
                  <span className="text-red-500">Red (Top 80%)</span>
                ) : (
                  ""
                )}
                {ghg_emission_group === "The_rest" ? (
                  <span className="text-green-600">Green (Bottom 20%)</span>
                ) : (
                  ""
                )}
              </TableCell>
              <TableCell>
                <a
                  href={`https://etherscan.io/address/${address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={address}
                  className="inline-flex gap-1 hover:text-blue-500"
                >
                  {truncateEthAddress(address)}
                  <LucideExternalLink className="w-4 h-4"></LucideExternalLink>
                </a>
              </TableCell>
              <TableCell className="text-right">
                {(
                  Math.round(
                    (Number(ghg_emission) + Number.EPSILON) * 1000000
                  ) / 1000000
                ).toFixed(6)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}

function convertLineChartData(lineData: LineChartData) {
  const groupByAddress = omit(groupBy(lineData, "address"), "null");
  const revertToArray = map(groupByAddress, (groupAsArray, address) => ({
    address,
    ghg: groupAsArray.reduce((acc, item) => acc + Number(item.ghg_emission), 0),
  }));
  const sortedByGhg = orderBy(revertToArray, "ghg", "desc");
  const sumGhg = sumBy(sortedByGhg, "ghg");
  // Find 80% index
  let total80 = 0;
  let i;
  for (i = 0; i < sortedByGhg.length && total80 / sumGhg < 0.8; i++) {
    total80 += sortedByGhg[i].ghg;
  }

  return { sortedByGhg, sumGhg, total80, percentage80Index: i - 1 };
}
