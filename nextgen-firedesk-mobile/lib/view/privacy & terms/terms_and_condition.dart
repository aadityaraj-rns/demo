import 'package:firedesk/res/colors/colors.dart';
import 'package:firedesk/res/styles/text_style.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class TermsAndConditionScreen extends StatelessWidget {
  const TermsAndConditionScreen({super.key});

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
              "Terms & Conditions",
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
                "General Terms of Service",
                style: headingTextStyle1,
                textAlign: TextAlign.left,
              ),
              SizedBox(
                height: 2.h,
              ),
              Text(
                "Welcome to FireDesk, operated by Leistung Technologies, having its registered office at No, 52/S, 2nd Stage, Srirampura, Mysuru,570 034, INDIA and Operational office at No 38/1, 1st Model House Street, Basavangudi, Bengaluru 560 018 INDIA. Your Order Form and each renewal notice includes a description of the Services that Provider has agreed to provide to you and the price you agree to pay for such Services. Your Order Form incorporates these General Terms of Service, and together your Order Form and these General Terms of Service form your “Agreement” with Leistung Technologies.",
                style: descriptionTextStyle,
              ),
              SizedBox(
                height: 2.h,
              ),
              SizedBox(
                height: 8.h,
              ),
              Text(
                "Use of Services",
                style: headingTextStyle1,
                textAlign: TextAlign.left,
              ),
              SizedBox(
                height: 2.h,
              ),
              Text(
                "1. No Personal Information:",
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
              Text(
                "2. Use by Individuals:",
                style: headingTextStyle1,
                textAlign: TextAlign.left,
              ),
              SizedBox(
                height: 2.h,
              ),
              Text(
                "Please read this Agreement carefully before using the Services. By accessing the Services, you acknowledge and agree that you have read this Agreement, are at least eighteen (18) years of age, and wish to be bound by the terms and conditions set forth in this Agreement. If you are not at least eighteen (18) years of age or do not wish to be bound by this Agreement, you are not authorized to use the Services. Additional terms and conditions may apply to certain Services, and your use of such Services indicates your agreement to such terms and conditions.\n\nWe reserve the right to modify the Agreement at any time. You agree to review this Agreement periodically to be aware of such modifications. You further agree that your continued use of the Services shall be deemed to be your conclusive acceptance of any modified Agreement. We will indicate that changes to this Agreement have been made by updating the date indicated after “Last Modified” at the end of this Agreement. If you do not agree to abide by any modified version of this Agreement, you are not authorized to use the Services. A current version of this Agreement is accessible via the footer of the Website’s homepage. You acknowledge and agree that Provider may, under exceptional circumstances required by necessary technical changes or comparable measures, stop (permanently or temporarily) providing the Services (or any features within the Services) to you or to users generally at Provider’s sole discretion, without prior notice.\n\nYou agree to use the Services only for purposes that are permitted by (a) this Agreement and (b) any applicable law, regulation or generally accepted practices or guidelines in the relevant jurisdictions.",
                style: descriptionTextStyle,
              ),
              SizedBox(
                height: 2.h,
              ),
              SizedBox(
                height: 8.h,
              ),
              Text(
                "Definitions.",
                style: headingTextStyle1,
                textAlign: TextAlign.left,
              ),
              SizedBox(
                height: 2.h,
              ),
              Text(
                "“Aggregated Statistics” means data and information related to Customer’s use of the Services that is used by Provider in an aggregate and completely anonymized manner, including to compile statistical and performance information related to the provision and operation of the Services.",
                style: descriptionTextStyle,
              ),
              SizedBox(
                height: 7.h,
              ),
              Text(
                "“Authorized User” means Customer’s employees, consultants, contractors, and agents (i) who are authorized by Customer to access and use the Services under the rights granted to Customer pursuant to this Agreement and (ii) for whom access to the Services has been purchased hereunder.",
                style: descriptionTextStyle,
              ),
              SizedBox(
                height: 7.h,
              ),
              Text(
                "“Customer” means the legal entity or individual that enters into this Agreement by using the Services or, where applicable, as described in the Order Form.",
                style: descriptionTextStyle,
              ),
              SizedBox(
                height: 7.h,
              ),
              Text(
                "“Customer Data” means, other than Aggregated Statistics, information, data, and other content, in any form or medium, that is submitted, posted, or otherwise transmitted by or on behalf of Customer or an Authorized User through the Services.",
                style: descriptionTextStyle,
              ),
              SizedBox(
                height: 7.h,
              ),
              Text(
                "“Documentation” means Provider’s user manuals, handbooks, and guides relating to the Services provided by Provider to Customer either electronically or in hard copy form.",
                style: descriptionTextStyle,
              ),
              SizedBox(
                height: 7.h,
              ),
              Text(
                "“Order Form” means the signature page/order form executed by Provider and Customer, which when signed incorporates this Agreement and makes this Agreement effective.",
                style: descriptionTextStyle,
              ),
              SizedBox(
                height: 7.h,
              ),
              Text(
                "“Personal Information” means personal information, health information, financial information, educational information, or any other type of protected, regulated, or sensitive information of any kind about an individual or group of individuals.",
                style: descriptionTextStyle,
              ),
              SizedBox(
                height: 7.h,
              ),
              Text(
                "“Provider IP” means the Services, the Documentation, and any and all intellectual property provided to Customer or any Authorized User in connection with the foregoing. For the avoidance of doubt, Provider IP includes Aggregated Statistics, but does not include Customer Data.",
                style: descriptionTextStyle,
              ),
              SizedBox(
                height: 7.h,
              ),
              Text(
                "“Services” means the software-as-a-service offering described in the Order Form or any renewal notice.",
                style: descriptionTextStyle,
              ),
              SizedBox(
                height: 7.h,
              ),
              Text(
                "“Support Addendum” means that certain addendum to this Agreement, if any, which describes the support to be provided to Customer and the fees associated with such support.",
                style: descriptionTextStyle,
              ),
              SizedBox(
                height: 7.h,
              ),
              Text(
                "“Third-Party Products” means any third-party products described in the Order Form or renewal notice that are provided with or incorporated into the Services.",
                style: descriptionTextStyle,
              ),
              SizedBox(
                height: 7.h,
              ),
              SizedBox(
                height: 8.h,
              ),
              Text(
                "Access And Use",
                style: headingTextStyle1,
                textAlign: TextAlign.left,
              ),
              SizedBox(
                height: 2.h,
              ),
              Text(
                "i.Provision of Access:",
                style: headingTextStyle1,
                textAlign: TextAlign.left,
              ),
              SizedBox(
                height: 2.h,
              ),
              Text(
                "Subject to and conditioned on Customer’s payment of Fees and compliance with all other terms and conditions of this Agreement, Provider hereby grants Customer a non-exclusive, non-transferable right to access and use the Services during the Term, solely for use by Authorized Users in accordance with the terms and conditions herein. Such use is limited to Customer’s internal use. Provider shall provide to Customer the necessary passwords and network links or connections to allow Customer to access the Services. The total number of Authorized Users will not exceed the number set forth in the Order Form or renewal notice, except as expressly agreed to in writing by the Parties and subject to any appropriate adjustment of the Fees payable hereunder.",
                style: descriptionTextStyle,
              ),
              Text(
                "ii. Documentation License:",
                style: headingTextStyle1,
                textAlign: TextAlign.left,
              ),
              SizedBox(
                height: 2.h,
              ),
              Text(
                "Subject to the terms and conditions contained in this Agreement, Provider hereby grants to Customer a non-exclusive, non-sublicensable, non- license to use the Documentation during the Term solely for Customer’s internal business purposes in connection with its use of the Services.",
                style: descriptionTextStyle,
              ),
              Text(
                "iii. Use Restrictions:",
                style: headingTextStyle1,
                textAlign: TextAlign.left,
              ),
              SizedBox(
                height: 2.h,
              ),
              Text(
                "Customer shall not use the Services for any purposes beyond the scope of the access granted in this Agreement. Customer shall not at any time, directly or indirectly, and shall not permit any Authorized Users to:",
                style: descriptionTextStyle,
              ),
              SizedBox(
                height: 2.h,
              ),
              SizedBox(
                height: 2.h,
              ),
              Text(
                "(i) copy, modify, or create derivative works of the Services or Documentation, in whole or in part;",
                style: descriptionTextStyle,
              ),
              SizedBox(
                height: 2.h,
              ),
              SizedBox(
                height: 2.h,
              ),
              Text(
                "(ii) rent, lease, lend, sell, license, sublicense, assign, distribute, publish, transfer, or otherwise make available the Services or Documentation;",
                style: descriptionTextStyle,
              ),
              SizedBox(
                height: 2.h,
              ),
              SizedBox(
                height: 2.h,
              ),
              Text(
                "(iii) reverse engineer, disassemble, decompile, decode, adapt, or otherwise attempt to derive or gain access to any software component of the Services, in whole or in part;",
                style: descriptionTextStyle,
              ),
              SizedBox(
                height: 2.h,
              ),
              SizedBox(
                height: 2.h,
              ),
              Text(
                "(iv) remove any proprietary notices from the Services or Documentation;",
                style: descriptionTextStyle,
              ),
              SizedBox(
                height: 2.h,
              ),
              SizedBox(
                height: 2.h,
              ),
              Text(
                "(v) use the Services or Documentation in any manner or for any purpose that infringes, misappropriates, or otherwise violates any intellectual property right or other right of any person, or that violates any applicable law.",
                style: descriptionTextStyle,
              ),
              SizedBox(
                height: 2.h,
              ),
              SizedBox(
                height: 8.h,
              ),
              Text(
                "Reservation of Rights:",
                style: headingTextStyle1,
                textAlign: TextAlign.left,
              ),
              SizedBox(
                height: 2.h,
              ),
              Text(
                "Provider reserves all rights not expressly granted to Customer in this Agreement. Except for the limited rights and licenses expressly granted under this Agreement, nothing in this Agreement grants, by implication, waiver, estoppel, or otherwise, to Customer or any third party any intellectual property rights or other right, title, or interest in or to the Provider IP.",
                style: descriptionTextStyle,
              ),
              SizedBox(
                height: 2.h,
              ),
              SizedBox(
                height: 8.h,
              ),
              Text(
                "Customer Responsibilities",
                style: headingTextStyle1,
                textAlign: TextAlign.left,
              ),
              SizedBox(
                height: 2.h,
              ),
              Text(
                "i.General:",
                style: descriptionTextStyle,
              ),
              SizedBox(
                height: 2.h,
              ),
              Text(
                "Customer is responsible and liable for all uses of the Services and Documentation resulting from access provided by Customer, directly or indirectly, whether such access or use is permitted by or in violation of this Agreement. Without limiting the generality of the foregoing, Customer is responsible for all acts and omissions of Authorized Users, and any act or omission by an Authorized User that would constitute a breach of this Agreement if taken by Customer will be deemed a breach of this Agreement by Customer. Customer shall use reasonable efforts to make all Authorized Users aware of this Agreement’s provisions as applicable to such Authorized User’s use of the Services, and shall cause Authorized Users to comply with such provisions.",
                style: descriptionTextStyle,
              ),
              SizedBox(
                height: 2.h,
              ),
              Text(
                "ii.Third-Party Products:",
                style: descriptionTextStyle,
              ),
              SizedBox(
                height: 2.h,
              ),
              Text(
                "Provider may from time to time make Third-Party Products available to Customer. For purposes of this Agreement, such Third-Party Products are subject to their own terms and conditions and the applicable flow-through provisions. If Customer does not agree to abide by the applicable terms for any such Third-Party Products, then Customer should not install or use such Third-Party Products.",
                style: descriptionTextStyle,
              ),
              SizedBox(
                height: 2.h,
              ),
              SizedBox(
                height: 8.h,
              ),
              Text(
                "Service Levels and Support",
                style: headingTextStyle1,
                textAlign: TextAlign.left,
              ),
              SizedBox(
                height: 2.h,
              ),
              Text(
                "i.Service Levels:",
                style: descriptionTextStyle,
              ),
              SizedBox(
                height: 2.h,
              ),
              Text(
                "Subject to the terms and conditions of this Agreement, Provider shall use commercially reasonable efforts to make the Services available in accordance with the service levels .",
                style: descriptionTextStyle,
              ),
              SizedBox(
                height: 2.h,
              ),
              Text(
                "ii.Support:",
                style: descriptionTextStyle,
              ),
              SizedBox(
                height: 2.h,
              ),
              Text(
                "The access rights granted hereunder entitle Customer to the support services set forth in the Order Form, plus any additional support services that Customer may order during the Term.",
                style: descriptionTextStyle,
              ),
              SizedBox(
                height: 8.h,
              ),
              Text(
                "Fees and Payment",
                style: headingTextStyle1,
                textAlign: TextAlign.left,
              ),
              SizedBox(
                height: 2.h,
              ),
              Text(
                "i.Fees.",
                style: headingTextStyle1,
                textAlign: TextAlign.left,
              ),
              SizedBox(
                height: 2.h,
              ),
              Text(
                "Customer shall pay Provider the fees (“Fees”) as set forth in the Order Form and any renewal notice without offset or deduction. Customer shall make all payments before the due date set forth in the Order Form or renewal notice. If Customer fails to make any payment when due, without limiting Provider’s other rights and remedies:",
                style: descriptionTextStyle,
              ),
              SizedBox(
                height: 2.h,
              ),
              Text(
                "(i) Provider may charge interest on the past due amount at the rate of 1.5% per month calculated daily and compounded monthly or, if lower, the highest rate permitted under applicable law;",
                style: descriptionTextStyle,
              ),
              SizedBox(
                height: 2.h,
              ),
              Text(
                "(ii) Customer shall reimburse Provider for all reasonable costs incurred by Provider in collecting any late payments or interest, including attorneys’ fees, court costs, and collection agency fees;",
                style: descriptionTextStyle,
              ),
              SizedBox(
                height: 2.h,
              ),
              Text(
                "(iii) if such failure continues for 15 days or more, Provider may suspend Customer’s and its Authorized Users’ access to any portion or all of the Services until such amounts are paid in full.",
                style: descriptionTextStyle,
              ),
              SizedBox(
                height: 2.h,
              ),
              Text(
                "ii.Taxes:.",
                style: headingTextStyle1,
                textAlign: TextAlign.left,
              ),
              SizedBox(
                height: 2.h,
              ),
              Text(
                "All Fees and other amounts payable by Customer under this Agreement are exclusive of taxes and similar assessments. Customer is responsible for all sales, use, and excise taxes, and any other similar taxes, duties, and charges of any kind imposed by any federal, state, or local governmental or regulatory authority on any amounts payable by Customer hereunder, other than any taxes imposed on Provider’s income.",
                style: descriptionTextStyle,
              ),
              SizedBox(
                height: 8.h,
              ),
              Text(
                "Confidential Information.",
                style: headingTextStyle1,
                textAlign: TextAlign.left,
              ),
              SizedBox(
                height: 2.h,
              ),
              Text(
                "THE SERVICES ARE NOT INTENDED TO PROCESS OR STORE PERSONAL INFORMATION. From time to time during the Term, either Party may disclose or make available to the other Party information about its business affairs, products, confidential intellectual property, trade secrets, third-party confidential information, and other sensitive or proprietary information, whether orally or in written, electronic, or other form or media, and whether or not marked, designated, or otherwise identified as “confidential” (collectively, “Confidential Information”). Confidential Information does not include information that, at the time of disclosure is: (a) in the public domain; (b) known to the receiving Party at the time of disclosure; (c) rightfully obtained by the receiving Party on a non-confidential basis from a third party; or (d) independently developed by the receiving Party.",
                style: descriptionTextStyle,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
