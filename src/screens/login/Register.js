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
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async () => {
    const userData = {
      name,
      accountName,
      email,
      password,
      phone,
    };

    try {
      const response = await fetch("http://localhost:8389/shop/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        alert("Đăng ký thành công!");
        navigate("/login"); // Chuyển đến trang đăng nhập
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Đăng ký thất bại!"); // Hiển thị lỗi từ backend nếu có
      }
    } catch (error) {
      setError("Lỗi kết nối đến server!");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Paper elevation={3} sx={{ padding: 4, mt: 6, borderRadius: 3 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Đăng Ký
        </Typography>

        {error && (
          <Typography color="error" align="center">
            {error}
          </Typography>
        )}

        <TextField
          label="Họ và Tên"
          variant="outlined"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <TextField
          label="Tên tài khoản"
          variant="outlined"
          fullWidth
          margin="normal"
          value={accountName}
          onChange={(e) => setAccountName(e.target.value)}
        />

        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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

        <TextField
          label="Số điện thoại"
          variant="outlined"
          fullWidth
          margin="normal"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleRegister}
        >
          Đăng Ký
        </Button>

        <Box mt={2} textAlign="center">
          <Typography variant="body2">
            Đã có tài khoản?{" "}
            <Link
              component="button"
              variant="body2"
              onClick={() => navigate("/login")}
            >
              Đăng nhập
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
