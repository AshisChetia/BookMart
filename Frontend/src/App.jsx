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
import Cart from "./pages/buyer/Cart";
import SellerHome from "./pages/seller/SellerHome";
import SellerAnalytics from "./pages/seller/SellerAnalytics";
import SellerBooks from "./pages/seller/SellerBooks";
import AddBook from "./pages/seller/AddBook";
import EditBook from "./pages/seller/EditBook";
import SellerOrders from "./pages/seller/SellerOrders";
import SellerProfile from "./pages/seller/SellerProfile";
import SellerSettings from "./pages/seller/SellerSettings";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        {/* Buyer Routes */}
        <Route path="/buyer/home" element={<BuyerHome />} />
        <Route path="/buyer/categories" element={<BuyerCategories />} />
        <Route path="/buyer/categories/:categoryName" element={<CategoryBooks />} />
        <Route path="/buyer/profile" element={<BuyerProfile />} />
        <Route path="/buyer/new" element={<NewArrivals />} />
        <Route path="/buyer/orders" element={<MyOrders />} />
        <Route path="/buyer/orders/:orderId" element={<OrderDetails />} />
        <Route path="/buyer/wishlist" element={<Wishlist />} />
        <Route path="/buyer/cart" element={<Cart />} />
        <Route path="/buyer/book/:bookId" element={<BookDetails />} />
        {/* Seller Routes */}
        <Route path="/seller/home" element={<SellerHome />} />
        <Route path="/seller/analytics" element={<SellerAnalytics />} />
        <Route path="/seller/books" element={<SellerBooks />} />
        <Route path="/seller/books/new" element={<AddBook />} />
        <Route path="/seller/books/:bookId/edit" element={<EditBook />} />
        <Route path="/seller/orders" element={<SellerOrders />} />
        <Route path="/seller/profile" element={<SellerProfile />} />
        <Route path="/seller/settings" element={<SellerSettings />} />
      </Routes>
    </>
  );
}

export default App;

