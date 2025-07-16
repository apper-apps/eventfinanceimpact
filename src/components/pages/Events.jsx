import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import FormField from "@/components/molecules/FormField";
import Select from "@/components/atoms/Select";
import EventBudgetChart from "@/components/organisms/EventBudgetChart";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { useEvents } from "@/hooks/useEvents";
import { useBudget } from "@/hooks/useBudget";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const Events = () => {
  const { events, loading: eventsLoading, error: eventsError, createEvent, updateEvent, deleteEvent, loadEvents } = useEvents();
  const { budgetCategories, loading: budgetLoading, error: budgetError, createBudgetCategory, getBudgetByEventId, loadBudgetCategories } = useBudget();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [eventForm, setEventForm] = useState({
    nombre: "",
    fecha: "",
    tipo: "",
    lugar: "",
    presupuestoTotal: ""
  });
  const [budgetForm, setBudgetForm] = useState({
    nombre: "",
    presupuestoAsignado: ""
  });

  const loading = eventsLoading || budgetLoading;
  const error = eventsError || budgetError;

  const retryLoad = () => {
    loadEvents();
    loadBudgetCategories();
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={retryLoad} />;

  const statusColors = {
    planeado: "info",
    activo: "success",
    cerrado: "default"
  };

  const statusLabels = {
    planeado: "Planeado",
    activo: "Activo",
    cerrado: "Cerrado"
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      await createEvent({
        ...eventForm,
        presupuestoTotal: parseFloat(eventForm.presupuestoTotal)
      });
      setEventForm({
        nombre: "",
        fecha: "",
        tipo: "",
        lugar: "",
        presupuestoTotal: ""
      });
      setShowCreateForm(false);
      toast.success("Evento creado exitosamente");
    } catch (err) {
      toast.error("Error al crear el evento");
    }
  };

  const handleCreateBudgetCategory = async (e) => {
    e.preventDefault();
    try {
      await createBudgetCategory({
        ...budgetForm,
        eventoId: selectedEvent.Id.toString(),
        presupuestoAsignado: parseFloat(budgetForm.presupuestoAsignado)
      });
      setBudgetForm({
        nombre: "",
        presupuestoAsignado: ""
      });
      setShowBudgetForm(false);
      toast.success("Rubro presupuestal creado exitosamente");
    } catch (err) {
      toast.error("Error al crear el rubro presupuestal");
    }
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este evento?")) {
      try {
        await deleteEvent(id);
        toast.success("Evento eliminado exitosamente");
      } catch (err) {
        toast.error("Error al eliminar el evento");
      }
    }
  };

  const handleStatusChange = async (event, newStatus) => {
    try {
      await updateEvent(event.Id, { status: newStatus });
      toast.success("Estado actualizado exitosamente");
    } catch (err) {
      toast.error("Error al actualizar el estado");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-display text-gray-900">Eventos</h1>
        <Button onClick={() => setShowCreateForm(true)}>
          <ApperIcon name="Plus" size={20} className="mr-2" />
          Crear Evento
        </Button>
      </div>

      {/* Formulario de creación de evento */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Crear Nuevo Evento</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Nombre del Evento"
                  required
                  value={eventForm.nombre}
                  onChange={(e) => setEventForm({...eventForm, nombre: e.target.value})}
                />
                <FormField
                  label="Fecha"
                  type="date"
                  required
                  value={eventForm.fecha}
                  onChange={(e) => setEventForm({...eventForm, fecha: e.target.value})}
                />
                <FormField
                  label="Tipo"
                  required
                  value={eventForm.tipo}
                  onChange={(e) => setEventForm({...eventForm, tipo: e.target.value})}
                  placeholder="Concierto, Festival, Gala, etc."
                />
                <FormField
                  label="Lugar"
                  required
                  value={eventForm.lugar}
                  onChange={(e) => setEventForm({...eventForm, lugar: e.target.value})}
                />
                <FormField
                  label="Presupuesto Total"
                  type="number"
                  required
                  value={eventForm.presupuestoTotal}
                  onChange={(e) => setEventForm({...eventForm, presupuestoTotal: e.target.value})}
                />
              </div>
              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  Crear Evento
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lista de eventos */}
      {events.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {events.map((event) => (
            <Card key={event.Id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{event.nombre}</CardTitle>
                    <p className="text-gray-600 mt-1">{event.tipo} - {event.lugar}</p>
                  </div>
                  <Badge variant={statusColors[event.status]}>
                    {statusLabels[event.status]}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Fecha:</span>
                    <span className="font-medium">
                      {format(new Date(event.fecha), "dd 'de' MMMM 'de' yyyy", { locale: es })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Presupuesto Total:</span>
                    <span className="font-medium text-lg">
                      ${event.presupuestoTotal.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedEvent(event)}
                    >
                      <ApperIcon name="Eye" size={16} className="mr-2" />
                      Ver Detalles
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteEvent(event.Id)}
                    >
                      <ApperIcon name="Trash2" size={16} className="mr-2" />
                      Eliminar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Empty
          title="No hay eventos registrados"
          description="Comienza creando tu primer evento para gestionar presupuestos y gastos"
          icon="Calendar"
          actionLabel="Crear Evento"
          onAction={() => setShowCreateForm(true)}
        />
      )}

      {/* Modal de detalles del evento */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-display">
                  {selectedEvent.nombre}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedEvent(null)}
                >
                  <ApperIcon name="X" size={20} />
                </Button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Información del Evento</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-600">Tipo:</span>
                      <span className="ml-2 font-medium">{selectedEvent.tipo}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Lugar:</span>
                      <span className="ml-2 font-medium">{selectedEvent.lugar}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Fecha:</span>
                      <span className="ml-2 font-medium">
                        {format(new Date(selectedEvent.fecha), "dd 'de' MMMM 'de' yyyy", { locale: es })}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Estado:</span>
                      <div className="ml-2 inline-block">
                        <select
                          value={selectedEvent.status}
                          onChange={(e) => handleStatusChange(selectedEvent, e.target.value)}
                          className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                        >
                          <option value="planeado">Planeado</option>
                          <option value="activo">Activo</option>
                          <option value="cerrado">Cerrado</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-gray-900">Rubros Presupuestales</h3>
                    <Button
                      size="sm"
                      onClick={() => setShowBudgetForm(true)}
                    >
                      <ApperIcon name="Plus" size={16} className="mr-2" />
                      Agregar Rubro
                    </Button>
                  </div>
                  
                  {showBudgetForm && (
                    <form onSubmit={handleCreateBudgetCategory} className="space-y-3 mb-4 p-4 bg-gray-50 rounded-lg">
                      <FormField
                        label="Nombre del Rubro"
                        required
                        value={budgetForm.nombre}
                        onChange={(e) => setBudgetForm({...budgetForm, nombre: e.target.value})}
                        placeholder="Producción, Barras, etc."
                      />
                      <FormField
                        label="Presupuesto Asignado"
                        type="number"
                        required
                        value={budgetForm.presupuestoAsignado}
                        onChange={(e) => setBudgetForm({...budgetForm, presupuestoAsignado: e.target.value})}
                      />
                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" size="sm" onClick={() => setShowBudgetForm(false)}>
                          Cancelar
                        </Button>
                        <Button type="submit" size="sm">
                          Crear Rubro
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
              
              <EventBudgetChart
                event={selectedEvent}
                categories={getBudgetByEventId(selectedEvent.Id)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;