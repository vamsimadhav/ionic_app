import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { useEffect } from 'react';
import { BranchDeepLinks } from'capacitor-branch-deep-links';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import Login from './pages/Login';
import Register from './pages/Register';
import Menu from './pages/Menu';
import { Browser } from '@capacitor/browser';
import MyModal from './assets/MyModal'
import React, { useState } from 'react';

import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';


setupIonicReact();

const App = () => {
  // useEffect(() => {
  //   branchListener();
  // }, [])

  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState<any>(null);

  const openWebview = async (canonical_url:string) => {
    await Browser.open({ url: canonical_url });
  };

  useEffect(() => {
    const branchListener = () => {
      BranchDeepLinks.addListener('init', (event) => {
        console.log(`[branch.io] Success to initialize: ${JSON.stringify(event.referringParams)}`);
        if (event.referringParams) {
          console.log(`[branch.io] $canonical_url : ${event.referringParams.$canonical_url}`);
          //Browser.open({ url: event.referringParams.$canonical_url });
          openWebview(JSON.stringify(event.referringParams));
        }
        // Set the data and show the modal
        setModalData(event.referringParams);
        setShowModal(true);
      });
    };

    branchListener();
    initializePushNotifications();
  }, []);

  const initializePushNotifications = () => {
    PushNotifications.requestPermissions().then(result => {
      if (result.receive === 'granted') {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        // Handle permission not granted
        console.log('Push notification permissions not granted');
      }
    });

    // Push Notifications listeners
    PushNotifications.addListener('registration', (token: Token) => {
      console.log('Push registration success, token: ' + token.value);
      // Handle token registration, send to server, etc.
    });

    PushNotifications.addListener('registrationError', (error: any) => {
      console.error('Error on registration: ' + JSON.stringify(error));
    });

    PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
      console.log('Push received: ' + JSON.stringify(notification));
      // Handle received push notification, show alert or process data
    });

    PushNotifications.addListener('pushNotificationActionPerformed', (notification: ActionPerformed) => {
      console.log('Push action performed: ' + JSON.stringify(notification));
      // Handle action performed on notification (e.g., open specific page)
    });
  };

 return (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/">
          <Login />
        </Route>
        <Route component={Register} path="/register" exact />
        <Route component={Menu} path="/app" />
      </IonRouterOutlet>
    </IonReactRouter>
    <MyModal isOpen={showModal} onClose={() => setShowModal(false)} data={modalData} />
  </IonApp>
  );
 }

export default App;
