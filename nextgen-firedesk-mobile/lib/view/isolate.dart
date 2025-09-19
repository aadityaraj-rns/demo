import 'dart:isolate';  

import 'package:firedesk/utils/print.dart';

void main() {
  createIsolate();
}

Future<void> createIsolate() async {
  ReceivePort myReceivePort = ReceivePort();

  Isolate.spawn<SendPort>(heavyComputation, myReceivePort.sendPort);

  SendPort mikeSendPort = await myReceivePort.first;

  ReceivePort mikeResponseRecievePort = ReceivePort();

  mikeSendPort.send([
    "sending message 1",
    mikeResponseRecievePort.sendPort,
  ]);

  final mikeResponse = await mikeResponseRecievePort.first;

  mikeSendPort.send([
    "sending message 1",
    mikeResponseRecievePort.sendPort,
  ]);

  final mikeResponse1 = await mikeResponseRecievePort.first;

  debugPrint("mike reponse 1 is $mikeResponse1");
}

void heavyComputation(SendPort sendPort) async {
  ReceivePort mikeRecievePort = ReceivePort();

  sendPort.send(mikeRecievePort.sendPort);

  await for (var message in mikeRecievePort) {
    if (message is List) {
      String message1 = message[0];
      SendPort mikeResponseSendPort = message[1];

      await Future.delayed(const Duration(seconds: 2));

      mikeResponseSendPort.send("main, I have processed $message1");
    }
  }
}
