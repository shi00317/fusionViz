import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import prisma from '../../../lib/prisma';
import fs from 'fs';

export async function POST(request: Request) {
  try {
    console.log('Starting upload process...');
    
    const formData = await request.formData();
    const image = formData.get('image') as File;
    
    if (!image) {
      console.log('No image found in request');
      return NextResponse.json({ error: 'No image uploaded' }, { status: 400 });
    }

    // 创建 uploads 目录
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
      console.log('Created upload directory:', uploadDir);
    }

    // 保存图片
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `${Date.now()}-${image.name}`;
    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);
    console.log('File saved:', filePath);

    // 创建用户和项目记录
    const user = await prisma.user.create({
      data: {
        email: `user${Date.now()}@example.com`
      }
    });

    const project = await prisma.project.create({
      data: {
        userId: user.id,
        originalImage: `/uploads/${fileName}`,
        status: 'processing',
        parameters: {
          denoisingSteps: 25,
          guidanceRate: 0.7
        }
      }
    });

    return NextResponse.json({ 
      success: true, 
      projectId: project.id,
      imagePath: `/uploads/${fileName}`
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process upload',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
console.log('Upload route hit');
