import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Chart from "react-apexcharts";

const IncomeChart = ({ incomes, className }) => {
  const incomesBySource = incomes.reduce((acc, income) => {
    acc[income.fuente] = (acc[income.fuente] || 0) + income.monto;
    return acc;
  }, {});

  const sourceLabels = {
    boleteria: "Boletería",
    barra: "Barra",
    patrocinios: "Patrocinios",
    reservados: "Reservados"
  };

  const chartOptions = {
    chart: {
      type: "donut",
      height: 350
    },
    labels: Object.keys(incomesBySource).map(source => sourceLabels[source]),
    colors: ["#2563EB", "#10B981", "#8B5CF6", "#F59E0B"],
    legend: {
      position: "bottom"
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val.toFixed(1) + "%";
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: "65%"
        }
      }
    }
  };

  const chartSeries = Object.values(incomesBySource);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Ingresos por Fuente</CardTitle>
      </CardHeader>
      <CardContent>
        <Chart
          options={chartOptions}
          series={chartSeries}
          type="donut"
          height={350}
        />
      </CardContent>
    </Card>
  );
};

export default IncomeChart;