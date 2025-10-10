"use client";

import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaHeartbeat,
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaUserMd,
  FaStethoscope,
  FaCapsules,
  FaHospital,
  FaMicroscope,
  FaAmbulance,
} from "react-icons/fa";
import { ChevronDown, ChevronUp, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MEDICAL_CATEGORIES = [
  { name: "Doctors", icon: <FaUserMd className="text-emerald-500 mr-2" />, to: "/doctors" },
  { name: "Pharmacies", icon: <FaCapsules className="text-emerald-500 mr-2" />, to: "/pharmacies" },
  { name: "Lab Tests", icon: <FaMicroscope className="text-emerald-500 mr-2" />, to: "/lab-tests" },
  { name: "Hospitals", icon: <FaHospital className="text-emerald-500 mr-2" />, to: "/hospitals" },
  { name: "Emergency", icon: <FaAmbulance className="text-emerald-500 mr-2" />, to: "/emergency" },
  { name: "Consultation", icon: <FaStethoscope className="text-emerald-500 mr-2" />, to: "/consultation" },
];

const QUICK_LINKS = [
  { name: "Home", to: "/" },
  { name: "Book Appointment", to: "/doctors" },
  { name: "Order Medicine", to: "/pharmacies" },
  { name: "Lab Test Booking", to: "/lab-tests" },
  { name: "Health Rewards", to: "/wallet" },
  { name: "Contact / Help", to: "/contact" },
];

const AccordionItem = ({ title, children, id }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-emerald-200">
      <button
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center py-3 text-left font-semibold text-gray-800 hover:text-emerald-600 transition-colors"
      >
        <span>{title}</span>
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.33, ease: "easeInOut" }}
            // important: left-align content (helps mobile dropdowns)
            className="overflow-hidden mt-2 space-y-2 text-sm text-gray-600 text-left"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Footer = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3500);
    setEmail("");
  };

  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-emerald-100 text-gray-700 pt-20 px-6 sm:px-10 lg:px-20 border-t border-emerald-100">
      {/* Subtle aura / glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_20%,rgba(16,185,129,0.12),transparent_60%)] animate-pulse" />

      {/* Desktop layout */}
      <div className="hidden lg:grid grid-cols-5 gap-14 pb-14 relative z-10">
        {/* Brand */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
          <div className="flex items-center gap-3 mb-5">
            <FaHeartbeat className="text-emerald-600 text-4xl animate-pulse" />
            <div>
              <span className="text-3xl font-extrabold text-emerald-700 tracking-tight block">MediLab</span>
              <span className="text-xs text-gray-500">Premium HealthTech</span>
            </div>
          </div>

          <p className="text-sm leading-relaxed text-gray-600 mb-5 pr-2">
            <span className="font-semibold text-emerald-700">Your trusted digital health companion.</span>
            <br />
            Book appointments, order medicines, and access lab tests, all in one place.
          </p>

          <div className="flex gap-2">
            <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold">NDA Certified</span>
            <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold">24/7 Support</span>
          </div>
        </motion.div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold text-lg mb-4 text-emerald-700">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            {QUICK_LINKS.map((item, i) => (
              <li key={i}>
                <Link
                  to={item.to}
                  className="hover:text-emerald-600 font-medium relative after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-emerald-500 hover:after:w-full after:transition-all"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div>
          <h4 className="font-semibold text-lg mr-9 mb-4 text-emerald-700">Medical Services</h4>
          <ul className="space-y-2 text-sm">
            {MEDICAL_CATEGORIES.map((cat, i) => (
              <li key={i} className="flex items-center">
                <Link to={cat.to} className="flex items-center hover:text-emerald-600 transition-transform font-medium group">
                  <span className="group-hover:scale-110 transition-transform">{cat.icon}</span>
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold text-lg mr-9 mb-4 text-emerald-700">Contact Us</h4>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <FaPhoneAlt className="text-emerald-500" /> <span className="font-medium">+234 903 788 4753</span>
            </li>
            <li className="flex items-center gap-2">
              <FaEnvelope className="text-emerald-500" /> <span className="font-medium">support@medilab.com</span>
            </li>
            <li className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-emerald-500" /> <span className="font-medium">Imo, Nigeria</span>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="font-semibold text-lg mb-4 text-emerald-700">Stay Updated</h4>
          <form
            onSubmit={handleSubscribe}
            className="flex flex-col gap-3 bg-white/80 backdrop-blur-xl p-4 rounded-xl shadow-md border border-emerald-200 hover:shadow-lg transition-all"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email for tips & offers"
              className="px-4 py-2 text-sm rounded-full outline-none bg-transparent border border-emerald-100 placeholder-gray-400 focus:ring-1 focus:ring-emerald-400 w-full"
            />
            <button
              type="submit"
              className="flex items-center justify-center bg-emerald-600 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-emerald-700 transition-all"
            >
              {submitted ? <><CheckCircle size={16} className="mr-2" /> Subscribed!</> : "Subscribe"}
            </button>
          </form>

          <div className="flex space-x-3 mt-4">
            {[FaFacebookF, FaInstagram, FaTwitter].map((Icon, i) => (
              <motion.a
                key={i}
                href="/"
                whileHover={{ rotate: 6, scale: 1.06 }}
                className="p-3 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 transition-all shadow-sm"
                aria-label={`follow on social ${i}`}
              >
                <Icon size={16} />
              </motion.a>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile / Tablet - Accordions (includes Quick Links, Services, Contact, Stay Updated) */}
      <div className="lg:hidden space-y-4 pb-10 relative z-10">
        <AccordionItem id="acc-quicklinks" title="Quick Links">
          <div className="space-y-2">
            {QUICK_LINKS.map((item, i) => (
              <Link
                key={i}
                to={item.to}
                className="block hover:text-emerald-600 transition-colors font-medium text-left"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </AccordionItem>

        <AccordionItem id="acc-services" title="Medical Services">
          <div className="space-y-2">
            {MEDICAL_CATEGORIES.map((cat, i) => (
              <Link
                key={i}
                to={cat.to}
                className="flex items-center hover:text-emerald-600 transition-colors font-medium text-left"
              >
                {cat.icon}
                <span>{cat.name}</span>
              </Link>
            ))}
          </div>
        </AccordionItem>

        {/* NEW: Contact Us accordion for mobile */}
        <AccordionItem id="acc-contact" title="Contact Us">
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start gap-3">
              <FaPhoneAlt className="mt-1 text-emerald-500" />
              <div className="text-left">
                <span className="font-medium">+234 903 788 4753</span>
                <div className="text-xs text-gray-500">Mon–Sun, 8:00–20:00</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FaEnvelope className="mt-1 text-emerald-500" />
              <div className="text-left">
                <span className="font-medium">support@medilab.com</span>
                <div className="text-xs text-gray-500">Expect 24-hour response time</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FaMapMarkerAlt className="mt-1 text-emerald-500" />
              <div className="text-left">
                <span className="font-medium">Imo, Nigeria</span>
                <div className="text-xs text-gray-500">Regional hub</div>
              </div>
            </div>
          </div>
        </AccordionItem>

        {/* NEW: Stay Updated accordion for mobile */}
        <AccordionItem id="acc-stay" title="Stay Updated">
          <div className="space-y-3">
            <form
              onSubmit={handleSubscribe}
              className="flex flex-col gap-3 bg-white/80 backdrop-blur-sm p-3 rounded-xl shadow border border-emerald-200"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email for health tips & offers"
                className="px-4 py-2 text-sm rounded-full outline-none placeholder-gray-400 bg-transparent border border-emerald-100 w-full text-left"
              />
              <button
                type="submit"
                className="flex items-center justify-center bg-emerald-600 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-emerald-700 transition-all"
              >
                {submitted ? <><CheckCircle size={16} className="mr-2" /> Subscribed!</> : "Subscribe"}
              </button>
            </form>

            <div className="flex items-center gap-3">
              {[FaFacebookF, FaInstagram, FaTwitter].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="/"
                  whileHover={{ rotate: 6, scale: 1.06 }}
                  className="p-3 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 transition-all shadow-sm"
                  aria-label={`social ${i}`}
                >
                  <Icon size={16} />
                </motion.a>
              ))}
              <div className="text-sm text-gray-500">Follow us for tips & promos</div>
            </div>
          </div>
        </AccordionItem>
      </div>

      <p className="text-center text-xs text-gray-500 mt-10 pb-6 relative z-10">
        &copy; {new Date().getFullYear()} <span className="font-semibold text-emerald-700">MediLab</span>. All rights reserved. | Powered by{" "}
        <span className="font-semibold text-emerald-700">Premium HealthTech</span>
      </p>
    </footer>
  );
};

export default Footer;
