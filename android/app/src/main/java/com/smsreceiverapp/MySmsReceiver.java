package com.smsreceiverapp;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.telephony.SmsMessage;
import android.util.Log;

public class MySmsReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        Bundle bundle = intent.getExtras();
        SmsMessage[] msgs = null;
        if (bundle != null) {
            try {
                Object[] pdus = (Object[]) bundle.get("pdus");
                if (pdus == null) return;

                msgs = new SmsMessage[pdus.length];
                for (int i = 0; i < msgs.length; i++) {
                    msgs[i] = SmsMessage.createFromPdu((byte[]) pdus[i]);
                    String sender = msgs[i].getOriginatingAddress();
                    String message = msgs[i].getMessageBody();
                    Log.d("SMS_RECEIVER", "From: " + sender + " Msg: " + message);

                    // 🔽 여기 수정!
                    SmsReceiverModule.sendSmsToJs(sender, message);
                }
            } catch (Exception e) {
                Log.e("SMS_RECEIVER", "Exception: " + e.getMessage());
            }
        }
    }
}