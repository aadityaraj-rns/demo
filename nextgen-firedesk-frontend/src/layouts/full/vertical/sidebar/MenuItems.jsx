import {
  IconPoint,
  IconApps,
  IconAperture,
  IconUserCircle,
  IconPackage,
  IconAlertCircle,
} from "@tabler/icons";

import { uniqueId } from "lodash";

const Menuitems = [
  {
    id: uniqueId(),
    title: "Home",
    icon: IconAperture,
    href: "/",
    chipColor: "secondary",
  },

  {
    id: uniqueId(),
    title: "Master data",
    icon: IconApps,
    href: "/masterData/",
    children: [
      {
        id: uniqueId(),
        title: "Industry",
        icon: IconPoint,
        href: "/masterData/industry",
      },
      {
        id: uniqueId(),
        title: "City",
        icon: IconPoint,
        href: "/masterData/city",
      },
      {
        id: uniqueId(),
        title: "Categories",
        icon: IconPoint,
        href: "/masterData/categories",
      },
      {
        id: uniqueId(),
        title: "Service Form",
        icon: IconPoint,
        href: "/masterData/service-form",
      },

    ],
  },
  {
    id: uniqueId(),
    title: "Clients",
    icon: IconUserCircle,
    href: "/client/data",
  },
  {
    id: uniqueId(),
    title: "Product",
    icon: IconPackage,
    href: "/product",
  },
  {
    id: uniqueId(),
    title: "Service",
    icon: IconAlertCircle,
    href: "/service",
  },
];

export default Menuitems;
