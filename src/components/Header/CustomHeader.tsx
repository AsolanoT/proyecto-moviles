import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonMenu,
  IonContent,
  IonList,
  IonItem,
  IonMenuButton,
} from "@ionic/react";
import {
  menuOutline,
  logOutOutline,
  airplaneOutline,
  busOutline,
} from "ionicons/icons";
import { useHistory } from "react-router-dom";
import "./CustomHeader.scss";

interface CustomHeaderProps {
  pageName: string;
  iconType?: "airplane" | "bus";
}

const CustomHeader: React.FC<CustomHeaderProps> = ({
  pageName,
  iconType = "airplane",
}) => {
  const history = useHistory();

  const handleLogout = () => {
    history.push("/login");
  };

  const centerIcon = iconType === "bus" ? busOutline : airplaneOutline;

  return (
    <>
      {/* Menú Lateral */}
      <IonMenu contentId="main-content" side="start">
        <IonContent>
          <IonList>
            <IonItem routerLink="/login" routerDirection="root">
              Login
            </IonItem>
            <IonItem routerLink="/create-person" routerDirection="root">
              Crear Persona
            </IonItem>
            <IonItem routerLink="/create-reservation" routerDirection="root">
              Crear Reserva
            </IonItem>
          </IonList>
        </IonContent>
      </IonMenu>

      {/* Header */}
      <IonHeader className="custom-header">
        <IonToolbar>
          {/* Botón de menú que activará el panel lateral */}
          <IonButtons slot="start">
            <IonMenuButton autoHide={false}>
              <IonIcon icon={menuOutline} />
            </IonMenuButton>
          </IonButtons>

          {/* Parte central - Icono + Nombre de página */}
          <div className="header-center">
            <IonIcon icon={centerIcon} className="header-icon" />
            <IonTitle>{pageName}</IonTitle>
          </div>

          {/* Parte derecha - Logout */}
          <IonButtons slot="end">
            <IonButton onClick={handleLogout}>
              <IonIcon icon={logOutOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
    </>
  );
};

export default CustomHeader;
