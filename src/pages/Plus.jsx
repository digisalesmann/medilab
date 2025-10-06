// src/components/Plus.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";

import {
  Crown,
  CheckCircle2,
  Truck,
  Coins,
  FlaskConical,
  BadgePercent,
  ShieldCheck,
  Sparkles,
  Star,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Info,
} from "lucide-react";

/** Utilities */
const currency = (n) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(n);

const perkIconMap = {
  credits: Coins,
  lab: FlaskConical,
  delivery: Truck,
  fee: BadgePercent,
  priority: ShieldCheck,
  exclusive: Sparkles,
};

/** Mock content you can wire to real data later */
const BENEFITS = [
  { key: "credits", title: "5% Credits on Medicines", desc: "Earn redeemable credits on eligible medicine orders." },
  { key: "lab", title: "50% Credits on 1st Lab Test", desc: "Get extra value on your first booked lab test." },
  { key: "delivery", title: "Free Delivery", desc: "Enjoy free delivery on orders above ₦25,000." },
  { key: "fee", title: "Zero Convenience Fees", desc: "No additional gateway/processing fees for Plus members." },
  { key: "priority", title: "Priority Support", desc: "Faster response on chat/email from our care team." },
  { key: "exclusive", title: "Member-only Offers", desc: "Early access to drops, bundles & seasonal deals." },
];

const PLANS = [
  { id: "monthly", name: "Monthly", price: 1500, tagline: "Start small" },
  { id: "quarterly", name: "Quarterly", price: 3900, tagline: "Most popular", best: true },
  { id: "yearly", name: "Yearly", price: 14900, tagline: "Best value" },
];

const FAQS = [
  {
    q: "How do Plus credits work?",
    a: "You earn credits on eligible purchases. Credits auto-apply on your next checkout and never exceed the order total.",
  },
  {
    q: "Is there a minimum order for free delivery?",
    a: "Yes. Free delivery is applicable on eligible orders above ₦25,000 within supported locations.",
  },
  {
    q: "Can I cancel Plus anytime?",
    a: "Yes, you can cancel anytime. Your benefits remain active until the end of the billing period.",
  },
  {
    q: "Do credits expire?",
    a: "Credits expire after 90 days if unused. We send reminders before expiry.",
  },
];

const TESTIMONIALS = [
  {
    name: "Rahul Singh",
    note: "Saved ₦3,782 in 6 months",
    text:
      "I’ve made huge savings since joining Plus — free deliveries, extra credits on every order and lab bookings. Makes monthly meds so much easier.",
  },
  {
    name: "Amaka O.",
    note: "Saved ₦5,210 in 9 months",
    text:
      "Priority support is a real perk. The credits stack up quickly and the first-lab discount was a cherry on top.",
  },
  {
    name: "Kehinde A.",
    note: "Saved ₦2,960 in 4 months",
    text:
      "Transparent savings and no extra fees at checkout. The yearly plan paid for itself in a few orders.",
  },
];

/** Savings calculator model */
function calcSavings(monthlySpend) {
  // tune these to your real program rules
  const medCredits = monthlySpend * 0.05; // 5% on medicines
  const labCredit = 500; // one-time credit we amortize across 3 months for display
  const shipSave = monthlySpend >= 25000 ? 300 : 150; // rough estimate / month
  // we present a 3-month projection
  const months = 3;
  const total = medCredits * months + labCredit + shipSave * months;

  return {
    months,
    medCredits: medCredits * months,
    labCredit,
    shipSave: shipSave * months,
    total,
  };
}

/** Section Title */
const Title = ({ children, sub }) => (
  <div className="mb-4">
    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 text-left">{children}</h2>
    {sub && <p className="text-sm sm:text-base text-gray-600 mt-1 text-left">{sub}</p>}
  </div>
);

/** Bullet with icon */
const Line = ({ icon: Icon, label }) => (
  <div className="flex items-center gap-2 text-sm text-gray-700">
    <Icon className="w-4 h-4 text-emerald-600" />
    <span>{label}</span>
  </div>
);

