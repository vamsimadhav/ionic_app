import React from 'react';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonModal } from '@ionic/react';

interface MyModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
}

const MyModal: React.FC<MyModalProps> = ({ isOpen, onClose, data }) => {
  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Modal</IonTitle>
          <IonButton slot="end" onClick={onClose}>Close</IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </IonContent>
    </IonModal>
  );
};

export default MyModal;
