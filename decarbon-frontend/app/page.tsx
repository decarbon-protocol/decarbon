"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import LineChart, { truncateEthAddress } from "./components/line-chart";
import { faker } from "@faker-js/faker";
import { useEffect, useState } from "react";
import { LineChartData, TableData } from "./types/api.model";
import AddressInteractiveTable from "./components/address-interactive-table";
import { addDays, differenceInDays, format } from "date-fns";
import { Calendar as CalendarIcon, SearchIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { groupBy, map, omit } from "lodash";

const formSchema = z.object({
  address: z.string().min(2).max(50),
});

function lineDataToChartOptions(from: Date, to: Date, lineData: LineChartData) {
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
export default function Home() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    },
  });
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date("2023-08-26"),
    to: new Date("2023-08-28"),
  });
  const [tableData, setTableData] = useState<TableData>();
  const [lineData, setLineData] = useState<LineChartData>();

  useEffect(() => {
    fetch(`/api/table`)
      .then((r) => r.json())
      .then((json) => setTableData(json));

    fetch(`/api/line`)
      .then((r) => r.json())
      .then((json) => setLineData(json));
  }, []);

  const onSubmit = async () => {
    const query =
      date?.from && date.to
        ? `?from=${format(date.from, "yyyy-MM-dd")}&to=${format(
            date.to,
            "yyyy-MM-dd"
          )}`
        : "";
    const response = await fetch(`/api/line${query}`);
    const json: LineChartData = await response.json();
    setLineData(json);
  };

  return (
    <main className="min-h-screen p-4 md:p-8">
      <h1 className="text-center text-4xl font-bold mb-4">
        Etherium Carbon Emission Dashboard
      </h1>
      <div className="flex items-start gap-8 ">
        <section className="flex flex-col gap-4 w-1/2">
          <Card className="p-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-fit flex flex-wrap items-end gap-4"
              >
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="w-full md:w-80">
                      <FormLabel>ETH Address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="0x71C7656EC7ab88b098defB751B7401B5f6d8976F"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid gap-2 ">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                          "w-[15rem] justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                          date.to ? (
                            <>
                              {format(date.from, "dd/MM/yyyy")} -{" "}
                              {format(date.to, "dd/MM/yyyy")}
                            </>
                          ) : (
                            format(date.from, "dd/MM/yyyy")
                          )
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <Button size="icon">
                  <SearchIcon></SearchIcon>
                </Button>
              </form>
            </Form>
          </Card>
          <Card className="p-4 w-full">
            {date?.from && date.to && lineData && (
              <LineChart
                data={lineDataToChartOptions(date.from, date.to, lineData)}
              />
            )}
          </Card>
        </section>
        {tableData && (
          <Card className="p-4 w-1/2">
            <AddressInteractiveTable data={tableData} />
          </Card>
        )}
      </div>
    </main>
  );
}
