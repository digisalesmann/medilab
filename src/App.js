import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
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
import Footer from "./components/Footer";

import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
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
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
