import React, { useEffect, useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Box,
  TableCell,
  Avatar,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  Paper
} from '@mui/material';
import axios from 'axios';

const OrderListPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const storeId = localStorage.getItem('storeId'); // lấy storeId từ localStorage
        console.log(storeId)
        const response = await axios.get(`http://localhost:8389/shop/order/byStore/${storeId}`);
        setOrders(response.data);
      } catch (error) {
        console.error('Lỗi khi tải đơn hàng:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Đơn hàng của cửa hàng
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>Ảnh</TableCell>
              <TableCell>Tên sản phẩm</TableCell>
              <TableCell>Mô tả</TableCell>
              <TableCell>Phân loại</TableCell>
              <TableCell>Giá</TableCell>
              <TableCell>Số lượng</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Avatar
                    variant="square"
                    src={order.product.imageUrl[0]}
                    alt={order.product.name}
                    sx={{ width: 56, height: 56 }}
                  />
                </TableCell>
                <TableCell>{order.product.name}</TableCell>
                <TableCell sx={{ maxWidth: 300 }}>
                  {order.product.description}
                </TableCell>
                <TableCell>{order.product.category?.name}</TableCell>
                <TableCell>{order.product.price.toLocaleString()}đ</TableCell>
                <TableCell>{order.quantity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default OrderListPage;
