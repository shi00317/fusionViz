// app/generate/[id]/page.tsx
'use client';
import { useEffect, useState } from 'react';

export default function GeneratePage({ params }: { params: { id: string } }) {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  useEffect(() => {
    // Retrieve the image paths from localStorage
    const original = localStorage.getItem('originalImage');
    const generated = localStorage.getItem('generatedImage');
    
    if (original) setOriginalImage(original);
    if (generated) setGeneratedImage(generated);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Generated Results</h1>
        
        <div className="grid grid-cols-2 gap-8">
          {/* Original Image */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Original Image</h2>
            {originalImage && (
              <img 
                src={originalImage} 
                alt="Original" 
                className="w-full h-auto rounded-lg"
              />
            )}
          </div>

          {/* Generated Image */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Generated Image</h2>
            {generatedImage && (
              <img 
                src={generatedImage} 
                alt="Generated" 
                className="w-full h-auto rounded-lg"
              />
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