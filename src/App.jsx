import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, CircleMarker } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

function App() {
  const [position, setPosition] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!navigator.geolocation) return

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude])
      },
      (err) => setError(err.message),
      { enableHighAccuracy: true }
    )

     return () => navigator.geolocation.clearWatch(watchId)
  }, [])

 if (error) return <p>{error}</p>
 if (!position) return <p>Finding your location...</p>

 return(

  

    <MapContainer
        center={position}
        zoom={15}
        style={{ height: '100dvh', width: '100%' }}
    >
         <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <CircleMarker center={position} radius={10} />
    </MapContainer>
  )
}

export default App