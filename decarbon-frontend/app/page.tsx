"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import LineChart from "./components/line-chart";
import { faker } from "@faker-js/faker";
import { useState } from "react";
import { LineChartData } from "./types/api.model";
import AddressInteractiveTable from "./components/address-interactive-table";

const formSchema = z.object({
  address: z.string().min(2).max(50),
});
const labels = ["January", "February", "March", "April", "May", "June", "July"];

const data = {
  labels,
  datasets: [
    {
      label: "Dataset 1",
      data: labels.map(() => faker.number.int({ min: -1000, max: 1000 })),
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
    {
      label: "Dataset 2",
      data: labels.map(() => faker.number.int({ min: -1000, max: 1000 })),
      borderColor: "rgb(53, 162, 235)",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
    },
  ],
};

export default function Home() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    },
  });
  const [tableData, setTableData] = useState<LineChartData>();
  const [lineData, setLineData] = useState(data);

  const onSubmit = async () => {
    const response = await fetch("/api/user");
    const json: LineChartData = await response.json();
    setTableData(json);
  };

  return (
    <main className="min-h-screen flex flex-col items-center gap-8 p-4 md:p-8">
      <Card className="p-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-fit flex gap-4"
          >
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="w-full md:w-96">
                  <FormLabel>ETH Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="0x71C7656EC7ab88b098defB751B7401B5f6d8976F"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter your address to check the carbon emission!
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="mt-8">Submit</Button>
          </form>
        </Form>
      </Card>
      <section className="flex gap-8 w-full">
        <Card className="p-4 w-5/12">
          <LineChart data={lineData} />
        </Card>
        {tableData && (
          <Card className="p-4 w-7/12">
            <AddressInteractiveTable data={tableData} />
          </Card>
        )}
      </section>
    </main>
  );
}
