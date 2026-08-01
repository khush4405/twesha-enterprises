import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { authGuard } from '@/lib/auth-guard';
import { z } from 'zod';

const contentSchema = z.object({
  hero: z.any().optional(),
  features: z.any().optional(),
  footer: z.any().optional(),
  products: z.any().optional(),
  applications: z.any().optional(),
  certificates: z.any().optional(),
  gallery: z.any().optional(),
  videos: z.any().optional(),
}).passthrough();

export async function POST(request: Request) {
  try {
    const auth = await authGuard();
    if (!auth.success) {
      return NextResponse.json({ success: false, message: auth.error }, { status: 401 });
    }

    const body = await request.json();
    const validation = contentSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ success: false, message: 'Invalid content format.' }, { status: 400 });
    }

    const dataPath = path.join(process.cwd(), 'src', 'data', 'masterContent.json');
    fs.writeFileSync(dataPath, JSON.stringify(validation.data, null, 2), 'utf-8');
    
    return NextResponse.json({ success: true, message: 'Content saved successfully.' });
  } catch (error) {
    console.error('Error saving content:', error);
    return NextResponse.json({ success: false, message: 'Failed to save content.' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const dataPath = path.join(process.cwd(), 'src', 'data', 'masterContent.json');
    const content = fs.readFileSync(dataPath, 'utf-8');
    return NextResponse.json(JSON.parse(content));
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to read content.' }, { status: 500 });
  }
}
