
// package com.liestung.firedesk

// import android.os.Build
// import android.os.Bundle
// import android.view.View
// import android.view.WindowInsets
// import android.view.WindowInsetsController
// import android.view.WindowManager
// import io.flutter.embedding.android.FlutterActivity

// class MainActivity : FlutterActivity() {
//     override fun onCreate(savedInstanceState: Bundle?) {
//         super.onCreate(savedInstanceState)

//         if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
//             window.setDecorFitsSystemWindows(false)
//             window.insetsController?.let { controller ->
//                 controller.hide(WindowInsets.Type.statusBars() or WindowInsets.Type.navigationBars())
//                 controller.systemBarsBehavior = WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
//             }
//         } else {
//             @Suppress("DEPRECATION")
//             window.decorView.systemUiVisibility = (
//                 View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN or
//                 View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION or
//                 View.SYSTEM_UI_FLAG_LAYOUT_STABLE
//             )
//         }
//     }
// }