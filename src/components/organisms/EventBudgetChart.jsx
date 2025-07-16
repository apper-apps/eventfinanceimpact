import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import ProgressBar from "@/components/molecules/ProgressBar";
import { cn } from "@/utils/cn";

const EventBudgetChart = ({ event, categories, className }) => {
  const totalBudget = categories.reduce((sum, cat) => sum + cat.presupuestoAsignado, 0);
  const totalSpent = categories.reduce((sum, cat) => sum + cat.gastado, 0);
  const remainingBudget = totalBudget - totalSpent;

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle>Presupuesto - {event?.nombre}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Presupuesto Total</p>
              <p className="text-2xl font-bold text-gray-900">
                ${totalBudget.toLocaleString()}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Gastado</p>
              <p className="text-2xl font-bold text-error">
                ${totalSpent.toLocaleString()}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Disponible</p>
              <p className="text-2xl font-bold text-success">
                ${remainingBudget.toLocaleString()}
              </p>
            </div>
          </div>

          <ProgressBar
            value={totalSpent}
            max={totalBudget}
            label="Progreso General"
            color={totalSpent > totalBudget * 0.9 ? "error" : "primary"}
          />

          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Presupuesto por Rubro</h4>
            {categories.map((category) => {
              const percentage = (category.gastado / category.presupuestoAsignado) * 100;
              return (
                <div key={category.Id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">
                      {category.nombre}
                    </span>
                    <span className="text-sm text-gray-500">
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                  <ProgressBar
                    value={category.gastado}
                    max={category.presupuestoAsignado}
                    color={percentage > 90 ? "error" : percentage > 70 ? "warning" : "success"}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventBudgetChart;