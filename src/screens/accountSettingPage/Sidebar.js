import React from "react";
import { List, ListItem, ListItemIcon, ListItemText, Paper, Typography } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const Sidebar = ({ selectedMenu, setSelectedMenu }) => {
  const menuItems = [
    { key: "profile", label: "Hồ Sơ", icon: <AccountCircleIcon color="primary" /> },
    { key: "notifications", label: "Thông Báo", icon: <NotificationsIcon color="primary" /> },
    { key: "addresses", label: "Địa Chỉ", icon: <LocationOnIcon color="error" /> },
    { key: "vouchers", label: "Kho Voucher", icon: <CardGiftcardIcon /> },
    { key: "orders", label: "Đơn Mua", icon: <ShoppingCartIcon /> },
  ];

  return (
    <Paper
      elevation={3}
      style={{
        width: "250px",
        padding: "10px",
        position: "absolute",
        left: 90,
        top: 143,
        height: "100vh",
        borderRight: "1px solid #ddd",
      }}
    >
      <Typography variant="h6" align="center" sx={{ marginBottom: 2 }}>
        Tài Khoản
      </Typography>
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

export default Sidebar;
