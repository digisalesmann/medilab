import React from "react";
import { FaApple, FaGooglePlay } from "react-icons/fa";

const AppPromoBanner = () => {
  return (
    <section className="bg-gradient-to-br from-blue-100 via-green-100 to-blue-200 py-10 px-6 md:px-16 flex flex-col md:flex-row items-center justify-between gap-10">
      {/* Left phone mockup */}
      <img
        src="/images/mockup-left.png" // Replace with your own image path
        alt="App Preview Left"
        className="w-40 sm:w-56 md:w-64 lg:w-72"
      />

      {/* Text Center */}
      <div className="text-center md:text-left max-w-xl">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 leading-snug">
          Your Health, <br className="hidden md:block" />
          One Tap Away
        </h2>
        <p className="mt-2 text-gray-700 text-sm md:text-base">
          Track prescriptions, consult doctors, and order essentials all in one app.
        </p>

        {/* Store Buttons */}
        <div className="mt-5 flex flex-wrap justify-center md:justify-start gap-4">
  <a href="#" target="_blank" rel="noopener noreferrer">
    <img
      src="/images/google.png"
      alt="Get it on Google Play"
      className="h-12"
    />
  </a>

  <a href="#" target="_blank" rel="noopener noreferrer">
    <img
      src="/images/app-store-badge.png"
      alt="Download on the App Store"
      className="h-12"
    />
  </a>
</div>

      </div>

      {/* Right phone mockup */}
      <img
        src="/images/mockup-right.png" // Replace with your own image path
        alt="App Preview Right"
        className="w-40 sm:w-56 md:w-64 lg:w-72"
      />
    </section>
  );
};

export default AppPromoBanner;
