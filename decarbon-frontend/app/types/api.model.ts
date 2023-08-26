export type LineChartData = LineChartDataItem[];
export interface LineChartDataItem {
  date_actual: string;
  address: string;
  ghg_emission: string;
}
