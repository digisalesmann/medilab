// src/pages/DoctorProfile.jsx (REBUILT)
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
  Award, // Using for Awards section
  UserCircle, // Placeholder for anonymous review user
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
// Uniform section with left-aligned title - Renamed to CardSection for clearer intent
const CardSection = ({ title, right, children, className = "" }) => (
  <section className={`bg-white rounded-2xl p-5 md:p-6 shadow-xl border border-gray-100 ${className}`}>
    {(title || right) && (
      <div className="flex items-center justify-between mb-4">
        {title && <h3 className="text-left text-xl font-bold text-gray-900">{title}</h3>}
        {right}
      </div>
    )}
    {children}
  </section>
);


const Badge = ({ children }) => (
  <span className="inline-flex items-center text-sm px-3 py-1.5 rounded-full bg-gray-100 text-gray-800 font-medium">
    {children}
  </span>
);

const Dot = () => <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-300 mx-2 align-middle" />;

const StarRating = ({ value = 0, size = 16, className = "" }) => {
  const rounded = Math.round(value);
  return (
    <div className={`inline-flex items-center ${className}`}>
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

/* Simple check mark icon */
function CheckMarkIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ----------------- Booking Modal (embedded) ----------------- */
// (Keeping BookingModal largely the same for brevity, assuming its logic is sound)
function BookingModal({ open, onClose, doctor, onSaved }) {
    // ... [BookingModal state and logic remain here] ...
    const [date, setDate] = useState(() => {
        const d = new Date();
        return d.toISOString().slice(0, 10);
    });
    const [slot, setSlot] = useState("");
    const [mode, setMode] = useState("in_person");
    const [patientName, setPatientName] = useState(() => {
        try {
            const raw = localStorage.getItem("medilab.userProfile");
            return JSON.parse(raw)?.name || "";
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

    // lock body scroll (retained for good UX)
    useEffect(() => {
        if (open) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "";
        return () => (document.body.style.overflow = "");
    }, [open]);

    if (!doctor) return null;

    const todayISO = new Date().toISOString().slice(0, 10);
    const isPast = date < todayISO;
    const normalizeDay = (d) => d.slice(0, 3).toLowerCase();
    const apptWeekShort = weekdayShortFromISO(date).toLowerCase();
    const daysAvail = (doctor.availability?.days || []).map((d) => normalizeDay(d));
    const isDayAvailable = daysAvail.length === 0 ? true : daysAvail.includes(apptWeekShort);
    const availableSlots = isDayAvailable ? (doctor.availability?.slots || []) : [];

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

            saveAppointmentToStorage(appt);
            try {
                localStorage.setItem("medilab.userPhone", phone.trim());
                const profile = { name: patientName.trim() };
                localStorage.setItem("medilab.userProfile", JSON.stringify(profile));
            } catch { }

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
                                <div className="text-sm text-left text-gray-600">Book appointment</div>
                                <div className="text-lg font-semibold text-gray-900">{doctor.name} • {doctor.specialty}</div>
                                <div className="text-xs text-left text-gray-500 mt-1">Choose date, slot and confirm.</div>
                            </div>
                            <button
                                aria-label="Close"
                                onClick={() => onClose()}
                                className="text-gray-500 hover:text-gray-700 mt-1"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* body */}
                        {!successAppt ? (
                            <form className="p-5 space-y-5" onSubmit={handleConfirm}>
                                {/* date & slots */}
                                <div className="grid text-left md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Date</label>
                                        <input
                                            ref={initialRef}
                                            required
                                            type="date"
                                            value={date}
                                            min={todayISO}
                                            onChange={(e) => {
                                                setDate(e.target.value);
                                                setSlot("");
                                                setError("");
                                            }}
                                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                        />
                                        <div className="mt-1 text-xs text-gray-500">
                                            {isDayAvailable ? (
                                                <>Available on {availableSlots.length} slot(s)</>
                                            ) : (
                                                <>No availability on {weekdayFullFromISO(date)}, choose another date</>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Time slot</label>
                                        <div className="mt-1 grid grid-cols-3 gap-2">
                                            {availableSlots.length === 0 && (
                                                <div className="col-span-3 text-sm text-gray-500 pt-2">No slots available</div>
                                            )}
                                            {availableSlots.map((s) => (
                                                <button
                                                    key={s}
                                                    type="button"
                                                    onClick={() => {
                                                        setSlot(s);
                                                        setError("");
                                                    }}
                                                    className={`text-sm px-3 py-2 rounded-lg border text-center font-medium transition ${slot === s ? "bg-emerald-600 text-white border-emerald-600 shadow-md" : "bg-white text-gray-800 border-gray-300 hover:border-emerald-400"}`}
                                                >
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* mode & contact */}
                                <div className="grid md:grid-cols-2 text-left gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Mode</label>
                                        <div className="mt-2 flex gap-3">
                                            <label className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition ${mode === "in_person" ? "bg-emerald-50 border-emerald-400 text-emerald-800" : "bg-white border-gray-300 text-gray-700"}`}>
                                                <input type="radio" name="mode" checked={mode === "in_person"} onChange={() => setMode("in_person")} className="w-4 h-4 text-emerald-600 border-gray-300 focus:ring-emerald-500" />
                                                <span className="text-sm font-medium">In-person</span>
                                            </label>
                                            <label className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition ${mode === "online" ? "bg-emerald-50 border-emerald-400 text-emerald-800" : "bg-white border-gray-300 text-gray-700"}`}>
                                                <input type="radio" name="mode" checked={mode === "online"} onChange={() => setMode("online")} className="w-4 h-4 text-emerald-600 border-gray-300 focus:ring-emerald-500" />
                                                <span className="text-sm font-medium">Online</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Contact phone</label>
                                        <input
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="e.g. +2348012345678"
                                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                        />
                                    </div>
                                </div>

                                {/* patient */}
                                <div className="text-left">
                                    <label className="text-sm font-medium text-gray-700">Patient name</label>
                                    <input
                                        value={patientName}
                                        onChange={(e) => setPatientName(e.target.value)}
                                        placeholder="Full name"
                                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                    />
                                </div>

                                <div className="text-left">
                                    <label className="text-sm font-medium text-gray-700">Notes (optional)</label>
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        rows={3}
                                        placeholder="Reason for visit or useful notes"
                                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                    />
                                </div>

                                {error && <div className="text-sm text-rose-600 p-2 bg-rose-50 border border-rose-200 rounded-lg">{error}</div>}

                                {/* footer actions */}
                                <div className="flex items-center justify-between gap-3 border-t pt-4">
                                    <div className="text-left">
                                        <div className="text-sm text-gray-600">Doctor fee</div>
                                        <div className="text-xl font-bold text-emerald-700">₦{Number(doctor.fee || 0).toLocaleString()}</div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => onClose()}
                                            className="px-4 py-2.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium"
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className={`px-6 py-2.5 rounded-lg text-white font-semibold transition ${saving ? "bg-emerald-300 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/50"}`}
                                        >
                                            {saving ? "Booking..." : "Confirm Booking"}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        ) : (
                            // success view
                            <div className="p-8 text-center">
                                <CheckMarkIcon className="w-16 h-16 mx-auto text-emerald-600" />
                                <h3 className="mt-4 text-2xl font-bold text-gray-900">Appointment Confirmed!</h3>
                                <p className="mt-2 text-gray-700">Your appointment with {doctor.name} is scheduled.</p>
                                <div className="mt-4 inline-flex flex-col items-start p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                                    <div className="text-sm font-medium text-gray-800 flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-emerald-600" />
                                        {weekdayFullFromISO(successAppt.date)}, {successAppt.date}
                                    </div>
                                    <div className="text-sm font-medium text-gray-800 flex items-center gap-2 mt-1">
                                        <Clock className="w-4 h-4 text-emerald-600" />
                                        {successAppt.slot} ({successAppt.mode === "online" ? "Online" : "In-person"})
                                    </div>
                                </div>

                                <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                                    <button
                                        onClick={() => onClose()}
                                        className="px-4 py-2.5 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                                    >
                                        Close
                                    </button>
                                    <button
                                        onClick={() => {
                                            try {
                                                window.location.href = "/appointments";
                                            } catch {
                                                onClose();
                                            }
                                        }}
                                        className="px-4 py-2.5 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700"
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


/* ----------------- page ----------------- */
export default function DoctorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const doctor = useMemo(
    () => (doctors || []).find((d) => String(d.id) === String(id)) || null,
    [id]
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  // Gallery logic (kept)
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

  // Similar doctors logic (kept)
  const similar = useMemo(() => {
    if (!doctor) return [];
    return (doctors || []).filter((d) => d.id !== doctor.id && d.specialty === doctor.specialty).slice(0, 8);
  }, [doctor]);

  // Ratings summary (kept)
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

  // Early return UI (kept)
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

  function handleSavedAppointment() {
    // The modal now handles the success view, just close it.
    setTimeout(() => {
      setBookingOpen(false);
    }, 700);
  }

  const daysAvailable = (availability?.days || []).map(d => d.slice(0, 3));
  const slotsAvailable = availability?.slots?.length || 0;
  
  // --- Start of Premium UI Rebuild ---
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-28 lg:pb-8 bg-gray-50 min-h-screen">
      <div className="lg:grid lg:grid-cols-12 lg:gap-10">

        {/* LEFT COLUMN: Main Info (8/12 grid on desktop) */}
        <div className="lg:col-span-8 space-y-8 pb-10 lg:pb-0">

          {/* 1. OVERVIEW SECTION (Image Gallery + Primary Details) */}
          <CardSection className="!p-0 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-5 md:p-8">
              
              {/* Image Gallery (Stays in the left part of this card, spans 5/12) */}
              <div className="lg:col-span-5" tabIndex={0} aria-label="Doctor image gallery" onKeyDown={onKeyDownGallery}>
                <div
                  className={`w-full rounded-2xl ${bg || "bg-gray-50"} overflow-hidden relative border border-gray-100`}
                  onTouchStart={onTouchStart}
                  onTouchEnd={onTouchEnd}
                >
                  <img src={gallery[activeImg]} alt={`${name} – ${activeImg + 1}`} className="w-full h-[300px] md:h-[350px] object-cover" />
                  {/* Gallery Navs - hidden on mobile for better touch UX */}
                  <button
                    onClick={() => setActiveImg((i) => (i - 1 + gallery.length) % gallery.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/95 border shadow hover:bg-white transition hidden md:block"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setActiveImg((i) => (i + 1) % gallery.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/95 border shadow hover:bg-white transition hidden md:block"
                    aria-label="Next image"
                  >
                    <ChevronRightIcon className="w-5 h-5" />
                  </button>
                </div>
                {/* Thumbs */}
                <div className="mt-3 flex gap-2 overflow-x-auto scrollbar-hide">
                  {gallery.map((src, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className={`border-2 rounded-xl p-0.5 w-14 h-14 flex items-center justify-center flex-shrink-0 transition ${
                        i === activeImg ? "border-emerald-500 shadow-md" : "border-gray-200 hover:border-gray-400"
                      }`}
                      aria-label={`Show image ${i + 1}`}
                    >
                      <img src={src} alt={`${name} – ${i + 1}`} className="w-full h-full object-cover rounded-lg" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Doctor Details (Spans 7/12) */}
              <div className="lg:col-span-7">
                {/* Top Row: Specialty and Rating */}
                <div className="flex flex-wrap items-center gap-3">
                  <Badge>{specialty}</Badge>
                  <div className="inline-flex items-center gap-1 text-base text-gray-800 font-medium">
                    <StarRating value={rating} size={18} className="mr-0.5" />
                    <span className="text-gray-900 font-bold">{Number(rating || 0).toFixed(1)}</span>
                    <span className="text-gray-500 font-normal">({reviews} Reviews)</span>
                  </div>
                </div>

                <h1 className="mt-2 text-left text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight leading-snug">{name}</h1>

                {/* Main Facts */}
                <div className="mt-4 space-y-2 text-gray-700">
                  <p className="flex items-center gap-2 text-lg">
                    <Stethoscope className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span className="font-semibold text-gray-900">{experienceYears}+ years</span> experience
                  </p>
                  <p className="flex items-center gap-2 text-lg">
                    <MapPin className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span className="font-semibold text-gray-900">{location}</span>
                    {hospital && <Dot />}
                    {hospital && <span className="text-base text-gray-600">{hospital}</span>}
                  </p>
                  {languages.length > 0 && (
                    <p className="flex items-center gap-2 text-base pt-1">
                      <Globe2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      Speaks: <span className="text-gray-900 font-medium">{languages.join(", ")}</span>
                    </p>
                  )}
                </div>

                {/* About (Expanded) */}
                {about && (
                  <div className="mt-6 border-t pt-4">
                    <h3 className="font-semibold text-left text-lg text-gray-900 mb-2">About Dr. {name.split(" ").slice(-1)[0]}</h3>
                    <p className="text-sm text-left text-gray-700 leading-relaxed line-clamp-4">{about}</p>
                    {/* Add a 'Read More' link if desired here */}
                  </div>
                )}
                
                {/* Contact Info */}
                {contact && (
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 border-t pt-4">
                    {contact.phone && (
                      <a href={`tel:${contact.phone}`} className="text-sm text-gray-700 inline-flex items-center gap-2 hover:text-emerald-600 transition">
                        <Phone className="w-4 h-4 text-emerald-600" /> {contact.phone}
                      </a>
                    )}
                    {contact.email && (
                      <a href={`mailto:${contact.email}`} className="text-sm text-gray-700 inline-flex items-center gap-2 hover:text-emerald-600 transition">
                        <Mail className="w-4 h-4 text-emerald-600" /> {contact.email}
                      </a>
                    )}
                    {availability?.online && (
                      <span className="text-sm text-emerald-700 inline-flex items-center gap-2 font-medium">
                        <Video className="w-4 h-4" /> Telehealth consultations
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardSection>

          {/* 2. CORE INFORMATION (Services, Education, Awards) */}
          <div className="grid gap-6">
            {/* Services */}
            {services?.length > 0 && (
              <CardSection title="Primary Services & Expertise" className="lg:col-span-1">
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
                  {services.map((s, i) => {
                    const Icon = serviceIconMap[s] || Stethoscope;
                    return (
                      <li key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-200 transition">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-700">
                          <Icon className="w-4 h-4" />
                        </span>
                        <span className="text-sm text-gray-900 font-medium">{s}</span>
                      </li>
                    );
                  })}
                </ul>
              </CardSection>
            )}

            <div className="grid gap-6 md:grid-cols-2">
              {/* Education */}
              <CardSection title="Education">
                <ol className="relative border-s-2 border-emerald-200 ml-2 text-left space-y-6">
                  {education.map((e, i) => (
                    <li key={i} className="ms-6">
                      <div className="absolute w-3 h-3 bg-emerald-600 rounded-full mt-1.5 -start-1.5 border border-white" />
                      <h4 className="text-base font-semibold text-gray-900">{e.degree}</h4>
                      <p className="text-sm text-gray-700">
                        {e.school} {e.year && <span className="text-gray-500 font-normal">({e.year})</span>}
                      </p>
                    </li>
                  ))}
                </ol>
              </CardSection>

              {/* Awards */}
              {awards?.length > 0 && (
                <CardSection title="Awards & Recognition">
                  <div className="flex flex-wrap gap-2 text-left">
                    {awards.map((a, i) => (
                      <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-yellow-300 bg-yellow-50 text-yellow-800 text-sm font-medium">
                        <Award className="w-4 h-4" />
                        {a}
                      </span>
                    ))}
                  </div>
                </CardSection>
              )}
            </div>
          </div>
          
          {/* RATINGS & REVIEWS CARD */}
                    <CardSection title="Ratings & Reviews" right={<a href="#reviews" className="text-sm font-medium text-emerald-600 hover:text-emerald-700">View All ({reviews})</a>}>
                        <div className="flex items-center gap-6 mb-4">
                            <div className="text-center">
                                <div className="text-6xl font-extrabold text-emerald-700">{Number(rating || 0).toFixed(1)}</div>
                                <StarRating value={rating} size={20} className="mt-1" />
                            </div>
                            <div className="flex-1 space-y-1">
                                {Object.entries(summary).sort(([a], [b]) => b - a).map(([star, count]) => (
                                    <div key={star} className="flex items-center gap-3">
                                        <span className="text-xs font-medium text-gray-600 w-3 text-right">{star}</span>
                                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-yellow-400 h-2 rounded-full"
                                                style={{ width: `${(count / summaryTotal) * 100}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-xs text-gray-500 w-8 text-right">{count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {patientReviews?.length > 0 && (
                            <div id="reviews" className="mt-6 border-t pt-4 space-y-4">
                                <h4 className="font-semibold text-md text-gray-900">Latest Review</h4>
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                    <div className="flex items-center gap-3 mb-2">
                                        <UserCircle className="w-6 h-6 text-gray-500" />
                                        <div className="text-sm font-semibold text-gray-800">{patientReviews[0].patient || "Anonymous User"}</div>
                                        <Dot />
                                        <StarRating value={patientReviews[0].rating} size={14} />
                                    </div>
                                    <p className="text-sm text-gray-700 italic">"{patientReviews[0].comment}"</p>
                                </div>
                            </div>
                        )}
                    </CardSection>

        </div>

        {/* RIGHT COLUMN: Sticky Booking & Quick Info (4/12 grid on desktop) */}
        <div className="lg:col-span-4 mt-8 lg:mt-0">
          <div className="lg:sticky lg:top-28 space-y-6">

            {/* Sticky Booking Card (Desktop Only) */}
            <div className="hidden lg:block">
              <CardSection title="Book Appointment Now" className="p-6">
                <div className="flex items-end justify-between border-b pb-4">
                  <span className="text-lg text-gray-700 font-medium">Consultation Fee</span>
                  <span className="text-3xl font-bold text-emerald-700">₦{Number(fee || 0).toLocaleString()}</span>
                </div>

                {/* Quick Availability */}
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center justify-between text-gray-700">
                    <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-emerald-600" /> Availability</span>
                    <span className="font-medium text-gray-900">{daysAvailable.join(", ") || 'Mon - Fri'}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-700">
                    <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-emerald-600" /> Slots Today</span>
                    <span className="font-medium text-gray-900">{slotsAvailable > 0 ? `${slotsAvailable} available` : 'Book another day'}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-700">
                    <span className="flex items-center gap-2"><Video className="w-4 h-4 text-emerald-600" /> Mode</span>
                    <span className="font-medium text-gray-900">{availability?.online ? 'In-person & Online' : 'In-person only'}</span>
                  </div>
                </div>

                <button
                  onClick={() => setBookingOpen(true)}
                  className="w-full px-5 py-3.5 mt-6 rounded-xl text-white font-semibold text-lg bg-emerald-600 hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-200 transition duration-200 shadow-xl shadow-emerald-500/30"
                >
                  Book Now
                </button>
              </CardSection>
            </div>
            
            {/* Additional Info / CTAs (Desktop) */}
            <div className="hidden lg:block space-y-4">
                <button
                  onClick={() => navigate("/doctors")}
                  className="w-full px-5 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition inline-flex items-center justify-center gap-2 font-medium"
                >
                    <ChevronLeft className="w-4 h-4" /> Browse More Doctors
                </button>
                {website && (
                    <a
                        href={website}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full px-5 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition inline-flex items-center justify-center gap-2 font-medium"
                    >
                        <Globe2 className="w-4 h-4" /> View Doctor Website
                    </a>
                )}
            </div>

          </div>
        </div>
      </div> {/* End of main grid */}
      
      {/* ===== SIMILAR DOCTORS SECTION (moved to the end) ===== */}
      {similar.length > 0 && (
        <section className="mt-12">
          <h3 className="text-2xl font-bold text-gray-900 text-left mb-6">Similar Specialists</h3>
          <div className="flex gap-6 scrollbar-hide overflow-x-auto pb-4">
            {similar.map((d) => (
              <div
                key={d.id}
                onClick={() => navigate(`/doctor/${d.id}/${slugify(d.name)}`)}
                className="w-56 flex-shrink-0 cursor-pointer p-4 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition"
              >
                <div className={`w-full h-32 rounded-lg ${d.bg || 'bg-gray-50'} overflow-hidden`}>
                  <img src={d.img} alt={d.name} className="w-full h-full object-cover" />
                </div>
                <div className="mt-3">
                  <p className="text-base font-bold text-gray-900">{d.name}</p>
                  <p className="text-sm text-emerald-600 font-medium">{d.specialty}</p>
                  <div className="flex items-center gap-1 text-xs mt-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-gray-700 font-medium">{d.rating.toFixed(1)}</span>
                    <Dot />
                    <span className="text-gray-500">{d.reviews} reviews</span>
                  </div>
                  <div className="mt-3 text-sm font-bold text-emerald-700">
                      ₦{Number(d.fee || 0).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ------------------- STICKY MOBILE CTA BAR ------------------- */}
      <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white border-t border-gray-200 p-4 shadow-2xl z-20">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col text-left">
            <span className="text-sm text-gray-600">Starting from</span>
            <span className="text-xl font-bold text-emerald-700">
              ₦{Number(fee || 0).toLocaleString()}
            </span>
          </div>
          
          <button
            onClick={() => setBookingOpen(true)}
            className="flex-1 px-4 py-3 rounded-xl text-white font-semibold text-base bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/30 transition duration-200"
          >
            Book Appointment
          </button>
        </div>
      </div>
      {/* ----------------- END STICKY MOBILE CTA BAR ----------------- */}

      {/* Booking Modal is rendered here */}
      <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} doctor={doctor} onSaved={handleSavedAppointment} />

      {/* Image Zoom Modal (kept for completeness) */}
      {zoomOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4" onClick={closeZoom}>
          <button onClick={closeZoom} className="absolute top-4 right-4 text-white hover:text-gray-300 p-2 rounded-full bg-black/50" aria-label="Close image viewer">
            <X className="w-6 h-6" />
          </button>
          <img src={gallery[activeImg]} alt={name} className="max-w-full max-h-[90vh] object-contain" />
        </div>
      )}
    </div>
  );
}