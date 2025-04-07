import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import ProductCard from './ProductCard';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null); // Thêm state mới
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8389/shop/product');
        setProducts(response.data.data.content);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8389/shop/categories');
        setCategories(response.data.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  // Hàm xử lý khi click vào danh mục
  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  // Lọc sản phẩm theo danh mục được chọn
  const filteredProducts = selectedCategory
    ? products.filter(product => product.category.id === selectedCategory)
    : products;

  return (
    <Box sx={{ width: '100%' }}>
      {/* Phần hiển thị danh mục */}
      <Box sx={{ px: 18, py: 2, borderBottom: '1px solid #eee' }}>
        <Typography variant="h6" gutterBottom>
          Danh mục
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant={selectedCategory === null ? "contained" : "outlined"}
            onClick={() => handleCategoryClick(null)}
            sx={{ textTransform: 'none' }}
          >
            Tất cả
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "contained" : "outlined"}
              onClick={() => handleCategoryClick(category.id)}
              sx={{ textTransform: 'none' }}
            >
              {category.name}
            </Button>
          ))}
        </Box>
      </Box>

      {/* Phần hiển thị sản phẩm */}
      <Grid
        container
        spacing={0}
        sx={{ width: "100%", px: 18, pt: 2 }}
      >
        {filteredProducts.map((product) => (
          <Grid item key={product.id} xs={12} sm={4} md={2} sx={{ minWidth: "180px" }}>
            <ProductCard 
              onClick={() => navigate("/detail/"+ product.id)} 
              product={product} 
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default ProductList;