import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const ApprovalModal = ({ expense, onApprove, onReject, onClose }) => {
  const [comment, setComment] = useState("");

  if (!expense) return null;

  const handleApprove = () => {
    onApprove(expense.Id, comment);
    onClose();
  };

  const handleReject = () => {
    onReject(expense.Id, comment);
    onClose();
  };

  const statusColors = {
    pendiente: "warning",
    aprobado: "success",
    rechazado: "error"
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Aprobar Gasto</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <ApperIcon name="X" size={20} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Concepto</p>
                <p className="font-medium">{expense.concepto}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Proveedor</p>
                <p className="font-medium">{expense.proveedor}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Monto</p>
                <p className="font-medium text-lg">${expense.monto.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Fecha</p>
                <p className="font-medium">
                  {format(new Date(expense.fecha), "dd 'de' MMMM 'de' yyyy", { locale: es })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Tipo de Gasto</p>
                <p className="font-medium">{expense.tipoGasto}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Estado</p>
                <Badge variant={statusColors[expense.status]}>
                  {expense.status}
                </Badge>
              </div>
            </div>

            {expense.datosOCR && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Datos extraídos por OCR:</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-blue-700">Proveedor: {expense.datosOCR.proveedor}</p>
                    <p className="text-blue-700">Monto: ${expense.datosOCR.monto}</p>
                  </div>
                  <div>
                    <p className="text-blue-700">Concepto: {expense.datosOCR.concepto}</p>
                    <p className="text-blue-700">Fecha: {expense.datosOCR.fecha}</p>
                  </div>
                </div>
              </div>
            )}

            {expense.archivoUrl && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Comprobante</p>
                <img
                  src={expense.archivoUrl}
                  alt="Comprobante"
                  className="max-w-full h-64 object-cover rounded-lg border"
                />
              </div>
            )}

            <FormField
              label="Comentario (opcional)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Agregar un comentario..."
            />

            <div className="flex justify-end space-x-4">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button variant="danger" onClick={handleReject}>
                Rechazar
              </Button>
              <Button variant="secondary" onClick={handleApprove}>
                Aprobar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApprovalModal;