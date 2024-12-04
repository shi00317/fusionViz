// app/generate/[id]/page.tsx
'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image'; // Using Next.js Image component for better handling

export default function GeneratePage({ params }: { params: { id: string } }) {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Retrieve the image paths from localStorage
      const original = localStorage.getItem('originalImage');
      const generated = localStorage.getItem('generatedImage');
      
      console.log('Original image path:', original); // Debugging
      console.log('Generated image path:', generated); // Debugging
      
      if (original) setOriginalImage(original);
      if (generated) setGeneratedImage(generated);
      
      if (!original || !generated) {
        setError('Image paths not found in localStorage');
      }
    } catch (err) {
      console.error('Error loading images:', err);
      setError('Failed to load images');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Generated Results</h1>
        
        {error && (
          <div className="text-red-500 text-center mb-4">
            Error: {error}
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-8">
          {/* Original Image */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Original Image</h2>
            {originalImage ? (
              <div className="relative w-full aspect-square">
                <img 
                  src={originalImage}
                  alt="Original" 
                  className="w-full h-auto rounded-lg"
                  onError={(e) => {
                    console.error('Error loading original image');
                    e.currentTarget.src = '/placeholder.png'; // Add a placeholder image
                  }}
                />
              </div>
            ) : (
              <div className="text-center text-gray-500">No original image available</div>
            )}
          </div>

          {/* Generated Image */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Generated Image</h2>
            {generatedImage ? (
              <div className="relative w-full aspect-square">
                <img 
                  src={generatedImage}
                  alt="Generated" 
                  className="w-full h-auto rounded-lg"
                  onError={(e) => {
                    console.error('Error loading generated image');
                    e.currentTarget.src = '/placeholder.png'; // Add a placeholder image
                  }}
                />
              </div>
            ) : (
              <div className="text-center text-gray-500">No generated image available</div>
            )}
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <button 
            onClick={() => window.history.back()}
            className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700"
          >
            Back to Editor
          </button>
        </div>
      </div>
    </div>
  );
}