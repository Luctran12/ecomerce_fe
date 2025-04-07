import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  CssBaseline,
  Paper,
  Link,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SellerLogin = () => {
  const [accountName, setAccountName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError(null); // Xóa thông báo lỗi cũ (nếu có)
    console.log(accountName+" " + password);

    try {
      const response = await axios.post("http://localhost:8389/shop/user/seller/login", {
        accountName,
        password,
      });

      if (response?.data) {
        console.log(response.data)
        
        // Lưu userId vào localStorage
        localStorage.setItem("storeId", response?.data?.data?.id);
        console.log("====",localStorage.getItem("storeId"))
        // Chuyển hướng đến trang chủ
        navigate("/seller");
      } else {
        setError("Đăng nhập thất bại! Vui lòng kiểm tra lại email hoặc mật khẩu.");
      }
    } catch (err) {
      console.log(err)
      setError("Lỗi máy chủ! Vui lòng thử lại sau.");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Paper elevation={3} sx={{ padding: 4, mt: 8, borderRadius: 3 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Đăng Nhập
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={accountName}
          onChange={(e) => setAccountName(e.target.value)}
        />

        <TextField
          label="Mật khẩu"
          variant="outlined"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleLogin}
        >
          Đăng Nhập
        </Button>

        <Box mt={2} textAlign="center">
          <Typography variant="body2">
            Chưa có tài khoản?{" "}
            <Link
              component="button"
              variant="body2"
              onClick={() => navigate("/seller-register")}
            >
              Đăng ký ngay
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default SellerLogin;
