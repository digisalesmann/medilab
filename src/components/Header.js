import { useState } from "react";
import Logo from './Logo'; 
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  ShoppingCart,
  Menu,
  X,
  Home,
  Pill,
  HeartPulse,
  Info,
  Sparkles,
  PawPrint,
} from "lucide-react";
import { Bell, X as CloseIcon } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [showMessage, setShowMessage] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { notifications, markAllAsRead, markAsRead, deleteNotification } = useNotifications();
  const [showDropdown, setShowDropdown] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;


   // Inline function for "Home" link
  const handleHomeClick = () => {
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="w-full bg-white shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
         <Logo />

        {/* Desktop Nav */}
        <nav className="hidden md:flex flex-1 justify-center space-x-10 text-gray-700 text-base font-medium">
          <span onClick={handleHomeClick} className="cursor-pointer hover:text-green-600 transition-colors">
          Home
        </span>
          <Link to="/pharmacies" className="hover:text-green-600 transition-colors">Pharmacies</Link>
          <Link to="/inventory" className="hover:text-green-600 transition-colors">Inventory & Pricing</Link>
          <Link to="/Contact" className="hover:text-green-600 transition-colors">Contact/Help</Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4 relative">
  {/* Notification Icon with Dropdown */}
  <div className="relative">
    <button
      onClick={() => setShowDropdown(prev => !prev)}
      className="relative p-1.5 rounded-full hover:bg-gray-100"
    >
      <Bell className="w-6 h-6 text-gray-700" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1.5">
          {unreadCount}
        </span>
      )}
    </button>

    {showDropdown && (
      <div className="absolute right-0 mt-2 w-72 bg-white border rounded-lg shadow-lg z-50 animate-fade-in">
        <div className="p-3 border-b font-semibold text-sm text-gray-700 flex justify-between items-center">
          Notifications
          <button
            onClick={markAllAsRead}
            className="text-xs text-blue-500 hover:underline"
          >
            Mark all as read
          </button>
        </div>
        <ul className="max-h-64 overflow-y-auto divide-y">
          {notifications.length === 0 ? (
            <li className="p-3 text-gray-500 text-sm">No notifications</li>
          ) : (
            notifications.map((note) => (
              <li
                key={note.id}
                className={`p-3 text-sm flex justify-between items-start gap-2 cursor-pointer ${
                  note.read ? 'text-gray-500' : 'text-black font-medium'
                } hover:bg-gray-50`}
              >
                <span onClick={() => markAsRead(note.id)}>
                  {note.message}
                </span>
                <CloseIcon
                  onClick={() => deleteNotification(note.id)}
                  className="w-4 h-4 text-gray-400 hover:text-red-500"
                />
              </li>
            ))
          )}
        </ul>
      </div>
    )}
  </div>

  {/* Cart Icon */}
  <ShoppingCart className="w-6 h-6 text-gray-700 cursor-pointer hover:text-green-600 transition-colors" />

  {/* Menu Toggle */}
  <button onClick={toggleMenu} className="ml-2">
    {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
  </button>
</div>

      </div>

      {/* Hamburger Dropdown */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-30 z-40"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Sidebar Drawer */}
          <div className="fixed right-0 top-0 h-screen w-[24rem] max-w-full bg-white shadow-2xl z-50 px-8 py-6 overflow-y-auto border-l border-b border-gray-200">
            {/* Drawer Header */}
            <div className="flex justify-between items-start mb-5">
              <h2 className="text-2xl font-semibold text-gray-700">Welcome to MediLab</h2>
              <button onClick={() => setIsOpen(false)}>
                <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
              </button>
            </div>

            {/* Auth Buttons */}
            <div className="flex gap-4 mb-6">
              <Link to="/register" className="flex-1">
                <button className="bg-emerald-600 text-white py-2.5 text-base font-medium rounded hover:bg-emerald-700 w-full">
                  Sign up
                </button>
              </Link>
              <Link to="/login" className="flex-1">
                <button className="w-full border border-emerald-600 text-emerald-600 py-2.5 text-base font-medium rounded hover:bg-emerald-50">
                  Login
                </button>
              </Link>
            </div>

            {/* Message Banner */}
            {showMessage && (
              <div className="bg-emerald-50 text-emerald-700 p-4 flex justify-between items-start mb-6 text-base rounded">
                <p className="font-medium">Try MediLab for healthcare professionals</p>
                <button onClick={() => setShowMessage(false)}>
                  <X className="w-5 h-5 text-emerald-600 hover:text-emerald-800" />
                </button>
              </div>
            )}

            {/* Mobile Nav */}
            <div className="block md:hidden mb-6 space-y-1 text-gray-800 text-base">
              <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-4 p-2 rounded hover:bg-gray-100">
                <Home className="w-5 h-5" /> Home
              </Link>
              <Link to="/pharmacies" onClick={() => setIsOpen(false)} className="flex items-center gap-4 p-2 rounded hover:bg-gray-100">
                <Pill className="w-5 h-5" /> Pharmacies
              </Link>
              <Link to="/inventory" onClick={() => setIsOpen(false)} className="flex items-center gap-4 p-2 rounded hover:bg-gray-100">
                <HeartPulse className="w-5 h-5" /> Inventory & Pricing
              </Link>
              <Link to="/contact" onClick={() => setIsOpen(false)} className="flex items-center gap-4 p-2 rounded hover:bg-gray-100">
                <Info className="w-5 h-5" /> Contact/Help
              </Link>
            </div>

            <div className="space-y-1 text-gray-800 text-base">
              <div onClick={() => setIsOpen(false)} className="flex items-center gap-4 p-2 rounded hover:bg-gray-100 cursor-pointer">
                <Pill className="w-5 h-5" /> Medicine
              </div>
              <div onClick={() => setIsOpen(false)} className="flex items-center gap-4 p-2 rounded hover:bg-gray-100 cursor-pointer">
                <Info className="w-5 h-5" /> Health Info
              </div>
              <div onClick={() => setIsOpen(false)} className="flex items-center gap-4 p-2 rounded hover:bg-gray-100 cursor-pointer">
                <HeartPulse className="w-5 h-5" /> Fitness
              </div>
              <div onClick={() => setIsOpen(false)} className="flex items-center gap-4 p-2 rounded hover:bg-gray-100 cursor-pointer">
                <Sparkles className="w-5 h-5" /> Mom & Baby
              </div>
              <div onClick={() => setIsOpen(false)} className="flex items-center gap-4 p-2 rounded hover:bg-gray-100 cursor-pointer">
                <Sparkles className="w-5 h-5" /> Devices
              </div>
              <div onClick={() => setIsOpen(false)} className="flex items-center gap-4 p-2 rounded hover:bg-gray-100 cursor-pointer">
                <HeartPulse className="w-5 h-5" /> Wellness
              </div>
              <div onClick={() => setIsOpen(false)} className="flex items-center gap-4 p-2 rounded hover:bg-gray-100 cursor-pointer">
                <PawPrint className="w-5 h-5" /> Pet Supplies
              </div>
              <div onClick={() => setIsOpen(false)} className="flex items-center gap-4 p-2 rounded hover:bg-gray-100 cursor-pointer">
                <Sparkles className="w-5 h-5" /> Skin Care/Beauty
              </div>
              <div onClick={() => setIsOpen(false)} className="flex items-center gap-4 p-2 rounded hover:bg-gray-100 cursor-pointer">
                <Info className="w-5 h-5" /> Suggestions
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
