import * as Yup from "yup";

export function initialValues() {
  return {
    status: true,
    documentType: "",
    documentNumber: "",
    fullName: "",
    birthDate: "",
    email: "",
    phone: ""
  };
}

export function validationSchema() {
  return Yup.object().shape({
    documentType: Yup.string().required("Tipo de documento es requerido"),
    documentNumber: Yup.string()
      .required("Número de documento es requerido")
      .matches(/^[0-9]+$/, "Solo se permiten números"),
    fullName: Yup.string()
      .required("Nombre completo es requerido")
      .min(5, "El nombre debe tener al menos 5 caracteres"),
    birthDate: Yup.date()
      .required("Fecha de nacimiento es requerida")
      .max(new Date(), "La fecha no puede ser en el futuro"),
    email: Yup.string()
      .email("Ingrese un email válido")
      .required("Email es requerido"),
    phone: Yup.string()
      .required("Teléfono es requerido")
      .matches(/^[0-9]+$/, "Solo se permiten números")
      .min(7, "El teléfono debe tener al menos 7 dígitos")
  });
}