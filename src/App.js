import React from 'react';
import Header from './components/Header';
import Home from './pages/Home';
import Carousel from './components/Carousel';
import PrescriptionOrderSection from './components/PrescriptionOrderSection';
import PlusMembershipBanner from './components/PlusMembershipBanner';
import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <Home />
      <Carousel />
      <PrescriptionOrderSection />
      <PlusMembershipBanner />
      {/* Add more components as needed */}
      <main className="p-4">
        <h1>Welcome to MediLab</h1>
      </main>
    </div>
  );
}

export default App;