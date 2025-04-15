import React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { Box, Stack } from '@mui/material';

function ProductCard({ product }) {
  const navigate = useNavigate();

  return (
    <Card
     
      variant="outlined"
      sx={{
        cursor: 'pointer',
        width: { xs: '100%', sm: 150, md: 180, lg: 180 }, // Tăng kích thước để trông thoáng hơn
        maxWidth: 220,
        mx: "auto",
        borderRadius: 2, // Bo góc nhẹ hiện đại hơn
        overflow: 'hidden', // Đảm bảo nội dung không tràn ra ngoài
        bgcolor: 'background.paper',
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-5px)', // Hiệu ứng nổi lên khi hover
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)', // Đổ bóng mạnh hơn
        },
        marginBottom:1
      }}
    >
      {/* Image Section */}
      {product.imageUrl?.length > 0 && (
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            image={product.imageUrl[0]}
            alt={product.name}
            sx={{
              width: '100%',
              height: 185, // Tăng chiều cao ảnh
              objectFit: 'cover',
              transition: 'opacity 0.3s',
              '&:hover': {
                opacity: 0.95, // Hiệu ứng mờ nhẹ khi hover
              },
            }}
          />
          {/* Optional: Badge or Discount Tag */}
          {product.discount && (
            <Box
              sx={{
                position: 'absolute',
                top: 8,
                left: 8,
                bgcolor: 'error.main',
                color: 'white',
                px: 1,
                py: 0.5,
                borderRadius: 1,
                fontSize: 12,
                fontWeight: 'bold',
              }}
            >
              -{product.discount}%
            </Box>
          )}
        </Box>
      )}

      {/* Content Section */}
      <CardContent sx={{ p: 2 }}>
        <Stack spacing={1}>
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontSize: { xs: '14px', sm: '16px', md: '18px' },
              fontWeight: 600, // Chữ đậm hơn một chút
              lineHeight: 1.2,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              color: 'text.primary',
            }}
          >
            {product.name}
          </Typography>

          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '14px', sm: '16px' },
                fontWeight: 700,
                color: 'primary.main', // Dùng màu chính của theme
              }}
            >
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
            </Typography>
            {/* Optional: Add to Cart Button */}
            <Typography variant='h9'>
              đã bán {product.sold}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default ProductCard;