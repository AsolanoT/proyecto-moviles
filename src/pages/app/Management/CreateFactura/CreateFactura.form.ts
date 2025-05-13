import * as Yup from "yup";

export function initialValues() {
  return {
    descripcion: "",
    metodoPago: "",
    estadoPago: "Pendiente", // Valor por defecto
    reservacionId: 0,
    status: true,
    montoPagado: 0,
    totalReserva: 0
  };
}

export function validationSchema() {
  return Yup.object().shape({
    descripcion: Yup.string().required("La descripción es requerida"),
    metodoPago: Yup.string().required("El método de pago es requerido"),
    estadoPago: Yup.string().required("El estado de pago es requerido"),
    reservacionId: Yup.number()
      .required("El ID de reservación es requerido")
      .min(1, "ID inválido"),
    status: Yup.boolean().required("El estado es requerido"),
    montoPagado: Yup.number().min(0, "El monto no puede ser negativo"),
    totalReserva: Yup.number().min(0, "El total no puede ser negativo")
  });
}