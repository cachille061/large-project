import { z } from 'zod';
import { execSync } from 'node:child_process';

const schema = z.object({
  PORT: z.coerce.number().int().positive().default(3000)
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  console.error('Missing/invalid env vars:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

function version(cmd: string) {
  return execSync(cmd, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
}

try {
  const nodeV = version('node -v');
  const pnpmV = version('pnpm -v');
  console.log('Env OK');
  console.log('  Node :', nodeV);
  console.log('  pnpm :', pnpmV);
} catch {
  console.error('Failed to read tool versions');
  process.exit(1);
}
