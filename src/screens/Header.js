import {
  Dashboard,
  KeyboardArrowDown,
  Login,
  Logout,
  Person,
  PersonAdd,
  Settings,
} from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import {
  Avatar,
  Box,
  Divider,
  ListItemIcon,
  Menu,
  MenuItem,
} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import { alpha, styled } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { jwtDecode as jwt_decode } from "jwt-decode"; // using named export
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const token = localStorage.getItem("token") || "";

  // Function to update user information from token in localStorage
  const updateUserInfo = React.useCallback(() => {
    const currentToken = localStorage.getItem("token");

    if (currentToken) {
      try {
        const decoded = jwt_decode(currentToken);
        const id = decoded.userId || "";
        const image = decoded.image || "";

        // Update state with user information from token
        setUserId(id);
        setUserName(decoded.sub);

        // Assuming token contains only one role. For multiple roles, additional processing would be needed
        if (decoded.roles && decoded.roles.length > 0) {
          setUserRole(decoded.roles[0]);
        }

        // Development-only logging
        if (process.env.NODE_ENV === "development") {
          console.log("User authenticated:", {
            id: id,
            name: decoded.sub,
            role: decoded.roles?.[0],
            image: image,
          });
        }
      } catch (error) {
        console.error("Error decoding token:", error.message);
        // Clear user state on error
        clearUserState();
      }
    } else {
      // Clear user state when no token exists
      clearUserState();
    }
  }, []);

  // Helper function to clear user state
  const clearUserState = () => {
    setUserId(null);
    setUserName("");
    setUserRole("");
  };

  useEffect(() => {
    // Initialize user info when component mounts
    updateUserInfo();

    // Listen for storage events (for other tabs)
    window.addEventListener("storage", updateUserInfo);

    // Listen for custom storageChange event (within the same tab)
    window.addEventListener("storageChange", updateUserInfo);

    return () => {
      // Clean up event listeners when component unmounts
      window.removeEventListener("storage", updateUserInfo);
      window.removeEventListener("storageChange", updateUserInfo);
    };
  }, [updateUserInfo]);

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

  // Handle Enter key press for search
  const handleKeyDown = (event) => {
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

  function isValidToken(token) {
    try {
      const decoded = jwt_decode(token);
      return decoded && decoded.roles && decoded.roles.length > 0;
    } catch (err) {
      console.error("Invalid token:", err.message);
      return false;
    }
  }
  

  const handleLogout = () => {
    // Remove all user-related data from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("storeId");

    // Clear user state using our helper function
    clearUserState();

    // Trigger event to update user info across the app
    window.dispatchEvent(new Event("storageChange"));

    // Redirect to login page
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
          <img
            src={logo}
            alt="logo"
            width={80}
            height={80}
            style={{ borderRadius: 8 }}
          />
          <Typography variant="h5" component="div" sx={{ fontWeight: "bold" }}>
            L-SHOP
          </Typography>
        </div>
        {!isValidToken(token) &&  (
  <Button
    onClick={() => navigate("/seller-login")}
    sx={{ color: "white", mx: 1, "&:hover": { color: "#bbbbbb" } }}
  >
    Kênh người bán
  </Button>
)}


        <Search>
          <StyledInputBase
            placeholder="Search products..."
            inputProps={{ "aria-label": "search" }}
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
          />
          <IconButton sx={{ color: "white" }} onClick={fetchSearchResults}>
            <SearchIcon />
          </IconButton>
        </Search>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          {/* Only show shopping cart icon if user is not a Seller */}
          {token && isValidToken(token) && jwt_decode(token).roles[0] !== "ROLE_Seller" && (
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
                startIcon={<PersonAdd sx={{ fontSize: 18 }} />}
                sx={{
                  color: "white",
                  mx: 1,
                  fontWeight: 500,
                  textTransform: "none",
                  borderRadius: "8px",
                  px: 2,
                  py: 0.8,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                Sign Up
              </Button>
              <Button
                onClick={() => navigate("/login")}
                variant="contained"
                startIcon={<Login sx={{ fontSize: 18 }} />}
                sx={{
                  backgroundColor: "primary.main",
                  color: "white",
                  mx: 1,
                  fontWeight: 500,
                  textTransform: "none",
                  borderRadius: "8px",
                  px: 2.5,
                  py: 0.8,
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: "primary.dark",
                    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
                    transform: "translateY(-2px)",
                  },
                  "&:active": {
                    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.15)",
                    transform: "translateY(0)",
                  },
                }}
              >
                Login
              </Button>
            </>
          ) : (
            <Box
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                borderRadius: 2,
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
                padding: "4px 8px",
              }}
            >
              <Avatar
              src={jwt_decode(token).image || undefined}
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: "primary.main",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                {!jwt_decode(token).image && userName.charAt(0)}
              </Avatar>

              <Box sx={{ ml: 1, display: "flex", alignItems: "center" }}>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 500,
                    color: "white",
                    fontSize: "0.95rem",
                  }}
                >
                  {userName}
                </Typography>
                <KeyboardArrowDown
                  sx={{
                    color: "white",
                    fontSize: 20,
                    ml: 0.5,
                    transition: "transform 0.2s ease",
                    transform: Boolean(anchorEl)
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                  }}
                />
              </Box>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMouseLeave}
                MenuListProps={{
                  onMouseLeave: handleMouseLeave,
                  sx: { py: 0.5 },
                }}
                PaperProps={{
                  elevation: 3,
                  sx: {
                    mt: 1.5,
                    minWidth: 200,
                    borderRadius: 2,
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.15))",
                    "&:before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: "background.paper",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <Box sx={{ px: 2, py: 1.5 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {userName}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: "0.8rem" }}
                  >
                    {userRole === "ROLE_Seller"
                      ? "Seller Account"
                      : "Customer Account"}
                  </Typography>
                </Box>

                <Divider />

                {userRole === "ROLE_Seller" ? (
                  <MenuItem
                    onClick={() => navigate("/seller")}
                    sx={{
                      py: 1.5,
                      px: 2,
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.04)",
                      },
                    }}
                  >
                    <ListItemIcon>
                      <Dashboard fontSize="small" color="primary" />
                    </ListItemIcon>
                    <Typography variant="body2">Seller Dashboard</Typography>
                  </MenuItem>
                ) : (
                  <MenuItem
                    onClick={() => navigate("/settings")}
                    sx={{
                      py: 1.5,
                      px: 2,
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.04)",
                      },
                    }}
                  >
                    <ListItemIcon>
                      <Person fontSize="small" color="primary" />
                    </ListItemIcon>
                    <Typography variant="body2">My Profile</Typography>
                  </MenuItem>
                )}

                <MenuItem
                  onClick={() => navigate("/settings")}
                  sx={{
                    py: 1.5,
                    px: 2,
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.04)",
                    },
                  }}
                >
                  <ListItemIcon>
                    <Settings fontSize="small" color="primary" />
                  </ListItemIcon>
                  <Typography variant="body2">Account Settings</Typography>
                </MenuItem>

                <Divider />

                <MenuItem
                  onClick={handleLogout}
                  sx={{
                    py: 1.5,
                    px: 2,
                    color: "error.main",
                    "&:hover": {
                      backgroundColor: "rgba(211, 47, 47, 0.04)",
                    },
                  }}
                >
                  <ListItemIcon>
                    <Logout fontSize="small" color="error" />
                  </ListItemIcon>
                  <Typography variant="body2" color="error.main">
                    Logout
                  </Typography>
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
