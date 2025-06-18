// components/Logo.js
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaHeartbeat } from 'react-icons/fa';

const Logo = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoClick = () => {
    if (location.pathname === '/') {
      window.location.reload();
    } else {
      navigate('/');
    }
  };

  return (
    <div className="flex-shrink-0 cursor-pointer" onClick={handleLogoClick}>
      <div className="flex items-center gap-2">
        <FaHeartbeat className="text-emerald-600 text-2xl" />
        <span className="text-3xl font-bold text-emerald-600 select-none">MediLab</span>
      </div>
    </div>
  );
};

export default Logo;
