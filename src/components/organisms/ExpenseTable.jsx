import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const ExpenseTable = ({ expenses, onApprove, onReject, onViewDetails, showActions = true }) => {
  const [sortField, setSortField] = useState("fecha");
  const [sortDirection, setSortDirection] = useState("desc");

  const statusColors = {
    pendiente: "warning",
    aprobado: "success",
    rechazado: "error"
  };

  const typeLabels = {
    normal: "Normal",
    nomina: "Nómina",
    anticipo: "Anticipo",
    honorarios: "Honorarios",
    viaticos: "Viáticos"
  };

  const sortedExpenses = [...expenses].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const SortableHeader = ({ field, children }) => (
    <th
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        {sortField === field && (
          <ApperIcon
            name={sortDirection === "asc" ? "ChevronUp" : "ChevronDown"}
            size={16}
          />
        )}
      </div>
    </th>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gastos Registrados</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <SortableHeader field="fecha">Fecha</SortableHeader>
                <SortableHeader field="concepto">Concepto</SortableHeader>
                <SortableHeader field="proveedor">Proveedor</SortableHeader>
                <SortableHeader field="monto">Monto</SortableHeader>
                <SortableHeader field="tipoGasto">Tipo</SortableHeader>
                <SortableHeader field="status">Estado</SortableHeader>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Archivo
                </th>
                {showActions && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedExpenses.map((expense) => (
                <tr key={expense.Id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {format(new Date(expense.fecha), "dd MMM yyyy", { locale: es })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {expense.concepto}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {expense.proveedor}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${expense.monto.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {typeLabels[expense.tipoGasto]}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={statusColors[expense.status]}>
                      {expense.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewDetails && onViewDetails(expense)}
                    >
                      <ApperIcon name="Eye" size={16} />
                    </Button>
                  </td>
                  {showActions && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex space-x-2">
                        {expense.status === "pendiente" && (
                          <>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => onApprove && onApprove(expense.Id)}
                            >
                              <ApperIcon name="Check" size={16} />
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => onReject && onReject(expense.Id)}
                            >
                              <ApperIcon name="X" size={16} />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpenseTable;