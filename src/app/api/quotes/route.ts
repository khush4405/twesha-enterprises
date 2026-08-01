import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { authGuard } from "@/lib/auth-guard";
import { z } from "zod";

const DATA_FILE = path.join(process.cwd(), "src", "data", "quotes.json");

const quoteSchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  company: z.string().optional(),
  phone: z.string().optional(),
  country: z.string().optional(),
  category: z.string().optional(),
  requirements: z.string().optional(),
  volume: z.string().optional()
}).passthrough();

export async function GET() {
  try {
    const auth = await authGuard();
    if (!auth.success) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    const data = fs.readFileSync(DATA_FILE, "utf-8");
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const quote = await request.json();
    const validation = quoteSchema.safeParse(quote);

    if (!validation.success) {
      return NextResponse.json({ success: false, message: 'Invalid data format.' }, { status: 400 });
    }
    
    // Read existing
    let quotes = [];
    try {
      const data = fs.readFileSync(DATA_FILE, "utf-8");
      quotes = JSON.parse(data);
    } catch (e) {
      // file might not exist, defaults to []
    }

    // Add new quote
    const newQuote = {
      ...validation.data,
      id: Date.now().toString(),
      date: new Date().toISOString()
    };
    
    quotes.push(newQuote);

    // Save
    fs.writeFileSync(DATA_FILE, JSON.stringify(quotes, null, 2));

    return NextResponse.json({ success: true, quote: newQuote });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to save quote" }, { status: 500 });
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

    if (!fs.existsSync(DATA_FILE)) {
      return NextResponse.json({ success: false, message: 'No quotes found' }, { status: 404 });
    }

    const content = fs.readFileSync(DATA_FILE, 'utf-8');
    const quotes = JSON.parse(content || "[]");
    
    const filtered = quotes.filter((q: any) => q.id !== id);
    fs.writeFileSync(DATA_FILE, JSON.stringify(filtered, null, 2), 'utf-8');

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to delete.' }, { status: 500 });
  }
}
