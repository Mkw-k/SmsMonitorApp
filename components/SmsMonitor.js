import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Switch,
  PermissionsAndroid,
  Platform,
  StyleSheet,
} from 'react-native';
import SmsListener from 'react-native-android-sms-listener';
import { sendSmsToApi } from '../services/api';
import { parseSms } from '../utils/smsParser';

// 권한 요청 함수
const requestSmsPermission = async () => {
  try {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
      PermissionsAndroid.PERMISSIONS.READ_SMS,
    ]);
    return (
      granted['android.permission.RECEIVE_SMS'] === PermissionsAndroid.RESULTS.GRANTED
    );
  } catch (err) {
    console.warn('SMS 권한 요청 실패:', err);
    return false;
  }
};

const SmsMonitor = () => {
  const [status, setStatus] = useState('앱을 실행 중입니다...');
  const [isMonitoring, setIsMonitoring] = useState(false); // 상태 관리 (모니터링 활성화/비활성화)

  useEffect(() => {
    let subscription = null;

    const initSmsListener = async () => {
      if (Platform.OS === 'android') {
        const hasPermission = await requestSmsPermission();
        if (hasPermission) {
          if (isMonitoring) {
            setStatus('백그라운드 모니터링 중...');
            subscription = SmsListener.addListener((message) => {
              const parsed = parseSms(message.body);
              if (parsed.shouldSend) {
                sendSmsToApi(parsed.data);
              }
            });
          } else {
            setStatus('모니터링 기능이 비활성 중입니다.');
          }
        } else {
          setStatus('SMS 수신 권한이 거부되었습니다.');
        }
      } else {
        setStatus('이 기능은 Android에서만 지원됩니다.');
      }
    };

    initSmsListener();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [isMonitoring]); // isMonitoring 상태 변경에 따라 재실행

  const toggleMonitoring = (value) => {
    setIsMonitoring(value); // 스위치 상태에 맞게 모니터링 활성화/비활성화
  };

  return (
    <View style={styles.container}>
      <Text style={styles.status}>{status}</Text>
      <View style={styles.switchContainer}>
        <Text>백그라운드 모니터링</Text>
        <Switch
          value={isMonitoring}
          onValueChange={toggleMonitoring}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  status: {
    marginBottom: 10,
    fontSize: 16,
  },
  switchContainer: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default SmsMonitor;
