import * as Yup from "yup";

export function initialValues() {
return {
    status: "true",
    code: "",
    title: "",
    description: "",
    type: "",
    imageUrl: "",
    location: "",
    schedule: "",
    price: null,
    contact: "",
};
}

export function validationSchema() {
return Yup.object().shape({
    code: Yup.string().required("Campo requerido"),
    title: Yup.string().required("Campo requerido"),
    description: Yup.string().required("Campo requerido"),
    type: Yup.string().required("Campo requerido"),
    imageUrl: Yup.string()
        .url("Debe ser una URL válida")
        .required("Campo requerido"),
    location: Yup.string().required("Campo requerido"),
    schedule: Yup.string().required("Campo requerido"),
    price: Yup.number()
        .required("Campo requerido")
        .min(0, "El precio debe ser mayor a 0"),
    contact: Yup.string().required("Campo requerido"),
});
}