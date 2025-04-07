import AccountCircle from "@mui/icons-material/AccountCircle";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import { alpha, styled } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../image/logo_shop.png";
import { Box, Menu, MenuItem } from "@mui/material";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  border: "1px solid white",
  backgroundColor: alpha("#ffffff", 0.1),
  "&:hover": {
    backgroundColor: alpha("#ffffff", 0.2),
  },
  display: "flex",
  alignItems: "center",
  width: "50%",
  maxWidth: "600px",
  padding: theme.spacing(0.5),
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "white",
  flexGrow: 1,
  padding: theme.spacing(1, 2),
}));

const Header = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(localStorage.getItem("userId")); // Khởi tạo trực tiếp từ localStorage
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);

  // Hàm cập nhật userId từ localStorage
  const updateUserId = () => {
    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId);
  };

  useEffect(() => {
    // Cập nhật userId khi mount
    updateUserId();

    // Thêm event listener cho sự kiện storage
    window.addEventListener("storage", updateUserId);

    // Thêm custom event listener cho các thay đổi trong cùng tab
    const handleStorageChange = () => {
      updateUserId();
    };
    
    window.addEventListener("storageChange", handleStorageChange);

    // Cleanup
    return () => {
      window.removeEventListener("storage", updateUserId);
      window.removeEventListener("storageChange", handleStorageChange);
    };
  }, []);

  // Trong component login của bạn, sau khi đăng nhập thành công, thêm dòng này:
  // window.dispatchEvent(new Event("storageChange"));

  const handleCartClick = () => {
    if (!userId) {
      navigate("/login");
    } else {
      navigate(`/cart/${userId}`);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const fetchSearchResults = () => {
    if (!searchQuery.trim()) return;
    navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      fetchSearchResults();
    }
  };

  const handleMouseEnter = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMouseLeave = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    setUserId(null);
    window.dispatchEvent(new Event("storageChange")); // Trigger event khi logout
    navigate("/login");
  };

  return (
    <AppBar
  position="static"
  sx={{
    backgroundColor: "#121212",
    color: "white",
    height: 110,
    display: "flex",
    justifyContent: "center",
  }}
>
  <Toolbar sx={{ display: "flex", justifyContent: "space-between", px: 5 }}>
    <div
      onClick={() => navigate("/")}
      style={{ marginLeft: 10, cursor: "pointer" }}
    >
      <img src={logo} alt="logo" width={80} height={80} style={{ borderRadius: 8 }} />
      <Typography variant="h5" component="div" sx={{ fontWeight: "bold" }}>
        L-SHOP
      </Typography>
    </div>

    <Button
      onClick={() => navigate("/seller-login")}
      sx={{ color: "white", mx: 1, "&:hover": { color: "#bbbbbb" } }}
    >
      Kênh người bán
    </Button>

    <Search>
      <StyledInputBase
        placeholder="Tìm kiếm sản phẩm..."
        inputProps={{ "aria-label": "search" }}
        value={searchQuery}
        onChange={handleSearchChange}
        onKeyPress={handleKeyPress}
      />
      <IconButton sx={{ color: "white" }} onClick={fetchSearchResults}>
        <SearchIcon />
      </IconButton>
    </Search>

    <Box sx={{ display: "flex", alignItems: "center" }}>
      <IconButton
        sx={{ color: "white", mx: 1, "&:hover": { color: "#bbbbbb" } }}
        onClick={handleCartClick}
      >
        <ShoppingCartIcon />
      </IconButton>

      {!userId ? (
        <>
          <Button
            onClick={() => navigate("/register")}
            sx={{ color: "white", mx: 1, "&:hover": { color: "#bbbbbb" } }}
          >
            Sign Up
          </Button>
          <Button
            onClick={() => navigate("/login")}
            sx={{ color: "white", mx: 1, "&:hover": { color: "#bbbbbb" } }}
          >
            Login
          </Button>
        </>
      ) : (
        <Box
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          sx={{ display: "flex", alignItems: "center" }}
        >
          <IconButton sx={{ color: "white", mx: 1 }}>
            <AccountCircle />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMouseLeave}
            MenuListProps={{ onMouseLeave: handleMouseLeave }}
          >
            <MenuItem onClick={() => navigate("/settings")}>Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      )}
    </Box>
  </Toolbar>
</AppBar>
  );
};

export default Header;