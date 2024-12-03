import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false, // 禁用默认 body 解析器以便处理文件流
  },
};

export async function POST(req: NextRequest) {
  try {
    const uploadDir = path.join(process.cwd(), 'public/uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const fileName = `${Date.now()}-uploaded.jpeg`;
    const filePath = path.join(uploadDir, fileName);

    const writableStream = fs.createWriteStream(filePath);
    const reader = req.body?.getReader();

    if (!reader) {
      return NextResponse.json({ error: 'No file found in request body' }, { status: 400 });
    }

    let done = false;
    while (!done) {
      const { value, done: streamDone } = await reader.read();
      if (value) writableStream.write(value);
      done = streamDone;
    }

    writableStream.end();

    // 返回文件路径供前端预览
    return NextResponse.json({
      success: true,
      filePath: `/uploads/${fileName}`,
    });
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
