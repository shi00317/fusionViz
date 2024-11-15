// app/generate/[id]/page.tsx
'use client'

import React from 'react';

export default function ResultPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Generated Result</h1>
          <button 
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-purple-600 text-white rounded-md"
          >
            Back to Editor
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          {/* 原图 */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-medium mb-4">Original Image</h2>
            <div className="aspect-square bg-gray-100 rounded-md"></div>
          </div>
          
          {/* 生成图 */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-medium mb-4">Generated Image</h2>
            <div className="aspect-square bg-gray-100 rounded-md"></div>
          </div>
        </div>

        {/* 参数信息 */}
        <div className="mt-6 bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">Generation Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium">Parameters</h3>
              <ul className="mt-2 space-y-2">
                <li>Denoising Steps: 30</li>
                <li>Guidance Rate: 0.7</li>
                <li>Style: Photorealistic</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium">Modified Features</h3>
              <ul className="mt-2 space-y-2">
                <li>Color Tone: Warmer</li>
                <li>Lighting: Brighter</li>
                <li>Texture: Smoother</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="mt-6 flex gap-4">
          <button className="px-4 py-2 bg-purple-600 text-white rounded-md">
            Download Result
          </button>
          <button className="px-4 py-2 border border-purple-600 text-purple-600 rounded-md">
            Generate New Version
          </button>
        </div>
      </div>
    </div>
  );
}