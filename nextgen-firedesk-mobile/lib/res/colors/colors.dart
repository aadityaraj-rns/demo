import 'dart:ui';


Color accentColor = "#8870E6".toColor();
// Color basicColor = "#133E87".toColor();
Color basicColor = "#f96d00".toColor();
Color lightWhiteColor = "#f2f2f2".toColor();
Color lightGreyColor = "#393e46".toColor();
Color darkGreyColor = "#222831".toColor();
Color lightbasicColor = "#4682B4".toColor();
Color skipColor = "#7B7681".toColor();
Color fillColor = "#F6F6FA".toColor();
Color redColor = "#DD3333".toColor();
Color gradientFirst = "#F1EEFF".toColor();
Color gradientSecond = "#FFFFFF".toColor();
Color checkBox = "#B5B1B9".toColor();
Color greyFontColor = "#7B7681".toColor();
Color speBackColor = "#FFD6D6".toColor();
Color basicColor2 = "#4682B4".toColor();

class AppColor{
  static const Color blackColor = Color(0xff000000);
  static const Color whiteColor = Color(0xffffffff);
}

extension ColorExtension on String {
  toColor() {
    var hexColor = replaceAll("#", "");
    if (hexColor.length == 6) {
      hexColor = "FF$hexColor";
    }
    if (hexColor.length == 8) {
      return Color(int.parse("0x$hexColor"));
    }
  }
}
