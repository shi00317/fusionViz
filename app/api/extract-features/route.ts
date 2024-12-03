import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { writeFile } from 'fs/promises';
import path from 'path';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const image = formData.get('image') as File;
    
    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    // Create a temporary file path
    const tempFilePath = path.join(process.cwd(), 'tmp', `${Date.now()}.jpg`);
    
    // Write the uploaded file to disk
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(tempFilePath, buffer);

    // Execute the Python script
    const { stdout, stderr } = await execAsync(
      `python gpt/featureExtract.py "${tempFilePath}"`
    );

    if (stderr) {
      console.error('Python script error:', stderr);
    }

    // Log the raw output for debugging
    console.log('Raw Python output:', stdout);

    // Clean the output and parse JSON
    const cleanedOutput = stdout.trim();
    console.log('Cleaned output:', cleanedOutput);

    try {
      const features = JSON.parse(cleanedOutput);
      
      // Check if we got an error from Python
      if (features.error) {
        throw new Error(features.error);
      }

      // Validate the features structure
      if (!features.features || !Array.isArray(features.features)) {
        throw new Error('Invalid features format');
      }

      return NextResponse.json(features);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.error('Failed to parse:', cleanedOutput);
      
      // Return a more detailed error response
      return NextResponse.json(
        {
          error: 'Failed to parse Python output',
          details: parseError.message,
          rawOutput: cleanedOutput
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error processing image:', error);
    return NextResponse.json(
      {
        error: 'Failed to process image',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 