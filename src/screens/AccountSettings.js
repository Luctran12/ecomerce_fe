import React, { useState } from "react";
import { Container, Paper } from "@mui/material";
import Sidebar from "../screens/accountSettingPage/Sidebar";
import Profile from "./accountSettingPage/Profile";
import Notifications from "./accountSettingPage/Notification";
import Addresses from "./accountSettingPage/Addresses";
import Vouchers from "./accountSettingPage/Vouchers";
import Orders from "./accountSettingPage/Orders";


const AccountSettings = () => {
  const [selectedMenu, setSelectedMenu] = useState("profile"); // Mặc định hiển thị Profile

  // Chọn nội dung hiển thị
  const renderContent = () => {
    switch (selectedMenu) {
      case "profile":
        return <Profile />;
      case "notifications":
        return <Notifications />;
      case "addresses":
        return <Addresses />;
      case "vouchers":
        return <Vouchers />;
      case "orders":
        return <Orders />;
      default:
        return <Profile />;
    }
  };

  return (
    <Container maxWidth="lg">
      {/* Sidebar */}
      <Sidebar selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} />

      {/* Nội dung chính */}
      <Paper elevation={3} style={{ marginLeft: "270px", padding: "20px" }}>
        {renderContent()}
      </Paper>
    </Container>
  );
};

export default AccountSettings;
