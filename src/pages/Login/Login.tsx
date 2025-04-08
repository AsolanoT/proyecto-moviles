import {
  IonContent,
  IonInput,
  IonButton,
  IonItem,
  IonLabel,
  IonIcon,
  IonSelect,
  IonSelectOption,
  IonPage, // Añadido
} from "@ionic/react";
import {
  personOutline,
  mailOutline,
  callOutline,
  calendarOutline,
  cardOutline,
} from "ionicons/icons";
import { useFormik } from "formik";
import "./Login.scss";
import { company } from "../../assets";
import CustomHeader from "../../components/Header/CustomHeader";
import { initialValues, validationSchema } from "./Login.form";

const handleMenuClick = () => {
  console.log("Menú clickeado");
};

export function Login() {
  const formik = useFormik({
    initialValues: initialValues(),
    validationSchema: validationSchema(),
    validateOnChange: false,
    onSubmit: (values) => {
      console.log("Formulario enviado", values);
    },
  });

  return (
    <IonPage>
      <CustomHeader pageName="Login" />

      <IonContent class="login-page ion-padding">
        {/* Logo de la compañía 
        <div className="login-page__image">
          <img src={company.logo} alt="Entrar" />
        </div>
        */}

        <h2>Registro de personas</h2>

        {/* Campos del formulario */}
        {/* TIPO DE DOCUMENTO*/}
        <IonItem className="custom-item">
          <IonIcon icon={cardOutline} slot="start" className="custom-icon" />
          <IonLabel position="stacked">Tipo de Documento</IonLabel>
          <IonSelect
            interface="action-sheet"
            placeholder="Seleccione tipo de documento"
            value={formik.values.documentType}
            onIonChange={(e) =>
              formik.setFieldValue("documentType", e.detail.value)
            }
            className="document-type-select"
          >
            <IonSelectOption value="cc">Cédula de Ciudadanía</IonSelectOption>
            <IonSelectOption value="ti">Tarjeta de Identidad</IonSelectOption>
            <IonSelectOption value="ce">Cédula de Extranjería</IonSelectOption>
            <IonSelectOption value="passport">Pasaporte</IonSelectOption>
            <IonSelectOption value="nit">NIT</IonSelectOption>
          </IonSelect>
        </IonItem>
        {formik.errors.documentType && (
          <span className="error">{formik.errors.documentType}</span>
        )}

        {/* NUMERO DE DOCUMENTO*/}
        <IonItem className="custom-item">
          <IonIcon icon={cardOutline} slot="start" className="custom-icon" />
          <IonLabel>Número de Documento</IonLabel>
        </IonItem>
        <IonInput
          placeholder="Ingrese número de documento"
          onIonChange={(e) =>
            formik.setFieldValue("documentNumber", e.detail.value)
          }
        />
        {formik.errors.documentType && (
          <span className="error">{formik.errors.documentNumber}</span>
        )}

        {/* FECHA DE NACIMIENTO*/}
        <IonItem className="custom-item">
          <IonIcon
            icon={calendarOutline}
            slot="start"
            className="custom-icon"
          />
          <IonLabel>Fecha de Nacimiento</IonLabel>
        </IonItem>
        <IonInput
          placeholder="Ingrese su fecha de nacimiento"
          onIonChange={(e) => formik.setFieldValue("birthDate", e.detail.value)}
        />
        {formik.errors.documentType && (
          <span className="error">{formik.errors.birthDate}</span>
        )}

        {/* NOMBRE COMPLETO*/}
        <IonItem className="custom-item">
          <IonIcon icon={personOutline} slot="start" className="custom-icon" />
          <IonLabel>Nombre Completo</IonLabel>
        </IonItem>
        <IonInput
          placeholder="Ingrese su nombre completo"
          onIonChange={(e) => formik.setFieldValue("fullName", e.detail.value)}
        />
        {formik.errors.documentType && (
          <span className="error">{formik.errors.fullName}</span>
        )}

        {/* CORREO ELECTRONICO*/}
        <IonItem className="custom-item">
          <IonIcon icon={mailOutline} slot="start" className="custom-icon" />
          <IonLabel>Correo Electrónico</IonLabel>
        </IonItem>
        <IonInput
          type="email"
          placeholder="Ingrese su correo electrónico"
          onIonChange={(e) => formik.setFieldValue("email", e.detail.value)}
        />
        {formik.errors.documentType && (
          <span className="error">{formik.errors.email}</span>
        )}

        {/* NUMERO DE TELEFONO*/}
        <IonItem className="custom-item">
          <IonIcon icon={callOutline} slot="start" className="custom-icon" />
          <IonLabel>Número de Teléfono</IonLabel>
        </IonItem>
        <IonInput
          type="tel"
          placeholder="Ingrese su número de teléfono"
          onIonChange={(e) => formik.setFieldValue("phone", e.detail.value)}
        />
        {formik.errors.documentType && (
          <span className="error">{formik.errors.phone}</span>
        )}

        {/* Botón de registro */}
        <IonButton expand="block" onClick={() => formik.handleSubmit()}>
          Registrar
        </IonButton>
      </IonContent>
    </IonPage>
  );
}

{
  /*<IonHeader className="login-page__header">
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>

      <CustomHeader pageName="Login" onMenuClick={handleMenuClick} />
      <IonCard>
        <div className="login-page__image">
          <img src={image.logo} alt="Entrar" />
        </div>
      </IonCard>
      */
}
{
  /*
    <IonInput placeholder="Seleccione su tipo de documento"/>
    <span className="error">Usurio obligatorio</span>

    <IonInput placeholder="Ingrese numero de documento"/>
    <span className="error">Usurio obligatorio</span>

    <IonInput placeholder="Fecha de Nacimiento"/>
    <span className="error">Usurio obligatorio</span>

    <IonInput placeholder="Nombre Completo"/>
    <span className="error">Usurio obligatorio</span>

    <IonInput placeholder="Correo Electrónico"/>
    <span className="error">Usurio obligatorio</span>

    <IonInput placeholder="Número de Teléfono"/>
    <span className="error">Usurio obligatorio</span>
    */
}
