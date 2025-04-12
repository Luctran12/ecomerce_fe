import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {
  Typography, Card, CardMedia, CardContent, Grid, Avatar, Button, Box, Divider, Tabs, Tab
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import FavoriteIcon from '@mui/icons-material/Favorite';

const ShopDetail = () => {
  const { id } = useParams();
  const [shop, setShop] = useState(null);
  const [tab, setTab] = useState(0);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8389/shop/store')
      .then(res => {
        const foundShop = res.data.data.find(s => s.id === id);
        setShop(foundShop);

        if (foundShop) {
          const uniqueCategories = [
            ...new Map(
              foundShop.products
                .filter(p => p.category)
                .map(p => [p.category.id, p.category])
            ).values()
          ];
          setCategories(uniqueCategories);
        }
      })
      .catch(err => {
        console.error('Error fetching shop detail:', err);
      });
  }, [id]);

  const handleChangeTab = (event, newValue) => {
    setTab(newValue);
  };

  if (!shop) return <Typography>Đang tải dữ liệu...</Typography>;

  // Lọc sản phẩm theo tab
  const filteredProducts = tab === 0
    ? shop.products
    : shop.products.filter(product => product.category?.id === categories[tab - 1]?.id);

  return (
    <Box sx={{ p: 3 }}>
      {/* Banner + Info */}
      <Card sx={{ mb: 3, position: 'relative' }}>
        <CardMedia
          component="img"
          height="180"
          image={shop.bannerUrl || 'https://via.placeholder.com/800x200?text=Shop+Banner'}
        />
        <Avatar
          src={shop.avatarUrl || 'https://via.placeholder.com/80'}
          sx={{
            width: 80,
            height: 80,
            position: 'absolute',
            top: 140,
            left: 30,
            border: '3px solid white',
          }}
        />
        <Box sx={{ p: 2, pt: 6 }}>
          <Typography variant="h5" fontWeight="bold">{shop.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {shop.description || 'Không có mô tả'}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
            <Button variant="contained" size="small" color="error" startIcon={<FavoriteIcon />}>
              Theo Dõi
            </Button>
            <Button variant="outlined" size="small" startIcon={<ChatIcon />}>
              Chat
            </Button>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Typography><b>Sản phẩm:</b> {shop.products.length}</Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography><b>Đánh giá:</b> ⭐ 4.6 (tùy chỉnh)</Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography><b>Người theo dõi:</b> 417,7k (tùy chỉnh)</Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography><b>Phản hồi Chat:</b> 83%</Typography>
            </Grid>
          </Grid>
        </Box>
      </Card>

      {/* Tabs */}
      <Tabs value={tab} onChange={handleChangeTab} variant="scrollable" scrollButtons="auto">
        <Tab label="Tất cả sản phẩm" />
        {categories.map((category) => (
          <Tab key={category.id} label={category.name} />
        ))}
      </Tabs>

      {/* Products */}
      <Typography variant="h6" sx={{ mt: 3 }}>Sản phẩm</Typography>
      <Grid container spacing={2}>
        {filteredProducts.map(product => (
          <Grid item xs={6} sm={4} md={2.4} lg={2.4} key={product.id}>
            <Card sx={{ boxShadow: 1 }}>
              <CardMedia
                component="img"
                image={product.imageUrl?.[0] || 'https://via.placeholder.com/150'}
                alt={product.name}
                sx={{
                  width: '100%',
                  height: 130,
                  objectFit: 'cover'
                }}
              />
              <CardContent sx={{ p: 1 }}>
                <Typography variant="body2" noWrap>{product.name}</Typography>
                <Typography variant="subtitle2" color="error" fontWeight="bold">
                  {product.price.toLocaleString()}₫
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Đã bán {Math.floor(Math.random() * 1000)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ShopDetail;
