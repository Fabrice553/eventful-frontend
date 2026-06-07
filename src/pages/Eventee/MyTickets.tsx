import { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import QRCode from 'qrcode.react'

export default function MyTickets() {
  const [tickets, setTickets] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTicket, setSelectedTicket] = useState(null)

  useEffect(() => {
    fetchTickets()
  }, [])

  const fetchTickets = async () => {
    try {
      const { data } = await axios.get('/api/tickets/my-tickets', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      setTickets(data.data)
    } catch (error: any) {
      toast.error('Failed to fetch tickets')
    } finally {
      setIsLoading(false)
    }
  }

  const downloadQR = (ticket: any) => {
    const qrElement = document.getElementById(`qr-${ticket._id}`)
    if (!qrElement) return

    const canvas = (qrElement as any).querySelector('canvas')
    const link = document.createElement('a')
    link.href = canvas.toDataURL()
    link.download = `ticket-${ticket.ticketNumber}.png`
    link.click()
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <p className="text-center text-gray-600">Loading tickets...</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">My Tickets</h1>

      {tickets.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">You haven't purchased any tickets yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tickets.map((ticket: any) => (
            <div key={ticket._id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg mb-1">
                    {ticket.eventId?.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Ticket #{ticket.ticketNumber}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded text-sm font-bold ${
                    ticket.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {ticket.status.toUpperCase()}
                </span>
              </div>

              <div className="mb-6 p-4 bg-gray-50 rounded flex justify-center">
                <div id={`qr-${ticket._id}`}>
                  <QRCode
                    value={ticket.qrCode}
                    size={256}
                    level="H"
                    includeMargin={true}
                  />
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600 mb-6">
                <p>
                  <strong>Date:</strong>{' '}
                  {new Date(ticket.purchaseDate).toLocaleDateString()}
                </p>
                <p>
                  <strong>Price:</strong> ₦{ticket.price.toLocaleString()}
                </p>
                {ticket.isScanned && (
                  <p className="text-green-600">
                    <strong>✓ Scanned at entry</strong>
                  </p>
                )}
              </div>

              <button
                onClick={() => downloadQR(ticket)}
                className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
              >
                Download QR Code
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}