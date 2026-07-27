import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "src", "data", "quotes.json");

export async function GET() {
  try {
    const data = fs.readFileSync(DATA_FILE, "utf-8");
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const quote = await request.json();
    
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
      ...quote,
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
