import 'dart:io';

import 'package:firedesk/res/assets/image_path.dart';
import 'package:firedesk/res/colors/colors.dart';
import 'package:firedesk/res/fonts/font_family.dart';
import 'package:firedesk/res/styles/text_style.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_svg/svg.dart';
import 'package:gap/gap.dart';
import 'package:order_tracker_zen/order_tracker_zen.dart';

initializeScreenSize(BuildContext context,
    {double width = 411.42857142857144, double height = 867.4285714285714}) {
  ScreenUtil.init(context, designSize: Size(width, height), minTextAdapt: true);
}

Widget getVerSpace(double verSpace) {
  return SizedBox(
    height: verSpace,
  );
}

Widget getHorSpace(double horSpcae) {
  return SizedBox(
    width: horSpcae,
  );
}

Widget getAssetImage(String image,
    {double? width,
    double? height,
    Color? color,
    BoxFit boxFit = BoxFit.contain}){
  return SvgPicture.asset(
    AssetImagepath.assetImagePath + image,
    color: color,
    width: width,
    height: height,
    fit: boxFit,
  );
}

Widget getCustomFont(String text, double fontSize, Color fontColor, int maxLine,
    {String fontFamily = Font.poppinsFont,
    TextOverflow overflow = TextOverflow.ellipsis,
    TextDecoration decoration = TextDecoration.none,
    FontWeight fontWeight = FontWeight.normal,
    TextAlign textAlign = TextAlign.start,
    txtHeight}) {
  return Text(
    text,
    overflow: overflow,
    style: TextStyle(
      decoration: decoration,
      fontSize: fontSize,
      fontStyle: FontStyle.normal,
      color: fontColor,
      fontFamily: fontFamily,
      height: txtHeight,
      fontWeight: fontWeight,
    ),
    maxLines: maxLine,
    softWrap: true,
    textAlign: textAlign,
  );
}

Widget getMultilineCustomFont(String text, double fontSize, Color fontColor,
    {String fontFamily = Font.poppinsFont,
    TextOverflow overflow = TextOverflow.ellipsis,
    TextDecoration decoration = TextDecoration.none,
    FontWeight fontWeight = FontWeight.normal,
    TextAlign textAlign = TextAlign.start,
    txtHeight = 1.0}) {
  return Text(
    text,
    style: TextStyle(
        decoration: decoration,
        fontSize: fontSize,
        fontStyle: FontStyle.normal,
        color: fontColor,
        fontFamily: fontFamily,
        height: txtHeight,
        fontWeight: fontWeight),
    textAlign: textAlign,
  );
}

Widget getButton(BuildContext context, Color bgColor, String text,
    Color textColor, Function function, double fontsize,
    {bool isBorder = false,
    EdgeInsetsGeometry? insetsGeometry,
    borderColor = Colors.transparent,
    FontWeight weight = FontWeight.bold,
    bool isIcon = false,
    String? image,
    Color? imageColor,
    double? imageWidth,
    double? imageHeight,
    bool smallFont = false,
    double? buttonHeight,
    double? buttonWidth,
    List<BoxShadow> boxShadow = const [],
    EdgeInsetsGeometry? insetsGeometrypadding,
    BorderRadius? borderRadius,
    double? borderWidth}) {
  return InkWell(
    onTap: () {
      function();
    },
    child: Container(
      margin: insetsGeometry,
      padding: insetsGeometrypadding,
      width: buttonWidth,
      height: buttonHeight,
      decoration: getButtonDecoration(
        bgColor,
        borderRadius: borderRadius,
        shadow: boxShadow,
        border: (isBorder)
            ? Border.all(color: borderColor, width: borderWidth!)
            : null,
      ),
      child: Row(
        mainAxisSize: MainAxisSize.max,
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          (isIcon) ? getAssetImage(image!) : getHorSpace(0),
          (isIcon) ? getHorSpace(15.h) : getHorSpace(0),
          getCustomFont(text, fontsize, textColor, 1,
              textAlign: TextAlign.center,
              fontWeight: weight,
              fontFamily: Font.poppinsFont)
        ],
      ),
    ),
  );
}

