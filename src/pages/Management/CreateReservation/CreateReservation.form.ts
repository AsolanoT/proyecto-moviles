import * as Yup from "yup";

export function initialValues() {
  return {
    fecha: new Date().toISOString(),
    hora: new Date().toISOString(),
    numeroPersonas: 0,
    observaciones: "",
    tipoReserva: "",
    status: true, // Valor por defecto
    user: {
      id: 0
    },
    cliente: {
      id: 0
    },
    sitioTuristico: {
      id: 0
    }
  };
}

export function validationSchema() {
  return Yup.object().shape({
    fecha: Yup.string().required("La fecha es requerida"),
    hora: Yup.string().required("La hora es requerida"),
    numeroPersonas: Yup.number()
      .required("El número de personas es requerido")
      .min(1, "Debe haber al menos 1 persona"),
    observaciones: Yup.string().notRequired(),
    tipoReserva: Yup.string().required("El tipo de reserva es requerido"),
    status: Yup.boolean().required("El estado es requerido"),
    cliente: Yup.object().shape({
      id: Yup.number()
        .required("El ID del cliente es requerido")
        .min(1, "ID inválido")
    }),
    sitioTuristico: Yup.object().shape({
      id: Yup.number()
        .required("El ID del sitio turístico es requerido")
        .min(1, "ID inválido")
    })
  });
}