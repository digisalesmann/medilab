import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

// FAQ Accordion
const faqs = [
  {
    q: "How do I book a lab test?",
    a: "You can book a lab test online through our website or mobile app. Just select your test, choose a time, and confirm your booking."
  },
  {
    q: "How do I track my order?",
    a: "Log in to your account and go to 'My Orders' to track your order status in real time."
  },
  {
    q: "How do I contact customer support?",
    a: "You can use the contact form, call our support line, or use the live chat for instant help."
  },
  {
    q: "Can I get a refund?",
    a: "Yes, refunds are processed as per our policy. Please contact support for assistance."
  }
];

function AccordionItem({ faq, open, onClick }) {
  return (
    <div className="border-b">
      <button
        className="w-full flex justify-between items-center py-3 text-left font-semibold"
        onClick={onClick}
      >
        {faq.q}
        <span>{open ? '-' : '+'}</span>
      </button>
      {open && <div className="pb-3 text-sm text-gray-600">{faq.a}</div>}
    </div>
  );
}

// User location map component
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
      ></iframe>
    </div>
  );
}

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [openFaq, setOpenFaq] = useState(null);

  // EmailJS integration placeholder
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Your message has been submitted!");
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  // Tawk.to Live Chat (loads once)
  useEffect(() => {
    if (!window.Tawk_API) {
      var s1 = document.createElement("script");
      s1.async = true;
      s1.src = 'https://embed.tawk.to/your-tawk-id/1hxxxxxxx';
      s1.charset = 'UTF-8';
      s1.setAttribute('crossorigin', '*');
      document.body.appendChild(s1);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-white px-2 sm:px-4 md:px-8 pt-24 pb-16">
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
  className="bg-emerald-600 text-white px-16 py-3 rounded hover:bg-emerald-700 transition block"
>
  Submit
</button>
          </form>
        </div>

        {/* Help & Info */}
        <div className="space-y-6">
          {/* FAQ Accordion */}
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

          {/* Support Channels */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold mb-2 text-emerald-700">Other ways to reach us</h3>
            <div className="space-y-2 text-gray-800">
              <p className="flex items-center gap-2"><Mail size={18} /> support@medilab.ng</p>
              <p className="flex items-center gap-2"><Phone size={18} /> +234 903 788 4753</p>
              <p className="flex items-center gap-2"><MapPin size={18} /> FUTO, Imo, Nigeria</p>
            </div>
          </div>

          {/* Google Maps Embed (User Location) */}
          <UserLocationMap />
        </div>
      </div>

      {/* Chatbot Button Placeholder */}
      <button
        className="fixed bottom-6 right-6 z-50 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full p-4 shadow-lg flex items-center gap-2"
        title="Chat with us"
        onClick={() => window.Tawk_API && window.Tawk_API.maximize()}
      >
        <span className="text-lg">💬</span>
        <span className="hidden sm:inline">Chat</span>
      </button>
    </div>
  );
};

export default Contact;