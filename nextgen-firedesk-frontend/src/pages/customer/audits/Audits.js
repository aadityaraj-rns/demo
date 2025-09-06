import React, { useEffect, useState } from "react";
import PageContainer from "../../../components/container/PageContainer";
import Breadcrumb from "../../../layouts/full/shared/breadcrumb/Breadcrumb";
import { Divider, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box } from "@mui/system";
import { IconHeart, IconPhone } from "@tabler/icons";
import Audit from "../../../components/customer/audits/Audit";
import SelfAudit from "../../../components/customer/audits/SelfAudit";
import { getAudits } from "../../../api/organization/internal";
import Toaster from "../../../components/toaster/Toaster";
import AddSelfAudit from "./AddSelfAudit";
import Spinner from "../../admin/spinner/Spinner";

const BCrumb = [
  {
    to: "/customer",
    title: "Home",
  },
  {
    title: "Audits",
  },
];

const Audits = () => {
  const [value, setValue] = React.useState("1");
  const [addSuccess, setAddSuccess] = useState(false);
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const setAddToaster = async () => {
    setAddSuccess(true);
    setTimeout(() => setAddSuccess(false), 1500);
  };

  const fetchaudits = async () => {
    const response = await getAudits();
    if (response) {
      if (response?.status === 200) {
        setAudits(response.data.audits);
      }
      setLoading(false);
    } else if (response.error) {
      console.log(response.error.message);
    }
  };

  useEffect(() => {
    fetchaudits();
  }, []);

  const handleFormSubmit = () => {
    setValue("2");
  };
  const TAB = [
    {
      value: "1",
      icon: <IconPhone width={20} height={20} />,
      label: "Audit",
      disabled: false,
      content: (
        <Audit
          audits={audits}
          fetchaudits={fetchaudits}
          setAddToaster={setAddToaster}
        />
      ),
    },
    {
      value: "2",
      icon: <IconHeart width={20} height={20} />,
      label: "Self Compliance Audits",
      disabled: false,
      content: <SelfAudit />,
    },
    {
      value: "3",
      icon: <IconHeart width={20} height={20} />,
      label: "Add Self Audits",
      disabled: false,
      content: <AddSelfAudit />,
    },
  ];
  if (loading) {
    return <Spinner />;
  }
  return (
    <PageContainer title="Audits" description="this is Tabs page">
      <Breadcrumb title="Audits" items={BCrumb} />
      {/* <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6">Audits</Typography>
      </Box> */}

      <TabContext value={value}>
        <Box>
          <TabList
            variant="scrollable"
            scrollButtons="auto"
            onChange={handleChange}
            aria-label="lab API tabs example"
          >
            {TAB.map((tab, index) => (
              <Tab
                key={tab.value}
                label={tab.label}
                value={String(index + 1)}
              />
            ))}
          </TabList>
        </Box>
        <Divider />
        {TAB.map((panel, index) => (
          <TabPanel key={index} value={panel.value}>
            {panel.value === "1" ? (
              <Audit
                audits={audits}
                fetchaudits={fetchaudits}
                setAddToaster={setAddToaster}
              />
            ) : panel.value === "3" ? (
              <AddSelfAudit onSuccess={handleFormSubmit} />
            ) : (
              panel.content
            )}
          </TabPanel>
        ))}
      </TabContext>
      {addSuccess && (
        <Toaster title="Audit" message="Added successfully" color="success" />
      )}
    </PageContainer>
  );
};

export default Audits;
