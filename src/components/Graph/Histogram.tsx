// client
"use client";
import { useEffect, useMemo } from "react";
import * as _d3 from "d3";

const d3 = _d3 as any;

interface HistogramProps<T> {
  data: T;
}

export function Histogram<T>({ data }: HistogramProps<T>) {
  const graphId = useMemo(() => crypto.randomUUID(), []);
  // set the dimensions and margins of the graph

  useEffect(() => {
    var margin = { top: 10, right: 30, bottom: 30, left: 40 },
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    // parse the date / time
    var parseDate = d3.timeParse("%d-%m-%Y");

    // set the ranges
    var x = d3
      .scaleTime()
      .domain([new Date(2010, 6, 3), new Date(2012, 0, 1)])
      .rangeRound([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    // set the parameters for the histogram
    var histogram = d3
      .bin()
      .value(function (d) {
        return d.date;
      })
      .domain(x.domain())
      .thresholds(x.ticks(d3.timeMonth));

    // append the svg object to the body of the page
    // append a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3
      .select("body")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var bins = histogram(data);

    y.domain([
      0,
      d3.max(bins, function (d) {
        return d.length;
      }),
    ]);

    svg
      .selectAll("rect")
      .data(bins)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", 1)
      .attr("transform", function (d) {
        return "translate(" + x(d.x0) + "," + y(d.length) + ")";
      })
      .attr("width", function (d) {
        return x(d.x1) - x(d.x0) - 1;
      })
      .attr("height", function (d) {
        return height - y(d.length);
      });

    // add the x Axis
    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // add the y Axis
    svg.append("g").call(d3.axisLeft(y));
  }, []);

  return <div id={graphId}></div>;
}