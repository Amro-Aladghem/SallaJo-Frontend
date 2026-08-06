import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignUpPage from '@/views/seller/signUpPage/SignUpPage';
import SignInPage from '@/views/seller/signInPage/SignInPage';
import AuthPage from '@/views/seller/authPage/AuthPage';
import SellerLayout from '@/components/SellerLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardPage from '@/views/seller/dashboardPage/DashboardPage';
import StoreDesignPage from '@/views/seller/storeDesignPage/StoreDesignPage';
import StoreViewerPage from '@/views/seller/storeViewerPage/StoreViewerPage';
import ProductsPage from '@/views/seller/productsPage/ProductsPage';
import AddDiscountPage from '@/views/seller/discountsPage/AddDiscountPage';
import DiscountsPage from '@/views/seller/discountsPage/DiscountsPage';
import StoreInfoPage from '@/views/seller/storeInfoPage/StoreInfoPage';
import PersonInfoPage from '@/views/seller/personInfoPage/PersonInfoPage';
import AddOfferPage from '@/views/seller/offerPage/AddOfferPage';
import OffersPage from '@/views/seller/offersPage/OffersPage';
import StockPage from '@/views/seller/stockPage/StockPage';
import SupportPage from '@/views/seller/supportPage/SupportPage';
import PromptsPage from '@/views/seller/promptsPage/PromptsPage';
import StorePage from '@/views/customer/storePage/StorePage';
import CustomerOffersPage from '@/views/customer/offersPage/OffersPage';
import AdminSignInPage from '@/views/admin/signInPage/SignInPage';
import AdminDashboard from '@/views/admin/dashboardPage/DashboardPage';
import CustomerDiscountsPage from '@/views/customer/discountsPage/DiscountsPage';
import CustomerProductPage from '@/views/customer/productPage/ProductPage';
import CustomerStoreInfoPage from '@/views/customer/storeInfoPage/StoreInfoPage';
import CustomerCartPage from '@/views/customer/cartPage/CartPage';
import CustomerCheckoutPage from '@/views/customer/checkoutPage/CheckoutPage';
import CustomerSearchPage from '@/views/customer/searchPage/SearchPage';
import CustomerLayout from '@/components/CustomerLayout';
import NotFoundPage from '@/components/NotFoundPage';
import MainPage from '@/views/main/MainPage';
import MainSupportPage from '@/views/main/SupportPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/seller/sign-up" element={<SignUpPage />} />
        <Route path="/seller/sign-in" element={<SignInPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/seller/auth" element={<AuthPage />} />
          <Route path="/seller/store/design" element={<StoreDesignPage />} />
          <Route path="/seller/store/:slug" element={<StoreViewerPage />} />
          <Route element={<SellerLayout />}>
            <Route path="/seller/dashboard" element={<DashboardPage />} />
            <Route path="/seller/products" element={<ProductsPage />} />
            <Route path="/seller/products/stock" element={<StockPage />} />
            <Route path="/seller/discounts/add/:productId" element={<AddDiscountPage />} />
            <Route path="/seller/discounts" element={<DiscountsPage />} />
            <Route path="/seller/store/info" element={<StoreInfoPage />} />
            <Route path="/seller/info" element={<PersonInfoPage />} />
            <Route path="/seller/offers" element={<OffersPage />} />
            <Route path="/seller/offers/add" element={<AddOfferPage />} />
            <Route path="/seller/support" element={<SupportPage />} />
            <Route path="/seller/prompts" element={<PromptsPage />} />
          </Route>
        </Route>

        <Route path="/admin/sign-in" element={<AdminSignInPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/" element={<MainPage />} />
        <Route path="/support" element={<MainSupportPage />} />
        <Route path="/store/:slug" element={<StorePage />} />
        <Route element={<CustomerLayout />}>
          <Route path="/store/:slug/offers" element={<CustomerOffersPage />} />
          <Route path="/store/:slug/discounts" element={<CustomerDiscountsPage />} />
          <Route path="/store/:slug/products/:id" element={<CustomerProductPage />} />
          <Route path="/store/:slug/info" element={<CustomerStoreInfoPage />} />
          <Route path="/store/:slug/cart" element={<CustomerCartPage />} />
          <Route path="/store/:slug/checkout" element={<CustomerCheckoutPage />} />
          <Route path="/store/:slug/search" element={<CustomerSearchPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage message="الصفحة غير موجودة" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
