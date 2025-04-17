import React, { useState, useEffect } from 'react';
import { View, Text, Button, PermissionsAndroid, Platform, StyleSheet } from 'react-native';
import SmsListener from 'react-native-android-sms-listener';
import BackgroundFetch from 'react-native-background-fetch';
import { sendSmsToApi } from '../services/api';
import { parseSms } from '../utils/smsParser';

const SmsMonitor = () => {
  const [status, setStatus] = useState('앱을 실행 중입니다...');
  const [isBackgroundRunning, setIsBackgroundRunning] = useState(false);

  useEffect(() => {
    let subscription = null;

    if (Platform.OS === 'android') {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECEIVE_SMS)
        .then((result) => {
          if (result === PermissionsAndroid.RESULTS.GRANTED) {
            setStatus('문자 수신 준비 중...');

            subscription = SmsListener.addListener((message) => {
              const parsed = parseSms(message.body);
              if (parsed.shouldSend) {
                sendSmsToApi(parsed.data);
              }
            });
          } else {
            setStatus('SMS 수신 권한이 거부되었습니다.');
          }
        })
        .catch(() => setStatus('권한 요청 중 에러가 발생했습니다.'));
    }

    return () => {
      if (subscription) {
        subscription.remove();
      }
      if (isBackgroundRunning) {
        BackgroundFetch.stop();
      }
    };
  }, [isBackgroundRunning]);

  const startBackgroundFetch = () => {
    BackgroundFetch.configure(
      {
        minimumFetchInterval: 15,
        stopOnTerminate: false,
        startOnBoot: true,
      },
      async (taskId) => {
        console.log('[BackgroundFetch] 백그라운드 작업 실행됨:', taskId);
        setStatus('백그라운드에서 작업 중...');
        BackgroundFetch.finish(taskId);
      },
      (error) => {
        console.error('[BackgroundFetch] 에러:', error);
      }
    );

    setIsBackgroundRunning(true);
  };

  const stopBackgroundFetch = () => {
    BackgroundFetch.stop();
    setIsBackgroundRunning(false);
    setStatus('문자 감지 중지됨');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.status}>{status}</Text>
      <Button
        title={isBackgroundRunning ? '문자 감지 중지' : '문자 감지 시작'}
        onPress={isBackgroundRunning ? stopBackgroundFetch : startBackgroundFetch}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  status: {
    marginBottom: 10,
  },
});

export default SmsMonitor;
