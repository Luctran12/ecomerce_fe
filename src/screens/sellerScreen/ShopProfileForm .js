import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  Avatar,
  CircularProgress,
  IconButton,
} from "@mui/material";
import axios from "axios";
import PhotoCamera from "@mui/icons-material/PhotoCamera";

const ShopProfileForm = () => {
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(false);
  const [edited, setEdited] = useState({
    name: "",
    address: "",
    description: "",
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [backgroundFile, setBackgroundFile] = useState(null);

  const [previewAvatar, setPreviewAvatar] = useState(null);
  const [previewBackground, setPreviewBackground] = useState(null);

  const storeId = localStorage.getItem("storeId");

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const res = await axios.get(`http://localhost:8389/shop/store/${storeId}`);
        const data = res.data.data;
        setShop(data);
        setEdited({
          name: data.name || "",
          address: data.address || "",
          description: data.description || "",
        });
      } catch (err) {
        console.error("Lỗi khi lấy thông tin shop:", err);
      }
    };

    if (storeId) fetchShop();
  }, [storeId]);

  const handleChange = (e) => {
    setEdited((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatarFile(file);
    setPreviewAvatar(URL.createObjectURL(file));
  };

  const handleBackgroundChange = (e) => {
    const file = e.target.files[0];
    setBackgroundFile(file);
    setPreviewBackground(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", edited.name);
      formData.append("address", edited.address);
      formData.append("description", edited.description);
      if (avatarFile) formData.append("avatar", avatarFile);
      if (backgroundFile) formData.append("background", backgroundFile);

      await axios.put(
        `http://localhost:8389/shop/store/${storeId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Cập nhật thành công");
    } catch (err) {
      console.error("Lỗi khi cập nhật:", err);
      alert("Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  if (!shop) return <CircularProgress />;

  return (
    <Box p={4} maxWidth={700} mx="auto">
      {/* Background Image */}
      <Box position="relative" mb={2}>
        <img
          src={previewBackground || shop.backgroundUrl || "https://via.placeholder.com/700x200"}
          alt="Background"
          style={{ width: "100%", height: 200, objectFit: "cover", borderRadius: 8 }}
        />
        <IconButton
          sx={{ position: "absolute", top: 10, right: 10, bgcolor: "white" }}
          component="label"
        >
          <PhotoCamera />
          <input hidden type="file" accept="image/*" onChange={handleBackgroundChange} />
        </IconButton>
      </Box>

      {/* Avatar + Info */}
      <Box display="flex" alignItems="center" mb={3}>
        <Avatar
          src={previewAvatar || shop.avatarUrl || ""}
          sx={{
            width: 80,
            height: 80,
            fontSize: 32,
            bgcolor: "primary.main",
            mr: 2,
          }}
        >
          {!shop.avatarUrl && shop.name?.charAt(0)}
        </Avatar>
        <IconButton component="label">
          <PhotoCamera />
          <input hidden type="file" accept="image/*" onChange={handleAvatarChange} />
        </IconButton>
        <Typography variant="h5" ml={2}>Thông tin cửa hàng</Typography>
      </Box>

      <TextField
        label="Tên cửa hàng"
        name="name"
        value={edited.name}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Địa chỉ"
        name="address"
        value={edited.address}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Mô tả"
        name="description"
        value={edited.description}
        onChange={handleChange}
        fullWidth
        multiline
        rows={3}
        margin="normal"
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleSave}
        disabled={loading}
        sx={{ mt: 2 }}
      >
        {loading ? "Đang lưu..." : "Lưu thay đổi"}
      </Button>
    </Box>
  );
};

export default ShopProfileForm;
