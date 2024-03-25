import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.capacitorapp',
  appName: 'Capacitor Test App',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
