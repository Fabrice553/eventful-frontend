import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { FiMenu, FiX, FiLogOut } from 'react-icons/fi'

export default function Navbar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-purple-600">
            Eventful
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              Explore
            </Link>

            {!user ? (
              <>
                <Link to="/login" className="text-gray-600 hover:text-gray-900">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                {user.role === 'creator' && (
                  <>
                    <Link to="/create-event" className="text-gray-600 hover:text-gray-900">
                      Create Event
                    </Link>
                    <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">
                      Dashboard
                    </Link>
                  </>
                )}
                {user.role === 'eventee' && (
                  <Link to="/my-tickets" className="text-gray-600 hover:text-gray-900">
                    My Tickets
                  </Link>
                )}
                <span className="text-gray-600">{user.firstName}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-red-600 hover:text-red-700"
                >
                  <FiLogOut />
                  <span>Logout</span>
                </button>
              </>
            )}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-600"
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4">
            <Link to="/" className="block text-gray-600 py-2">
              Explore
            </Link>
            {!user ? (
              <>
                <Link to="/login" className="block text-gray-600 py-2">
                  Login
                </Link>
                <Link to="/register" className="block text-gray-600 py-2">
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <button
                  onClick={handleLogout}
                  className="block text-red-600 py-2 w-full text-left"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}