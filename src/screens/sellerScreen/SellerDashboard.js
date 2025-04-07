import React, { useState } from "react";
import { Container, Paper } from "@mui/material";

import Profile from "../accountSettingPage/Profile";
import Notifications from "../accountSettingPage/Notification";
import Addresses from "../accountSettingPage/Addresses";
import Vouchers from "../accountSettingPage/Vouchers";
import Orders from "../accountSettingPage/Orders";
import Sidebar from "../accountSettingPage/Sidebar";
import AddProductForm from "./AddProductForm";
import SellerSidebar from "./SellerSidebar";
import SellerOverview from "./SellerOverview";


const SellerDashboard = () => {
  const [selectedMenu, setSelectedMenu] = useState("overview"); // Mặc định hiển thị Profile
  

  // Chọn nội dung hiển thị
  const renderContent = () => {
    switch (selectedMenu) {
      case "profile":
        return <Profile />;
      case "addProduct":
        return <AddProductForm />;
      case "addresses":
        return <Addresses />;
      case "vouchers":
        return <Vouchers />;
      case "overview":
        return <SellerOverview />;
      default:
        return <Profile />;
    }
  };

  return (
    <Container maxWidth="lg">
      {/* Sidebar */}
      <SellerSidebar selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} />

      {/* Nội dung chính */}
      <Paper elevation={1} style={{ marginLeft: "100px", padding: "5px", width:'100%' }}>
        {renderContent()}
      </Paper>
    </Container>
  );
};

export default SellerDashboard;
