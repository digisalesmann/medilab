import React, { useState, useEffect, useMemo } from 'react';
import { 
  Mail, Phone, MapPin, ClipboardCheck, DollarSign, HelpCircle, Send, 
  Clock, X, Loader2, MessageSquare, AlertTriangle, Settings, Search, BookOpen, 
  User, Code, Layers, FileText
} from 'lucide-react';

// Mock dependencies for compilation environment
const db = { collection: (name) => ({}), addDoc: async (ref, payload) => ({ id: 'mock-id-123', payload }) };
const serverTimestamp = () => new Date().toISOString();
const emailjs = { send: async () => ({ status: 200 }) };
const useTawkTo = () => { useEffect(() => { /* Tawk.to widget setup logic goes here */ }, []); };

const contactIntents = [
  { value: 'order', label: 'Order & Tracking', icon: ClipboardCheck, description: 'Questions about order status, tracking, or delivery.', sla: '1-2 hours' },
  { value: 'results', label: 'Results & Reports', icon: FileText, description: 'Queries regarding lab report clarity, timing, or access.', sla: '2-4 hours' },
  { value: 'sample', label: 'Sample Integrity', icon: AlertTriangle, description: 'Urgent questions about sample collection or quality control.', sla: '1 hour (Priority)' },
  { value: 'billing', label: 'Billing & Invoice', icon: DollarSign, description: 'Issues with payments, refunds, or accessing invoices.', sla: '4-8 hours' },
  { value: 'tech', label: 'Technical Issues', icon: Settings, description: 'Problems with the website, portal, or API access.', sla: '2-4 hours' },
  { value: 'general', label: 'General Inquiry', icon: HelpCircle, description: 'Other non-urgent questions or feedback.', sla: '8-12 hours' },
];

const helpTabs = [
  { id: 'contact', label: 'Need Help Now', icon: MessageSquare },
  { id: 'faq', label: 'Self-Service Portal', icon: BookOpen },
  { id: 'professional', label: 'Pro & Tech Support', icon: User },
];

const knowledgeBase = [
  { category: 'Orders & Shipping', q: "How long until I receive my testing kit?", a: "Standard shipping takes 3-5 business days. Express options are available at checkout." },
  { category: 'Orders & Shipping', q: "Can I cancel my order after payment?", a: "Cancellations are permitted before the kit ships. Contact support immediately for assistance." },
  { category: 'Lab Reports', q: "How long does it take to get my results?", a: "Result processing times vary by test, typically 3-10 business days after the lab receives your sample." },
  { category: 'Lab Reports', q: "How are my results secured?", a: "Results are encrypted and available only through your verified MediLabs client portal." },
  { category: 'Billing', q: "Do you accept insurance?", a: "We primarily operate on a self-pay model, but we can provide codes for you to submit to your insurer for reimbursement." },
  { category: 'Account', q: "I forgot my password, how do I reset it?", a: "Click the 'Forgot Password' link on the login screen. A reset link will be sent to your registered email address." }
];