BoxDecoration getButtonDecoration(Color bgColor,
    {BorderRadius? borderRadius,
    Border? border,
    List<BoxShadow> shadow = const [],
    DecorationImage? image}) {
  return BoxDecoration(
    color: bgColor,
    borderRadius: borderRadius,
    border: border,
    boxShadow: shadow,
    image: image,
  );
}

Widget getDefaultTextFiledWithLabelAndBorder(
  BuildContext context,
  String hintText,
  TextEditingController textEditingController, {
  bool withSuffix = false,
  int? minLines,
  int? maxLines,
  bool isPassword = false,
  bool isEnabled = true,
  bool isPrefix = false,
  Widget? prefix,
  double? height,
  String? suffixImage,
  Function? imageFunction,
  List<TextInputFormatter>? inputFormatters,
  FormFieldValidator<String>? validator,
  ValueChanged<String>? onChanged,
  double verticalPadding = 15,
  double horizontalPadding = 20,
  double suffixHeight = 24,
  double suffixWidth = 24,
  double suffixRightPadding = 18,
  int? maxLength,
  String obscuringCharacter = '•',
  GestureTapCallback? onTap,
  IconData? leadingIcon,
  bool isReadonly = false,
  TextInputType? keyboardType,
}) {
  return StatefulBuilder(
    builder: (context, setState) {
      return SizedBox(
        height: height,
        child: TextFormField(
          readOnly: isReadonly,
          onTap: onTap,
          onChanged: onChanged,
          validator: validator,
          enabled: isEnabled,
          keyboardType: keyboardType,
          inputFormatters: inputFormatters,
          minLines: minLines,
          maxLines: maxLines,
          controller: textEditingController,
          obscuringCharacter: obscuringCharacter,
          obscureText: isPassword,
          cursorColor: Colors.blueAccent,
          maxLength: maxLength,
          style: const TextStyle(
            color: Colors.black,
            fontWeight: FontWeight.w500,
            fontSize: 16.0,
          ),
          decoration: InputDecoration(
            counterText: "",
            contentPadding: EdgeInsets.symmetric(
              vertical: verticalPadding,
              horizontal: horizontalPadding,
            ),
            isDense: true,
            filled: true,
            fillColor: Colors.white,
            suffixIcon: withSuffix
                ? GestureDetector(
                    onTap: () {
                      if (imageFunction != null) {
                        imageFunction();
                      }
                    },
                    child: Padding(
                      padding: EdgeInsets.only(right: suffixRightPadding),
                      child: Image.asset(
                        suffixImage ?? "",
                        width: suffixWidth,
                        height: suffixHeight,
                      ),
                    ),
                  )
                : null,
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(
                color: Colors.grey.shade400,
                width: 1.5,
              ),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(
                color: darkGreyColor,
                width: 1.3,
              ),
            ),
            errorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(
                color: Colors.redAccent,
                width: 1.5,
              ),
            ),
            focusedErrorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(
                color: Colors.redAccent,
                width: 1.8,
              ),
            ),
            prefixIcon: leadingIcon != null
                ? Icon(
                    leadingIcon,
                    color: darkGreyColor,
                    size: 24,
                  )
                : (isPrefix ? prefix : null),
            hintText: hintText,
            hintStyle: TextStyle(
              color: Colors.grey.shade600,
              fontWeight: FontWeight.w400,
              fontSize: 15.0,
            ),
          ),
        ),
      );
    },
  );
}

