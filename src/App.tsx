import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { SpinnerProvider } from './contexts/SpinnerContext';
import { BagProvider } from './contexts/BagContext';
import Header from './components/Header';
import Home from './pages/Home';
import Products from './pages/Products';
import Cart from './components/Cart';
import Payment from './pages/Payment';
import Bag from './pages/Bag';
import Login from './components/Login';
import Spinner from './components/Spinner';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <SpinnerProvider>
          <BagProvider>
            <Router>
              <div className="App">
                <Header />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/payment" element={<Payment />} />
                  <Route path="/bag" element={<Bag />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/spinner" element={<Spinner />} />
                </Routes>
              </div>
            </Router>
          </BagProvider>
        </SpinnerProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
