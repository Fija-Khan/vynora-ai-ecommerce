import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import "./App.css";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Orders from "./pages/Orders";
import Payments from "./pages/Payments";
import OrderDetails from "./pages/OrderDetails";
import Wishlist from "./pages/Wishlist";


function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />}
/>
        <Route path="/cart" element={<Cart />} />
         <Route path="/checkout" element={<Checkout />} />
         <Route path="/order-success"element={<OrderSuccess />}/>
         <Route path="/orders" element={<Orders />} />
         <Route path="/login" element={<Login />} />
         <Route path="/register" element={<Register />} />
         <Route path="/payments" element={<Payments />} />
         <Route path="/orders/:id" element={<OrderDetails />} />
         <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/login" element={<h1>Login</h1>} />
        <Route path="/register" element={<h1>Register</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;