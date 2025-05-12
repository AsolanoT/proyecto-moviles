import {
  IonApp,
  IonRouterOutlet,
  IonSplitPane,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { HandlerRoutes } from "./pages/routes";
import { Redirect, Route } from "react-router-dom";
import { Welcome } from "./pages/Welcome/Welcome";
import { Login } from "./pages/Login/Login";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/**
 * Ionic Dark Mode
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import "@ionic/react/css/palettes/dark.system.css";

/* Theme variables */
import "./theme/variables.css";
import { Signup } from "./pages/Signup/Signup";
import { ForgotPassword } from "./pages/Login/ForgotPassword/ForgotPassword";
import SuccessModal from "./components/Modals/SuccessModal";
import { Dashboard } from "./pages/Dashboard/Dashboard";
import CustomHeader from "./components/Header/CustomHeader";
import { VerifyEmail } from "./pages/Login/VerifyEmail/VerifyEmail";
import { TouristSite } from "./pages/Management/CreateTouristSites/TouristSites";
import { CreateReservation } from "./pages/Management/CreateReservation/CreateReservation";
import { CreateClient } from "./pages/Management/Clients/CreateClient";

setupIonicReact();
{
  /*}
export default function App() {
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet id="main-content">
          <HandlerRoutes />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
}*/
}

export default function App() {
  return (
    <IonApp>
      <IonReactRouter>
        {/* CustomHeader debe envolver las rutas */}
        <CustomHeader
          pageName="App"
          showMenuButton={false}
          showLogoutButton={false}
        />

        <IonRouterOutlet id="main-content">
          {/* Define todas tus rutas aquí */}
          <Route exact path="/welcome" component={Welcome} />
          <Route exact path="/dashboard" component={Dashboard} />
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup-success" component={SuccessModal} />
          <Route exact path="/verify-email" component={VerifyEmail} />
          <Route exact path="/create-touristsite" component={TouristSite} />
          <Route exact path="/create-client" component={CreateClient} />
          <Route exact path="/forgot-password" component={ForgotPassword} />
          <Route
            exact
            path="/create-reservation"
            component={CreateReservation}
          />
          {/* Otras rutas... */}

          <Redirect exact from="/" to="/welcome" />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
}
