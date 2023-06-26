export default function Home() {
  return (
    <main className='flex flex-col max-w-xl mx-auto items-center justify-center bg-black mt-10'>
      <h1 className='text-white text-3xl font-bold mb-8'>
        Generate your AI Image
      </h1>

      {/* Prompt */}
      <section className='w-full'>
        <div className='flex items-center'>
          <input
            type='text'
            id='prompt'
            name='prompt'
            placeholder='Enter your prompt here'
            className='rounded-l-lg py-3 px-4 w-full text-gray-800 focus:outline-none'
          />

          <button className='text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 rounded-r-lg py-3 px-4 ml-1 font-semibold'>
            Generate
          </button>
        </div>
      </section>

      {/* Image */}
      <section className='w-full mt-8'>
        <div className='flex items-center justify-center border-4 border-dashed border-gray-500 rounded-md w-full p-10'>
          <div className='text-md text-gray-600'></div>
        </div>
      </section>
    </main>
  );
}