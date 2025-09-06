// import { useState } from "react";
import { Menu } from "lucide-react";
import NotificationDropdown from "./NotificationDropdown";
import { toggleMobileSidebar } from "../../src/store/customizer/CustomizerSlice";
import UserInfo from "./UserInfo";
import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";

const Header = () => {
  // const [searchValue, setSearchValue] = useState("");
  // const [showMobileSearch, setShowMobileSearch] = useState(false);

  // const navigate = useNavigate();

  // const redirectToHome = () => {
  //   navigate('/customer');
  // }

  const dispatch = useDispatch();

  // const handleSearchSubmit = (e) => {
  //   e.preventDefault();
  //   console.log('Searching for:', searchValue);
  //   setShowMobileSearch(false);
  // };

  return (
    <>
      <header className="bg-black text-white px-3 py-2 font-[Figtree] w-full -mb-12 z-50">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className='hidden lg:block'>
            <img src="firedesk.png" alt="logo" className='w-30' onClick={redirectToHome}/>
          </div>
          <div className='lg:hidden'>
            <button>
              <Menu
                strokeWidth={1}
                size={30}
                onClick={() => dispatch(toggleMobileSidebar())}
              />
            </button>
          </div>

          {/* Right Side - Search - Notifications and Profile */}
          <div className="flex items-center justify-evenly gap-2">
            {/* Search Bar - Desktop */}
            {/* <div className="w-[32vw] hidden lg:block">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by Pump ID, Asset Name, or Building"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-full bg-[#303030] rounded-2 px-3 py-2 pr-10 text-white placeholder-[#FFFFFF99] outline-none border-none focus:border-none"
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white">
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div> */}

            {/* Search Icon For Smaller Screens */}
            {/* <div>
              <button 
                className='bg-[#303030] rounded-2 p-2 lg:hidden'
                onClick={() => setShowMobileSearch(true)}
              >
                <Search />
              </button>
            </div> */}

            {/* Notification Bell */}
            <NotificationDropdown />

            {/* Profile */}
            <UserInfo />
          </div>
        </div>
      </header>

      {/* Mobile Search Popup */}
      {/* {showMobileSearch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20">
          <div className="bg-black w-[90vw] max-w-md mx-auto rounded-lg p-4 relative"> */}
      {/* Close Button */}
      {/* <button
              onClick={() => setShowMobileSearch(false)}
              className="absolute right-3 top-3 text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button> */}

      {/* Search Input */}
      {/* <div className="mt-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by Pump ID, Asset Name, or Building"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearchSubmit(e);
                    }
                  }}
                  className="w-full bg-[#303030] rounded-2 px-3 py-2 pr-10 text-white placeholder-[#FFFFFF99] outline-none border-none focus:border-none"
                  autoFocus
                />
                <button
                  onClick={handleSearchSubmit}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div> */}
      {/* </div> */}
      {/* </div> */}
      {/* )} */}
    </>
  );
};

export default Header;
