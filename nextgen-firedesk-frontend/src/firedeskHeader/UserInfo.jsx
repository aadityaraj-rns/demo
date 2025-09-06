import { useState } from "react";
import {
  Mail,
  Phone,
  Lock,
  Sun,
  Moon,
  Edit3,
  LogOut,
  SunMoon,
  UserIcon,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
// import { Link } from "react-router-dom";
// import * as dropdownData from "../layouts/full/vertical/header/data";

import ProfileImg from "../assets/images/profile/user-1.jpg";
import { logout } from "../api/admin/internal";
import { resetUser } from "../store/userSlice";
import { showAlert } from "../components/common/showAlert";
import { setDarkMode } from "../store/customizer/CustomizerSlice";

const UserInfo = () => {
  const customizer = useSelector((state) => state.customizer);
  const [isOpen, setIsOpen] = useState(false);
  const nameFromStore = useSelector((state) => state.user.name);
  const userTypeFromStore = useSelector((state) => state.user.userType);
  const contactNoFromStore = useSelector((state) => state.user.phone);
  const emailFromStore = useSelector((state) => state.user.email);
  const profileFromStore = useSelector((state) => state.user.profile);
  const loginIdFromStore = useSelector((state) => state.user.loginID);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignout = async () => {
    const response = await logout();
    if (response.status === 200) {
      dispatch(resetUser());
      navigate("/login");
      showAlert({
        text: "Logout Successfully",
        icon: "success",
      });
    } else {
      dispatch(resetUser());
      showAlert({
        text: response.data.message,
        icon: "error",
      });
      console.error("Logout failed:", response);
    }
  };

  const toggleTheme = () => {
    dispatch(setDarkMode(customizer.activeMode === "dark" ? "light" : "dark"));
  };

  const handleEditProfile = () => {
    navigate("/customer/profile");
  };

  const handleChangePassword = () => {
    navigate("/customer/change-password");
  };

  return (
    <div className="relative">
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-2 rounded-lg"
      >
        <div className="w-10 h-10 flex items-center justify-center text-lg">
          {!profileFromStore ? (
            <UserIcon className="text-white bg-[#303030] rounded-full w-10 h-10 p-2" />
          ) : (
            <img
              src={profileFromStore}
              alt={ProfileImg}
              className="w-10 h-10 object-cover rounded-full"
            />
          )}
        </div>
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute mt-1 right-0 w-70 bg-white border-b-1 border-white rounded-2xl shadow-lg z-50">
          {/* Profile Header */}
          <div className="mx-3 mt-3 border-b-1 pb-3 border-white">
            <div className="flex items-center justify-start space-x-4">
              <div className="w-18 h-18 flex items-center justify-center text-2xl">
                {!profileFromStore ? (
                  <UserIcon className="text-gray-700 bg-white rounded-full w-16 h-16 p-3" />
                ) : (
                  <img
                    src={profileFromStore}
                    alt={ProfileImg}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                )}
              </div>
              <div>
                <p className="text-lg font-medium text-black">
                  {nameFromStore}
                </p>
                <p className="text-sm text-[#727272]">
                  {userTypeFromStore === "organization" ? "Admin" : "Manager"}
                </p>
                <p className="text-sm text-[#727272]">{loginIdFromStore}</p>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="m-3 border-b-1 border-[#E3E3E3]">
            <p className="text-xs text-[#727272] mb-3">Contact Details</p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-[#727272]" strokeWidth={1} />
                <span className="text-sm text-gray-900">{emailFromStore}</span>
              </div>
              <div className="flex items-center space-x-3 mb-3">
                <Phone className="w-5 h-5 text-[#727272]" strokeWidth={1} />
                <span className="text-sm text-gray-900">
                  {contactNoFromStore}
                </span>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div>
            <div className="border-b-1 border-[#E3E3E3] m-3">
              {/* Change Password */}
              <button
                onClick={handleChangePassword}
                className="w-full flex items-center space-x-3 text-left mb-3 rounded-lg transition-colors"
              >
                <Lock className="w-5 h-5 text-[#727272]" strokeWidth={1} />
                <span className="text-sm text-black">Change Password</span>
              </button>
            </div>

            {/* Theme Toggle */}
            <div className="flex items-center justify-between m-3 border-b-1 border-[#E3E3E3]">
              <div className="flex items-center space-x-3 mb-3">
                <SunMoon className="w-6 h-6 text-[#727272]" strokeWidth={1} />
                <span className="text-sm text-black">Theme</span>
              </div>
              <div className="flex items-center gap-1 mb-3 bg-white p-1 px-2 rounded-full">
                <button
                  onClick={toggleTheme}
                  className={`p-1 rounded-5 ${
                    customizer.activeMode === "light" ? "bg-orange-100" : ""
                  }`}
                >
                  <Sun
                    className={`w-4 h-4 ${
                      customizer.activeMode === "light" ? "text-black" : "text-[#B5B5B5]"
                    } `}
                  />
                </button>
                <button
                  onClick={toggleTheme}
                  className={`p-1 rounded-5 ${
                    customizer.activeMode === "dark" ? "bg-[#EDEDED]" : ""
                  }`}
                >
                  <Moon
                    className={`w-4 h-4 ${
                      customizer.activeMode === "dark" ? "text-[#B5B5B5]" : "text-black"
                    } `}
                  />
                </button>
              </div>
            </div>

            {/* Edit Profile */}
            <button
              onClick={handleEditProfile}
              className="w-full flex items-center justify-between m-3 text-left rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Edit3 className="w-5 h-5 text-[#727272]" strokeWidth={1} />
                <span className="text-sm text-black">Edit Profile</span>
              </div>
              <div></div>
            </button>

            {/* Logout */}
            <button
              onClick={handleSignout}
              className="w-full flex items-center space-x-3 m-3 text-left rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5 text-[#727272]" strokeWidth={1} />
              <span className="text-sm text-black">Logout</span>
            </button>
          </div>
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
};

export default UserInfo;
