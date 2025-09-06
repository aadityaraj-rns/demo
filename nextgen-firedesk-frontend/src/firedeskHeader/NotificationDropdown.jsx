import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Clock,
  CheckCircle,
  Info,
  ArrowLeft,
} from "lucide-react";
import {
  getMyNotification,
  setMarkAsReadAllNotification,
} from "../../src/api/organization/internal";
import { Badge, IconButton } from "@mui/material";
import { IconBellRinging } from "@tabler/icons";

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("All");

  const [notifications, setNotifications] = useState([]);

  const fetchNotification = async () => {
    const response = await getMyNotification();

    if (response.status === 200) {
      setNotifications(response.data);
    }
  };

  useEffect(() => {
    fetchNotification();
  }, []);

  const tabs = [
    { name: "All", count: notifications.length },
    {
      name: "Critical",
      count: notifications.filter((n) => n.importance === "Critical").length,
    },
    {
      name: "Reminder",
      count: notifications.filter((n) => n.importance === "Reminder").length,
    },
    {
      name: "Warning",
      count: notifications.filter((n) => n.importance === "Warning").length,
    },
    {
      name: "Unread",
      count: notifications.filter((n) => n.read === false).length,
    },
  ];

  const getFilteredNotifications = () => {
    if (activeTab === "All") return notifications;
    if (activeTab === "Unread")
      return notifications.filter((n) => n.read === false);
    return notifications.filter((n) => n.importance === activeTab);
  };

  const getTabColor = (tabName) => {
    if (tabName === activeTab) return "bg-[#EDEDED] rounded-2 p-0.5";
    return "";
  };

  const markAllReadHandler = async () => {
    console.log("clicked");

    const response = await setMarkAsReadAllNotification();

    if (response.status == 200) {
      fetchNotification();
    }
  };

  const getIconByImportanceColor = (importance) => {
    switch (importance) {
      case "Critical":
        return "text-[#B91C1C]";
      case "Warning":
        return "text-[#FFF7ED]";
      case "Reminder":
        return "text-[#1D4ED8]";
      case "Success":
        return "text-[#047857]";
      default:
        return "text-[#727272]";
    }
  };

  const getIconByImportance = (importance) => {
    const commonProps = { className: "w-fit h-fit" };

    switch (importance) {
      case "Critical":
        return <AlertTriangle {...commonProps} fill="#FEE2E2" />;
      case "Warning":
        return <AlertTriangle {...commonProps} fill="#FFF7ED" />;
      case "Reminder":
        return <Clock {...commonProps} />;
      case "Success":
        return <CheckCircle {...commonProps} fill="#ECFDF5" />;
      default:
        return <Info {...commonProps} fill="#FFFFFF" />;
    }
  };

  const getIconByImportanceBgColor = (importance) => {
    switch (importance) {
      case "Critical":
        return "bg-[#FEE2E2]";
      case "Warning":
        return "bg-[#FFF7ED]";
      case "Reminder":
        return "bg-[#EFF6FF]";
      case "Success":
        return "bg-[#ECFDF5]";
      default:
        return "bg-[#FFFFFF]";
    }
  };

  return (
    <div className="relative">
      <IconButton
        size="large"
        aria-label="show 11 new notifications"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        onClick={() => setIsOpen(!isOpen)}
      >
        {notifications.length > 0 ? (
          <Badge variant="dot" color="primary">
            <IconBellRinging size="21" stroke="1.5" />
          </Badge>
        ) : (
          <IconBellRinging size="21" stroke="1.5" />
        )}
      </IconButton>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute -right-15 md:right-0 mt-2 w-70 md:w-124 bg-[#F9F9F9] rounded-lg shadow-lg z-50 p-2">
          {/* Header */}
          <div className="flex p-1 items-center justify-between border-b-1 pb-3 border-[#E3E3E3] text-black">
            <div className="flex items-center gap-2">
              <ArrowLeft strokeWidth={1} className="md:hidden" />
              <p className="text-xl font-medium">Notifications</p>
            </div>
            <div className="text-xs md:text-sm font-semibold text-[#FF6B2C]">
              <button onClick={markAllReadHandler}>Mark all as read</button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-3 p-2 border-b border-gray-200 text-[#A2A2A2]">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className="text-sm border-b-2 border-transparent"
              >
                <span className={`inline-block px-1 ${getTabColor(tab.name)} `}>
                  {tab.name} ({tab.count})
                </span>
              </button>
            ))}
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto [scrollbar-width:none]">
            {getFilteredNotifications().map((notification, index) => (
              <div
                key={index}
                className="px-2 py-4 border-b-1 border-[#E3E3E3] hover:bg-gray-50"
              >
                <div className="flex items-start space-x-3">
                  {/* Icon */}
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center`}
                  >
                    <span
                      className={getIconByImportanceColor(
                        notification.importance
                      )}
                    >
                      {getIconByImportance(notification.importance)}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span
                        className={`text-sm font-medium ${getIconByImportanceColor(
                          notification.importance
                        )} ${getIconByImportanceBgColor(
                          notification.importance
                        )} px-2 py-0.5 rounded-5`}
                      >
                        {notification.importance}
                      </span>
                    </div>
                    <p className="text-sm text-gray-900 mb-1 font-semibold">
                      {notification.title}
                    </p>
                    <p className="text-sm text-gray-900 mb-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500">
                      {notification.createdAt.replace("T", " ").split(".")[0]}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
};

export default NotificationDropdown;
