import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { useNotifications } from '../hooks/useNotifications';

const Header = () => {
  const [currentDateTime, setCurrentDateTime] = useState('');
  const { notifications, loading, error } = useNotifications();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
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

  // Toggle notification dropdown
  const toggleNotificationDropdown = () => {
    setIsNotificationOpen((prev) => !prev);
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

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={toggleNotificationDropdown}
              className={`focus:outline-none text-white ${
                isRinging ? 'animate-ring' : ''
              }`}
            >
              <FontAwesomeIcon icon={faBell} className="h-8 w-8" />
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-xs rounded-full text-white w-5 h-5 flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {isNotificationOpen && (
              <div className="absolute right-0 mt-2 bg-gray-800 rounded-md shadow-lg w-72 z-50">
                <div className="p-4 border-b text-white font-semibold">
                  Notifications
                </div>
                {loading ? (
                  <p className="p-3 text-white text-center">Loading...</p>
                ) : (
                  <ul className="max-h-48 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification, index) => (
                        <li
                          key={index}
                          className="p-3 hover:bg-gray-700 border-b last:border-b-0 text-white"
                        >
                          <strong>{notification.product_name}</strong>: {notification.status}{' '}
                          (Quantity: {notification.quantity})
                        </li>
                      ))
                    ) : (
                      <li className="p-3 text-white text-center">No notifications</li>
                    )}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
