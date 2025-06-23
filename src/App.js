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
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from './pages/ForgotPassword';
import PharmacyProfile from './pages/PharmacyProfile';
import AdminPanel from './pages/AdminPanel';
import AdminDashboard from './pages/AdminDashboard';
import AdminRoute from './routes/AdminRoute';
import RewardWalletPage from './pages/RewardWalletPage';

import './App.css';

function App() {
  const location = useLocation();
   const hideLayout = ['/login', '/register', '/forgot-password'].includes(location.pathname); 
   const hideFooter =
  location.pathname === '/pharmacies' ||
  location.pathname.startsWith('/pharmacy/') ||
  location.pathname.startsWith('/admin') ||
  location.pathname.startsWith('/wallet');


  return (
    <div className="App">
      {!hideLayout && <Header />}
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
              <div className="lg:hidden relative w-screen left-1/2 -translate-x-1/2 h-2 bg-[#e9eff6] my-4"></div>
              <FeaturedBrands />
              <div className="lg:hidden relative w-screen left-1/2 -translate-x-1/2 h-2 bg-[#e9eff6] my-4"></div>
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
        <Route path="/pharmacies" element={<Pharmacies />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/pharmacy/:id" element={<PharmacyProfile />} />
        <Route path="/wallet" element={<RewardWalletPage />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
      </Routes>
      {!hideLayout && !hideFooter && <Footer />}
    </div>
  );
}

export default App;
