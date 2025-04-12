import { useState, useEffect, useRef } from "react"
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Badge,
  IconButton,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material"
import {
  Inventory as InventoryIcon,
  ShoppingCart as ShoppingCartIcon,
  Notifications as NotificationsIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as AttachMoneyIcon,
} from "@mui/icons-material"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import SockJS from "sockjs-client"
import { Client } from "@stomp/stompjs"
import { useNavigate } from "react-router-dom"


// Sample data
const initialRecentOrders = [
  { id: 1, customer: "Nguyễn Văn A", product: "Áo thun nam", quantity: 2, date: "2023-07-15", status: "Đã giao hàng" },
  { id: 2, customer: "Trần Thị B", product: "Quần jean nữ", quantity: 1, date: "2023-07-14", status: "Đang giao hàng" },
  { id: 3, customer: "Lê Văn C", product: "Giày thể thao", quantity: 1, date: "2023-07-14", status: "Chờ xác nhận" },
  { id: 4, customer: "Phạm Thị D", product: "Túi xách nữ", quantity: 1, date: "2023-07-13", status: "Đã giao hàng" },
  { id: 5, customer: "Hoàng Văn E", product: "Đồng hồ nam", quantity: 1, date: "2023-07-12", status: "Đã giao hàng" },
]

const bestSellingProducts = [
  {
    id: 1,
    name: "Áo thun nam",
    category: "Thời trang nam",
    sold: 120,
    revenue: 12000000,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    name: "Quần jean nữ",
    category: "Thời trang nữ",
    sold: 98,
    revenue: 14700000,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    name: "Giày thể thao",
    category: "Giày dép",
    sold: 85,
    revenue: 17000000,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    name: "Túi xách nữ",
    category: "Phụ kiện",
    sold: 72,
    revenue: 10800000,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 5,
    name: "Đồng hồ nam",
    category: "Phụ kiện",
    sold: 65,
    revenue: 32500000,
    image: "/placeholder.svg?height=40&width=40",
  },
]

const salesData = [
  { name: "T2", sales: 4000 },
  { name: "T3", sales: 3000 },
  { name: "T4", sales: 5000 },
  { name: "T5", sales: 2780 },
  { name: "T6", sales: 1890 },
  { name: "T7", sales: 6390 },
  { name: "CN", sales: 3490 },
]

