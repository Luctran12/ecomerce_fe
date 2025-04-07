import React, { useState, useEffect } from "react";
import { TextField, Button, MenuItem, Typography, Box } from "@mui/material";
import axios from "axios";

const AddProductForm = () => {
  const [storeId, setStoreId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    images: [],
    categoryId: "",
    categoryName: "",
    height: "",
    weight: "",
    length: "",
    width: "",
    storeId: localStorage.getItem("storeId"),
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:8389/shop/categories").then((response) => {
      setCategories(response.data.data);
    });
    const id = localStorage.getItem("storeId");
    setStoreId(id);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, images: [...e.target.files] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const productData = new FormData();
    productData.append("name", formData.name);
    productData.append("description", formData.description);
    productData.append("price", formData.price);
    productData.append("stock", formData.stock);
    productData.append("height", formData.height);
    productData.append("weight", formData.weight);
    productData.append("length", formData.length);
    productData.append("width", formData.width);

    if (formData.categoryId) {
      productData.append("categoryId", formData.categoryId);
    } else if (formData.categoryName) {
      productData.append("categoryName", formData.categoryName);
    }

    formData.images.forEach((file) => productData.append("images", file));

    try {
      await axios.post(
        `http://localhost:8389/shop/store/addProductToStore?storeId=${storeId}`,
        productData,
        { headers: {} }
      );
      alert("Sản phẩm đã được thêm thành công!");

      setFormData({
        name: "",
        description: "",
        price: "",
        stock: "",
        images: [],
        categoryId: "",
        categoryName: "",
        height: "",
        weight: "",
        length: "",
        width: "",
      });
    } catch (error) {
      console.log(error);
      alert("Lỗi khi thêm sản phẩm: " + error.message);
    }
    setLoading(false);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 3, maxWidth: 500, mx: "auto" }}>
      <Typography variant="h5" gutterBottom>Thêm Sản Phẩm</Typography>
      <Typography>
        Thêm ảnh sản phẩm
      </Typography>
      <input type="file" multiple onChange={handleFileChange} style={{ marginTop: 10 }} />
      <TextField label="Tên sản phẩm" name="name" value={formData.name} onChange={handleChange} fullWidth required margin="normal" />
      <TextField label="Mô tả sản phẩm" name="description" value={formData.description} onChange={handleChange} fullWidth required multiline rows={3} margin="normal" />
      <TextField label="Giá sản phẩm" name="price" type="number" value={formData.price} onChange={handleChange} fullWidth required margin="normal" />
      <TextField label="Số lượng" name="stock" type="number" value={formData.stock} onChange={handleChange} fullWidth required margin="normal" />
      <TextField label="Chiều cao (cm)" name="height" type="number" value={formData.height} onChange={handleChange} fullWidth required margin="normal" />
      <TextField label="Trọng lượng (kg)" name="weight" type="number" value={formData.weight} onChange={handleChange} fullWidth required margin="normal" />
      <TextField label="Chiều dài (cm)" name="length" type="number" value={formData.length} onChange={handleChange} fullWidth required margin="normal" />
      <TextField label="Chiều rộng (cm)" name="width" type="number" value={formData.width} onChange={handleChange} fullWidth required margin="normal" />
      
      <TextField select label="Chọn danh mục" name="categoryId" value={formData.categoryId} onChange={handleChange} fullWidth margin="normal">
        {categories.map((cat) => (
          <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
        ))}
      </TextField>
      <TextField label="Hoặc nhập danh mục mới" name="categoryName" value={formData.categoryName} onChange={handleChange} fullWidth margin="normal" />
      <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled={loading}>
        {loading ? "Đang thêm..." : "Thêm sản phẩm"}
      </Button>
    </Box>
  );
};

export default AddProductForm;