/** Helpers for membership persistence */
const MEMBERSHIP_KEY = "medilab.plus.membership";
function saveMembership(planId, monthsDuration = 1) {
  const now = new Date();
  const expiry = new Date(now);
  expiry.setMonth(expiry.getMonth() + monthsDuration);
  const payload = { planId, activatedAt: now.toISOString(), expiresAt: expiry.toISOString() };
  try {
    localStorage.setItem(MEMBERSHIP_KEY, JSON.stringify(payload));
  } catch {}
  return payload;
}
function readMembership() {
  try {
    const raw = localStorage.getItem(MEMBERSHIP_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/** MAIN */
export default function Plus() {
  const [spend, setSpend] = useState(30000);
  const [plan, setPlan] = useState(PLANS.find((p) => p.best)?.id || PLANS[0].id);
  const [tIndex, setTIndex] = useState(0);

  // --- modal / checkout states ---
  const [showCheckout, setShowCheckout] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(null); // success payload
  const [paymentMethod, setPaymentMethod] = useState("card"); // card | ussd
  const [promo, setPromo] = useState("");
  const [promoApplied, setPromoApplied] = useState(null);
  const [error, setError] = useState("");

  // membership read
  const [membership, setMembership] = useState(() => readMembership());

  const savings = useMemo(() => calcSavings(spend), [spend]);
  const currentPlan = useMemo(() => PLANS.find((p) => p.id === plan), [plan]);

  // For smooth scroll to calculator
  const calcRef = useRef(null);

  // body scroll lock when modal open
  useEffect(() => {
    if (showCheckout) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showCheckout]);

  // reset modal state when closed
  useEffect(() => {
    if (!showCheckout) {
      setProcessing(false);
      setSuccess(null);
      setPaymentMethod("card");
      setPromo("");
      setPromoApplied(null);
      setError("");
    }
  }, [showCheckout]);

  // handle promo code (simple simulation)
  function handleApplyPromo() {
    setError("");
    const code = (promo || "").trim().toUpperCase();
    if (!code) {
      setError("Enter a promo code to apply.");
      return;
    }
    // simulated promo logic
    if (code === "PLUS10") {
      setPromoApplied({ code, discount: 0.1 }); // 10% off
    } else if (code === "SAVE500") {
      setPromoApplied({ code, discountFlat: 500 }); // flat 500 off
    } else {
      setError("Invalid promo code");
      setPromoApplied(null);
    }
  }

  // confirm payment (simulate)
  function handleConfirmPayment() {
    setError("");
    setProcessing(true);

    // compute final price
    let price = currentPlan.price;
    if (promoApplied) {
      if (promoApplied.discount) price = Math.round(price * (1 - promoApplied.discount));
      if (promoApplied.discountFlat) price = Math.max(0, price - promoApplied.discountFlat);
    }

    // Simulate network/payment processing
    setTimeout(() => {
      // fake success response
      const monthsDuration = currentPlan.id === "yearly" ? 12 : currentPlan.id === "quarterly" ? 3 : 1;
      const membershipPayload = saveMembership(currentPlan.id, monthsDuration);
      setMembership(membershipPayload);

      setProcessing(false);
      setSuccess({
        id: `PLUS-${Date.now()}`,
        plan: currentPlan,
        paid: price,
        method: paymentMethod,
        membership: membershipPayload,
      });
    }, 1800);
  }

  // when success appears, allow closing and keep membership stored
  useEffect(() => {
    if (success) {
      // refresh membership from storage
      setMembership(readMembership());
    }
  }, [success]);

  // open checkout (from hero/CTA) — ensures current plan selected
  function openCheckoutForPlan(planId) {
    if (planId) setPlan(planId);
    setShowCheckout(true);
    setTimeout(() => {
      // focus handling if needed
      const el = document.querySelector("[data-checkout-first]");
      if (el) el.focus();
    }, 100);
  }

  function handleSeeSavingsClick(e) {
    // prefer smooth scroll via ref
    if (calcRef.current) {
      e.preventDefault();
      calcRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white pt-[72px] lg:pt-6">
      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden rounded-2xl md:rounded-3xl px-5 sm:px-8 md:px-10 py-8 md:py-12 border shadow-sm bg-gradient-to-br from-emerald-700 via-emerald-600 to-emerald-500">
        {/* decorative blobs */}
        <div className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-emerald-300/20 blur-3xl" />

        <div className="relative grid grid-cols-12 gap-6 items-center">
          {/* Left: copy */}
          <div className="col-span-12 md:col-span-7">
            <div className="flex justify-start">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 text-white/90 text-xs ring-1 ring-white/20 mb-3">
                <Crown className="w-4 h-4" /> Plus Membership
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white text-left">
              Reduce your medical expenses with <span className="underline decoration-white/60 underline-offset-4">Plus</span>
            </h1>

            <p className="mt-3 text-sm sm:text-base text-white/90 max-w-xl text-left">
              Enjoy member-only credits, free deliveries, zero convenience fees and more — designed to make recurring care effortless.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => openCheckoutForPlan(plan)}
                className="inline-flex items-center justify-center px-4 sm:px-5 py-2.5 rounded-lg bg-white text-emerald-700 font-semibold shadow hover:shadow-md transition"
                aria-label="Get Plus now"
              >
                Get Plus now
              </button>
              <a
                href="#calculator"
                onClick={handleSeeSavingsClick}
                className="inline-flex items-center justify-center px-4 sm:px-5 py-2.5 rounded-lg bg-emerald-900/20 text-white/90 ring-1 ring-white/25 hover:bg-emerald-900/25 transition"
              >
                See your savings
              </a>
            </div>
          </div>

          {/* Right: perks card */}
          <div className="col-span-12 md:col-span-5">
            <div className="bg-white/90 rounded-2xl p-4 md:p-6 shadow-xl">
              <h3 className="text-gray-900 font-semibold mb-3 text-left">Exclusive access to</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {BENEFITS.slice(0, 3).map((b) => {
                  const Icon = perkIconMap[b.key] || CheckCircle2;
                  return (
                    <div key={b.key} className="rounded-xl border p-3 hover:shadow-sm transition text-left">
                      <Icon className="w-5 h-5 text-emerald-600 mb-1" />
                      <div className="font-medium text-gray-900">{b.title}</div>
                      <div className="text-xs text-gray-600">{b.desc}</div>
                    </div>
                  );
                })}
                <div className="rounded-xl border p-3 flex items-center justify-center text-emerald-700 bg-indigo-50/40">
                  <span className="text-sm font-medium">…and more member perks</span>
                </div>
              </div>
              <button
                onClick={() => openCheckoutForPlan(plan)}
                className="mt-4 w-full bg-emerald-600 text-white py-2.5 rounded-lg hover:bg-emerald-700"
              >
                Start saving today
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Benefits ---------- */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <Title sub="Simple, tangible benefits you feel on every order.">Why join Plus?</Title>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {BENEFITS.map((b) => {
            const Icon = perkIconMap[b.key] || CheckCircle2;
            return (
              <div key={b.key} className="rounded-2xl border p-4 hover:shadow-sm transition text-left bg-white">
                <Icon className="w-6 h-6 text-emerald-600 mb-2" />
                <div className="font-semibold text-gray-900">{b.title}</div>
                <p className="text-sm text-gray-600 mt-1">{b.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ---------- Calculator ---------- */}
      <section id="calculator" ref={calcRef} className="max-w-6xl mx-auto px-4 py-8">
        <Title sub="Move the slider to estimate what you could save as a Plus member.">
          Calculate your savings
        </Title>

        <div className="grid md:grid-cols-2 gap-6 items-stretch">
          {/* Left: slider & headline */}
          <div className="rounded-2xl bg-white border p-5 shadow-sm">
            <div className="text-sm text-gray-600">If your monthly medicine spend is</div>
            <div className="flex items-center gap-3 mt-2">
              <input
                type="range"
                min={5000}
                max={100000}
                step={5000}
                value={spend}
                onChange={(e) => setSpend(Number(e.target.value))}
                className="w-full accent-emerald-600"
                aria-label="Monthly spend"
                data-testid="savings-range"
              />
              <div className="min-w-[90px] text-right font-semibold text-gray-900">{currency(spend)}</div>
            </div>

            <div className="mt-6">
              <div className="text-sm text-gray-600">You could save up to</div>
              <div className="text-3xl md:text-4xl font-bold text-gray-900">{currency(savings.total)}</div>
              <div className="text-xs text-gray-500">in the next {savings.months} months*</div>
            </div>

            <div className="mt-4 text-xs text-gray-500 flex items-start gap-2">
              <Info className="w-4 h-4 mt-0.5" />
              <span>*Assuming one lab test in this period. Estimates vary by location and eligibility.</span>
            </div>
          </div>

          {/* Right: breakdown */}
          <div className="rounded-2xl bg-white border p-5 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-3">Breakdown</h4>
            <div className="divide-y">
              <Row label="5% Credits on Medicines" value={savings.medCredits} />
              <Row label="50% Credits on 1st Lab Test" value={savings.labCredit} />
              <Row label="Savings on Delivery & Fees" value={savings.shipSave} />
              <Row label={`Total ${savings.months}-Month Savings`} value={savings.total} isTotal />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Plan comparison ---------- */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <Title sub="Pick the duration that fits you best. You’ll get the same great benefits on every plan.">
          Choose your plan
        </Title>

        <div className="grid md:grid-cols-3 gap-4">
          {PLANS.map((p) => (
            <button
              key={p.id}
              onClick={() => setPlan(p.id)}
              className={`text-left rounded-2xl border p-5 bg-white hover:shadow-sm transition ${
                plan === p.id ? "border-emerald-600 ring-2 ring-emerald-100" : "border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600">{p.name}</div>
                  <div className="text-2xl font-bold text-gray-900 mt-1">{currency(p.price)}</div>
                </div>
                {p.best && (
                  <span className="text-xs px-2 py-1 rounded-full bg-indigo-50 text-emerald-700 border border-emerald-200">
                    Most popular
                  </span>
                )}
              </div>

              <div className="mt-4 space-y-2">
                <Line icon={CheckCircle2} label="All Plus benefits" />
                <Line icon={ShieldCheck} label="No hidden fees" />
                <Line icon={Sparkles} label="Member-only offers" />
              </div>

              <div className="mt-5">
                <span
                  className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium ${
                    plan === p.id ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {plan === p.id ? "Selected" : "Choose plan"}
                </span>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-6">
          <button
            onClick={() => openCheckoutForPlan(plan)}
            className="bg-emerald-600 text-white px-5 py-2.5 rounded-lg hover:bg-emerald-700"
          >
            Get Plus – {currency(currentPlan.price)}
          </button>
        </div>
      </section>

      {/* ---------- What’s included ---------- */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <Title>What’s included in Plus</Title>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card icon={Coins} title="5% Credits on Medicines" desc="Earn credits on eligible medicine orders." />
          <Card icon={FlaskConical} title="50% Credits on 1st Lab Test" desc="Added value on your first lab booking." />
          <Card icon={Truck} title="Free Delivery" desc="On eligible orders above ₦25,000." />
          <Card icon={BadgePercent} title="Zero Convenience Fees" desc="Skip extra gateway fees at checkout." />
          <Card icon={ShieldCheck} title="Priority Support" desc="Faster response from our care team." />
          <Card icon={Sparkles} title="Exclusive Offers" desc="Early access to members-only deals." />
        </div>
      </section>

      {/* ---------- Testimonials ---------- */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <Title sub="Real stories from members who save every month.">Still not sure?</Title>

        <div className="relative">
          <div className="rounded-2xl border bg-white p-5 md:p-6">
            <div className="flex items-start gap-3">
              <Star className="w-5 h-5 text-emerald-500 fill-emerald-400 mt-1" />
              <blockquote className="text-gray-800 text-left">
                <p className="leading-relaxed">“{TESTIMONIALS[tIndex].text}”</p>
                <footer className="mt-3 text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">{TESTIMONIALS[tIndex].name}</span>{" "}
                  · {TESTIMONIALS[tIndex].note}
                </footer>
              </blockquote>
            </div>
          </div>

          <div className="absolute inset-y-0 left-0 flex items-center -translate-x-1/2 sm:translate-x-0">
            <button
              aria-label="Prev"
              className="hidden sm:flex w-9 h-9 items-center justify-center rounded-full bg-white border hover:bg-gray-50 shadow"
              onClick={() => setTIndex((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center translate-x-1/2 sm:translate-x-0">
            <button
              aria-label="Next"
              className="hidden sm:flex w-9 h-9 items-center justify-center rounded-full bg-white border hover:bg-gray-50 shadow"
              onClick={() => setTIndex((i) => (i + 1) % TESTIMONIALS.length)}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* dots */}
          <div className="mt-3 flex items-center justify-center gap-1.5">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to testimonial ${i + 1}`}
                onClick={() => setTIndex(i)}
                className={`w-2.5 h-2.5 rounded-full ${i === tIndex ? "bg-emerald-600" : "bg-gray-300"}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ---------- FAQs ---------- */}
      <section className="max-w-6xl mx-auto px-4 pb-24">
        <Title>FAQs</Title>
        <div className="rounded-2xl border bg-white divide-y">
          {FAQS.map((f, i) => (
            <details key={i} className="p-4 group">
              <summary className="cursor-pointer flex items-center gap-2 font-medium text-gray-900">
                <HelpCircle className="w-4 h-4 text-emerald-600" />
                {f.q}
              </summary>
              <p className="mt-2 text-left pl-6 text-sm text-gray-700">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ---------- Sticky mobile CTA ---------- */}
      <div className="md:hidden fixed bottom-4 left-0 right-0 px-4 z-50">
        <div className="bg-white border rounded-xl shadow-lg p-3 flex items-center justify-between">
          <div className="text-sm text-left">
            <div className="font-semibold text-gray-900">Get Plus</div>
            <div className="text-gray-600">from {currency(currentPlan.price)}</div>
          </div>
          <button
            onClick={() => openCheckoutForPlan(plan)}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg"
          >
            Join now
          </button>
        </div>
      </div>

      {/* ---------- Checkout Modal ---------- */}
      {showCheckout && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
        >
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <div className="text-sm text-gray-600">Confirm membership</div>
                <div className="text-lg font-semibold text-gray-900">Plus — {currentPlan.name}</div>
              </div>
              <button
                aria-label="Close"
                onClick={() => setShowCheckout(false)}
                className="text-gray-500 hover:text-gray-700"
                data-checkout-first
              >
                ✕
              </button>
            </div>

            {/* body */}
            <div className="p-5">
              {!success ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="rounded-xl border p-3">
                        <div className="text-sm text-gray-600">Plan</div>
                        <div className="flex items-center justify-between mt-2">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{currentPlan.name}</div>
                            <div className="text-xs text-gray-500">{currentPlan.tagline}</div>
                          </div>
                          <div className="text-lg font-bold">{currency(currentPlan.price)}</div>
                        </div>
                      </div>

                      <div className="rounded-xl border p-3">
                        <div className="text-sm text-gray-600">Savings preview</div>
                        <div className="mt-2 text-sm text-gray-800">
                          Estimated {savings.months}-month savings: <strong>{currency(savings.total)}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="rounded-xl border p-3">
                        <div className="text-sm text-gray-600 mb-2">Payment method</div>
                        <div className="flex flex-col gap-2">
                          <label className="inline-flex items-center gap-2 text-sm">
                            <input
                              type="radio"
                              name="pm"
                              checked={paymentMethod === "card"}
                              onChange={() => setPaymentMethod("card")}
                            />
                            <span>Pay with Card</span>
                          </label>
                          <label className="inline-flex items-center gap-2 text-sm">
                            <input
                              type="radio"
                              name="pm"
                              checked={paymentMethod === "ussd"}
                              onChange={() => setPaymentMethod("ussd")}
                            />
                            <span>Pay with USSD / Bank transfer</span>
                          </label>
                        </div>
                      </div>

                      <div className="rounded-xl border p-3">
                        <div className="text-sm text-gray-600 mb-2">Promo code (optional)</div>
                        <div className="flex gap-2">
                          <input
                            value={promo}
                            onChange={(e) => setPromo(e.target.value)}
                            placeholder="Enter code"
                            className="flex-1 rounded-lg border px-3 py-2 text-sm"
                          />
                          <button onClick={handleApplyPromo} className="px-3 py-2 rounded-lg bg-gray-100">
                            Apply
                          </button>
                        </div>
                        {promoApplied && (
                          <div className="mt-2 text-xs text-emerald-700">Applied {promoApplied.code}</div>
                        )}
                        {error && <div className="mt-2 text-xs text-rose-600">{error}</div>}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t pt-4">
                    <div className="text-sm text-gray-700">
                      Total:{" "}
                      <strong className="text-gray-900">
                        {(() => {
                          let price = currentPlan.price;
                          if (promoApplied) {
                            if (promoApplied.discount) price = Math.round(price * (1 - promoApplied.discount));
                            if (promoApplied.discountFlat) price = Math.max(0, price - promoApplied.discountFlat);
                          }
                          return currency(price);
                        })()}
                      </strong>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowCheckout(false)}
                        className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleConfirmPayment}
                        disabled={processing}
                        className={`px-4 py-2 rounded-lg text-white ${
                          processing ? "bg-emerald-300" : "bg-emerald-600 hover:bg-emerald-700"
                        }`}
                      >
                        {processing ? "Processing..." : "Confirm & Pay"}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                /* success view */
                <div className="text-center py-6">
                  <div className="mx-auto w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mb-4 border border-emerald-100">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Payment successful</h3>
                  <p className="text-sm text-gray-700 mt-2">Your Plus membership is active.</p>

                  <div className="mt-4 rounded-xl border p-3 text-left">
                    <div className="flex items-center justify-between text-sm text-gray-700">
                      <div>Plan</div>
                      <div className="font-medium text-gray-900">{success.plan.name}</div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-700 mt-2">
                      <div>Amount paid</div>
                      <div className="font-medium text-gray-900">{currency(success.paid)}</div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-700 mt-2">
                      <div>Membership expires</div>
                      <div className="font-medium text-gray-900">
                        {new Date(success.membership.expiresAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-center gap-3">
                    <button
                      onClick={() => {
                        setShowCheckout(false);
                        // optional: navigate to dashboard route
                        // navigate("/account");
                      }}
                      className="px-4 py-2 rounded-lg bg-emerald-600 text-white"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* small debug panel: show membership on page (optional) */}
      <div className="fixed right-4 bottom-24 hidden md:block">
        <div className="rounded-lg bg-white border p-3 text-sm shadow">
          <div className="font-medium text-gray-800">Membership</div>
          {membership ? (
            <div className="text-xs text-gray-600">
              <div>Plan: {membership.planId}</div>
              <div>Expires: {new Date(membership.expiresAt).toLocaleDateString()}</div>
            </div>
          ) : (
            <div className="text-xs text-gray-500">No active membership</div>
          )}
        </div>
      </div>
    </div>
  );
}

/** Small parts */
function Row({ label, value, isTotal = false }) {
  return (
    <div className="py-2 flex items-center justify-between">
      <div className={`text-sm ${isTotal ? "font-semibold text-gray-900" : "text-gray-700"}`}>{label}</div>
      <div className={`text-sm ${isTotal ? "font-semibold text-gray-900" : "text-gray-800"}`}>{currency(value)}</div>
    </div>
  );
}

function Card({ icon: Icon, title, desc }) {
  return (
    <div className="rounded-2xl border p-4 bg-white text-left hover:shadow-sm transition">
      <Icon className="w-6 h-6 text-emerald-600 mb-2" />
      <div className="font-semibold text-gray-900">{title}</div>
      <p className="text-sm text-gray-600 mt-1">{desc}</p>
    </div>
  );
}
