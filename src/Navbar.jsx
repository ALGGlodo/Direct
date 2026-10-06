function Navbar({ onHome, onAbout, onContact }) {
  return (
    <header className="bg-black text-white border-b border-gray-800">
      <nav className="flex items-center justify-between px-6 py-4">
        <h1 className="text-2xl font-bold text-blue-500">DIRECT</h1>
        <ul className="flex gap-5 text-sm">
          <li><button onClick={onHome} className="hover:text-blue-400">Home</button></li>
          <li><button onClick={onAbout} className="hover:text-blue-400">About</button></li>
          <li><button onClick={onContact} className="hover:text-blue-400">Contact</button></li>
        </ul>
      </nav>
    </header>
  )
}

export default Navbar