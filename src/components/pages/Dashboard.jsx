import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import MetricCard from "@/components/molecules/MetricCard";
import RevenueExpenseChart from "@/components/organisms/RevenueExpenseChart";
import ExpenseTable from "@/components/organisms/ExpenseTable";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { useExpenses } from "@/hooks/useExpenses";
import { useIncomes } from "@/hooks/useIncomes";
import { useEvents } from "@/hooks/useEvents";
import { useBudget } from "@/hooks/useBudget";

const Dashboard = () => {
  const { expenses, loading: expensesLoading, error: expensesError, loadExpenses } = useExpenses();
  const { incomes, loading: incomesLoading, error: incomesError, loadIncomes } = useIncomes();
  const { events, loading: eventsLoading, error: eventsError, loadEvents } = useEvents();
  const { budgetCategories, loading: budgetLoading, error: budgetError, loadBudgetCategories } = useBudget();

  const [selectedPeriod, setSelectedPeriod] = useState("thisMonth");

  const loading = expensesLoading || incomesLoading || eventsLoading || budgetLoading;
  const error = expensesError || incomesError || eventsError || budgetError;

  const retryLoad = () => {
    loadExpenses();
    loadIncomes();
    loadEvents();
    loadBudgetCategories();
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={retryLoad} />;

  // Calcular métricas
  const totalIncomes = incomes.reduce((sum, income) => sum + income.monto, 0);
  const totalExpenses = expenses.filter(e => e.status === "aprobado").reduce((sum, expense) => sum + expense.monto, 0);
  const totalBudget = budgetCategories.reduce((sum, cat) => sum + cat.presupuestoAsignado, 0);
  const pendingExpenses = expenses.filter(e => e.status === "pendiente");
  const roi = totalIncomes > 0 ? ((totalIncomes - totalExpenses) / totalIncomes * 100).toFixed(1) : 0;

  // Gastos recientes para mostrar en tabla
  const recentExpenses = expenses
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-display text-gray-900">Dashboard</h1>
        <select 
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="thisMonth">Este mes</option>
          <option value="lastMonth">Mes pasado</option>
          <option value="thisYear">Este año</option>
        </select>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Ingresos Totales"
          value={`$${totalIncomes.toLocaleString()}`}
          icon="TrendingUp"
          color="secondary"
          trend="up"
          trendValue="+12.5%"
        />
        <MetricCard
          title="Gastos Totales"
          value={`$${totalExpenses.toLocaleString()}`}
          icon="Receipt"
          color="error"
          trend="down"
          trendValue="-5.2%"
        />
        <MetricCard
          title="Presupuesto Disponible"
          value={`$${(totalBudget - totalExpenses).toLocaleString()}`}
          icon="DollarSign"
          color="primary"
          trend="neutral"
          trendValue="0%"
        />
        <MetricCard
          title="ROI"
          value={`${roi}%`}
          icon="Target"
          color="success"
          trend="up"
          trendValue="+3.1%"
        />
      </div>

      {/* Gráfica de ingresos vs gastos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueExpenseChart incomes={incomes} expenses={expenses} />
        
        <Card>
          <CardHeader>
            <CardTitle>Gastos Pendientes de Aprobación</CardTitle>
          </CardHeader>
          <CardContent>
            {pendingExpenses.length > 0 ? (
              <div className="space-y-4">
                {pendingExpenses.slice(0, 5).map((expense) => (
                  <div key={expense.Id} className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{expense.concepto}</p>
                      <p className="text-sm text-gray-600">{expense.proveedor}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">${expense.monto.toLocaleString()}</p>
                      <p className="text-sm text-yellow-600">Pendiente</p>
                    </div>
                  </div>
                ))}
                {pendingExpenses.length > 5 && (
                  <p className="text-sm text-gray-500 text-center">
                    +{pendingExpenses.length - 5} gastos más pendientes
                  </p>
                )}
              </div>
            ) : (
              <Empty
                title="No hay gastos pendientes"
                description="Todos los gastos han sido procesados"
                icon="CheckCircle"
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tabla de gastos recientes */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Gastos Recientes</h2>
        {recentExpenses.length > 0 ? (
          <ExpenseTable
            expenses={recentExpenses}
            showActions={false}
          />
        ) : (
          <Empty
            title="No hay gastos registrados"
            description="Aún no se han registrado gastos en el sistema"
            icon="Receipt"
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;