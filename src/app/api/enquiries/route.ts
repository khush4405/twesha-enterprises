import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const dataPath = path.join(process.cwd(), 'src', 'data', 'enquiries.json');
    
    let enquiries = [];
    if (fs.existsSync(dataPath)) {
      const content = fs.readFileSync(dataPath, 'utf-8');
      enquiries = JSON.parse(content || "[]");
    }

    const newEnquiry = {
      id: Date.now().toString(),
      ...data
    };
    
    enquiries.push(newEnquiry);
    fs.writeFileSync(dataPath, JSON.stringify(enquiries, null, 2), 'utf-8');
    
    return NextResponse.json({ success: true, message: 'Enquiry submitted.' });
  } catch (error) {
    console.error('Error saving enquiry:', error);
    return NextResponse.json({ success: false, message: 'Failed to submit enquiry.' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const dataPath = path.join(process.cwd(), 'src', 'data', 'enquiries.json');
    let enquiries = [];
    if (fs.existsSync(dataPath)) {
      const content = fs.readFileSync(dataPath, 'utf-8');
      enquiries = JSON.parse(content || "[]");
    }
    return NextResponse.json(enquiries);
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to read enquiries.' }, { status: 500 });
  }
}
