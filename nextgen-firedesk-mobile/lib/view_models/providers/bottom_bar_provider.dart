import "package:flutter/material.dart";

class BottomBarProvider extends ChangeNotifier {
  int _curentIndex = 0;

  int get currentIndex => _curentIndex;

  set setCurrentIndex(int value) {
    _curentIndex = value;
    notifyListeners();
  }
}
