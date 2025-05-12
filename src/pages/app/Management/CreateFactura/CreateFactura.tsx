import {
  IonPage,
  IonContent,
  IonItem,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonText,
  IonLabel,
  IonIcon,
  useIonToast,
  IonModal,
  IonSearchbar,
  IonList,
  IonAvatar,
  IonImg,
} from "@ionic/react";
import { useFormik } from "formik";
import { useHistory } from "react-router-dom";
import { initialValues, validationSchema } from "./CreateFactura.form";
import { useState, useEffect } from "react";
import CustomHeader from "../../../../components/Header/CustomHeader";
import {
  cashOutline,
  cardOutline,
  receiptOutline,
  calendarOutline,
} from "ionicons/icons";
import "./CreateFactura.scss";
import { createFactura } from "../../../../services/facturaService";
import { fetchReservations } from "../../../../services/reservationService";
import { Reservation } from "../../../../services/reservationService";

export function CreateFactura() {
  const history = useHistory();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [present] = useIonToast();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<
    Reservation[]
  >([]);
  const [showReservationSearch, setShowReservationSearch] = useState(false);
  const [reservationSearchTerm, setReservationSearchTerm] = useState("");

  // Cargar reservaciones al iniciar
  useEffect(() => {
    const loadReservations = async () => {
      try {
        const reservationsData = await fetchReservations();
        setReservations(reservationsData);
        setFilteredReservations(reservationsData);
      } catch (error) {
        present({
          message: "Error cargando reservaciones",
          duration: 3000,
          position: "top",
          color: "danger",
        });
      }
    };
    loadReservations();
  }, []);

  // Filtrar reservaciones
  useEffect(() => {
    if (reservationSearchTerm) {
      setFilteredReservations(
        reservations.filter(
          (reservation) =>
            reservation.id?.toString().includes(reservationSearchTerm) ||
            reservation.cliente
              ?.toString()
              .toLowerCase()
              .includes(reservationSearchTerm.toLowerCase()) ||
            reservation.sitioTuristico
              ?.toString()
              .toLowerCase()
              .includes(reservationSearchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredReservations(reservations);
    }
  }, [reservationSearchTerm, reservations]);

  const formik = useFormik({
    initialValues: initialValues(),
    validationSchema: validationSchema(),
    validateOnChange: false,
    onSubmit: async (values) => {
      setIsSubmitting(true);

      try {
        // Validar que los campos tengan valores válidos
        if (Number(values.reservacionId) <= 0) {
          throw new Error("Por favor seleccione una reservación válida");
        }

        const facturaData = {
          descripcion: values.descripcion,
          metodoPago: values.metodoPago,
          estadoPago: values.estadoPago,
          status: true,
          reservacion: {
            id: values.reservacionId,
          },
        };

        await createFactura(facturaData);
        setShowSuccessModal(true);
      } catch (error: any) {
        present({
          message: error.message || "Error al crear la factura",
          duration: 5000,
          position: "top",
          color: "danger",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <IonPage>
      <CustomHeader
        pageName="Generar Factura"
        showMenuButton={true}
        showLogoutButton={true}
      />

      <IonContent className="factura-page ion-padding">
        <h2>Generar Nueva Factura</h2>

        {/* Descripción */}
        <IonItem className="custom-item">
          <IonIcon icon={receiptOutline} slot="start" className="custom-icon" />
          <IonLabel>Descripción</IonLabel>
        </IonItem>
        <IonInput
          value={formik.values.descripcion}
          placeholder="Descripción del servicio"
          onIonChange={(e) =>
            formik.setFieldValue("descripcion", e.detail.value)
          }
        />
        {formik.errors.descripcion && (
          <IonText className="error">{formik.errors.descripcion}</IonText>
        )}

        {/* Método de Pago */}
        <IonItem className="custom-item" lines="full">
          <IonIcon icon={cardOutline} slot="start" className="custom-icon" />
          <IonLabel position="stacked">Método de Pago</IonLabel>
          <IonSelect
            value={formik.values.metodoPago}
            onIonChange={(e) =>
              formik.setFieldValue("metodoPago", e.detail.value)
            }
            placeholder="Seleccione método"
            interface="alert"
          >
            <IonSelectOption value="Tarjeta de crédito">
              Tarjeta de crédito
            </IonSelectOption>
            <IonSelectOption value="Efectivo">Efectivo</IonSelectOption>
            <IonSelectOption value="Transferencia">
              Transferencia bancaria
            </IonSelectOption>
            <IonSelectOption value="PSE">PSE</IonSelectOption>
          </IonSelect>
        </IonItem>
        {formik.errors.metodoPago && (
          <IonText className="error">{formik.errors.metodoPago}</IonText>
        )}

        {/* Estado de Pago */}
        <IonItem className="custom-item" lines="full">
          <IonIcon icon={cashOutline} slot="start" className="custom-icon" />
          <IonLabel position="stacked">Estado de Pago</IonLabel>
          <IonSelect
            value={formik.values.estadoPago}
            onIonChange={(e) =>
              formik.setFieldValue("estadoPago", e.detail.value)
            }
            interface="alert"
          >
            <IonSelectOption value="Pendiente">Pendiente</IonSelectOption>
            <IonSelectOption value="Pagado">Pagado</IonSelectOption>
            <IonSelectOption value="Cancelado">Cancelado</IonSelectOption>
          </IonSelect>
        </IonItem>
        {formik.errors.estadoPago && (
          <IonText className="error">{formik.errors.estadoPago}</IonText>
        )}

        {/* Selector de Reservación */}
        <IonItem
          className="custom-item"
          button
          onClick={() => setShowReservationSearch(true)}
        >
          <IonIcon
            icon={calendarOutline}
            slot="start"
            className="custom-icon"
          />
          <IonLabel>Reservación</IonLabel>
          <IonLabel
            slot="end"
            color={formik.values.reservacionId ? undefined : "medium"}
          >
            {formik.values.reservacionId
              ? `Reservación #${formik.values.reservacionId}`
              : "Seleccione reservación"}
          </IonLabel>
        </IonItem>
        {formik.errors.reservacionId && (
          <IonText className="error">{formik.errors.reservacionId}</IonText>
        )}

        {/* Modal de búsqueda de reservaciones */}
        <IonModal
          isOpen={showReservationSearch}
          onDidDismiss={() => {
            setShowReservationSearch(false);
            setReservationSearchTerm("");
          }}
          className="search-modal"
        >
          <IonContent>
            <IonSearchbar
              value={reservationSearchTerm}
              onIonChange={(e) =>
                setReservationSearchTerm(e.detail.value || "")
              }
              placeholder="Buscar reservación..."
            />
            <IonList>
              {filteredReservations.map((reservation) => (
                <IonItem
                  key={reservation.id}
                  button
                  detail={false}
                  onClick={() => {
                    formik.setFieldValue("reservacionId", reservation.id);
                    setShowReservationSearch(false);
                  }}
                >
                  <IonLabel>
                    <h2>Reservación #{reservation.id}</h2>
                    <p>
                      Cliente: {reservation.cliente?.id} - Sitio:{" "}
                      {reservation.sitioTuristico?.id}
                    </p>
                    <p>Fecha: {reservation.fecha}</p>
                  </IonLabel>
                </IonItem>
              ))}
            </IonList>
          </IonContent>
        </IonModal>

        {/* Botones */}
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
            {isSubmitting ? "Generando..." : "Generar Factura"}
          </IonButton>
        </div>
      </IonContent>

      {/* Modal de éxito */}
      <IonModal isOpen={showSuccessModal} className="success-modal">
        <div className="modal-content">
          <IonIcon
            icon={cashOutline}
            color="success"
            style={{ fontSize: "3rem", marginBottom: "16px" }}
          />
          <h2 className="modal-title">¡Factura generada!</h2>
          <p className="modal-message">
            La factura ha sido creada correctamente.
          </p>
          <div className="modal-buttons">
            <IonButton
              expand="block"
              onClick={() => {
                setShowSuccessModal(false);
                history.push("/dashboard");
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
