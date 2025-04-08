import {IonContent ,IonInput, IonButton} from "@ionic/react";
import './CreatePerson.scss';

export function CreatePerson() {
  return (
    <IonContent className='create-person-page ion-padding'>
      <h2>Crear una nueva reservación!</h2>

      <IonInput placeholder='Nombre de la persona: '/>
      <span className='error'>Campo Obligatorio</span>

      <IonButton expand='block'>Crear persona</IonButton>
    </IonContent>
  )
}
