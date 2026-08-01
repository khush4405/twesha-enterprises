import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import { authGuard } from '@/lib/auth-guard';

const execAsync = promisify(exec);

export async function POST() {
  try {
    const auth = await authGuard();
    if (!auth.success) {
      return NextResponse.json({ success: false, message: auth.error }, { status: 401 });
    }

    const cwd = process.cwd();
    
    // Check if there are any changes in the masterContent.json or generally
    const { stdout: statusOut } = await execAsync('git status --porcelain', { cwd });
    
    if (!statusOut.trim()) {
      return NextResponse.json({ message: 'No changes to sync.' }, { status: 200 });
    }

    // Add changes
    await execAsync('git add src/data/masterContent.json', { cwd });
    
    // Commit changes
    await execAsync('git commit -m "CMS: Auto-sync JSON data to live site"', { cwd });
    
    // Push changes (This triggers Vercel deploy)
    // We assume the branch is main or whatever is checked out
    await execAsync('git push', { cwd });

    return NextResponse.json({ success: true, message: 'Synced to live site successfully!' }, { status: 200 });
  } catch (error: any) {
    console.error('Git sync error:', error);
    return NextResponse.json({ error: 'Failed to sync. Check server logs.' }, { status: 500 });
  }
}
