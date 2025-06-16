import { FaQuoteLeft } from "react-icons/fa";

const testimonials = [
  {
    name: "Niti Rohan",
    date: "December 11, 2024",
    text: `I ordered my dad’s heart medication through the app late in the evening and to my surprise, it was delivered the next morning. The process was really smooth, and I even got a good discount. Making repeat orders is even more convenient.`,
  },
  {
    name: "Yogesh Shukla",
    date: "January 10, 2025",
    text: `I had mistakenly ordered the wrong strip of tablets and thought I’d have to go through a lot of hassle to return it, but the customer support made it super easy. They arranged a return pickup and my refund was processed in just 2 days.`,
  },
  {
    name: "Anuj Kumar",
    date: "March 12, 2025",
    text: `MediLab is the best application for ordering medicines and lab tests. I have been using it for the last 5 years. The customer support is also good.`,
  },
  {
    name: "Meha Sharma",
    date: "April 3, 2025",
    text: `Excellent service, genuine products, and great discounts. My orders always reach on time. Highly recommended!`,
  },
  {
    name: "Chinedu Okafor",
    date: "May 20, 2025",
    text: `I love the seamless experience and the prompt delivery. The app is user-friendly and the discounts are a bonus!`,
  },
  {
    name: "Aisha Bello",
    date: "June 2, 2025",
    text: `Customer support is responsive and helpful. I got my lab results quickly and the process was hassle-free.`,
  },
];

export default function Testimonials() {
  return (
    <section className="w-full max-w-7xl mx-auto px-2 sm:px-6 md:px-12 py-8">
      <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-8 text-left">
        What Our Customers have to Say
      </h2>
      <div className="flex gap-3 sm:gap-6 overflow-x-auto scrollbar-hide pb-2 scroll-smooth">
        {testimonials.map((t, idx) => (
          <div
            key={idx}
            className="flex-shrink-0 bg-green-50 border border-green-100 rounded-xl p-3 sm:p-5 min-h-[120px] w-[220px] sm:w-[320px] md:w-[360px] flex flex-col text-left"
          >
            <div className="mb-1 sm:mb-2">
              <span className="font-semibold text-gray-800 text-sm sm:text-base">{t.name}</span>
              <div className="text-gray-500 text-xs sm:text-sm">{t.date}</div>
            </div>
            <FaQuoteLeft className="text-green-200 text-lg sm:text-2xl mb-1 sm:mb-2" />
            <p className="text-gray-700 text-xs sm:text-base">{t.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}