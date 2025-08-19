import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaHeartbeat, FaFacebookF, FaInstagram, FaTwitter, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { ChevronDown, ChevronUp } from "lucide-react";

const AccordionItem = ({ title, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-green-200">
      <button
        className="w-full flex justify-between items-center py-3 text-left font-semibold text-gray-800 hover:text-green-600 transition"
        onClick={() => setOpen(!open)}
      >
        {title}
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      {open && <div className="mt-2 space-y-2 text-sm text-gray-600">{children}</div>}
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-green-50 via-green-100 to-green-200 text-gray-700 pt-12 px-6 sm:px-10 lg:px-20">

      {/* DESKTOP View */}
      <div className="hidden lg:grid grid-cols-4 gap-10 pb-12">
        
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-5">
            <FaHeartbeat className="text-green-600 text-3xl" />
            <span className="text-3xl font-bold text-green-700">MediLab</span>
          </div>
          <p className="text-sm leading-relaxed text-gray-600">
            Empowering your health journey with expert care, tracking & delivery — all in one tap.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold text-lg mb-4 text-green-700">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            {["Home", "Pharmacies", "Reward System", "Contact / Help"].map((item, i) => (
              <li key={i}>
                <Link to="/" className="hover:text-green-600 transition">{item}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h4 className="font-semibold text-lg mb-4 text-green-700">Categories</h4>
          <ul className="space-y-2 text-sm">
            {["Medicine", "Wellness", "Mom & Baby", "Devices & Fitness"].map((item, i) => (
              <li key={i}>
                <Link to="/" className="hover:text-green-600 transition">{item}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold pr-28 text-lg mb-4 text-green-700">Contact Us</h4>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex items-center gap-2"><FaPhoneAlt className="text-green-500" /> +234 800 123 4567</li>
            <li className="flex items-center gap-2"><FaEnvelope className="text-green-500" /> support@medilab.com</li>
            <li className="flex items-center gap-2"><FaMapMarkerAlt className="text-green-500" /> Imo, Nigeria</li>
          </ul>
        </div>
      </div>

      {/* MOBILE / TABLET View */}
      <div className="lg:hidden space-y-4 pb-8">
        <AccordionItem title="Quick Links">
          <Link to="/" className="block hover:text-green-600">Home</Link>
          <Link to="/pharmacies" className="block hover:text-green-600">Pharmacies</Link>
          <Link to="/wallet" className="block hover:text-green-600">Reward System</Link>
          <Link to="/contact" className="block hover:text-green-600">Contact / Help</Link>
        </AccordionItem>
        <AccordionItem title="Categories">
          <Link to="/medicine" className="block hover:text-green-600">Medicine</Link>
          <Link to="/wellness" className="block hover:text-green-600">Wellness</Link>
          <Link to="/mom-baby" className="block hover:text-green-600">Mom & Baby</Link>
          <Link to="/devices-fitness" className="block hover:text-green-600">Devices & Fitness</Link>
        </AccordionItem>
        <AccordionItem title="Contact Us">
          <div className="flex items-start gap-2"><FaPhoneAlt className="mt-1 text-green-500" /> +234 903 788 4753</div>
          <div className="flex items-start gap-2"><FaEnvelope className="mt-1 text-green-500" /> support@medilab.com</div>
          <div className="flex items-start gap-2"><FaMapMarkerAlt className="mt-1 text-green-500" /> Imo, Nigeria</div>
        </AccordionItem>
      </div>

      {/* Newsletter + Social */}
      <div className="border-t border-green-300 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-row items-center w-full md:w-auto gap-3">
          <input
            type="email"
            placeholder="Subscribe to our newsletter"
            className="w-full sm:w-80 px-5 py-3 border border-green-300 rounded-full text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <button className="bg-green-600 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-green-700 hover:shadow-md transition">
            Subscribe
          </button>
        </div>
        <div className="flex space-x-4">
          {[FaFacebookF, FaInstagram, FaTwitter].map((Icon, i) => (
            <a
              key={i}
              href="/"
              className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition"
            >
              <Icon size={16} />
            </a>
          ))}
        </div>
      </div>

      <p className="text-center text-xs text-gray-500 mt-8">
        &copy; {new Date().getFullYear()} MediLab. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
