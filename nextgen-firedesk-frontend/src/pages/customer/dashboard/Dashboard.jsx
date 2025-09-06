import { useEffect, useState } from "react";
import PageContainer from "../../../components/container/PageContainer";
import {
  Box,
  Avatar,
  // Divider,
  MenuItem,
  Select,
  Skeleton,
  // Stack,
  // Tab,
  // Typography,
} from "@mui/material";
// import CircleIcon from "@mui/icons-material/Circle";
import { TabContext, TabPanel } from "@mui/lab";
import Spinner from "../../admin/spinner/Spinner";
import { getAllPlantNames } from "../../../api/admin/internal";
import {
  editPlantImage,
  getDashboardData,
  getMyCategorieNames,
} from "../../../api/organization/internal";
import PumpRoom from "./PumpRoom";
import FireExtingusher from "./newDashboard/FireExtingusher";
import { useSelector } from "react-redux";
import LayoutPage from "../../../components/customer/dashboard/layouts/LayoutPage";
import FireHydrant from "./FireHydrant";
const COMMON_TAB = [
  { value: "1", label: "Dashboard", disabled: false },
  { value: "2", label: "Layouts", disabled: false },
];

const Dashboard = () => {
  const [value, setValue] = useState("1");
  const [selectedPlant, setSelectedPlant] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [plants, setPlants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [plantImage, setPlantImage] = useState("");
  const [managerDetails, setManagerDetails] = useState({
    name: "",
    phone: "",
  });
  const name = useSelector((state) => state.user.name);
  const [row2CardData, setRow2CardData] = useState([]);
  const [imageUploading, setImageUploading] = useState(false);

  const fetchPlats = async () => {
    setIsLoading(true);
    const response = await getAllPlantNames();
    if (response.status === 200) {
      setPlants(response.data.allPlants);
      setSelectedPlant(response.data?.allPlants[0]?._id || "");
      setManagerDetails({
        name: response.data.allPlants[0]?.managerId?.userId?.name,
        phone: response.data.allPlants[0]?.managerId?.userId?.phone,
      });
      setPlantImage(response.data.allPlants[0]?.plantImage);
    }
    setIsLoading(false);
  };

  const fetchCategories = async () => {
    setIsLoading(true);
    const response = await getMyCategorieNames();
    if (response.status === 200) {
      setCategories(response.data.categories?.categories);
      setSelectedCategory(
        response.data.categories.categories[0].categoryId?.categoryName || ""
      );
      setCategoryId(
        response.data.categories.categories[0].categoryId?._id || ""
      );
    }
    setIsLoading(false);
  };

  const fetchDashboardData = async (data) => {
    setIsLoading(true);
    const response = await getDashboardData(data);

    if (response.status === 200) {
      setDashboardData(response.data);
      setRow2CardData(response.data.assets);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPlats();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedPlant && selectedCategory) {
      fetchDashboardData({
        plantId: selectedPlant,
        categoryName: selectedCategory,
      });
    }
  }, [selectedPlant, selectedCategory]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handlePlantChange = (event) => {
    const selectedPlantId = event.target.value;
    setSelectedPlant(event.target.value);

    const selectedPlantData = plants.find(
      (plant) => plant._id === selectedPlantId
    );

    if (selectedPlantData && selectedPlantData.managerId?.userId) {
      setManagerDetails({
        name: selectedPlantData.managerId?.userId?.name,
        phone: selectedPlantData.managerId?.userId?.phone,
      });
      setPlantImage(selectedPlantData.plantImage);
    } else {
      setPlantImage("");
      setManagerDetails({ name: "", phone: "" });
    }
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setCategoryId(
      categories.find((c) => c.categoryId.categoryName == event.target.value)
        .categoryId._id
    );
  };

  const renderTabContent = (tabValue) => {
    if (tabValue === "1") {
      if (!selectedPlant || !selectedCategory) {
        return <Box>Select a category and plant first</Box>;
      }
      if (isLoading) {
        return <Spinner />;
      }
      if (selectedCategory === "Pump Room") {
        return (
          <>
            {dashboardData && (
              <PumpRoom
                categoryId={categoryId}
                selectedPlant={selectedPlant}
                row2CardData={row2CardData}
              />
            )}
          </>
        );
      } else if (selectedCategory === "Fire Extinguishers") {
        return (
          <Box>
            {dashboardData && (
              <FireExtingusher
                categoryId={categoryId}
                selectedPlant={selectedPlant}
                timestamp={new Date()}
              />
            )}
          </Box>
        );
      } else if (selectedCategory?.startsWith("Fire Hydrant")) {
        return (
          <Box>
            {dashboardData && (
              <FireHydrant
                categoryId={categoryId}
                selectedPlant={selectedPlant}
                timestamp={new Date()}
              />
            )}
          </Box>
        );
      } else {
        return <Box>Select a category</Box>;
      }
    }
    if (tabValue === "2") {
      return <LayoutPage selectedPlantId={selectedPlant} />;
    }
    return null;
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("_id", selectedPlant);
    formData.append("plantImage", file);
    setImageUploading(true);
    try {
      const response = await editPlantImage(formData);

      if (response.status == 200) {
        setPlantImage(response.data.imageUrl);
      } else {
        console.error("Image upload failed");
      }
    } catch (error) {
      console.log("Error uploading image", error);
    } finally {
      setImageUploading(false);
    }
  };
  return (
    <>
      <PageContainer title="Dashboard" description="This is the Dashboard page">
        <div className="bg-gray-100 px-2 space-y-4 font-[Figtree]">
          <div className="font-[Figtree]">
            {/* Main DashboardHeader */}
            <div className="flex flex-col gap-4">
              <div className="p-2 md:px-3 md:py-3 flex flex-col md:flex-row md:items-center justify-between bg-white rounded-2xl shadow-sm">
                {/* Left Section - Company Info & Navigation */}
                <div className="flex items-center space-x-8">
                  {/* Company Image & Name */}
                  <div className="flex items-center space-x-3">
                    <div className="w-fit h-fit ml-4 mr-5 border-1 border-[#E3E3E3] rounded-md flex items-center justify-content-center text-white font-bold">
                      <Box
                        sx={{ position: "relative", display: "inline-block" }}
                        onClick={() =>
                          document.getElementById("image-upload").click()
                        }
                      >
                        {imageUploading ? (
                          <Skeleton
                            variant="circular"
                            width={75}
                            height={75}
                            animation="wave"
                            sx={{ bgcolor: "grey.300" }}
                          />
                        ) : (
                          <Avatar
                            sx={{
                              width: 75,
                              height: 75,
                              borderRadius: 1,
                              border: "1px solid #E3E3E3",
                            }}
                            src={plantImage}
                          />
                        )}

                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          id="image-upload"
                          onChange={handleFileChange}
                        />
                      </Box>
                    </div>
                    <div>
                      <div className="text-sm md:text-base text-black">
                        Hello <span className="text-base md:text-2xl">👋</span>
                      </div>
                      <p className="md:text-lg font-medium text-black">
                        {name}
                      </p>

                      {/* Dropdown Menus under the name */}
                      <div className="flex flex-col md:flex-row items-center md:space-x-4 gap-1 mt-1">
                        {/* Main Plant Dropdown */}
                        <div className="relative border-1 border-[#E3E3E3] p-0.5 md:p-1 rounded-lg w-full text-left">
                          <Select
                            size="small"
                            value={selectedPlant}
                            variant="standard"
                            onChange={handlePlantChange}
                            displayEmpty
                            sx={{
                              "&:before, &:after": {
                                display: "none",
                                width: 150,
                              },
                              "& .MuiSelect-select": {
                                backgroundColor: "transparent",
                              },
                            }}
                          >
                            <MenuItem value="" disabled className="text-right">
                              Select one
                            </MenuItem>
                            {plants.map((plant) => (
                              <MenuItem value={plant._id} key={plant._id}>
                                {plant.plantName}
                              </MenuItem>
                            ))}
                          </Select>
                        </div>

                        {/* Pump Room Dropdown */}
                        <div className="relative border border-[#E3E3E3] p-0.5 md:p-1 rounded-lg w-full text-left">
                          <Select
                            size="small"
                            variant="standard"
                            value={selectedCategory}
                            onChange={handleCategoryChange}
                            label="Select Category"
                            displayEmpty
                            sx={{
                              "&:before, &:after": {
                                display: "none",
                              },
                              "& .MuiSelect-select": {
                                backgroundColor: "transparent",
                              },
                            }}
                          >
                            <MenuItem value="" disabled>
                              Select one
                            </MenuItem>
                            {categories.map((category) => (
                              <MenuItem
                                value={category.categoryId.categoryName}
                                key={category.categoryId._id}
                              >
                                {category.categoryId.categoryName}
                              </MenuItem>
                            ))}
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Section - Manager Info */}
                <div className="flex flex-col gap-2 md:items-center mt-3 space-x-4">
                  <div className="text-right flex gap-3 items-center">
                    <div className="text-xs md:text-sm text-[#727272]">
                      Manager Name:
                    </div>
                    <div className="text-xs md:text-sm font-medium">
                      {managerDetails.name}
                    </div>
                  </div>
                  <div className="text-right flex gap-3 items-center">
                    <div className="text-xs md:text-sm text-[#727272]">
                      Contact No:
                    </div>
                    <div className="text-xs md:text-sm font-medium">
                      {managerDetails.phone}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <TabContext value={value}>
            <div className="flex gap-2 md:gap-3 bg-white p-3 rounded-2xl shadow-sm">
              {COMMON_TAB.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => handleChange(null, tab.value)}
                  className={`px-3 py-2 md:px-4 md:py-2 text-sm md:text-base font-medium transition-colors ${
                    value === tab.value
                      ? "text-white bg-orange-500 rounded"
                      : "hover:bg-gray-50 rounded"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </TabContext>
          <TabContext value={value}>
            {COMMON_TAB.map((tab) => (
              <TabPanel key={tab.value} value={tab.value} sx={{ p: 0 }}>
                {renderTabContent(tab.value)}
              </TabPanel>
            ))}
          </TabContext>
        </div>
      </PageContainer>
    </>
  );
};

export default Dashboard;
