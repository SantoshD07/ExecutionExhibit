interface Worker {
  workerId: string;
  iterationId: number;
  status: string;
  startedAt: string;
  vncPort?: number;  // Made optional
}

// Generate a deterministic ID based on index
export function generateDeterministicId(index: number): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  let num = index;

  // Convert number to base-36 style string
  for (let i = 0; i < 4; i++) {
    result = chars[num % chars.length] + result;
    num = Math.floor(num / chars.length);
  }

  return result.padStart(4, 'a');
}

export function generateMockWorkers(count: number): Worker[] {
  return Array.from({ length: count }, (_, index) => {
    // Use index to generate deterministic values
    const workerId = `w-${generateDeterministicId(index)}`;
    const iterationId = 100000 + (index * 1000); // Generates 100000, 101000, 102000, etc.

    // Calculate a consistent timestamp (24 hours ago + index-based offset)
    const hoursAgo = 24 - (index % 24); // Spreads workers across last 24 hours
    const startedAt = new Date(Date.now() - (hoursAgo * 3600000)).toISOString();

    // Every third worker won't have a VNC port
    const hasVnc = index % 3 !== 2;
    const vncPort = hasVnc ? 7900 + (index % 5) : undefined;

    return {
      workerId,
      iterationId,
      status: 'running',
      startedAt,
      ...(hasVnc && { vncPort })  // Only include vncPort if hasVnc is true
    };
  });
}