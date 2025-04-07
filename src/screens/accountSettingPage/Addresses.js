import React from "react";

import { useState, useEffect } from "react";
import {
  Button,
  Container,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tabs,
  Tab,
  Box,
  List,
  ListItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";

const Addresses = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);
  const [streetAddress, setStreetAddress] = useState("");
  const [userAddress, setUserAddress] = useState("");


  // 🏠 Biến chứa địa chỉ đầy đủ
  const [fullAddress, setFullAddress] = useState("");

  // API GHN
  const API_TOKEN = "dd88e637-f0ee-11ef-8752-da588d8b708e";
  const API_PROVINCE_URL = "https://online-gateway.ghn.vn/shiip/public-api/master-data/province";
  const API_DISTRICT_URL = "https://online-gateway.ghn.vn/shiip/public-api/master-data/district";
  const API_WARD_URL = "https://online-gateway.ghn.vn/shiip/public-api/master-data/ward";
  const API_SAVE_ADDRESS = "http://localhost:8389/shop/user/address";

  // Lấy userId từ localStorage
  const userId = localStorage.getItem("userId");

  // Lấy danh sách tỉnh/thành phố khi mở hộp thoại
  useEffect(() => {
    if (openDialog) {
      axios
        .get(API_PROVINCE_URL, { headers: { token: API_TOKEN } })
        .then((response) => {
          if (response.data.code === 200) {
            setProvinces(response.data.data);
          }
        })
        .catch((error) => console.error("Lỗi lấy danh sách tỉnh:", error));
    }
  }, [openDialog]);

  // Khi chọn tỉnh/thành phố -> gọi API lấy danh sách quận/huyện
  const handleSelectProvince = (province) => {
    setSelectedProvince(province);
    setSelectedDistrict(null);
    setSelectedWard(null);
    setStreetAddress("");
    setFullAddress(province.ProvinceName);
    setSelectedTab(1);

    axios
      .post(
        API_DISTRICT_URL,
        { province_id: province.ProvinceID },
        { headers: { token: API_TOKEN } }
      )
      .then((response) => {
        if (response.data.code === 200) {
          setDistricts(response.data.data);
        }
      })
      .catch((error) => console.error("Lỗi lấy danh sách quận/huyện:", error));
  };

  // Khi chọn Quận/Huyện -> gọi API lấy danh sách phường/xã
  const handleSelectDistrict = (district) => {
    setSelectedDistrict(district);
    setSelectedWard(null);
    setFullAddress(`${selectedProvince.ProvinceName}, ${district.DistrictName}`);
    setSelectedTab(2);

    axios
      .post(
        API_WARD_URL,
        { district_id: district.DistrictID },
        { headers: { token: API_TOKEN } }
      )
      .then((response) => {
        if (response.data.code === 200) {
          setWards(response.data.data);
        }
      })
      .catch((error) => console.error("Lỗi lấy danh sách phường/xã:", error));
  };

  // Khi chọn Phường/Xã
  const handleSelectWard = (ward) => {
    setSelectedWard(ward);
    setFullAddress(`${selectedProvince.ProvinceName}, ${selectedDistrict.DistrictName}, ${ward.WardName}`);
    setSelectedTab(3);
  };

  // Khi nhập số nhà & tên đường
  const handleStreetAddressChange = (e) => {
    setStreetAddress(e.target.value);
    setFullAddress(`${e.target.value}, ${selectedProvince.ProvinceName}, ${selectedDistrict.DistrictName}, ${selectedWard.WardName}`);
  };

  // Gửi API lưu địa chỉ
  const handleSaveAddress = () => {
    if (!selectedProvince || !selectedDistrict || !selectedWard || !streetAddress) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    const addressData = {
      userId,
      address: fullAddress,
      districtId: selectedDistrict.DistrictID,
      wardCode: selectedWard.WardCode,
    };
    console.log(addressData);
    axios
      .post(API_SAVE_ADDRESS, addressData, { headers: { "Content-Type": "application/json" } })
      .then((response) => {
        alert("Địa chỉ đã được lưu thành công!");
        setOpenDialog(false);
        window.location.reload();
      })
      .catch((error) => {
        console.error("Lỗi lưu địa chỉ:", error);
        alert("Lưu địa chỉ thất bại!");
      });
  };


  useEffect(() => {
    const fetchUserAddress = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        console.error("Không tìm thấy userId trong localStorage");
        return;
      }
  
      try {
        const response = await axios.get(`http://localhost:8389/shop/user/findById?id=${userId}`);
        if (response.data && response.data.data) {
          setUserAddress(response.data.data.address);
        }
      } catch (error) {
        console.error("Lỗi khi lấy địa chỉ người dùng:", error);
      }
    };
  
    fetchUserAddress();
  }, []);
  

  return (
    <Container>
      <Typography variant="h5" gutterBottom>
        Địa chỉ của tôi
      </Typography>
      <Typography variant="body1" sx={{ marginTop: "20px", fontWeight: "bold" }}>
  Địa chỉ hiện tại: <span style={{ color: "red" }}>{userAddress || "Chưa có địa chỉ"}</span>
</Typography>

      <Button
        variant="contained"
        color="error"
        startIcon={<AddIcon />}
        sx={{ marginTop: "20px" }}
        onClick={() => setOpenDialog(true)}
      >
        Thêm địa chỉ mới
      </Button>

      {/* Hộp thoại chọn địa chỉ */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Địa chỉ mới</DialogTitle>
        <DialogContent>
          {/* Ô hiển thị tỉnh/thành phố, quận/huyện, phường/xã đã chọn */}
          <TextField fullWidth variant="outlined" size="small" placeholder="Tỉnh/Thành phố" sx={{ marginBottom: "10px" }} value={selectedProvince?.ProvinceName || ""} disabled />
          <TextField fullWidth variant="outlined" size="small" placeholder="Quận/Huyện" sx={{ marginBottom: "10px" }} value={selectedDistrict?.DistrictName || ""} disabled />
          <TextField fullWidth variant="outlined" size="small" placeholder="Phường/Xã" sx={{ marginBottom: "10px" }} value={selectedWard?.WardName || ""} disabled />

          {/* Nhập số nhà & tên đường */}
          <TextField fullWidth variant="outlined" size="small" placeholder="Số nhà & Tên đường" sx={{ marginBottom: "10px" }} value={streetAddress} onChange={handleStreetAddressChange} />

          {/* Hiển thị địa chỉ đầy đủ */}
          <Typography variant="body1" sx={{ marginBottom: "10px" }}>📍 {fullAddress}</Typography>

          {/* Tabs */}
          <Tabs value={selectedTab} textColor="primary" indicatorColor="primary">
            <Tab label="Tỉnh/Thành phố" />
            <Tab label="Quận/Huyện" disabled={!selectedProvince} />
            <Tab label="Phường/Xã" disabled={!selectedDistrict} />
          </Tabs>

          {/* Danh sách Tỉnh/Thành phố */}
          {selectedTab === 0 && (
            <Box sx={{ height: "150px", overflowY: "auto", border: "1px solid #ddd", marginTop: "10px" }}>
              <List>
                {provinces.map((province) => (
                  <ListItem key={province.ProvinceID} button onClick={() => handleSelectProvince(province)}>{province.ProvinceName}</ListItem>
                ))}
              </List>
            </Box>
          )}

          {/* Danh sách Quận/Huyện */}
          {selectedTab === 1 && (
            <Box sx={{ height: "150px", overflowY: "auto", border: "1px solid #ddd", marginTop: "10px" }}>
              <List>
                {districts.map((district) => (
                  <ListItem key={district.DistrictID} button onClick={() => handleSelectDistrict(district)}>{district.DistrictName}</ListItem>
                ))}
              </List>
            </Box>
          )}
        </DialogContent>

          {/* Danh sách Phường/Xã */}
          {selectedTab === 2 && (
            <Box sx={{ height: "150px", overflowY: "auto", border: "1px solid #ddd", marginTop: "10px" }}>
              <List>
                {wards.map((ward) => (
                  <ListItem key={ward.WardCode} button onClick={() => handleSelectWard(ward)}>
                    {ward.WardName}
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

        {/* Nút lưu */}
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button variant="contained" color="error" onClick={handleSaveAddress}>Lưu Địa Chỉ</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Addresses;
