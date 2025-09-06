import Header from "./Header";
import PumpDetailsPanel from "./PumpDetailsPanel";
import PumpDetailsGraph from "./PumpDetailsGraph";
import MaintenanceSummary from "./MaintenanceSummary";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPumpKnowMoreData } from "../../../../../api/organization/internal";

const KnowMore = () => {
  const [data, setData] = useState({});
  const location = useLocation();
  const { assets, pumpIotData, timestamp } = location.state;
  console.log(timestamp);
  const [iotNumber, setIotNumber] = useState(1);
  const [AS, setAS] = useState("AS1");
  //   const [TS, setTS] = useState("TS1");
  const [PS, setPS] = useState("PS1");
  const [selectedAsset, setSelectedAsset] = useState(assets[0]?._id);

  const handleAssetChange = (event) => {
    setSelectedAsset(event.target.value);
  };

  const selectedAssetData = assets.find((asset) => asset._id === selectedAsset);

  useEffect(() => {
    const name = selectedAssetData?.productId?.productName
      ?.toString()
      ?.toUpperCase();
    name == "ELECTRICAL DRIVEN PUMP"
      ? setIotNumber(2)
      : name == "JOCKEY PUMP"
      ? setIotNumber(1)
      : name == "DIESEL ENGINE"
      ? setIotNumber(3)
      : setIotNumber(1);
    if (iotNumber == 2) {
      setAS("AS2");
      //   setTS("TS2");
      setPS("PS2");
    } else if (iotNumber == 3) {
      setAS("AS3");
      //   setTS("TS3");
      setPS("PS3");
    }
  }, [selectedAssetData, iotNumber]);

  useEffect(() => {
    const fetchData = async (selectedAsset) => {
      const data = {
        iotNumber,
        assetId: selectedAsset,
      };
      const response = await getPumpKnowMoreData(data);
      if (response.status == 200) {
        setData(response.data);
      }
    };

    fetchData(selectedAsset);
  }, [selectedAsset, iotNumber]);

  return (
    <div className="p-3 bg-[#F9F9F9]">
      <Header
        assets={assets}
        selectedAssetData={selectedAssetData}
        handleAssetChange={handleAssetChange}
        selectedAsset={selectedAsset}
        condition={
          pumpIotData[PS] == 1 ? "ON" : pumpIotData[PS] == 0 ? "OFF" : "-"
        }
        mode={
          pumpIotData[AS] == 1 ? "Auto" : pumpIotData[AS] == 0 ? "Manual" : "-"
        }
      />
      <PumpDetailsPanel
        age={data?.ageString}
        totalOnHours={data?.totalOnHours}
        lastServiceActivity={data?.lastServiceActivity}
      />
      <PumpDetailsGraph iotNumber={iotNumber} selectedAsset={selectedAsset} />
      <MaintenanceSummary
        pendingByRange={data?.pendingByRange}
        completedStatusCount={data?.completedStatusCount}
        serviceTypeCount={data?.serviceTypeCount}
        lastFiveServiceActivity={data?.lastFiveServiceActivity}
      />
    </div>
  );
};

export default KnowMore;