export default function SellerOverview() {
  const theme = useTheme()
  const [notificationsCount, setNotificationsCount] = useState(0)
  const [recentOrders, setRecentOrders] = useState(initialRecentOrders)
  const [stats, setStats] = useState({
    totalProducts: 156,
    totalOrders: 1243,
    revenue: 235000000,
    pendingOrders: 12,
  })
  const [openDialog, setOpenDialog] = useState(false)
  const [notificationMessages, setNotificationMessages] = useState([])
  const stompClientRef = useRef(null)
  const navigate = useNavigate()
  const storeId = localStorage.getItem("storeId")

  // WebSocket setup
  useEffect(() => {
    if (!storeId) {
      console.warn("Không tìm thấy storeId, không thể đăng ký nhận thông báo!")
      return
    }
    
    console.log("storeId", storeId)

    
    const socket = new SockJS("http://localhost:8389/ws")
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("Kết nối WebSocket thành công!")
        client.subscribe(`/topic/store/${storeId}`, (message) => {
          setNotificationsCount(prev => prev + 1)
          setNotificationMessages(prev => [
            { id: Date.now(), content: message.body },
            ...prev
          ])
          
          try {
            const messageContent = message.body
            const customerName = messageContent.replace("Bạn có đơn hàng mới từ ", "").replace("!", "")
            const newOrder = {
              id: Date.now(),
              customer: customerName,
              product: "Sản phẩm mới",
              quantity: 1,
              date: new Date().toISOString().split("T")[0],
              status: "Chờ xác nhận"
            }
            setRecentOrders(prev => [newOrder, ...prev.slice(0, 4)])
          } catch (error) {
            console.error("Lỗi khi parse message:", error)
          }
        })
      },
      onStompError: (frame) => {
        console.error("Lỗi STOMP: ", frame.headers["message"])
      },
    })

    client.activate()
    stompClientRef.current = client

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate()
      }
    }
  }, [storeId])

  // Xử lý khi click vào icon thông báo
  const handleNotificationClick = () => {
    setOpenDialog(true)
  }

  // Đóng dialog và reset số thông báo
  const handleCloseDialog = () => {
    setOpenDialog(false)
    setNotificationsCount(0)
    // Có thể chọn xóa thông báo đã đọc: setNotificationMessages([])
  }

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value)
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Bảng điều khiển
        </Typography>
        <Badge badgeContent={notificationsCount} color="error">
          <IconButton color="inherit" onClick={handleNotificationClick}>
            <NotificationsIcon />
          </IconButton>
        </Badge>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              borderRadius: 2,
              height: 140,
            }}
          >
            <Box display="flex" justifyContent="space-between">
              <Typography component="h2" variant="h6" color="primary" gutterBottom>
                Sản phẩm
              </Typography>
              <InventoryIcon color="primary" />
            </Box>
            <Typography component="p" variant="h4">
              {stats.totalProducts}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Tổng số sản phẩm
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              borderRadius: 2,
              height: 140,
            }}
          >
            <Box display="flex" justifyContent="space-between">
              <Typography component="h2" variant="h6" color="primary" gutterBottom>
                Đơn hàng
              </Typography>
              <ShoppingCartIcon color="primary" />
            </Box>
            <Typography component="p" variant="h4">
              {stats.totalOrders}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Tổng số đơn hàng đã bán
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              borderRadius: 2,
              height: 140,
            }}
          >
            <Box display="flex" justifyContent="space-between">
              <Typography component="h2" variant="h6" color="primary" gutterBottom>
                Doanh thu
              </Typography>
              <AttachMoneyIcon color="primary" />
            </Box>
            <Typography component="p" variant="h4">
              {formatCurrency(stats.revenue).replace("₫", "")}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Tổng doanh thu
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              borderRadius: 2,
              height: 140,
              bgcolor: theme.palette.warning.light,
            }}
          >
            <Box display="flex" justifyContent="space-between">
              <Typography component="h2" variant="h6" color="text.primary" gutterBottom>
                Chờ xử lý
              </Typography>
              <Badge badgeContent={stats.pendingOrders} color="error">
                <ShoppingCartIcon color="action" />
              </Badge>
            </Box>
            <Typography component="p" variant="h4">
              {stats.pendingOrders}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Đơn hàng cần xử lý
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Notification Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Thông báo mới</DialogTitle>
        <DialogContent>
          <List>
            {notificationMessages.length > 0 ? (
              notificationMessages.map((notification) => (
                <ListItem key={notification.id} onclick={() => navigate(`/orderlist`)}>
                  <ListItemText primary={notification.content} />
                </ListItem>
              ))
            ) : (
              <Typography>Không có thông báo mới</Typography>
            )}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      <Grid container spacing={3}>
        {/* Chart */}
        <Grid item xs={12} md={8}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              borderRadius: 2,
              height: 360,
            }}
          >
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Doanh số bán hàng trong tuần
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={salesData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill={theme.palette.primary.main} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Recent Notifications */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              borderRadius: 2,
              height: 360,
              overflow: "auto",
            }}
          >
            <Typography component="h2" variant="h6" color="primary" gutterBottom display="flex" alignItems="center">
              <NotificationsIcon sx={{ mr: 1 }} /> Thông báo đơn hàng mới
            </Typography>
            <List sx={{ width: "100%", bgcolor: "background.paper" }}>
              {recentOrders.map((order, index) => (
                <Box key={order.id}>
                  <ListItem alignItems="flex-start" onClick={() => navigate(`/orderlist`)}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                        <ShoppingCartIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`Đơn hàng #${order.id} - ${order.customer}`}
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="text.primary">
                            {order.product} x{order.quantity}
                          </Typography>
                          {` — ${order.date} - ${order.status}`}
                        </>
                      }
                    />
                  </ListItem>
                  {index < recentOrders.length - 1 && <Divider variant="inset" component="li" />}
                </Box>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Best Selling Products */}
        <Grid item xs={12}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              borderRadius: 2,
            }}
          >
            <Typography component="h2" variant="h6" color="primary" gutterBottom display="flex" alignItems="center">
              <TrendingUpIcon sx={{ mr: 1 }} /> Sản phẩm bán chạy
            </Typography>
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Sản phẩm</TableCell>
                    <TableCell>Danh mục</TableCell>
                    <TableCell align="right">Đã bán</TableCell>
                    <TableCell align="right">Doanh thu</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bestSellingProducts.map((product) => (
                    <TableRow key={product.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                      <TableCell component="th" scope="row">
                        <Box display="flex" alignItems="center">
                          <Avatar src={product.image} sx={{ mr: 2 }} variant="rounded" />
                          {product.name}
                        </Box>
                      </TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell align="right">{product.sold}</TableCell>
                      <TableCell align="right">{formatCurrency(product.revenue)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}