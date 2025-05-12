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
  IonAvatar,
  IonLabel,
  IonMenuToggle, // Importa IonMenuToggle
} from "@ionic/react";
import {
  menuOutline,
  logOutOutline,
  busOutline,
  personCircleOutline,
  homeOutline,
  notificationsOutline,
  documentTextOutline,
  peopleOutline,
  locationOutline,
  receiptOutline,
  personOutline,
} from "ionicons/icons";
import { useHistory } from "react-router-dom";
import "./CustomHeader.scss";

interface CustomHeaderProps {
  pageName: string;
  showMenuButton?: boolean;
  showLogoutButton?: boolean;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({
  pageName,
  showMenuButton = true,
  showLogoutButton = true,
}) => {
  const history = useHistory();

  const handleLogout = () => {
    history.push("/welcome");
  };

  // Función para manejar la navegación
  const handleNavigation = (path: string) => {
    history.push(path);
    // Cierra el menú después de navegar
    const menu = document.querySelector("ion-menu");
    menu?.close();
  };

  return (
    <>
      {/* Menú Lateral */}
      <IonMenu
        contentId="main-content"
        menuId="main-menu"
        side="start"
        className="custom-menu"
      >
        <IonContent className="menu-content">
          {/* Sección de perfil */}
          <div className="profile-section">
            <IonAvatar className="profile-avatar">
              <IonIcon icon={personOutline} className="profile-icon" />
            </IonAvatar>
            <IonLabel className="profile-name">Usuario</IonLabel>
            <IonLabel className="profile-email">usuario@ejemplo.com</IonLabel>
          </div>

          {/* Items del menú - Usando IonMenuToggle */}
          <IonList className="menu-list">
            <IonMenuToggle autoHide={false}>
              <IonItem
                button
                className="menu-item"
                onClick={() => handleNavigation("/login")}
              >
                <IonIcon
                  slot="start"
                  icon={homeOutline}
                  className="menu-icon"
                />
                <IonLabel>Inicio</IonLabel>
              </IonItem>
            </IonMenuToggle>
            {/* Items del menú - Usando IonMenuToggle 
            <IonMenuToggle autoHide={false}>
              <IonItem
                button
                className="menu-item"
                onClick={() => handleNavigation("/notifications")}
              >
                <IonIcon
                  slot="start"
                  icon={notificationsOutline}
                  className="menu-icon"
                />
                <IonLabel>Notificaciones</IonLabel>
              </IonItem>
            </IonMenuToggle>
*/}

            <IonMenuToggle autoHide={false}>
              <IonItem
                button
                className="menu-item"
                onClick={() => handleNavigation("/create-reservation")}
              >
                <IonIcon
                  slot="start"
                  icon={documentTextOutline}
                  className="menu-icon"
                />
                <IonLabel>Crear Reservación</IonLabel>
              </IonItem>
            </IonMenuToggle>

            <IonMenuToggle autoHide={false}>
              <IonItem
                button
                className="menu-item"
                onClick={() => handleNavigation("/create-client")}
              >
                <IonIcon
                  slot="start"
                  icon={peopleOutline}
                  className="menu-icon"
                />
                <IonLabel>Crear Cliente</IonLabel>
              </IonItem>
            </IonMenuToggle>

            <IonMenuToggle autoHide={false}>
              <IonItem
                button
                className="menu-item"
                onClick={() => handleNavigation("/create-touristsite")}
              >
                <IonIcon
                  slot="start"
                  icon={locationOutline}
                  className="menu-icon"
                />
                <IonLabel>Crear Sitio Turístico</IonLabel>
              </IonItem>
            </IonMenuToggle>

            <IonMenuToggle autoHide={false}>
              <IonItem
                button
                className="menu-item"
                onClick={() => handleNavigation("/generate-invoice")}
              >
                <IonIcon
                  slot="start"
                  icon={receiptOutline}
                  className="menu-icon"
                />
                <IonLabel>Generar Factura</IonLabel>
              </IonItem>
            </IonMenuToggle>
          </IonList>
        </IonContent>
      </IonMenu>

      {/* Header */}
      <IonHeader className="custom-header">
        <IonToolbar>
          {showMenuButton && (
            <IonButtons slot="start">
              <IonMenuButton menu="main-menu" autoHide={false}>
                <IonIcon icon={menuOutline} />
              </IonMenuButton>
            </IonButtons>
          )}

          <div className="header-center">
            <IonIcon icon={busOutline} className="header-icon" />
            <IonTitle>{pageName}</IonTitle>
          </div>

          {showLogoutButton && (
            <IonButtons slot="end">
              <IonButton onClick={handleLogout}>
                <IonIcon icon={logOutOutline} />
              </IonButton>
              <IonButton>
                <IonIcon icon={personCircleOutline} />
              </IonButton>
            </IonButtons>
          )}
        </IonToolbar>
      </IonHeader>
    </>
  );
};

export default CustomHeader;
