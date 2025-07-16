import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import SearchBar from "@/components/molecules/SearchBar";
import ExpenseForm from "@/components/organisms/ExpenseForm";
import ExpenseTable from "@/components/organisms/ExpenseTable";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { useExpenses } from "@/hooks/useExpenses";
import { useEvents } from "@/hooks/useEvents";
import { useBudget } from "@/hooks/useBudget";
import { toast } from "react-toastify";

const Expenses = () => {
  const { expenses, loading: expensesLoading, error: expensesError, createExpense, loadExpenses } = useExpenses();
  const { events, loading: eventsLoading, error: eventsError, loadEvents } = useEvents();
  const { budgetCategories, loading: budgetLoading, error: budgetError, loadBudgetCategories } = useBudget();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [eventFilter, setEventFilter] = useState("all");
  const [selectedExpense, setSelectedExpense] = useState(null);

  const loading = expensesLoading || eventsLoading || budgetLoading;
  const error = expensesError || eventsError || budgetError;

  const retryLoad = () => {
    loadExpenses();
    loadEvents();
    loadBudgetCategories();
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={retryLoad} />;

  const handleCreateExpense = async (expenseData) => {
    try {
      await createExpense(expenseData);
      setShowCreateForm(false);
      toast.success("Gasto registrado exitosamente");
    } catch (err) {
      toast.error("Error al registrar el gasto");
    }
  };

  const handleViewDetails = (expense) => {
    setSelectedExpense(expense);
  };

  // Filtrar gastos
  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.concepto.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.proveedor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || expense.status === statusFilter;
    const matchesEvent = eventFilter === "all" || expense.eventoId === eventFilter;
    
    return matchesSearch && matchesStatus && matchesEvent;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-display text-gray-900">Gastos</h1>
        <Button onClick={() => setShowCreateForm(true)}>
          <ApperIcon name="Plus" size={20} className="mr-2" />
          Registrar Gasto
        </Button>
      </div>

      {/* Formulario de creación */}
      {showCreateForm && (
        <ExpenseForm
          onSubmit={handleCreateExpense}
          events={events}
          budgetCategories={budgetCategories}
        />
      )}

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <SearchBar
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar gastos..."
            />
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Todos los estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="aprobado">Aprobado</option>
              <option value="rechazado">Rechazado</option>
            </Select>
            <Select
              value={eventFilter}
              onChange={(e) => setEventFilter(e.target.value)}
            >
              <option value="all">Todos los eventos</option>
              {events.map(event => (
                <option key={event.Id} value={event.Id.toString()}>{event.nombre}</option>
              ))}
            </Select>
            <Button variant="outline" onClick={() => {
              setSearchTerm("");
              setStatusFilter("all");
              setEventFilter("all");
            }}>
              Limpiar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Gastos</p>
              <p className="text-2xl font-bold text-gray-900">{expenses.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Pendientes</p>
              <p className="text-2xl font-bold text-warning">
                {expenses.filter(e => e.status === "pendiente").length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Aprobados</p>
              <p className="text-2xl font-bold text-success">
                {expenses.filter(e => e.status === "aprobado").length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Monto Total</p>
              <p className="text-2xl font-bold text-primary">
                ${expenses.filter(e => e.status === "aprobado").reduce((sum, e) => sum + e.monto, 0).toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de gastos */}
      {filteredExpenses.length > 0 ? (
        <ExpenseTable
          expenses={filteredExpenses}
          onViewDetails={handleViewDetails}
          showActions={false}
        />
      ) : (
        <Empty
          title="No hay gastos registrados"
          description="Comienza registrando tu primer gasto subiendo un comprobante"
          icon="Receipt"
          actionLabel="Registrar Gasto"
          onAction={() => setShowCreateForm(true)}
        />
      )}

      {/* Modal de detalles del gasto */}
      {selectedExpense && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Detalles del Gasto</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedExpense(null)}
                >
                  <ApperIcon name="X" size={20} />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Concepto</p>
                    <p className="font-medium">{selectedExpense.concepto}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Proveedor</p>
                    <p className="font-medium">{selectedExpense.proveedor}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Monto</p>
                    <p className="font-medium text-lg">${selectedExpense.monto.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Tipo</p>
                    <p className="font-medium">{selectedExpense.tipoGasto}</p>
                  </div>
                </div>

                {selectedExpense.datosOCR && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Datos extraídos por OCR:</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-blue-700">Proveedor: {selectedExpense.datosOCR.proveedor}</p>
                        <p className="text-blue-700">Monto: ${selectedExpense.datosOCR.monto}</p>
                      </div>
                      <div>
                        <p className="text-blue-700">Concepto: {selectedExpense.datosOCR.concepto}</p>
                        <p className="text-blue-700">Fecha: {selectedExpense.datosOCR.fecha}</p>
                      </div>
                    </div>
                  </div>
                )}

                {selectedExpense.archivoUrl && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Comprobante</p>
                    <img
                      src={selectedExpense.archivoUrl}
                      alt="Comprobante"
                      className="max-w-full h-64 object-cover rounded-lg border"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Expenses;