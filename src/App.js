import React from 'react';
import Header from './components/Header';
import Home from './pages/Home';
import Carousel from './components/Carousel';
import PrescriptionOrderSection from './components/PrescriptionOrderSection';
import PlusMembershipBanner from './components/PlusMembershipBanner';
import LabTestSection from './components/LabTestSection';
import { WellnessGrid } from './components/LabTestSection';
import { FeaturedBrands } from './components/LabTestSection';
import { DealsOfTheDay } from './components/LabTestSection';
import { TopRatedDoctors } from './components/TopRatedDoctors';
import { HealthArticles } from './components/TopRatedDoctors';
import { WhyChooseUs } from './components/TopRatedDoctors';
import AppPromoBanner from './components/AppPromoBanner';


import './App.css';
import './index.css';

function App() {
  return (
    <div className="App">
      <Header />
      <Home />
      <Carousel />
      <PrescriptionOrderSection />
      <PlusMembershipBanner />
      <LabTestSection />
      <WellnessGrid />
      <FeaturedBrands />
      <DealsOfTheDay />
      <TopRatedDoctors />
      <HealthArticles />
      <WhyChooseUs />
      <AppPromoBanner />
      {/* Add more components as needed */}
      <main className="p-4">
        <h1>Welcome to MediLab</h1>
      </main>
    </div>
  );
}

export default App;