const WhatsappIcon = ({ size = 20, className = '' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width={size} height={size} className={className} fill="currentColor">
    <path d="M380.9 97.1C339.6 50.1 278.3 24 216 24c-119.7 0-216 96.3-216 216 0 35.3 8.3 68.3 24 97.4L1 480l106.6-35.4c29.1 15.7 62.1 24 97.4 24h.1c119.7 0 216-96.3 216-216 0-62.3-26.1-123.6-73.1-164.9zM216 420c-35.1 0-70.1-9.9-100-29.4l-7.2-4.3-74 24.6 25.8-75.1-4.5-7.4c-20.3-33.1-31.5-71.5-31.5-110.8C48 152.1 120.1 80 216 80s168 72.1 168 168-72.1 168-168 168zm84.4-118.4c-1.2-.6-7.1-3.6-8.2-4-1.1-.4-2-.6-2.9.6-1 1.2-3.7 4.7-4.5 5.6-.8 1.1-1.6 1.2-3 1.2s-2.8-.5-5.3-2.6c-17.5-10.3-29-25.9-40.6-43.9-3.7-5.5-3.1-4.5.7-8.1 1.4-1.5 3-3.6 4.2-5.4.4-.6.2-1.1-.1-1.8l-3.6-8.2c-.8-1.9-1.8-1.6-2.6-1.6-.8 0-1.7-.1-2.6-.1s-2.3.4-3.5 1.7c-1.2 1.2-4.6 4.5-4.6 11c0 6.5 4.7 12.7 5.4 13.6.8 1.1 9.4 14.7 22.8 29.8 10.3 11.5 19.4 17.5 24.6 20.6 8.3 5 11.2 4 15.4 3.4 4.3-.6 7.1-2.9 8.2-4.7 1.1-1.7 1.1-3.2.7-4.7z" />
  </svg>
);

const Toast = ({ message, type, onClose }) => {
  if (!message) return null;

  const baseClasses = "fixed bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full shadow-2xl transition-all duration-500 z-50 flex items-center gap-3 font-semibold text-sm max-w-[90%] sm:max-w-md";
  const typeClasses = type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white';
  const Icon = type === 'success' ? ClipboardCheck : X;

  return (
    <div className={`${baseClasses} ${typeClasses}`}>
      <Icon size={18} />
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 p-1 rounded-full hover:bg-white/10 transition-colors flex-shrink-0">
        <X size={16} />
      </button>
    </div>
  );
};

const InputField = ({ type = 'text', name, label, value, onChange, required = false, rows = 1, placeholder = " " }) => (
  <div className="relative group">
    {rows > 1 ? (
      <textarea
        id={name}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        rows={rows}
        className="block w-full px-4 pt-6 pb-2 text-base text-gray-900 appearance-none bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors peer resize-none shadow-sm"
      />
    ) : (
      <input
        type={type}
        id={name}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="block w-full px-4 pt-6 pb-2 text-base text-gray-900 appearance-none bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors peer shadow-sm"
      />
    )}
    <label
      htmlFor={name}
      className="absolute top-0 left-4 text-sm text-gray-500 duration-300 transform -translate-y-0 scale-75 pt-2 origin-[0] peer-focus:text-emerald-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-3.5 peer-focus:scale-75 peer-focus:-translate-y-0.5 pointer-events-none"
    >
      {label} {required && <span className="text-red-500">*</span>}
    </label>
  </div>
);

// FAQ Accordion Item
function AccordionItem({ faq, open, onClick }) {
  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button 
        className="w-full flex justify-between items-center py-4 text-left font-semibold text-gray-700 hover:text-emerald-700 transition" 
        onClick={onClick}
        aria-expanded={open}
      >
        <span>{faq.q}</span>
        <span className={`transform transition-transform duration-300 ${open ? 'rotate-180 text-emerald-600' : 'text-gray-400'}`}>
          <ChevronDown size={20} />
        </span>
      </button>
      <div 
        className={`overflow-hidden transition-all duration-500 ${open ? 'max-h-96 opacity-100 pb-4' : 'max-h-0 opacity-0'}`}
      >
        <p className="text-left text-sm text-gray-600">{faq.a}</p>
      </div>
    </div>
  );
}

