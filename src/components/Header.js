// src/components/Header.js
import { useState } from "react";
import Logo from "./Logo";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  ShoppingCart,
  Menu,
  X,
  Bell,
  X as CloseIcon,
  Stethoscope,
  FileText,
  Dumbbell,
  Baby,
  Cpu,
  Leaf,
  Dog,
  Sparkles,
} from "lucide-react";
import {
  HomeIcon,
  BuildingStorefrontIcon,
  WalletIcon,
  LifebuoyIcon,
} from "@heroicons/react/24/outline";
import { useNotifications } from "../context/NotificationContext";
import { useAuth } from "../context/AuthContext";

const ADMIN_EMAIL = "admin@medilab.com";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [showMessage, setShowMessage] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const { notifications, markAllAsRead, markAsRead, deleteNotification } =
    useNotifications();
  const unreadCount = notifications.filter((n) => !n.read).length;

  // 🔐 Auth
  const { user, initializing, logout } = useAuth();
  const isAdmin = (user?.email || "").toLowerCase() === ADMIN_EMAIL;
  const displayName =
    user?.displayName ||
    user?.email?.split("@")[0] ||
    user?.phoneNumber ||
    "Profile";
  const avatarLetter = (displayName?.[0] || "U").toUpperCase();

  const handleHomeClick = () => {
    if (location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/");
    }
  };

  const toggleMenu = () => setIsOpen((s) => !s);

  return (
    <header className="w-full bg-white shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Logo />

        {/* Desktop Nav */}
        <nav className="hidden md:flex flex-1 justify-center space-x-10 text-gray-700 text-base font-medium">
          <button
            onClick={handleHomeClick}
            className="hover:text-green-600 transition-colors"
          >
            Home
          </button>
          <Link to="/pharmacies" className="hover:text-green-600 transition-colors">
            Pharmacies
          </Link>
          <Link to="/wallet" className="hover:text-green-600 transition-colors">
            Reward System
          </Link>
          <Link to="/contact" className="hover:text-green-600 transition-colors">
            Contact/Help
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 relative flex-shrink-0">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown((prev) => !prev)}
              className="relative p-1.5 rounded-full hover:bg-gray-100"
              aria-label="Notifications"
            >
              <Bell className="w-6 h-6 text-gray-700" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1.5">
                  {unreadCount}
                </span>
              )}
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-72 bg-white border rounded-lg shadow-lg z-[60]">
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
                          note.read ? "text-gray-500" : "text-black font-medium"
                        } hover:bg-gray-50`}
                      >
                        <span onClick={() => markAsRead(note.id)}>{note.message}</span>
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

          {/* Cart */}
          <button
            onClick={() => {
              setShowDropdown(false);
              setIsOpen(false);
              navigate("/cart");
            }}
            className="p-1.5 rounded-full hover:bg-gray-100"
            aria-label="Open cart"
          >
            <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-green-600 transition-colors" />
          </button>

          {/* Auth (desktop) */}
          {initializing ? (
            <div className="hidden md:block w-28 h-9 rounded-full bg-gray-100 animate-pulse" />
          ) : user ? (
            <div className="hidden md:block">
              <ProfileMenu
                name={displayName}
                email={user.email}
                isAdmin={isAdmin}
                onNavigate={(to) => {
                  setShowDropdown(false);
                  setIsOpen(false);
                  navigate(to);
                }}
                onLogout={async () => {
                  await logout();
                  localStorage.removeItem("currentUser");
                  navigate("/login");
                }}
              />
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => navigate("/login")}
                className="text-sm font-medium px-3 py-1.5 rounded-md hover:bg-gray-100"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="text-sm font-semibold bg-emerald-600 text-white px-3 py-1.5 rounded-md hover:bg-emerald-700"
              >
                Sign up
              </button>
            </div>
          )}

          {/* Menu toggle */}
          <button
            onClick={toggleMenu}
            className="ml-1 p-1.5 rounded hover:bg-gray-100"
            aria-label="Open menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Drawer */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-30 z-40"
            onClick={() => setIsOpen(false)}
          />
          {/* Sidebar */}
          <div className="fixed right-0 top-0 h-screen w-[24rem] max-w-full bg-white shadow-2xl z-50 px-8 py-6 overflow-y-auto border-l border-b border-gray-200">
            {/* Header */}
            <div className="flex justify-between items-start mb-5">
              <h2 className="text-2xl font-semibold text-gray-700">MediLab</h2>
              <button onClick={() => setIsOpen(false)}>
                <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
              </button>
            </div>

            {/* Auth bloc */}
            {initializing ? (
              <div className="w-full h-24 rounded-xl bg-gray-100 animate-pulse mb-6" />
            ) : user ? (
              <div className="mb-6 p-4 border rounded-xl bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-600 text-white text-sm">
                    {avatarLetter}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{displayName}</div>
                    <div className="text-xs text-gray-500">
                      {user.email || user.phoneNumber}
                    </div>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button
                    className="w-full border rounded-md py-2 text-sm hover:bg-gray-50"
                    onClick={() => {
                      setIsOpen(false);
                      navigate("/profile");
                    }}
                  >
                    Profile
                  </button>
                  <button
                    className="w-full border rounded-md py-2 text-sm hover:bg-gray-50"
                    onClick={() => {
                      setIsOpen(false);
                      navigate("/orders");
                    }}
                  >
                    Orders
                  </button>
                  {isAdmin && (
                    <button
                      className="col-span-2 w-full border rounded-md py-2 text-sm hover:bg-gray-50 text-rose-600"
                      onClick={() => {
                        setIsOpen(false);
                        navigate("/admin");
                      }}
                    >
                      Admin Panel
                    </button>
                  )}
                  <button
                    className="col-span-2 w-full bg-emerald-600 text-white rounded-md py-2 text-sm hover:bg-emerald-700"
                    onClick={async () => {
                      await logout();
                      localStorage.removeItem("currentUser");
                      setIsOpen(false);
                      navigate("/login");
                    }}
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-4 mb-6">
                <Link to="/register" onClick={() => setIsOpen(false)} className="flex-1">
                  <button className="bg-emerald-600 text-white py-2.5 text-base font-medium rounded hover:bg-emerald-700 w-full">
                    Sign up
                  </button>
                </Link>
                <Link to="/login" onClick={() => setIsOpen(false)} className="flex-1">
                  <button className="w-full border border-emerald-600 text-emerald-600 py-2.5 text-base font-medium rounded hover:bg-emerald-50">
                    Login
                  </button>
                </Link>
              </div>
            )}

            {/* Banner */}
            {showMessage && (
              <div className="bg-emerald-50 text-emerald-700 p-4 flex justify-between items-start mb-6 text-base rounded">
                <p className="font-medium">Try MediLab for healthcare professionals</p>
                <button onClick={() => setShowMessage(false)}>
                  <X className="w-5 h-5 text-emerald-600 hover:text-emerald-800" />
                </button>
              </div>
            )}

            {/* Mobile Nav (Heroicons for core nav) */}
            <div className="block md:hidden mb-6 space-y-1 text-gray-800 text-base">
              <Link
                to="/"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-4 p-2 rounded hover:bg-gray-100"
              >
                <HomeIcon className="w-6 h-6 text-emerald-600" />
                Home
              </Link>
              <Link
                to="/pharmacies"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-4 p-2 rounded hover:bg-gray-100"
              >
                <BuildingStorefrontIcon className="w-6 h-6 text-emerald-600" />
                Pharmacies
              </Link>
              <Link
                to="/wallet"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-4 p-2 rounded hover:bg-gray-100"
              >
                <WalletIcon className="w-6 h-6 text-emerald-600" />
                Reward System
              </Link>
              <Link
                to="/contact"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-4 p-2 rounded hover:bg-gray-100"
              >
                <LifebuoyIcon className="w-6 h-6 text-emerald-600" />
                Contact/Help
              </Link>
            </div>

            {/* Categories / Shortcuts (Lucide for rich pictograms) */}
            <div className="space-y-1 text-gray-800 text-base">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 text-left"
              >
                <Stethoscope className="w-5 h-5 text-emerald-600" />
                Medicine
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 text-left"
              >
                <FileText className="w-5 h-5 text-emerald-700" />
                Health Info
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 text-left"
              >
                <Dumbbell className="w-5 h-5 text-emerald-600" />
                Fitness
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 text-left"
              >
                <Baby className="w-5 h-5 text-emerald-600" />
                Mom & Baby
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 text-left"
              >
                <Cpu className="w-5 h-5 text-emerald-700" />
                Devices
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 text-left"
              >
                <Leaf className="w-5 h-5 text-emerald-600" />
                Wellness
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 text-left"
              >
                <Dog className="w-5 h-5 text-emerald-600" />
                Pet Supplies
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 text-left"
              >
                <Sparkles className="w-5 h-5 text-emerald-600" />
                Skin Care/Beauty
              </button>
            </div>
          </div>
        </>
      )}
    </header>
  );
}

/** Small profile menu component (desktop) */
function ProfileMenu({ name, email, isAdmin, onNavigate, onLogout }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className="flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-full hover:bg-emerald-100"
      >
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-600 text-white text-sm">
          {(name?.[0] || "U").toUpperCase()}
        </span>
        <span className="text-sm font-semibold hidden sm:block max-w-[140px] truncate">
          {name}
        </span>
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg p-1"
          onMouseLeave={() => setOpen(false)}
        >
          <div className="px-3 py-2">
            <div className="text-sm font-semibold text-gray-900 truncate">{name}</div>
            {email && <div className="text-xs text-gray-500 truncate">{email}</div>}
          </div>
          <hr />
          <nav className="py-1">
            <button
              className="block w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-50"
              onClick={() => {
                setOpen(false);
                onNavigate("/profile");
              }}
            >
              My Profile
            </button>
            <button
              className="block w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-50"
              onClick={() => {
                setOpen(false);
                onNavigate("/orders");
              }}
            >
              Orders
            </button>
            <button
              className="block w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-50"
              onClick={() => {
                setOpen(false);
                onNavigate("/plus");
              }}
            >
              PLUS Membership
            </button>
            {isAdmin && (
              <button
                className="block w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-50 text-rose-600"
                onClick={() => {
                  setOpen(false);
                  onNavigate("/admin");
                }}
              >
                Admin Panel
              </button>
            )}
          </nav>
          <hr />
          <button
            className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-50"
            onClick={async () => {
              setOpen(false);
              await onLogout();
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}