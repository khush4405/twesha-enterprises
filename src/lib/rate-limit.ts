export interface RateLimitOptions {
  maxRequests: number;
  windowMs: number;
}

const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();

export function rateLimit(ip: string, options: RateLimitOptions) {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (record) {
    if (now > record.expiresAt) {
      // Window expired, reset
      rateLimitMap.set(ip, { count: 1, expiresAt: now + options.windowMs });
      return { success: true };
    }

    if (record.count >= options.maxRequests) {
      return { success: false };
    }

    record.count++;
    return { success: true };
  } else {
    // New IP
    rateLimitMap.set(ip, { count: 1, expiresAt: now + options.windowMs });
    return { success: true };
  }
}
