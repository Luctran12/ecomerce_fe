import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import {
  Box,
  Grid,
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
  Divider,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          console.error("User ID không tồn tại trong localStorage");
          return;
        }

        const response = await axios.get(`http://localhost:8389/shop/order/${userId}`);
        setOrders(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu đơn hàng:", error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 3 }}>
      {/* Thanh điều hướng */}
      <Box sx={{ display: "flex", borderBottom: "2px solid #eee", pb: 1 }}>
        {["Tất cả", "Chờ thanh toán", "Vận chuyển", "Chờ giao hàng", "Hoàn thành", "Đã hủy", "Trả hàng/Hoàn tiền"].map(
          (tab, index) => (
            <Typography
              key={index}
              sx={{
                fontWeight: index === 0 ? "bold" : "normal",
                color: index === 0 ? "red" : "black",
                mx: 2,
                cursor: "pointer",
              }}
            >
              {tab}
            </Typography>
          )
        )}
      </Box>

      {/* Hiển thị danh sách đơn hàng */}
      {orders.length === 0 ? (
        <Typography sx={{ textAlign: "center", mt: 5 }}>Không có đơn hàng nào</Typography>
      ) : (
        orders.map((order) => (
          <Card key={order.id} sx={{ mt: 2, p: 2 }}>
            {/* Tên Shop */}
            <Box sx={{ display: "flex", alignItems: "center", borderBottom: "1px solid #ddd", pb: 1 }}>
              <Typography sx={{ backgroundColor: "red", color: "white", px: 1, borderRadius: "3px", mr: 1 }}>Mall</Typography>
              <Typography sx={{ fontWeight: "bold", flex: 1 }}>
                {order.items[0]?.product?.store?.name || "Không xác định"}
              </Typography>
              <Button variant="outlined" size="small" startIcon={<ChatIcon />} sx={{ mr: 1 }}>
                Chat
              </Button>
              <Button variant="outlined" size="small">Xem Shop</Button>
            </Box>

            {/* Hiển thị sản phẩm trong đơn hàng */}
            {order.items.map((item) => (
              <Grid container spacing={2} sx={{ mt: 2 }} key={item.id}>
                <Grid item xs={2}>
                  <CardMedia
                    component="img"
                    height="80"
                    image={item.product.imageUrl[0] || "https://placehold.co/80x80"}
                    alt={item.product.name}
                  />
                </Grid>
                <Grid item xs={10}>
                  <Typography sx={{ fontWeight: "bold" }}>{item.product.name}</Typography>
                  <Typography sx={{ color: "#666", mt: 0.5 }}>x{item.quantity}</Typography>
                  <Typography sx={{ color: "#333", fontWeight: "bold", mt: 1 }}>
                    ₫{item.price.toLocaleString("vi-VN")}
                  </Typography>
                </Grid>
              </Grid>
            ))}

            {/* Trạng thái đơn hàng */}
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2, borderTop: "1px solid #ddd", pt: 2 }}>
              <Typography sx={{ color: order.status === "Processing" ? "orange" : "green" }}>
                {order.status === "Processing" ? "Đang xử lý" : "Giao hàng thành công"}
              </Typography>
              {order.status !== "Processing" && (
                 <Typography sx={{ color: "red" }}>HOÀN THÀNH</Typography>
              )}
             
            </Box>

            {/* Hiển thị ngày đặt hàng */}
            <Box sx={{ mt: 1 }}>
              <Typography sx={{ fontSize: "14px", color: "#666" }}>
                Ngày đặt hàng:{" "}
                <span style={{ fontWeight: "bold", color: "#000" }}>
                  {dayjs(order.orderDate).format("DD/MM/YYYY HH:mm")}
                </span>
              </Typography>
            </Box>

            {/* Tổng tiền */}
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
              <Typography sx={{ color: "red", fontSize: "18px", fontWeight: "bold" }}>
                Thành tiền: ₫{order.totalPrice.toLocaleString("vi-VN")}
              </Typography>
            </Box>

            {/* Nếu đơn hàng KHÔNG phải Processing => Hiển thị nút */}
            {order.status !== "Processing" && (
              <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
                <Button variant="contained" color="error">Đánh Giá</Button>
                <Button variant="outlined">Yêu Cầu Trả Hàng/Hoàn Tiền</Button>
              </Box>
            )}

            {/* Đánh giá sản phẩm */}
            {order.status !== "Processing" && (
              <Box sx={{ mt: 2, fontSize: "14px" }}>
                <Typography sx={{ color: "#888" }}>
                  Đánh giá sản phẩm trước{" "}
                  <span style={{ color: "blue" }}>
                    {dayjs(order.orderDate).add(30, "day").format("DD-MM-YYYY")}
                  </span>
                </Typography>
                <Typography sx={{ color: "red", fontWeight: "bold" }}>
                  Đánh giá ngay và nhận 200 Xu
                </Typography>
              </Box>
            )}
          </Card>
        ))
      )}
    </Box>
  );
};

export default Orders;