const ChevronDown = ({ size }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const ContactFormTab = ({ formData, setFormData, handleSubmit, submitting, currentIntent, handleFieldChange, errorDetail }) => (
  // Ensure the grid stacks on mobile (default col-1) and expands on large screens
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    
    {/* Contact Form (Takes full width on mobile, 2/3 on large screens) */}
    <div className="lg:col-span-2 space-y-8">
      
      {/* Intent Selection Cards */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-6 border-b pb-3 border-gray-100">1. Select Your Request Category</h3>
        {/* Responsive card grid: 2 columns default, 3 columns on medium screens */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {contactIntents.map((intent) => {
            const Icon = intent.icon;
            const isActive = formData.intent === intent.value;
            return (
              <button
                key={intent.value}
                onClick={() => setFormData(prev => ({ ...prev, intent: intent.value }))}
                className={`p-3 sm:p-4 h-full flex flex-col items-center justify-center text-center border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-100 min-h-[100px]
                  ${
                    isActive
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-inner scale-[1.02]'
                      : 'border-gray-200 bg-white hover:border-emerald-400 hover:shadow-md text-gray-700'
                  }`}
                aria-pressed={isActive}
              >
                <Icon size={20} className={`mb-1 sm:mb-2 ${isActive ? 'text-emerald-600' : 'text-gray-500'}`} />
                <span className="block font-semibold text-xs sm:text-sm">{intent.label}</span>
              </button>
            );
          })}
        </div>
        <p className="text-sm text-gray-600 mt-6 flex items-center gap-2 pt-2 border-t border-gray-100 flex-wrap">
          <Clock size={16} className='text-emerald-500 flex-shrink-0' />
          Est. Response Time for {currentIntent.label}: <span className='font-bold text-emerald-600'>{currentIntent.sla}</span>
        </p>
      </div>

      {/* Contact Form */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-100">
        <h3 className="text-xl font-bold mb-6 text-gray-800 border-b pb-3 border-gray-100">2. Provide Your Details</h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InputField label="Full Name" name="name" value={formData.name} onChange={handleFieldChange} required />
            <InputField type="email" label="Email Address" name="email" value={formData.email} onChange={handleFieldChange} required />
          </div>
          
          <InputField type="tel" label="Phone Number (Optional)" name="phone" value={formData.phone} onChange={handleFieldChange} />
          
          {/* Conditional Field Example for specific intents */}
          {['order', 'billing', 'results'].includes(formData.intent) && (
            <InputField 
              label={formData.intent === 'billing' ? "Invoice/Order Number" : "Order/Tracking ID"} 
              name="orderId" 
              value={formData.orderId || ''} 
              onChange={handleFieldChange} 
              required 
            />
          )}

          <InputField label="Detailed Message" name="message" value={formData.message} onChange={handleFieldChange} required rows={5} />
          
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-emerald-600 text-white text-lg font-bold py-3 rounded-xl hover:bg-emerald-700 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-[1.005]"
          >
            {submitting ? (
              <>
                <Loader2 size={24} className="animate-spin" />
                Routing Message Securely...
              </>
            ) : (
              <>
                <Send size={20} />
                Send Dedicated Request
              </>
            )}
          </button>
        </form>
      </div>
    </div>

    {/* Quick Contact Sidebar (Full width on mobile, 1/3 on large screens) */}
    <div className="lg:col-span-1 space-y-8 text-left">
      <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
        <h3 className="text-xl font-bold mb-4 text-emerald-700 border-b pb-2 border-gray-100 text-left">
          Direct Contact Channels
        </h3>

        <div className="space-y-4 text-gray-700 text-left">
          <a
            href="mailto:support@medilab.ng"
            className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors"
          >
            <Mail size={20} className="text-emerald-500 mt-0.5 flex-shrink-0" />
            <div className="text-left">
              <p className="font-semibold">General Email</p>
              <p className="text-sm text-gray-500">support@medilab.ng</p>
            </div>
          </a>

          <a
            href="https://wa.me/2349037884753"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors"
          >
            <WhatsappIcon size={20} className="text-emerald-500 mt-0.5 flex-shrink-0" />
            <div className="text-left">
              <p className="font-semibold">WhatsApp Chat</p>
              <p className="text-sm text-gray-500">24/7 Live Support</p>
            </div>
          </a>

          <a
            href="tel:+2349037884753"
            className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors"
          >
            <Phone size={20} className="text-emerald-500 mt-0.5 flex-shrink-0" />
            <div className="text-left">
              <p className="font-semibold">Priority Phone</p>
              <p className="text-sm text-gray-500">+234 903 788 4753</p>
            </div>
          </a>

          <div className="flex items-start gap-3 p-3">
            <MapPin size={20} className="text-emerald-500 mt-0.5 flex-shrink-0" />
            <div className="text-left">
              <p className="font-semibold">Headquarters</p>
              <p className="text-sm text-gray-500">FUTO, Owerri, Imo State, Nigeria</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Tab 2: Self-Service Portal (Searchable FAQ)
const SelfServiceTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openFaq, setOpenFaq] = useState(null);

  const filteredFaqs = useMemo(() => {
    if (!searchTerm) return knowledgeBase;
    const lowerCaseSearch = searchTerm.toLowerCase();
    return knowledgeBase.filter(faq => 
      faq.q.toLowerCase().includes(lowerCaseSearch) || 
      faq.a.toLowerCase().includes(lowerCaseSearch) ||
      faq.category.toLowerCase().includes(lowerCaseSearch)
    );
  }, [searchTerm]);

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Search Our Knowledge Base</h3>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="e.g., 'refund policy' or 'sample collection time'"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-3 pl-12 pr-4 border border-gray-300 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
          />
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
        <h3 className="text-xl font-bold mb-4 text-emerald-700">
          {searchTerm ? `Found ${filteredFaqs.length} Result${filteredFaqs.length !== 1 ? 's' : ''}` : 'Popular Topics'}
        </h3>
        
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <Layers size={40} className="mx-auto mb-3 text-gray-300" />
            <p>No results found for "{searchTerm}". Try broadening your search or use the contact form.</p>
          </div>
        ) : (
          filteredFaqs.map((faq, idx) => (
            <AccordionItem
              key={idx}
              faq={faq}
              open={openFaq === idx}
              onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
            />
          ))
        )}
      </div>
    </div>
  );
};

