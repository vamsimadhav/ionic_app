import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCol,
  IonContent,
  IonFooter,
  IonGrid,
  IonHeader,
  IonIcon,
  IonInput,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
  useIonLoading,
  useIonRouter,
} from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { logInOutline, notifications, personCircleOutline } from 'ionicons/icons';
import FCC from '../assets/fcc.svg';
import Intro from '../components/Intro';
import { Preferences } from '@capacitor/preferences';
import { Plugins } from '@capacitor/core';
import { ActionPerformed } from '@capacitor/local-notifications';
import { BranchDeepLinks } from 'capacitor-branch-deep-links';
const { LocalNotifications } = Plugins;

const INTRO_KEY = 'intro-seen';

const Login: React.FC = () => {
  const router = useIonRouter();
  const [introSeen, setIntroSeen] = useState(true);
  const [present, dismiss] = useIonLoading();

  useEffect(() => {
    const checkStorage = async () => {
      const seen = await Preferences.get({ key: INTRO_KEY });
      setIntroSeen(seen.value === 'true');
    };
    checkStorage();
  }, []);

  const doLogin = async (event: any) => {
    event.preventDefault();
    await present('Logging in...');
    setTimeout(async () => {
      dismiss();
      router.push('/app', 'root');
    }, 2000);
  };

  const finishIntro = async () => {
    setIntroSeen(true);
    Preferences.set({ key: INTRO_KEY, value: 'true' });
  };

  const seeIntroAgain = () => {
    setIntroSeen(false);
    Preferences.remove({ key: INTRO_KEY });
  };

  const sendTestNotification = async () => {
    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            title: 'Test Notification',
            body: 'This is a test notification generated from the app itself.',
            id: 1, // Unique ID for the notification
            schedule: { at: new Date(Date.now() + 1000)},
            extra: { branch: "https://capacitor.app.link/jvgiO8eBKKb" } // Display the notification after 1 second
          }
        ]
      });
      console.log('Test notification scheduled successfully.');
    } catch (error) {
      console.error('Error scheduling test notification:', error);
    }
  };

  useEffect(() => {
    // Add event listener for localNotificationActionPerformed event
    const notificationClickedHandler = (notificationAction: ActionPerformed) => {
      console.log('Notification clicked:', notificationAction.notification.extra.branch);
      // Handle the notification click here
      BranchDeepLinks.handleUrl(notificationAction.notification.extra)
    };
    Plugins.LocalNotifications.addListener('localNotificationActionPerformed', notificationClickedHandler);

    // Clean up the event listener
    return () => {
      Plugins.LocalNotifications.removeListener('localNotificationActionPerformed', notificationClickedHandler);
    };
  }, []);

  return (
    <>
      {!introSeen ? (
        <Intro onFinish={finishIntro} />
      ) : (
        <IonPage>
          <IonHeader>
            <IonToolbar color={'success'}>
              <IonTitle>Free Code Camp</IonTitle>
            </IonToolbar>
          </IonHeader>

          <IonContent scrollY={false} className="ion-padding">
            <IonGrid fixed>
              <IonRow class="ion-justify-content-center">
                <IonCol size="12" sizeMd="8" sizeLg="6" sizeXl="4">
                  <div className="ion-text-center ion-padding">
                    <img src={FCC} alt="FCC Logo" width={'50%'} />
                  </div>
                </IonCol>
              </IonRow>

              <IonRow class="ion-justify-content-center">
                <IonCol size="12" sizeMd="8" sizeLg="6" sizeXl="4">
                  <IonCard>
                    <IonCardContent>
                      <form onSubmit={doLogin}>
                        <IonInput mode="md" fill="outline" labelPlacement="floating" label="Email" type="email" placeholder="simon@ionicacademy.com"></IonInput>
                        <IonInput mode="md" className="ion-margin-top" fill="outline" labelPlacement="floating" label="Password" type="password" placeholder="simon@ionicacademy.com"></IonInput>
                        <IonButton type="submit" expand="block" className="ion-margin-top">
                          Login
                          <IonIcon icon={logInOutline} slot="end" />
                        </IonButton>
                        <IonButton routerLink="/register" color={'secondary'} type="button" expand="block" className="ion-margin-top">
                          Create account
                          <IonIcon icon={personCircleOutline} slot="end" />
                        </IonButton>

                        <IonButton onClick={seeIntroAgain} fill="clear" size="small" color={'medium'} type="button" expand="block" className="ion-margin-top">
                          Watch intro again
                          <IonIcon icon={personCircleOutline} slot="end" />
                        </IonButton>
                      </form>
                    </IonCardContent>
                  </IonCard>
                  <IonButton onClick={sendTestNotification} color={'secondary'} type="button" expand="block" className="ion-margin-top">
                    Send Test Notification
                    <IonIcon icon={notifications} slot="end" />
                  </IonButton>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonContent>
        </IonPage>
      )}
    </>
  );
};

export default Login;
