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
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

interface CreateFacturaProps {
  status?: boolean;
  reservacion?: {
    id: string;
  };
  descripcion?: string;
  metodoPago?: string;
  estadoPago?: string;
  reservacionId?: string;
  totalPagado?: number;
  excedentePagado?: number;
  totalAPagar?: number;
}

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

  const generarPDF = (facturaData: any, reservacionData: any) => {
    const doc = new jsPDF();

    // Encabezado
    doc.setFontSize(20);
    doc.setTextColor(0, 0, 255);
    doc.text("✈ Explora Neiva", 105, 20, { align: "center" });
    doc.setFontSize(16);
    doc.text("Factura de Turismo", 105, 30, { align: "center" });

    // Información de la factura
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Número de Factura: ${facturaData.id || "NUEVA"}`, 14, 45);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 55);

    // Datos de la reservación
    doc.setFontSize(14);
    doc.text("Detalles de la Reservación", 14, 70);
    doc.setFontSize(12);
    doc.text(`Reservación #: ${reservacionData?.id || ""}`, 14, 80);
    doc.text(`Fecha Reservación: ${reservacionData?.fecha || ""}`, 14, 90);

    // Detalles de factura
    doc.setFontSize(14);
    doc.text("Detalles de Factura", 14, 105);

    // Tabla de detalles
    autoTable(doc, {
      startY: 115,
      head: [["Concepto", "Valor"]],
      body: [
        ["Descripción", facturaData.descripcion],
        ["Método de Pago", facturaData.metodoPago],
        ["Estado de Pago", facturaData.estadoPago],
      ],
      styles: {
        cellPadding: 5,
        fontSize: 12,
        valign: "middle",
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: "bold",
      },
    });

    // Posición después de la tabla (manejo seguro del finalY)
    let startY = 160; // Valor por defecto si no podemos obtener finalY
    try {
      // @ts-ignore - Intentamos acceder a la posición final de la tabla
      const finalY = doc.lastAutoTable.finalY;
      if (finalY && typeof finalY === "number") {
        startY = finalY + 10;
      }
    } catch (e) {
      console.warn(
        "No se pudo obtener la posición final de la tabla, usando valor por defecto"
      );
    }

    // Sección de pagos
    doc.setFontSize(12);
    doc.text(`Total a pagar: $${facturaData.totalAPagar || 0}`, 14, startY);
    doc.text(`Paga: $${facturaData.paga || 0}`, 14, startY + 10);
    doc.text(
      `Cambio devuelto: $${facturaData.cambioDevuelto || 0}`,
      14,
      startY + 20
    );

    // Firma
    doc.text("Firma del Cliente: __________________", 14, startY + 40);
    doc.text("Fecha: __________________", 140, startY + 40);

    // Pie de página
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(
      "Gracias por preferir nuestros servicios turísticos",
      105,
      doc.internal.pageSize.height - 10,
      { align: "center" }
    );

    doc.save(`factura_${facturaData.id || "nueva"}.pdf`);
  };

  const formik = useFormik({
    initialValues: {
      ...initialValues(),
      totalAPagar: 0,
      paga: 0,
      cambioDevuelto: 0,
    },
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
          totalPagado: values.totalAPagar,
          excedentePagado: values.paga,
          totalAPagar: values.cambioDevuelto,
          status: true,
          reservacion: {
            id: values.reservacionId,
          },
        };

        const response = await createFactura(facturaData);
        const reservacionSeleccionada = reservations.find(
          (r) => r.id === values.reservacionId
        );

        generarPDF(
          {
            ...response,
            ...facturaData,
          },
          reservacionSeleccionada
        );
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

        {/* Campos de valores monetarios */}

        <IonItem className="custom-item">
          <IonIcon icon={cashOutline} slot="start" className="custom-icon" />
          <IonLabel>Total a pagar</IonLabel>
          <IonInput
            type="number"
            value={formik.values.totalAPagar}
            onIonChange={(e) =>
              formik.setFieldValue("totalAPagar", e.detail.value)
            }
          />
        </IonItem>

        <IonItem className="custom-item">
          <IonIcon icon={cashOutline} slot="start" className="custom-icon" />
          <IonLabel>Paga</IonLabel>
          <IonInput
            type="number"
            value={formik.values.paga}
            onIonChange={(e) => formik.setFieldValue("paga", e.detail.value)}
          />
        </IonItem>

        <IonItem className="custom-item">
          <IonIcon icon={cashOutline} slot="start" className="custom-icon" />
          <IonLabel>Cambio devuelto</IonLabel>
          <IonInput
            type="number"
            value={formik.values.cambioDevuelto}
            onIonChange={(e) =>
              formik.setFieldValue("cambioDevuelto", e.detail.value)
            }
          />
        </IonItem>

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
