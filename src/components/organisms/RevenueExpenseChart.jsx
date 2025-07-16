import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Chart from "react-apexcharts";

const RevenueExpenseChart = ({ incomes, expenses, className }) => {
  const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  
  const incomesByMonth = new Array(12).fill(0);
  const expensesByMonth = new Array(12).fill(0);

  incomes.forEach(income => {
    const month = new Date(income.fecha).getMonth();
    incomesByMonth[month] += income.monto;
  });

  expenses.forEach(expense => {
    const month = new Date(expense.fecha).getMonth();
    expensesByMonth[month] += expense.monto;
  });

  const chartOptions = {
    chart: {
      type: "bar",
      height: 350
    },
    xaxis: {
      categories: months
    },
    yaxis: {
      labels: {
        formatter: function (val) {
          return "$" + val.toLocaleString();
        }
      }
    },
    colors: ["#10B981", "#EF4444"],
    legend: {
      position: "top"
    },
    dataLabels: {
      enabled: false
    },
    plotOptions: {
      bar: {
        columnWidth: "60%"
      }
    }
  };

  const chartSeries = [
    {
      name: "Ingresos",
      data: incomesByMonth
    },
    {
      name: "Gastos",
      data: expensesByMonth
    }
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Ingresos vs Gastos Mensuales</CardTitle>
      </CardHeader>
      <CardContent>
        <Chart
          options={chartOptions}
          series={chartSeries}
          type="bar"
          height={350}
        />
      </CardContent>
    </Card>
  );
};

export default RevenueExpenseChart;