export type LineChartData = LineChartDataItem[];
export interface LineChartDataItem {
  date_actual: string;
  address: string;
  ghg_emission: string;
}

export type BubbleChartData = BubbleChartDataItem[];
export interface BubbleChartDataItem {
  date_actual: string;
  address: string;
  ghg_emission: string;
  ghg_emission_per_hour: string;
}

export type TableData = TableDataItem[];
export interface TableDataItem {
  address: string;
  ghg_emission: string;
  ghg_emission_group: "The_rest" | "Top_20";
}
