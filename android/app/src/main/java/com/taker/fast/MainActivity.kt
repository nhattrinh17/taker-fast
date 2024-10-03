package com.taker.fast

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.ContentResolver
import android.media.AudioAttributes
import android.net.Uri
import android.os.Build
import android.os.Bundle
import androidx.core.app.NotificationCompat
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.ReactRootView

class MainActivity : ReactActivity() {

    override fun getMainComponentName(): String = "Taker"

    override fun createReactActivityDelegate(): ReactActivityDelegate {
        return object : ReactActivityDelegate(this, mainComponentName) {
            override fun createRootView(): ReactRootView {
                return ReactRootView(this@MainActivity)
            }
        }
    }

    init {
        SplashScreen.show(this)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Tạo NotificationChannel cho Android 8.0 trở lên
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channelId = "fast_id" // Thay "your_channel_id" bằng ID kênh thông báo của bạn
            val channelName = "taker_fast" // Thay "your_channel_name" bằng tên kênh thông báo
            val importance = NotificationManager.IMPORTANCE_HIGH
            val notificationChannel = NotificationChannel(channelId, channelName, importance)

            // Cấu hình âm thanh tùy chỉnh
            val soundUri = Uri.parse(ContentResolver.SCHEME_ANDROID_RESOURCE + "://" + packageName + "/raw/taker") // Thay "taker" bằng tên file âm thanh của bạn (không có phần mở rộng)
            val audioAttributes = AudioAttributes.Builder()
                .setUsage(AudioAttributes.USAGE_NOTIFICATION)
                .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
                .build()
            notificationChannel.setSound(soundUri, audioAttributes)

            // Cấu hình các thuộc tính khác cho kênh
            notificationChannel.setShowBadge(true)
            notificationChannel.description = "Description of your notification channel" // Thay phần mô tả tùy ý
            notificationChannel.enableVibration(true)
            notificationChannel.vibrationPattern = longArrayOf(400, 400)
            notificationChannel.lockscreenVisibility = NotificationCompat.VISIBILITY_PUBLIC

            // Tạo kênh thông báo
            val notificationManager = getSystemService(NotificationManager::class.java)
            notificationManager.createNotificationChannel(notificationChannel)
        }
    }
}
