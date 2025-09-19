import "package:firedesk/res/colors/colors.dart";
import "package:firedesk/res/styles/text_style.dart";
import "package:firedesk/view/Tickets/bottomBar/approval_pending_tickets_screen.dart";
import "package:firedesk/view/Tickets/bottomBar/completed_tickets_screen.dart";
import "package:firedesk/view/Tickets/bottomBar/rejected_tickets_screen.dart";
import "package:firedesk/view/Tickets/bottomBar/upcoming_tickets_screen.dart";
import "package:firedesk/view_models/providers/all_ticket_provider.dart";
import "package:firedesk/view_models/providers/tickets_list_provider.dart";
import "package:flutter/material.dart";
import "package:flutter_screenutil/flutter_screenutil.dart";
import "package:provider/provider.dart";
import "package:salomon_bottom_bar/salomon_bottom_bar.dart";

class AllTicketsScreen extends StatefulWidget {
  final String plantId;
  const AllTicketsScreen({super.key, required this.plantId});
  @override
  State<AllTicketsScreen> createState() => _AllTicketsScreenState();
}

class _AllTicketsScreenState extends State<AllTicketsScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 5, vsync: this);
    final ticketListProvider =
        Provider.of<TicketListsProvider>(context, listen: false);
    ticketListProvider.fetchedDataofStatus.clear();

    WidgetsBinding.instance.addPostFrameCallback(
      (timeStamp) async {
        final provider =
            Provider.of<AllTicketsProvider>(context, listen: false);
        // provider.fetchIncompleteTickets(widget.plantId);
        // provider.fetchUpcomnigTickets(widget.plantId);
        await provider.fetchTicketsByStatus(
            context, _tabController.index, widget.plantId);
      },
    );
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final List<Widget> screens = [
      // IncompletedTicketsScreen(
      //   plantId: widget.plantId,
      // ),
      OpenTicketsScreen(
        plantId: widget.plantId,
      ),
      ApprovalPendingTicketsScreen(
        plantId: widget.plantId,
      ),
      CompletedTicketsScreen(
        plantId: widget.plantId,
      ),
      RejectedTicketsScreen(
        plantId: widget.plantId,
      ),
    ];
    return Consumer<TicketListsProvider>(
      builder: (context, ticketsListProvider, _) {
        return Consumer<AllTicketsProvider>(
            builder: (context, allTicketsProvider, _) {
          return Scaffold(
            backgroundColor: Colors.white,
            appBar: PreferredSize(
              preferredSize: Size.fromHeight(45.h),
              child: Material(
                elevation: 2,
                child: AppBar(
                  leading: IconButton(
                    onPressed: () {
                      Navigator.pop(context);
                    },
                    icon: const Icon(
                      Icons.arrow_back,
                      color: Colors.white,
                    ),
                  ),
                  backgroundColor: basicColor,
                  automaticallyImplyLeading: false,
                  title: Text(
                    "Tickets",
                    style: appBarTextSTyle,
                  ),
                  centerTitle: true,
                  actions: const [],
                ),
              ),
            ),
            body: screens[allTicketsProvider.currentIndex],
            bottomNavigationBar: Material(
              elevation: 10,
              borderRadius: BorderRadius.only(
                topLeft: Radius.circular(20.r),
                topRight: Radius.circular(30.r),
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(20.r),
                  topRight: Radius.circular(30.r),
                ),
                child: Container(
                  color: const Color(0xffF7F9FF),
                  child: SalomonBottomBar(
                    currentIndex: allTicketsProvider.currentIndex,
                    backgroundColor: Colors.transparent,
                    onTap: (i) {
                      allTicketsProvider.currentIndex = i;
                      allTicketsProvider.fetchTicketsByStatus(
                          context, i, widget.plantId);
                    },
                    items: [
                      SalomonBottomBarItem(
                        unselectedColor: darkGreyColor,
                        icon: const Icon(Icons.upcoming),
                        title: const Text("Open"),
                        selectedColor: basicColor,
                      ),
                      SalomonBottomBarItem(
                        unselectedColor: darkGreyColor,
                        icon: const Icon(Icons.approval_rounded),
                        title: const Text(
                          "Approval Pending",
                          style: TextStyle(fontSize: 12),
                        ),
                        selectedColor: basicColor,
                      ),
                      SalomonBottomBarItem(
                        unselectedColor: darkGreyColor,
                        icon: const Icon(Icons.check_circle),
                        title: const Text("Completed"),
                        selectedColor: basicColor,
                      ),
                      SalomonBottomBarItem(
                        unselectedColor: darkGreyColor,
                        icon: const Icon(Icons.cancel),
                        title: const Text("Rejected"),
                        selectedColor: basicColor,
                      ),
                    ],
                  ),
                ),
              ),
            ),
          );
        });
      },
    );
  }
}
