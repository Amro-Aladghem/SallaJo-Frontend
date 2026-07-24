import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SignUpPage from '@/views/seller/signUpPage/SignUpPage';
import SignInPage from '@/views/seller/signInPage/SignInPage';
import AuthPage from '@/views/seller/authPage/AuthPage';
import SellerLayout from '@/components/SellerLayout';
import DashboardPage from '@/views/seller/dashboardPage/DashboardPage';
import ProductsPage from '@/views/seller/productsPage/ProductsPage';
import AddDiscountPage from '@/views/seller/discountsPage/AddDiscountPage';
import DiscountsPage from '@/views/seller/discountsPage/DiscountsPage';
import StoreInfoPage from '@/views/seller/storeInfoPage/StoreInfoPage';
import PersonInfoPage from '@/views/seller/personInfoPage/PersonInfoPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/seller/sign-up" element={<SignUpPage />} />
        <Route path="/seller/sign-in" element={<SignInPage />} />
        <Route path="/seller/auth" element={<AuthPage />} />

        <Route element={<SellerLayout />}>
          <Route path="/seller/dashboard" element={<DashboardPage />} />
          <Route path="/seller/products" element={<ProductsPage />} />
          <Route path="/seller/discounts/add/:productId" element={<AddDiscountPage />} />
          <Route path="/seller/discounts" element={<DiscountsPage />} />
          <Route path="/seller/store/info" element={<StoreInfoPage />} />
          <Route path="/seller/info" element={<PersonInfoPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/seller/sign-up" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
