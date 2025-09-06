import {
  Box,
  IconButton,
  Typography,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Autocomplete,
  TextField,
  Grid,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormGroup,
  Checkbox,
} from "@mui/material";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import { Close, ExpandMore, LocationOn, RestartAlt } from "@mui/icons-material";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import {
  getFilteredAssetsByMultiCategorySinglePlant,
  getLayoutMarkers,
  updateLayoutMarkers,
} from "../../../../api/organization/internal";
import { dialogTitleStyles } from "../../../../utils/helpers/customDialogTitleStyle";
import { Link } from "react-router-dom";

const ZoomableImageWithMarkers = ({
  imageUrl,
  selectedPlantId,
  layoutName,
}) => {
  const [scale, setScale] = useState(1);
  const [allMarkers, setAllMarkers] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [assetOptions, setAssetOptions] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState("");
  const [clickPos, setClickPos] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);
  const [categoryNames, setCategoryNames] = useState([]);
  const [types, setTypes] = useState([]);
  const [locations, setLocations] = useState([]);
  const [healthStatuses, setHealthStatuses] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    categoryName: [],
    type: [],
    location: [],
    healthStatus: [],
  });

  useEffect(() => {
    const fetchMarkers = async () => {
      if (!selectedPlantId || !layoutName) return;

      try {
        const response = await getLayoutMarkers({
          plantId: selectedPlantId,
          layoutName,
        });

        if (response.status === 200) {
          const fetchedMarkers = response.data.markers;

          setAllMarkers(fetchedMarkers);
          setCategoryNames([
            ...new Set(
              fetchedMarkers.map((m) => m.categoryName).filter(Boolean)
            ),
          ]);
          setTypes([
            ...new Set(fetchedMarkers.map((m) => m.type).filter(Boolean)),
          ]);
          setLocations([
            ...new Set(fetchedMarkers.map((m) => m.location).filter(Boolean)),
          ]);
          setHealthStatuses([
            ...new Set(
              fetchedMarkers.map((m) => m.healthStatus).filter(Boolean)
            ),
          ]);
        }
      } catch (error) {
        console.error("Failed to fetch markers", error);
      }
    };

    fetchMarkers();
  }, [selectedPlantId, layoutName]);

  useEffect(() => {
    const filtered = allMarkers.filter((marker) => {
      const categoryMatch =
        selectedFilters.categoryName.length === 0 ||
        selectedFilters.categoryName.includes(marker.categoryName);
      const typeMatch =
        selectedFilters.type.length === 0 ||
        selectedFilters.type.includes(marker.type);
      const locationMatch =
        selectedFilters.location.length === 0 ||
        selectedFilters.location.includes(marker.location);
      const healthMatch =
        selectedFilters.healthStatus.length === 0 ||
        selectedFilters.healthStatus.includes(marker.healthStatus);

      return categoryMatch && typeMatch && locationMatch && healthMatch;
    });

    setMarkers(filtered);
  }, [selectedFilters, allMarkers]);

  const handleZoom = (direction) => {
    setScale((prev) =>
      Math.max(0.4, Math.min(prev + (direction === "in" ? 0.2 : -0.2), 3))
    );
  };

  const handleImageClick = async (e) => {
    const img = imageRef.current;
    const bounds = img.getBoundingClientRect();
    const x = ((e.clientX - bounds.left) / bounds.width) * 100;
    const y = ((e.clientY - bounds.top) / bounds.height) * 100;
    setClickPos({ x, y });

    try {
      const response = await getFilteredAssetsByMultiCategorySinglePlant({
        plantId: selectedPlantId,
      });
      if (response.status === 200) {
        setAssetOptions(response.data.assets);
        setDialogOpen(true);
      } else {
        alert("No assets found.");
      }
    } catch (err) {
      console.error("Error fetching assets:", err);
      alert("Error fetching assets.");
    }
  };

  const handlePlaceMarker = async () => {
    const selectedAsset = assetOptions.find(
      (asset) => asset._id === selectedAssetId
    );

    const existingMarker = markers.find((m) => m._id === selectedAssetId);

    let updatedMarkers;

    if (existingMarker) {
      const confirmMove = window.confirm(
        "This asset is already placed on the layout. Do you want to change its location?"
      );
      if (!confirmMove) {
        setDialogOpen(false);
        return;
      }

      // Remove existing and add new marker
      updatedMarkers = [
        ...markers.filter((m) => m._id !== selectedAssetId),
        {
          x: clickPos.x,
          y: clickPos.y,
          label: selectedAsset.assetId,
          _id: selectedAsset._id,
        },
      ];
    } else {
      updatedMarkers = [
        ...markers,
        {
          x: clickPos.x,
          y: clickPos.y,
          label: selectedAsset.assetId,
          _id: selectedAsset._id,
        },
      ];
    }
    setDialogOpen(false);
    setSelectedAssetId("");
    try {
      const response = await updateLayoutMarkers({
        plantId: selectedPlantId,
        layoutName,
        markers: updatedMarkers.map(({ _id, x, y }) => ({
          assetId: _id,
          x,
          y,
        })),
      });

      if (response.status === 200) {
        const fetchedMarkers = response.data.map((marker) => ({
          _id: marker.assetId._id,
          x: marker.x,
          y: marker.y,
          label: marker.assetId,
        }));
        setMarkers(fetchedMarkers);
        console.log("Markers updated successfully");
      } else {
        alert("Failed to update markers.");
      }
    } catch (error) {
      console.error("Error saving markers:", error);
      alert("Error saving markers.");
    }
  };

  // const handleFilterChange = (field) => (event) => {
  //   setSelectedFilters((prev) => ({
  //     ...prev,
  //     [field]: event.target.checked ? event.target.name : "",
  //   }));
  // };

  const handleFilterChange = (field) => (event) => {
    const { name, checked } = event.target;
    setSelectedFilters((prev) => {
      const current = prev[field] || [];
      return {
        ...prev,
        [field]: checked
          ? [...current, name]
          : current.filter((val) => val !== name),
      };
    });
  };

  return (
    <>
      <Grid container spacing={0.5} p={0.5}>
        <Grid item xs={12}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="body2" color={"secondary"} pt={1}>
              NOTE: Click on the image to add asset markers. Zoom in/out with
              the buttons.
            </Typography>

            <Box display={"flex"}>
              <IconButton onClick={() => handleZoom("in")}>
                <ZoomInIcon fontSize="small" />
              </IconButton>
              <IconButton onClick={() => handleZoom("out")}>
                <ZoomOutIcon fontSize="small" />
              </IconButton>
              <IconButton onClick={() => setScale(1)} title="Reset Zoom">
                <RestartAlt fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          md={3}
          sx={{
            height: { md: "85vh" },
            width: "auto",
            overflow: "auto",
            border: "1px solid #ccc",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": {
              display: "none",
            },
            p: 0.4,
          }}
        >
          {/* Category */}
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="body2">Category</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormGroup>
                {categoryNames.map((value) => (
                  <FormControlLabel
                    key={value}
                    control={
                      <Checkbox
                        name={value}
                        checked={selectedFilters.categoryName.includes(value)}
                        onChange={handleFilterChange("categoryName")}
                      />
                    }
                    label={<Typography variant="body2">{value}</Typography>}
                  />
                ))}
              </FormGroup>
            </AccordionDetails>
          </Accordion>

          {/* Type */}
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="body2">Type</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormGroup>
                {types.map((value) => (
                  <FormControlLabel
                    key={value}
                    control={
                      <Checkbox
                        name={value}
                        checked={selectedFilters.type.includes(value)}
                        onChange={handleFilterChange("type")}
                      />
                    }
                    label={<Typography variant="body2">{value}</Typography>}
                  />
                ))}
              </FormGroup>
            </AccordionDetails>
          </Accordion>

          {/* Location */}
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="body2">Location</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormGroup>
                {locations.map((value) => (
                  <FormControlLabel
                    key={value}
                    control={
                      <Checkbox
                        name={value}
                        checked={selectedFilters.location.includes(value)}
                        onChange={handleFilterChange("location")}
                      />
                    }
                    label={<Typography variant="body2">{value}</Typography>}
                  />
                ))}
              </FormGroup>
            </AccordionDetails>
          </Accordion>

          {/* Health Status */}
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="body2">Health Status</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormGroup>
                {healthStatuses.map((value) => (
                  <FormControlLabel
                    key={value}
                    control={
                      <Checkbox
                        name={value}
                        checked={selectedFilters.healthStatus.includes(value)}
                        onChange={handleFilterChange("healthStatus")}
                      />
                    }
                    label={<Typography variant="body2">{value}</Typography>}
                  />
                ))}
              </FormGroup>
            </AccordionDetails>
          </Accordion>
        </Grid>
        <Grid
          item
          xs={12}
          md={9}
          sx={{
            height: "85vh",
            overflow: "auto",
            border: "1px solid #ccc",
            position: "relative",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {/* Image & Markers */}
          <Box
            sx={{
              position: "relative",
              transform: `scale(${scale})`,
              transformOrigin: "top left",
              width: "fit-content",
              height: "fit-content",
            }}
          >
            <img
              ref={imageRef}
              src={imageUrl}
              alt="Zoomable"
              onClick={handleImageClick}
              style={{
                height: "84vh",
                display: "block",
                cursor: "crosshair",
              }}
            />

            {markers.map((marker, index) => (
              <Tooltip
                key={index}
                title={
                  <Link to={`/customer/assets/view/${marker.label._id}`}>
                    Asset Id: {marker.label.assetId}
                  </Link>
                }
                arrow
                enterTouchDelay={0}
                componentsProps={{
                  tooltip: {
                    sx: {
                      bgcolor: "white",
                      color: "black",
                      boxShadow: 2,
                      fontSize: 13,
                      borderRadius: 1,
                      maxWidth: 300,
                    },
                    arrow: {
                      color: "white",
                    },
                  },
                }}
              >
                <LocationOn
                  sx={{
                    position: "absolute",
                    top: `${marker.y}%`,
                    left: `${marker.x}%`,
                    fontSize: 18,
                    color:
                      marker.label.healthStatus == "Healthy" ? "green" : "red",
                    transform: "translate(-50%, -100%)",
                    pointerEvents: "auto",
                    zIndex: 2,
                  }}
                />
              </Tooltip>
            ))}
          </Box>

          {/* Dialog to select asset */}
          <Dialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            fullWidth
            maxWidth="sm"
            container={document.fullscreenElement || undefined}
          >
            <DialogTitle sx={dialogTitleStyles}>
              Select an asset
              <IconButton
                aria-label="close"
                onClick={() => setDialogOpen(false)}
              >
                <Close sx={{ color: "white" }} />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Autocomplete
                size="small"
                options={assetOptions}
                getOptionLabel={(option) => option.assetId || ""}
                value={
                  assetOptions.find((a) => a._id === selectedAssetId) || null
                }
                onChange={(event, newValue) => {
                  setSelectedAssetId(newValue?._id || "");
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={
                      <>
                        {"Asset"}
                        <span style={{ color: "red" }}> *</span>
                      </>
                    }
                    placeholder="Select asset name"
                    InputLabelProps={{ shrink: true }}
                    sx={{ mt: 2 }}
                    fullWidth
                  />
                )}
              />
            </DialogContent>
            <DialogActions>
              <Button
                variant="contained"
                onClick={handlePlaceMarker}
                disabled={!selectedAssetId}
                size="small"
              >
                Place Marker
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
      </Grid>
    </>
  );
};

ZoomableImageWithMarkers.propTypes = {
  selectedPlantId: PropTypes.string,
  imageUrl: PropTypes.string,
  layoutName: PropTypes.string.isRequired,
};

ZoomableImageWithMarkers.defaultProps = {
  imageUrl:
    "https://cloud.netlifyusercontent.com/assets/344dbf88-fdf9-42bb-adb4-46f01eedd629/8d374c1e-228a-47e8-be5b-10fa1f4d40c8/mrh-css-grid-fig-01-large-opt.png",
};

export default ZoomableImageWithMarkers;
