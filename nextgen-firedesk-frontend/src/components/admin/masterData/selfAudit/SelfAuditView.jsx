import React, { useRef } from "react";
import DownloadableComponent from "./SelfAuditDownloadView";
import { useLocation } from "react-router-dom";

const SelfAuditView = () => {
    const location = useLocation();
    const { data } = location.state || {};
    const componentRef = useRef();

    return (
      <div style={{ padding: "20px" }}>
        <DownloadableComponent ref={componentRef} data={data} />
      </div>
    );
};

export default SelfAuditView;
