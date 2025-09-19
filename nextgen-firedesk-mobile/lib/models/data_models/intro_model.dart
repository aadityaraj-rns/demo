// ignore_for_file: non_constant_identifier_names

class IntroModel {
  String title;
  String subTitle;
  String imagePath;

  IntroModel(this.title, this.subTitle, this.imagePath);
}

class AssetModel {
  String? Color;
  String? noOfServices;
  String? assetId;
  String? imagePath;

  AssetModel({this.Color , this.noOfServices, this.assetId, this.imagePath});
}
