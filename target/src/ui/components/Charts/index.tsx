import moment from "moment";
import React, { useState } from "react";
import Chart from "react-apexcharts";
import ChartsMoney from "./ChartsMoney";
import Pizza from "./Pizza";
import StackedColumnChart from "./StackedColumnChart/StackedColumnChartComponent";
//AINDA N ESTA EM USO... APENAS PARA TESTE DE LAYOUT

const date = moment().format("MMM");

const options = {
  chart: {
    id: "basic-bar",
  },
  xaxis: {
    name: "Mês",
    categories: [
      moment().subtract(7, "month").format("MMM"),
      moment().subtract(6, "month").format("MMM"),
      moment().subtract(5, "month").format("MMM"),
      moment().subtract(4, "month").format("MMM"),
      moment().subtract(3, "month").format("MMM"),
      moment().subtract(2, "month").format("MMM"),
      moment().subtract(1, "month").format("MMM"),
      date,
    ],
  },
};

const series = [
  {
    name: "GANHAS",
    data: [4, 5, 1, 7, 2, 5, 1, 2],
  },
  {
    name: "EM ANDAMENTO",
    data: [3, 3, 2, 8, 3, 4, 7, 2],
  },
  {
    name: "PERDIDAS",
    data: [1, 7, 5, 5, 5, 1, 7, 9],
  },
];

function Charts() {
  return (
    <div id="chart">
      {window && (
        <>
          <Chart options={options} series={series} type="bar" height={350} />
          <StackedColumnChart />
          <ChartsMoney />
          <Pizza />
        </>
      )}
    </div>
  );
}
export default Charts;
