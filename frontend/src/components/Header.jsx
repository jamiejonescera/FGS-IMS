import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { useNotifications } from '../hooks/useNotifications';

const Header = () => {
  const [currentDateTime, setCurrentDateTime] = useState('');
  const { notifications, loading, error } = useNotifications();
  const [isRinging, setIsRinging] = useState(false);

  // Update date and time
  const updateDateTime = () => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    };
    setCurrentDateTime(new Date().toLocaleString('en-US', options));
  };

  // Trigger ringing effect every second if there are notifications
  useEffect(() => {
    if (notifications.length > 0) {
      const interval = setInterval(() => {
        setIsRinging((prev) => !prev);
      }, 500);

      return () => clearInterval(interval); 
    }
    setIsRinging(false); 
  }, [notifications]);

  useEffect(() => {
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="border-b bg-green-800 shadow-lg font-sans tracking-wide z-50">
      <div className="flex justify-between items-center px-8 py-4 text-white max-w-screen-xl mx-auto">
        {/* System Title */}
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold leading-tight">
            Logistics Inventory Management System
          </h1>
        </div>

        <div className="flex items-center space-x-6">
          {/* Date and Time Display */}
          <div className="flex items-center text-sm font-medium">
            <p>{currentDateTime}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
