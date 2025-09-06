import {
  IconAperture,
  IconFiretruck,
  IconFileDescription,
} from "@tabler/icons";

import { uniqueId } from "lodash";

const Menuitems = [
  {
    id: uniqueId(),
    title: "Home",
    icon: IconAperture,
    href: "/technician",
    chipColor: "secondary",
  },
  {
    id: uniqueId(),
    title: "My Assets",
    icon: IconFiretruck,
    href: "/technician/my-assets",
    chipColor: "secondary",
  },
  {
    id: uniqueId(),
    title: "Service Report",
    icon: IconFileDescription,
    href: "/technician/service-reports",
    chipColor: "secondary",
  },
];

export default Menuitems;
