import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import Select from "@/components/atoms/Select";
import SearchBar from "@/components/molecules/SearchBar";
import IncomeChart from "@/components/organisms/IncomeChart";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { useIncomes } from "@/hooks/useIncomes";
import { useEvents } from "@/hooks/useEvents";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const Incomes = () => {
  const { incomes, loading: incomesLoading, error: incomesError, createIncome, updateIncome, deleteIncome, loadIncomes } = useIncomes();
  const { events, loading: eventsLoading, error: eventsError, loadEvents } = useEvents();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [eventFilter, setEventFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [editingIncome, setEditingIncome] = useState(null);

  const [incomeForm, setIncomeForm] = useState({
    eventoId: "",
    fuente: "",
    monto: "",
    fecha: new Date().toISOString().split("T")[0],
    descripcion: ""
  });

  const loading = incomesLoading || eventsLoading;
  const error = incomesError || eventsError;

  const retryLoad = () => {
    loadIncomes();
    loadEvents();
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={retryLoad} />;

  const sourceLabels = {
    boleteria: "Boletería",
    barra: "Barra",
    patrocinios: "Patrocinios",
    reservados: "Reservados"
  };

  const handleCreateIncome = async (e) => {
    e.preventDefault();
    try {
      if (editingIncome) {
        await updateIncome(editingIncome.Id, {
          ...incomeForm,
          monto: parseFloat(incomeForm.monto)
        });
        setEditingIncome(null);
        toast.success("Ingreso actualizado exitosamente");
      } else {
        await createIncome({
          ...incomeForm,
          monto: parseFloat(incomeForm.monto)
        });
        toast.success("Ingreso registrado exitosamente");
      }
      
      setIncomeForm({
        eventoId: "",
        fuente: "",
        monto: "",
        fecha: new Date().toISOString().split("T")[0],
        descripcion: ""
      });
      setShowCreateForm(false);
    } catch (err) {
      toast.error("Error al procesar el ingreso");
    }
  };

  const handleEditIncome = (income) => {
    setIncomeForm({
      eventoId: income.eventoId,
      fuente: income.fuente,
      monto: income.monto.toString(),
      fecha: income.fecha,
      descripcion: income.descripcion
    });
    setEditingIncome(income);
    setShowCreateForm(true);
  };

  const handleDeleteIncome = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este ingreso?")) {
      try {
        await deleteIncome(id);
        toast.success("Ingreso eliminado exitosamente");
      } catch (err) {
        toast.error("Error al eliminar el ingreso");
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingIncome(null);
    setShowCreateForm(false);
    setIncomeForm({
      eventoId: "",
      fuente: "",
      monto: "",
      fecha: new Date().toISOString().split("T")[0],
      descripcion: ""
    });
  };

  // Filtrar ingresos
  const filteredIncomes = incomes.filter(income => {
    const matchesSearch = income.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEvent = eventFilter === "all" || income.eventoId === eventFilter;
    const matchesSource = sourceFilter === "all" || income.fuente === sourceFilter;
    
    return matchesSearch && matchesEvent && matchesSource;
  });

  // Calcular totales
  const totalIncomes = filteredIncomes.reduce((sum, income) => sum + income.monto, 0);
  const incomesBySource = filteredIncomes.reduce((acc, income) => {
    acc[income.fuente] = (acc[income.fuente] || 0) + income.monto;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-display text-gray-900">Ingresos</h1>
        <Button onClick={() => setShowCreateForm(true)}>
          <ApperIcon name="Plus" size={20} className="mr-2" />
          Registrar Ingreso
        </Button>
      </div>

      {/* Formulario de creación/edición */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingIncome ? "Editar Ingreso" : "Registrar Nuevo Ingreso"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateIncome} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Evento"
                  type="select"
                  required
                  value={incomeForm.eventoId}
                  onChange={(e) => setIncomeForm({...incomeForm, eventoId: e.target.value})}
                >
                  <Select
                    value={incomeForm.eventoId}
                    onChange={(e) => setIncomeForm({...incomeForm, eventoId: e.target.value})}
                  >
                    <option value="">Seleccionar evento</option>
                    {events.map(event => (
                      <option key={event.Id} value={event.Id.toString()}>{event.nombre}</option>
                    ))}
                  </Select>
                </FormField>

                <FormField
                  label="Fuente"
                  type="select"
                  required
                  value={incomeForm.fuente}
                  onChange={(e) => setIncomeForm({...incomeForm, fuente: e.target.value})}
                >
                  <Select
                    value={incomeForm.fuente}
                    onChange={(e) => setIncomeForm({...incomeForm, fuente: e.target.value})}
                  >
                    <option value="">Seleccionar fuente</option>
                    <option value="boleteria">Boletería</option>
                    <option value="barra">Barra</option>
                    <option value="patrocinios">Patrocinios</option>
                    <option value="reservados">Reservados</option>
                  </Select>
                </FormField>

                <FormField
                  label="Monto"
                  type="number"
                  required
                  value={incomeForm.monto}
                  onChange={(e) => setIncomeForm({...incomeForm, monto: e.target.value})}
                  placeholder="0.00"
                />

                <FormField
                  label="Fecha"
                  type="date"
                  required
                  value={incomeForm.fecha}
                  onChange={(e) => setIncomeForm({...incomeForm, fecha: e.target.value})}
                />
              </div>

              <FormField
                label="Descripción"
                value={incomeForm.descripcion}
                onChange={(e) => setIncomeForm({...incomeForm, descripcion: e.target.value})}
                placeholder="Detalles del ingreso"
              />

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={handleCancelEdit}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingIncome ? "Actualizar" : "Registrar"} Ingreso
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
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
              placeholder="Buscar ingresos..."
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
            <Select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
            >
              <option value="all">Todas las fuentes</option>
              <option value="boleteria">Boletería</option>
              <option value="barra">Barra</option>
              <option value="patrocinios">Patrocinios</option>
              <option value="reservados">Reservados</option>
            </Select>
            <Button variant="outline" onClick={() => {
              setSearchTerm("");
              setEventFilter("all");
              setSourceFilter("all");
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
              <p className="text-sm text-gray-600">Total Ingresos</p>
              <p className="text-2xl font-bold text-success">
                ${totalIncomes.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
        {Object.entries(incomesBySource).map(([source, amount]) => (
          <Card key={source}>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">{sourceLabels[source]}</p>
                <p className="text-2xl font-bold text-primary">
                  ${amount.toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Gráfica de ingresos */}
      {filteredIncomes.length > 0 && (
        <IncomeChart incomes={filteredIncomes} />
      )}

      {/* Tabla de ingresos */}
      {filteredIncomes.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Ingresos Registrados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Evento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fuente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Monto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Descripción
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredIncomes.map((income) => {
                    const event = events.find(e => e.Id.toString() === income.eventoId);
                    return (
                      <tr key={income.Id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {format(new Date(income.fecha), "dd MMM yyyy", { locale: es })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {event?.nombre || "Evento no encontrado"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {sourceLabels[income.fuente]}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-success">
                          ${income.monto.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {income.descripcion}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditIncome(income)}
                            >
                              <ApperIcon name="Edit2" size={16} />
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleDeleteIncome(income.Id)}
                            >
                              <ApperIcon name="Trash2" size={16} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Empty
          title="No hay ingresos registrados"
          description="Comienza registrando los ingresos de tus eventos para el seguimiento financiero"
          icon="TrendingUp"
          actionLabel="Registrar Ingreso"
          onAction={() => setShowCreateForm(true)}
        />
      )}
    </div>
  );
};

export default Incomes;