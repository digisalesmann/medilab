import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { auth } from "../lib/firebase";
import { updateProfile } from "firebase/auth";
import {
  RiLogoutCircleRLine,
  RiPencilLine,
  RiCheckboxCircleLine,
  RiArrowRightSLine,
  RiMedal2Line,
  RiWallet3Line,
  RiMapPinLine,
  RiSettings3Line,
  RiHeadphoneLine,
  RiShoppingBag3Line,
} from "react-icons/ri";

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const storedUser = useMemo(() => {
    try {
      const raw = localStorage.getItem("currentUser");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  const uiUser = useMemo(() => {
    if (user) {
      return {
        uid: user.uid,
        email: user.email || storedUser?.email || "",
        displayName: user.displayName || storedUser?.name || "",
        phoneNumber: user.phoneNumber || storedUser?.phone || "",
        photoURL: user.photoURL || "",
        isAdmin:
          (user.email || "").toLowerCase() === "admin@medilab.com" ||
          !!storedUser?.isAdmin,
        points: storedUser?.points ?? 0,
      };
    }
    if (storedUser) {
      return {
        uid: storedUser.uid || "",
        email: storedUser.email || "",
        displayName: storedUser.name || "",
        phoneNumber: storedUser.phone || "",
        photoURL: "",
        isAdmin: !!storedUser.isAdmin,
        points: storedUser.points ?? 0,
      };
    }
    return null;
  }, [user, storedUser]);

  const [name, setName] = useState(uiUser?.displayName || "");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    setName(uiUser?.displayName || "");
  }, [uiUser?.displayName]);

  const onSave = async () => {
    if (!auth.currentUser) return;
    setSaving(true);
    setStatus("");
    try {
      await updateProfile(auth.currentUser, { displayName: name.trim() });
      const raw = localStorage.getItem("currentUser");
      if (raw) {
        const parsed = JSON.parse(raw);
        localStorage.setItem(
          "currentUser",
          JSON.stringify({ ...parsed, name: name.trim() })
        );
      }
      setStatus("Saved!");
    } catch (e) {
      setStatus(e?.message || "Failed to save");
    } finally {
      setSaving(false);
      setTimeout(() => setStatus(""), 2500);
    }
  };

  const onLogout = async () => {
    try {
      await logout();
    } finally {
      localStorage.removeItem("currentUser");
      navigate("/login");
    }
  };

  if (!uiUser) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-100 via-green-100 to-blue-200 flex items-center justify-center px-4">
        <div className="bg-white/95 rounded-2xl shadow-md border p-6 sm:p-10 text-center max-w-md w-full">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Your Profile
          </h1>
          <p className="text-gray-600 mb-6">
            Sign in to view and manage your account, orders, and rewards.
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              to="/login"
              className="px-5 py-2.5 rounded-full bg-emerald-600 text-white font-semibold hover:bg-emerald-700"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-5 py-2.5 rounded-full border border-emerald-600 text-emerald-700 font-semibold hover:bg-emerald-50"
            >
              Create account
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-100 via-green-100 to-blue-200 px-4 sm:px-6 pt-24 sm:pt-28 pb-10">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow border p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-center sm:items-start">
          {/* Avatar */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
            {uiUser.photoURL ? (
              <img
                src={uiUser.photoURL}
                alt="avatar"
                className="w-full h-full object-cover rounded-full border"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center rounded-full bg-emerald-500 text-white text-2xl font-bold">
                {(uiUser.displayName || uiUser.email || "?")
                  .charAt(0)
                  .toUpperCase()}
              </div>
            )}
            {uiUser.isAdmin && (
              <span className="absolute bottom-0 right-0 text-[10px] bg-amber-500 text-white px-2 py-0.5 rounded-full shadow">
                Admin
              </span>
            )}
          </div>

          {/* Basic info */}
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              {uiUser.displayName || "Your Name"}
            </h1>
            <p className="text-gray-600">{uiUser.email}</p>
            {uiUser.phoneNumber && (
              <p className="text-gray-500">{uiUser.phoneNumber}</p>
            )}

            <div className="mt-3 flex flex-wrap gap-2 justify-center sm:justify-start">
              <span className="flex items-center gap-1 text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full">
                <RiMedal2Line /> {uiUser.points} pts
              </span>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="mt-4 sm:mt-0 inline-flex items-center gap-2 text-sm text-red-600 hover:text-red-700 border border-red-200 px-4 py-2 rounded-full"
          >
            <RiLogoutCircleRLine /> Logout
          </button>
        </div>

        {/* Editable Info */}
        <div className="bg-white rounded-2xl shadow border p-6 sm:p-8 space-y-6">
          <h2 className="text-lg font-semibold text-gray-800">Profile Details</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Display name
              </label>
              <div className="flex gap-2">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="flex-1 border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Your name"
                />
                <button
                  onClick={onSave}
                  disabled={saving || !name.trim()}
                  className="inline-flex items-center gap-1 bg-emerald-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700 disabled:opacity-60"
                >
                  {saving ? "Saving…" : <><RiPencilLine /> Save</>}
                </button>
              </div>
              {!!status && (
                <p className="mt-2 text-xs text-emerald-600 flex items-center gap-1">
                  <RiCheckboxCircleLine /> {status}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Email
              </label>
              <input
                value={uiUser.email}
                readOnly
                className="w-full border rounded-lg px-3 py-2 bg-gray-50 text-gray-600"
              />
            </div>
          </div>
        </div>

        {/* Account Shortcuts */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              title: "Orders",
              desc: "Track and manage orders",
              icon: <RiShoppingBag3Line />,
              to: "/Cart",
            },
            {
              title: "Rewards & Wallet",
              desc: "Points, coupons & balance",
              icon: <RiWallet3Line />,
              to: "/wallet",
            },
            {
              title: "Addresses",
              desc: "Manage delivery addresses",
              icon: <RiMapPinLine />,
              to: "/addresses",
            },
            {
              title: "Account Settings",
              desc: "Password, notifications, privacy",
              icon: <RiSettings3Line />,
              to: "/account-settings",
            },
            {
              title: "Support",
              desc: "Get help and FAQs",
              icon: <RiHeadphoneLine />,
              to: "/Contact",
            },
          ].map((item) => (
            <Link
              key={item.title}
              to={item.to}
              className="group flex items-center justify-between border rounded-xl bg-white p-4 shadow-sm hover:bg-gray-50"
            >
              <div className="flex items-start gap-3">
                <div className="text-emerald-600 text-xl">{item.icon}</div>
                <div>
                  <p className="font-semibold text-gray-900">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
              </div>
              <RiArrowRightSLine className="text-gray-400 group-hover:text-gray-600" />
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
