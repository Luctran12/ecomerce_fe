import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Typography,
  IconButton,
  Box,
  CircularProgress,
  Checkbox,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const CartPage = () => {
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) navigate("/login");
  }, [userId, navigate]);

  useEffect(() => {
    if (!userId) return;
    const fetchCart = async () => {
      try {
        const response = await fetch(`http://localhost:8389/shop/cart?userId=${userId}`);
        if (!response.ok) throw new Error("Không thể lấy dữ liệu giỏ hàng");
        const data = await response.json();
        setCartItems(data?.data.items ?? []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [userId]);

  const toggleSelectItem = (id) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((itemId) => itemId !== id)
        : [...prevSelected, id]
    );
  };

  const increaseQuantity = (id) => {
    setCartItems((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCartItems((prevCart) =>
      prevCart
        .map((item) =>
          item.id === id && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id) => {
    setCartItems((prevCart) => prevCart.filter((item) => item.id !== id));
    setSelectedItems((prevSelected) => prevSelected.filter((itemId) => itemId !== id));
  };

  const totalPrice = cartItems
    .filter((item) => selectedItems.includes(item.id))
    .reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const handleCheckout = () => {
      if (selectedItems.length === 0) {
        alert("Vui lòng chọn sản phẩm để thanh toán");
        return;
      }
      const selectedProducts = cartItems.filter((item) => selectedItems.includes(item.id));
      localStorage.setItem("selectedOrderItems", JSON.stringify(selectedProducts));
      navigate("/order");
  };
    

  if (loading) return <CircularProgress sx={{ display: "block", mx: "auto", mt: 4 }} />;
  if (error) return <Typography color="error" sx={{ mt: 4, textAlign: "center" }}>{error}</Typography>;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>🛒 Giỏ hàng của bạn</Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Sản phẩm</TableCell>
              <TableCell>Giá</TableCell>
              <TableCell>Số lượng</TableCell>
              <TableCell>Tổng</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cartItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Checkbox checked={selectedItems.includes(item.id)} onChange={() => toggleSelectItem(item.id)} />
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <img src={item.product.imageUrl[0]} alt={item.product.name} width={80} height={80} style={{ borderRadius: 8, marginRight: 10 }} />
                    <Typography variant="body1">{item.product.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.product.price)}</TableCell>
                <TableCell>
                  <IconButton onClick={() => decreaseQuantity(item.id)} color="error"><RemoveIcon /></IconButton>
                  {item.quantity}
                  <IconButton onClick={() => increaseQuantity(item.id)} color="primary"><AddIcon /></IconButton>
                </TableCell>
                <TableCell>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.product.price * item.quantity)}</TableCell>
                <TableCell>
                  <IconButton onClick={() => removeItem(item.id)} color="error"><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Typography variant="h6" sx={{ mt: 2 }}>Tổng tiền: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}</Typography>
      <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleCheckout}>Tiến hành thanh toán</Button>
    </Container>
  );
};

export default CartPage;
