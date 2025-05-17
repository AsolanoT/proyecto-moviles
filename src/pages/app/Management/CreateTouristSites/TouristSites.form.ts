import { TouristSite } from "../../../../services/touristSiteService";
import * as Yup from "yup";

export function initialValues(site?: TouristSite) {
  return {
    status: site?.status ?? true,
    code: site?.code ?? "",
    title: site?.title ?? "",
    description: site?.description ?? "",
    type: site?.type ?? "lugar", // Valor por defecto
    imageUrl: site?.imageUrl ?? "",
    location: site?.location ?? "",
    schedule: site?.schedule ?? "",
    price: site?.price ?? null,
    contact: site?.contact ?? "",
  };
}

export function validationSchema() {
  return Yup.object().shape({
    code: Yup.string()
      .required("El código es requerido")
      .min(3, "El código debe tener al menos 3 caracteres")
      .max(20, "El código no puede exceder 20 caracteres"),
      
    title: Yup.string()
      .required("El título es requerido")
      .max(100, "El título no puede exceder 100 caracteres"),
      
    description: Yup.string()
      .required("La descripción es requerida")
      .max(500, "La descripción no puede exceder 500 caracteres"),
      
    type: Yup.string()
      .required("El tipo de sitio es requerido")
      .oneOf(
        ["lugar", "museo", "parque", "restaurante", "hotel"], 
        "Tipo de sitio no válido"
      ),
      
    imageUrl: Yup.string()
      .url("Debe ser una URL válida")
      .required("La URL de la imagen es requerida"),
      
    location: Yup.string()
      .required("La ubicación es requerida")
      .max(200, "La ubicación no puede exceder 200 caracteres"),
      
    schedule: Yup.string()
      .required("El horario es requerido")
      .max(50, "El horario no puede exceder 50 caracteres"),
      
    price: Yup.number()
      .required("El precio es requerido")
      .min(0, "El precio debe ser mayor o igual a 0")
      .max(1000000, "El precio no puede exceder 1,000,000")
      .nullable(),
      
    contact: Yup.string()
      .required("El contacto es requerido")
      .max(50, "El contacto no puede exceder 50 caracteres"),
  });
}