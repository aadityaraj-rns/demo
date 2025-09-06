import PropTypes from "prop-types";
import { Avatar, Box, MenuItem, Select, Skeleton } from "@mui/material";

const DashboardHeader = ({
  plants,
  categories,
  selectedCategory,
  handleCategoryChange,
  selectedPlant,
  handlePlantChange,
  managerDetails,
  name,
  plantImage,
  imageUploading,
  handleFileChange,
}) => {
  return (
    <div className="font-[Figtree]">
      {/* Main DashboardHeader */}
      <div className="flex flex-col gap-4">
        <div className="px-6 py-3 flex items-center justify-between bg-white rounded-2xl shadow-sm">
          {/* Left Section - Company Info & Navigation */}
          <div className="flex items-center space-x-8">
            {/* Company Image & Name */}
            <div className="flex items-center space-x-3">
              <div className="w-23 h-23 border-1 border-[#E3E3E3] rounded-md flex items-center justify-content-center text-white font-bold">
                <Box
                  sx={{ position: "relative", display: "inline-block" }}
                  onClick={() =>
                    document.getElementById("image-upload").click()
                  }
                >
                  {imageUploading ? (
                    <Skeleton
                      variant="circular"
                      width={60}
                      height={60}
                      animation="wave"
                      sx={{ bgcolor: "grey.300" }}
                    />
                  ) : (
                    <Avatar
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: 1,
                        border: "1px solid black",
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
                <div className="text-base text-black">
                  Hello <span className="text-2xl">👋</span>
                </div>
                <p className="text-lg font-medium text-black">{name}</p>

                {/* Dropdown Menus under the name */}
                <div className="flex items-center space-x-4 mt-1">
                  {/* Main Plant Dropdown */}
                  <div className="relative border-1 border-[#E3E3E3] p-1 rounded-lg">
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
                      <MenuItem value="" disabled>
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
                  <div className="relative border border-[#E3E3E3] p-10 rounded-lg">
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
          <div className="hidden">
          <div className="flex flex-col gap-2 items-center space-x-4 ]">
            <div className="text-right flex gap-3">
              <div className="text-sm text-[#727272]">Manager Name:</div>
              <div className="text-base font-medium">{managerDetails.name}</div>
            </div>
            <div className="text-right flex gap-3">
              <div className="text-sm text-[#727272]">Contact No:</div>
              <div className="text-base font-medium">
                {managerDetails.phone}
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};
DashboardHeader.propTypes = {
  plants: PropTypes.any,
  categories: PropTypes.any,
  selectedCategory: PropTypes.any,
  handleCategoryChange: PropTypes.any,
  selectedPlant: PropTypes.any,
  handlePlantChange: PropTypes.any,
  managerDetails: PropTypes.any,
  name: PropTypes.any,
  plantImage: PropTypes.any,
  imageUploading: PropTypes.any,
  handleFileChange: PropTypes.any,
};

export default DashboardHeader;
