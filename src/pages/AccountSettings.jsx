import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { updateProfile } from "firebase/auth";
import { useAuth } from "../context/AuthContext";
import { auth } from "../lib/firebase";

import {
  RiUser3Line,
  RiShieldCheckLine,
  RiNotification2Line,
  RiLockPasswordLine,
  RiLink,
  RiDeleteBinLine,
  RiMailLine,
  RiSmartphoneLine,
  RiLinkUnlink,
} from "react-icons/ri";

/** Left-nav tabs */
const TABS = [
  { key: "profile", label: "Profile", icon: RiUser3Line },
  { key: "security", label: "Security", icon: RiShieldCheckLine },
  { key: "notifications", label: "Notifications", icon: RiNotification2Line },
  { key: "privacy", label: "Privacy", icon: RiLockPasswordLine },
  { key: "connections", label: "Connections", icon: RiLink },
];

export default function AccountSettings() {
  const { user } = useAuth();

  // legacy local cache (keeps header etc. consistent with your app)
  const storedUser = (() => {
    try {
      const raw = localStorage.getItem("currentUser");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

  const uiUser = user
    ? {
        uid: user.uid,
        email: user.email || storedUser?.email || "",
        displayName: user.displayName || storedUser?.name || "",
        phoneNumber: user.phoneNumber || storedUser?.phone || "",
        photoURL: user.photoURL || "",
      }
    : storedUser
    ? {
        uid: storedUser.uid || "",
        email: storedUser.email || "",
        displayName: storedUser.name || "",
        phoneNumber: storedUser.phone || "",
        photoURL: "",
      }
    : null;

  const [active, setActive] = useState("profile");

  // form state
  const [name, setName] = useState(uiUser?.displayName || "");
  const [phone, setPhone] = useState(uiUser?.phoneNumber || "");
  const [twoFA, setTwoFA] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
  });
  const [allowPartners, setAllowPartners] = useState(false);

  // link state (UI only here)
  const [googleLinked] = useState(true);
  const [appleLinked] = useState(false);

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    setName(uiUser?.displayName || "");
    setPhone(uiUser?.phoneNumber || "");
  }, [uiUser?.displayName, uiUser?.phoneNumber]);

  const handleSave = async () => {
    setSaving(true);
    setToast("");
    try {
      if (auth.currentUser && name.trim() !== (auth.currentUser.displayName || "")) {
        await updateProfile(auth.currentUser, { displayName: name.trim() });
      }
      const raw = localStorage.getItem("currentUser");
      if (raw) {
        const parsed = JSON.parse(raw);
        localStorage.setItem(
          "currentUser",
          JSON.stringify({ ...parsed, name: name.trim(), phone: phone.trim() })
        );
      }
      setToast("Settings saved successfully.");
    } catch (e) {
      setToast(e?.message || "Failed to save changes.");
    } finally {
      setSaving(false);
      setTimeout(() => setToast(""), 3000);
    }
  };

  const handleDeleteAccount = () => {
    setToast("Account deletion flow isn’t set up yet.");
  };

  if (!uiUser) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-2xl shadow border p-8 text-center w-full max-w-md">
          <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-gray-600 mt-2">Please sign in to manage your account.</p>
          <Link
            to="/login"
            className="inline-block mt-4 px-5 py-2.5 rounded-full bg-emerald-600 text-white font-semibold hover:bg-emerald-700"
          >
            Sign in
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* give space for your fixed header (adjust if your header height differs) */}
      <div className="pt-20 lg:pt-24 pb-24">
        {/* Full app layout — not “modal” */}
        <div className="px-3 sm:px-6 lg:px-8 w-full">
          {/* Title row */}
          <div className="mb-4 lg:mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Account Settings</h1>
            <p className="text-gray-600 mt-1">
              Manage your profile, security and preferences in one place.
            </p>
          </div>

          {/* App grid: sticky sidebar + roomy content */}
          <div className="grid lg:grid-cols-[300px_minmax(0,1fr)] gap-4 lg:gap-8">
            {/* Sidebar (desktop only, full height sticker) */}
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <nav className="bg-white/95 backdrop-blur rounded-xl shadow border overflow-hidden">
                  <ul className="py-2">
                    {TABS.map(({ key, label, icon: Icon }) => (
                      <li key={key}>
                        <button
                          onClick={() => setActive(key)}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition
                            ${
                              active === key
                                ? "bg-emerald-50 text-emerald-700"
                                : "hover:bg-gray-50 text-gray-700"
                            }`}
                        >
                          <Icon className="text-lg" />
                          <span className="font-medium">{label}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </aside>

            {/* Content column */}
            <section className="min-h-[calc(100vh-9rem)]">
              {/* Mobile tabstrip (no sidebar on mobile) */}
              <div className="lg:hidden sticky top-16 z-10 -mx-3 sm:-mx-6 px-3 sm:px-6 py-2 bg-gray-50/90 backdrop-blur">
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                  {TABS.map(({ key, label, icon: Icon }) => (
                    <button
                      key={key}
                      onClick={() => setActive(key)}
                      className={`flex-1 min-w-[120px] whitespace-nowrap inline-flex items-center justify-center gap-2 text-sm px-4 py-2 rounded-xl border transition
                        ${
                          active === key
                            ? "bg-emerald-600 text-white border-emerald-600"
                            : "bg-white border-gray-200 text-gray-700"
                        }`}
                    >
                      <Icon className="text-base" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6 lg:space-y-8 mt-2 lg:mt-0">
                {/* PROFILE */}
                {active === "profile" && (
                  <Card title="Profile" subtitle="Update your basic information.">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field label="Display name">
                        <input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                          placeholder="Your name"
                        />
                      </Field>
                      <Field label="Email">
                        <input
                          value={uiUser.email}
                          readOnly
                          className="w-full border rounded-lg px-3 py-2 bg-gray-50 text-gray-600"
                        />
                      </Field>
                      <Field label="Phone">
                        <input
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                          placeholder="+2348012345678"
                        />
                      </Field>
                    </div>
                  </Card>
                )}

                {/* SECURITY */}
                {active === "security" && (
                  <Card title="Security" subtitle="Keep your account protected.">
                    <LinkRow
                      to="/change-password"
                      icon={<RiLockPasswordLine className="text-gray-600 text-xl" />}
                      title="Change Password"
                      description="Update your login password"
                    />
                    <ToggleRow
                      icon={<RiSmartphoneLine className="text-gray-600 text-xl" />}
                      title="Two‑Factor Authentication (2FA)"
                      description="Add extra protection to your account"
                      checked={twoFA}
                      onChange={setTwoFA}
                    />
                    <Note text="Tip: to enable 2FA by SMS you’ll add a phone and verify it first." />
                  </Card>
                )}

                {/* NOTIFICATIONS */}
                {active === "notifications" && (
                  <Card title="Notifications" subtitle="Choose how you stay informed.">
                    <ToggleRow
                      icon={<RiMailLine className="text-gray-600 text-xl" />}
                      title="Email notifications"
                      description="Receive order updates and offers by email"
                      checked={notifications.email}
                      onChange={(v) => setNotifications((s) => ({ ...s, email: v }))}
                    />
                    <ToggleRow
                      icon={<RiSmartphoneLine className="text-gray-600 text-xl" />}
                      title="SMS notifications"
                      description="Get important alerts by text message"
                      checked={notifications.sms}
                      onChange={(v) => setNotifications((s) => ({ ...s, sms: v }))}
                    />
                    <ToggleRow
                      icon={<RiNotification2Line className="text-gray-600 text-xl" />}
                      title="Push notifications"
                      description="Enable browser push notifications"
                      checked={notifications.push}
                      onChange={(v) => setNotifications((s) => ({ ...s, push: v }))}
                    />
                  </Card>
                )}

                {/* PRIVACY */}
                {active === "privacy" && (
                  <Card title="Privacy" subtitle="Control how your data is used.">
                    <ToggleRow
                      title="Allow data sharing with partners"
                      description="Improve recommendations by sharing anonymized analytics"
                      checked={allowPartners}
                      onChange={setAllowPartners}
                    />
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={handleDeleteAccount}
                        className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-semibold"
                      >
                        <RiDeleteBinLine /> Delete Account
                      </button>
                    </div>
                  </Card>
                )}

                {/* CONNECTIONS */}
                {active === "connections" && (
                  <Card title="Connected accounts" subtitle="Manage linked sign‑in methods.">
                    <ConnectionRow
                      provider="Google"
                      linked={googleLinked}
                      onLink={() => {}}
                      onUnlink={() => {}}
                    />
                    <ConnectionRow
                      provider="Apple"
                      linked={appleLinked}
                      onLink={() => {}}
                      onUnlink={() => {}}
                    />
                  </Card>
                )}

                {/* Save (desktop & tablet) */}
                <div className="hidden sm:flex justify-end">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-3 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition disabled:opacity-60"
                  >
                    {saving ? "Saving…" : "Save Changes"}
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Sticky Save on mobile (no sidebar) */}
      <div className="sm:hidden fixed bottom-0 left-0 w-full bg-white border-t p-3 shadow-lg">
        <div className="px-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full px-6 py-3 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-emerald-100 border border-emerald-300 text-emerald-900 text-sm px-4 py-2 rounded-lg shadow">
          {toast}
        </div>
      )}
    </main>
  );
}

/* ========== Small presentational components ========== */

function Card({ title, subtitle, children }) {
  return (
    <section className="bg-white rounded-xl shadow-sm border p-6 sm:p-8 space-y-6">
      <header className="space-y-1">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        {subtitle && <p className="text-gray-600 text-sm">{subtitle}</p>}
      </header>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Field({ label, children }) {
  return (
    <div>
      {label && (
        <label className="block text-xs font-medium text-gray-500 mb-1">
          {label}
        </label>
      )}
      {children}
    </div>
  );
}

function LinkRow({ to, icon, title, description }) {
  return (
    <Link
      to={to}
      className="flex items-center justify-between rounded-xl border p-4 hover:bg-gray-50 transition"
    >
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <p className="font-medium">{title}</p>
          {description && <p className="text-xs text-gray-500">{description}</p>}
        </div>
      </div>
      <span className="text-sm text-emerald-700 font-semibold">Manage</span>
    </Link>
  );
}

function ToggleRow({ icon, title, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between rounded-xl border p-4">
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <p className="font-medium">{title}</p>
          {description && <p className="text-xs text-gray-500">{description}</p>}
        </div>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={!!checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <span
          className={`w-10 h-5 flex items-center rounded-full p-1 transition-colors ${
            checked ? "bg-emerald-600" : "bg-gray-300"
          }`}
        >
          <span
            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
              checked ? "translate-x-5" : ""
            }`}
          />
        </span>
      </label>
    </div>
  );
}

function ConnectionRow({ provider, linked, onLink, onUnlink }) {
  return (
    <div className="flex items-center justify-between rounded-xl border p-4">
      <div>
        <p className="font-medium">{provider}</p>
        <p className="text-xs text-gray-500">
          {linked ? "Linked to your account" : "Not linked"}
        </p>
      </div>
      <button
        type="button"
        onClick={linked ? onUnlink : onLink}
        className={`inline-flex items-center gap-2 text-sm font-semibold px-3 py-1.5 rounded-lg border ${
          linked
            ? "text-gray-700 border-gray-300 hover:bg-gray-50"
            : "text-emerald-700 border-emerald-200 hover:bg-emerald-50"
        }`}
      >
        {linked ? (
          <>
            <RiLinkUnlink className="text-base" /> Unlink
          </>
        ) : (
          <>
            <RiLink className="text-base" /> Link
          </>
        )}
      </button>
    </div>
  );
}

function Note({ text }) {
  return (
    <div className="rounded-lg border p-4 bg-gray-50 text-xs text-gray-600">
      {text}
    </div>
  );
}