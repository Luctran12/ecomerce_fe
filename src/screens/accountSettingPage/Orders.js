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
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("Tất cả"); // Lọc theo status
  const navigate = useNavigate();

  const statusMap = {
    Pending: "Đã đặt hàng",
    Processing: "Đang xử lý",
    Shipped: "Đang vận chuyển",
    Delivered: "Hoàn thành",
    Cancelled: "Đã hủy",
    Refund: "Trả hàng/Hoàn tiền",
  };

  const statusTabs = ["Tất cả", ...Object.values(statusMap)];

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


  const handleConfirmReceived = async (orderItemId, orderId) => {
    console.log(orderId)
    try {
      // 1. Cập nhật trạng thái item sang Delivered
      await axios.put(`http://localhost:8389/shop/order/item/${orderItemId}/Delivered`);
  
      // 2. Lấy lại đơn hàng cụ thể để kiểm tra trạng thái của từng item
      const response = await axios.get(`http://localhost:8389/shop/order/${localStorage.getItem("userId")}`);
      const updatedOrders = response.data;
  
      // 3. Cập nhật state
      setOrders(updatedOrders);
  
      // 4. Tìm order đang xử lý
      const currentOrder = updatedOrders.find(order => order.id === orderId);
  
      if (currentOrder) {
        const allDelivered = currentOrder.items.every(item => item.status === "Delivered");
        
        // Nếu tất cả item đã Delivered, cập nhật luôn đơn hàng
        if (allDelivered) {
          await axios.put(`http://localhost:8389/shop/order/${orderId}/Delivered`);
          console.log("Đơn hàng đã được cập nhật thành trạng thái Delivered");
          // Load lại đơn hàng sau khi cập nhật order
          const refreshed = await axios.get(`http://localhost:8389/shop/order/${localStorage.getItem("userId")}`);
          setOrders(refreshed.data);
        }
      }
    } catch (error) {
      console.error("Lỗi khi xác nhận đã nhận hàng hoặc cập nhật đơn hàng:", error);
    }
  };
  
  

  // Lọc đơn hàng theo trạng thái được chọn
  const filteredOrders =
    selectedStatus === "Tất cả"
      ? orders
      : orders.filter((order) => statusMap[order.status] === selectedStatus);

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 3 }}>
      {/* Tabs lọc */}
      <Box sx={{ display: "flex", borderBottom: "2px solid #eee", pb: 1, flexWrap: "wrap" }}>
        {statusTabs.map((tab, index) => (
          <Typography
            key={index}
            onClick={() => setSelectedStatus(tab)}
            sx={{
              fontWeight: selectedStatus === tab ? "bold" : "normal",
              color: selectedStatus === tab ? "red" : "black",
              mx: 2,
              cursor: "pointer",
              mb: 1,
            }}
          >
            {tab}
          </Typography>
        ))}
      </Box>

      {/* Hiển thị đơn hàng */}
      {filteredOrders.length === 0 ? (
        <Typography sx={{ textAlign: "center", mt: 5 }}>Không có đơn hàng nào</Typography>
      ) : (
        filteredOrders.map((order) => (
          <Card key={order.id} sx={{ mt: 2, p: 2 }}>
            {/* Thông tin Shop */}
            <Box sx={{ display: "flex", alignItems: "center", borderBottom: "1px solid #ddd", pb: 1 }}>
              <Typography sx={{ backgroundColor: "red", color: "white", px: 1, borderRadius: "3px", mr: 1 }}>Mall</Typography>
              <Typography sx={{ fontWeight: "bold", flex: 1 }}>
                {order.items[0]?.product?.store?.name || "Không xác định"}
              </Typography>
              <Button variant="outlined" size="small" startIcon={<ChatIcon />} sx={{ mr: 1 }}>
                Chat
              </Button>
              <Button onClick={() => navigate(`/shop/${order.items[0]?.product?.store?.id}`)} variant="outlined" size="small">
                Xem Shop
              </Button>
            </Box>

            {/* Danh sách sản phẩm */}
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
      <Typography sx={{ color: "#666", mt: 0.5 }}>Trạng Thái: {item.status}</Typography>

      {/* Nút xác nhận đã nhận hàng nếu item đang ở trạng thái Shipped */}
      {item.status === "Shipped" && (
        <Button
          variant="contained"
          color="primary"
          size="small"
          sx={{ mt: 1 }}
          onClick={() => handleConfirmReceived(item.id, order.id)}
        >
          Đã nhận hàng
        </Button>
      )}
    </Grid>
  </Grid>
))}


            {/* Trạng thái tổng thể */}
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2, borderTop: "1px solid #ddd", pt: 2 }}>
              <Typography sx={{ color: order.status === "Processing" ? "orange" : "green" }}>
                {statusMap[order.status] || order.status}
              </Typography>
              {order.status === "Delivered" && (
                <Typography sx={{ color: "red" }}>HOÀN THÀNH</Typography>
              )}
            </Box>

            {/* Ngày đặt hàng */}
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

            {/* Hành động khi không phải "Processing" */}
            {order.status !== "Processing" && (
              <>
                <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
                  <Button variant="contained" color="error">Đánh Giá</Button>
                  <Button variant="outlined">Yêu Cầu Trả Hàng/Hoàn Tiền</Button>
                </Box>

                {/* Đánh giá sản phẩm */}
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
              </>
            )}
          </Card>
        ))
      )}
    </Box>
  );
};

export default Orders;
