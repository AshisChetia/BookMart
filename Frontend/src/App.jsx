import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/auth/AuthPage";
import BuyerHome from "./pages/buyer/BuyerHome";
import BuyerCategories from "./pages/buyer/BuyerCategories";
import CategoryBooks from "./pages/buyer/CategoryBooks";
import BuyerProfile from "./pages/buyer/BuyerProfile";
import NewArrivals from "./pages/buyer/NewArrivals";
import MyOrders from "./pages/buyer/MyOrders";
import OrderDetails from "./pages/buyer/OrderDetails";
import Wishlist from "./pages/buyer/Wishlist";
import BookDetails from "./pages/buyer/BookDetails";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/buyer/home" element={<BuyerHome />} />
        <Route path="/buyer/categories" element={<BuyerCategories />} />
        <Route path="/buyer/categories/:categoryName" element={<CategoryBooks />} />
        <Route path="/buyer/profile" element={<BuyerProfile />} />
        <Route path="/buyer/new" element={<NewArrivals />} />
        <Route path="/buyer/orders" element={<MyOrders />} />
        <Route path="/buyer/orders/:orderId" element={<OrderDetails />} />
        <Route path="/buyer/wishlist" element={<Wishlist />} />
        <Route path="/buyer/book/:bookId" element={<BookDetails />} />
      </Routes>
    </>
  );
}

export default App;
