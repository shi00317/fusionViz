'use client'
import React, { useState } from 'react';

const VisualBlendAI = () => {
  // 状态管理
  const [extractedFeatures, setExtractedFeatures] = useState([
    { id: 1, name: 'Color Tone', enabled: true, modification: '' },
    { id: 2, name: 'Texture', enabled: true, modification: '' },
    { id: 3, name: 'Lighting', enabled: true, modification: '' },
  ]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [blendDescription, setBlendDescription] = useState('');
  const [denoisingSteps, setDenoisingSteps] = useState(25);
  const [guidanceRate, setGuidanceRate] = useState(7.5);
  const [isLoading, setIsLoading] = useState(false); // Loading state

  // 处理函数
  const handleFeatureToggle = (id: number) => {
    setExtractedFeatures(features =>
      features.map(feature =>
        feature.id === id ? { ...feature, enabled: !feature.enabled } : feature
      )
    );
  };

  const handleModificationChange = (id: number, value: string) => {
    setExtractedFeatures(features =>
      features.map(feature =>
        feature.id === id ? { ...feature, modification: value } : feature
      )
    );
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedImage(URL.createObjectURL(file));
    }
  };

  const handleExtractFeatures = async () => {
    if (uploadedImage) {
      try {
        setIsLoading(true);
        const formData = new FormData();
        const response = await fetch(uploadedImage);
        const blob = await response.blob();
        formData.append('image', blob, 'image.jpg');

        const featureResponse = await fetch('/api/extract-features', {
          method: 'POST',
          body: formData,
        });

        const data = await featureResponse.json();

        if (!featureResponse.ok) {
          throw new Error(data.error || 'Failed to extract features');
        }

        if (!data.features || !Array.isArray(data.features)) {
          console.error('Invalid response format:', data);
          throw new Error('Invalid response format from server');
        }

        setBlendDescription(data.features.join(', '));
      } catch (error) {
        console.error('Error extracting features:', error);
        alert('Failed to extract features: ' + (error instanceof Error ? error.message : String(error)));
      } finally{
        setIsLoading(false);
      }
    }
  };

  const handleGenerate = async () => {
    if (!uploadedImage) {
      alert('Please upload an image first');
      return;
    }

    try {
      setIsLoading(true);

      
      // Collect all text inputs to form the complete prompt
      const artStyle = document.querySelector('select')?.value || 'Photorealistic';
      
      // Get all enabled features and their modifications
      const enabledFeatures = extractedFeatures
        .filter(feature => feature.enabled && feature.modification)
        .map(feature => `${feature.name}: ${feature.modification}`)
        .join(', ');

      // Combine all descriptions into one prompt
      const fullPrompt = `${blendDescription}. Style: ${artStyle}. ${enabledFeatures}`.trim();
      
      console.log('Full Prompt:', fullPrompt);
      console.log('Denoising Steps:', denoisingSteps);
      console.log('Guidance Rate:', guidanceRate);

      // Prepare the image
      const formData = new FormData();
      const response = await fetch(uploadedImage);
      const blob = await response.blob();
      formData.append('image', blob);
      formData.append('prompt', fullPrompt);
      formData.append('steps', denoisingSteps.toString());
      formData.append('guidance', guidanceRate.toString());

      // Send to your API endpoint
      const generateResponse = await fetch('/api/generate-image', {
        method: 'POST',
        body: formData,
      });

      if (!generateResponse.ok) {
        const error = await generateResponse.json();
        throw new Error(error.message || 'Failed to generate image');
      }

      const result = await generateResponse.json();
      
      // Make sure we store both images in localStorage
      localStorage.setItem('originalImage', uploadedImage);
      localStorage.setItem('generatedImage', result.imagePath);
      
      // Generate a unique ID (you might want to get this from your API)
      const resultId = Date.now().toString();
      
      // Navigate to the results page
      window.location.href = `/generate/${resultId}`;

    } catch (error) {
      console.error('Generation error:', error);
      alert('Failed to generate image: ' + (error instanceof Error ? error.message : String(error)));
    } finally{
      setIsLoading(false);
    }
  };

  return (

    <div className="min-h-screen bg-gray-50 p-6 relative">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="flex flex-col items-center">
            <div className="loader mb-4 border-4 border-t-purple-600 border-gray-300 rounded-full w-12 h-12 animate-spin"></div>
            <p className="text-white text-lg">Processing...</p>
          </div>
        </div>
      )}

    <div className="min-h-screen bg-gray-50 p-6">
      {/* 头部 */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-purple-600 mb-2">Visual Blend AI</h1>
        <p className="text-gray-600">Create stunning visual blends using advanced AI technology</p>
      </div>

      <div className="flex gap-6">
        {/* 左侧面板 */}
        <div className="w-1/2 bg-white rounded-lg shadow p-6">
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-2">Create Your Blend</h2>
          </div>
          {/* 上传区域 */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6">
            {!uploadedImage ? (
              <>
                <div className="mb-4">📷</div>
                <p className="text-gray-600 mb-4">Drag and drop your image here</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 cursor-pointer">
                  Browse Files
                </label>
              </>
            ) : (
              <div>
                <img src={uploadedImage} alt="Uploaded" className="max-w-full h-auto rounded-md" />
              </div>
            )}
          </div>
          {/* 描述输入 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Overall Blend Description
            </label>
            <textarea 
              className="w-full p-3 border rounded-md"
              placeholder="Describe your overall desired effect..."
              rows={4}
              value={blendDescription}
              onChange={(e) => setBlendDescription(e.target.value)}
            />
          </div>
          {/* 风格选择 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Art Style
            </label>
            <select className="w-full p-2 border rounded-md">
              <option>Photorealistic</option>
              <option>Artistic</option>
              <option>Abstract</option>
              <option>Sketch</option>
            </select>
          </div>
          <button 
          onClick={handleGenerate}
          className="w-full bg-purple-600 text-white py-3 rounded-md hover:bg-purple-700">
            Generate Blend
          </button>
        </div>
        {/* 右侧面板 */}
        <div className="w-1/2 bg-white rounded-lg shadow p-6">
          <div className="mb-4">
            <h2 className="text-xl font-bold">Advanced Settings</h2>
          </div>
{/* 滑块控制 */}
<div className="mb-6 space-y-6">
  <div>
    <div className="flex justify-between items-center mb-2">
      <label className="text-sm font-medium text-gray-700">
        Denoising Steps (1-50)
      </label>
      <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
        {denoisingSteps}
      </span>
    </div>
    <input 
      type="range" 
      min="1" 
      max="50" 
      value={denoisingSteps}
      onChange={(e) => setDenoisingSteps(Number(e.target.value))}
      className="w-full"
    />
  </div>
  <div>
    <div className="flex justify-between items-center mb-2">
      <label className="text-sm font-medium text-gray-700">
        Guidance Rate (0-20)
      </label>
      <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
        {guidanceRate}
      </span>
    </div>
    <input 
      type="range" 
      min="0" 
      max="20" 
      step="0.1"
      value={guidanceRate}
      onChange={(e) => setGuidanceRate(Number(e.target.value))}
      className="w-full"
    />
  </div>
</div>
          {/* 特征控制 */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Extracted Features</h3>
              <button 
                onClick={handleExtractFeatures}
                className={`px-4 py-2 rounded-md ${
                  !uploadedImage
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                }`}
                disabled={!uploadedImage}
              >
                Extract Features
              </button>
            </div>
            <div className="space-y-4">
              {extractedFeatures.map((feature) => (
                <div key={feature.id} className="bg-gray-50 p-4 rounded-md">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{feature.name}</span>
                    <input
                      type="checkbox"
                      checked={feature.enabled}
                      onChange={() => handleFeatureToggle(feature.id)}
                    />
                  </div>
                  {feature.enabled && (
                    <textarea
                      className="w-full p-2 border rounded-md mt-2"
                      placeholder={`Describe how to modify ${feature.name.toLowerCase()}...`}
                      value={feature.modification}
                      onChange={(e) => handleModificationChange(feature.id, e.target.value)}
                      rows={2}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default VisualBlendAI;