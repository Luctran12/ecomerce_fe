// ShopDetail.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Typography, Card, CardMedia, CardContent, Grid } from '@mui/material';

const ShopDetail = () => {
  const { id } = useParams();
  const [shop, setShop] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8389/shop/store')
      .then(res => {
        const foundShop = res.data.data.find(s => s.id === id);
        setShop(foundShop);
      })
      .catch(err => {
        console.error('Error fetching shop detail:', err);
      });
  }, [id]);

  if (!shop) return <Typography>Đang tải dữ liệu...</Typography>;

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>{shop.name}</Typography>
      <Typography variant="body1">{shop.description || 'Không có mô tả'}</Typography>
      <Typography variant="body2" color="textSecondary" gutterBottom>{shop.address}</Typography>

      <Typography variant="h5" mt={4} mb={2}>Sản phẩm</Typography>
      {shop.products.length === 0 ? (
        <Typography>Không có sản phẩm nào</Typography>
      ) : (
        <Grid container spacing={2}>
          {shop.products.map(product => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card>
                {product.imageUrl?.[0] && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.imageUrl[0]}
                    alt={product.name}
                  />
                )}
                <CardContent>
                  <Typography variant="h6">{product.name}</Typography>
                  <Typography variant="body2">{product.description}</Typography>
                  <Typography variant="subtitle2" color="primary">Giá: {product.price.toLocaleString()}₫</Typography>
                  <Typography variant="body2">Kho: {product.stock}</Typography>
                  <Typography variant="body2" color="textSecondary">Danh mục: {product.category?.name}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default ShopDetail;
