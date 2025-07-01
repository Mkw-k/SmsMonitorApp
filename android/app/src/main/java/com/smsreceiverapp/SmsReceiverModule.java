package com.smsreceiverapp;

import android.util.Log;
import androidx.annotation.NonNull;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;

public class SmsReceiverModule extends ReactContextBaseJavaModule {
    private static ReactApplicationContext reactContext;

    public SmsReceiverModule(ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }

    @Override
    public String getName() {
        return "SmsReceiver";
    }

    // 예: JS로 이벤트 전송하는 메서드
    public static void sendSmsToJs(String sender, String message) {
        WritableMap map = Arguments.createMap();
        map.putString("sender", sender);
        map.putString("message", message);

        Log.d("SMS_RECEIVER", "here is sendSmsToJs >>> " + sender + " Msg is >>> " + message);

        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("SmsReceived", map);
    }
}