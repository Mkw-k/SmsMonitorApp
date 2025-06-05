package com.smsmonitorapp

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.provider.Telephony
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Callback
import android.os.Build

class SmsReceiverModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private var smsReceiver: BroadcastReceiver? = null

    override fun getName(): String {
        return "SmsReceiverModule"
    }

    @ReactMethod
    fun startSmsReceiver() {
        if (smsReceiver == null) {
            smsReceiver = SmsReceiver()  // SmsReceiver는 기존의 BroadcastReceiver
            val filter = IntentFilter()
            filter.addAction("android.provider.Telephony.SMS_RECEIVED")
            reactApplicationContext.registerReceiver(smsReceiver, filter)
        }
    }

    @ReactMethod
    fun startForegroundService() {
        val context = reactApplicationContext
        val intent = Intent(context, SmsForegroundService::class.java)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            context.startForegroundService(intent)
        } else {
            context.startService(intent)
        }
    }

    @ReactMethod
    fun stopSmsReceiver() {
        smsReceiver?.let {
            reactApplicationContext.unregisterReceiver(it)
            smsReceiver = null
        }
    }
}

class SmsReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context?, intent: Intent?) {
        if (intent?.action == Telephony.Sms.Intents.SMS_RECEIVED_ACTION) {
            val bundle = intent.extras
            val messages = Telephony.Sms.Intents.getMessagesFromIntent(intent)
            for (smsMessage in messages) {
                val body = smsMessage.messageBody
                val sender = smsMessage.originatingAddress

                // 로그 출력 (확인용)
                android.util.Log.d("SmsReceiver", "받은 메시지: $body / 보낸 사람: $sender")

                // 여기에 서버로 전송하는 로직 추가
                sendToApi(body ?: "", sender ?: "")
            }
        }
    }

    private fun sendToApi(message: String, sender: String) {
        val client = okhttp3.OkHttpClient()
        val url = "https://your-api-endpoint.com/sms"

        val formBody = okhttp3.FormBody.Builder()
            .add("message", message)
            .add("sender", sender)
            .build()

        val request = okhttp3.Request.Builder()
            .url(url)
            .post(formBody)
            .build()

        client.newCall(request).enqueue(object : okhttp3.Callback {
            override fun onFailure(call: okhttp3.Call, e: java.io.IOException) {
                android.util.Log.e("SmsReceiver", "API 전송 실패: ${e.message}")
            }

            override fun onResponse(call: okhttp3.Call, response: okhttp3.Response) {
                if (response.isSuccessful) {
                    android.util.Log.d("SmsReceiver", "API 전송 성공")
                } else {
                    android.util.Log.e("SmsReceiver", "API 전송 실패: ${response.code}")
                }
            }
        })
    }
}
