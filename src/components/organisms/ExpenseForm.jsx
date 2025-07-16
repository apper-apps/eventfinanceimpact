import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import FileUpload from "@/components/molecules/FileUpload";
import Select from "@/components/atoms/Select";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";

const ExpenseForm = ({ onSubmit, events, budgetCategories, className }) => {
  const [formData, setFormData] = useState({
    eventoId: "",
    rubroId: "",
    concepto: "",
    proveedor: "",
    monto: "",
    fecha: new Date().toISOString().split("T")[0],
    tipoGasto: "normal",
    archivo: null
  });

  const [ocrData, setOcrData] = useState(null);
  const [filteredCategories, setFilteredCategories] = useState([]);

  useEffect(() => {
    if (formData.eventoId) {
      const filtered = budgetCategories.filter(cat => cat.eventoId === formData.eventoId);
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories([]);
    }
  }, [formData.eventoId, budgetCategories]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileSelect = (file) => {
    setFormData(prev => ({ ...prev, archivo: file }));
    
    // Simular OCR
    setTimeout(() => {
      const mockOcrData = {
        proveedor: "Proveedor Ejemplo S.A.",
        monto: (Math.random() * 10000 + 1000).toFixed(2),
        concepto: "Servicio de ejemplo",
        fecha: new Date().toISOString().split("T")[0]
      };
      
      setOcrData(mockOcrData);
      setFormData(prev => ({
        ...prev,
        proveedor: mockOcrData.proveedor,
        monto: mockOcrData.monto,
        concepto: mockOcrData.concepto,
        fecha: mockOcrData.fecha
      }));
      
      toast.info("Datos extraídos automáticamente del comprobante");
    }, 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.eventoId || !formData.rubroId || !formData.concepto || !formData.proveedor || !formData.monto) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    const expenseData = {
      ...formData,
      monto: parseFloat(formData.monto),
      datosOCR: ocrData,
      archivoUrl: formData.archivo ? URL.createObjectURL(formData.archivo) : null
    };

    onSubmit(expenseData);
    
    // Reset form
    setFormData({
      eventoId: "",
      rubroId: "",
      concepto: "",
      proveedor: "",
      monto: "",
      fecha: new Date().toISOString().split("T")[0],
      tipoGasto: "normal",
      archivo: null
    });
    setOcrData(null);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Registrar Nuevo Gasto</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Evento"
              type="select"
              required
              value={formData.eventoId}
              onChange={(e) => handleInputChange("eventoId", e.target.value)}
            >
              <Select
                value={formData.eventoId}
                onChange={(e) => handleInputChange("eventoId", e.target.value)}
              >
                <option value="">Seleccionar evento</option>
                {events.map(event => (
                  <option key={event.Id} value={event.Id}>{event.nombre}</option>
                ))}
              </Select>
            </FormField>

            <FormField
              label="Rubro"
              type="select"
              required
              value={formData.rubroId}
              onChange={(e) => handleInputChange("rubroId", e.target.value)}
            >
              <Select
                value={formData.rubroId}
                onChange={(e) => handleInputChange("rubroId", e.target.value)}
                disabled={!formData.eventoId}
              >
                <option value="">Seleccionar rubro</option>
                {filteredCategories.map(category => (
                  <option key={category.Id} value={category.Id}>{category.nombre}</option>
                ))}
              </Select>
            </FormField>

            <FormField
              label="Concepto"
              required
              value={formData.concepto}
              onChange={(e) => handleInputChange("concepto", e.target.value)}
              placeholder="Descripción del gasto"
            />

            <FormField
              label="Proveedor"
              required
              value={formData.proveedor}
              onChange={(e) => handleInputChange("proveedor", e.target.value)}
              placeholder="Nombre del proveedor"
            />

            <FormField
              label="Monto"
              type="number"
              required
              value={formData.monto}
              onChange={(e) => handleInputChange("monto", e.target.value)}
              placeholder="0.00"
            />

            <FormField
              label="Fecha"
              type="date"
              required
              value={formData.fecha}
              onChange={(e) => handleInputChange("fecha", e.target.value)}
            />

            <FormField
              label="Tipo de Gasto"
              type="select"
              required
              value={formData.tipoGasto}
              onChange={(e) => handleInputChange("tipoGasto", e.target.value)}
            >
              <Select
                value={formData.tipoGasto}
                onChange={(e) => handleInputChange("tipoGasto", e.target.value)}
              >
                <option value="normal">Normal</option>
                <option value="nomina">Nómina</option>
                <option value="anticipo">Anticipo</option>
                <option value="honorarios">Honorarios</option>
                <option value="viaticos">Viáticos</option>
              </Select>
            </FormField>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Comprobante</h3>
            <FileUpload onFileSelect={handleFileSelect} />
            
            {ocrData && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Datos extraídos automáticamente:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>Proveedor: {ocrData.proveedor}</li>
                  <li>Monto: ${ocrData.monto}</li>
                  <li>Concepto: {ocrData.concepto}</li>
                  <li>Fecha: {ocrData.fecha}</li>
                </ul>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline">
              Cancelar
            </Button>
            <Button type="submit">
              Registrar Gasto
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ExpenseForm;