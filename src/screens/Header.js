import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Box, Menu, MenuItem, CssBaseline, Container, Paper, Link, Alert } from "@mui/material";
import { jwtDecode as jwt_decode } from "jwt-decode"; // sử dụng named export
import logo from "../image/logo_shop.png";

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
  const [userId, setUserId] = useState();
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);

  // Hàm cập nhật thông tin user từ token trong localStorage
  const updateUserInfo = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwt_decode(token);
        const id = decoded.userId;
        console.log("Decoded token:", decoded);
        setUserId(id);
        console.log("User ID:", userId);
        setUserName(decoded.sub);
        // Giả sử token chỉ chứa một role, nếu nhiều role thì bạn có thể xử lý thêm
        setUserRole(decoded.roles[0]);
      } catch (error) {
        console.error("Lỗi khi giải mã token:", error);
        setUserId(null);
        setUserName("");
        setUserRole("");
      }
    } else {
      setUserId(null);
      setUserName("");
      setUserRole("");
    }
  };

  useEffect(() => {
    updateUserInfo();

    // Lắng nghe sự kiện storage (cho các tab khác)
    window.addEventListener("storage", updateUserInfo);

    // Lắng nghe custom event storageChange (trong cùng tab)
    window.addEventListener("storageChange", updateUserInfo);

    return () => {
      window.removeEventListener("storage", updateUserInfo);
      window.removeEventListener("storageChange", updateUserInfo);
    };
  }, []);

  const handleCartClick = () => {
    const token = localStorage.getItem("token");
    console.log(token);
    const id = jwt_decode(token).userId;
    localStorage.setItem("userId", id);
    console.log(id);
    navigate(`/cart/${id}`);
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
    localStorage.removeItem("token"); // Xóa token khi logout
    setUserId(null);
    setUserName("");
    setUserRole("");
    window.dispatchEvent(new Event("storageChange")); // Trigger event để cập nhật lại thông tin user
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
        <div onClick={() => navigate("/")} style={{ marginLeft: 10, cursor: "pointer" }}>
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
          {/* Chỉ hiển thị icon giỏ hàng nếu user không phải Seller */}
          {userRole !== "ROLE_SELLER" && (
            <IconButton
              sx={{ color: "white", mx: 1, "&:hover": { color: "#bbbbbb" } }}
              onClick={handleCartClick}
            >
              <ShoppingCartIcon />
            </IconButton>
          )}

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
              {/* Hiển thị tên user bên cạnh avatar */}
              <Typography variant="body1" sx={{ mr: 2 }}>
                {userName}
              </Typography>
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
