import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Avatar,
  Container,
} from "@mui/material";
import axios from "axios";

const Profile = () => {
  const [name, setName] = useState(null);
  const [accountName, setAccountName] = useState(null);
  const [email, setEmail] = useState(null);
  const [phone, setPhone] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.error("User ID không tồn tại trong localStorage");
      return;
    }
  
    const formData = new FormData();
    formData.append("name", name); // name là useState chứa tên
    formData.append("accountName", accountName); // nếu có
    formData.append("email", email);
    formData.append("phone", phone);
    if (selectedFile) {
      formData.append("image", selectedFile);
    }
  
    try {
      const response = await axios.put(
        `http://localhost:8389/shop/user/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Cập nhật thành công:", response.data);
      // Có thể thông báo thành công ở đây
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin:", error);
      // Hiển thị lỗi cho người dùng
    }
  };
  
  

  return (
    <Container style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <Typography variant="h5" fontWeight="bold">
        Hồ Sơ Của Tôi
      </Typography>
      <Typography variant="body2" color="textSecondary" marginBottom={2}>
        Quản lý thông tin hồ sơ để bảo mật tài khoản
      </Typography>

      <TextField
        label="Tên đăng nhập"
        value={accountName}
        onChange={(e) => setAccountName(e.target.value)}
        fullWidth
        margin="normal"
      />

      <TextField
        label="Tên"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        margin="normal"
      />

      <TextField
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        margin="normal"
      />

      <TextField
        label="Số điện thoại"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        fullWidth
        margin="normal"
      />

      <Typography variant="body1" marginTop={2}>
        Ảnh đại diện
      </Typography>
      <div style={{ display: "flex", alignItems: "center", marginTop: "20px" }}>
        <Avatar
          src={avatarPreview}
          sx={{ width: 80, height: 80, marginRight: 2, backgroundColor: "#ddd" }}
        />
        <div>
          <Button variant="contained" component="label">
            Chọn Ảnh
            <input type="file" hidden accept="image/png, image/jpeg" onChange={handleAvatarChange} />
          </Button>
          <Typography variant="caption" color="textSecondary" display="block">
            Dung lượng file tối đa 1 MB. Định dạng: JPEG, PNG.
          </Typography>
        </div>
      </div>

      <Button
        variant="contained"
        color="error"
        fullWidth
        sx={{ marginTop: "20px", padding: "10px" }}
        onClick={handleSave}
      >
        Lưu
      </Button>
    </Container>
  );
};

export default Profile;
