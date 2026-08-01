import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { authGuard } from '@/lib/auth-guard';
import { z } from 'zod';

const enquirySchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  message: z.string().optional(),
  company: z.string().optional()
}).passthrough();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = enquirySchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json({ success: false, message: 'Invalid data format.' }, { status: 400 });
    }
    
    const dataPath = path.join(process.cwd(), 'src', 'data', 'enquiries.json');
    
    let enquiries = [];
    if (fs.existsSync(dataPath)) {
      const content = fs.readFileSync(dataPath, 'utf-8');
      enquiries = JSON.parse(content || "[]");
    }

    const newEnquiry = {
      id: Date.now().toString(),
      ...validation.data,
      date: new Date().toISOString()
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
    const auth = await authGuard();
    if (!auth.success) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

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

export async function DELETE(request: Request) {
  try {
    const auth = await authGuard();
    if (!auth.success) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'ID is required' }, { status: 400 });
    }

    const dataPath = path.join(process.cwd(), 'src', 'data', 'enquiries.json');
    if (!fs.existsSync(dataPath)) {
      return NextResponse.json({ success: false, message: 'No enquiries found' }, { status: 404 });
    }

    const content = fs.readFileSync(dataPath, 'utf-8');
    const enquiries = JSON.parse(content || "[]");
    
    const filtered = enquiries.filter((e: any) => e.id !== id);
    fs.writeFileSync(dataPath, JSON.stringify(filtered, null, 2), 'utf-8');

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to delete.' }, { status: 500 });
  }
}
