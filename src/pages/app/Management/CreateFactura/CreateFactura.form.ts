import * as Yup from "yup";
import { Factura } from "../../../../services/facturaService";

export function initialValues(factura?: Factura) {
  return {
    descripcion: factura?.descripcion ?? "",
    metodoPago: factura?.metodoPago ?? "",
    estadoPago: factura?.estadoPago ?? "",
    reservacionId: factura?.reservacion.id ?? 0,
    status: factura?.status ?? true,
    montoTotal: factura?.montoTotal ?? 0
  };
}

export function validationSchema() {
  return Yup.object().shape({
    descripcion: Yup.string()
      .required("La descripción es requerida")
      .max(500, "La descripción no puede exceder 500 caracteres"),
    metodoPago: Yup.string()
      .required("El método de pago es requerido")
      .oneOf(
        ["Tarjeta de crédito", "Efectivo", "Transferencia", "PSE"],
        "Método de pago no válido"
      ),
    estadoPago: Yup.string()
      .required("El estado de pago es requerido")
      .oneOf(
        ["Pendiente", "Pagado", "Cancelado"],
        "Estado de pago no válido"
      ),
    reservacionId: Yup.number()
      .required("Debe seleccionar una reservación")
      .min(1, "ID inválido"),
    status: Yup.boolean().required("El estado es requerido"),
    montoTotal: Yup.number()
      .required("El monto total es requerido")
      .min(0, "El monto no puede ser negativo")
  });
}