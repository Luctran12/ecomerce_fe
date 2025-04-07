import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box, Button, Grid, Typography, IconButton, Rating, Avatar, Snackbar, Alert
} from "@mui/material";
import { ShoppingCart, Share, FavoriteBorder, CheckCircle } from "@mui/icons-material";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState("https://placehold.co/500x500");
  const [openSnackbar, setOpenSnackbar] = useState(false); // Trạng thái hiển thị thông báo

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:8389/shop/product/get/${id}`);
        if (!response.ok) throw new Error("Lỗi khi lấy dữ liệu sản phẩm!");
        const data = await response.json();
        setProduct(data.data);
        setMainImage(data.data.imageUrl[0]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Bạn cần đăng nhập để thêm vào giỏ hàng!");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8389/shop/cart/addToCart?userId=${userId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: id, quantity: 1 }),
        }
      );

      if (!response.ok) throw new Error("Không thể thêm vào giỏ hàng!");

      setOpenSnackbar(true); // Hiển thị thông báo khi thêm thành công
    } catch (err) {
      alert("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  if (loading) return <Typography>Đang tải dữ liệu...</Typography>;
  if (error) return <Typography color="error">Lỗi: {error}</Typography>;
  if (!product) return <Typography color="error">Không tìm thấy sản phẩm!</Typography>;

  return (
    <Box sx={{ maxWidth: 1200, margin: "auto", padding: 3 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <img src={mainImage} alt={product.name} style={{ width: "100%", borderRadius: 8 }} />
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2, gap: 1 }}>
            {product.imageUrl.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Thumbnail ${index + 1}`}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 8,
                  cursor: "pointer",
                  border: mainImage === img ? "2px solid red" : "2px solid transparent",
                }}
                onClick={() => setMainImage(img)}
              />
            ))}
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h5" color="primary">{product.name}</Typography>
          <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
            <Rating value={product.rating || 4.5} readOnly precision={0.5} />
            <Typography variant="body2" sx={{ ml: 1 }}>
              {product.rating} ({product.reviewsCount} đánh giá) • {product.sold} đã bán
            </Typography>
          </Box>

          <Typography variant="h5" sx={{ color: "red", fontWeight: "bold", mt: 1 }}>
            {product.price?.toLocaleString()}₫
          </Typography>

          <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
            <Button
              variant="contained"
              color="error"
              fullWidth
              startIcon={<ShoppingCart />}
              onClick={handleAddToCart}
            >
              Thêm Vào Giỏ Hàng
            </Button>
            <Button variant="contained" color="primary" fullWidth>
              Mua Ngay
            </Button>
          </Box>

          <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
            <IconButton color="primary"><Share /></IconButton>
            <IconButton color="error"><FavoriteBorder /></IconButton>
          </Box>
        </Grid>
      </Grid>

      {/* Snackbar thông báo */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000} // 3 giây tự đóng
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }} // Hiển thị ở góc dưới phải
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          sx={{ display: "flex", alignItems: "center", fontSize: 16, fontWeight: "bold" }}
        >
          <CheckCircle sx={{ mr: 1 }} /> Thêm vào giỏ hàng thành công!
        </Alert>
      </Snackbar>

      {/* Mô tả sản phẩm */}
      <Box sx={{ mt: 4, p: 2, bgcolor: "#f9f9f9", borderRadius: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
          Mô tả sản phẩm
        </Typography>
        <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
          {product.description}
        </Typography>
      </Box>

      {/* Đánh giá sản phẩm */}
      <Box sx={{ maxWidth: "100%", mx: "auto", p: 3, border: "1px solid #ddd", borderRadius: 2, mt: 4 }}>
        <Typography variant="h6" fontWeight="bold">ĐÁNH GIÁ SẢN PHẨM</Typography>

        {/* Điểm số trung bình */}
        <Box display="flex" alignItems="center" mt={2}>
          <Typography variant="h4" color="error" fontWeight="bold">{product.rating}</Typography>
          <Typography variant="h6" sx={{ mx: 1 }}>trên 5</Typography>
        </Box>
        <Rating value={product.rating || 4.7} precision={0.1} readOnly sx={{ my: 1 }} />

        {/* Bộ lọc đánh giá */}
        <Box display="flex" flexWrap="wrap" gap={1} my={2}>
          <Button variant="contained" color="error">Tất Cả</Button>
          <Button variant="outlined">5 Sao ({product.reviewsCount})</Button>
          <Button variant="outlined">4 Sao (2,4k)</Button>
          <Button variant="outlined">3 Sao (40)</Button>
          <Button variant="outlined">2 Sao (19)</Button>
          <Button variant="outlined">1 Sao (62)</Button>
        </Box>

        {/* Đánh giá của người dùng */}
        {product.reviews && product.reviews.length > 0 ? (
          product.reviews.map((review) => (
            <Box key={review.id} sx={{ mt: 2, borderBottom: "1px solid #ddd", pb: 2 }}>
              <Box display="flex" alignItems="center">
                <Avatar>{review.username.charAt(0).toUpperCase()}</Avatar>
                <Typography variant="body1" sx={{ ml: 2, fontWeight: "bold" }}>
                  {review.username}
                </Typography>
              </Box>
              <Rating value={review.rating} readOnly />
              <Typography variant="body2" color="textSecondary">{review.date}</Typography>
              <Typography variant="body2" mt={1}>{review.comment}</Typography>
            </Box>
          ))
        ) : (
          <Typography variant="body2" color="gray" mt={2}>
            Chưa có đánh giá nào.
          </Typography>
        )}
      </Box>

    </Box>
  );
};

export default ProductDetail;
