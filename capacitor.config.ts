import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic_vamsi.capacitor_app',
  appName: 'myApp',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
