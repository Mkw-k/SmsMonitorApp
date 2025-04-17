import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import SmsMonitor from './components/SmsMonitor';

const App = () => {
  return (
    <SafeAreaView>
      <StatusBar barStyle="dark-content" />
      <SmsMonitor />
    </SafeAreaView>
  );
};

export default App;
