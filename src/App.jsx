import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, CircleMarker, Polyline, useMap } from 'react-leaflet'
import { Search } from 'lucide-react';
import 'leaflet/dist/leaflet.css'

async function geocode(text){
   const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=ph&q=${encodeURIComponent(text)}`
   const response = await fetch(url)
   const data = await response.json()
   if (data.length === 0) return null
   return [parseFloat(data[0].lat), parseFloat(data[0].lon)]
}

function FitBounds({places}){
  const map = useMap()

  useEffect(() => {
    if(places?.start && places?.end){
      map.fitBounds([places.start, places.end], {padding: [40, 40]})
    }
  }, [places, map])
  return null
}

async function getCurrentRoute(start, end){
    const url = `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`
    const res = await fetch(url)
    const data = await res.json()
    const route = data.routes[0]

  return{
    line: route.geometry.coordinates.map(([lng, lat]) => [lat, lng]),
    km: route.distance / 1000,
    minutes: route.duration / 60,
  }
}

function App() {
  const [places, setPlaces] = useState(null)
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')  
  const [hasSearched, setHasSearched] = useState(false)
  const [position, setPosition] = useState(null)
  const [route, setRoute] = useState(null)
  const [error, setError] = useState(() =>
  navigator.geolocation ? null : 'Geolocation is not supported by your browser'
)

  useEffect(() => {
    if (!hasSearched || !navigator.geolocation) return

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude])
      },
      (err) => setError(err.message),
      { enableHighAccuracy: true }
    )

    return () => navigator.geolocation.clearWatch(watchId)
  }, [hasSearched])

    const handleSearch = async (e) => {
      e.preventDefault()
      if (!from.trim() || !to.trim()) return
      setHasSearched(true)

      const start = await geocode(from)
      const end = await geocode(to)
      setPlaces({ start, end })
      console.log(start, end)

      if(start && end){
        const r = await getCurrentRoute(start, end)
        setRoute(r)
      }
    }

    if(!hasSearched) {
       return (
        <>
        <header className="bg-black text-white">
          <nav className="flex items-center justify-between px-6 py-4">
             <h1 className="text-2xl font-bold text-blue-500">DIRECT</h1>
             <ul className="flex gap-5 text-sm">
                <li><a href="#" className="hover:text-blue-400">Home</a></li>
                <li><a href="#" className="hover:text-blue-400">About</a></li>
                <li><a href="#" className="hover:text-blue-400">Contact</a></li>
             </ul>
          </nav>
        </header>

        <section className="flex min-h-[80dvh] items-center justify-center bg-white px-6">
          <form onSubmit={handleSearch} className="w-full max-w-md">
           <p className="mb-4 text-center text-lg font-semibold text-black">
            Search your go to city, town, or street
          </p>

          <div className="flex flex-col gap-2 rounded-2xl border border-blue-100 p-5 shadow-lg">
            <p className="text-xs font-bold text-blue-600">FROM:</p>
            <input
              type="text"
              placeholder="Search for a location..."
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <p className="mt-2 text-xs font-bold text-blue-600">TO:</p>
            <input
              type="text"
              placeholder="Search for a location..."
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
            >
              <Search size={20} />
              Search
            </button>
          </div>
          </form>
        </section>
    </>
    )
  }

 if (error) return <p>{error}</p>
 if (!position) return <p>Finding your location...</p>
 

 return (
      <MapContainer
        center={position}
        zoom={17}
        style={{ height: '100dvh', width: '100%' }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <CircleMarker center={position} radius={10} />
          {places?.start && <CircleMarker center={places.start} radius={8} pathOptions={{ color: 'green' }} />}
          {places?.end && <CircleMarker center={places.end} radius={8} pathOptions={{ color: 'red' }} />}
          {route && <Polyline positions={route.line} pathOptions={{ color: 'blue' }} />}
          <FitBounds places={places} />
          
      </MapContainer>
  )
}

export default App