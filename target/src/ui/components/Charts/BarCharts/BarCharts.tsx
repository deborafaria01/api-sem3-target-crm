import { useMemo } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface BarChartsProps {
  title: string;
  xaxis: string[];
  series: { name: string; data: number[] }[];
}

const StackedColumnChart: React.FC<BarChartsProps> = ({
  series,
  xaxis,
  title,
}) => {
  const options: ApexOptions = useMemo(
    () => ({
      chart: {
        type: "bar",
        height: 350,
        width: "100%",
        toolbar: {
          show: true,
        },
        zoom: {
          enabled: true,
        },
      },
      colors: ["rgb(0, 227, 150)", "rgb(0, 143, 251)", "rgb(255, 69, 96)"],
      responsive: [
        {
          breakpoint: 1000,
          options: {
            plotOptions: {
              bar: {
                horizontal: false,
              },
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: 10,
        },
      },
      title: {
        text: title,
      },
      xaxis: {
        type: "category",
        categories: xaxis,
      },
      legend: {
        position: "top",
        offsetY: 0,
      },
      fill: {
        opacity: 1,
      },
    }),
    [title, xaxis, series]
  );

  return (
    <>
      <Chart options={options} series={series} type="bar" height={350} />
    </>
  );
};

export default StackedColumnChart;
