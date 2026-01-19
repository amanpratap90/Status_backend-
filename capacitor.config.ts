import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.habitflow.app',
    appName: 'HabitFlow',
    webDir: 'client/dist',
    server: {
        androidScheme: 'https'
    }
};

export default config;
