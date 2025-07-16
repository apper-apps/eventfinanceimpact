import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Select from "@/components/atoms/Select";
import SearchBar from "@/components/molecules/SearchBar";
import ApprovalModal from "@/components/organisms/ApprovalModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { useExpenses } from "@/hooks/useExpenses";
import { useEvents } from "@/hooks/useEvents";
import { useBudget } from "@/hooks/useBudget";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const Approvals = () => {
  const { expenses, loading: expensesLoading, error: expensesError, approveExpense, rejectExpense, loadExpenses } = useExpenses();
  const { events, loading: eventsLoading, error: eventsError, loadEvents } = useEvents();
  const { budgetCategories, loading: budgetLoading, error: budgetError, loadBudgetCategories } = useBudget();

  const [searchTerm, setSearchTerm] = useState("");
  const [eventFilter, setEventFilter] = useState("all");
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  const loading = expensesLoading || eventsLoading || budgetLoading;
  const error = expensesError || eventsError || budgetError;

  const retryLoad = () => {
    loadExpenses();
    loadEvents();
    loadBudgetCategories();
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={retryLoad} />;

  const pendingExpenses = expenses.filter(expense => expense.status === "pendiente");

  const handleApprove = async (id, comment) => {
    try {
      await approveExpense(id, comment);
      toast.success("Gasto aprobado exitosamente");
      setShowApprovalModal(false);
      setSelectedExpense(null);
    } catch (err) {
      toast.error("Error al aprobar el gasto");
    }
  };

  const handleReject = async (id, comment) => {
    try {
      await rejectExpense(id, comment);
      toast.success("Gasto rechazado");
      setShowApprovalModal(false);
      setSelectedExpense(null);
    } catch (err) {
      toast.error("Error al rechazar el gasto");
    }
  };

  const handleViewExpense = (expense) => {
    setSelectedExpense(expense);
    setShowApprovalModal(true);
  };

  const handleQuickApprove = async (expense) => {
    try {
      await approveExpense(expense.Id, "");
      toast.success("Gasto aprobado exitosamente");
    } catch (err) {
      toast.error("Error al aprobar el gasto");
    }
  };

  const handleQuickReject = async (expense) => {
    if (window.confirm("¿Estás seguro de que deseas rechazar este gasto?")) {
      try {
        await rejectExpense(expense.Id, "");
        toast.success("Gasto rechazado");
      } catch (err) {
        toast.error("Error al rechazar el gasto");
      }
    }
  };

  // Filtrar gastos pendientes
  const filteredExpenses = pendingExpenses.filter(expense => {
    const matchesSearch = expense.concepto.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.proveedor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEvent = eventFilter === "all" || expense.eventoId === eventFilter;
    
    return matchesSearch && matchesEvent;
  });

  // Calcular estadísticas
  const totalPendingAmount = filteredExpenses.reduce((sum, expense) => sum + expense.monto, 0);
  const expensesByType = filteredExpenses.reduce((acc, expense) => {
    acc[expense.tipoGasto] = (acc[expense.tipoGasto] || 0) + 1;
    return acc;
  }, {});

  const typeLabels = {
    normal: "Normal",
    nomina: "Nómina",
    anticipo: "Anticipo",
    honorarios: "Honorarios",
    viaticos: "Viáticos"
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-display text-gray-900">Aprobaciones</h1>
        <div className="flex items-center space-x-2">
          <Badge variant="warning" className="text-sm">
            {pendingExpenses.length} gastos pendientes
          </Badge>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SearchBar
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar gastos..."
            />
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
              setEventFilter("all");
            }}>
              Limpiar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Pendiente</p>
              <p className="text-2xl font-bold text-warning">
                ${totalPendingAmount.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Gastos Pendientes</p>
              <p className="text-2xl font-bold text-primary">
                {filteredExpenses.length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Eventos Activos</p>
              <p className="text-2xl font-bold text-success">
                {events.filter(e => e.status === "activo").length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Promedio por Gasto</p>
              <p className="text-2xl font-bold text-info">
                ${filteredExpenses.length > 0 ? (totalPendingAmount / filteredExpenses.length).toFixed(0) : 0}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gastos por tipo */}
      {Object.keys(expensesByType).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Gastos por Tipo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(expensesByType).map(([type, count]) => (
                <div key={type} className="text-center">
                  <p className="text-sm text-gray-600">{typeLabels[type]}</p>
                  <p className="text-xl font-bold text-primary">{count}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de gastos pendientes */}
      {filteredExpenses.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Gastos Pendientes de Aprobación</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredExpenses.map((expense) => {
                const event = events.find(e => e.Id.toString() === expense.eventoId);
                const category = budgetCategories.find(c => c.Id.toString() === expense.rubroId);
                
                return (
                  <div key={expense.Id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-gray-900">{expense.concepto}</h3>
                          <Badge variant="warning">Pendiente</Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Proveedor:</p>
                            <p className="font-medium">{expense.proveedor}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Monto:</p>
                            <p className="font-medium text-lg">${expense.monto.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Evento:</p>
                            <p className="font-medium">{event?.nombre || "No encontrado"}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Rubro:</p>
                            <p className="font-medium">{category?.nombre || "No encontrado"}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Fecha:</p>
                            <p className="font-medium">
                              {format(new Date(expense.fecha), "dd MMM yyyy", { locale: es })}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">Tipo:</p>
                            <p className="font-medium">{typeLabels[expense.tipoGasto]}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewExpense(expense)}
                        >
                          <ApperIcon name="Eye" size={16} className="mr-2" />
                          Ver Detalle
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleQuickApprove(expense)}
                        >
                          <ApperIcon name="Check" size={16} className="mr-2" />
                          Aprobar
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleQuickReject(expense)}
                        >
                          <ApperIcon name="X" size={16} className="mr-2" />
                          Rechazar
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Empty
          title="No hay gastos pendientes"
          description="Excelente! Todos los gastos han sido revisados y procesados"
          icon="CheckCircle"
        />
      )}

      {/* Modal de aprobación */}
      {showApprovalModal && selectedExpense && (
        <ApprovalModal
          expense={selectedExpense}
          onApprove={handleApprove}
          onReject={handleReject}
          onClose={() => {
            setShowApprovalModal(false);
            setSelectedExpense(null);
          }}
        />
      )}
    </div>
  );
};

export default Approvals;