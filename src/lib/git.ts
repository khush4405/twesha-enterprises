import { exec } from "node:child_process";
import { promisify } from "node:util";

const execAsync = promisify(exec);

export async function getGitStatus() {
  try {
    const { stdout: branchOut } = await execAsync("git rev-parse --abbrev-ref HEAD");
    const { stdout: statusOut } = await execAsync("git status --porcelain=v1");

    const lines = statusOut.trim().split("\n").filter(Boolean);
    const staged: string[] = [];
    const unstaged: string[] = [];
    const untracked: string[] = [];

    for (const line of lines) {
      const indexStatus = line[0];
      const workTreeStatus = line[1];
      const filePath = line.substring(3).trim();

      if (indexStatus === "?" && workTreeStatus === "?") {
        untracked.push(filePath);
      } else {
        if (indexStatus !== " " && indexStatus !== "?") staged.push(filePath);
        if (workTreeStatus !== " " && workTreeStatus !== "?") unstaged.push(filePath);
      }
    }

    let lastCommit;
    try {
      const { stdout: logOut } = await execAsync("git log -1 --format='%h|%s|%cr'");
      const [hash, message, date] = logOut.replace(/'/g, "").trim().split("|");
      lastCommit = { hash, message, date };
    } catch {
      lastCommit = { hash: "none", message: "Initial", date: "never" };
    }

    return {
      isClean: lines.length === 0,
      branch: branchOut.trim(),
      staged,
      unstaged,
      untracked,
      lastCommit,
    };
  } catch (error: any) {
    throw new Error(`Git status query failed: ${error.message}`);
  }
}
