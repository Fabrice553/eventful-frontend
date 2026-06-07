import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useEventStore } from '@/store/eventStore'
import { useAuthStore } from '@/store/authStore'
import { FiCalendar, FiMapPin, FiShare2 } from 'react-icons/fi'
import axios from 'axios'
import toast from 'react-hot-toast'
import { formatDistanceToNow } from 'date-fns'

export default function EventDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { event, getEventById, isLoading } = useEventStore()
  const { user } = useAuthStore()
  const [isPaymentLoading, setIsPaymentLoading] = useState(false)

  useEffect(() => {
    if (id) getEventById(id)
  }, [id])

  const handleBuyTicket = async () => {
    if (!user) {
      navigate('/login')
      return
    }

    if (user.role !== 'eventee') {
      toast.error('Only eventees can buy tickets')
      return
    }

    setIsPaymentLoading(true)
    try {
      const { data } = await axios.post(
        '/api/payments/initialize',
        {
          eventId: id,
          amount: event?.ticketPrice,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      )

      // Redirect to Paystack
      window.location.href = data.data.authorizationUrl
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Payment failed')
    } finally {
      setIsPaymentLoading(false)
    }
  }

  const handleShare = () => {
    const shareLinks = {
      twitter: `https://twitter.com/intent/tweet?text=Check%20out%20${event?.title}%20on%20Eventful&url=${window.location.href}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(event?.title + ' ' + window.location.href)}`,
    }

    const shareUrl = shareLinks.twitter
    window.open(shareUrl, '_blank', 'width=600,height=400')
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <p className="text-center text-gray-600">Loading event...</p>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <p className="text-center text-gray-600">Event not found</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {event.image && (
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-96 object-cover rounded-lg mb-6"
            />
          )}

          <h1 className="text-4xl font-bold mb-4">{event.title}</h1>

          <div className="space-y-4 mb-6 text-gray-600">
            <div className="flex items-center space-x-3">
              <FiCalendar />
              <span>
                {new Date(event.startDate).toLocaleDateString()} at{' '}
                {new Date(event.startDate).toLocaleTimeString()}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <FiMapPin />
              <span>{event.location}</span>
            </div>
          </div>

          <div className="prose max-w-none mb-8">
            <h2 className="text-2xl font-bold mb-4">About this event</h2>
            <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
          </div>

          {event.creator && (
            <div className="bg-gray-100 p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-2">Organized by</h3>
              <p>
                {event.creator.firstName} {event.creator.lastName}
              </p>
              <p className="text-gray-600">{event.creator.email}</p>
            </div>
          )}
        </div>

        <div>
          <div className="bg-white rounded-lg shadow p-6 sticky top-20">
            <p className="text-3xl font-bold text-purple-600 mb-4">
              ₦{event.ticketPrice.toLocaleString()}
            </p>

            <button
              onClick={handleBuyTicket}
              disabled={isPaymentLoading}
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 disabled:bg-purple-400 font-bold mb-4"
            >
              {isPaymentLoading ? 'Processing...' : 'Buy Ticket'}
            </button>

            <button
              onClick={handleShare}
              className="w-full border border-purple-600 text-purple-600 py-3 rounded-lg hover:bg-purple-50 flex items-center justify-center space-x-2"
            >
              <FiShare2 />
              <span>Share Event</span>
            </button>

            <div className="mt-6 space-y-4 text-sm">
              <div>
                <p className="text-gray-600">Category</p>
                <p className="font-bold">{event.category}</p>
              </div>
              <div>
                <p className="text-gray-600">Capacity</p>
                <p className="font-bold">{event.capacity} seats</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}