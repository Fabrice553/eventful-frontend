import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useEventStore } from '@/store/eventStore'
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function MyEvents() {
  const { events, getMyEvents, isLoading, deleteEvent } = useEventStore()

  useEffect(() => {
    getMyEvents()
  }, [])

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return

    try {
      await deleteEvent(id)
      toast.success('Event deleted successfully')
      getMyEvents()
    } catch (error: any) {
      toast.error(error)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Events</h1>
        <Link
          to="/create-event"
          className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
        >
          <FiPlus />
          <span>Create Event</span>
        </Link>
      </div>

      {isLoading ? (
        <p className="text-center text-gray-600">Loading events...</p>
      ) : events.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">You haven't created any events yet</p>
          <Link
            to="/create-event"
            className="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
          >
            Create Your First Event
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event) => (
            <div key={event._id} className="bg-white rounded-lg shadow p-6">
              <h3 className="font-bold text-lg mb-2">{event.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {event.description}
              </p>

              <div className="space-y-2 text-sm text-gray-600 mb-6">
                <p>
                  <strong>Location:</strong> {event.location}
                </p>
                <p>
                  <strong>Date:</strong> {new Date(event.startDate).toLocaleDateString()}
                </p>
                <p>
                  <strong>Price:</strong> ₦{event.ticketPrice.toLocaleString()}
                </p>
              </div>

              <div className="flex space-x-4">
                <Link
                  to={`/events/${event._id}`}
                  className="flex-1 flex items-center justify-center space-x-2 bg-blue-50 text-blue-600 py-2 rounded hover:bg-blue-100"
                >
                  <span>View</span>
                </Link>
                <button
                  onClick={() => handleDelete(event._id)}
                  className="flex-1 flex items-center justify-center space-x-2 bg-red-50 text-red-600 py-2 rounded hover:bg-red-100"
                >
                  <FiTrash2 size={16} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}