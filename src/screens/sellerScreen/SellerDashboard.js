import { Container, Paper } from "@mui/material";
import React, { useState } from "react";

import Addresses from "../accountSettingPage/Addresses";
import Profile from "../accountSettingPage/Profile";
import Vouchers from "../accountSettingPage/Vouchers";
import AddProductForm from "./AddProductForm";
import ProductByStore from "./ProductByStore";
import SellerOverview from "./SellerOverview";
import SellerSidebar from "./SellerSidebar";
import ShopProfileForm from "./ShopProfileForm ";

const SellerDashboard = () => {
  const [selectedMenu, setSelectedMenu] = useState("overview"); // Mặc định hiển thị Profile

  // Chọn nội dung hiển thị
  const renderContent = () => {
    switch (selectedMenu) {
      case "profile":
        return <ShopProfileForm />;
      case "addProduct":
        return <AddProductForm />;
      case "addresses":
        return <Addresses />;
      case "vouchers":
        return <Vouchers />;
      case "overview":
        return <SellerOverview />;
      case "updateProduct":
        return <ProductByStore />;
      default:
        return <Profile />;
    }
  };

  return (
    <Container maxWidth="lg">
      {/* Sidebar */}
      <SellerSidebar
        selectedMenu={selectedMenu}
        setSelectedMenu={setSelectedMenu}
      />

      {/* Nội dung chính */}
      <Paper
        elevation={1}
        style={{ marginLeft: "100px", padding: "5px", width: "100%" }}
      >
        {renderContent()}
      </Paper>
    </Container>
  );
};

export default SellerDashboard;
