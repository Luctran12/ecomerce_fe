"use client";

import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Snackbar,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ProductForm = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    imageUrl: [],
  });
  const [mainImage, setMainImage] = useState("https://placehold.co/500x500");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:8389/shop/product/get/${id}`);
        if (!res.ok) throw new Error("Lỗi khi lấy dữ liệu sản phẩm");
        const data = await res.json();
        const productData = data.data;

        setProduct(productData);
        setMainImage(productData.imageUrl?.[0] || "");
        setFormData({
          name: productData.name || "",
          price: productData.price || "",
          description: productData.description || "",
          imageUrl: productData.imageUrl || [],
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    const form = new FormData();
    form.append("name", formData.name);
    form.append("price", formData.price);
    form.append("description", formData.description);
    form.append("mainImage", mainImage);

    try {
      const response = await fetch(
        `http://localhost:8389/shop/product/${id}`,
        {
          method: "PUT",
          body: form,
        }
      );
      if (!response.ok) throw new Error("Cập nhật thất bại");
      setOpenSnackbar(true);
    } catch (err) {
      alert("Lỗi khi lưu: " + err.message);
    }
  };

  if (loading) return <Typography>Đang tải...</Typography>;
  if (error) return <Typography color="error">Lỗi: {error}</Typography>;
  if (!product) return <Typography color="error">Không có sản phẩm</Typography>;

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", mt: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <img
            src={mainImage || "/placeholder.svg"}
            alt="Main"
            style={{ width: "100%", borderRadius: 8 }}
          />
          <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
            {formData.imageUrl.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`img-${idx}`}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 8,
                  border:
                    img === mainImage ? "2px solid red" : "1px solid gray",
                  cursor: "pointer",
                }}
                onClick={() => setMainImage(img)}
              />
            ))}
          </Box>
        </Grid>

        <Grid item xs={12} md={8}>
          <TextField
            fullWidth
            label="Tên sản phẩm"
            name="name"
            value={formData.name}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Giá sản phẩm"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Mô tả"
            name="description"
            multiline
            rows={4}
            value={formData.description}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />

          <Button variant="contained" color="primary" onClick={handleSave}>
            Lưu thay đổi
          </Button>
        </Grid>
      </Grid>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message="Cập nhật thành công"
      />
    </Box>
  );
};

export default ProductForm;
