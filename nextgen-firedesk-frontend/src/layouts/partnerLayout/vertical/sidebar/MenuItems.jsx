import {
  IconPoint,
  IconApps,
  IconChartDonut3,
  IconAperture,
  IconUserCircle,
  IconPackage,
  IconAlertCircle,
  IconReport,
  IconClock,
  IconSettings
} from "@tabler/icons";

import { uniqueId } from "lodash";

const Menuitems = [
  {
    id: uniqueId(),
    title: "Home",
    icon: IconAperture,
    href: "/partner",
    chipColor: "secondary",
  },
  {
    id: uniqueId(),
    title: "My Customer",
    icon: IconApps,
    href: "/partner/my-customers",
    chipColor: "secondary",
  },
  {
    id: uniqueId(),
    title: "Reports",
    icon: IconReport,
    href: "/partner/reports",
    chipColor: "secondary",
  },
];

export default Menuitems;
