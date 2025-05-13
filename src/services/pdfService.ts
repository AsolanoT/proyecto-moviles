// src/services/pdfService.ts
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

interface FacturaPDFData {
  cliente: {
    nombre: string;
    documento: string;
    email: string;
  };
  factura: {
    consecutivo: string;
    fecha: string;
    metodoPago: string;
    estadoPago: string;
    descripcion: string;
    totalPagado: number;
    excedentePagado?: number;
    totalAPagar?: number;
  };
  items: Array<{
    espacio: string;
    tarifa: string;
    fechaFin: string;
    estado: string;
  }>;
}

export const generateInvoicePDF = async (data: FacturaPDFData) => {
  const doc = new jsPDF();
  
  // Agregar icono de avión simple (dibujado con texto)
  doc.setFontSize(24);
  doc.setTextColor(41, 128, 185); // Color azul
  doc.text('✈', 20, 25); // Icono de avión Unicode
  doc.setTextColor(0, 0, 0); // Volver a color negro

  // Título
  doc.setFontSize(18);
  doc.text('FACTURA DE RESERVA', 105, 20, { align: 'center' });

  // Información de la factura
  doc.setFontSize(12);
  doc.text(`Consecutivo: ${data.factura.consecutivo}`, 150, 15);
  doc.text(`Fecha: ${data.factura.fecha}`, 150, 20);

  // Información del cliente
  doc.setFontSize(14);
  doc.text('Información del Cliente', 15, 50);
  doc.setFontSize(12);
  doc.text(`Nombre: ${data.cliente.nombre}`, 15, 60);
  doc.text(`Documento: ${data.cliente.documento}`, 15, 70);
  doc.text(`Correo: ${data.cliente.email}`, 15, 80);

  // Descripción
  doc.setFontSize(14);
  doc.text('Descripción:', 15, 95);
  doc.setFontSize(12);
  const descLines = doc.splitTextToSize(data.factura.descripcion, 180);
  doc.text(descLines, 15, 105);

  // Tabla de items
  const itemsData = data.items.map(item => [
    item.espacio,
    item.tarifa,
    item.fechaFin,
    item.estado
  ]);

  (doc as any).autoTable({
    startY: 120,
    head: [['Espacio', 'Tarifa', 'Fecha Fin', 'Estado']],
    body: itemsData,
    theme: 'grid',
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255
    }
  });

  // Totales
  const finalY = (doc as any).lastAutoTable.finalY + 15;
  doc.setFontSize(14);
  doc.text('Resumen de Pagos', 15, finalY);
  doc.setFontSize(12);
  
  doc.text(`Total Pagado: $${data.factura.totalPagado.toFixed(2)}`, 15, finalY + 10);
  if (data.factura.excedentePagado) {
    doc.text(`Excedente Pagado: $${data.factura.excedentePagado.toFixed(2)}`, 15, finalY + 20);
  }
  if (data.factura.totalAPagar) {
    doc.text(`Total a pagar: $${data.factura.totalAPagar.toFixed(2)}`, 15, finalY + 30);
  }
  
  doc.text(`Método de Pago: ${data.factura.metodoPago}`, 15, finalY + 40);
  doc.text(`Estado de Pago: ${data.factura.estadoPago}`, 15, finalY + 50);

  // Firma
  doc.setFontSize(12);
  doc.text('Firma del Cliente: _________________________', 15, finalY + 70);

  // Guardar el PDF
  doc.save(`Factura_${data.factura.consecutivo}.pdf`);
};