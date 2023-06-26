'use client';

import { useState } from 'react';

export default function Home() {
  const [generatedImage, setGeneratedImage] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');

  async function generateImage() {
    if (!prompt.length) {
      return;
    }

    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    const { data } = await response.json();
    console.info(data);

    if (data.error) {
      window.alert(`Error: ${data.error} ${data.message}`);
      return;
    }

    // API returns an array of images
    // Since we only generate 1 image, then get the URI of the first image
    const uri = data.images[0].uri;
    setGeneratedImage(uri);
  }

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
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          <button
            className='text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 rounded-r-lg py-3 px-4 ml-1 font-semibold'
            onClick={generateImage}
          >
            Generate
          </button>
        </div>
      </section>

      {/* Image */}
      <section className='w-full mt-8'>
        {!generatedImage ? (
          <div className='flex items-center justify-center border-4 border-dashed border-gray-500 rounded-md w-full p-10'>
            <div className='text-md text-gray-600'>
              Image will be generated here
            </div>
          </div>
        ) : (
          <div className='flex items-center justify-center'>
            <img
              src={generatedImage}
              alt='Generated image'
              className='w-full rounded-lg hover:scale-105 duration-300'
            />
          </div>
        )}
      </section>
    </main>
  );
}
