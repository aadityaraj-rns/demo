import 'package:firedesk/res/colors/colors.dart';
import 'package:firedesk/res/styles/text_style.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class PrivacyPolicyScreen extends StatelessWidget {
  const PrivacyPolicyScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: PreferredSize(
        preferredSize: Size.fromHeight(45.h),
        child: Material(
          elevation: 2,
          child: AppBar(
            backgroundColor: basicColor,
            automaticallyImplyLeading: false,
            title: Text(
              "Privacy Policy",
              style: appBarTextSTyle,
            ),
            centerTitle: true,
          ),
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                "Leistung Technologies (“us”, “we”, or “our”) operates https://www.firedesk.in. This page informs you of our policies regarding the collection, use, and disclosure of Personal Information we receive from users of the site.",
                style: descriptionTextStyle,
              ),
              SizedBox(
                height: 15.h,
              ),
              Text(
                "Information Collection And Use:",
                style: headingTextStyle1,
                textAlign: TextAlign.left,
              ),
              SizedBox(
                height: 2.h,
              ),
              Text(
                "While using our Site, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you. Personally identifiable information may include but is not limited to your name, shipping address, email address, and telephone number, and demographic information, such as your age, gender, hometown, and interests that you voluntarily give to us. You are under no obligation to provide us with personal information of any kind.",
                style: descriptionTextStyle,
              ),
              SizedBox(
                height: 2.h,
              ),
              SizedBox(
                height: 8.h,
              ),
              Text(
                "Log Data:",
                style: headingTextStyle1,
                textAlign: TextAlign.left,
              ),
              SizedBox(
                height: 2.h,
              ),
              Text(
                "Information automatically collected when you access the site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site.",
                style: descriptionTextStyle,
              ),
              SizedBox(
                height: 2.h,
              ),
              SizedBox(
                height: 8.h,
              ),
              Text(
                "Third-Party Data:",
                style: headingTextStyle1,
                textAlign: TextAlign.left,
              ),
              SizedBox(
                height: 2.h,
              ),
              Text(
                "We may use third party services such as Google Analytics that collect, monitor, and analyze Log Data. We do not transfer personal information to these third-party vendors.",
                style: descriptionTextStyle,
              ),
              SizedBox(
                height: 2.h,
              ),
              SizedBox(
                height: 8.h,
              ),
              Text(
                "Communications:",
                style: headingTextStyle1,
                textAlign: TextAlign.left,
              ),
              SizedBox(
                height: 2.h,
              ),
              Text(
                "We may use your Personal Information to contact you with newsletters, marketing, or promotional materials..",
                style: descriptionTextStyle,
              ),
              SizedBox(
                height: 2.h,
              ),
              SizedBox(
                height: 8.h,
              ),
              Text(
                "Cookies",
                style: headingTextStyle1,
                textAlign: TextAlign.left,
              ),
              SizedBox(
                height: 2.h,
              ),
              Text(
                "Cookies are files with a small amount of data, which may include an anonymous unique identifier. Cookies are sent to your browser from a web site and stored on your computer’s hard drive. \n\nLike many sites, we use “cookies” to collect information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Site.",
                style: descriptionTextStyle,
              ),
              SizedBox(
                height: 2.h,
              ),
              SizedBox(
                height: 8.h,
              ),
              Text(
                "Third-Party Websites:",
                style: headingTextStyle1,
                textAlign: TextAlign.left,
              ),
              SizedBox(
                height: 2.h,
              ),
              Text(
                "The Site may contain links to third-party websites and applications of interest, including advertisements and external services, that are not affiliated with us. Once you have used these links to leave the site, any information you provide to these third parties is not covered by this Privacy Policy, and we cannot guarantee the safety and privacy of your information.",
                style: descriptionTextStyle,
              ),
              SizedBox(
                height: 2.h,
              ),
              SizedBox(
                height: 8.h,
              ),
              Text(
                "Security:",
                style: headingTextStyle1,
                textAlign: TextAlign.left,
              ),
              SizedBox(
                height: 2.h,
              ),
              Text(
                "The security of your Personal Information is important to us, but remember that no method of transmission over the Internet, or method of electronic storage, is 100% secure. While we strive to use commercially acceptable means to protect your Personal Information, we cannot guarantee its absolute security.",
                style: descriptionTextStyle,
              ),
              SizedBox(
                height: 2.h,
              ),
              SizedBox(
                height: 8.h,
              ),
              Text(
                "Changes To This Privacy Policy",
                style: headingTextStyle1,
                textAlign: TextAlign.left,
              ),
              SizedBox(
                height: 2.h,
              ),
              Text(
                "This Privacy Policy is effective as of 22/01/2024 and will remain in effect except with respect to any changes in its provisions in the future, which will be in effect immediately after being posted on this page. \n\nWe reserve the right to update or change our Privacy Policy at any time and you should check this Privacy Policy periodically. Your continued use of the Service after we post any modifications to the Privacy Policy on this page will constitute your acknowledgment of the modifications and your consent to abide and be bound by the modified Privacy Policy.\n\nIf we make any material changes to this Privacy Policy, we will notify you either through the email address you have provided us or by placing a prominent notice on our website.",
                style: descriptionTextStyle,
              ),
              SizedBox(
                height: 2.h,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
