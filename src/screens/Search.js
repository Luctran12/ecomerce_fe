import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard";
import { Box, Grid } from "@mui/material";

const Search = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query") || "";

  const [searchResults, setSearchResults] = useState([]);

  const navigate = useNavigate();
  useEffect(() => {
    if (!query) return;

    const fetchResults = async () => {
      try {
        const response = await fetch(`http://localhost:8389/shop/product/search?name=${query}`);
        const data = await response.json();
        setSearchResults(data.data || []);
      } catch (error) {
        console.error("Lỗi khi tải kết quả tìm kiếm:", error);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <Grid sx={{width: '100%'}}>
      <h2>Kết quả tìm kiếm cho: "{query}"</h2>
      {searchResults.length > 0 ? (
        <Grid>
          {searchResults.map((product) => (
             <ProductCard onClick={() => navigate("/detail/"+ product.id) } product={product} />
          ))}
        </Grid>
      ) : (
        <p>Không tìm thấy sản phẩm nào.</p>
      )}
    </Grid>
  );
};

export default Search;
