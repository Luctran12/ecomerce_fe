// ShopPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Grid, Card, CardContent, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ShopPage = () => {
  const [shops, setShops] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8389/shop/store')
      .then(response => {
        setShops(response.data.data);
      })
      .catch(error => {
        console.error('Error fetching shops:', error);
      });
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>Danh sách cửa hàng</Typography>
      <Grid container spacing={2}>
        {shops.map(shop => (
          <Grid item xs={12} sm={6} md={4} key={shop.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{shop.name}</Typography>
                <Typography variant="body2" color="textSecondary">{shop.description || 'Không có mô tả'}</Typography>
                <Typography variant="body2">{shop.address}</Typography>
                <Button
                  variant="contained"
                  sx={{ marginTop: 1 }}
                  onClick={() => navigate(`/shop/${shop.id}`)}
                >
                  Xem chi tiết
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default ShopPage;
