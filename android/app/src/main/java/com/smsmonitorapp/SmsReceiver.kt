package com.smsmonitorapp

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.provider.Telephony
import android.util.Log
import okhttp3.*
import java.io.IOException

class SmsReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action == Telephony.Sms.Intents.SMS_RECEIVED_ACTION) {
            val bundle: Bundle? = intent.extras
            val messages = Telephony.Sms.Intents.getMessagesFromIntent(intent)
            for (smsMessage in messages) {
                val body = smsMessage.messageBody
                val sender = smsMessage.originatingAddress

                Log.d("SmsReceiver", "받은 메시지: $body / 보낸 사람: $sender")

                // 여기에 서버로 전송 로직 추가
                sendToApi(body ?: "", sender ?: "")
            }
        }
    }

    private fun sendToApi(message: String, sender: String) {
        val client = OkHttpClient()
        val url = "https://your-api-endpoint.com/sms"

        val formBody = FormBody.Builder()
            .add("message", message)
            .add("sender", sender)
            .build()

        val request = Request.Builder()
            .url(url)
            .post(formBody)
            .build()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                Log.e("SmsReceiver", "API 전송 실패: ${e.message}")
            }

            override fun onResponse(call: Call, response: Response) {
                if (response.isSuccessful) {
                    Log.d("SmsReceiver", "API 전송 성공")
                } else {
                    Log.e("SmsReceiver", "API 전송 실패: ${response.code}")
                }
            }
        })
    }
}
