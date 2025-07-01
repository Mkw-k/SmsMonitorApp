import React, { useEffect } from 'react';
import { NativeEventEmitter, NativeModules, PermissionsAndroid, Platform, Text, View } from 'react-native';

const { SmsReceiver } = NativeModules;

export default function App() {
  useEffect(() => {
    const requestPermissions = async () => {
      if (Platform.OS === 'android') {
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECEIVE_SMS);
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_SMS);
      }
    };

    requestPermissions();

    const eventEmitter = new NativeEventEmitter(SmsReceiver);
    const subscription = eventEmitter.addListener('SmsReceived', (event) => {
      console.log('SMS Received:', event);
      // 여기서 API 서버로 전송
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text>SMS 수신 대기 중...</Text>
    </View>
  );
}