Widget getDefaultTextFiledWithLabel(
  BuildContext context,
  String s,
  TextEditingController textEditingController,
  {
  bool withSufix = false,
  int? minLines,
  int? maxLines,
  bool isPass = false,
  bool isEnable = true,
  bool isprefix = false,
  Widget? prefix,
  double? height,
  String? suffiximage,
  Function? imagefunction,
  List<TextInputFormatter>? inputFormatters,
  FormFieldValidator<String>? validator,
  BoxConstraints? constraint,
  ValueChanged<String>? onChanged,
  double vertical = 15,
  double horizontal = 20,
  double suffixHeight = 24,
  double suffixWidth = 24,
  double suffixRightPad = 18,
  int? length,
  String obscuringCharacter = '•',
  GestureTapCallback? onTap,
  IconData? leadingicon,
  bool isReadonly = false,
  TextInputType? keyboardType,
}) {
  return StatefulBuilder(
    builder: (context, setState) {
      return SizedBox(
        height: height,
        child: TextFormField(
          readOnly: isReadonly,
          onTap: onTap,
          onChanged: onChanged,
          validator: validator,
          enabled: isEnable,
          keyboardType: keyboardType,
          inputFormatters: inputFormatters,
          minLines: minLines,
          maxLines: maxLines,
          controller: textEditingController,
          obscuringCharacter: obscuringCharacter,
          autofocus: false,
          obscureText: isPass,
          showCursor: true,
          cursorColor: basicColor,
          maxLength: length,
          autovalidateMode: AutovalidateMode.onUserInteraction,
          style: TextStyle(
            color: Colors.black,
            fontWeight: FontWeight.w500,
            fontSize: 15.sp,
            fontFamily: Font.poppinsFont,
          ),
          decoration: InputDecoration(
            counterText: "",
            helperText: " ",
            contentPadding: EdgeInsets.only(
              top: vertical.h,
              left: horizontal.h,
              right: horizontal.h,
              bottom: vertical.h,
            ),
            isDense: true,
            filled: true,
            fillColor: fillColor,
            suffixIconConstraints: BoxConstraints(
              maxHeight: suffixHeight.h,
            ),
            disabledBorder: OutlineInputBorder(
              borderSide: const BorderSide(color: Colors.transparent),
              borderRadius: BorderRadius.circular(22.h),
            ),
            enabledBorder: OutlineInputBorder(
              borderSide: const BorderSide(color: Colors.transparent),
              borderRadius: BorderRadius.circular(22.h),
            ),
            focusedBorder: OutlineInputBorder(
              borderSide: const BorderSide(color: Colors.transparent),
              borderRadius: BorderRadius.circular(22.h),
            ),
            border: OutlineInputBorder(
              borderSide: const BorderSide(color: Colors.transparent),
              borderRadius: BorderRadius.circular(22.h),
            ),
            errorBorder: OutlineInputBorder(
              borderSide: const BorderSide(color: Colors.transparent),
              borderRadius: BorderRadius.circular(22.h),
            ),
            focusedErrorBorder: OutlineInputBorder(
              borderSide: const BorderSide(color: Colors.transparent),
              borderRadius: BorderRadius.circular(22.h),
            ),
            suffixIcon: withSufix
                ? GestureDetector(
                    onTap: () {
                      imagefunction!();
                    },
                    child: Padding(
                      padding: EdgeInsets.symmetric(horizontal: 7.w),
                      child: getAssetImage(suffiximage.toString(),
                          width: suffixWidth.h, height: suffixHeight.h),
                    ),
                  )
                : null,
            errorStyle: TextStyle(
              color: redColor,
              fontWeight: FontWeight.w500,
              fontSize: 15.sp,
              fontFamily: Font.poppinsFont,
              height: 1.2.h,
            ),
            prefixIconConstraints: constraint,
            prefixIcon: leadingicon != null
                ? Icon(
                    leadingicon,
                    size: 20.h,
                    color: basicColor,
                  )
                : (isprefix ? prefix : null),
            hintText: s,
            hintStyle: TextStyle(
              color: Colors.grey,
              fontWeight: FontWeight.w500,
              fontSize: 15.sp,
              fontFamily: 'YourFontFamily',
            ),
          ),
        ),
      );
    },
  );
}

