import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { FaWhatsapp } from "react-icons/fa";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import emailjs from "emailjs-com";

// WhatsApp Floating Button
export const WhatsAppFloatButton = () => {
  const phoneNumber = "2349037884753";
  return (
    <a
      href={`https://wa.me/${phoneNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 right-4 z-40 bg-green-700 text-white p-3 sm:p-3.5 md:p-4 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 hover:scale-110"
    >
      <FaWhatsapp className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
    </a>
  );
};

// FAQ
const faqs = [
  { q: "How do I book a lab test?", a: "You can book a lab test online..." },
  { q: "How do I track my order?", a: "Log in to your account and go to 'My Orders'..." },
  { q: "How do I contact customer support?", a: "You can use the contact form..." },
  { q: "Can I get a refund?", a: "Yes, refunds are processed as per policy..." }
];

function AccordionItem({ faq, open, onClick }) {
  return (
    <div className="border-b">
      <button className="w-full flex justify-between items-center py-3 text-left font-semibold" onClick={onClick}>
        {faq.q}
        <span>{open ? '-' : '+'}</span>
      </button>
      {open && <div className="pb-3 text-left text-sm text-gray-600">{faq.a}</div>}
    </div>
  );
}

// User Location Map
function UserLocationMap() {
  const [coords, setCoords] = useState(null);
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCoords(pos.coords),
        () => setCoords(null)
      );
    }
  }, []);
  if (!coords) {
    return (
      <div className="rounded-xl overflow-hidden shadow h-64 bg-gray-200 flex items-center justify-center">
        <span className="text-gray-500">Allow location to show map</span>
      </div>
    );
  }
  const mapSrc = `https://www.google.com/maps?q=${coords.latitude},${coords.longitude}&z=15&output=embed`;
  return (
    <div className="rounded-xl overflow-hidden shadow h-64 bg-gray-200">
      <iframe
        title="Your Location"
        src={mapSrc}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [openFaq, setOpenFaq] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState("");
  const [errorDetail, setErrorDetail] = useState("");

  // Tawk.to (optional – replace with your real widget ID)
  useEffect(() => {
    if (!window.Tawk_API) {
      const s1 = document.createElement("script");
      s1.async = true;
      s1.src = 'https://embed.tawk.to/your-tawk-id/1hxxxxxxx';
      s1.charset = 'UTF-8';
      s1.setAttribute('crossorigin', '*');
      document.body.appendChild(s1);
    }
  }, []);

  // EmailJS (optional — only runs if env vars exist)
  const sendEmailIfConfigured = async (payload) => {
    const serviceId  = process.env.REACT_APP_EMAILJS_SERVICE_ID;
    const templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
    const publicKey  = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;
    const toEmail    = process.env.REACT_APP_EMAILJS_TO_EMAIL;

    if (!serviceId || !templateId || !publicKey || !toEmail) return;

    const templateParams = {
      to_email: toEmail,
      from_name: payload.name || "MediLab Visitor",
      from_email: payload.email || "",
      phone: payload.phone || "",
      message: payload.message || "",
      sent_at: new Date().toLocaleString(),
    };

    await emailjs.send(serviceId, templateId, templateParams, publicKey);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setToast("");
    setErrorDetail("");

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        message: formData.message.trim(),
        createdAt: serverTimestamp(),
        source: "contact_page",
      };

      const ref = await addDoc(collection(db, "messages"), payload);

      try {
        await sendEmailIfConfigured(payload);
      } catch (emailErr) {
        console.warn("Email notification failed:", emailErr);
      }

      setToast("✅ Your message has been sent. We’ll get back to you shortly.");
      setFormData({ name: '', email: '', phone: '', message: '' });
      console.log("Message stored with id:", ref.id);
    } catch (err) {
      console.error(err);
      setToast("❌ Failed to send message. Please try again.");
      setErrorDetail(err?.code ? `${err.code}: ${err.message}` : String(err));
    } finally {
      setSubmitting(false);
      setTimeout(() => setToast(""), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-white px-2 sm:px-4 md:px-8 pt-24 pb-16">
      {(toast || errorDetail) && (
        <div className="max-w-3xl mx-auto mb-4 space-y-2">
          {toast && (
            <div className="rounded-lg border px-4 py-3 text-sm shadow bg-white">
              {toast}
            </div>
          )}
          {errorDetail && (
            <pre className="rounded-lg border px-4 py-3 text-xs shadow bg-red-50 text-red-700 overflow-auto">
{errorDetail}
            </pre>
          )}
        </div>
      )}

      {/* Emergency Contact Banner */}
      <div className="bg-emerald-100 border-l-4 border-emerald-500 p-4 rounded-lg shadow mb-10">
        <h2 className="text-lg font-semibold text-emerald-800">Emergency?</h2>
        <p className="text-emerald-700">
          For urgent assistance, call our 24/7 support line: <span className="font-bold">+234 903 788 4753 MediLab</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-emerald-700">Send us a message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full border rounded p-3"
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              required
              className="w-full border rounded p-3"
            />
            <input
              type="tel"
              name="phone"
              placeholder="Your Phone"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              className="w-full border rounded p-3"
            />
            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={e => setFormData({ ...formData, message: e.target.value })}
              required
              rows="5"
              className="w-full border rounded p-3"
            />
            <button
              type="submit"
              disabled={submitting}
              className="bg-emerald-600 text-white px-16 py-3 rounded hover:bg-emerald-700 transition block disabled:opacity-60"
            >
              {submitting ? "Sending…" : "Submit"}
            </button>
            <p className="text-xs text-gray-500 mt-2">
              By submitting, you consent to us storing this message to respond to your request.
            </p>
          </form>
        </div>

        {/* Help & Info */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold mb-2 text-emerald-700">FAQs</h3>
            <div>
              {faqs.map((faq, idx) => (
                <AccordionItem
                  key={idx}
                  faq={faq}
                  open={openFaq === idx}
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                />
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold mb-2 text-emerald-700">Other ways to reach us</h3>
            <div className="space-y-2 text-gray-800">
              <p className="flex items-center gap-2"><Mail size={18} /> support@medilab.ng</p>
              <p className="flex items-center gap-2"><Phone size={18} /> +234 903 788 4753</p>
              <p className="flex items-center gap-2"><MapPin size={18} /> FUTO, Imo, Nigeria</p>
            </div>
          </div>

          <UserLocationMap />
        </div>
      </div>

      <WhatsAppFloatButton />
    </div>
  );
}