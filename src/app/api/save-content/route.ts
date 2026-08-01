import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const dataPath = path.join(process.cwd(), 'src', 'data', 'masterContent.json');
    
    // In a real production app, validate `data` here before writing.
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8');
    
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
