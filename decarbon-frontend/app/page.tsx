"use client";

import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';

const formSchema = z.object({
  address: z.string().min(2).max(50),
});

export default function Home() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    },
  });

  const onSubmit = () => {
    console.log("Submit");
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
                    Enter your address to check the carbon emission.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="mt-8">Submit</Button>
          </form>
        </Form>
      </Card>
      <Card className="p-4">Your result goes here</Card>
    </main>
  );
}
