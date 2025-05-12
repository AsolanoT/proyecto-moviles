import {
  IonInput,
  IonButton,
  IonPage,
  IonContent,
  IonItem,
  IonIcon,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonText,
  IonModal,
  IonImg,
  useIonToast,
  IonLabel,
} from "@ionic/react";
import { useFormik } from "formik";
import { useHistory } from "react-router-dom";
import "./TouristSites.scss";
import { initialValues, validationSchema } from "./TouristSites.form";
import { useState, useEffect } from "react";
import {
  locationOutline,
  timeOutline,
  cashOutline,
  callOutline,
  imageOutline,
  earthOutline,
  ticketOutline,
  checkmarkOutline,
  readerOutline,
  homeOutline,
} from "ionicons/icons";
import CustomHeader from "../../../components/Header/CustomHeader";
import { createTouristSite } from "../../../services/touristSiteService";

export function TouristSite() {
  const history = useHistory();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [present] = useIonToast();

  const formik = useFormik({
    initialValues: initialValues(),
    validationSchema: validationSchema(),
    validateOnChange: false,
    onSubmit: async (values) => {
      setIsSubmitting(true);

      try {
        // Enviamos los datos al backend
        const response = await createTouristSite({
          code: values.code,
          title: values.title,
          description: values.description,
          type: values.type,
          imageUrl: values.imageUrl,
          location: values.location,
          schedule: values.schedule,
          price: values.price || 0, // Aseguramos que price tenga un valor
          contact: values.contact,
        });

        console.log("Respuesta del servidor:", response);

        // Mostrar modal de éxito
        setShowSuccessModal(true);
      } catch (error: any) {
        present({
          message: error.message || "Error al registrar el sitio turístico",
          duration: 5000,
          position: "top",
          color: "danger",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // En una aplicación real, aquí subirías la imagen a un servicio como Cloudinary
      const reader = new FileReader();
      reader.onload = (e) => {
        formik.setFieldValue("imageUrl", e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <IonPage>
      <CustomHeader
        pageName="Sitio Turístico"
        showMenuButton={true}
        showLogoutButton={true}
      />

      <IonContent class="tourist-site-registration ion-padding">
        <h2>Registro de Sitio Turístico</h2>

        {/* Código del sitio */}
        <IonItem className="custom-item">
          <IonIcon icon={ticketOutline} slot="start" className="custom-icon" />
          <IonLabel>Código del Sitio</IonLabel>
        </IonItem>
        <IonInput
          value={formik.values.code}
          placeholder="Ingrese el código único del sitio"
          onIonChange={(e) => formik.setFieldValue("code", e.detail.value)}
        />
        {formik.errors.code && (
          <IonText className="error">{formik.errors.code}</IonText>
        )}

        {/* Título */}
        <IonItem className="custom-item">
          <IonIcon icon={homeOutline} slot="start" className="custom-icon" />
          <IonLabel>Título</IonLabel>
        </IonItem>
        <IonInput
          value={formik.values.title}
          placeholder="Ingrese el título del sitio turístico"
          onIonChange={(e) => formik.setFieldValue("title", e.detail.value)}
        />
        {formik.errors.title && (
          <IonText className="error">{formik.errors.title}</IonText>
        )}

        {/* Descripción */}
        <IonItem className="custom-item">
          <IonIcon icon={readerOutline} slot="start" className="custom-icon" />
          <IonLabel>Descripción</IonLabel>
        </IonItem>
        <IonTextarea
          value={formik.values.description}
          placeholder="Ingrese una descripción detallada del sitio"
          rows={4}
          onIonChange={(e) =>
            formik.setFieldValue("description", e.detail.value)
          }
        />
        {formik.errors.description && (
          <IonText className="error">{formik.errors.description}</IonText>
        )}

        {/* Tipo de sitio */}
        <IonItem className="custom-item">
          <IonIcon icon={earthOutline} slot="start" className="custom-icon" />
          <IonLabel position="stacked">Tipo de Sitio</IonLabel>
          <IonSelect
            interface="alert"
            placeholder="Seleccione el tipo de sitio"
            value={formik.values.type}
            onIonChange={(e) => formik.setFieldValue("type", e.detail.value)}
          >
            <IonSelectOption value="lugar">Lugar turístico</IonSelectOption>
            <IonSelectOption value="museo">Museo</IonSelectOption>
            <IonSelectOption value="parque">Parque</IonSelectOption>
            <IonSelectOption value="restaurante">Restaurante</IonSelectOption>
            <IonSelectOption value="hotel">Hotel</IonSelectOption>
          </IonSelect>
        </IonItem>
        {formik.errors.type && (
          <IonText className="error">{formik.errors.type}</IonText>
        )}

        {/* Imagen */}
        <IonItem className="custom-item">
          <IonIcon icon={imageOutline} slot="start" className="custom-icon" />
          <IonLabel>URL de la Imagen</IonLabel>
        </IonItem>
        <IonInput
          type="url"
          value={formik.values.imageUrl}
          placeholder="Ingrese la URL de la imagen"
          onIonChange={(e) => formik.setFieldValue("imageUrl", e.detail.value)}
        />
        {formik.errors.imageUrl && (
          <IonText className="error">{formik.errors.imageUrl}</IonText>
        )}

        {/* Alternativa: Subir imagen desde dispositivo 
        <input
          type="file"
          id="imageUpload"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: "none" }}
        />
        <IonButton
          expand="block"
          fill="outline"
          className="upload-button"
          onClick={() => document.getElementById("imageUpload")?.click()}
        >
          <IonIcon icon={imageOutline} slot="start" />
          Subir imagen
        </IonButton>
        */}

        {/* Vista previa de la imagen */}
        {formik.values.imageUrl && (
          <IonImg
            src={formik.values.imageUrl}
            className="image-preview"
            alt="Vista previa de la imagen del sitio"
          />
        )}

        {/* Ubicación */}
        <IonItem className="custom-item">
          <IonIcon
            icon={locationOutline}
            slot="start"
            className="custom-icon"
          />
          <IonLabel>Ubicación</IonLabel>
        </IonItem>
        <IonInput
          value={formik.values.location}
          placeholder="Ingrese la ubicación del sitio"
          onIonChange={(e) => formik.setFieldValue("location", e.detail.value)}
        />
        {formik.errors.location && (
          <IonText className="error">{formik.errors.location}</IonText>
        )}

        {/* Horario */}
        <IonItem className="custom-item">
          <IonIcon icon={timeOutline} slot="start" className="custom-icon" />
          <IonLabel>Horario</IonLabel>
        </IonItem>
        <IonInput
          value={formik.values.schedule}
          placeholder="Ej: Abierto de 8:00 AM a 5:00 PM"
          onIonChange={(e) => formik.setFieldValue("schedule", e.detail.value)}
        />
        {formik.errors.schedule && (
          <IonText className="error">{formik.errors.schedule}</IonText>
        )}

        {/* Precio */}
        <IonItem className="custom-item">
          <IonIcon icon={cashOutline} slot="start" className="custom-icon" />
          <IonLabel>Precio (COP)</IonLabel>
        </IonItem>
        <IonInput
          type="number"
          value={formik.values.price}
          placeholder="Ingrese el precio de entrada"
          onIonChange={(e) => formik.setFieldValue("price", e.detail.value)}
        />
        {formik.errors.price && (
          <IonText className="error">{formik.errors.price}</IonText>
        )}

        {/* Contacto */}
        <IonItem className="custom-item">
          <IonIcon icon={callOutline} slot="start" className="custom-icon" />
          <IonLabel>Contacto</IonLabel>
        </IonItem>
        <IonInput
          value={formik.values.contact}
          placeholder="Ingrese información de contacto"
          onIonChange={(e) => formik.setFieldValue("contact", e.detail.value)}
        />
        {formik.errors.contact && (
          <IonText className="error">{formik.errors.contact}</IonText>
        )}

        {/* Botones de acción */}
        <div className="button-row">
          <IonButton
            expand="block"
            fill="outline"
            onClick={() => history.goBack()}
            disabled={isSubmitting}
          >
            Cancelar
          </IonButton>

          <IonButton
            expand="block"
            onClick={() => formik.handleSubmit()}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Procesando..." : "Registrar Sitio"}
          </IonButton>
        </div>
      </IonContent>

      {/* Modal de éxito */}
      <IonModal isOpen={showSuccessModal} className="success-modal">
        <div className="modal-content">
          <IonIcon
            icon={checkmarkOutline}
            color="success"
            style={{ fontSize: "3rem", marginBottom: "16px" }}
          />
          <h2 className="modal-title">¡Registro exitoso!</h2>
          <p className="modal-message">
            El sitio turístico ha sido registrado correctamente.
          </p>
          <div className="modal-buttons">
            <IonButton
              expand="block"
              onClick={() => {
                setShowSuccessModal(false);
                history.push("/dashboard"); // Redirigir a la lista de sitios
              }}
            >
              Aceptar
            </IonButton>
          </div>
        </div>
      </IonModal>
    </IonPage>
  );
}
