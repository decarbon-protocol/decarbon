import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LineChartData } from "../types/api.model";
import { groupBy, map, omit, orderBy, sumBy } from "lodash";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function AddressInteractiveTable({
  data,
}: {
  data: LineChartData;
}) {
  const { sortedByGhg, sumGhg, total80, percentage80Index } =
    convertLineChartData(data);

  return (
    <ScrollArea className="h-[27rem]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-32"></TableHead>
            <TableHead>Address</TableHead>
            <TableHead className="text-right">GHG Emission</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedByGhg.map(({ address, ghg }, i) => (
            <TableRow key={address}>
              <TableCell className="font-medium">
                {i === 0 ? (
                  <strong className="text-red-500">Red Level (Top 80%)</strong>
                ) : (
                  ""
                )}
                {i === percentage80Index + 1 ? (
                  <strong className="text-green-600">
                    Green level (Bottom 20%)
                  </strong>
                ) : (
                  ""
                )}
              </TableCell>
              <TableCell>{address}</TableCell>
              <TableCell className="text-right">
                {(
                  Math.round((ghg + Number.EPSILON) * 1000000) / 1000000
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
