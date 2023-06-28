'use client';

import { useState, useEffect } from 'react';
import { ColorRing } from 'react-loader-spinner';

type Inference = {
  id: string;
  prompt: string;
  images: Array<{
    id: string;
    uri: string;
  }>;
};

export default function Home() {
  const [inferences, setInferences] = useState<Array<Inference>>([]);
  const [generatedImage, setGeneratedImage] = useState<string>('');
  const [activeTooltip, setActiveTooltip] = useState<number>(-1);
  const [loading, setLoading] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>('');

  async function generateImage() {
    if (!prompt.length) {
      return;
    }

    setLoading(true);

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
      setLoading(false);
      return;
    }

    // API returns an array of images
    // Since we only generate 1 image, then get the URI of the first image
    const uri = data.images[0].uri;
    setGeneratedImage(uri);
    fetchImages();
    setLoading(false);
  }

  async function fetchImages() {
    const response = await fetch('/api/showcase', { method: 'GET' });
    const { data } = await response.json();

    if (data.error) {
      window.alert(`Error: ${data.error} ${data.message}`);
      return;
    }

    setInferences(data);
    console.info(data);
  }

  useEffect(() => {
    fetchImages();
  }, []);

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
            disabled={loading}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          <button
            className='text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 rounded-r-lg py-3 px-4 ml-1 font-semibold'
            onClick={generateImage}
            disabled={loading}
          >
            Generate
          </button>
        </div>
      </section>

      {/* Image */}
      <section className='w-full mt-8'>
        {loading ? (
          <div className='flex items-center justify-center border-2 border-dashed border-gray-500 rounded-md w-full p-10'>
            <div className='flex flex-col'>
              <ColorRing
                visible={true}
                height='80'
                width='80'
                ariaLabel='blocks-loading'
                wrapperClass='blocks-wrapper'
                wrapperStyle={{}}
                colors={['#b8c480', '#b2a3b5', '#f4442e', '#51e5ff', '#429ea6']}
              />
              <div className='mt-2 text-md font-semibold text-gray-300'>
                Generating...
              </div>
            </div>
          </div>
        ) : null}

        {!loading && !generatedImage ? (
          <div className='flex items-center justify-center border-4 border-dashed border-gray-500 rounded-md w-full p-10'>
            <div className='text-md text-gray-600'>
              Image will be generated here
            </div>
          </div>
        ) : null}

        {!loading && generatedImage ? (
          <div className='flex items-center justify-center'>
            <img
              src={generatedImage}
              alt='Generated image'
              className='w-full rounded-lg hover:scale-105 duration-300'
            />
          </div>
        ) : null}
      </section>

      {/* Showcase */}
      <section className='mt-16 max-w-full'>
        <h1 className='text-xl font-semibold mb-5'>Community Showcase</h1>

        <div className='grid grid-cols-2 gap-4 mt-4'>
          {inferences.length ? (
            inferences
              .slice(0)
              .reverse()
              .map(({ id, images, prompt }, index) => {
                return (
                  <div
                    key={id}
                    className='relative'
                    onMouseLeave={() => setActiveTooltip(-1)}
                    onMouseEnter={() => setActiveTooltip(index)}
                  >
                    <img
                      alt={id}
                      src={images[0].uri}
                      className='object-cover w-full h-full rounded-md'
                    />

                    {activeTooltip === index ? (
                      <div className='p-2 w-full absolute bottom-0 left-0 backdrop-blur-sm bg-black/60 text-white text-sm rounded-t-md z-10'>
                        {prompt}
                      </div>
                    ) : null}
                  </div>
                );
              })
          ) : (
            <div className='flex items-center justify-center text-md font-semibold text-gray-300'>
              No images generated for this model yet.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
