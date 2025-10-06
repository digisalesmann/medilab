// src/pages/DoctorProfile.jsx
import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doctors } from "../data/mockData";
import {
  MapPin,
  Video,
  Stethoscope,
  Phone,
  Mail,
  Calendar,
  Clock,
  Star,
  ChevronRight,
  X,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Globe2,
  HeartPulse,
  Activity,
  Ambulance,
  Microscope,
  Syringe,
  Pill,
  ShieldCheck,
} from "lucide-react";

/* ----------------- utils ----------------- */
function slugify(s = "") {
  return String(s)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// Human weekday name from Date (e.g. Monday -> Mon)
function weekdayShortFromISO(dateISO) {
  const d = new Date(dateISO + "T00:00:00");
  return d.toLocaleDateString(undefined, { weekday: "short" }); // "Mon"
}
function weekdayFullFromISO(dateISO) {
  const d = new Date(dateISO + "T00:00:00");
  return d.toLocaleDateString(undefined, { weekday: "long" }); // "Monday"
}

/* ----------------- small storage helpers for appointments ----------------- */
const APPT_KEY = "medilab.appointments";
function readAppointments() {
  try {
    const raw = localStorage.getItem(APPT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch {
    return [];
  }
}
function saveAppointmentToStorage(appt) {
  const arr = readAppointments();
  arr.unshift(appt); // newest first
  try {
    localStorage.setItem(APPT_KEY, JSON.stringify(arr));
  } catch {}
}

/* ----------------- small UI atoms ----------------- */
// Uniform section with left-aligned title
const Section = ({ title, right, children, className = "" }) => (
  <section className={`bg-white border rounded-2xl p-5 md:p-6 shadow-sm ${className}`}>
    {(title || right) && (
      <div className="flex items-center justify-between mb-4">
        {title && <h3 className="text-left text-lg md:text-xl font-semibold text-gray-900">{title}</h3>}
        {right}
      </div>
    )}
    {children}
  </section>
);

const Chip = ({ children }) => (
  <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700">
    {children}
  </span>
);

const Badge = ({ children }) => (
  <span className="inline-flex items-center text-xs px-2.5 py-1 rounded-full border bg-gray-50 text-gray-700 border-gray-200">
    {children}
  </span>
);

const Dot = () => <span className="inline-block w-1 h-1 rounded-full bg-gray-300 mx-1.5 align-middle" />;

const StarRating = ({ value = 0, size = 14 }) => {
  const rounded = Math.round(value);
  return (
    <div className="inline-flex items-center">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`mr-0.5 ${i < rounded ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
          style={{ width: size, height: size }}
        />
      ))}
    </div>
  );
};

const serviceIconMap = {
  Consultation: Stethoscope,
  "Heart Health": HeartPulse,
  "ECG & Diagnostics": Activity,
  Emergency: Ambulance,
  "Lab Requests": Microscope,
  "Vaccination & Injections": Syringe,
  "Medication Review": Pill,
  "Preventive Care": ShieldCheck,
};

/* ----------------- Booking Modal (embedded) ----------------- */
function BookingModal({ open, onClose, doctor, onSaved }) {
  const [date, setDate] = useState(() => {
    // default to today's date
    const d = new Date();
    // choose next available day if today's not within doctor's availability
    return d.toISOString().slice(0, 10);
  });
  const [slot, setSlot] = useState("");
  const [mode, setMode] = useState("in_person"); // in_person | online
  const [patientName, setPatientName] = useState(() => {
    try {
      const raw = localStorage.getItem("medilab.userProfile");
      if (!raw) return "";
      const parsed = JSON.parse(raw);
      return parsed?.name || "";
    } catch {
      return "";
    }
  });
  const [phone, setPhone] = useState(() => localStorage.getItem("medilab.userPhone") || "");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [successAppt, setSuccessAppt] = useState(null);

  const initialRef = useRef(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => initialRef.current?.focus?.(), 60);
    } else {
      // reset when closed
      setSlot("");
      setMode("in_person");
      setPatientName((p) => p || "");
      setPhone((p) => p || "");
      setNotes("");
      setError("");
      setSaving(false);
      setSuccessAppt(null);
    }
  }, [open]);

  // lock body scroll
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => (document.body.style.overflow = "");
  }, [open]);

  if (!doctor) return null;

  // derive available slots for selected date (also ensure date not past)
  const todayISO = new Date().toISOString().slice(0, 10);
  const isPast = date < todayISO;

  // doctor.availability.days might be full names like ["Monday","Wednesday"] or short ["Mon"]
  const normalizeDay = (d) => d.slice(0, 3).toLowerCase();
  const apptWeekShort = weekdayShortFromISO(date).toLowerCase(); // e.g. "mon"
  const daysAvail = (doctor.availability?.days || []).map((d) => normalizeDay(d));
  const isDayAvailable = daysAvail.length === 0 ? true : daysAvail.includes(apptWeekShort);

  const availableSlots = isDayAvailable ? (doctor.availability?.slots || []) : [];

  // validation + conflict check (simple)
  function checkConflict(dateISO, slotStr) {
    const appts = readAppointments();
    return appts.some(
      (a) => String(a.doctorId) === String(doctor.id) && a.date === dateISO && a.slot === slotStr
    );
  }

  async function handleConfirm(e) {
    e?.preventDefault?.();
    setError("");

    if (isPast) {
      setError("Please pick a date today or in the future.");
      return;
    }
    if (!slot) {
      setError("Select a time slot.");
      return;
    }
    if (!patientName?.trim()) {
      setError("Enter patient name.");
      return;
    }
    if (!phone?.trim() || phone.trim().length < 7) {
      setError("Enter a valid phone number.");
      return;
    }
    if (checkConflict(date, slot)) {
      setError("That time slot is already booked for this doctor. Choose another slot or date.");
      return;
    }

    // simulate saving (network)
    setSaving(true);
    setTimeout(() => {
      const appt = {
        id: `APPT-${Date.now()}`,
        doctorId: doctor.id,
        doctorName: doctor.name,
        specialty: doctor.specialty,
        date,
        slot,
        mode,
        patientName: patientName.trim(),
        phone: phone.trim(),
        notes: notes.trim(),
        createdAt: new Date().toISOString(),
      };

      // persist
      saveAppointmentToStorage(appt);
      // also save some user profile hints
      try {
        localStorage.setItem("medilab.userPhone", phone.trim());
        const profile = { name: patientName.trim() };
        localStorage.setItem("medilab.userProfile", JSON.stringify(profile));
      } catch {}

      setSaving(false);
      setSuccessAppt(appt);
      onSaved?.(appt);
    }, 900);
  }

  return (
    <>
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
        >
          <div
            className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-auto max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* header */}
            <div className="flex items-start justify-between p-4 border-b">
              <div>
                <div className="text-sm text-gray-600">Book appointment</div>
                <div className="text-lg font-semibold text-gray-900">{doctor.name} • {doctor.specialty}</div>
                <div className="text-xs text-gray-500 mt-1">Choose date, slot and confirm.</div>
              </div>
              <button
                aria-label="Close"
                onClick={() => onClose()}
                className="text-gray-500 hover:text-gray-700 mt-1"
              >
                ✕
              </button>
            </div>

            {/* body */}
            <form className="p-4 space-y-4" onSubmit={handleConfirm}>
              {/* date & slots */}
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-700">Date</label>
                  <input
                    ref={initialRef}
                    required
                    type="date"
                    value={date}
                    min={todayISO}
                    onChange={(e) => {
                      setDate(e.target.value);
                      setSlot(""); // reset slot when date changes
                      setError("");
                    }}
                    className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                  />
                  <div className="mt-1 text-xs text-gray-500">
                    {isDayAvailable ? (
                      <>Available on {availableSlots.length} slot(s)</>
                    ) : (
                      <>No availability on {weekdayFullFromISO(date)} — choose another date</>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-700">Time slot</label>
                  <div className="mt-1 grid grid-cols-2 gap-2">
                    {availableSlots.length === 0 && (
                      <div className="col-span-2 text-sm text-gray-500">No slots available</div>
                    )}
                    {availableSlots.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => {
                          setSlot(s);
                          setError("");
                        }}
                        className={`text-sm px-3 py-2 rounded-lg border text-left ${slot === s ? "bg-emerald-600 text-white" : "bg-white text-gray-800"}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* mode & contact */}
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-700">Mode</label>
                  <div className="mt-2 flex gap-2">
                    <label className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border ${mode === "in_person" ? "bg-emerald-50 border-emerald-200" : "bg-white"}`}>
                      <input type="radio" name="mode" checked={mode === "in_person"} onChange={() => setMode("in_person")} />
                      <span className="text-sm">In-person</span>
                    </label>
                    <label className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border ${mode === "online" ? "bg-emerald-50 border-emerald-200" : "bg-white"}`}>
                      <input type="radio" name="mode" checked={mode === "online"} onChange={() => setMode("online")} />
                      <span className="text-sm">Online</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-700">Contact phone</label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +2348012345678"
                    className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                  />
                </div>
              </div>

              {/* patient */}
              <div>
                <label className="text-sm text-gray-700">Patient name</label>
                <input
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="Full name"
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="text-sm text-gray-700">Notes (optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Reason for visit or useful notes"
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                />
              </div>

              {error && <div className="text-xs text-rose-600">{error}</div>}

              {/* footer actions */}
              <div className="flex items-center justify-between gap-3 border-t pt-4">
                <div className="text-sm text-gray-700">
                  <div>Doctor fee</div>
                  <div className="text-lg font-semibold text-gray-900">₦{Number(doctor.fee || 0).toLocaleString()}</div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onClose()}
                    className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving || successAppt}
                    className={`px-4 py-2 rounded-lg text-white ${saving ? "bg-emerald-300" : "bg-emerald-600 hover:bg-emerald-700"}`}
                  >
                    {saving ? "Booking..." : successAppt ? "Booked" : "Confirm booking"}
                  </button>
                </div>
              </div>
            </form>

            {/* success view (inline) */}
            {successAppt && (
              <div className="p-4 border-t bg-emerald-50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center border">
                    <CheckMarkIcon className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">Appointment confirmed</div>
                    <div className="text-xs text-gray-700">
                      {successAppt.date} • {successAppt.slot} — {successAppt.mode === "online" ? "Online" : "In-person"}
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => {
                      // close modal and optionally navigate
                      onClose();
                    }}
                    className="px-3 py-2 rounded-lg bg-white border"
                  >
                    Done
                  </button>
                  <button
                    onClick={() => {
                      // navigate to /appointments if route exists
                      try {
                        // use window.location so this component doesn't require router hook
                        window.location.href = "/appointments";
                      } catch {
                        onClose();
                      }
                    }}
                    className="px-3 py-2 rounded-lg bg-emerald-600 text-white"
                  >
                    View my appointments
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

/* Simple check mark icon */
function CheckMarkIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ----------------- page ----------------- */
export default function DoctorProfile() {
  const { id } = useParams(); // route: /doctor/:id/:slug?
  const navigate = useNavigate();

  // Keep hooks before any early return
  const doctor = useMemo(
    () => (doctors || []).find((d) => String(d.id) === String(id)) || null,
    [id]
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  // Gallery
  const gallery = useMemo(() => {
    if (!doctor)
      return ["/images/doctor-placeholder.jpg", "/images/doctor-placeholder.jpg", "/images/doctor-placeholder.jpg"];
    const imgs = (doctor.images?.length ? doctor.images : [doctor.img]).filter(Boolean);
    if (imgs.length >= 3) return imgs.slice(0, 6);
    const dup = [...imgs];
    while (dup.length < 3) dup.push(imgs[dup.length % imgs.length]);
    return dup;
  }, [doctor]);

  const [activeImg, setActiveImg] = useState(0);
  useEffect(() => setActiveImg(0), [id]);

  const onKeyDownGallery = useCallback(
    (e) => {
      if (e.key === "ArrowRight") setActiveImg((i) => (i + 1) % gallery.length);
      if (e.key === "ArrowLeft") setActiveImg((i) => (i - 1 + gallery.length) % gallery.length);
    },
    [gallery.length]
  );

  // Touch swipe
  const touchStartX = useRef(null);
  const onTouchStart = (e) => (touchStartX.current = e.touches[0].clientX);
  const onTouchEnd = (e) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) {
      setActiveImg((i) => (dx < 0 ? (i + 1) % gallery.length : (i - 1 + gallery.length) % gallery.length));
    }
    touchStartX.current = null;
  };

  // Zoom
  const [zoomOpen, setZoomOpen] = useState(false);
  const closeZoom = () => setZoomOpen(false);
  useEffect(() => {
    if (!zoomOpen) return;
    const onEsc = (e) => e.key === "Escape" && setZoomOpen(false);
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [zoomOpen]);

  // Booking modal
  const [bookingOpen, setBookingOpen] = useState(false);
  // Similar doctors
  const similar = useMemo(() => {
    if (!doctor) return [];
    return (doctors || []).filter((d) => d.id !== doctor.id && d.specialty === doctor.specialty).slice(0, 8);
  }, [doctor]);

  // Ratings summary (before early return)
  const reviewSummaryRaw = doctor?.reviewSummary;
  const reviewsCount = doctor?.reviews ?? 0;
  const summary = useMemo(() => {
    if (reviewSummaryRaw) return reviewSummaryRaw;
    const total = Math.max(reviewsCount, 1);
    const five = Math.round(total * 0.6);
    const four = Math.round(total * 0.2);
    const three = Math.round(total * 0.12);
    const two = Math.round(total * 0.05);
    const one = total - (five + four + three + two);
    return { 5: five, 4: four, 3: three, 2: two, 1: one };
  }, [reviewSummaryRaw, reviewsCount]);

  const summaryTotal = useMemo(() => Object.values(summary).reduce((a, b) => a + b, 0) || 1, [summary]);

  // Early return UI
  if (!doctor) {
    return (
      <div className="max-w-4xl mx-auto px-4 pt-28 pb-12">
        <div className="bg-white border rounded-2xl p-8 text-center shadow">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Doctor not found</h2>
          <p className="text-gray-600 mb-6">This doctor does not exist or has been removed.</p>
          <button onClick={() => navigate("/doctors")} className="px-4 py-2.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">
            Browse doctors
          </button>
        </div>
      </div>
    );
  }

  const {
    name,
    specialty,
    location,
    rating,
    reviews,
    fee,
    experienceYears,
    hospital,
    languages = [],
    about,
    services = [],
    education = [],
    awards = [],
    availability,
    contact,
    bg,
    website,
    patientReviews = [],
  } = doctor;

  // callback after booking saved
  function handleSavedAppointment(appt) {
    // close modal after small delay for UX (modal handles its own success)
    setTimeout(() => {
      setBookingOpen(false);
    }, 700);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 pt-24 pb-20 lg:pb-24">
      {/* ===== Overview (clean, left-aligned, spaced) ===== */}
      <Section className="!p-0 overflow-hidden">
        <div className="p-5 md:p-8">
          <div className="grid grid-cols-12 gap-8">
            {/* LEFT: Gallery */}
            <div className="col-span-12 lg:col-span-5" tabIndex={0} aria-label="Doctor image gallery" onKeyDown={onKeyDownGallery}>
              <div
                className={`w-full border rounded-2xl ${bg || "bg-gray-50"} overflow-hidden relative`}
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
              >
                <img src={gallery[activeImg]} alt={`${name} – ${activeImg + 1}`} className="w-full h-[320px] md:h-[360px] object-cover" />
                {/* Prev/Next */}
                <button
                  onClick={() => setActiveImg((i) => (i - 1 + gallery.length) % gallery.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/95 border shadow hover:bg-white"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setActiveImg((i) => (i + 1) % gallery.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/95 border shadow hover:bg-white"
                  aria-label="Next image"
                >
                  <ChevronRightIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setZoomOpen(true)}
                  className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg text-xs bg-white/95 border shadow hover:bg-white"
                  aria-label="Zoom image"
                >
                  Zoom
                </button>
              </div>
              {/* Thumbs */}
              <div className="mt-3 flex gap-2 overflow-x-auto scrollbar-hide">
                {gallery.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`border rounded-lg p-0.5 w-16 h-16 flex items-center justify-center flex-shrink-0 transition focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      i === activeImg ? "border-emerald-500" : "border-gray-200 hover:border-gray-300"
                    }`}
                    aria-label={`Show image ${i + 1}`}
                  >
                    <img src={src} alt={`${name} – ${i + 1}`} className="w-full h-full object-cover rounded-md" />
                  </button>
                ))}
              </div>
            </div>

            {/* RIGHT: Info */}
            <div className="col-span-12 lg:col-span-7">
              {/* Top row */}
              <div className="flex flex-wrap items-center gap-3">
                <Badge>{specialty}</Badge>
                <div className="inline-flex items-center gap-1 text-sm">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-gray-800 font-medium">{Number(rating || 0).toFixed(1)}</span>
                  <span className="text-gray-400">({reviews})</span>
                </div>
              </div>

              <h1 className="mt-2 text-left text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">{name}</h1>

              {/* Facts */}
              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-700">
                <span className="inline-flex items-center gap-1.5">
                  <Stethoscope className="w-4 h-4" />
                  {experienceYears}+ yrs experience
                </span>
                <Dot />
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {location}
                </span>
                {hospital && (
                  <>
                    <Dot />
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {hospital}
                    </span>
                  </>
                )}
              </div>

              {/* Fee */}
              <div className="mt-2 flex items-center gap-2 text-sm text-gray-700 text-left">
                <Clock className="w-4 h-4" />
                <span>Consultation fee from</span>
                <span className="font-semibold text-gray-900">₦{Number(fee || 0).toLocaleString()}</span>
              </div>

              {/* Languages */}
              {languages.length > 0 && (
                <p className="mt-2 text-sm text-gray-700 text-left">
                  Languages: <span className="text-gray-900 font-medium">{languages.join(", ")}</span>
                </p>
              )}

              {/* CTAs */}
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  onClick={() => setBookingOpen(true)}
                  className="px-5 py-2.5 rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  Book appointment
                </button>
                <button
                  onClick={() => navigate("/doctors")}
                  className="px-5 py-2.5 rounded-lg border text-emerald-700 border-emerald-600 hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  Browse more doctors
                </button>
                {website && (
                  <a
                    href={website}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2.5 rounded-lg border text-gray-700 border-gray-300 hover:bg-gray-50 inline-flex items-center gap-2"
                  >
                    <Globe2 className="w-4 h-4" /> Website
                  </a>
                )}
              </div>

              {/* About & Contact */}
              {about && (
                <div className="mt-6">
                  <h3 className="font-semibold text-left text-gray-900 mb-1">About</h3>
                  <p className="text-sm text-left text-gray-700 leading-relaxed">{about}</p>
                </div>
              )}

              {contact && (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {contact.phone && (
                    <a href={`tel:${contact.phone}`} className="text-sm text-gray-700 inline-flex items-center gap-2 hover:underline">
                      <Phone className="w-4 h-4" /> {contact.phone}
                    </a>
                  )}
                  {contact.email && (
                    <a href={`mailto:${contact.email}`} className="text-sm text-gray-700 inline-flex items-center gap-2 hover:underline">
                      <Mail className="w-4 h-4" /> {contact.email}
                    </a>
                  )}
                  {availability?.online && (
                    <span className="text-sm text-emerald-700 inline-flex items-center gap-2">
                      <Video className="w-4 h-4" /> Online consults available
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </Section>

      {/* ===== Availability — professional layout with icons ===== */}
      {availability && (
        <Section title="Availability" className="mt-8">
          <div className="grid md:grid-cols-3 gap-4 text-left">
            {/* Days */}
            <div className="md:col-span-1">
              <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">Days</p>
              <ul className="flex flex-wrap gap-2">
                {(availability.days || []).map((d) => (
                  <li key={d} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border bg-gray-50 text-gray-800 text-sm">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>

            {/* Slots */}
            <div className="md:col-span-2">
              <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">Time slots</p>
              <div className="flex flex-wrap gap-2">
                {(availability.slots || []).map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-gray-200 text-gray-800 bg-white text-sm"
                  >
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    {t}
                  </span>
                ))}
                {availability.online && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 text-sm">
                    <Video className="w-3.5 h-3.5" />
                    Telehealth available
                  </span>
                )}
              </div>
            </div>
          </div>
        </Section>
      )}

      {/* ===== Services / Education / Awards ===== */}
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {services?.length > 0 && (
          <Section title="Services">
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
              {services.map((s, i) => {
                const Icon = serviceIconMap[s] || Stethoscope;
                return (
                  <li key={i} className="flex items-center gap-3 p-3 border rounded-xl hover:shadow-sm transition">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100">
                      <Icon className="w-5 h-5" />
                    </span>
                    <span className="text-sm text-gray-900 font-medium">{s}</span>
                  </li>
                );
              })}
            </ul>
          </Section>
        )}

        <Section title={<span className="block mt-2">Education</span>}>
          <ol className="relative border-s border-gray-200 text-left">
            {education.map((e, i) => (
              <li key={i} className="mb-4 ms-4">
                <div className="absolute w-3 h-3 bg-emerald-600 rounded-full mt-1.5 -start-1.5 border border-white" />
                <h4 className="text-sm font-semibold mt-5 text-gray-900">{e.degree}</h4>
                <p className="text-sm text-gray-700">
                  {e.school} {e.year && <span className="text-gray-400">• {e.year}</span>}
                </p>
              </li>
            ))}
          </ol>
        </Section>

        {awards?.length > 0 && (
          <Section title="Awards" className="md:col-span-2">
            <div className="flex flex-wrap gap-2 text-left">
              {awards.map((a, i) => (
                <Chip key={i}>{a}</Chip>
              ))}
            </div>
          </Section>
        )}
      </div>

      {/* ===== Reviews (balanced two-column) ===== */}
      <Section
        title="Patient Reviews"
        className="mt-8"
        right={
          <button onClick={() => setBookingOpen(true)} className="text-sm px-3 py-1.5 border rounded-lg hover:bg-gray-50">
            Book appointment
          </button>
        }
      >
        <div className="grid md:grid-cols-2 gap-6 md:items-stretch">
          {/* Summary */}
          <div className="border rounded-xl p-4 md:p-5 flex flex-col justify-center text-left">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-gray-900">{Number(rating || 0).toFixed(1)}</span>
              <StarRating value={rating || 0} size={16} />
              <span className="text-sm text-gray-500">({reviews} reviews)</span>
            </div>
            <div className="mt-4 space-y-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = summary[star] || 0;
                const pct = Math.round((count / summaryTotal) * 100);
                return (
                  <div key={star} className="flex items-center gap-3">
                    <div className="w-8 text-xs text-gray-700">{star}★</div>
                    <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="w-10 text-right text-xs text-gray-500">{pct}%</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* List */}
          <div className="border rounded-xl p-4 md:p-5 text-left">
            {patientReviews.length === 0 ? (
              <p className="text-sm text-gray-700">
                No reviews yet. Be the first to share your experience with <span className="font-medium">{name}</span>.
              </p>
            ) : (
              <ul className="space-y-4">
                {patientReviews.slice(0, 5).map((r, idx) => (
                  <li key={idx} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-semibold text-gray-900">{r.name}</div>
                      <div className="text-xs text-gray-500">{r.date}</div>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <StarRating value={r.rating} size={14} />
                      <span className="text-xs text-gray-500">{r.rating.toFixed(1)}</span>
                    </div>
                    {r.comment && <p className="mt-2 text-sm text-gray-700 leading-relaxed">{r.comment}</p>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </Section>

      {/* ===== Similar doctors ===== */}
      {similar.length > 0 && (
        <section className="mt-10">
          <h3 className="text-left text-xl font-bold text-gray-900 mb-3">Similar {specialty}s</h3>
          <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
            {similar.map((d) => (
              <button
                key={d.id}
                onClick={() => navigate(`/doctor/${d.id}/${slugify(`${d.name}-${d.specialty}`)}`)}
                className={`flex-shrink-0 w-64 text-left border border-gray-200 rounded-xl p-3 shadow-sm hover:shadow-md transition ${d.bg || "bg-gray-50"} snap-start`}
                aria-label={`Open profile for ${d.name}`}
              >
                <div className="flex items-center gap-3">
                  <img src={d.img} alt={d.name} className="w-12 h-12 rounded-full object-cover border" />
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-900">{d.name}</p>
                    <p className="text-xs text-gray-600">{d.location}</p>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs">
                  <span className="text-yellow-600 inline-flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    {Number(d.rating).toFixed(1)}
                  </span>
                  <span className="text-gray-400">({d.reviews})</span>
                </div>
                <div className="mt-2 inline-flex items-center text-emerald-700 text-xs font-medium">
                  View profile <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ===== Zoom Modal ===== */}
      {zoomOpen && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={closeZoom}>
          <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <img src={gallery[activeImg]} alt={`${name} – zoomed`} className="w-full h-auto max-h-[80vh] object-contain rounded-lg shadow-lg" />
            <button onClick={closeZoom} className="absolute -top-3 -right-3 bg-white text-gray-900 rounded-full p-2 shadow-lg border" aria-label="Close zoom">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* ===== Booking Modal (integrated) ===== */}
      <BookingModal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        doctor={doctor}
        onSaved={handleSavedAppointment}
      />

      {/* ===== Sticky mobile CTA ===== */}
      <div className="fixed bottom-4 left-0 right-0 px-4 md:hidden pointer-events-none">
        <div className="max-w-6xl mx-auto pointer-events-auto">
          <div className="bg-white border shadow-lg rounded-xl p-2 flex items-center justify-between">
            <div className="text-sm text-gray-700 px-2 text-left">
              From <span className="font-semibold">₦{Number(fee || 0).toLocaleString()}</span>
            </div>
            <button onClick={() => setBookingOpen(true)} className="px-4 py-2 rounded-lg text-white bg-emerald-600 hover:bg-emerald-700">
              Book now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
