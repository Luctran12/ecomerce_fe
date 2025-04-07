import React, { useState } from "react";
import {
  TextField,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  Paper,
  Avatar,
  Container,
} from "@mui/material";

const Profile = () => {
  const [gender, setGender] = useState("");
  const [birthDate, setBirthDate] = useState({ day: "", month: "", year: "" });
  const [avatar, setAvatar] = useState(null);

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAvatar(URL.createObjectURL(file));
    }
  };

  return (
    <Container elevation={3} style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <Typography variant="h5" fontWeight="bold">
        Hồ Sơ Của Tôi
      </Typography>
      <Typography variant="body2" color="textSecondary" marginBottom={2}>
        Quản lý thông tin hồ sơ để bảo mật tài khoản
      </Typography>

      {/* Tên đăng nhập */}
      <TextField
        label="Tên đăng nhập"
        defaultValue="23.lc12a05"
        fullWidth
        margin="normal"
        InputProps={{ readOnly: true }}
      />
      <Typography variant="caption" color="textSecondary">
        Tên đăng nhập chỉ có thể thay đổi một lần.
      </Typography>

      {/* Tên */}
      <TextField label="Tên" fullWidth margin="normal" />

      {/* Email */}
      <Typography variant="body1" marginTop={2}>
        Email: <b>tl******@gmail.com</b>{" "}
        <Typography component="span" color="primary" style={{ cursor: "pointer" }}>
          Thay Đổi
        </Typography>
      </Typography>

      {/* Số điện thoại */}
      <Typography variant="body1" marginTop={2}>
        Số điện thoại: <b>********15</b>{" "}
        <Typography component="span" color="primary" style={{ cursor: "pointer" }}>
          Thay Đổi
        </Typography>
      </Typography>

      {/* Giới tính */}
      <Typography variant="body1" marginTop={2}>
        Giới tính:
      </Typography>
      <RadioGroup row value={gender} onChange={(e) => setGender(e.target.value)}>
        <FormControlLabel value="male" control={<Radio />} label="Nam" />
        <FormControlLabel value="female" control={<Radio />} label="Nữ" />
        <FormControlLabel value="other" control={<Radio />} label="Khác" />
      </RadioGroup>

      {/* Ngày sinh */}
      <Typography variant="body1" marginTop={2}>
        Ngày sinh:
      </Typography>
      <div style={{ display: "flex", gap: "10px" }}>
        <FormControl style={{ minWidth: 100 }}>
          <InputLabel>Ngày</InputLabel>
          <Select
            value={birthDate.day}
            onChange={(e) => setBirthDate({ ...birthDate, day: e.target.value })}
          >
            {[...Array(31)].map((_, i) => (
              <MenuItem key={i + 1} value={i + 1}>
                {i + 1}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl style={{ minWidth: 100 }}>
          <InputLabel>Tháng</InputLabel>
          <Select
            value={birthDate.month}
            onChange={(e) => setBirthDate({ ...birthDate, month: e.target.value })}
          >
            {[
              "Tháng 1",
              "Tháng 2",
              "Tháng 3",
              "Tháng 4",
              "Tháng 5",
              "Tháng 6",
              "Tháng 7",
              "Tháng 8",
              "Tháng 9",
              "Tháng 10",
              "Tháng 11",
              "Tháng 12",
            ].map((month, index) => (
              <MenuItem key={index + 1} value={index + 1}>
                {month}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl style={{ minWidth: 100 }}>
          <InputLabel>Năm</InputLabel>
          <Select
            value={birthDate.year}
            onChange={(e) => setBirthDate({ ...birthDate, year: e.target.value })}
          >
            {[...Array(100)].map((_, i) => (
              <MenuItem key={i} value={2024 - i}>
                {2024 - i}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      {/* Ảnh đại diện */}
      <div style={{ display: "flex", alignItems: "center", marginTop: "20px" }}>
        <Avatar
          src={avatar}
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

      {/* Nút Lưu */}
      <Button
        variant="contained"
        color="error"
        fullWidth
        sx={{ marginTop: "20px", padding: "10px" }}
      >
        Lưu
      </Button>
    </Container>
  );
};

export default Profile;
