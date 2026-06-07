import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from '@/components/Navbar'
import { useAuthStore } from '@/store/authStore'

// Pages
import Home from '@/pages/Home'
import Login from '@/pages/Auth/Login'
import Register from '@/pages/Auth/Register'
import EventDetail from '@/pages/Events/EventDetail'
import CreateEvent from '@/pages/Events/CreateEvent'
import MyEvents from '@/pages/Creator/MyEvents'
import MyTickets from '@/pages/Eventee/MyTickets'
import CreatorDashboard from '@/pages/Creator/Dashboard'
import NotFound from '@/pages/NotFound'

function App() {
  const { user } = useAuthStore()

  return (
    <Router>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/events/:id" element={<EventDetail />} />
          
          {user && user.role === 'creator' && (
            <>
              <Route path="/create-event" element={<CreateEvent />} />
              <Route path="/my-events" element={<MyEvents />} />
              <Route path="/dashboard" element={<CreatorDashboard />} />
            </>
          )}
          
          {user && user.role === 'eventee' && (
            <Route path="/my-tickets" element={<MyTickets />} />
          )}
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Toaster position="top-right" />
    </Router>
  )
}

export default App