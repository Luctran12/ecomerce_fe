"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Box, Button, Grid, Typography, IconButton, Rating, Avatar, Snackbar, Alert } from "@mui/material"
import { ShoppingCart, Share, FavoriteBorder, CheckCircle } from "@mui/icons-material"
import { Link } from "react-router-dom"

const ProductDetail = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [mainImage, setMainImage] = useState("https://placehold.co/500x500")
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [userRating, setUserRating] = useState(0)
  const [userComment, setUserComment] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [reviewSnackbar, setReviewSnackbar] = useState(false)
  const [selectedRatingFilter, setSelectedRatingFilter] = useState(null)
  const [ratings, setRatings] = useState([])
  const [filteredRatings, setFilteredRatings] = useState([])

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await fetch(`http://localhost:8389/shop/rating/${id}`)
        if (!response.ok) throw new Error("Không thể lấy dữ liệu đánh giá.")
        const data = await response.json()
        setRatings(data || [])
        setFilteredRatings(data || []) // Initialize filtered ratings with all ratings
        console.log(data)
      } catch (error) {
        console.error("Lỗi khi tải đánh giá:", error)
      }
    }

    fetchRatings()
  }, [id, reviewSnackbar])

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:8389/shop/product/get/${id}`)
        if (!response.ok) throw new Error("Lỗi khi lấy dữ liệu sản phẩm!")
        const data = await response.json()
        setProduct(data.data)
        setMainImage(data.data.imageUrl[0])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  // Filter ratings when selectedRatingFilter changes
  useEffect(() => {
    if (selectedRatingFilter === null) {
      // Show all ratings
      setFilteredRatings(ratings)
    } else {
      // Filter ratings by selected star rating
      const filtered = ratings.filter((rating) => rating.rating === selectedRatingFilter)
      setFilteredRatings(filtered)
    }
  }, [selectedRatingFilter, ratings])

  const handleFilterRating = (starCount) => {
    if (selectedRatingFilter === starCount) {
      // If clicking the same filter again, clear the filter
      setSelectedRatingFilter(null)
    } else {
      // Set the new filter
      setSelectedRatingFilter(starCount)
    }
  }

  const calculateAverageRating = (ratings) => {
    if (!ratings || ratings.length === 0) return 0

    const total = ratings.reduce((sum, ratingObj) => sum + ratingObj.rating, 0)
    return (total / ratings.length).toFixed(1) // Làm tròn 1 chữ số thập phân
  }

  // Count ratings by star count
  const countRatingsByStars = (starCount) => {
    return ratings.filter((rating) => rating.rating === starCount).length
  }

  const handleAddToCart = async () => {
    const userId = localStorage.getItem("userId")
    if (!userId) {
      alert("Bạn cần đăng nhập để thêm vào giỏ hàng!")
      return
    }

    try {
      const response = await fetch(`http://localhost:8389/shop/cart/addToCart?userId=${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: id, quantity: 1 }),
      })

      if (!response.ok) throw new Error("Không thể thêm vào giỏ hàng!")

      setOpenSnackbar(true) // Hiển thị thông báo khi thêm thành công
    } catch (err) {
      alert("Có lỗi xảy ra, vui lòng thử lại!")
    }
  }

  const handleSubmitReview = async () => {
    const userId = localStorage.getItem("userId")
    const orderId = "123" // tùy hệ thống, bạn có thể lấy orderId từ đơn hàng đã mua

    // Kiểm tra nếu thiếu rating hoặc comment
    if (!userRating || !userComment.trim()) {
      alert("Vui lòng nhập đầy đủ đánh giá và nhận xét.")
      return
    }

    // Kiểm tra nếu user đã đánh giá rồi
    const hasUserRated = ratings?.some((r) => r.userId === userId)
    if (hasUserRated) {
      alert("Bạn đã đánh giá sản phẩm này rồi.")
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch("http://localhost:8389/shop/rating", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating: userRating,
          comment: userComment,
          productId: id,
          userId,
          orderId,
        }),
      })

      if (!response.ok) throw new Error("Không gửi được đánh giá.")

      setUserRating(0)
      setUserComment("")
      setReviewSnackbar(true)

      // Làm mới dữ liệu đánh giá nếu cần
    } catch (error) {
      console.log(error)
      alert("Có lỗi xảy ra khi gửi đánh giá.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <Typography>Đang tải dữ liệu...</Typography>
  if (error) return <Typography color="error">Lỗi: {error}</Typography>
  if (!product) return <Typography color="error">Không tìm thấy sản phẩm!</Typography>

  return (
    <Box sx={{ maxWidth: 1200, margin: "auto", padding: 3 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <img src={mainImage || "/placeholder.svg"} alt={product.name} style={{ width: "100%", borderRadius: 8 }} />
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2, gap: 1 }}>
            {product.imageUrl.map((img, index) => (
              <img
                key={index}
                src={img || "/placeholder.svg"}
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
          <Typography variant="h5" color="primary">
            {product.name}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
            <Rating value={product.rating || 4.5} readOnly precision={0.5} />
            <Typography variant="body2" sx={{ ml: 1 }}>
              {ratings.length} đánh giá • {product.sold} đã bán
            </Typography>
          </Box>

          <Typography variant="h5" sx={{ color: "red", fontWeight: "bold", mt: 1 }}>
            {product.price?.toLocaleString()}₫
          </Typography>

          <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
            <Button variant="contained" color="error" fullWidth startIcon={<ShoppingCart />} onClick={handleAddToCart}>
              Thêm Vào Giỏ Hàng
            </Button>
            <Button variant="contained" color="primary" fullWidth>
              Mua Ngay
            </Button>
          </Box>

          <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
            <IconButton color="primary">
              <Share />
            </IconButton>
            <IconButton color="error">
              <FavoriteBorder />
            </IconButton>
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
      {/* Thông tin cửa hàng */}
      {product.store && (
        <Box
          sx={{
            mt: 3,
            p: 2,
            border: "1px solid #ccc",
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            gap: 2,
            cursor: "pointer",
            textDecoration: "none",
            "&:hover": { backgroundColor: "#f5f5f5" },
          }}
          component={Link}
          to={`/shop/${product.store.id}`}
        >
          <Avatar src={product.store.image} alt={product.store.name} sx={{ width: 56, height: 56 }} />
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              {product.store.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Xem cửa hàng
            </Typography>
          </Box>
        </Box>
      )}
      {/* Đánh giá sản phẩm */}
      <Box sx={{ maxWidth: "100%", mx: "auto", p: 3, border: "1px solid #ddd", borderRadius: 2, mt: 4 }}>
        <Typography variant="h6" fontWeight="bold">
          ĐÁNH GIÁ SẢN PHẨM
        </Typography>

        {/* Điểm số trung bình */}
        <Box display="flex" alignItems="center" mt={2}>
          <Typography variant="h4" color="error" fontWeight="bold">
            {calculateAverageRating(ratings)}
          </Typography>
          <Typography variant="h6" sx={{ mx: 1 }}>
            trên 5
          </Typography>
        </Box>
        <Rating value={calculateAverageRating(ratings) || 0} precision={0.1} readOnly sx={{ my: 1 }} />

        {/* Bộ lọc đánh giá */}
        <Box display="flex" flexWrap="wrap" gap={1} my={2}>
          <Button
            variant={selectedRatingFilter === null ? "contained" : "outlined"}
            color="error"
            onClick={() => setSelectedRatingFilter(null)}
          >
            Tất Cả ({ratings.length})
          </Button>
          <Button variant={selectedRatingFilter === 5 ? "contained" : "outlined"} onClick={() => handleFilterRating(5)}>
            5 Sao ({countRatingsByStars(5)})
          </Button>
          <Button variant={selectedRatingFilter === 4 ? "contained" : "outlined"} onClick={() => handleFilterRating(4)}>
            4 Sao ({countRatingsByStars(4)})
          </Button>
          <Button variant={selectedRatingFilter === 3 ? "contained" : "outlined"} onClick={() => handleFilterRating(3)}>
            3 Sao ({countRatingsByStars(3)})
          </Button>
          <Button variant={selectedRatingFilter === 2 ? "contained" : "outlined"} onClick={() => handleFilterRating(2)}>
            2 Sao ({countRatingsByStars(2)})
          </Button>
          <Button variant={selectedRatingFilter === 1 ? "contained" : "outlined"} onClick={() => handleFilterRating(1)}>
            1 Sao ({countRatingsByStars(1)})
          </Button>
        </Box>

        {localStorage.getItem("userId") && (
          <Box sx={{ mt: 4, borderTop: "1px solid #ddd", pt: 3 }}>
            <Typography variant="h6" fontWeight="bold">
              Gửi đánh giá của bạn
            </Typography>

            <Rating name="user-rating" value={userRating} onChange={(event, newValue) => setUserRating(newValue)} />

            <textarea
              rows={4}
              placeholder="Viết nhận xét..."
              style={{
                width: "100%",
                marginTop: 8,
                padding: 10,
                borderRadius: 6,
                border: "1px solid #ccc",
                fontSize: 14,
                resize: "vertical",
              }}
              value={userComment}
              onChange={(e) => setUserComment(e.target.value)}
            />

            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              onClick={handleSubmitReview}
              disabled={submitting}
            >
              Gửi đánh giá
            </Button>

            <Snackbar open={reviewSnackbar} autoHideDuration={3000} onClose={() => setReviewSnackbar(false)}>
              <Alert severity="success">Đánh giá đã được gửi!</Alert>
            </Snackbar>
          </Box>
        )}

        {/* Danh sách đánh giá người dùng */}
        {filteredRatings.length === 0 ? (
          <Typography sx={{ mt: 2 }}>
            {selectedRatingFilter ? `Không có đánh giá nào ${selectedRatingFilter} sao.` : "Chưa có đánh giá nào."}
          </Typography>
        ) : (
          filteredRatings.map((review, index) => (
            <Box key={index} sx={{ mt: 3, p: 2, border: "1px solid #eee", borderRadius: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Avatar sx={{ mr: 1 }}>{review.userId?.charAt(0).toUpperCase()}</Avatar>
                <Box>
                  <Rating value={review.rating} readOnly size="small" />
                  <Typography variant="body2" color="text.secondary">
                    {new Date(review.createAt).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {review.comment}
              </Typography>

              {review.imageUrls && (
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
                  {review.imageUrls.map((url, i) => (
                    <img
                      key={i}
                      src={url || "/placeholder.svg"}
                      alt={`Review Image ${i}`}
                      style={{ width: 80, height: 80, borderRadius: 8, objectFit: "cover" }}
                    />
                  ))}
                </Box>
              )}

              {/* Nếu có phản hồi */}
              {review.replies && (
                <Box sx={{ mt: 2, pl: 2, borderLeft: "3px solid #ddd" }}>
                  {review.replies.map((reply, j) => (
                    <Box key={j} sx={{ mb: 1 }}>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {reply.userId}
                      </Typography>
                      <Typography variant="body2">{reply.content}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(reply.createAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          ))
        )}
      </Box>
    </Box>
  )
}

export default ProductDetail