Widget getDefaultTextFiledWithLabel2(
  BuildContext context,
  String s,
  TextEditingController textEditingController, {
  bool withSufix = false,
  int? minLines,
  int? maxLines,
  bool isPass = false,
  bool isEnable = true,
  bool isprefix = false,
  Widget? prefix,
  double? height,
  String? suffiximage,
  Function? imagefunction,
  List<TextInputFormatter>? inputFormatters,
  FormFieldValidator<String>? validator,
  BoxConstraints? constraint,
  ValueChanged<String>? onChanged,
  double vertical = 15,
  double horizontal = 20,
  double suffixHeight = 24,
  double suffixWidth = 24,
  double suffixRightPad = 18,
  int? length,
  String obscuringCharacter = '•',
  GestureTapCallback? onTap,
  IconData? leadingicon,
  bool isReadonly = false,
  TextInputType? keyboardType,
}) {
  return StatefulBuilder(
    builder: (context, setState) {
      return SizedBox(
        height: height,
        child: TextFormField(
          readOnly: isReadonly,
          onTap: onTap,
          onChanged: onChanged,
          validator: validator,
          enabled: isEnable,
          keyboardType: keyboardType,
          inputFormatters: inputFormatters,
          minLines: minLines,
          maxLines: maxLines,
          controller: textEditingController,
          obscuringCharacter: obscuringCharacter,
          autofocus: false,
          obscureText: isPass,
          showCursor: true,
          cursorColor: basicColor,
          maxLength: length,
          autovalidateMode: AutovalidateMode.onUserInteraction,
          style: TextStyle(
            color: Colors.black,
            fontWeight: FontWeight.w500,
            fontSize: 15.sp,
            fontFamily: Font.poppinsFont,
          ),
          decoration: InputDecoration(
            counterText: "",
            helperText: " ",
            contentPadding: EdgeInsets.symmetric(
              vertical: 8.h,
              horizontal: horizontal.h,
            ),
            isDense: true,
            filled: true,
            fillColor: fillColor,
            suffixIconConstraints: BoxConstraints(
              maxHeight: suffixHeight.h,
            ),
            disabledBorder: OutlineInputBorder(
              borderSide: const BorderSide(color: Colors.transparent),
              borderRadius: BorderRadius.circular(22.h),
            ),
            enabledBorder: OutlineInputBorder(
              borderSide: const BorderSide(color: Colors.transparent),
              borderRadius: BorderRadius.circular(22.h),
            ),
            focusedBorder: OutlineInputBorder(
              borderSide: const BorderSide(color: Colors.transparent),
              borderRadius: BorderRadius.circular(22.h),
            ),
            border: OutlineInputBorder(
              borderSide: const BorderSide(color: Colors.transparent),
              borderRadius: BorderRadius.circular(22.h),
            ),
            errorBorder: OutlineInputBorder(
              borderSide: const BorderSide(color: Colors.transparent),
              borderRadius: BorderRadius.circular(22.h),
            ),
            focusedErrorBorder: OutlineInputBorder(
              borderSide: const BorderSide(color: Colors.transparent),
              borderRadius: BorderRadius.circular(22.h),
            ),
            suffixIcon: withSufix
                ? GestureDetector(
                    onTap: () {
                      imagefunction!();
                    },
                    child: Padding(
                      padding: EdgeInsets.symmetric(horizontal: 7.w),
                      child: getAssetImage(suffiximage.toString(),
                          width: suffixWidth.h, height: suffixHeight.h),
                    ),
                  )
                : null,
            errorStyle: TextStyle(
              color: redColor,
              fontWeight: FontWeight.w500,
              fontSize: 15.sp,
              fontFamily: Font.poppinsFont,
              height: 1.4.h,
            ),
            prefixIconConstraints: constraint,
            prefixIcon: leadingicon != null
                ? Icon(
                    leadingicon,
                    size: 20.h,
                    color: basicColor,
                  )
                : (isprefix ? prefix : null),
            hintText: s,
            hintStyle: TextStyle(
              color: Colors.grey,
              fontWeight: FontWeight.w500,
              fontSize: 15.sp,
              fontFamily: 'YourFontFamily',
            ),
          ),
        ),
      );
    },
  );
}

