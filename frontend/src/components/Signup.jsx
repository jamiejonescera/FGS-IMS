import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import backgroundImage from "../assets/fdg-background.jpg";
import logo from "../assets/logo.png";
import { supabase } from "../config/supabaseClient";
import toast from "react-hot-toast";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            role: 'user' // Default role for new signups
          }
        }
      });

      if (error) throw error;

      toast.success("Signup successful! Please check your email for verification.");
      navigate("/login");
    } catch (error) {
      toast.error(error.message || "An error occurred during signup");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Full-screen background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${backgroundImage})`,
          filter: 'brightness(0.7)'
        }}
      />
      
      {/* Content overlay */}
      <div className="relative z-10 flex min-h-screen items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="bg-white/90 p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-md backdrop-blur-sm">
          <div className="text-center mb-6">
            <img src={logo} alt="School Logo" className="mx-auto w-16 sm:w-20" />
            <h2 className="text-xl font-bold mt-2">Flor de Grace School, Inc</h2>
            <p className="text-gray-600">INVENTORY MANAGEMENT SYSTEM</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">First Name</label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Last Name</label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Email</label>
              <input
                type="email"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Password</label>
              <input
                type="password"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Confirm Password</label>
              <input
                type="password"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition mt-6"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <div className="text-center mt-4">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-500 hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;