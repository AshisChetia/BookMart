import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Loading from "./components/Loading";

// Lazy load pages
const LandingPage = lazy(() => import("./pages/LandingPage"));
const AuthPage = lazy(() => import("./pages/auth/AuthPage"));

// Buyer Pages
const BuyerHome = lazy(() => import("./pages/buyer/BuyerHome"));
const BuyerCategories = lazy(() => import("./pages/buyer/BuyerCategories"));
const CategoryBooks = lazy(() => import("./pages/buyer/CategoryBooks"));
const BuyerProfile = lazy(() => import("./pages/buyer/BuyerProfile"));
const NewArrivals = lazy(() => import("./pages/buyer/NewArrivals"));
const MyOrders = lazy(() => import("./pages/buyer/MyOrders"));
const OrderDetails = lazy(() => import("./pages/buyer/OrderDetails"));
const Wishlist = lazy(() => import("./pages/buyer/Wishlist"));
const BookDetails = lazy(() => import("./pages/buyer/BookDetails"));
const Cart = lazy(() => import("./pages/buyer/Cart"));

// Seller Pages
const SellerHome = lazy(() => import("./pages/seller/SellerHome"));
const SellerAnalytics = lazy(() => import("./pages/seller/SellerAnalytics"));
const SellerBooks = lazy(() => import("./pages/seller/SellerBooks"));
const AddBook = lazy(() => import("./pages/seller/AddBook"));
const EditBook = lazy(() => import("./pages/seller/EditBook"));
const SellerOrders = lazy(() => import("./pages/seller/SellerOrders"));
const SellerProfile = lazy(() => import("./pages/seller/SellerProfile"));

function App() {
  return (
    <Suspense fallback={<Loading />}>
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
      </Routes>
    </Suspense>
  );
}

export default App;