Widget IconContainer() {
  return Material(
    borderRadius: BorderRadius.circular(10.r),
    elevation: 1,
    child: Container(
      height: 110.h,
      width: 115.w,
      decoration: BoxDecoration(
          color: Colors.white,
          border: Border.all(color: basicColor, width: 0.5)),
      child: Icon(
        Icons.add_a_photo_outlined,
        color: basicColor,
        size: 50,
      ),
    ),
  );
}

Widget imageContainer(File image) {
  return Material(
    borderRadius: BorderRadius.circular(10.r),
    elevation: 2,
    child: Container(
      height: 110.h,
      width: 115.w,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(10.r),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.5),
            spreadRadius: 3,
            blurRadius: 7,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(10.r),
        child: Image.file(
          image,
          fit: BoxFit.cover,
          height: 140.h,
          width: 140.w,
        ),
      ),
    ),
  );
}

Widget getSvgImage(String image,
    {double? width,
    double? height,
    Color? color,
    BoxFit boxFit = BoxFit.contain}) {
  return SvgPicture.asset(
    AssetImagepath.assetImagePath + image,
    color: color,
    width: width,
    height: height,
    fit: boxFit,
  );
}

Widget loginHeader(String title, String description) {
  return Column(
    crossAxisAlignment: CrossAxisAlignment.center,
    children: [
      getCustomFont(title, 22, Colors.black, 1,
          fontWeight: FontWeight.w700,
          txtHeight: 1.5.h,
          textAlign: TextAlign.center),
      getVerSpace(7.h),
      getMultilineCustomFont(description, 15, Colors.black,
          fontWeight: FontWeight.w500,
          txtHeight: 1.7.h,
          textAlign: TextAlign.center)
    ],
  );
}

Widget getRichText(
    String firstText,
    Color firstColor,
    FontWeight firstWeight,
    double firstSize,
    String secondText,
    Color secondColor,
    FontWeight secondWeight,
    double secondSize,
    {TextAlign textAlign = TextAlign.center,
    double? txtHeight,
    Function? function}) {
  return RichText(
    textAlign: textAlign,
    text: TextSpan(
        text: firstText,
        style: TextStyle(
          color: firstColor,
          fontWeight: firstWeight,
          fontFamily: Font.poppinsFont,
          fontSize: firstSize,
          height: txtHeight,
        ),
        children: [
          TextSpan(
              text: secondText,
              style: TextStyle(
                  color: secondColor,
                  fontWeight: secondWeight,
                  fontFamily: Font.poppinsFont,
                  fontSize: secondSize,
                  height: txtHeight),
              recognizer: TapGestureRecognizer()
                ..onTap = () {
                  function!();
                }),
        ]),
  );
}

TextStyle buildTextStyle(BuildContext context, Color fontColor,
    FontWeight fontWeight, double fontSize,
    {double txtHeight = 1}) {
  return TextStyle(
      color: fontColor,
      fontWeight: fontWeight,
      fontFamily: Font.poppinsFont,
      fontSize: fontSize,
      height: txtHeight);
}

Widget loginAppBar(Function function) {
  return Padding(
    padding: EdgeInsets.symmetric(horizontal: 5.w),
    child: Stack(
      children: [
        GestureDetector(
          onTap: () {
            function();
          },
          child: getSvgImage("arrow_back.svg", height: 24.h, width: 24.h),
        ),
        Align(
          alignment: Alignment.topCenter,
          child:
              getAssetImage("medy_logo.png", width: 190.48.h, height: 114.28.h),
        ),
      ],
    ),
  );
}

