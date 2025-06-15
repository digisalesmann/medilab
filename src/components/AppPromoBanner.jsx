import React from "react";

const AppPromoBanner = () => {
  return (
    <section className="relative bg-gradient-to-br from-blue-100 via-green-100 to-blue-200 py-16 px-4 sm:px-8 md:px-20 overflow-hidden">
      
      {/* Left phone mockup */}
      <img
        src="/images/left.png"
        alt="App Preview Left"
        className="hidden md:block absolute bottom-0 left-0 w-36 md:w-48 lg:w-56 xl:w-64"
      />

      {/* Right phone mockup */}
      <img
        src="/images/right.png"
        alt="App Preview Right"
        className="hidden md:block absolute top-0 right-0 w-36 md:w-48 lg:w-56 xl:w-64"
      />

      {/* Center Content */}
      <div className="relative z-10 flex flex-col items-center text-center mx-auto max-w-3xl px-4">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 leading-tight">
          Your Health,
          <br className="hidden sm:block" />
          One Tap Away
        </h2>
        <p className="mt-4 text-gray-700 text-base sm:text-lg lg:text-xl">
          Track prescriptions, consult doctors, and order essentials — all in one app.
        </p>

        {/* Store Buttons */}
        <div className="mt-6 flex justify-center items-center gap-4 flex-nowrap">
  <a
    href="https://play.google.com/store"
    target="_blank"
    rel="noopener noreferrer"
  >
    <img
      src="/images/google.png"
      alt="Get it on Google Play"
      className="h-12 max-w-[160px] w-auto"
    />
  </a>
  <a
    href="https://www.apple.com/app-store/"
    target="_blank"
    rel="noopener noreferrer"
  >
    <img
      src="/images/apple.png"
      alt="Download on the App Store"
      className="h-12 max-w-[160px] w-auto"
    />
  </a>
</div>

      </div>
    </section>
  );
};

export default AppPromoBanner;
