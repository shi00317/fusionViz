'use client'
import React, { useState } from 'react';

const VisualBlendAI = () => {
  // 状态管理
  const [extractedFeatures, setExtractedFeatures] = useState([
    { id: 1, name: 'Color Tone', enabled: true, modification: '' },
    { id: 2, name: 'Texture', enabled: true, modification: '' },
    { id: 3, name: 'Lighting', enabled: true, modification: '' },
  ]);

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
  const handleGenerate = async () => {
    // 假设这里处理生成逻辑并获得结果ID
    const resultId = 'generated-123';
    // 使用 Next.js 的路由导航到结果页面
    window.location.href = `/generate/${resultId}`;
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
            <div className="mb-4">📷</div>
            <p className="text-gray-600 mb-4">Drag and drop your image here</p>
            <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">
              Browse Files
            </button>
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
                defaultValue="25"
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
                defaultValue="0.7"
                className="w-full"
              />
            </div>
          </div>

          {/* 特征控制 */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Extracted Features</h3>
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