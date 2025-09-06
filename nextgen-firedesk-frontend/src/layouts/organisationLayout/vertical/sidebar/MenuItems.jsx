import {
  IconAperture,
  IconInbox,
  IconUserCircle,
  IconTool,
  IconBuildingWarehouse,
  IconShield,
  IconReport,
  IconBrandApplePodcast,
  IconTicket,
  IconArchive,
  IconCategory,
  IconDownload,
  IconGripVertical
} from "@tabler/icons";

import { uniqueId } from "lodash";
import { useSelector } from "react-redux";

const Menuitems = () => {
  const userType = useSelector((state) => state.user.userType);

  const items = [
    // {
    //   id: uniqueId(),
    //   title: "Dashboard",
    //   icon: IconAperture,
    //   href: "/customer/dashboard",
    //   chipColor: "secondary",
    // },
    {
      id: uniqueId(),
      title: "Home",
      icon: IconAperture,
      href: "/customer",
      chipColor: "secondary",
    },
    {
      id: uniqueId(),
      title: "Calendar",
      icon: IconInbox,
      href: "/customer/service-calendar",
      chipColor: "secondary",
    },
    {
      id: uniqueId(),
      title: "Manager",
      icon: IconUserCircle,
      href: "/customer/manager",
      chipColor: "secondary",
    },
    {
      id: uniqueId(),
      title: "Plant",
      icon: IconBuildingWarehouse,
      href: "/customer/plant",
      chipColor: "secondary",
    },
    {
      id: uniqueId(),
      title: "Categories",
      icon: IconCategory,
      href: "/customer/categories",
      chipColor: "secondary",
    },
    {
      id: uniqueId(),
      title: "Technician",
      icon: IconTool,
      href: "/customer/technician",
      chipColor: "secondary",
    },
    {
      id: uniqueId(),
      title: "Assets",
      icon: IconShield,
      href: "/customer/assets",
      chipColor: "secondary",
    },
    {
      id: uniqueId(),
      title: "Group Service",
      icon: IconGripVertical,
      href: "/customer/group-service",
      chipColor: "secondary",
    },
    {
      id: uniqueId(),
      title: "Tickets",
      icon: IconTicket,
      href: "/customer/tickets",
      chipColor: "secondary",
    },
    {
      id: uniqueId(),
      title: "Audits",
      icon: IconBrandApplePodcast,
      href: "/customer/audits",
      chipColor: "secondary",
    },
    {
      id: uniqueId(),
      title: "Archive",
      icon: IconArchive,
      href: "/customer/archive",
      chipColor: "secondary",
    },
    {
      id: uniqueId(),
      title: "Reports",
      icon: IconReport,
      href: "/customer/reports",
      chipColor: "secondary",
    },
    {
      id: uniqueId(),
      title: "Service Form",
      icon: IconDownload,
      href: "/customer/service-form-view",
      chipColor: "secondary",
    },
  ];

  const filteredItems = items.filter(
    (item) => !(userType === "manager" && item.title === "Manager")
  );

  return filteredItems;
};

export default Menuitems;
