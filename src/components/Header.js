// src/components/Header.jsx
import { useState, useRef, useEffect } from "react"; // ADDED useRef and useEffect
import Logo from "./Logo";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  ShoppingCart,
  Menu,
  X,
  Bell,
  Stethoscope,
  FileText,
  Dumbbell,
  Baby,
  Cpu,
  Leaf,
  Dog,
  Sparkles,
  Mail,
  Send,
} from "lucide-react";
import {
  HomeIcon,
  BuildingStorefrontIcon,
  WalletIcon,
  LifebuoyIcon,
  UserIcon,
  NewspaperIcon,
} from "@heroicons/react/24/outline";
import { useNotifications } from "../context/NotificationContext";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const ADMIN_EMAIL = "admin@medilab.com";

const CATEGORIES = [
  { label: "Medicine", slug: "medicine", Icon: Stethoscope, tone: "text-emerald-600" },
  { label: "Health Info", slug: "health-info", Icon: FileText, tone: "text-emerald-700" },
  { label: "Fitness", slug: "fitness", Icon: Dumbbell, tone: "text-emerald-600" },
  { label: "Mom & Baby", slug: "mom-and-baby", Icon: Baby, tone: "text-emerald-600" },
  { label: "Devices", slug: "devices", Icon: Cpu, tone: "text-emerald-700" },
  { label: "Wellness", slug: "wellness", Icon: Leaf, tone: "text-emerald-600" },
  { label: "Pet Supplies", slug: "pet-supplies", Icon: Dog, tone: "text-emerald-600" },
  { label: "Skin Care/Beauty", slug: "skin-care-beauty", Icon: Sparkles, tone: "text-emerald-600" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [showMessage, setShowMessage] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);

  // 1. Create a ref to attach to the notification container
  const notificationRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  const { notifications, markAllAsRead, markAsRead, deleteNotification } = useNotifications();
  const unreadCount = notifications.filter((n) => !n.read).length;

  const { user, initializing, logout } = useAuth();
  const isAdmin = (user?.email || "").toLowerCase() === ADMIN_EMAIL;
  const displayName =
    user?.displayName || user?.email?.split("@")[0] || user?.phoneNumber || "Profile";
  const avatarLetter = (displayName?.[0] || "U").toUpperCase();

  const { items } = useCart();
  const cartCount = items.reduce((sum, item) => sum + (item.qty || 1), 0);

  // 2. Add useEffect to handle clicks outside the notification container
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        // Only close if the ref exists AND the click is NOT inside the ref element
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on cleanup
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]); // Re-run effect only when dropdown state changes

  const handleHomeClick = () => {
    if (location.pathname === "/") window.scrollTo({ top: 0, behavior: "smooth" });
    else navigate("/");
  };

  const goToCategory = (slug) => {
    setShowDropdown(false);
    setIsOpen(false);
    navigate(`/hub/${slug}`);
  };

  return (
    <header className="w-full bg-white shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-6 py-4">
        <Logo />

        {/* Desktop Nav */}
        <nav className="hidden md:flex flex-1 justify-center space-x-6 text-gray-700 text-base font-medium">
          <button onClick={handleHomeClick} className="hover:text-green-600 transition-colors">
            Home
          </button>

          {/* Categories dropdown */}
          <div className="relative group">
            <button className="inline-flex items-center gap-2 hover:text-green-600 transition-colors">
              Categories
            </button>
            <div className="absolute left-1/2 -translate-x-1/2 mt-3 w-[520px] max-w-[90vw] bg-white border border-gray-200 rounded-2xl shadow-xl p-3 grid grid-cols-2 gap-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              {CATEGORIES.map(({ label, slug, Icon, tone }) => (
                <button
                  key={slug}
                  onClick={() => goToCategory(slug)}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 text-left"
                >
                  <Icon className={`w-5 h-5 ${tone}`} />
                  <span className="font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

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

        {/* Right Side */}
        <div className="flex items-center gap-2 relative">
          {/* Notifications - ADDED ref={notificationRef} */}
          <div className="relative" ref={notificationRef}> 
            <button
              onClick={() => setShowDropdown((p) => !p)}
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
              <div className="absolute right-0 mt-2 w-72 bg-white border rounded-lg shadow-lg z-[60]">
                <div className="p-3 border-b font-semibold text-sm text-gray-700 flex justify-between items-center">
                  Notifications
                  <button onClick={markAllAsRead} className="text-xs text-blue-500 hover:underline">
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
                        <X
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
            onClick={() => navigate("/cart")}
            className="p-1.5 rounded-full hover:bg-gray-100 relative"
          >
            <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-green-600 transition-colors" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-xs rounded-full px-1.5 font-bold border-2 border-white">
                {cartCount}
              </span>
            )}
          </button>

          {/* Auth (Desktop) */}
          {initializing ? (
            <div className="hidden md:block w-28 h-9 rounded-full bg-gray-100 animate-pulse" />
          ) : user ? (
            <div className="hidden md:block">
              <ProfileMenu
                name={displayName}
                email={user.email}
                isAdmin={isAdmin}
                onNavigate={(to) => navigate(to)}
                onLogout={logout}
              />
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <button onClick={() => navigate("/login")} className="text-sm font-medium px-3 py-1.5 rounded-md hover:bg-gray-100">
                Login
              </button>
              <button onClick={() => navigate("/register")} className="text-sm font-semibold bg-emerald-600 text-white px-3 py-1.5 rounded-md hover:bg-emerald-700">
                Sign up
              </button>
            </div>
          )}

          {/* Mobile Toggle */}
          <button onClick={() => setIsOpen(!isOpen)} className="ml-1 p-1.5 rounded hover:bg-gray-100">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-30 z-40" onClick={() => setIsOpen(false)} />
          <div className="fixed right-0 top-0 h-screen w-[22rem] bg-white shadow-2xl z-50 px-8 py-6 overflow-y-auto border-l border-b border-gray-200">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-semibold text-gray-700">MediLab</h2>
              <button onClick={() => setIsOpen(false)}>
                <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
              </button>
            </div>

            {/* Auth */}
            {user ? (
              <UserPanel
                displayName={displayName}
                email={user.email}
                avatarLetter={avatarLetter}
                isAdmin={isAdmin}
                onLogout={logout}
                navigate={navigate}
              />
            ) : (
              <div className="flex gap-4 mb-6">
                <Link to="/register" onClick={() => setIsOpen(false)} className="flex-1">
                  <button className="bg-emerald-600 text-white py-2.5 rounded-md font-medium hover:bg-emerald-700 w-full">
                    Sign Up
                  </button>
                </Link>
                <Link to="/login" onClick={() => setIsOpen(false)} className="flex-1">
                  <button className="w-full border border-emerald-600 text-emerald-600 py-2.5 rounded-md font-medium hover:bg-emerald-50">
                    Login
                  </button>
                </Link>
              </div>
            )}

            {/* Navigation */}
            <div className="space-y-1 text-gray-800 text-base mb-8">
              <MobileLink Icon={HomeIcon} label="Home" to="/" setIsOpen={setIsOpen} />
              <MobileLink Icon={BuildingStorefrontIcon} label="Pharmacies" to="/pharmacies" setIsOpen={setIsOpen} />
              <MobileLink Icon={WalletIcon} label="Reward System" to="/wallet" setIsOpen={setIsOpen} />
              <MobileLink Icon={LifebuoyIcon} label="Contact/Help" to="/contact" setIsOpen={setIsOpen} />
              <MobileLink Icon={UserIcon} label="Profile" to="/profile" setIsOpen={setIsOpen} />
            </div>

            <hr className="my-4" />

            {/* Categories */}
            <div className="space-y-1 text-gray-800 text-base">
              {CATEGORIES.map(({ label, slug, Icon, tone }) => (
                <button
                  key={slug}
                  onClick={() => {
                    goToCategory(slug);
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 text-left"
                >
                  <Icon className={`w-5 h-5 ${tone}`} />
                  {label}
                </button>
              ))}
            </div>

            <hr className="my-6" />

            {/* Contact Us + Stay Updated */}
            <div className="space-y-4 text-base">
              <Link to="/contact" onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-emerald-700 hover:text-emerald-900 font-medium">
                <Mail className="w-5 h-5" /> Contact Us
              </Link>
              <Link to="/subscribe" onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-emerald-700 hover:text-emerald-900 font-medium">
                <NewspaperIcon className="w-5 h-5" /> Stay Updated
                <Send className="w-5 h-5 text-emerald-400" /> {/* Use Send icon here */}
              </Link>
            </div>
          </div>
        </>
      )}

      {/* Welcome Message */}
      {showMessage && (
        <div className="w-full bg-emerald-50 text-emerald-700 text-center py-2 text-sm font-medium">
          Welcome to MediLab!
          <button className="ml-4 text-emerald-900 underline" onClick={() => setShowMessage(false)}>
            Dismiss
          </button>
        </div>
      )}
    </header>
  );
}

