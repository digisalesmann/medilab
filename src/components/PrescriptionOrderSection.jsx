// src/components/PrescriptionOrderSection.jsx
import React, { useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";
import { UploadCloud, FilePlus, MapPin, PhoneCall, PackageCheck, X } from "lucide-react";

// IMPORTANT: we alias products -> newLaunchesProducts to match your file’s export.
import { categories, newLaunchesProducts, trendingProducts } from "../data/mockData";

const API_BASE =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE) ||
  process.env.REACT_APP_API_BASE ||
  "http://localhost:5000";

function slugify(s = "") {
  return String(s)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function PrescriptionOrderSection() {
  return (
    <>
      {/* Top prescription CTA */}
      <UploadPrescriptionCTA />

      <NewLaunches />
      <ShopByCategories />
      <TrendingNearYou />
    </>
  );
}

function UploadPrescriptionCTA() {
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  const acceptTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
  const maxSizeMB = 10;

  function validate(f) {
    if (!acceptTypes.includes(f.type)) return "Only JPG, PNG, WEBP, or PDF are allowed.";
    if (f.size > maxSizeMB * 1024 * 1024) return `File is too large. Max ${maxSizeMB} MB.`;
    return "";
  }

  function handlePick(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    const err = validate(f);
    if (err) {
      setError(err);
      setFile(null);
      setPreview("");
      return;
    }
    setError("");
    setFile(f);
    if (f.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(f));
    } else {
      setPreview("");
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (!f) return;
    const err = validate(f);
    if (err) {
      setError(err);
      setFile(null);
      setPreview("");
      return;
    }
    setError("");
    setFile(f);
    if (f.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(f));
    } else {
      setPreview("");
    }
  }

  async function handleUpload() {
    try {
      setError("");
      if (!file) return setError("Please select a prescription file first.");
      if (!address.trim()) return setError("Please enter your delivery address.");
      if (!phone.trim()) return setError("Please enter your phone number.");

      const form = new FormData();
      form.append("prescription", file);
      form.append("address", address);
      form.append("phone", phone);

      setUploading(true);
      const res = await fetch(`${API_BASE}/api/prescriptions`, {
        method: "POST",
        body: form,
      });

      if (!res.ok) throw new Error((await res.text()) || "Upload failed");
      const data = await res.json(); // { id, filename, url? }
      navigate(`/prescriptions/success?id=${encodeURIComponent(data.id)}`);
    } catch (e) {
      setError(e.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="w-full flex justify-center px-2 mt-6">
      <div className="flex flex-col md:flex-row bg-[#f3f8fe] border border-[#e3eefd] rounded-2xl w-full max-w-6xl p-5 md:p-6 gap-6 items-center md:items-stretch">
        {/* Left */}
        <div className="flex flex-col md:w-1/2 items-center md:items-start justify-center gap-4">
          <UploadCloud size={48} strokeWidth={1.5} className="text-[#008375]" />
          <div className="text-center md:text-left">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-1">Order with Prescription</h2>
            <p className="text-gray-600 text-sm md:text-base mb-2">
              Upload your prescription and get your medicines delivered.
            </p>
          </div>

          {/* Dropzone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="w-full border-2 border-dashed border-[#e3eefd] hover:border-[#c6d9ff] bg-white rounded-xl p-4 transition"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="bg-[#e3eefd] p-2 rounded-lg">
                  <FilePlus size={20} className="text-[#3b82f6]" />
                </div>
                <div className="text-sm">
                  <div className="font-medium text-gray-800">Drag & drop here</div>
                  <div className="text-gray-500">
                    or click to <span className="text-[#3b82f6]">choose a file</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => inputRef.current?.click()}
                type="button"
                className="px-4 py-2 bg-[#008375] hover:bg-[#00695c] text-white rounded-lg text-sm"
              >
                Choose File
              </button>
            </div>

            <input
              ref={inputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp,.pdf"
              onChange={handlePick}
              className="hidden"
            />

            {file && (
              <div className="mt-4 flex items-center gap-3">
                {preview ? (
                  <img src={preview} alt="preview" className="w-16 h-16 object-cover rounded-md border" />
                ) : (
                  <div className="w-16 h-16 flex items-center justify-center border rounded-md text-xs text-gray-500">
                    PDF
                  </div>
                )}
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-800 truncate">{file.name}</div>
                  <div className="text-xs text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</div>
                </div>
                <button
                  onClick={() => {
                    setFile(null);
                    setPreview("");
                  }}
                  className="p-2 rounded-md hover:bg-gray-100 text-gray-600"
                  title="Remove"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Address & Phone */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Delivery address"
              className="w-full border border-[#e3eefd] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c6d9ff] bg-white"
            />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone number"
              className="w-full border border-[#e3eefd] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c6d9ff] bg-white"
            />
          </div>

          {error && <div className="text-red-600 text-sm">{error}</div>}

          <button
            onClick={handleUpload}
            disabled={uploading}
            className="flex items-center gap-2 bg-[#008375] hover:bg-[#00695c] disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium px-6 py-2.5 rounded-lg shadow transition text-sm md:text-base"
          >
            <FilePlus size={20} />
            {uploading ? "Uploading..." : "Upload Prescription"}
          </button>
        </div>

        {/* Right */}
        <div className="flex-1 w-full flex flex-col justify-center">
          <h3 className="text-base md:text-lg font-medium text-gray-800 mb-3">How it works</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Step icon={<FilePlus size={20} className="text-[#3b82f6]" />} text="Upload your prescription photo/PDF" />
            <Step icon={<MapPin size={20} className="text-[#3b82f6]" />} text="Enter your delivery address" />
            <Step icon={<PhoneCall size={20} className="text-[#3b82f6]" />} text="We’ll call to confirm medicines" />
            <Step icon={<PackageCheck size={20} className="text-[#3b82f6]" />} text="Sit back! Delivery is on the way" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Step({ icon, text }) {
  return (
    <div className="flex items-start gap-3">
      <div className="bg-[#e3eefd] p-2 rounded-lg">{icon}</div>
      <p className="text-gray-700 text-sm md:text-base">{text}</p>
    </div>
  );
}

/* ---------- Shop by Categories ---------- */
function ShopByCategories() {
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const scrollRight = () => scrollRef.current?.scrollBy({ left: 320, behavior: "smooth" });

  return (
    <section className="w-full max-w-7xl mx-auto mt-12 px-4">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Shop by Categories</h2>

      <div className="relative">
        <div
          ref={scrollRef}
          className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 lg:flex lg:gap-4 lg:overflow-x-auto lg:scroll-smooth lg:pb-4 scrollbar-hide"
        >
          {categories.map((cat, idx) => (
            <div
              key={idx}
              className={`flex flex-col items-center justify-center rounded-lg p-4 min-w-[110px] sm:min-w-[130px] md:min-w-[150px] lg:min-w-[160px] shadow-md hover:shadow-lg transition duration-300 cursor-pointer ${cat.bgGradient || "bg-white"}`}
              onClick={() => navigate(`/category/${slugify(cat.label)}`)}
              title={`Browse ${cat.label}`}
            >
              <img
                src={cat.image}
                alt={cat.label}
                className="w-20 h-20 sm:w-24 sm:h-24 md:w-24 md:h-24 object-contain mb-2"
                draggable={false}
              />
              <span className="text-sm sm:text-base font-medium text-gray-700 text-center px-2">{cat.label}</span>
            </div>
          ))}
        </div>

        <button
          onClick={scrollRight}
          className="hidden lg:flex absolute top-1/2 right-0 -translate-y-1/2 bg-gray-800 hover:bg-teal-600 text-white w-10 h-10 items-center justify-center rounded-full shadow transition-colors duration-300 z-10"
          aria-label="Scroll right"
        >
          <FaChevronRight />
        </button>
      </div>

      <div className="mt-6 flex justify-center lg:hidden">
        <Link
          to="/categories"
          className="w-[85%] sm:w-[65%] md:w-[50%] text-teal-600 border border-teal-600 px-6 py-2.5 rounded-md text-base font-medium hover:bg-teal-50 transition text-center"
        >
          View All Categories
        </Link>
      </div>

      <div className="lg:hidden relative w-screen left-1/2 -translate-x-1/2 h-2 bg-[#e9eff6] my-4" />
    </section>
  );
}

/* ---------- New Launches (PRODUCT TILES) ---------- */
function NewLaunches() {
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const scrollRight = () => scrollRef.current?.scrollBy({ left: 320, behavior: "smooth" });

  return (
    <section className="w-full max-w-7xl mx-auto mt-8 sm:mt-12 px-2">
      <div className="lg:hidden relative w-screen left-1/2 -translate-x-1/2 h-2 bg-[#e9eff6] my-4"></div>
      <h2 className="text-xl sm:text-3xl font-bold text-gray-800 mb-1">New Launches</h2>
      <p className="text-sm sm:text-lg text-gray-500 mb-4 sm:mb-6">New wellness range just for you!</p>

      <div className="relative">
        <div ref={scrollRef} className="flex gap-3 sm:gap-4 overflow-x-auto pb-3 sm:pb-4 scroll-smooth scrollbar-hide">
          {newLaunchesProducts.map((item, idx) => {
            return (
              <div
                key={idx}
                onClick={() => navigate(`/product/${slugify(item.title)}`)}
                className={`flex-shrink-0 w-40 sm:w-60 lg:w-56
                            ${item.bgGradient || ""}  /* gradient */
                            border border-gray-200 rounded-xl sm:rounded-2xl lg:rounded-xl
                            flex flex-col items-center p-3 sm:p-4 lg:p-3.5
                            shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-20 h-20 sm:w-28 sm:h-28 lg:w-24 lg:h-24 object-contain mb-3"
                  draggable={false}
                />
                <div className="w-full">
                  <p className="text-xs sm:text-base lg:text-sm font-medium text-gray-800 mb-1 truncate">{item.title}</p>
                  <div className="text-xs sm:text-sm lg:text-xs text-gray-400 mb-1">
                    MRP <span className="line-through">₦{item.mrp.toLocaleString()}</span>
                  </div>
                  <div className="flex items-baseline gap-1 sm:gap-2 lg:gap-1.5">
                    <span className="text-sm sm:text-lg lg:text-base font-semibold text-gray-900">
                      ₦{item.price.toLocaleString()}
                    </span>
                    <span className="text-[10px] sm:text-sm lg:text-xs text-red-500 font-semibold">({item.discount}%)</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={scrollRight}
          className="hidden md:flex absolute top-1/2 right-0 -translate-y-1/2 bg-gray-800 hover:bg-teal-600 text-white w-10 h-10 items-center justify-center rounded-full shadow transition-colors duration-300 z-10"
          aria-label="Scroll right"
        >
          <FaChevronRight />
        </button>
      </div>
      <div className="lg:hidden relative w-screen left-1/2 -translate-x-1/2 h-2 bg-[#e9eff6] my-4"></div>
    </section>
  );
}

/* ---------- Trending Near You (PRODUCT TILES) ---------- */
function TrendingNearYou() {
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const scrollRight = () => scrollRef.current?.scrollBy({ left: 320, behavior: "smooth" });

  return (
    <section className="w-full max-w-7xl mx-auto mt-8 sm:mt-12 px-2">
      <h2 className="text-xl sm:text-3xl font-bold text-gray-800 mb-1">Trending Near You</h2>
      <p className="text-sm sm:text-lg text-gray-500 mb-4 sm:mb-6">Popular in your city</p>

      <div className="relative">
        <div ref={scrollRef} className="flex gap-3 sm:gap-4 overflow-x-auto pb-3 sm:pb-4 scroll-smooth scrollbar-hide">
          {trendingProducts.map((item, idx) => {
            return (
              <div
                key={idx}
                onClick={() => navigate(`/product/${slugify(item.title)}`)}
                className={`flex-shrink-0 w-40 sm:w-60 lg:w-56
                            ${item.bgGradient || ""}  /* gradient */
                            border border-gray-200 rounded-xl sm:rounded-2xl lg:rounded-xl
                            flex flex-col items-center p-3 sm:p-4 lg:p-3.5
                            shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-20 h-20 sm:w-28 sm:h-28 lg:w-24 lg:h-24 object-contain mb-3"
                  draggable={false}
                />
                <div className="w-full">
                  <p className="text-xs sm:text-base font-medium text-gray-800 mb-1 truncate">{item.title}</p>
                  <div className="text-xs sm:text-sm text-gray-400 mb-1">
                    MRP <span className="line-through">₦{item.mrp.toLocaleString()}</span>
                  </div>
                  <div className="flex items-baseline gap-1 sm:gap-2">
                    <span className="text-sm sm:text-lg font-semibold text-gray-900">
                      ₦{item.price.toLocaleString()}
                    </span>
                    <span className="text-[10px] sm:text-sm text-red-500 font-semibold">({item.discount}% off)</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={scrollRight}
          className="hidden md:flex absolute top-1/2 right-0 -translate-y-1/2 bg-gray-800 hover:bg-teal-600 text-white w-10 h-10 items-center justify-center rounded-full shadow transition-colors duration-300 z-10"
          aria-label="Scroll right"
        >
          <FaChevronRight />
        </button>
      </div>
      <div className="lg:hidden relative w-screen left-1/2 -translate-x-1/2 h-2 bg-[#e9eff6] my-4"></div>
    </section>
  );
}