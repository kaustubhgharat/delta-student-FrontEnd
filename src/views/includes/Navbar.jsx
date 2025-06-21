import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCompass } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // ✅ Add this

  const navigate = useNavigate();
  const URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${URL}/check-auth`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setIsLoggedIn(true);
          setCurrentUser(data.user); // or whatever field you return
        } else {
          setIsLoggedIn(false);
        }
      } catch (err) {
        console.error("Auth check failed", err);
      }
    };

    checkAuth();
  }, []);


  const handleLogout = async () => {
    try {
      const res = await fetch(`${URL}/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      if (res.ok) {
        alert("Logged out!");
        setIsLoggedIn(false);
        navigate('/login');
      } else {
        const data = await res.json();
        alert("Logout failed: " + data.error);
      }
    } catch (err) {
      console.error("Logout failed", err);
      alert("Something went wrong during logout.");
    }
  };

  return (
    <nav className="fixed top-0 w-full bg-white border-b z-50">
      <div className="max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 items-center">
          <div className="flex items-center space-x-8">
            <FontAwesomeIcon icon={faCompass} className="text-red-500 h-6 w-6" />
            <h2 className='text-xl'>Wanderlust</h2>
            <a href="/listings" className="hover:text-red-500">Explore</a>
            <a href="/listings/new" className="hover:text-red-500">Add New Listing</a>
          </div>

          <div className="hidden md:flex space-x-4 items-center">


            {!isLoggedIn && (
              <>
                <button onClick={() => navigate('/login')} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Login
                </button>
                <button onClick={() => navigate('/signup')} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                  Signup
                </button>
              </>
            )}

            {isLoggedIn && (
              <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                Logout
              </button>
            )}
          </div>

          {/* Hamburger for mobile */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)}>
              <svg className="h-6 w-6" fill="none" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-white px-4 pt-2 pb-4 space-y-2">
            <a href="/listings" className="block">Home</a>
            <a href="/listings" className="block">All Listings</a>
            <a href="/listings/new" className="block">Add New Listing</a>

            {!isLoggedIn && (
              <>
                <button onClick={() => navigate('/login')} className="block w-full text-left bg-blue-600 text-white px-4 py-2 rounded">
                  Login
                </button>
                <button onClick={() => navigate('/signup')} className="block w-full text-left bg-green-600 text-white px-4 py-2 rounded">
                  Signup
                </button>
              </>
            )}

            {isLoggedIn && (
              <button onClick={handleLogout} className="block w-full text-left bg-red-600 text-white px-4 py-2 rounded">
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
