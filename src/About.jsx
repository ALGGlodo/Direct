function About() {
  return (
    <main>
      <section className="bg-black px-6 py-14 text-center text-white">
        <h1 className="text-3xl font-bold">
          About <span className="text-blue-500">DIRECT</span>
        </h1>
        <p className="mx-auto mt-3 max-w-md text-gray-300">
          Know where you're going. Know how far it is. Know what's around you.
        </p>
      </section>

      <section className="mx-auto max-w-2xl px-6 py-10">
        <h2 className="text-xl font-bold text-blue-600">What is DIRECT?</h2>
        <p className="mt-3 text-gray-700">
          DIRECT is a simple travel companion for people heading somewhere
          unfamiliar. Enter where you're coming from and where you want to go,
          and DIRECT shows the route on a map, how far it is, and how long it
          takes on foot or by car.
        </p>

        <h2 className="mt-10 text-xl font-bold text-blue-600">Our goal</h2>
        <p className="mt-3 text-gray-700">
          Few things feel more uncertain than riding through a new place and not
          knowing if your stop is close. DIRECT was made for that moment. Our
          goal is to take the stress out of unfamiliar streets, so every
          traveler, especially first-timers, can move with confidence instead of
          worry.
        </p>
      </section>

      <section className="bg-blue-50 px-6 py-10">
        <h2 className="text-center text-xl font-bold text-blue-600">
          Helping new travelers
        </h2>

        <div className="mx-auto mt-6 grid max-w-3xl gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 shadow">
            <h3 className="font-bold text-black">See your route</h3>
            <p className="mt-2 text-sm text-gray-600">
              A clear line on the map shows the road from your starting point to
              your destination, so you always know which way you're headed.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow">
            <h3 className="font-bold text-black">Know the travel time</h3>
            <p className="mt-2 text-sm text-gray-600">
              Check the distance and the estimated time on foot or by car before
              you leave, so you can plan your day with less guessing.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow">
            <h3 className="font-bold text-black">Discover what's nearby</h3>
            <p className="mt-2 text-sm text-gray-600">
              See shops, food places, and landmarks around your destination, so
              the area feels familiar before you even arrive.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-6 py-8">
        <p className="text-center text-xs text-gray-500">
          Travel times are estimates and do not include live traffic. Map data
          comes from OpenStreetMap contributors.
        </p>
      </section>
    </main>
  )
}

export default About