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
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import axios from 'axios';
import dayjs from "dayjs";
import { useNavigate } from 'react-router-dom';

const OrderListPage = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('Tất cả');

  const statusOptions = ['Tất cả', 'Pending', 'Processing', 'Shipped', 'Delivered'];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const storeId = localStorage.getItem('storeId');
        const response = await axios.get(`http://localhost:8389/shop/order/byStore/${storeId}`);
        setOrders(response.data);
        setFilteredOrders(response.data);
      } catch (error) {
        console.error('Lỗi khi tải đơn hàng:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (orderItemId, newStatus) => {
    console.log(orderItemId, newStatus);
    try {
      await axios.put(`http://localhost:8389/shop/order/item/${orderItemId}/${newStatus}`);
      const updatedOrders = orders.map(order =>
        order.id === orderItemId ? { ...order, status: newStatus } : order
      );
      setOrders(updatedOrders);
      filterOrdersByStatus(filterStatus, updatedOrders);
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);
    }
  };

  

  const filterOrdersByStatus = (status, allOrders = orders) => {
    if (status === 'Tất cả') {
      setFilteredOrders(allOrders);
    } else {
      setFilteredOrders(allOrders.filter(order => order.status === status));
    }
  };

  const handleFilterChange = (e) => {
    const newStatus = e.target.value;
    setFilterStatus(newStatus);
    filterOrdersByStatus(newStatus);
  };

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
        Danh sách đơn hàng
      </Typography>

      {/* Dropdown filter status */}
      <Box mb={2} maxWidth={300}>
        <FormControl fullWidth size="small">
          <InputLabel>Lọc theo trạng thái</InputLabel>
          <Select value={filterStatus} label="Lọc theo trạng thái" onChange={handleFilterChange}>
            {statusOptions.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Table */}
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
              <TableCell>Trạng thái</TableCell>
              <TableCell>Giao đến</TableCell>
              <TableCell>Ngày đặt</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.map((order, index) => (
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
                <TableCell sx={{ maxWidth: 300 }}>{order.product.description}</TableCell>
                <TableCell>{order.product.category?.name}</TableCell>
                <TableCell>{order.product.price.toLocaleString()}đ</TableCell>
                <TableCell>{order.quantity}</TableCell>
                <TableCell>
                  <Select
                    value={order.status || 'Pending'}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    size="small"
                    disabled={order.status === 'Delivered'}
                  >
                    {statusOptions
                      .filter(status => status !== 'Tất cả')
                      .map((status) => (
                        <MenuItem key={status} value={status}>
                          {status}
                        </MenuItem>
                      ))}
                  </Select>
                </TableCell>
                <TableCell>{order.address}</TableCell>
                <TableCell>{dayjs(order.date).format("YYYY-MM-DD HH:mm")}</TableCell>
              </TableRow>
            ))}
            {filteredOrders.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Không có đơn hàng nào với trạng thái "{filterStatus}"
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default OrderListPage;
