import React from 'react';
import { ArrowRight, Plus } from 'lucide-react';
import './PlusMembershipBanner.css';

const PlusMembershipBanner = () => {
  return (
    <div className="relative mt-12 overflow-hidden rounded-xl p-6 md:p-10 m-4 shadow-md bg-gradient-to-br from-blue-100 via-green-100 to-blue-200 animate-fade-float flex flex-col md:flex-row items-start md:items-center justify-between min-h-[200px] gap-6">
  {/* Left Section */}
  <div className="flex-1 flex flex-col items-start justify-center">
    <h2 className="text-xl md:text-4xl font-bold text-gray-800 mb-2 flex items-center gap-2">
      Become a
      <span className="inline-flex items-center text-yellow-500">
        <Plus size={28} className="bg-yellow-400 rounded-full text-white mr-1" />
        <span className="ml-1">Plus</span>
      </span>
      member
    </h2>
    <p className="text-base md:text-lg text-gray-600 mb-4">And enjoy extra bachat on every order</p>
    <div className="h-1 w-32 md:w-40 bg-gradient-to-r from-yellow-400 to-transparent rounded-full mb-6"></div>
  </div>
  {/* Right Section */}
  <div className="flex-1 flex flex-col items-start md:items-end justify-center md:pl-10 w-full">
    <p className="text-gray-800 text-sm md:text-lg font-medium mb-4 md:mb-4 text-left md:text-right">
      Save 5% on medicines, 50% on 1st lab test &amp; get FREE delivery with PLUS membership&nbsp;
      <a href="/plus-membership-info" className="text-yellow-500 hover:text-yellow-600 transition-colors">Know more</a>
    </p>
    <a
      href="/plus-membership"
      className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-6 py-2 rounded-full inline-flex items-center gap-2 transition group-hover:scale-105 w-full md:w-auto justify-center"
    >
      Explore Now <ArrowRight size={18} />
    </a>
  </div>
</div>
  );
};

export default PlusMembershipBanner;