import { useState, useEffect } from 'react'
import { Search, Clock } from 'lucide-react'
import Navbar from './Navbar'
import Footer from './Footer'
import About from './About'
import { MapContainer, TileLayer, CircleMarker, Polyline, useMap } from 'react-leaflet'
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

async function getNearby(lat, lng) {
  const query = `[out:json][timeout:15];
(
  nwr(around:500,${lat},${lng})["name"]["shop"];
  nwr(around:500,${lat},${lng})["name"]["amenity"];
  nwr(around:500,${lat},${lng})["name"]["tourism"];
);
  out center 30;`

  const servers = [
    'https://overpass-api.de/api/interpreter',
    'https://overpass.kumi.systems/api/interpreter',
  ]

  for (const url of servers) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'data=' + encodeURIComponent(query),
      })
      if (!res.ok) continue
      const data = await res.json()

      return data.elements.map((el) => ({
        id: `${el.type}-${el.id}`,
        name: el.tags.name,
        type: el.tags.shop || el.tags.amenity || el.tags.tourism,
        street: el.tags['addr:street'],
        lat: el.lat ?? el.center.lat,
        lng: el.lon ?? el.center.lon,
      }))
    } catch {
      // that server failed, so the loop tries the next one
    }
  }

  throw new Error('All servers failed')
}

async function getTravelTime(start, end){
  const coords = `${start[1]},${start[0]};${end[1]},${end[0]}`
  const base = 'https://routing.openstreetmap.de'

  const walkRes = await fetch(`${base}/routed-foot/route/v1/foot/${coords}?overview=false`)
  const walk = await walkRes.json()

  const carRes = await fetch(`${base}/routed-car/route/v1/driving/${coords}?overview=false`)
  const car = await carRes.json()

  return {
    walk: { km: walk.routes[0].distance / 1000, minutes: walk.routes[0].duration / 60 },
    car: { km: car.routes[0].distance / 1000, minutes: car.routes[0].duration / 60 },
  }
}

function formatTime(minutes){
  const total = Math.round(minutes)
  if(total < 60) return `${total} min`
  const h = Math.floor(total / 60)
  const m = total % 60
  return m === 0 ? `${h} hr` : `${h} hr ${m} min`
} 

function App() {
  const [nearby, setNearby] = useState(null)
  const [times, setTimes] = useState(null)
  const [activePanel, setActivePanel] = useState(null)
  const [places, setPlaces] = useState(null)
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')  
  const [page, setPage] = useState('home')
  const [hasSearched, setHasSearched] = useState(false)
  const [position, setPosition] = useState(null)
  const [route, setRoute] = useState(null)
  const [error, setError] = useState(() =>
  navigator.geolocation ? null : 'Geolocation is not supported by your browser'
)
    useEffect(() => {
      if (!places?.end) return

      getNearby(places.end[0], places.end[1])
        .then(setNearby)
        .catch(() => setNearby([]))
    }, [places])

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

      const t = await getTravelTime(start, end)
      setTimes(t)
      
      setNearby(null)

      }
    }

    const toggle = (name) => setActivePanel(activePanel === name ? null : name)

    const goHome= () => {
      setPage('home')
      setHasSearched(false)
    }
    const goAbout = () => { setPage('about')}

    if (page === 'about') {
        return (
      <>
        <Navbar onHome={goHome} onAbout={goAbout} />
        <About />
        <Footer />
      </>
    )
    }

   if (!hasSearched) {
    return (
      <>
        <Navbar onHome={() => setHasSearched(false)} />

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

        <Footer />
      </>
    )
  }

  if (error) return <p>{error}</p>
  if (!position) return <p>Finding your location...</p>

  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar onHome={() => setHasSearched(false)} />

      <div className="relative h-[60dvh]">
        <MapContainer
          center={position}
          zoom={17}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors &copy; CARTO"
            url={`https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png?key=${import.meta.env.VITE_CARTO_KEY}`}
            maxZoom={20}
          />
          <CircleMarker center={position} radius={10} />
          {places?.start && <CircleMarker center={places.start} radius={8} pathOptions={{ color: 'green' }} />}
          {places?.end && <CircleMarker center={places.end} radius={8} pathOptions={{ color: 'red' }} />}
          {route && <Polyline positions={route.line} pathOptions={{ color: 'blue' }} />}
          <FitBounds places={places} />
        </MapContainer>

        <div className="absolute right-3 top-3 z-[1000] flex flex-col gap-2">
          <button
            onClick={() => toggle('time')}
            className={`flex h-11 w-11 items-center justify-center rounded-full border border-black shadow ${
              activePanel === 'time' ? 'bg-blue-600 text-white' : 'bg-white text-black'
            }`}
          >
            <Clock size={20} />
          </button>
          
          <button
            onClick={() => toggle('search')}
            className={`flex h-11 w-11 items-center justify-center rounded-full border border-black shadow ${
              activePanel === 'search' ? 'bg-blue-600 text-white' : 'bg-white text-black'
            }`}
          >
            <Search size={20} />
          </button>
        </div>
      </div>

      {activePanel === 'search' && (
        <section className="px-5 py-4">
          <form onSubmit={handleSearch} className="flex flex-col gap-2">
            <p className="text-xs font-bold text-blue-600">FROM:</p>
            <input
              type="text"
              placeholder="Where are you?"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <p className="mt-2 text-xs font-bold text-blue-600">TO:</p>
            <input
              type="text"
              placeholder="Where to?"
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
          </form>
        </section>
      )}

      {activePanel === 'time' && (
        <section className="px-5 py-4">
          <h2 className="text-center text-sm font-bold uppercase text-blue-500">
            Travel time
          </h2>

          {times ? (
            <div className="mt-4 flex justify-around text-center">
              <div>
                <p className="text-xs text-gray-600">Walking</p>
                <p className="font-bold">{formatTime(times.walk.minutes)}</p>
                <p className="text-xs text-gray-500">{times.walk.km.toFixed(1)} km</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Car ride</p>
                <p className="font-bold">{formatTime(times.car.minutes)}</p>
                <p className="text-xs text-gray-500">{times.car.km.toFixed(1)} km</p>
                <p className="text-[10px] text-gray-400">No live traffic</p>
              </div>
            </div>
          ) : (
             <p className="py-4 text-center text-sm text-gray-500">Loading...</p>
          )}
        </section>
        )}

      <section className="px-5 py-4">
        <h2 className="border-b border-black pb-2 text-sm font-bold uppercase">
          Nearby establishments
        </h2>
      {nearby === null ? (
        <p className="py-4 text-sm text-gray-500">Loading nearby places...</p>
      ) : nearby.length === 0 ? (
        <p className="py-4 text-sm text-gray-500">No nearby places found.</p>
      ) : (
        nearby.map((place) => (
          <div key={place.id} className="py-3">
            <p className="font-semibold text-blue-500">{place.name}</p>
            <p className="text-sm text-gray-600">{place.street ?? 'Address not listed'}</p>
            <p className="text-xs text-blue-400">{place.type}</p>
          </div>
        ))
      )}
      </section>

      <Footer />
    </div>
  )
}

export default App