// Tab 3: Professional & Technical Support
const ProfessionalSupportTab = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">

    {/* Clinical Support Card */}
    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 transition-shadow hover:shadow-2xl">
      <div className="flex items-center gap-4 mb-4">
        <User size={30} className="text-emerald-600 bg-emerald-50 p-2 rounded-full" />
        <h3 className="text-xl font-bold text-gray-900">Clinician & Partner Support</h3>
      </div>
      <div className="flex items-start gap-2 mb-4 text-gray-700">
        <CheckCircle size={18} className="text-emerald-500 mt-1 flex-shrink-0" />
        <p className="text-gray-600">
          Dedicated support for healthcare, research, and partnership inquiries.
        </p>
      </div>
      <ul className="space-y-3 text-sm">
        <li className="flex items-start gap-2 text-gray-700">
          <CheckCircle size={18} className="text-emerald-500 mt-1 flex-shrink-0" />
          <span>Clinical Consultations: Connect with a Medical Doctor or Pathologist.</span>
        </li>
        <li className="flex items-start gap-2 text-gray-700">
          <CheckCircle size={18} className="text-emerald-500 mt-1 flex-shrink-0" />
          <span>Research & Trials: Bulk ordering and custom panel creation.</span>
        </li>
      </ul>
      <a
        href="mailto:partners@medilab.ng"
        className="mt-6 inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-emerald-700 transition"
      >
        <Mail size={16} /> Contact Partnerships
      </a>
    </div>

    {/* Technical & API Support Card */}
    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 transition-shadow hover:shadow-2xl">
      <div className="flex items-center gap-4 mb-4">
        <Code size={30} className="text-indigo-600 bg-indigo-50 p-2 rounded-full" />
        <h3 className="text-xl font-bold text-gray-900">API & Developer Support</h3>
      </div>
      <div className="flex items-start gap-2 mb-4 text-gray-700">
        <CheckCircle size={18} className="text-emerald-500 mt-1 flex-shrink-0" />
        <p className="text-gray-600">
          Get help integrating MediLabs into your platform.
        </p>
      </div>
      <ul className="space-y-3 text-sm">
        <li className="flex items-start gap-2 text-gray-700">
          <CheckCircle size={18} className="text-emerald-500 mt-1 flex-shrink-0" />
          <span>API Key Issues: Help with authentication and access tokens.</span>
        </li>
        <li className="flex items-start gap-2 text-gray-700">
          <CheckCircle size={18} className="text-emerald-500 mt-1 flex-shrink-0" />
          <span>Integration Troubleshooting: Direct line to our dev team.</span>
        </li>
      </ul>
      <a
        href="mailto:devops@medilab.ng"
        className="mt-6 inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-emerald-700 transition"
      >
        <Code size={16} /> Contact Technical Team
      </a>
    </div>

  </div>
);


