import React from "react";
import { List, ListItem, ListItemIcon, ListItemText, Paper, Typography } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SellerOverview from "./SellerOverview";

const SellerSidebar = ({ selectedMenu, setSelectedMenu }) => {
  const menuItems = [
    { key: "profile", label: "Hồ Sơ", icon: <AccountCircleIcon color="primary" /> },
    { key: "notifications", label: "Thông Báo", icon: <NotificationsIcon color="primary" /> },
    { key: "addresses", label: "Địa Chỉ", icon: <LocationOnIcon color="error" /> },
    { key: "vouchers", label: "Kho Voucher", icon: <CardGiftcardIcon /> },
    { key: "overview", label: "Tổng quan", icon: <ShoppingCartIcon /> },
    {key: "addProduct", label: "Thêm sản phẩm", icon: <LibraryAddIcon/>}
  ];

  return (
    <Paper
      elevation={1}
      style={{
        width: "250px",
        padding: "10px",
        position: "absolute",
        left: 2,
        top: 123,
        height: "100vh",
        borderRight: "1px solid #ddd",
      }}
    >
      
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.key}
            onClick={() => setSelectedMenu(item.key)}
            sx={{
              backgroundColor: selectedMenu === item.key ? "#e3f2fd" : "transparent", // Màu nền khi được chọn
              "&:hover": { backgroundColor: "#bbdefb" }, // Màu nền khi hover
              borderRadius: "5px",
              marginBottom: "5px",
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default SellerSidebar;
