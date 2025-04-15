import { Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../ProductCard";

function ProductByStore() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      const storeId = localStorage.getItem("storeId");
      try {
        const response = await axios.get(
          `http://localhost:8389/shop/store/${storeId}`
        );
        setProducts(response.data.data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Lọc sản phẩm theo danh mục được chọn

  return (
    <Box sx={{ width: "100%" }}>
      {/* Phần hiển thị danh mục */}
      <Box sx={{ px: 18, py: 2, borderBottom: "1px solid #eee" }}>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}></Box>
      </Box>

      {/* Phần hiển thị sản phẩm */}
      <Grid container spacing={0} sx={{ width: "100%", px: 18, pt: 2 }}>
        {products.map((product) => (
          <Grid
          onClick={() => navigate("/productForm/" + product.id)}
            item
            key={product.id}
            xs={12}
            sm={4}
            md={2}
            sx={{ minWidth: "180px" }}
          >
            <ProductCard
              onClick={() => navigate("/productForm/" + product.id)}
              product={product}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default ProductByStore;
