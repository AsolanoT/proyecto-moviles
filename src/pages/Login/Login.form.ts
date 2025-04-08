import * as Yup from "yup";

export function initialValues() {
  return {
    documentType: "",
    documentNumber: "",
    birthDate: "",
    fullName: "",
    email: "",
    phone: "",
  };
}

export function validationSchema() {
  return Yup.object().shape({
    documentType: Yup.string().required("Campo requerido"),
    documentNumber: Yup.string().required("Campo requerido"),
    birthDate: Yup.string().required("Campo requerido"),
    fullName: Yup.string().required("Campo requerido"),
    email: Yup.string()
      .email("Email no válido")
      .required("Campo requerido"),
    phone: Yup.string().required("Campo requerido"),
  });
}