const CheckCircle = ({ size, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);


// --- MAIN COMPONENT ---

export default function HelpCenter() {
  const [activeTab, setActiveTab] = useState('contact');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '', intent: contactIntents[0].value, orderId: '' });
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "" });
  const [errorDetail, setErrorDetail] = useState("");

  const currentIntent = contactIntents.find(i => i.value === formData.intent) || contactIntents[0];

  useTawkTo(); // Initialize live chat

  const handleFieldChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // EmailJS logic
  const sendEmailIfConfigured = async (payload) => {
    const serviceId  = 'mock_service_id'; 
    const templateId = 'mock_template_id';
    const publicKey  = 'mock_public_key';
    
    if (serviceId === 'mock_service_id') return;

    const templateParams = {
      from_name: payload.name,
      from_email: payload.email,
      phone: payload.phone,
      message: payload.message,
      intent: payload.intent,
    };

    await emailjs.send(serviceId, templateId, templateParams, publicKey);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setToast({ message: "", type: "" });
    setErrorDetail("");

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        message: formData.message.trim(),
        intent: formData.intent,
        orderId: formData.orderId || '',
        createdAt: serverTimestamp(),
        source: "premium_help_center",
      };

      // 1. Store the message in Firestore
      const ref = await db.addDoc(db.collection("inquiries"), payload);

      // 2. Send Email Notification (Non-blocking)
      try {
        await sendEmailIfConfigured(payload);
      } catch (emailErr) {
        console.warn("Email notification failed:", emailErr);
      }

      // 3. Success Feedback
      setToast({ 
        message: `Your message has been received! Our team will respond within ${currentIntent.sla}. (Ref: ${ref.id})`, 
        type: 'success' 
      });
      
      // Reset form fields
      setFormData(prev => ({ ...prev, name: '', email: '', phone: '', message: '', orderId: '' }));

    } catch (err) {
      // 4. Error Feedback
      console.error("Submission Error:", err);
      setToast({ 
        message: "Failed to send message. Please check your connection or use the priority line.", 
        type: 'error' 
      });
      setErrorDetail(err.message || String(err));
    } finally {
      setSubmitting(false);
      setTimeout(() => setToast({ message: "", type: "" }), 10000);
    }
  };
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'contact':
        return <ContactFormTab 
          formData={formData} 
          setFormData={setFormData} 
          handleSubmit={handleSubmit} 
          submitting={submitting} 
          currentIntent={currentIntent} 
          handleFieldChange={handleFieldChange}
          errorDetail={errorDetail}
        />;
      case 'faq':
        return <SelfServiceTab />;
      case 'professional':
        return <ProfessionalSupportTab />;
      default:
        return <ContactFormTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      
      {/* Header (Green Theme Background) */}
      <header className="bg-emerald-700 text-center pt-16 pb-12 sm:pt-24 sm:pb-16 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight">
            MediLabs Help Center
          </h1>
          <p className="mt-3 text-center text-lg text-emerald-50 max-w-3xl mx-auto">
            Find immediate answers in our portal or connect with a specialist based on your specific need.
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        
        {/* Emergency / Priority Support Banner */}
        <div className="bg-emerald-700 text-white p-6 rounded-2xl shadow-xl mb-12 flex flex-col md:flex-row items-start justify-between">
          <div className="flex items-start gap-4 text-left">
            <AlertTriangle size={30} className="text-emerald-200 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-bold">Clinical Emergency Line</h2>
              <p className="text-emerald-100 text-sm">
                Use only for urgent clinical or sample integrity issues.
              </p>
            </div>
          </div>
          <a
            href="tel:+2349037884753"
            className="mt-4 md:mt-0 w-full md:w-auto text-center px-6 py-2 bg-white text-emerald-700 font-extrabold rounded-full hover:bg-emerald-50 transition-colors shadow-lg text-lg"
          >
            +234 903 788 4753
          </a>
        </div>

        {/* Tab Navigation (Fully Mobile Responsive) */}
        <div className="mb-10 p-2 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-x-auto">
          <div className="flex space-x-2 w-full">
            {helpTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-center sm:justify-start gap-2 py-3 px-3 sm:px-4 min-w-[30%] flex-1 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap text-xs sm:text-base
                    ${isActive 
                      ? 'bg-emerald-600 text-white shadow-md' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-emerald-700'
                    }`}
                >
                  <Icon size={20} />
                  <span className="hidden sm:inline">{tab.label}</span>
                  {/* Show shorter label on small screens */}
                  <span className="inline sm:hidden">{tab.label.split(' ')[0]}</span> 
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        {renderTabContent()}

        {/* Error Detail Display (Small, for debugging) */}
        {errorDetail && (
          <div className="rounded-xl p-4 text-xs shadow bg-red-100 text-red-800 overflow-auto mt-8">
            <p className='font-bold mb-1'>System Debug Information:</p>
            <pre className='whitespace-pre-wrap'>{errorDetail}</pre>
          </div>
        )}

      </main>
      
      {/* Toast Notification Mount */}
      <Toast 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast({ message: "", type: "" })} 
      />
      
    </div>
  );
}
