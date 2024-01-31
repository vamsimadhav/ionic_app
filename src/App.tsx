import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { useEffect } from 'react';
import { BranchDeepLinks } from 'capacitor-branch-deep-links';

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

setupIonicReact();

const App = () => {
  useEffect(() => {
    branchListener();
  }, [])

  const openWebview = async (canonical_url:string) => {
    await Browser.open({ url: canonical_url });
  };

  const branchListener = () => {
    BranchDeepLinks.addListener('init', (event) => {
      console.log(`[branch.io] Success to initialize: ${JSON.stringify(event.referringParams)}`);
      if (event.referringParams.$canonical_url) {
        console.log(`[branch.io] $canonical_url : ${event.referringParams.$canonical_url}`);
        //openWebview(event.referringParams.$canonical_url);
        Browser.open({ url: event.referringParams.$canonical_url });
      }
    });
    
    BranchDeepLinks.addListener('initError', (error) => {
      console.log(`[branch.io] Fails to initialize: ${error}`);
    });
  }

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
  </IonApp>
  );
 }

export default App;
