'use client'

export default function TestUpload() {
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      console.log('Upload response:', data);
      alert(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed');
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Test Image Upload</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Select Image:</label>
          <input 
            type="file" 
            name="image" 
            accept="image/*"
            className="border p-2"
          />
        </div>
        <button 
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Upload
        </button>
      </form>
    </div>
  );
}