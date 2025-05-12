import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonImg,
  IonButtons,
  IonButton,
  IonIcon,
  IonRefresher,
  IonRefresherContent,
  useIonToast,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/react";
import {
  personCircleOutline,
  searchOutline,
  chevronDownOutline,
  chevronUpOutline,
} from "ionicons/icons";
import "./Dashboard.scss";
import { RefresherEventDetail } from "@ionic/core";
import { useState } from "react";
import CustomHeader from "../../components/Header/CustomHeader";

interface TouristSpot {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  location: string;
  details?: {
    hours?: string;
    price?: string;
    contact?: string;
  };
}

export const Dashboard: React.FC = () => {
  const [present] = useIonToast();
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [spots, setSpots] = useState<TouristSpot[]>([
    {
      id: "1",
      title: "Parque Santander",
      description:
        "Plaza principal de Neiva, centro histórico y cultural de la ciudad con más de 100 años de historia.",
      imageUrl:
        "https://api.a0.dev/assets/image?text=neiva%20colombia%20parque%20santander%20plaza%20principal&aspect=16:9",
      location: "Centro de Neiva",
      details: {
        hours: "Abierto 24 horas",
        price: "Gratis",
        contact: "Oficina de Turismo: +57 123456789",
      },
    },
    // ... otros spots con la misma estructura
  ]);

  const handleRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    setTimeout(() => {
      present({
        message: "Datos actualizados",
        duration: 1500,
        position: "top",
      });
      event.detail.complete();
    }, 1500);
  };

  const toggleCardExpand = (id: string) => {
    setExpandedCardId(expandedCardId === id ? null : id);
  };

  function openReservationModal(spot: TouristSpot): void {
    throw new Error("Function not implemented.");
  }

  return (
    <IonPage>
      <CustomHeader
        pageName="Dashboard"
        showMenuButton={true}
        showLogoutButton={true}
      />

      <IonContent fullscreen className="dashboard-page">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <div className="welcome-section">
          <h2>Bienvenido a Neiva</h2>
          <p>Descubre los mejores lugares turísticos de nuestra ciudad</p>
        </div>

        <div className="spots-container">
          <h3 className="section-title">Destinos Populares</h3>

          {spots.map((spot) => (
            <IonCard
              key={spot.id}
              className={`spot-card ${
                expandedCardId === spot.id ? "expanded" : ""
              }`}
            >
              <IonImg src={spot.imageUrl} className="spot-image" />
              <div className="spot-gradient">
                <IonCardHeader>
                  <IonCardSubtitle>{spot.location}</IonCardSubtitle>
                  <IonCardTitle>{spot.title}</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <p className="short-description">
                    {spot.description.substring(0, 60)}...
                  </p>

                  {expandedCardId === spot.id && (
                    <div className="expanded-details">
                      <p>{spot.description}</p>

                      <IonGrid>
                        <IonRow>
                          <IonCol size="6">
                            <div className="detail-item">
                              <strong>Horario:</strong>
                              <span>{spot.details?.hours}</span>
                            </div>
                          </IonCol>
                          <IonCol size="6">
                            <div className="detail-item">
                              <strong>Precio:</strong>
                              <span>{spot.details?.price}</span>
                            </div>
                          </IonCol>
                          <IonCol size="12">
                            <div className="detail-item">
                              <strong>Contacto:</strong>
                              <span>{spot.details?.contact}</span>
                            </div>
                          </IonCol>
                        </IonRow>
                      </IonGrid>
                      <IonButton
                        fill="solid"
                        color="primary"
                        onClick={() => openReservationModal(spot)}
                        className="reservation-button"
                      >
                        Registrar Reserva
                      </IonButton>
                    </div>
                  )}

                  <IonButton
                    fill="clear"
                    className="details-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCardExpand(spot.id);
                    }}
                  >
                    {expandedCardId === spot.id ? (
                      <>
                        <IonIcon icon={chevronUpOutline} slot="end" />
                        Ver menos
                      </>
                    ) : (
                      <>
                        <IonIcon icon={chevronDownOutline} slot="end" />
                        Ver detalles
                      </>
                    )}
                  </IonButton>
                </IonCardContent>
              </div>
            </IonCard>
          ))}
        </div>
      </IonContent>
    </IonPage>
  );
};
