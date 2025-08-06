import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App'; // Use your new auth system
import toast from 'react-hot-toast';
import { useState } from 'react';

const Logout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth(); // Get logout from your auth context
  const [isLoading, setIsLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      setIsTransitioning(true);
      
      console.log('🔍 Logout button clicked - starting logout process...');
      
      // Clear any localStorage data (if you have any)
      localStorage.removeItem("session");
      localStorage.removeItem("profile");
      
      // Call your Flask logout endpoint via auth context
      await logout();
      
      console.log('✅ Logout completed successfully');
      toast.success("Logged out successfully");
      
      // Add a small delay for smooth transition
      setTimeout(() => {
        console.log('🔍 Redirecting to login...');
        // Navigate to login (don't force reload)
        navigate('/login', { replace: true });
      }, 500);
      
    } catch (error) {
      console.error('❌ Logout error:', error);
      toast.error(error.message || "Error logging out");
      setIsLoading(false);
      setIsTransitioning(false);
    }
  };

  return (
    <>
      {/* Loading Overlay */}
      {(isLoading || isTransitioning) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mb-4"></div>
            <p className="text-gray-700 font-medium">
              {isLoading ? "Logging out..." : "Redirecting..."}
            </p>
          </div>
        </div>
      )}
      
      <li>
        <button 
          onClick={handleLogout}
          disabled={isLoading}
          className={`text-white hover:bg-green-800 text-[15px] flex items-center rounded px-4 py-3 transition-all cursor-pointer w-full ${
            isLoading ? 'opacity-75 cursor-not-allowed' : ''
          }`}
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
          <span>{isLoading ? "Logging out..." : "Logout"}</span>
        </button>
      </li>
    </>
  );
};

export default Logout;