/** Reusable mobile link */
function MobileLink({ Icon, label, to, setIsOpen }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => {
        navigate(to);
        if (setIsOpen) setIsOpen(false);
      }}
      className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 text-left"
    >
      <Icon className="w-6 h-6 text-emerald-600" />
      {label}
    </button>
  );
}

/** User panel (mobile) */
function UserPanel({ displayName, email, avatarLetter, isAdmin, onLogout, navigate }) {
  return (
    <div className="mb-6 p-4 border rounded-xl bg-gray-50">
      <div className="flex items-center gap-3">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-600 text-white text-sm">
          {avatarLetter}
        </div>
        <div>
          <div className="font-semibold text-gray-900">{displayName}</div>
          <div className="text-xs text-gray-500">{email}</div>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          className="w-full border rounded-md py-2 text-sm hover:bg-gray-50"
          onClick={() => navigate("/profile")}
        >
          Profile
        </button>
        <button
          className="w-full border rounded-md py-2 text-sm hover:bg-gray-50"
          onClick={() => navigate("/orders")}
        >
          Orders
        </button>
        {isAdmin && (
          <button
            className="col-span-2 border rounded-md py-2 text-sm hover:bg-gray-50 text-rose-600"
            onClick={() => navigate("/admin")}
          >
            Admin Panel
          </button>
        )}
        <button
          className="col-span-2 bg-emerald-600 text-white rounded-md py-2 text-sm hover:bg-emerald-700"
          onClick={async () => {
            await onLogout();
            localStorage.removeItem("currentUser");
            navigate("/login");
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

/** Profile dropdown (desktop) */
function ProfileMenu({ name, email, isAdmin, onNavigate, onLogout }) {
  const [open, setOpen] = useState(false);
  
  // Note: The ProfileMenu still closes on mouseLeave, as defined in your original code.
  // If you wanted to apply the click-outside logic to this menu as well, 
  // you would need to implement useRef/useEffect in this component too.

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
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
              onClick={() => onNavigate("/profile")}
            >
              My Profile
            </button>
            <button
              className="block w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-50"
              onClick={() => onNavigate("/orders")}
            >
              Orders
            </button>
            <button
              className="block w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-50"
              onClick={() => onNavigate("/plus")}
            >
              PLUS Membership
            </button>
            {isAdmin && (
              <button
                className="block w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-50 text-rose-600"
                onClick={() => onNavigate("/admin")}
              >
                Admin Panel
              </button>
            )}
          </nav>
          <hr />
          <button
            className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-50"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}