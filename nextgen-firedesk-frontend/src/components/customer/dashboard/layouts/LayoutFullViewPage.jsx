import { useParams } from "react-router-dom";
import CustomImageList from "./LayoutPage";

export default function LayoutFullViewPage() {
  const { plantId } = useParams();

  return <CustomImageList selectedPlantId={plantId} />;
}
