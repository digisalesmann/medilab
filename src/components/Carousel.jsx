import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import { useState } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';

const slides = [
  { image: "/images/1.png", link: "#" },
  { image: "/images/blue.png", link: "#" },
  { image: "/images/plant.png", link: "#" },
  { image: "/images/tips.png", link: "#" },
  { image: "/images/life.png", link: "#" }
];

export default function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="relative w-full px-2 sm:px-4 md:px-10 py-8">
      <Swiper
        modules={[Autoplay, Navigation]}
        spaceBetween={20}
        slidesPerView={1}
        loop
        onSlideChange={(swiper) => setCurrentIndex(swiper.realIndex)}
        navigation={{
          nextEl: '.custom-next',
          prevEl: '.custom-prev'
        }}
        autoplay={{ delay: 3500 }}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 }
        }}
      >
        {slides.map((item, index) => (
          <SwiperSlide key={index}>
            <a href={item.link} className="block">
              <img
                src={item.image}
                alt={`Slide ${index + 1}`}
                className="w-full h-[220px] sm:h-[260px] md:h-[300px] object-cover rounded-2xl shadow-md hover:shadow-xl transition duration-300"
              />
            </a>
          </SwiperSlide>
        ))}

        {/* Custom Navigation Arrows */}
<div className="custom-prev absolute top-1/2 -translate-y-1/2 left-2 z-10 bg-gradient-to-br from-blue-100 via-green-100 to-blue-200 text-blue-700 hover:text-green-700 w-9 h-9 flex items-center justify-center rounded-full shadow cursor-pointer transition">
  ←
</div>
<div className="custom-next absolute top-1/2 -translate-y-1/2 right-2 z-10 bg-gradient-to-br from-blue-100 via-green-100 to-blue-200 text-blue-700 hover:text-green-700 w-9 h-9 flex items-center justify-center rounded-full shadow cursor-pointer transition">
  →
</div>
      </Swiper>

      {/* Green Progress Bar */}
      <div className="w-full h-2 bg-gray-200 rounded-full mt-6 overflow-hidden">
        <div
          className="h-full bg-green-500 transition-all duration-500"
          style={{
            width: `${((currentIndex + 1) / slides.length) * 100}%`
          }}
        />
      </div>
    </div>
  );
}