import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const image = formData.get('image') as File;
    const prompt = formData.get('prompt') as string;
    const steps = formData.get('steps') as string;
    const guidance = formData.get('guidance') as string;
    
    if (!image || !prompt) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create unique filename
    const timestamp = Date.now();
    const inputPath = path.join(process.cwd(), 'tmp', `input_${timestamp}.jpg`);
    
    // Write the uploaded file to disk
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(inputPath, buffer);

    // Execute the Python script
    const command = `python diffusion/img2img/img2img_web.py "${inputPath}" "${prompt}" ${steps} ${guidance}`;
    console.log('Executing command:', command);

    const { stdout, stderr } = await execAsync(command);

    if (stderr) {
      console.error('Python script error:', stderr);
    }

    // The output image path (based on the Python script's naming convention)
    const outputPath = inputPath.replace('.jpg', '_new.png');
    const filename = path.basename(outputPath);

    return NextResponse.json({ 
      imagePath: `/tmp/${filename}`,
      success: true
    });

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