Widget serviceTracker() {
  return OrderTrackerZen(
    // isShrinked: true,
    tracker_data: [
      TrackerData(
        title: "Service Assigned",
        date: "Sat, 8 Apr '22",
        tracker_details: [
          TrackerDetails(
            title: "Service was assigned to you ",
            datetime: "Sat, 8 Apr '22 - 17:17",
          ),
          // TrackerDetails(
          //   title: "Zenzzen Arranged A Callback Request",
          //   datetime: "Sat, 8 Apr '22 - 17:42",
          // ),
        ],
      ),
      TrackerData(
        title: "Service Under Process",
        date: "Sat, 8 Apr '22",
        tracker_details: [
          TrackerDetails(
            title: "The Service has been started",
            datetime: "Sat, 8 Apr '22 - 17:50",
          ),
        ],
      ),
      TrackerData(
        title: "Service Done",
        date: "Sat,8 Apr '22",
        tracker_details: [
          TrackerDetails(
            title: "Service has been done",
            datetime: "Sat, 8 Apr '22 - 17:51",
          ),
        ],
      ),
    ],
  );
}

Widget serviceCard(BuildContext context) {
  return Container(
    margin: EdgeInsets.symmetric(horizontal: 10.w, vertical: 10.h),
    decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(
          color: Colors.grey,
          width: 0.4,
        )),
    child: Column(
      mainAxisAlignment: MainAxisAlignment.start,
      children: [
        Gap(2.h),
        Padding(
          padding: EdgeInsets.symmetric(horizontal: 2.w, vertical: 4.h),
          child: Row(
            children: [
              Gap(6.w),
              Expanded(
                flex: 3,
                child: Container(
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(10),
                    child: Image.asset(
                      "${AssetImagepath.assetImagePath}fire5.png",
                      height: 70.h,
                      width: 120.w,
                      fit: BoxFit.cover,
                    ),
                  ),
                ),
              ),
              SizedBox(width: 10.0.w),
              Expanded(
                flex: 9,
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.start,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      "Service Title",
                      style: notificationHeadingTextSTyle,
                    ),
                    Gap(2.h),
                    Text(
                      "Service Description, Service Description, Service Description, Service Description, Service Description, Service Description, Service Description, Service Description ",
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: notificationSubHeadingTextSTyle,
                    ),
                    Gap(4.h),
                    Padding(
                      padding: EdgeInsets.only(right: 15.w),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            "Due On: 12-04-2024",
                            style: redTextSTyle,
                          ),
                          Text(
                            "view info",
                            style: blueTextSTyle2,
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              )
            ],
          ),
        ),
      ],
    ),
  );
}

// void _showAlertDialog(BuildContext context, String title, String content) {
//   showDialog(
//     context: context,
//     builder: (BuildContext context) {
//       return SizedBox(
//         width: MediaQuery.of(context).size.width * 1.3,
//         height: MediaQuery.of(context).size.height * 0.3,
//         child: AlertDialog(
//           title: Container(
//             color: Colors.black,
//             child: Text(
//               title,
//               style: blueTextSTyle1,
//             ),
//           ),
//           content: Container(
//             child: Text(content, style: normaltextstyle),
//           ),
//           backgroundColor: Colors.black,
//           actions: <Widget>[
//             Row(
//               mainAxisAlignment: MainAxisAlignment.end,
//               children: [
//                 GestureDetector(
//                   onTap: () {
//                     Navigator.pop(context);
//                   },
//                   child: Container(
//                     decoration: BoxDecoration(
//                       border: Border.all(color: Colors.white, width: 2),
//                       shape: BoxShape.circle,
//                       color: const Color.fromRGBO(47, 162, 247, 1),
//                     ),
//                     child: Center(
//                       child: Icon(
//                         Icons.close,
//                         size: 4.h,
//                         color: Colors.white,
//                       ),
//                     ),
//                   ),
//                 ),
//               ],
//             ),
//           ],
//         ),
//       );
//     },
//   );
// }

final ThemeData myThemeData = ThemeData(
  primaryColor: Colors.blue,
  hintColor: Colors.red,
);

Widget adaptiveProgressIndicator(BuildContext context) {
  return Theme(
    data: myThemeData.copyWith(platform: TargetPlatform.iOS),
    child: SizedBox(
      width: 100.0,
      height: 100.0,
      child: CupertinoActivityIndicator(
        radius: 20.0,
        color: basicColor,
      ),
    ),
  );
}
