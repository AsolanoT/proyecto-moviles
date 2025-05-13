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
import {
  fetchReservationById,
  fetchReservations,
} from "../../../../services/reservationService";
import { Reservation } from "../../../../services/reservationService";
import { generateInvoicePDF } from "../../../../services/pdfService";

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
  const [montoPagado, setMontoPagado] = useState(0);
  const [totalReserva, setTotalReserva] = useState(0);

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
  }, [present]); // Agrega 'present' como dependencia

  useEffect(() => {
    if (reservationSearchTerm) {
      const term = reservationSearchTerm.toLowerCase();
      setFilteredReservations(
        reservations.filter((reservation) => {
          // Buscar por ID de reservación
          if (reservation.id?.toString().includes(term)) {
            return true;
          }

          // Buscar por ID de cliente
          if (reservation.cliente?.id?.toString().includes(term)) {
            return true;
          }

          // Buscar por fecha
          if (reservation.fecha?.toLowerCase().includes(term)) {
            return true;
          }

          // Buscar por nombre de cliente (si está disponible)
          if (reservation.cliente?.nombre?.toLowerCase().includes(term)) {
            return true;
          }

          return false;
        })
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

        // Crear la factura en el backend
        const createdFactura = await createFactura(facturaData);

        // Obtener los datos completos de la reservación
        const reservacion = await fetchReservationById(values.reservacionId);

        // Datos para el PDF
        const pdfData = {
          cliente: {
            nombre: reservacion.cliente.nombre || "Cliente no especificado",
            documento: reservacion.cliente.documento || "N/A",
            email: reservacion.cliente.email || "N/A",
          },
          factura: {
            consecutivo: createdFactura.id?.toString() || "1",
            fecha: new Date().toLocaleString(),
            metodoPago: values.metodoPago,
            estadoPago: values.estadoPago,
            descripcion: values.descripcion,
            totalPagado: reservacion.total || 1200, // Usar valor de la reserva
            excedentePagado: reservacion.excedente || 850,
            totalAPagar: reservacion.pendiente || 350,
          },
          items: [
            {
              espacio: reservacion.sitioTuristico?.nombre || "A1 Camion",
              tarifa: `$${reservacion.tarifa || 1200}`,
              fechaFin: reservacion.fechaFin || new Date().toLocaleString(),
              estado: values.estadoPago,
            },
          ],
        };

        // Generar y descargar el PDF
        await generateInvoicePDF(pdfData);

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
        {/* Agrega un campo para el monto pagado en el formulario */}
        <IonItem
          className="custom-item"
          style={{ flexDirection: "column", alignItems: "flex-start" }}
        >
          <IonIcon icon={cashOutline} slot="start" className="custom-icon" />
          <IonLabel position="stacked" style={{ marginBottom: "12px" }}>
            Monto Pagado
          </IonLabel>
          <IonInput
            type="number"
            value={montoPagado}
            onIonChange={(e) => setMontoPagado(Number(e.detail.value || 0))}
            placeholder="Ingrese el monto pagado"
            style={{ marginLeft: 0, width: "100%" }}
          />
        </IonItem>

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
              placeholder="Buscar por ID, fecha o cliente..."
              debounce={300} // Agrega un pequeño retraso para mejor performance
            />
            <IonList>
              {filteredReservations.length > 0 ? (
                filteredReservations.map((reservation) => (
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
                      <p>Cliente: ID {reservation.cliente?.id}</p>
                      <p>Sitio: ID {reservation.sitioTuristico?.id}</p>
                      <p>Fecha: {reservation.fecha}</p>
                      {reservation.total && <p>Total: ${reservation.total}</p>}
                    </IonLabel>
                  </IonItem>
                ))
              ) : (
                <IonItem>
                  <IonLabel>No se encontraron reservaciones</IonLabel>
                </IonItem>
              )}
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
      <IonModal
        isOpen={showSuccessModal}
        onDidDismiss={() => {
          setShowSuccessModal(false);
          history.push("/dashboard");
        }}
        className="success-modal"
      >
        <div className="modal-content">
          <IonIcon
            icon={cashOutline}
            color="success"
            style={{ fontSize: "3rem", marginBottom: "16px" }}
          />
          <h2 className="modal-title">¡Factura generada!</h2>
          <p className="modal-message">
            La factura ha sido creada correctamente y el PDF se ha descargado.
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
