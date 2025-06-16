import { useEffect, useState } from "react";
import { Flame, X } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

export default function AppPromoBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Trigger slide-up on mount
    const timeout = setTimeout(() => {
      setShowBanner(true);
    }, 500); // small delay
    return () => clearTimeout(timeout);
  }, []);

  const handleClose = () => {
    setShowBanner(false);
  };

  // Detect platform (basic check)
  const isAndroid = /Android/i.test(navigator.userAgent);
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const storeLink = isAndroid
    ? "https://play.google.com/store/apps/details?id=com.example"
    : isIOS
    ? "https://apps.apple.com/app/id123456789"
    : "#";

  if (!showBanner) return null;

  return (
    <div
      className={`md:hidden fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-3 flex items-center justify-between rounded-t-xl shadow-lg transform transition-all duration-500 ${
        showBanner ? "translate-y-0" : "translate-y-full"
      }`}
    >
      {/* Left: Icon and Text */}
      <div className="flex items-center gap-3">
        <div className="bg-white bg-opacity-20 p-2 rounded-full">
          <Flame className="w-5 h-5 text-white" />
        </div>

        <div className="leading-tight">
          <p className="text-sm font-bold">Get 24% OFF</p>
          <p className="text-xs opacity-80">Only on App</p>
        </div>
      </div>

      {/* Right: CTA + Close */}
      <div className="flex items-center gap-2">
        <a
          href={storeLink}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white text-teal-700 text-sm font-semibold px-4 py-1.5 rounded-md shadow-sm hover:bg-gray-100 transition"
        >
          Get App
        </a>
        <button onClick={handleClose} className="text-white opacity-70 hover:opacity-100">
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export const WhatsAppFloatButton = () => {
  const phoneNumber = "2349037884753"; // No plus sign for wa.me link

  return (
    <a
      href={`https://wa.me/${phoneNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 right-4 z-40 bg-green-700 text-white p-3 sm:p-3.5 md:p-4 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 hover:scale-110"
    >
      <FaWhatsapp className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
    </a>
  );
};