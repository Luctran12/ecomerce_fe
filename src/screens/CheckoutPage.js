import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  TextField,
  Divider,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ChatIcon from "@mui/icons-material/Chat";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";

const CheckoutPage = () => {
  // State để lưu thông tin người dùng từ API
  const [userInfo, setUserInfo] = useState({
    name: "",
    phone: "",
    address: "",
    wardCode: "",
    districtId: "",
  });

  // Gọi API khi component mount
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        // Lấy userId từ localStorage
        const userId = localStorage.getItem("userId");
        if (!userId) {
          console.error("Không tìm thấy userId trong localStorage");
          return;
        }

        // Gọi API
        const response = await fetch(
          `http://localhost:8389/shop/user/findById?id=${userId}`
        );
        const result = await response.json();

        // Kiểm tra dữ liệu trả về
        if (result.data) {
          setUserInfo({
            name: result.data.name || "",
            phone: result.data.phone || "",
            address: result.data.address || "",
            wardCode: result.data.wardCode || "",
            districtId: result.data.districtId || "",
          });
        }
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      }
    };

    fetchUserInfo();
  }, []); // Chỉ chạy một lần khi component mount

  return (
    <Container maxWidth="md" sx={{ my: 4 }}>
      {/* Địa chỉ nhận hàng */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" gap={1}>
          <LocationOnIcon color="error" />
          <Typography fontWeight="bold">Địa Chỉ Nhận Hàng</Typography>
        </Box>
        <Typography fontWeight="bold" sx={{ mt: 1 }}>
          {userInfo.name} (+84) {userInfo.phone}
        </Typography>
        <Typography>{userInfo.address}</Typography>
        <Box display="flex" justifyContent="space-between" mt={2}>
          <Button variant="outlined" color="primary">
            Thay Đổi
          </Button>
          <Button variant="contained" color="error" size="small">
            Mặc Định
          </Button>
        </Box>
      </Paper>

      {/* Danh sách sản phẩm */}
      <Paper elevation={3} sx={{ mt: 3, p: 3 }}>
        <Typography variant="h6" fontWeight="bold">
          Sản phẩm
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={2}>
            <img
              src="https://placehold.co/60x60"
              alt="500Gr Đậu phộng da cá vị nước cốt dừa giòn"
              style={{ width: "100%", borderRadius: 5 }}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography fontWeight="bold">
              Bonbeshop - Thiên Đường Ăn Vặt
            </Typography>
            <Button size="small" startIcon={<ChatIcon />} sx={{ textTransform: "none" }}>
              Chat ngay
            </Button>
            <Typography sx={{ mt: 1 }}>
              500Gr Đậu phộng da cá vị nước cốt dừa giòn, thơm ngon
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Loại: 100gr
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography fontWeight="bold">₫8.600</Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography fontWeight="bold">1</Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Voucher */}
      <Paper elevation={3} sx={{ mt: 3, p: 3 }}>
        <Box display="flex" alignItems="center" gap={1}>
          <ConfirmationNumberIcon color="primary" />
          <Typography fontWeight="bold">Voucher của Shop</Typography>
          <Button size="small" sx={{ textTransform: "none", ml: "auto" }}>
            Chọn Voucher
          </Button>
        </Box>
      </Paper>

      {/* Lời nhắn */}
      <Paper elevation={3} sx={{ mt: 3, p: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Lưu ý cho Người bán..."
        />
      </Paper>

      {/* Phương thức vận chuyển */}
      <Paper elevation={3} sx={{ mt: 3, p: 3 }}>
        <Box display="flex" alignItems="center" gap={1}>
          <LocalShippingIcon color="success" />
          <Typography fontWeight="bold">Phương thức vận chuyển:</Typography>
          <Typography fontWeight="bold" color="primary">
            Nhanh
          </Typography>
          <Button size="small" sx={{ textTransform: "none", ml: "auto" }}>
            Thay Đổi
          </Button>
        </Box>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Đảm bảo nhận hàng từ 25 Tháng 2 - 28 Tháng 2
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Nhận Voucher trị giá ₫15.000 nếu đơn hàng được giao đến bạn sau ngày 28 Tháng 2
        </Typography>
        <Typography fontWeight="bold" sx={{ mt: 2 }}>
          ₫37.700
        </Typography>
      </Paper>

      {/* Tổng tiền */}
      <Paper elevation={3} sx={{ mt: 3, p: 3 }}>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h6">Tổng số tiền (1 sản phẩm):</Typography>
          <Typography variant="h6" color="error" fontWeight="bold">
            ₫46.300
          </Typography>
        </Box>
      </Paper>

      {/* Nút thanh toán */}
      <Box textAlign="right" sx={{ mt: 3 }}>
        <Button variant="contained" color="error" size="large">
          Thanh Toán
        </Button>
      </Box>
    </Container>
  );
};

export default CheckoutPage;