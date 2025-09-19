// Future<void> checkForUpdateAndPrompt(BuildContext context) async {
//   final response = await http.get(Uri.parse("https://yourdomain.com/update.json"));
//   if (response.statusCode != 200) return;

//   final data = json.decode(response.body);
//   final int latestVersion = data["versionCode"];
//   final String apkUrl = data["apkUrl"];
//   final String versionName = data["versionName"];
//   final String changelog = data["changelog"];

//   final info = await PackageInfo.fromPlatform();
//   final int currentVersion = int.parse(info.buildNumber);

//   if (latestVersion > currentVersion) {
//     // 👇 Show update available popup
//     showDialog(
//       context: context,
//       builder: (_) => AlertDialog(
//         title: Text("New Update Available!"),
//         content: Text("Version $versionName is available.\n\nChangelog:\n$changelog"),
//         actions: [
//           TextButton(
//             onPressed: () => Navigator.pop(context),
//             child: Text("Later"),
//           ),
//           TextButton(
//             onPressed: () {
//               Navigator.pop(context);
//               // 👇 Navigate to a separate update page
//               Navigator.push(context, MaterialPageRoute(
//                 builder: (_) => UpdatePage(apkUrl: apkUrl),
//               ));
//             },
//             child: Text("Update Now"),
//           ),
//         ],
//       ),
//     );
//   }
// }



// class UpdatePage extends StatelessWidget {
//   final String apkUrl;
//   const UpdatePage({required this.apkUrl});

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(title: Text("Update Available")),
//       body: Padding(
//         padding: const EdgeInsets.all(16.0),
//         child: Column(
//           children: [
//             Text("A new version of the app is available."),
//             SizedBox(height: 20),
//             ElevatedButton.icon(
//               icon: Icon(Icons.download),
//               label: Text("Download and Install"),
//               onPressed: () async {
//                 await downloadAndInstallApk(apkUrl);
//               },
//             ),
//           ],
//         ),
//       ),
//     );
//   }
// }


// Future<void> downloadAndInstallApk(String apkUrl) async {
//   final status = await Permission.storage.request();
//   if (!status.isGranted) return;

//   final dir = await getExternalStorageDirectory();
//   final filePath = "${dir!.path}/update.apk";

//   final dio = Dio();
//   await dio.download(apkUrl, filePath, onReceiveProgress: (rec, total) {
//     // Optional: show progress indicator
//   });

//   OpenFile.open(filePath);  // Opens APK installer
// }
