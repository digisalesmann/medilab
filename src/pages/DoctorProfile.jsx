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
  ChevronRight as ArrowRight,
  Globe2,
} from "lucide-react";

function slugify(s = "") {
  return String(s)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// Small helpers
const SectionCard = ({ title, children, className = "" }) => (
  <section className={`bg-white border rounded-2xl p-5 md:p-6 shadow-sm ${className}`}>
    {title && <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">{title}</h3>}
    {children}
  </section>
);

const Badge = ({ children, color = "emerald" }) => (
  <span
    className={`inline-block text-xs px-2.5 py-1 rounded-full border bg-${color}-50 text-${color}-700 border-${color}-200`}
  >
    {children}
  </span>
);

export default function DoctorProfile() {
  const { id } = useParams(); // route: /doctor/:id/:slug?
  const navigate = useNavigate();

  const doctor = useMemo(
    () => (doctors || []).find((d) => String(d.id) === String(id)) || null,
    [id]
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  const gallery = useMemo(() => {
    if (!doctor)
      return [
        "/images/doctor-placeholder.jpg",
        "/images/doctor-placeholder.jpg",
        "/images/doctor-placeholder.jpg",
      ];
    const imgs = (doctor.images && doctor.images.length ? doctor.images : [doctor.img]).filter(Boolean);
    if (imgs.length >= 3) return imgs.slice(0, 6);
    const dup = [...imgs];
    while (dup.length < 3) dup.push(imgs[dup.length % imgs.length]);
    return dup;
  }, [doctor]);

  const [activeImg, setActiveImg] = useState(0);
  useEffect(() => setActiveImg(0), [id]);

  // Keyboard navigation for gallery
  const onKeyDownGallery = useCallback(
    (e) => {
      if (e.key === "ArrowRight") setActiveImg((i) => (i + 1) % gallery.length);
      if (e.key === "ArrowLeft") setActiveImg((i) => (i - 1 + gallery.length) % gallery.length);
    },
    [gallery.length]
  );

  // Touch swipe for gallery (mobile)
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

  // Zoom modal
  const [zoomOpen, setZoomOpen] = useState(false);
  const closeZoom = () => setZoomOpen(false);
  useEffect(() => {
    if (!zoomOpen) return;
    const onEsc = (e) => e.key === "Escape" && setZoomOpen(false);
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [zoomOpen]);

  const similar = useMemo(() => {
    if (!doctor) return [];
    return (doctors || [])
      .filter((d) => d.id !== doctor.id && d.specialty === doctor.specialty)
      .slice(0, 8);
  }, [doctor]);

  if (!doctor) {
    return (
      <div className="max-w-4xl mx-auto px-4 pt-28 pb-12">
        <div className="bg-white border rounded-2xl p-8 text-center shadow">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Doctor not found</h2>
          <p className="text-gray-600 mb-6">
            This doctor does not exist or has been removed.
          </p>
          <button
            onClick={() => navigate("/doctors")}
            className="px-4 py-2.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
          >
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
  } = doctor;

  return (
    <div className="max-w-6xl mx-auto px-4 pt-24 pb-20 lg:pb-24">
      {/* Top Card */}
      <div className="bg-white border rounded-2xl p-5 md:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Gallery */}
          <div
            className="w-full lg:w-5/12"
            tabIndex={0}
            aria-label="Doctor image gallery"
            onKeyDown={onKeyDownGallery}
          >
            <div
              className={`w-full border rounded-xl ${bg || "bg-gray-50"} overflow-hidden relative group`}
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              <img
                src={gallery[activeImg]}
                alt={`${name} – ${activeImg + 1}`}
                className="w-full h-[320px] md:h-[360px] object-cover"
              />

              {/* Prev/Next buttons (visible on hover/always on mobile) */}
              <button
                onClick={() => setActiveImg((i) => (i - 1 + gallery.length) % gallery.length)}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 border shadow hover:bg-white"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setActiveImg((i) => (i + 1) % gallery.length)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 border shadow hover:bg-white"
                aria-label="Next image"
              >
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => setZoomOpen(true)}
                className="absolute bottom-2 right-2 px-3 py-1.5 rounded-lg text-xs bg-white/90 border shadow hover:bg-white"
                aria-label="Zoom image"
              >
                Zoom
              </button>
            </div>
            <div className="mt-3 flex gap-2 overflow-x-auto scrollbar-hide">
              {gallery.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`border rounded-lg p-0.5 w-16 h-16 flex items-center justify-center flex-shrink-0 transition focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    i === activeImg ? "border-emerald-500" : "border-gray-200"
                  }`}
                  aria-label={`Show image ${i + 1}`}
                >
                  <img
                    src={src}
                    alt={`${name} – ${i + 1}`}
                    className="w-full h-full object-cover rounded-md"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="w-full lg:w-7/12 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge>{specialty}</Badge>
              <div className="flex items-center gap-1 text-sm" aria-label={`Rating ${Number(rating).toFixed(1)} out of 5`}>
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-gray-700 font-medium">{Number(rating || 0).toFixed(1)}</span>
                <span className="text-gray-400">({reviews})</span>
              </div>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">{name}</h1>

            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
              <span className="inline-flex items-center gap-1"><Stethoscope className="w-4 h-4" /> {experienceYears}+ yrs exp</span>
              <span className="inline-flex items-center gap-1"><MapPin className="w-4 h-4" /> {location}</span>
              {hospital && (
                <span className="inline-flex items-center gap-1"><Calendar className="w-4 h-4" /> {hospital}</span>
              )}
              <span className="inline-flex items-center gap-1"><Clock className="w-4 h-4" /> From ₦{Number(fee || 0).toLocaleString()}</span>
            </div>

            {languages.length > 0 && (
              <p className="text-sm text-gray-600">
                Languages: <span className="text-gray-800 font-medium">{languages.join(", ")}</span>
              </p>
            )}

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => alert("Booking flow coming soon")}
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

            {/* About */}
            {about && (
              <div className="pt-1">
                <h3 className="font-semibold text-gray-900 mb-1">About</h3>
                <p className="text-sm text-gray-700 leading-relaxed">{about}</p>
              </div>
            )}

            {/* Contact */}
            {contact && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                {contact.phone && (
                  <a
                    href={`tel:${contact.phone}`}
                    className="text-sm text-gray-700 inline-flex items-center gap-2 hover:underline"
                  >
                    <Phone className="w-4 h-4" /> {contact.phone}
                  </a>
                )}
                {contact.email && (
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-sm text-gray-700 inline-flex items-center gap-2 hover:underline"
                  >
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

      {/* Availability */}
      {availability && (
        <SectionCard title="Availability" className="mt-8">
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-700">
            {availability.days?.length > 0 && (
              <span className="px-2 py-1 rounded bg-gray-100 border">{(availability.days || []).join(" · ")}</span>
            )}
            {availability.slots?.length > 0 && (
              <span className="px-2 py-1 rounded bg-gray-100 border">{(availability.slots || []).join("  |  ")}</span>
            )}
          </div>
        </SectionCard>
      )}

      {/* Services, Education, Awards as accessible accordions on mobile */}
      <div className="mt-8 grid gap-4 md:gap-6 md:grid-cols-2">
        {/* Services */}
        {services?.length > 0 && (
          <SectionCard title="Services">
            <ul className="grid sm:grid-cols-2 gap-2 list-disc pl-5 text-sm text-gray-700">
              {services.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </SectionCard>
        )}

        {/* Education */}
        {education?.length > 0 && (
          <SectionCard title="Education">
            <ul className="space-y-2 text-sm text-gray-700">
              {education.map((e, i) => (
                <li key={i} className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">{e.degree}</span>
                  {e.school && <span className="text-gray-500">— {e.school}</span>}
                  {e.year && <span className="text-gray-400">({e.year})</span>}
                </li>
              ))}
            </ul>
          </SectionCard>
        )}

        {/* Awards */}
        {awards?.length > 0 && (
          <SectionCard title="Awards" className="md:col-span-2">
            <ul className="space-y-2 text-sm text-gray-700 list-disc pl-5">
              {awards.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </SectionCard>
        )}
      </div>

      {/* Similar doctors */}
      {similar.length > 0 && (
        <section className="mt-10">
          <h3 className="text-xl font-bold text-gray-900 mb-3">Similar {specialty}s</h3>
          <div className="relative">
            <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
              {similar.map((d) => (
                <button
                  key={d.id}
                  onClick={() => navigate(`/doctor/${d.id}/${slugify(`${d.name}-${d.specialty}`)}`)}
                  className={`flex-shrink-0 w-64 text-left border border-gray-200 rounded-xl p-3 shadow-sm hover:shadow-md transition ${d.bg || "bg-gray-50"} snap-start`}
                  aria-label={`Open profile for ${d.name}`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={d.img}
                      alt={d.name}
                      className="w-12 h-12 rounded-full object-cover border"
                    />
                    <div>
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
          </div>
        </section>
      )}

      {/* Zoom Modal */}
      {zoomOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
          onClick={closeZoom}
        >
          <div
            className="relative max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={gallery[activeImg]}
              alt={`${name} – zoomed`}
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg shadow-lg"
            />
            <button
              onClick={closeZoom}
              className="absolute -top-3 -right-3 bg-white text-gray-900 rounded-full p-2 shadow-lg border"
              aria-label="Close zoom"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Sticky mobile action bar */}
      <div className="fixed bottom-4 left-0 right-0 px-4 md:hidden pointer-events-none">
        <div className="max-w-6xl mx-auto pointer-events-auto">
          <div className="bg-white border shadow-lg rounded-xl p-2 flex items-center justify-between">
            <div className="text-sm text-gray-700 px-2">
              From <span className="font-semibold">₦{Number(fee || 0).toLocaleString()}</span>
            </div>
            <button
              onClick={() => alert("Booking flow coming soon")}
              className="px-4 py-2 rounded-lg text-white bg-emerald-600 hover:bg-emerald-700"
            >
              Book now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
