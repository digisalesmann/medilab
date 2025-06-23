import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaHeartbeat } from "react-icons/fa";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { ChevronDown, ChevronUp } from "lucide-react";

const AccordionItem = ({ title, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        className="w-full flex justify-between items-center py-3 text-left font-semibold border-b"
        onClick={() => setOpen(!open)}
      >
        {title}
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      {open && <div className="mt-2 space-y-2 text-sm">{children}</div>}
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="bg-green-100 text-gray-700 pt-10 px-6 sm:px-10 lg:px-20">
      
      {/* DESKTOP View */}
      <div className="hidden lg:grid grid-cols-4 gap-10 pb-10">
        {/* Brand */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <div className="flex items-center gap-2">
                        <FaHeartbeat className="text-emerald-600 text-2xl" />
                        <span className="text-3xl font-bold text-emerald-600 select-none">MediLab</span>
                      </div>
          </div>
          <p className="text-sm text-left leading-relaxed">
            Empowering your health journey with expert care, tracking & delivery — all in one tap.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-green-600">Home</Link></li>
            <li><Link to="/pharmacies" className="hover:text-green-600">Pharmacies</Link></li>
            <li><Link to="/pricing" className="hover:text-green-600">Reward System</Link></li>
            <li><Link to="contact" className="hover:text-green-600">Contact / Help</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h4 className="font-semibold text-lg mb-4">Categories</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/medicine" className="hover:text-green-600">Medicine</Link></li>
            <li><Link to="/wellness" className="hover:text-green-600">Wellness</Link></li>
            <li><Link to="/mom-baby" className="hover:text-green-600">Mom & Baby</Link></li>
            <li><Link to="/devices-fitness" className="hover:text-green-600">Devices & Fitness</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold text-lg -ml-28 mb-4">Contact Us</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2"><FaPhoneAlt /> +234 800 123 4567</li>
            <li className="flex items-center gap-2"><FaEnvelope /> support@medilab.com</li>
            <li className="flex items-center gap-2"><FaMapMarkerAlt /> Imo, Nigeria</li>
          </ul>
        </div>
      </div>

      {/* MOBILE / TABLET View */}
      <div className="lg:hidden text-left space-y-4 pb-8">
        <AccordionItem title="Quick Links">
          <Link to="/" className="block hover:text-green-600">Home</Link>
          <Link to="/pharmacies" className="block hover:text-green-600">Pharmacies</Link>
          <Link to="/wallet" className="block hover:text-green-600">Reward System</Link>
          <Link to="contact" className="block hover:text-green-600">Contact / Help</Link>
        </AccordionItem>

        <AccordionItem title="Categories">
          <Link to="/medicine" className="block hover:text-green-600">Medicine</Link>
          <Link to="/wellness" className="block hover:text-green-600">Wellness</Link>
          <Link to="/mom-baby" className="block hover:text-green-600">Mom & Baby</Link>
          <Link to="/devices-fitness" className="block hover:text-green-600">Devices & Fitness</Link>
        </AccordionItem>

        <AccordionItem title="Contact Us">
          <div className="flex items-start gap-2"><FaPhoneAlt className="mt-1" /> +234 903 788 4753</div>
          <div className="flex items-start gap-2"><FaEnvelope className="mt-1" /> support@medilab.com</div>
          <div className="flex items-start gap-2"><FaMapMarkerAlt className="mt-1" /> Imo, Nigeria</div>
        </AccordionItem>
      </div>

      {/* Newsletter + Social */}
      <div className="border-t border-gray-300 pt-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="w-full md:w-auto flex flex-row items-center gap-3">
    <input
      type="email"
      placeholder="Subscribe to our newsletter"
      className="w-full sm:w-80 px-5 py-3 border border-green-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
    />
    <button className="bg-green-600 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-green-700 transition">
      Subscribe
    </button>
  </div>
        <div className="flex space-x-4 text-green-600 text-lg">
          <a href="https://facebook.com" target="_blank" rel="noreferrer"><FaFacebookF /></a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer"><FaInstagram /></a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer"><FaTwitter /></a>
        </div>
      </div>

      <p className="text-center text-xs text-gray-500 mt-6">
        &copy; {new Date().getFullYear()} MediLab. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
