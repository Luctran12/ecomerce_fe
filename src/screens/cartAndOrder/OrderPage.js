import React, { useState, useEffect } from "react"; 
import axios from "axios";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const OrderPage = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [orderItems, setOrderItems] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shippingFee, setShippingFee] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isOrdering, setIsOrdering] = useState(false);
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);

  useEffect(() => {
    const storedItems = localStorage.getItem("selectedOrderItems");
    if (storedItems) {
      setOrderItems(JSON.parse(storedItems));
    }

    const fetchUserInfo = async () => {
      try {
        const response = await fetch(`http://localhost:8389/shop/user/findById?id=${userId}`);
        if (!response.ok) throw new Error("Không thể lấy thông tin user");
        const data = await response.json();
        setUserInfo(data.data);
        if(data?.data.address == null) navigate("/settings");
      } catch (error) {
        console.error("Lỗi lấy thông tin user:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchUserInfo();
  }, [userId]);

  const [shippingError, setShippingError] = useState(null); // Thêm state lưu lỗi
  useEffect(() => {
    const calculateShippingFee = async () => {
      if (!orderItems.length) return;
      const product = orderItems[0].product;
      try {
        const storeResponse = await axios.get(`http://localhost:8389/shop/store/${product.store.id}`);
        const from_district_id = parseInt(storeResponse.data?.data?.districtId, 10) || 0;
        const from_ward_code = storeResponse.data?.data?.wardCode.toString();
        const {  height, length, weight, width } = product;
        const to_district_id = parseInt(userInfo?.districtId) || 0;
        const to_ward_code = userInfo?.wardCode;
        
        console.log("----",storeResponse)

        const body = {
          from_district_id,
          from_ward_code,
          service_id: 53320,
          service_type_id: null,
          to_district_id,
          to_ward_code,
          height,
          length,
          weight,
          width,
          insurance_value: 10000,
          cod_failed_amount: 2000,
          coupon: null,
          items: [{
            name: product.name,
            quantity: 1,
            height: product.height,
            weight: product.weight,
            length: product.length,
            width: product.width,
          }],
        };
        console.log(body)
        const feeResponse = await axios.post(
          "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
          body,
          {
            headers: {
              shopId: "5649487",
              token: "dd88e637-f0ee-11ef-8752-da588d8b708e",
              "Content-Type": "application/json"
            }
          }
        );
       
        setShippingFee(feeResponse.data.data.total);
      } catch (error) {
        console.error("Lỗi khi tính phí ship:", error);
      
        // Kiểm tra nếu API có phản hồi lỗi và có message
        if (error.response && error.response.data) {
          setShippingError(error.response.data.code_message_value || error.response.data.message);
        } else {
          setShippingError("Không thể tính phí vận chuyển, vui lòng thử lại.");
        }
      }
    };

    calculateShippingFee();
  }, [orderItems, userInfo]);

  const handleConfirmOrder = async () => {
    if (!userInfo || orderItems.length === 0) {
      setError("Vui lòng kiểm tra lại thông tin đơn hàng.");
      return;
    }

    setIsOrdering(true);
    const orderData = {
      userId: userInfo.id,
      items: orderItems.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
      })),
      address: userInfo.address,
      totalPrice: orderItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0) + (30000 || 0),
    };

    try {
      const response = await axios.post("http://localhost:8389/shop/order", orderData);
      console.log("Đặt hàng thành công:", response.data);
      setOrderSuccess(true);

      // Xóa giỏ hàng sau khi đặt hàng thành công
      localStorage.removeItem("selectedOrderItems");

      setOpenSuccessDialog(true)
    } catch (err) {
      console.error("Lỗi khi đặt hàng:", err);
      setError("Không thể đặt hàng, vui lòng thử lại!");
    } finally {
      setIsOrdering(false);
    }
  };

  if (loading) return <CircularProgress sx={{ display: "block", mx: "auto", mt: 4 }} />;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>📦 Thông tin đơn hàng</Typography>

      {userInfo && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6">Địa chỉ nhận hàng</Typography>
          <Typography><strong>Người nhận:</strong> {userInfo.name}</Typography>
          <Typography><strong>Điện thoại:</strong> {userInfo.phone}</Typography>
          <Typography><strong>Email:</strong> {userInfo.email}</Typography>
          <Typography><strong>Địa chỉ:</strong> {userInfo.address}</Typography>
        </Paper>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sản phẩm</TableCell>
              <TableCell>Giá</TableCell>
              <TableCell>Số lượng</TableCell>
              <TableCell>Tổng</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orderItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <img src={item.product.imageUrl[0]} alt={item.product.name} width={80} height={80} style={{ borderRadius: 8, marginRight: 10 }} />
                    <Typography>{item.product.name} </Typography>
                  </Box>
                </TableCell>
                <TableCell>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.product.price)}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.product.price * item.quantity)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

     
        <Typography variant="h6" sx={{ mt: 2 }}>
          Phí vận chuyển: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(30000)}
        </Typography>
      
      
      <Typography variant="h6" sx={{ mt: 2 }}>
        Tổng tiền: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(orderItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0) + 30000)}
      </Typography>

      
      



      <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleConfirmOrder}>Xác nhận đặt hàng</Button>

      {/* Dialog thông báo đặt hàng thành công */}
      <Dialog open={openSuccessDialog} onClose={() => setOpenSuccessDialog(false)}>
        <DialogTitle>🎉 Đặt hàng thành công!</DialogTitle>
        <DialogContent>
          <Typography>Đơn hàng của bạn đã được đặt thành công.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => navigate("/orders")} color="primary">
            Xem đơn hàng
          </Button>
          <Button onClick={() => navigate("/")} color="secondary">
            Tiếp tục mua sắm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
    
  );
};

export default OrderPage;
