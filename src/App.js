import { Container } from "@mui/material";
import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import CartPage from "./screens/CartPage";
import Footer from "./screens/Footer";
import Header from "./screens/Header";
import ProductDetail from "./screens/ProductDetail";
import ProductList from "./screens/ProductList";

import AccountSettings from "./screens/AccountSettings";
import CheckoutPage from "./screens/CheckoutPage";
import Search from "./screens/Search";
import ShopDetail from "./screens/ShopDetail";
import ShopPage from "./screens/ShopPage";
import OrderPage from "./screens/cartAndOrder/OrderPage";
import Login from "./screens/login/Login";
import Register from "./screens/login/Register";
import SellerRegis from "./screens/login/SellerRegis";
import OrderListPage from "./screens/sellerScreen/OrderListPage";
import ProductForm from "./screens/sellerScreen/ProductForm";
import SellerDashboard from "./screens/sellerScreen/SellerDashboard";
import SellerLogin from "./screens/sellerScreen/SellerLogin";
import StoreNotification from "./screens/sellerScreen/StoreNotification ";

function App() {
  return (
    <Router>
      <Header />
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4, px: 1 }}>
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/cart/:userId" element={<CartPage />} />
          <Route path="/detail/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/settings" element={<AccountSettings />} />
          <Route path="/search" element={<Search />} />
          <Route path="/order" element={<OrderPage />} />
          <Route path="/seller-register" element={<SellerRegis />} />
          <Route path="/seller" element={<SellerDashboard />} />
          <Route path="/seller-login" element={<SellerLogin />} />
          <Route path="/seller-noti" element={<StoreNotification />} />
          <Route path="/store" element={<ShopPage />} />
          <Route path="/shop/:id" element={<ShopDetail />} />
          <Route path="/orderList" element={<OrderListPage />} />
          <Route path="/productForm/:id" element={<ProductForm />} />
        </Routes>
      </Container>
      <Footer />
    </Router>
  );
}

export default App;
