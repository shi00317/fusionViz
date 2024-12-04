import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET(
  request: Request,
  { params }: { params: { path: string[] } }
) {
  try {
    const imagePath = path.join(process.cwd(), 'tmp', ...params.path);
    const imageBuffer = await readFile(imagePath);
    
    // Determine content type based on file extension
    const ext = path.extname(imagePath).toLowerCase();
    const contentType = ext === '.png' ? 'image/png' : 'image/jpeg';

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving image:', error);
    return new NextResponse('Image not found', { status: 404 });
  }
} 