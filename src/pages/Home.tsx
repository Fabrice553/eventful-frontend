import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useEventStore } from '@/store/eventStore'
import { FiCalendar, FiMapPin, FiUser } from 'react-icons/fi'
import { formatDistanceToNow } from 'date-fns'

export default function Home() {
  const { events, getEvents, isLoading } = useEventStore()

  useEffect(() => {
    getEvents(1, { isActive: true })
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to Eventful</h1>
        <p className="text-gray-600 text-lg">
          Discover and attend amazing events near you
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading events...</p>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No events available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Link
              key={event._id}
              to={`/events/${event._id}`}
              className="bg-white rounded-lg shadow hover:shadow-lg transition"
            >
              {event.image && (
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              )}
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{event.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {event.description}
                </p>
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center">
                    <FiCalendar className="mr-2" />
                    {formatDistanceToNow(new Date(event.startDate), { addSuffix: true })}
                  </div>
                  <div className="flex items-center">
                    <FiMapPin className="mr-2" />
                    {event.location}
                  </div>
                  <div className="flex items-center">
                    <FiUser className="mr-2" />
                    {event.creator?.firstName} {event.creator?.lastName}
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <p className="font-bold text-purple-600">
                    ₦{event.ticketPrice.toLocaleString()}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}