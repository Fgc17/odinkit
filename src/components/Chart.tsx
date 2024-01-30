// client
"use client";
import dayjs from "dayjs";
import {
  ChartConfiguration,
  ChartConfigurationCustomTypesPerDataset,
  Chart as ChartJS,
  ChartTypeRegistry,
} from "chart.js/auto";
import { forwardRef, useEffect, useRef } from "react";
import _ from "lodash";

export function createChart<
  TType extends keyof ChartTypeRegistry,
  TData,
  TLabel,
>(
  chart:
    | ChartConfiguration<TType, TData, TLabel>
    | ChartConfigurationCustomTypesPerDataset<TType, TData, TLabel>
) {
  return chart;
}

export function ChartContainer<
  TType extends keyof ChartTypeRegistry,
  TData,
  TLabel,
>({ chart }: { chart: ReturnType<typeof createChart<TType, TData, TLabel>> }) {
  const chartRef = useRef<ChartJS<TType, TData, TLabel> | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const renderChart = () => {
    if (!canvasRef.current) return;

    chartRef.current = new ChartJS(canvasRef.current, chart);
  };

  const destroyChart = () => {
    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }
  };

  const updateChart = () => {
    chartRef.current?.update();
  };

  useEffect(() => {
    renderChart();

    return () => destroyChart();
  }, []);

  useEffect(() => {
    if (!chartRef.current) return;

    chartRef.current.data.datasets.forEach((dataset) => {
      const foundDataset = chart.data.datasets?.find(
        (d) => d.label === dataset.label
      );

      if (foundDataset) {
        Object.assign(dataset, foundDataset);
      }
    });

    updateChart();
  }, [chart.data.datasets]);

  useEffect(() => {
    if (!chartRef.current) return;

    chartRef.current.data.labels = chart.data.labels;

    updateChart();
  }, [chart.data.labels]);

  useEffect(() => {
    if (!chartRef.current || !chart.options) return;

    chartRef.current.options = chart.options;

    updateChart();
  }, [chart.options]);

  return (
    <canvas
      role="img"
      ref={(el) => {
        canvasRef.current = el;
      }}
    />
  );
}
