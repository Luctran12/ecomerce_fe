import './App.css';
import React from "react";
import ProductList from './screens/ProductList';
import Header from './screens/Header';
import { Container } from '@mui/material';
import Footer from './screens/Footer';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CartPage from './screens/CartPage';
import ProductDetail from './screens/ProductDetail';

import Register from './screens/login/Register';
import Login from './screens/login/Login';
import CheckoutPage from './screens/CheckoutPage';
import AccountSettings from './screens/AccountSettings';
import Search from './screens/Search'
import OrderPage from './screens/cartAndOrder/OrderPage';
import SellerRegis from './screens/login/SellerRegis';
import SellerDashboard from './screens/sellerScreen/SellerDashboard';
import SellerLogin from './screens/sellerScreen/SellerLogin';
import StoreNotification from './screens/sellerScreen/StoreNotification ';
import ShopPage from './screens/ShopPage';
import ShopDetail from './screens/ShopDetail';
import OrderListPage from './screens/sellerScreen/OrderListPage';

function App() {
  return (
    <Router>
      <Header />
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4, px:1 }}>
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
          <Route path='/seller' element={<SellerDashboard />} />
          <Route path='/seller-login' element={<SellerLogin />} />
          <Route path='/seller-noti' element={<StoreNotification />} />
          <Route path="/store" element={<ShopPage />} />
        <Route path="/shop/:id" element={<ShopDetail />} />
        <Route path="/orderList" element={<OrderListPage />} />
        </Routes>
      </Container>
      <Footer />
    </Router>
  );
}

export default App;
