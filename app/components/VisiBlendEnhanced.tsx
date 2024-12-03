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
  const [guidanceRate, setGuidanceRate] = useState(0.7);

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

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);     // 图片的文件对象
  
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedImage(URL.createObjectURL(file)); // 预览
      setUploadedFile(file);                      // 保存原始文件对象
    }
  };
  
  const handleSubmit = async () => {
    if (!uploadedFile) {
      alert('Please select a file before uploading.');
      return;
    }
  
    const formData = new FormData();
    formData.append('image', uploadedFile); // 确保传递的文件是 `File` 对象
  
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
  
      const data = await response.json();
      console.log('Upload response:', data);
    } catch (error) {
      console.error('Upload error:', error);
    }
    console.log([...formData.entries()]);

  };


  const handleExtractFeatures = async () => {
    if (uploadedFile) {
      const formData = new FormData();
      formData.append('image', uploadedFile);

      try {
        const response = await fetch('/api/extract-features', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (response.ok) {
          alert('File uploaded successfully! Features extracted: ' + data.features.join(', '));
        } else {
          throw new Error(data.error || 'Failed to extract features');
        }
      } catch (error) {
        console.error('Error extracting features:', error);
        alert('Failed to extract features');
      }
    } else {
      alert('Please upload an image first');
    }
  };

  const handleGenerate = async () => {
    if (!uploadedImage) {
      alert('Please upload an image first');
      return;
    }

    try {
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
      
      // Store the original and generated image paths in localStorage
      localStorage.setItem('originalImage', uploadedImage);
      localStorage.setItem('generatedImage', result.resultPath);
      
      // Navigate to the generate page using the existing pattern
      const resultId = 'generated-123';
      window.location.href = `/generate/${resultId}`;

    } catch (error) {
      console.error('Generation error:', error);
      alert('Failed to generate image: ' + (error instanceof Error ? error.message : String(error)));
    }
  };

  return (
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
          <div className="p-8">
      <h1 className="text-2xl mb-4">Upload and Extract Features</h1>
      <div className="space-y-4">
        <div>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
        </div>
        {uploadedImage && <img src={uploadedImage} alt="Preview" className="w-1/2 h-auto" />}
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Upload
        </button>
      </div>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Denoising Steps (1-50)
              </label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Guidance Rate (Temperature)
              </label>
              <input 
                type="range" 
                min="0" 
                max="1" 
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
                className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
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
  );
};

export default VisualBlendAI;