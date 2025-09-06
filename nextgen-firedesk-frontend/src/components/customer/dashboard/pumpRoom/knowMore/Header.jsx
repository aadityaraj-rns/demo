import PropTypes from "prop-types";
import { MenuItem, Select } from "@mui/material";

const Header = ({
  assets,
  selectedAssetData,
  handleAssetChange,
  selectedAsset,
  condition,
  mode,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm font-[Figtree] mb-6">
      <div className="flex items-center justify-between">
        {/* Left Section - Machine Info */}
        <div className="flex items-center space-x-3">
          {/* Machine Image */}
          <div className="w-18 h-18 bg-[#F9F9F9] border-1 rounded-xl flex items-center justify-center">
            <img
              src={
                selectedAssetData?.productId?.variants.find(
                  (p) => p?.type == selectedAssetData?.type
                )?.image
              }
              className="w-20 h-20 md:w-18 md:h-18 rounded-xl border-1"
            />
          </div>

          {/* Machine Details */}
          <div className="relative flex flex-col">
            {/* Machine Name with Dropdown */}
            <div className="border-1 border-[#E3E3E3] px-2 py-1 rounded-lg w-48 md:w-55">
              <Select
                size=""
                value={selectedAsset}
                variant="standard"
                onChange={handleAssetChange}
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
                <MenuItem
                  value=""
                  disabled
                  className="text-right text-lg font-medium"
                >
                  Select one
                </MenuItem>
                {assets.map((asset) => (
                  <MenuItem value={asset._id} key={asset._id}>
                    {asset?.productId?.productName}
                  </MenuItem>
                ))}
              </Select>
            </div>

            {/* Machine ID and Location */}
            <div className="flex items-center space-x-2 mt-2">
              <span className="text-xs md:text-base text-[#727272] border-r-2 border-[#E3E3E3] pr-2">
                {selectedAssetData?.assetId}
              </span>
              <span className="text-xs md:text-base text-[#727272]">
                {selectedAssetData?.location}
              </span>
            </div>
          </div>
        </div>

        {/* Right Section - Status & Mode */}
        <div className="text-right hidden md:block">
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-2 items-center">
              <div className="text-lg text-[#727272]">Status:</div>
              <div className="text-lg font-medium">{condition}</div>
            </div>
            <div className="flex gap-2 items-center">
              <div className="text-lg text-[#727272]">Mode:</div>
              <div className="text-lg font-medium">{mode}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="md:hidden flex mt-4">
        <div className="flex flex-col">
          <div className="flex gap-2 items-center">
            <div className="text-lg text-[#727272]">Status:</div>
            <div className="text-lg font-medium">{condition}</div>
          </div>
          <div className="flex gap-2 items-center">
            <div className="text-lg text-[#727272]">Mode:</div>
            <div className="text-lg font-medium">{mode}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
Header.propTypes = {
  assets: PropTypes.any,
  selectedAssetData: PropTypes.any,
  handleAssetChange: PropTypes.any,
  selectedAsset: PropTypes.any,
  condition: PropTypes.any,
  mode: PropTypes.any,
};
export default Header;
