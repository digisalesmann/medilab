// src/App.jsx
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Carousel from './components/Carousel';
import PrescriptionOrderSection from './components/PrescriptionOrderSection';
import PlusMembershipBanner from './components/PlusMembershipBanner';
import LabTestSection, { WellnessGrid, FeaturedBrands, DealsOfTheDay } from './components/LabTestSection';
import { TopRatedDoctors, HealthArticles, WhyChooseUs } from './components/TopRatedDoctors';
import AppPromoBanner from './components/AppPromoBanner';
import AppPromoBannerr, { WhatsAppFloatButton } from './components/AppPromoBannerr';
import TestimonialsSection from './components/TestimonialsSection';
import Pharmacies from "./pages/Pharmacies";
import Pricing from "./pages/Pricing";
import Contact from "./pages/Contact";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from './pages/ForgotPassword';
import PharmacyProfile from './pages/PharmacyProfile';
import AdminPanel from './pages/AdminPanel';
import AdminDashboard from './pages/AdminDashboard';
import AdminRoute from './routes/AdminRoute';
import RewardWalletPage from './pages/RewardWalletPage';
import ProductProfile from "./pages/ProductProfile";
import Cart from "./pages/Cart";
import ScrollToTop from "./components/ScrollToTop";
import DoctorProfile from './pages/DoctorProfile';
import LabTestProfile from "./pages/LabTestProfile";
import Plus from './pages/Plus';
import CategoryListing from "./pages/CategoryListing";
import BrandStore from "./pages/BrandStore";
import CategoriesPage from './pages/CategoriesPage';
import SearchPage from './search/SearchPage';
import ServiceHub from './pages/ServiceHub';
import Profile from './pages/Profile';          
import AccountSettings from "./pages/AccountSettings";
import PrescriptionSuccess from 'pages/PrescriptionSuccess';

import './App.css';

function App() {
  const location = useLocation();

  // Hide header/footer on auth pages
  const hideLayout = ['/login', '/register', '/forgot-password'].includes(location.pathname);
  const hideFooter =
    location.pathname === '/pharmacies' ||
    location.pathname.startsWith('/pharmacy/') ||
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/wallet') ||
    location.pathname.startsWith('/profile') ||
    location.pathname.startsWith('/account-settings');

  return (
    <div className="App">
      {/* 🔒 Global reCAPTCHA container (must exist and NOT be display:none) */}
      <div
        id="recaptcha-container"
        style={{
          position: 'fixed',
          left: '-9999px',
          bottom: 0,
          width: '1px',
          height: '1px',
          opacity: 0,
          pointerEvents: 'none',
        }}
      />

      {!hideLayout && <Header />}
      <ScrollToTop />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <Home />
              <Carousel />
              <PrescriptionOrderSection />
              <PlusMembershipBanner />
              <LabTestSection />
              <WellnessGrid />
              <div className="lg:hidden relative w-screen left-1/2 -translate-x-1/2 h-2 bg-[#e9eff6] my-4" />
              <FeaturedBrands />
              <div className="lg:hidden relative w-screen left-1/2 -translate-x-1/2 h-2 bg-[#e9eff6] my-4" />
              <DealsOfTheDay />
              <TopRatedDoctors />
              <HealthArticles />
              <WhyChooseUs />
              <TestimonialsSection />
              <AppPromoBanner />
              <AppPromoBannerr />
              <WhatsAppFloatButton />
            </>
          }
        />

        {/* Public */}
        <Route path="/pharmacies" element={<Pharmacies />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/doctor/:id/:slug" element={<DoctorProfile />} />
        <Route path="/lab-tests/:slug" element={<LabTestProfile />} />
        <Route path="/plus" element={<Plus />} />
        <Route path="/category/:slug" element={<CategoryListing />} />
        <Route path="/brand/:slug" element={<BrandStore />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/services/:slug" element={<ServiceHub />} />
        <Route path="/prescription-success" element={<PrescriptionSuccess />} />

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route path="/wallet" element={<RewardWalletPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/pharmacy/:id" element={<PharmacyProfile />} />
          <Route path="/product/:slug" element={<ProductProfile />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/account-settings" element={<AccountSettings />} />
        </Route>

        {/* Admin */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>
      </Routes>

      {!hideLayout && !hideFooter && <Footer />}
    </div>
  );
}

export default App;