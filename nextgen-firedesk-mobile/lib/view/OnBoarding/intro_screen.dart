import "package:firedesk/models/data_models/intro_model.dart";
import "package:firedesk/res/colors/colors.dart";
import "package:firedesk/res/routes/app_routes.dart";
import "package:firedesk/widgets/widget_utils.dart";
import "package:flutter/material.dart";
import "package:flutter_screenutil/flutter_screenutil.dart";

class IntroScreen extends StatefulWidget {
  const IntroScreen({super.key});

  @override
  State<IntroScreen> createState() => _IntroScreenState();
}

class _IntroScreenState extends State<IntroScreen> {
  late PageController controller;
  static List<IntroModel> introLists = [
    IntroModel("Title1", "sub title 1", "intro1.png"),
    IntroModel("Title2", "sub title 2", "intro2.png"),
    // IntroModel("Title3", "sub title 3", "intro3.png"),
  ];
  int currentPage = 0;

  @override
  void initState() {
    super.initState();
    controller = PageController(initialPage: 0);
    controller.addListener(() {
      setState(() {
        currentPage = controller.page!.round();
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    initializeScreenSize(context);

    return Scaffold(
      backgroundColor: Colors.white,
      body: Stack(
        children: [
          PageView.builder(
            physics: const BouncingScrollPhysics(),
            controller: controller,
            itemCount: introLists.length,
            itemBuilder: (context, index) {
              IntroModel modalIntro = introLists[index];
              return Container(
                width: double.infinity,
                height: double.infinity,
                decoration: BoxDecoration(
                  image: DecorationImage(
                    image: AssetImage(
                        "assets/images/intro/${modalIntro.imagePath}"),
                    fit: BoxFit.cover,
                  ),
                ),
              );
            },
          ),
          buildNextButton(),
        ],
      ),
    );
  }

  Align buildNextButton() {
    return Align(
      alignment: Alignment.bottomRight,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: GestureDetector(
          onTap: () {
            if (currentPage == introLists.length - 1) {
              Navigator.pushReplacementNamed(context, AppRoutes.loginscreen);
            } else {
              controller.nextPage(
                duration: const Duration(milliseconds: 500),
                curve: Curves.ease,
              );
            }
          },
          child: Container(
            padding: EdgeInsets.symmetric(vertical: 5.w, horizontal: 20.w),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(10.h),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                getCustomFont(
                  currentPage == introLists.length - 1 ? "Get Started" : "Next",
                  18.sp,
                  basicColor,
                  1,
                  fontWeight: FontWeight.w700,
                ),
                const SizedBox(
                  width: 5,
                ),
                Icon(
                  Icons.keyboard_double_arrow_right,
                  color: basicColor,
                )
              ],
            ),
          ),
        ),
      ),
    );
  }
}
