function Contact(){
    return(
        <>
         <section className="bg-black px-6 py-14 text-center text-white">
            <h1 className="text-3xl font-bold">
                Contact <span className="text-blue-500">DIRECT</span>
            </h1>
            <p className="mx-auto mt-3 max-w-md text-gray-300">
                If you have questions, feedback, or want to get in touch with the DIRECT team, please reach out to us.
            </p>
         </section>

         <section className="flex min-h-[80dvh] items-center justify-center bg-white px-6">
            <form className="w-full max-w-md">
                <div className="mb-4">
                    <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">Name</label>
                    <input type="text" id="name" name="name" className="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none" required />
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" id="email" name="email" className="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none" required />
                </div>
                <div className="mb-4">
                    <label htmlFor="message" className="mb-2 block text-sm font-medium text-gray-700">Message</label>
                    <textarea id="message" name="message" rows="4" className="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none" required></textarea>
                </div>
                <button type="submit" className="w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">Send Message</button>
            </form>
         </section>
        </>
    )
}

export default Contact;